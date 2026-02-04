# SharePoint Framework (SPFx) Deployment Guide

## Overview

This React application is designed to be deployed as a SharePoint Framework (SPFx) Web Part, allowing it to run natively within SharePoint Online with Office 365 authentication and direct access to Excel files stored in SharePoint document libraries.

## Benefits of SPFx Deployment

✅ **No Extra Cost** - Included with Office 365/SharePoint Online subscriptions
✅ **Built-in Authentication** - Users automatically authenticated via their M365 accounts
✅ **Direct Excel Access** - Read Excel files from SharePoint libraries via Microsoft Graph API
✅ **Enterprise Security** - Leverages SharePoint's security and permissions
✅ **Seamless Integration** - Appears as native SharePoint content

## Excel File Structure

Your SharePoint document library should contain these Excel files:

### 1. StoresMaster.xlsx
**Sheet Name:** Stores

| Column | Type | Description |
|--------|------|-------------|
| StoreID | Text | Unique store identifier (e.g., S001) |
| StoreName | Text | Store name (e.g., Tantallon) |
| Region | Text | Region name (e.g., Nova Scotia) |

### 2. DailySalesPerformance.xlsx
**Sheet Name:** Sales

| Column | Type | Description |
|--------|------|-------------|
| Date | Date | Sale date |
| StoreID | Text | Store identifier |
| DayOfWeek | Text | Day name (Sunday-Saturday) |
| Week | Number | Week of year (1-52) |
| NetSales | Currency | Daily net sales |
| GPPercent | Percentage | Gross profit percentage |
| YTDNetSales | Currency | Year-to-date net sales |
| YTDGPPercent | Percentage | YTD gross profit % |
| LYNetSales | Currency | Last year net sales (same day) |
| LYGPPercent | Percentage | Last year GP% |
| LYYTDNetSales | Currency | Last year YTD sales |
| LYYTDGPPercent | Percentage | Last year YTD GP% |
| BasketSize | Currency | Average transaction value |

### 3. HourlySalesDetail.xlsx
**Sheet Name:** Hourly

| Column | Type | Description |
|--------|------|-------------|
| Date | Date | Sale date |
| StoreID | Text | Store identifier |
| Hour | Text | Hour of day (8am-8pm) |
| TotalSales | Currency | Total hourly sales |
| RetailSales | Currency | Retail customer sales |
| ProSales | Currency | Professional customer sales |
| LYSales | Currency | Last year same hour sales |
| Returns | Currency | Return amount |
| Visitors | Number | Store visitors |
| ConversionRate | Percentage | Conversion rate |

### 4. StoreKPIs.xlsx
**Sheet Name:** KPIs

| Column | Type | Description |
|--------|------|-------------|
| Metric | Text | KPI name |
| Value | Text | Current value |
| Trend | Text | "up", "down", or "neutral" |
| Percentage | Text | Change percentage |

### 5. RegionsMaster.xlsx
**Sheet Name:** Regions

| Column | Type | Description |
|--------|------|-------------|
| RegionID | Text | Region identifier |
| RegionName | Text | Full region name |

### 6. FiscalCalendar.xlsx
**Sheet Name:** Calendar

| Column | Type | Description |
|--------|------|-------------|
| Date | Date | Calendar date |
| Week | Number | Week of year |
| Month | Number | Month number |
| Quarter | Number | Quarter (1-4) |
| FiscalYear | Number | Fiscal year |

### 7. CustomerSales.xlsx
**Sheet Name:** Customers

| Column | Type | Description |
|--------|------|-------------|
| CustomerID | Text | Unique customer ID |
| CustomerName | Text | Customer name |
| CurrentYearSales | Currency | Current year sales |
| PreviousYearSales | Currency | Previous year sales |
| Status | Text | "Active", "Inactive", or "New" |

## SPFx Setup Steps

### Prerequisites

1. **Node.js** - v18 or v20 LTS (required for SPFx)
2. **Yeoman and SPFx Generator**
   ```bash
   npm install -g yo @microsoft/generator-sharepoint
   ```

### Step 1: Create SPFx Project

```bash
# Create new SPFx project
yo @microsoft/sharepoint

# Answer prompts:
# - Solution name: rona-atlantic-sales-dashboard
# - Target: SharePoint Online only
# - Folder: Use current folder
# - Component type: WebPart
# - Web part name: RONAAtlanticDashboard
# - Description: Sales analytics dashboard for RONA Atlantic stores
# - Framework: React
# - Tenant: Yes
```

### Step 2: Configure API Permissions

Edit `config/package-solution.json` to request Microsoft Graph permissions:

```json
{
  "solution": {
    "name": "rona-atlantic-sales-dashboard",
    "webApiPermissionRequests": [
      {
        "resource": "Microsoft Graph",
        "scope": "Sites.Read.All"
      },
      {
        "resource": "Microsoft Graph",
        "scope": "Files.Read.All"
      }
    ]
  }
}
```

### Step 3: Copy React Components

1. Copy all files from `/src/app/components/` to your SPFx project's `src/webparts/ronaAtlanticDashboard/components/` folder
2. Copy the service file `/src/app/services/excelSharePointService.ts` to `src/webparts/ronaAtlanticDashboard/services/`
3. Copy styles from `/src/styles/` to your SPFx project

### Step 4: Update Web Part to Use Microsoft Graph

Replace the default web part component with the App.tsx code, but modify the service imports to use actual Microsoft Graph client:

```typescript
// In your SPFx web part file
import { MSGraphClientV3 } from '@microsoft/sp-http';

export interface IRONAAtlanticDashboardProps {
  graphClient: MSGraphClientV3;
  siteUrl: string;
  libraryName: string;
}

// Update service functions to use real Graph client
export const getStoreSales = async (
  graphClient: MSGraphClientV3, 
  siteUrl: string,
  libraryName: string
): Promise<StoreSale[]> => {
  try {
    // Get file by path
    const fileResponse = await graphClient
      .api(`/sites/${siteUrl}/drive/root:/${libraryName}/StoresMaster.xlsx`)
      .get();
    
    const fileId = fileResponse.id;
    
    // Read Excel table
    const tableResponse = await graphClient
      .api(`/sites/${siteUrl}/drive/items/${fileId}/workbook/worksheets/Stores/usedRange`)
      .get();
    
    // Parse Excel data
    const rows = tableResponse.values.slice(1); // Skip header row
    return rows.map((row: any[]) => ({
      storeId: row[0],
      storeName: row[1],
      region: row[2],
      currentYearSales: row[3] || 0,
      previousYearSales: row[4] || 0,
      growth: row[5] || 0
    }));
  } catch (error) {
    console.error('Error reading Excel:', error);
    return [];
  }
};
```

### Step 5: Install Dependencies

```bash
# In your SPFx project folder
npm install lucide-react motion recharts date-fns
npm install @radix-ui/react-tooltip @radix-ui/react-dialog
```

### Step 6: Build and Deploy

```bash
# Build the solution
gulp build

# Bundle for production
gulp bundle --ship

# Package the solution
gulp package-solution --ship

# This creates a .sppkg file in sharepoint/solution/
```

### Step 7: Deploy to SharePoint

1. Go to your SharePoint App Catalog: `https://[tenant]-admin.sharepoint.com/sites/appcatalog`
2. Upload the `.sppkg` file to the "Apps for SharePoint" library
3. Click "Deploy" and trust the solution
4. Approve API permissions in SharePoint Admin Center:
   - Go to https://[tenant]-admin.sharepoint.com/_layouts/15/online/AdminHome.aspx
   - Navigate to "Advanced" > "API access"
   - Approve the Microsoft Graph permissions

### Step 8: Add Web Part to SharePoint Page

1. Navigate to your SharePoint site
2. Create a new page or edit existing page
3. Click "+" to add a web part
4. Search for "RONA Atlantic Dashboard"
5. Configure the web part properties (site URL, library name)

## Configuration

The web part should expose these properties for site admins:

```typescript
export interface IRONAAtlanticDashboardWebPartProps {
  siteUrl: string;          // SharePoint site URL
  libraryName: string;      // Document library name
  refreshInterval: number;  // Auto-refresh interval (minutes)
}
```

## Updating Excel Files

Users can update Excel files directly in SharePoint:

1. Navigate to the document library
2. Click on an Excel file to open in Excel Online
3. Edit data and save
4. Dashboard will reflect changes on next refresh

## Troubleshooting

### API Permission Issues
- Ensure API permissions are approved in SharePoint Admin Center
- Check that users have "Read" access to the document library

### Excel File Not Found
- Verify file names match exactly (case-sensitive)
- Ensure files are in the correct document library
- Check file paths in web part properties

### Data Not Displaying
- Open browser console (F12) to check for errors
- Verify Excel sheets have the correct sheet names
- Ensure Excel tables/ranges have data in expected format

## Performance Optimization

1. **Caching**: Implement client-side caching to reduce Graph API calls
2. **Pagination**: For large datasets, implement pagination
3. **Incremental Loading**: Load KPIs first, then detailed data
4. **Web Workers**: Process large Excel datasets in background threads

## Security Considerations

- ✅ Leverages SharePoint permissions - users only see data they have access to
- ✅ No exposed API keys or secrets
- ✅ Audit logs tracked through SharePoint
- ✅ Data never leaves your tenant

## Support

For SPFx-specific issues:
- [SharePoint Framework Documentation](https://docs.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview)
- [Microsoft Graph Excel API](https://docs.microsoft.com/graph/api/resources/excel)

For RONA Atlantic Dashboard issues:
- Check Excel file formats match specifications above
- Verify API permissions are correctly configured
- Review browser console for detailed error messages

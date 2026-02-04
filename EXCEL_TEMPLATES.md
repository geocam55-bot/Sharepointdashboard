# Excel File Templates for RONA Atlantic Dashboard

This document provides detailed templates for creating the Excel files that will be used in your SharePoint document library.

## Quick Setup

1. Create a SharePoint document library called "SalesData"
2. Create the 7 Excel files listed below
3. Format them as Tables (Insert > Table) for best Graph API compatibility
4. Upload to your SharePoint library
5. Deploy the SPFx web part and configure it to point to this library

---

## 1. StoresMaster.xlsx

**Purpose:** Master list of all store locations and their regions

**Sheet Name:** `Stores`

### Table Structure

| StoreID | StoreName      | Region                 |
|---------|----------------|------------------------|
| S001    | Tantallon      | Nova Scotia           |
| S002    | Almon          | Nova Scotia           |
| S003    | Elmsdale       | Nova Scotia           |
| S004    | Windmill       | Nova Scotia           |
| S005    | Charlottetown  | Prince Edward Island  |
| S006    | Moncton        | New Brunswick         |

**Column Definitions:**
- `StoreID` (Text): Unique identifier for each store
- `StoreName` (Text): Display name of the store
- `Region` (Text): Geographic region

**Excel Setup:**
1. Create new workbook
2. Rename Sheet1 to "Stores"
3. Add headers in row 1
4. Enter store data starting row 2
5. Select all data (Ctrl+A)
6. Insert > Table > Create Table with headers
7. Name the table "StoresTable" (Table Design > Table Name)

---

## 2. DailySalesPerformance.xlsx

**Purpose:** Daily sales metrics for each store

**Sheet Name:** `Sales`

### Table Structure

| Date       | StoreID | DayOfWeek  | Week | NetSales | GPPercent | YTDNetSales | YTDGPPercent | LYNetSales | LYGPPercent | LYYTDNetSales | LYYTDGPPercent | BasketSize |
|------------|---------|------------|------|----------|-----------|-------------|--------------|------------|-------------|---------------|----------------|------------|
| 2024-01-14 | S001    | Sunday     | 2    | 5234.50  | 28.5%     | 156234.00   | 29.2%        | 4892.30    | 27.8%       | 148923.00     | 28.5%          | 52.30      |
| 2024-01-15 | S001    | Monday     | 2    | 7821.00  | 30.1%     | 164055.00   | 29.3%        | 7234.50    | 28.9%       | 156157.50     | 28.6%          | 58.45      |

**Column Definitions:**
- `Date` (Date): Transaction date (format: YYYY-MM-DD)
- `StoreID` (Text): Store identifier (links to StoresMaster)
- `DayOfWeek` (Text): Sunday through Saturday
- `Week` (Number): Week of year (1-52)
- `NetSales` (Currency): Total daily sales net of returns
- `GPPercent` (Percentage): Gross profit percentage
- `YTDNetSales` (Currency): Year-to-date cumulative sales
- `YTDGPPercent` (Percentage): Year-to-date gross profit %
- `LYNetSales` (Currency): Last year same day sales
- `LYGPPercent` (Percentage): Last year same day GP%
- `LYYTDNetSales` (Currency): Last year YTD sales (at this point)
- `LYYTDGPPercent` (Percentage): Last year YTD GP%
- `BasketSize` (Currency): Average transaction value

**Data Generation Tips:**
- Create entries for 7 days per week per store
- Week number can be calculated: `=WEEKNUM(A2)`
- YTD values are cumulative sums
- Include current year and at least one prior year

---

## 3. HourlySalesDetail.xlsx

**Purpose:** Hourly breakdown of sales by type

**Sheet Name:** `Hourly`

### Table Structure

| Date       | StoreID | Hour  | TotalSales | RetailSales | ProSales | LYSales | Returns | Visitors | ConversionRate |
|------------|---------|-------|------------|-------------|----------|---------|---------|----------|----------------|
| 2024-01-14 | S001    | 8am   | 452.30     | 320.50      | 131.80   | 412.00  | 18.50   | 42       | 24.5%          |
| 2024-01-14 | S001    | 9am   | 678.90     | 445.20      | 233.70   | 623.40  | 28.30   | 58       | 28.2%          |
| 2024-01-14 | S001    | 10am  | 892.40     | 601.30      | 291.10   | 834.20  | 35.60   | 67       | 31.5%          |

**Column Definitions:**
- `Date` (Date): Transaction date
- `StoreID` (Text): Store identifier
- `Hour` (Text): Hour of day (8am, 9am, 10am... 8pm)
- `TotalSales` (Currency): Total hourly sales
- `RetailSales` (Currency): Consumer/retail customer sales
- `ProSales` (Currency): Professional/contractor sales
- `LYSales` (Currency): Last year same hour sales
- `Returns` (Currency): Return amount for this hour
- `Visitors` (Number): Store traffic count
- `ConversionRate` (Percentage): Sales conversion rate

**Data Generation Tips:**
- Typical store hours: 8am to 8pm (13 hours)
- RetailSales + ProSales should equal TotalSales
- Peak hours usually 12pm-1pm and 5pm-6pm

---

## 4. StoreKPIs.xlsx

**Purpose:** High-level key performance indicators

**Sheet Name:** `KPIs`

### Table Structure

| Metric           | Value    | Trend   | Percentage |
|------------------|----------|---------|------------|
| Total Revenue    | $4.2M    | up      | +12.5%     |
| Avg Order Value  | $345     | up      | +4.2%      |
| Active Customers | 1,234    | down    | -2.1%      |
| Conversion Rate  | 3.2%     | neutral | 0.0%       |

**Column Definitions:**
- `Metric` (Text): KPI name
- `Value` (Text): Formatted value (include $ or % in the string)
- `Trend` (Text): Must be "up", "down", or "neutral"
- `Percentage` (Text): Change percentage (include + or -)

**Common KPIs to Track:**
- Total Revenue
- Average Order Value
- Active Customers
- Conversion Rate
- Foot Traffic
- Year-over-Year Growth
- Customer Satisfaction Score
- Inventory Turnover

---

## 5. RegionsMaster.xlsx

**Purpose:** Master list of regions

**Sheet Name:** `Regions`

### Table Structure

| RegionID | RegionName            |
|----------|-----------------------|
| NS       | Nova Scotia          |
| PEI      | Prince Edward Island |
| NB       | New Brunswick        |

**Column Definitions:**
- `RegionID` (Text): Short region code
- `RegionName` (Text): Full region name

---

## 6. FiscalCalendar.xlsx

**Purpose:** Maps calendar dates to fiscal periods

**Sheet Name:** `Calendar`

### Table Structure

| Date       | Week | Month | Quarter | FiscalYear |
|------------|------|-------|---------|------------|
| 2024-01-01 | 1    | 1     | 1       | 2024       |
| 2024-01-02 | 1    | 1     | 1       | 2024       |
| 2024-01-03 | 1    | 1     | 1       | 2024       |

**Column Definitions:**
- `Date` (Date): Calendar date
- `Week` (Number): Week of fiscal year (1-52)
- `Month` (Number): Month of fiscal year (1-12)
- `Quarter` (Number): Quarter (1-4)
- `FiscalYear` (Number): Fiscal year

**Excel Formulas:**
- Week: `=WEEKNUM(A2)`
- Month: `=MONTH(A2)`
- Quarter: `=ROUNDUP(MONTH(A2)/3,0)`
- FiscalYear: `=YEAR(A2)` (or custom logic if fiscal year differs)

**Setup Tips:**
- Create entries for at least 2 full years (current + previous)
- Ensure continuous date range with no gaps
- Update annually for new fiscal year

---

## 7. CustomerSales.xlsx

**Purpose:** Customer-level sales tracking

**Sheet Name:** `Customers`

### Table Structure

| CustomerID | CustomerName        | CurrentYearSales | PreviousYearSales | Status   |
|------------|---------------------|------------------|-------------------|----------|
| CUST-100   | Customer A          | 45,230.00        | 38,450.00         | Active   |
| CUST-101   | Customer B          | 32,100.00        | 42,800.00         | Inactive |
| CUST-102   | Customer C          | 18,900.00        | 0.00              | New      |

**Column Definitions:**
- `CustomerID` (Text): Unique customer identifier
- `CustomerName` (Text): Customer display name
- `CurrentYearSales` (Currency): Sales YTD current year
- `PreviousYearSales` (Currency): Sales same period last year
- `Status` (Text): Must be "Active", "Inactive", or "New"

**Status Definitions:**
- **Active**: Purchased in current period
- **Inactive**: No purchases in current period but has history
- **New**: First purchase in current year

---

## Excel Best Practices for SharePoint

### 1. Use Tables, Not Ranges
Always format data as Excel Tables (Insert > Table):
- Better for Microsoft Graph API
- Automatic range expansion
- Easier filtering and sorting

### 2. Name Your Tables
Give each table a meaningful name:
- Right-click table > Table > Table Name
- Use names like "StoresTable", "SalesTable", etc.

### 3. Use Consistent Data Types
- Dates: Use proper Excel date format (YYYY-MM-DD)
- Currency: Format as Currency with 2 decimals
- Percentages: Format as Percentage
- Text: Keep as General or Text

### 4. No Merged Cells
- Merged cells break Excel API access
- Keep all cells independent

### 5. Headers in First Row
- Always have column headers in row 1
- Use clear, descriptive names
- No special characters except underscores

### 6. No Empty Rows or Columns
- Remove any blank rows within data
- Keep data contiguous

### 7. Lock Headers (Optional)
- Freeze top row for easier editing
- View > Freeze Panes > Freeze Top Row

---

## Updating Data in SharePoint

### Option 1: Edit in Excel Online
1. Navigate to SharePoint document library
2. Click Excel file name
3. Edit directly in browser
4. Changes save automatically

### Option 2: Edit in Desktop Excel
1. Click "Open in Desktop App"
2. Edit file
3. Save (automatically syncs to SharePoint)

### Option 3: Upload New Version
1. Edit file locally
2. Upload to SharePoint
3. Choose "Replace" when prompted

---

## Power Automate Integration (Optional)

For automated data updates, consider using Power Automate:

1. **Scheduled Refresh**: Run SQL query and write to Excel
2. **Email Triggers**: Parse email reports and update Excel
3. **API Integration**: Pull data from other systems

Example Flow:
```
Trigger: Recurrence (Daily at 6am)
→ Action: Run SQL query
→ Action: Clear Excel table rows
→ Action: Add rows to Excel table
```

---

## Troubleshooting

### Graph API Can't Find File
- Verify file is in correct library
- Check file name spelling (case-sensitive)
- Ensure file isn't checked out

### Data Not Displaying Correctly
- Check column names match exactly
- Verify data types are correct
- Look for merged cells or empty rows

### Performance Issues
- Limit table size to reasonable amounts
- Archive old data to separate files
- Use indexed columns where possible

---

## Sample Data Volumes

Recommended maximum rows per file:
- **StoresMaster**: 50-100 stores
- **DailySalesPerformance**: 10,000 rows (≈3 years of daily data for 10 stores)
- **HourlySalesDetail**: 100,000 rows (≈2 years for 10 stores)
- **StoreKPIs**: 20-50 KPIs
- **RegionsMaster**: 10-20 regions
- **FiscalCalendar**: 1,500 rows (≈4 years)
- **CustomerSales**: 5,000-10,000 customers

For larger datasets, consider:
- Archiving old data
- Using SharePoint Lists instead
- Implementing a proper database backend

---

## Security Considerations

### Permissions
- Document library: Read access for dashboard users
- Edit access only for data administrators
- Use SharePoint groups for easier management

### Sensitive Data
- Avoid storing PII in Excel files
- Use customer IDs instead of names where possible
- Consider column-level encryption for sensitive data

### Audit Logging
- Enable versioning on document library
- Track who modifies Excel files
- Regular backup strategy

---

## Next Steps

1. ✅ Create SharePoint document library "SalesData"
2. ✅ Create the 7 Excel files using templates above
3. ✅ Format as Tables and name appropriately
4. ✅ Upload to SharePoint library
5. ✅ Deploy SPFx web part (see SPFX_DEPLOYMENT_GUIDE.md)
6. ✅ Configure web part to connect to library
7. ✅ Test data refresh and filtering
8. ✅ Train users on updating Excel files

---

## Support Resources

- **Excel Tables**: https://support.microsoft.com/office/overview-of-excel-tables-7ab0bb7d-3a9e-4b56-a3c9-6c94334e492c
- **SharePoint Permissions**: https://support.microsoft.com/office/understanding-permission-levels-in-sharepoint-87ecbb0e-6550-491a-8826-c075e4859848
- **Microsoft Graph Excel API**: https://learn.microsoft.com/graph/api/resources/excel

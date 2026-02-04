# RONA Atlantic Sales Dashboard

A responsive React and Tailwind CSS web application for visualizing sales data from Excel files stored in SharePoint, designed to be deployed as a SharePoint Framework (SPFx) web part.

## 📊 Overview

This dashboard provides comprehensive sales analytics for RONA Atlantic stores across Nova Scotia, Prince Edward Island, and New Brunswick, featuring:

- **Store Sales Dashboard**: Weekly performance with filters for Week, Store, and Region
- **Daily Metrics Table**: Net Sales, GP%, YTD comparisons, and YoY data
- **Hourly Drill-Down**: Detailed breakdowns including Retail vs Professional sales, returns, and last year comparisons
- **Customer Insights**: Customer sales tracking and performance
- **Responsive Design**: Optimized for desktop and mobile devices

## 🎯 Key Features

✅ **Excel-Based Data**: Read data from familiar Excel files in SharePoint
✅ **Zero Cost Deployment**: Completely FREE when deployed to SharePoint (included in Office 365)
✅ **Built-in Authentication**: Leverages Office 365 single sign-on
✅ **Mobile Responsive**: Hamburger menu, collapsible filters, sticky table columns
✅ **Interactive Charts**: Colorful bar charts with indigo theme
✅ **Drill-Down Modals**: Click any day to see hourly performance details

## 💰 Cost

**$0/month** - Completely included with Office 365/Microsoft 365 subscriptions

No Azure required, no additional licenses needed!

## 🚀 Quick Start

### Prerequisites

- Office 365/Microsoft 365 subscription with SharePoint Online
- Node.js v18 or v20 LTS
- Basic knowledge of SharePoint and Excel

### 1. Review Documentation

Start here to understand the architecture:

| Document | Purpose | Read Time |
|----------|---------|-----------|
| 📖 `QUICK_REFERENCE.md` | High-level overview and checklist | 10 min |
| 📊 `EXCEL_TEMPLATES.md` | Excel file structure and templates | 20 min |
| 🚀 `SPFX_DEPLOYMENT_GUIDE.md` | Step-by-step deployment instructions | 30 min |
| ⚖️ `DEPLOYMENT_COMPARISON.md` | Compare deployment options | 15 min |

### 2. Create Excel Files

Follow the templates in `EXCEL_TEMPLATES.md` to create:

- StoresMaster.xlsx
- DailySalesPerformance.xlsx
- HourlySalesDetail.xlsx
- StoreKPIs.xlsx
- RegionsMaster.xlsx
- FiscalCalendar.xlsx
- CustomerSales.xlsx

Upload these to a SharePoint document library (e.g., "SalesData").

### 3. Deploy to SharePoint

Follow the complete guide in `SPFX_DEPLOYMENT_GUIDE.md`:

```bash
# Install SPFx generator
npm install -g yo @microsoft/generator-sharepoint

# Create SPFx project
yo @microsoft/sharepoint

# Copy React components from this project
# Update service layer for Microsoft Graph API
# Build and deploy
```

**Deployment Time:** ~3.5 hours (first time)

## 📁 Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── App.tsx                          # Main application component
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── KPICard.tsx             # KPI metric cards
│   │   │   │   ├── StoreSalesChart.tsx     # Bar chart component
│   │   │   │   ├── StorePerformanceTable.tsx # Daily data table
│   │   │   │   ├── DayDetailModal.tsx      # Hourly drill-down modal
│   │   │   │   └── CustomerSalesList.tsx   # Customer data table
│   │   │   └── ui/                         # Reusable UI components
│   │   └── services/
│   │       └── excelSharePointService.ts   # Excel data service layer
│   └── styles/
│       ├── index.css
│       ├── tailwind.css
│       ├── theme.css
│       └── fonts.css
├── QUICK_REFERENCE.md                      # Quick start guide
├── EXCEL_TEMPLATES.md                      # Excel file templates
├── SPFX_DEPLOYMENT_GUIDE.md               # Deployment instructions
├── DEPLOYMENT_COMPARISON.md               # Compare deployment options
└── SHAREPOINT_LISTS_DOCUMENTATION.md      # Original lists design (reference)
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│   SharePoint Document Library          │
│   (Excel files: Stores, Sales, etc.)   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Microsoft Graph API                │
│      (Excel REST API endpoints)         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   SharePoint Framework Web Part         │
│   (React + Tailwind CSS)                │
│   - Store Dashboard                     │
│   - Customer Insights                   │
│   - KPI Cards                           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   SharePoint Online Page                │
│   (Accessed by Office 365 users)       │
└─────────────────────────────────────────┘
```

## 🎨 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animation**: Motion (Framer Motion)
- **UI Components**: Radix UI
- **Data Source**: Excel files via Microsoft Graph API
- **Hosting**: SharePoint Framework (SPFx)
- **Authentication**: Office 365 SSO

## 📊 Data Sources

### Excel Files Structure

The dashboard reads from 7 Excel files in SharePoint:

1. **StoresMaster.xlsx**: Store locations and regions
2. **DailySalesPerformance.xlsx**: Daily sales metrics with YoY comparisons
3. **HourlySalesDetail.xlsx**: Hourly breakdown (Retail vs Pro sales)
4. **StoreKPIs.xlsx**: Dashboard KPI metrics
5. **RegionsMaster.xlsx**: List of regions
6. **FiscalCalendar.xlsx**: Fiscal week/period mapping
7. **CustomerSales.xlsx**: Customer-level sales data

📖 **See `EXCEL_TEMPLATES.md` for detailed structure and samples**

## 🔐 Security

- ✅ Data stays within your Office 365 tenant
- ✅ Leverages SharePoint permissions (users see only what they're authorized to view)
- ✅ No exposed API keys or credentials
- ✅ Audit logs tracked through SharePoint
- ✅ Uses Microsoft Graph API with proper OAuth scopes

**Note:** This solution is designed for internal business analytics, not for storing highly sensitive PII or financial data requiring special compliance.

## 📱 Mobile Support

The dashboard is fully responsive with mobile optimizations:

- Collapsible sidebar navigation
- Hamburger menu for mobile
- Sticky table headers and first column
- Touch-friendly filter controls
- Responsive charts and KPI cards

## 🔧 Development

### Current Environment (Figma Make)

This is a prototype/development version using mock data:

```bash
# Already configured in Figma Make environment
# Mock data in: /src/app/services/excelSharePointService.ts
```

### For SPFx Development

When migrating to SPFx:

1. Create SPFx project with React
2. Copy `/src/app/components` to SPFx project
3. Update service layer to use `MSGraphClientV3`
4. Add Microsoft Graph API permissions
5. Build and deploy

📖 **See `SPFX_DEPLOYMENT_GUIDE.md` for complete steps**

## 📈 Performance

Expected performance metrics:

- Initial load: 2-3 seconds
- Filter changes: 1-2 seconds  
- Excel API calls: 500ms - 2s
- Hourly drill-down: <500ms

Optimizations:
- Client-side data caching
- Lazy loading for detailed views
- Optimized Excel table queries

## 🆘 Troubleshooting

### Common Issues

**Issue**: "Cannot find Excel file"
- ✅ Check file names (case-sensitive)
- ✅ Verify SharePoint library name
- ✅ Ensure user has Read access

**Issue**: "API permissions not granted"
- ✅ Go to SharePoint Admin Center
- ✅ Navigate to API access
- ✅ Approve Microsoft Graph permissions

**Issue**: "Data not refreshing"
- ✅ Hard refresh browser (Ctrl+Shift+R)
- ✅ Check Excel file last modified date
- ✅ Clear browser cache

📖 **See `QUICK_REFERENCE.md` for more troubleshooting tips**

## 📚 Documentation Index

| Document | Description |
|----------|-------------|
| `README.md` | This file - project overview |
| `QUICK_REFERENCE.md` | Quick start guide and cheat sheet |
| `EXCEL_TEMPLATES.md` | Excel file templates with column definitions |
| `SPFX_DEPLOYMENT_GUIDE.md` | Complete SharePoint Framework deployment guide |
| `DEPLOYMENT_COMPARISON.md` | Compare SPFx vs Azure vs Power Apps options |
| `SHAREPOINT_LISTS_DOCUMENTATION.md` | Original Lists design (kept for reference) |

## 🎯 Use Cases

This dashboard is ideal for:

- ✅ Multi-location retail sales analytics
- ✅ Weekly performance tracking
- ✅ Store comparisons and rankings
- ✅ YoY growth analysis
- ✅ Customer sales tracking
- ✅ Hourly sales patterns
- ✅ Retail vs Professional sales mix

## 🚫 Not Suitable For

This approach may not be ideal if you:

- ❌ Need to handle millions of rows (Excel has limits)
- ❌ Require real-time streaming data
- ❌ Need complex multi-user simultaneous editing
- ❌ Have highly sensitive PII requiring special compliance
- ❌ Don't have Office 365/Microsoft 365

**Alternative**: Consider SharePoint Lists or dedicated database for these scenarios.

## 🔮 Future Enhancements

Potential additions (not yet implemented):

- Export to PDF/Excel
- Email report scheduling
- Advanced date range filters
- Product-level drill-down
- Budget vs Actual comparisons
- Power BI embedded reports
- Teams notifications
- Mobile app (Power Apps)

## 🤝 Support

### Resources

- **SPFx Docs**: https://aka.ms/spfx
- **Microsoft Graph**: https://aka.ms/graph-excel
- **Excel API**: https://learn.microsoft.com/graph/api/resources/excel

### Getting Help

1. Check documentation files in this project
2. Review browser console for errors (F12)
3. Verify Excel file structure matches templates
4. Confirm API permissions are approved
5. Test with different user accounts

## 📄 License

This project is created with Figma Make for use with Office 365/Microsoft 365 environments.

## 👥 Contributors

- Built with Figma Make
- Designed for RONA Atlantic stores
- Optimized for Office 365 deployment

---

**Last Updated:** February 4, 2026
**Version:** 1.0
**Status:** Ready for SPFx deployment

🚀 **Ready to deploy?** Start with `QUICK_REFERENCE.md`!

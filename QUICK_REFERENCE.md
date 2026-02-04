# RONA Atlantic Dashboard - Quick Reference Guide

## 🎯 Project Overview

**Application:** Sales analytics dashboard for RONA Atlantic stores
**Data Source:** Excel files stored in SharePoint Online
**Hosting:** SharePoint Framework (SPFx) Web Part
**Cost:** FREE (included with Office 365/Microsoft 365)

---

## 📊 Architecture

```
SharePoint Document Library (Excel Files)
          ↓
Microsoft Graph API (Excel REST API)
          ↓
SharePoint Framework Web Part (React App)
          ↓
SharePoint Online Page
          ↓
Office 365 Users (Auto-authenticated)
```

---

## 📁 Required Excel Files

Your SharePoint library needs these 7 Excel files:

| File Name | Purpose | Key Columns |
|-----------|---------|-------------|
| `StoresMaster.xlsx` | Store locations | StoreID, StoreName, Region |
| `DailySalesPerformance.xlsx` | Daily sales metrics | Date, StoreID, NetSales, GPPercent, YTD data |
| `HourlySalesDetail.xlsx` | Hourly breakdown | Date, StoreID, Hour, RetailSales, ProSales |
| `StoreKPIs.xlsx` | Dashboard KPIs | Metric, Value, Trend, Percentage |
| `RegionsMaster.xlsx` | Region list | RegionID, RegionName |
| `FiscalCalendar.xlsx` | Date mapping | Date, Week, Month, Quarter, FiscalYear |
| `CustomerSales.xlsx` | Customer data | CustomerID, CustomerName, Sales, Status |

📖 **Full details:** See `EXCEL_TEMPLATES.md`

---

## 🚀 Deployment Steps

### 1️⃣ Prepare Excel Files (15 minutes)
- Create Excel files from templates (see EXCEL_TEMPLATES.md)
- Format as Tables (Insert > Table)
- Upload to SharePoint document library

### 2️⃣ Setup SPFx Project (30 minutes)
```bash
# Install prerequisites
npm install -g yo @microsoft/generator-sharepoint

# Create SPFx project
yo @microsoft/sharepoint
```

### 3️⃣ Copy React Components (15 minutes)
- Copy `/src/app/components/` → SPFx project
- Copy `/src/app/services/excelSharePointService.ts`
- Update service to use real Microsoft Graph client

### 4️⃣ Configure API Permissions (5 minutes)
Edit `config/package-solution.json`:
```json
{
  "webApiPermissionRequests": [
    { "resource": "Microsoft Graph", "scope": "Sites.Read.All" },
    { "resource": "Microsoft Graph", "scope": "Files.Read.All" }
  ]
}
```

### 5️⃣ Build & Deploy (10 minutes)
```bash
gulp bundle --ship
gulp package-solution --ship
# Upload .sppkg to SharePoint App Catalog
```

### 6️⃣ Approve Permissions (5 minutes)
- Go to SharePoint Admin Center
- Navigate to API access
- Approve Microsoft Graph permissions

### 7️⃣ Add to SharePoint Page (5 minutes)
- Create/edit SharePoint page
- Add "RONA Atlantic Dashboard" web part
- Configure site URL and library name

📖 **Full details:** See `SPFX_DEPLOYMENT_GUIDE.md`

**Total Time:** ~90 minutes

---

## 💰 Cost Breakdown

| Component | Cost | Notes |
|-----------|------|-------|
| **SharePoint Online** | Included in M365 | Already have it |
| **SPFx Hosting** | FREE | Built into SharePoint |
| **Microsoft Graph API** | FREE | No per-call charges |
| **Excel Storage** | Included in M365 | Part of OneDrive/SharePoint quota |
| **Authentication** | FREE | Uses existing M365 SSO |
| **Azure Hosting** | NOT NEEDED | ✅ No Azure required! |

**Total Cost:** $0/month (if you already have Office 365)

---

## ✅ Advantages of This Approach

### vs. Azure Static Web Apps
| Feature | SPFx | Azure Static Web Apps |
|---------|------|----------------------|
| Cost | FREE | Free tier limited |
| Authentication | Built-in | Must configure |
| Excel Access | Direct | Needs backend |
| SharePoint Integration | Native | Custom code |
| User Management | Automatic | Manual setup |

### vs. SharePoint Lists
| Feature | Excel Files | SharePoint Lists |
|---------|-------------|------------------|
| Familiar Interface | ✅ Excel | ❌ Web forms |
| Formulas | ✅ Full Excel | ⚠️ Limited |
| Bulk Updates | ✅ Easy | ❌ Tedious |
| Version History | ✅ Yes | ✅ Yes |
| API Access | ✅ Graph API | ✅ REST API |

---

## 🔧 Data Maintenance

### How to Update Sales Data

**Option 1: Excel Online (Recommended)**
1. Navigate to SharePoint library
2. Click Excel file
3. Edit in browser
4. Auto-saves

**Option 2: Desktop Excel**
1. Open file from SharePoint
2. Edit in Excel desktop
3. Save (syncs automatically)

**Option 3: Power Automate**
- Schedule daily data refresh
- Pull from SQL/ERP system
- Write to Excel via Graph API

### Refresh Dashboard
- Data updates reflect immediately
- No manual refresh needed
- Users see latest data on page load

---

## 🎨 Dashboard Features

### Current Features
✅ **Store Sales Dashboard**
- Filter by Week, Region, Store
- Daily performance table
- YTD vs Last Year comparisons
- Hourly drill-down modal

✅ **Overview Dashboard**
- 4 KPI cards with trends
- Store sales bar chart
- Customer list table

✅ **Customer Insights**
- Customer sales table
- Status indicators
- YoY growth calculations

✅ **Responsive Design**
- Mobile-friendly
- Collapsible filters
- Hamburger menu

### Mobile Optimizations
- Sticky table columns
- Collapsible filters
- Touch-friendly UI
- Responsive charts

---

## 🔐 Security & Permissions

### User Access Control
- Leverages SharePoint permissions
- Users see only what they're authorized to view
- No additional authentication needed

### Data Security
✅ Data stays in your tenant
✅ No external APIs or services
✅ Audit logs via SharePoint
✅ No exposed credentials
❌ Not suitable for highly sensitive PII

### Recommended Permissions
| Role | Permission Level | Access |
|------|-----------------|---------|
| **Viewers** | Read | Can view dashboard |
| **Data Entry** | Contribute | Can edit Excel files |
| **Admins** | Full Control | Can configure everything |

---

## 📈 Performance Tips

### Optimize Excel Files
- Keep tables under recommended row limits
- Archive old data periodically
- Remove unnecessary columns
- Use indexed columns

### Optimize Dashboard
- Implement client-side caching
- Lazy load detailed data
- Paginate large datasets
- Use Web Workers for heavy processing

### Expected Performance
- Initial load: 2-3 seconds
- Filter change: 1-2 seconds
- Excel file read: 500ms - 2s
- Hourly drill-down: <500ms

---

## 🐛 Common Issues

### "Cannot find Excel file"
**Cause:** File path incorrect or permissions issue
**Fix:** 
- Verify file name spelling (case-sensitive)
- Check SharePoint library name
- Ensure user has Read access

### "API permissions not granted"
**Cause:** Graph API permissions pending
**Fix:**
- Go to SharePoint Admin Center
- Advanced > API access
- Approve pending requests

### "Data not refreshing"
**Cause:** Browser cache or Excel not saving
**Fix:**
- Hard refresh browser (Ctrl+Shift+R)
- Check Excel file last modified date
- Clear browser cache

### "Graph API errors"
**Cause:** Table structure mismatch
**Fix:**
- Verify column names match exactly
- Check table is properly formatted
- Ensure no merged cells or empty rows

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `SPFX_DEPLOYMENT_GUIDE.md` | Complete SPFx deployment instructions |
| `EXCEL_TEMPLATES.md` | Excel file templates and structure |
| `QUICK_REFERENCE.md` | This file - overview and cheat sheet |
| `SHAREPOINT_LISTS_DOCUMENTATION.md` | Original SharePoint Lists design (for reference) |

---

## 🤝 Getting Help

### Self-Service Resources
- **SPFx Documentation**: https://aka.ms/spfx
- **Microsoft Graph Excel API**: https://aka.ms/graph-excel
- **Excel Online**: https://support.microsoft.com/excel

### Troubleshooting Steps
1. Check browser console (F12) for errors
2. Verify Excel file structure matches templates
3. Confirm API permissions are approved
4. Test with different user accounts
5. Check SharePoint admin center for issues

---

## 🎯 Next Actions

### Immediate (This Week)
- [ ] Create SharePoint document library "SalesData"
- [ ] Generate Excel files from templates
- [ ] Upload sample data to Excel files
- [ ] Test Excel files in SharePoint

### Short-term (Next 2 Weeks)
- [ ] Setup SPFx development environment
- [ ] Create SPFx project scaffolding
- [ ] Copy React components to SPFx
- [ ] Update service layer for Graph API
- [ ] Test locally with dev tenant

### Medium-term (Next Month)
- [ ] Deploy to production SharePoint
- [ ] Train users on dashboard
- [ ] Train data administrators on Excel updates
- [ ] Setup Power Automate for automated updates
- [ ] Monitor usage and gather feedback

---

## 💡 Future Enhancements

### Potential Additions
- Export to PDF/Excel functionality
- Email report scheduling
- Advanced filtering (date ranges, multiple stores)
- Drill-through to product-level detail
- Budget vs Actual comparisons
- Store performance rankings
- Custom KPI builder
- Mobile app (Power Apps)

### Integration Opportunities
- Pull data from ERP system (SAP, Oracle, etc.)
- Push alerts via Teams/Email
- Connect to Power BI for advanced analytics
- Integrate with inventory management
- Link to employee scheduling system

---

## 📝 Change Log

**Version 1.0** (Current)
- Excel-based data architecture
- SPFx deployment model
- Store sales dashboard with filters
- Customer insights tab
- Hourly drill-down modal
- Mobile responsive design

---

## 👥 Team Training

### For Dashboard Users
- How to access the dashboard
- Using filters effectively
- Understanding metrics and trends
- Drilling down to hourly details
- Interpreting YoY comparisons

### For Data Administrators
- Excel file structure and requirements
- How to update data safely
- Best practices for data entry
- Troubleshooting common issues
- Version control and backups

### For IT Administrators
- SPFx deployment process
- Managing API permissions
- Monitoring performance
- Security and compliance
- Backup and disaster recovery

---

## ✅ Success Criteria

Your deployment is successful when:
- ✅ Users can access dashboard from SharePoint
- ✅ Data loads from Excel files correctly
- ✅ Filters update the data table
- ✅ Charts and KPIs display properly
- ✅ Hourly drill-down modal works
- ✅ Mobile users have good experience
- ✅ Data updates reflect within minutes
- ✅ No JavaScript errors in console

---

**Last Updated:** February 4, 2026
**Version:** 1.0
**Contact:** Your IT Department

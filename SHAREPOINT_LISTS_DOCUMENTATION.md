# SharePoint Lists Documentation for RONA Atlantic Sales Dashboard

> **⚠️ NOTE:** This application has been updated to use **Excel files** instead of SharePoint Lists for easier data management.
> 
> **See instead:**
> - `EXCEL_TEMPLATES.md` - Excel file templates and structure
> - `SPFX_DEPLOYMENT_GUIDE.md` - SPFx deployment instructions
> - `QUICK_REFERENCE.md` - Quick start guide
>
> This document is kept for reference purposes only.

---

## Overview
This document outlines the SharePoint Lists that were originally designed to support the RONA Atlantic sales dashboard application. The dashboard visualizes sales data with filters for Week, Store, and Region, displaying daily metrics including Net Sales, GP%, YoY comparisons, and detailed hourly breakdowns.

**Current Implementation:** The app now uses Excel files stored in SharePoint document libraries, accessed via Microsoft Graph API. This provides easier data management and a more familiar interface for users.

---

## List 1: Stores Master

**Purpose:** Store the master list of all RONA Atlantic stores with their identifiers and regional assignments.

### Columns

| Column Name | Type | Required | Description | Example Values |
|------------|------|----------|-------------|----------------|
| Title | Single line of text | Yes | Store display name | Tantallon, Moncton, Charlottetown |
| StoreID | Single line of text | Yes | Unique store identifier | S001, S002, S003 |
| Region | Choice | Yes | Geographic region | Nova Scotia, Prince Edward Island, New Brunswick |
| Status | Choice | Yes | Store operational status | Active, Inactive, Under Renovation |
| StoreManager | Person or Group | No | Store manager contact | John Doe |
| OpeningDate | Date | No | Store opening date | 2015-03-15 |

### Choice Column Values

**Region:**
- Nova Scotia
- Prince Edward Island
- New Brunswick

**Status:**
- Active
- Inactive
- Under Renovation

### Notes
- Set StoreID as an indexed column for faster queries
- Make Title a required field
- This list should be relatively static with minimal updates

---

## List 2: Daily Sales Performance

**Purpose:** Store daily sales metrics for each store, including current year and previous year data for Year-over-Year comparisons.

### Columns

| Column Name | Type | Required | Description | Example Values |
|------------|------|----------|-------------|----------------|
| Title | Single line of text | Yes | Auto-generated identifier | 2024-01-15_S001 |
| StoreID | Lookup | Yes | Reference to Stores Master | S001 (from Stores Master) |
| SaleDate | Date | Yes | Date of sales data | 2024-01-15 |
| DayOfWeek | Choice | Yes | Day of the week | Monday, Tuesday, Wednesday |
| WeekNumber | Number | Yes | Week number of the year | 1, 2, 3, ..., 52 |
| NetSales | Currency | Yes | Total net sales for the day | $8,245.50 |
| GrossProfit | Currency | Yes | Gross profit amount | $2,473.65 |
| GPPercent | Number | Yes | Gross profit percentage | 30.00 |
| YTDNetSales | Currency | Yes | Year-to-date net sales | $125,450.00 |
| YTDGPPercent | Number | Yes | Year-to-date GP percentage | 28.50 |
| LYNetSales | Currency | Yes | Last year same day net sales | $7,890.25 |
| LYGrossProfit | Currency | Yes | Last year same day gross profit | $2,210.18 |
| LYGPPercent | Number | Yes | Last year same day GP % | 28.00 |
| LYYTDNetSales | Currency | Yes | Last year YTD net sales | $118,200.00 |
| LYYTDGPPercent | Number | Yes | Last year YTD GP % | 27.80 |
| YoYNetSalesPercent | Number | Yes | Year-over-year sales % change | 4.50 |
| BasketSize | Currency | No | Average basket size | $67.50 |
| TransactionCount | Number | No | Number of transactions | 122 |
| Created | Date and Time | Auto | System generated timestamp | - |
| Modified | Date and Time | Auto | System generated timestamp | - |

### Choice Column Values

**DayOfWeek:**
- Sunday
- Monday
- Tuesday
- Wednesday
- Thursday
- Friday
- Saturday

### Calculated Fields

**YoYNetSalesPercent:** Can be calculated as `((NetSales - LYNetSales) / LYNetSales) * 100`

### Indexes
- Create compound index on (StoreID, SaleDate) for optimal query performance
- Index WeekNumber for filter queries

### Notes
- Title format recommendation: `[SaleDate]_[StoreID]` (e.g., "2024-01-15_S001")
- Set up list validation to ensure SaleDate falls within appropriate business date range
- Consider using SharePoint views to filter by week ranges

---

## List 3: Hourly Sales Detail

**Purpose:** Store hourly breakdown of sales data for detailed daily analysis, including retail vs professional sales split and returns tracking.

### Columns

| Column Name | Type | Required | Description | Example Values |
|------------|------|----------|-------------|----------------|
| Title | Single line of text | Yes | Auto-generated identifier | 2024-01-15_S001_14 |
| StoreID | Lookup | Yes | Reference to Stores Master | S001 (from Stores Master) |
| SaleDate | Date | Yes | Date of sales data | 2024-01-15 |
| Hour | Number | Yes | Hour of day (0-23) | 14 (for 2pm) |
| HourLabel | Single line of text | Yes | Display label for hour | 2pm, 3pm, 8am |
| TotalSales | Currency | Yes | Total sales for the hour | $845.25 |
| RetailSales | Currency | Yes | Retail customer sales | $570.50 |
| ProSales | Currency | Yes | Professional/contractor sales | $274.75 |
| Returns | Currency | Yes | Return amount for the hour | $45.00 |
| ReturnCount | Number | No | Number of return transactions | 3 |
| LYTotalSales | Currency | Yes | Last year same hour sales | $798.40 |
| LYRetailSales | Currency | Yes | Last year retail sales | $540.20 |
| LYProSales | Currency | Yes | Last year professional sales | $258.20 |
| LYReturns | Currency | Yes | Last year returns | $38.50 |
| Visitors | Number | No | Store visitor count for hour | 45 |
| TransactionCount | Number | No | Number of transactions | 12 |
| ConversionRate | Number | No | Conversion percentage | 26.67 |
| Created | Date and Time | Auto | System generated timestamp | - |
| Modified | Date and Time | Auto | System generated timestamp | - |

### Calculated Fields

**RetailPercent:** `(RetailSales / TotalSales) * 100`
**ProPercent:** `(ProSales / TotalSales) * 100`
**ReturnsPercent:** `(Returns / TotalSales) * 100`

### Indexes
- Create compound index on (StoreID, SaleDate, Hour) for optimal detail queries
- Index SaleDate for range queries

### Notes
- Title format recommendation: `[SaleDate]_[StoreID]_[Hour]` (e.g., "2024-01-15_S001_14")
- Hour should use 24-hour format (0-23) for consistency
- HourLabel for display purposes (e.g., "8am", "12pm", "5pm")
- Store hours typically 8am-9pm (hours 8-21), but maintain full day capability
- Visitors and ConversionRate are optional but provide valuable insights

---

## List 4: Store KPIs

**Purpose:** Store calculated and aggregated KPI metrics for dashboard overview displays.

### Columns

| Column Name | Type | Required | Description | Example Values |
|------------|------|----------|-------------|----------------|
| Title | Single line of text | Yes | KPI identifier | TotalRevenue_2024-W03 |
| KPIName | Choice | Yes | Type of KPI metric | Total Revenue, Avg Order Value, Active Customers |
| KPIPeriod | Choice | Yes | Period type | Daily, Weekly, Monthly, Quarterly, Annual |
| PeriodIdentifier | Single line of text | Yes | Specific period reference | 2024-W03, 2024-01, 2024-Q1 |
| StoreID | Lookup | No | Store reference (null for all stores) | S001 or blank for aggregate |
| Region | Choice | No | Region reference (null for all) | Nova Scotia or blank |
| CurrentValue | Single line of text | Yes | Formatted current value | $4,245,000, 1,234, 3.2% |
| CurrentValueNumeric | Number | Yes | Numeric current value | 4245000 |
| PreviousValue | Single line of text | Yes | Formatted previous period value | $3,890,000 |
| PreviousValueNumeric | Number | Yes | Numeric previous value | 3890000 |
| ChangePercent | Single line of text | Yes | Formatted percentage change | +12.5%, -2.1%, 0.0% |
| ChangePercentNumeric | Number | Yes | Numeric percentage change | 12.5 |
| Trend | Choice | Yes | Trend direction | Up, Down, Neutral |
| CalculatedDate | Date and Time | Yes | When KPI was calculated | 2024-01-20 10:30:00 |
| Created | Date and Time | Auto | System generated timestamp | - |

### Choice Column Values

**KPIName:**
- Total Revenue
- Average Order Value
- Active Customers
- Conversion Rate
- Basket Size
- Gross Profit Margin
- YoY Growth Rate
- Transaction Count

**KPIPeriod:**
- Daily
- Weekly
- Monthly
- Quarterly
- Annual

**Trend:**
- Up
- Down
- Neutral

### Indexes
- Index on (KPIPeriod, PeriodIdentifier) for dashboard queries
- Index on KPIName

### Notes
- This list can be populated via Power Automate flows or scheduled jobs
- CurrentValue and PreviousValue include currency symbols or percentage signs for display
- Numeric fields enable sorting and calculations
- StoreID and Region can be null/blank for organization-wide KPIs

---

## List 5: Regions Master

**Purpose:** Store regional configuration and metadata for filtering and reporting.

### Columns

| Column Name | Type | Required | Description | Example Values |
|------------|------|----------|-------------|----------------|
| Title | Single line of text | Yes | Region name | Nova Scotia |
| RegionCode | Single line of text | Yes | Short region code | NS, PE, NB |
| RegionalManager | Person or Group | No | Regional manager contact | Jane Smith |
| StoreCount | Number | No | Number of stores in region | 4 |
| ActiveSince | Date | No | Region operational start date | 2010-01-01 |
| Notes | Multiple lines of text | No | Additional notes | - |

### Notes
- Simple reference list with minimal updates
- Use RegionCode for compact identifiers in reports
- Synchronize this list with the Region choice column in other lists

---

## List 6: Fiscal Calendar

**Purpose:** Map calendar dates to fiscal weeks, periods, and years for consistent reporting.

### Columns

| Column Name | Type | Required | Description | Example Values |
|------------|------|----------|-------------|----------------|
| Title | Single line of text | Yes | Date identifier | 2024-01-15 |
| CalendarDate | Date | Yes | Actual calendar date | 2024-01-15 |
| FiscalYear | Number | Yes | Fiscal year | 2024 |
| FiscalQuarter | Number | Yes | Fiscal quarter (1-4) | 1 |
| FiscalPeriod | Number | Yes | Fiscal period/month (1-12) | 1 |
| FiscalWeek | Number | Yes | Fiscal week (1-52) | 3 |
| WeekLabel | Single line of text | Yes | Display label for week | Week 3 |
| IsWeekend | Yes/No | Yes | Weekend indicator | Yes, No |
| IsHoliday | Yes/No | No | Holiday indicator | Yes, No |
| HolidayName | Single line of text | No | Holiday name if applicable | Christmas, New Year's Day |
| DayOfWeek | Choice | Yes | Day name | Monday, Tuesday, etc. |
| WeekStartDate | Date | Yes | Start date of fiscal week | 2024-01-14 |
| WeekEndDate | Date | Yes | End date of fiscal week | 2024-01-20 |

### Choice Column Values

**DayOfWeek:**
- Sunday
- Monday
- Tuesday
- Wednesday
- Thursday
- Friday
- Saturday

### Indexes
- Index CalendarDate for lookups
- Index FiscalWeek for filtering

### Notes
- Pre-populate this list with 2-3 years of data
- Update annually for future fiscal periods
- Enables consistent week numbering across all reports
- Use this list to join dates to fiscal periods in Power Automate or Power BI

---

## List 7: Customer Sales (Optional)

**Purpose:** Track customer-level sales performance for customer insights dashboard.

### Columns

| Column Name | Type | Required | Description | Example Values |
|------------|------|----------|-------------|----------------|
| Title | Single line of text | Yes | Customer identifier | CUST-100 |
| CustomerID | Single line of text | Yes | Unique customer ID | CUST-100, CUST-101 |
| CustomerName | Single line of text | Yes | Customer business name | ABC Construction Co |
| CustomerType | Choice | Yes | Type of customer | Professional, Retail, Commercial |
| PrimaryStore | Lookup | No | Primary store location | S001 (from Stores Master) |
| CurrentYearSales | Currency | Yes | Current year total sales | $48,250.00 |
| PreviousYearSales | Currency | Yes | Previous year total sales | $42,100.00 |
| YoYGrowthPercent | Number | Yes | Year-over-year growth % | 14.61 |
| Status | Choice | Yes | Customer status | Active, Inactive, New |
| LastPurchaseDate | Date | No | Date of last purchase | 2024-01-18 |
| AccountManager | Person or Group | No | Assigned account manager | Mike Johnson |
| Created | Date and Time | Auto | System generated timestamp | - |
| Modified | Date and Time | Auto | System generated timestamp | - |

### Choice Column Values

**CustomerType:**
- Professional
- Retail
- Commercial
- Contractor

**Status:**
- Active
- Inactive
- New

### Indexes
- Index CustomerID
- Index Status for filtering

### Notes
- Useful for customer insights and segmentation
- Can be linked to Daily Sales via additional transaction detail list
- Consider privacy and data protection requirements for customer data

---

## Implementation Notes

### Data Population Strategies

1. **Manual Entry:** For initial setup and master data (Stores, Regions)
2. **Power Automate Flows:** Schedule daily imports from POS systems to Daily Sales Performance
3. **Excel Import:** Bulk load historical data for backfill
4. **Power BI Dataflows:** Transform and load data from source systems
5. **SharePoint REST API:** Application-level integration for real-time updates

### Permissions & Security

- **Stores Master:** Read access for all dashboard users
- **Daily Sales Performance:** Read access for managers; Write access for data integration accounts
- **Hourly Sales Detail:** Read access for store managers and above
- **Store KPIs:** Read access for all dashboard users
- **Regions Master:** Read access for all
- **Fiscal Calendar:** Read access for all
- **Customer Sales:** Restricted based on role (consider PII implications)

### Views to Create

#### Daily Sales Performance List

1. **Current Week View:**
   - Filter: WeekNumber equals [current week]
   - Group by: StoreID
   - Sort by: SaleDate descending

2. **Last 7 Days View:**
   - Filter: SaleDate >= [Today] - 7
   - Sort by: SaleDate descending

3. **Store Performance View:**
   - Filter: StoreID equals [parameter]
   - Sort by: SaleDate descending

4. **Regional View:**
   - Filter: StoreID.Region equals [parameter]
   - Group by: StoreID
   - Sort by: SaleDate descending

#### Hourly Sales Detail List

1. **Today Detail View:**
   - Filter: SaleDate equals [Today]
   - Sort by: StoreID, Hour

2. **Store Day View:**
   - Filter: StoreID and SaleDate parameters
   - Sort by: Hour

### Maintenance Considerations

1. **Data Retention:**
   - Keep 3 years of daily data online
   - Archive older data to separate lists or external storage
   - Document archival process

2. **List Thresholds:**
   - Monitor list item counts (5000 item view threshold)
   - Create indexed columns for filtered queries
   - Use compound indexes for multi-field filters

3. **Performance Optimization:**
   - Enable versioning only if required (creates overhead)
   - Disable attachments if not needed
   - Use calculated columns sparingly

4. **Data Quality:**
   - Implement list validation rules
   - Schedule data quality checks
   - Monitor for missing or anomalous data

### Integration with React Application

The mock service at `/src/app/services/mockSharePoint.ts` should be replaced with actual SharePoint REST API calls:

```typescript
// Example API endpoint structure
const baseUrl = 'https://yourtenant.sharepoint.com/sites/RONAAtlantic';

// GET Daily Sales Performance
GET ${baseUrl}/_api/web/lists/getbytitle('Daily Sales Performance')/items
  ?$filter=WeekNumber eq 3 and StoreID/StoreID eq 'S001'
  &$expand=StoreID
  &$select=*,StoreID/Title,StoreID/Region

// GET Hourly Sales Detail
GET ${baseUrl}/_api/web/lists/getbytitle('Hourly Sales Detail')/items
  ?$filter=SaleDate eq '2024-01-15' and StoreID/StoreID eq 'S001'
  &$expand=StoreID
  &$orderby=Hour asc
```

### Power BI Integration (Optional)

These lists can also feed Power BI reports embedded in the dashboard:
- Connect Power BI Desktop to SharePoint lists as data sources
- Create relationships between lists (Stores ↔ Daily Sales ↔ Hourly Detail)
- Publish reports to Power BI Service
- Embed reports using Power BI Embedded or iframe

---

## Quick Start Checklist

- [ ] Create **Stores Master** list with all Atlantic region stores
- [ ] Create **Regions Master** list with three regions
- [ ] Create **Fiscal Calendar** list and populate with current and next fiscal year
- [ ] Create **Daily Sales Performance** list with proper indexes
- [ ] Create **Hourly Sales Detail** list with proper indexes
- [ ] Create **Store KPIs** list for dashboard metrics
- [ ] Set up SharePoint permissions for each list
- [ ] Create recommended views for each list
- [ ] Test data entry or import for one store for one week
- [ ] Update React application to use SharePoint REST API instead of mock data
- [ ] Configure Power Automate flows for automated data imports (if applicable)
- [ ] Document data refresh schedule and responsibilities

---

## Support and Questions

For questions about implementing these SharePoint Lists:
- Review SharePoint list creation documentation
- Consult your SharePoint administrator for site collection permissions
- Test with a small dataset before full deployment
- Consider using a separate SharePoint site for development/testing

**Document Version:** 1.0  
**Last Updated:** January 20, 2026  
**Application:** RONA Atlantic Sales Dashboard
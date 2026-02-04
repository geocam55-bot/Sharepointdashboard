/**
 * Excel SharePoint Service
 * 
 * This service simulates reading data from Excel files stored in SharePoint/OneDrive
 * via Microsoft Graph API. In a real SPFx implementation, this would use:
 * - MSGraphClientV3 from SPFx context
 * - Excel REST API endpoints
 * 
 * Excel File Structure Expected:
 * - StoresMaster.xlsx: Sheet "Stores" with columns: StoreID, StoreName, Region
 * - DailySalesPerformance.xlsx: Sheet "Sales" with columns: Date, StoreID, NetSales, GPPercent, etc.
 * - HourlySalesDetail.xlsx: Sheet "Hourly" with columns: Date, StoreID, Hour, Sales, RetailSales, ProSales, Returns
 * - StoreKPIs.xlsx: Sheet "KPIs" with columns: StoreID, Metric, Value, Trend
 * - RegionsMaster.xlsx: Sheet "Regions" with columns: RegionID, RegionName
 * - FiscalCalendar.xlsx: Sheet "Calendar" with columns: Date, Week, Month, Quarter, FiscalYear
 * - CustomerSales.xlsx: Sheet "Customers" with columns: CustomerID, CustomerName, CurrentYearSales, PreviousYearSales, Status
 */

import { addMonths, subYears, format } from 'date-fns';

// Configuration for Excel file locations in SharePoint
export const EXCEL_CONFIG = {
  siteUrl: '/sites/RONAAtlantic', // SharePoint site URL
  libraryName: 'SalesData', // Document library name
  files: {
    stores: 'StoresMaster.xlsx',
    dailySales: 'DailySalesPerformance.xlsx',
    hourlySales: 'HourlySalesDetail.xlsx',
    kpis: 'StoreKPIs.xlsx',
    regions: 'RegionsMaster.xlsx',
    fiscalCalendar: 'FiscalCalendar.xlsx',
    customers: 'CustomerSales.xlsx'
  }
};

// Data Interfaces (same as before)
export interface StoreSale {
  storeId: string;
  storeName: string;
  region: string;
  currentYearSales: number;
  previousYearSales: number;
  growth: number;
}

export interface CustomerSale {
  customerId: string;
  customerName: string;
  currentYearSales: number;
  previousYearSales: number;
  status: 'Active' | 'Inactive' | 'New';
}

export interface KPI {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  percentage: string;
}

export interface DailyPerformance {
  day: string;
  date: string;
  netSales: number;
  gpPercent: number;
  ytdNetSales: number;
  ytdGpPercent: number;
  lyNetSales: number; // Last Year
  lyGpPercent: number;
  lyYtdNetSales: number;
  lyYtdGpPercent: number;
  yoyNetSalesPercent: number;
  basketSize: number;
}

export interface DayDetail {
  hour: string;
  sales: number;
  retailSales: number;
  proSales: number;
  lySales: number;
  returns: number;
  visitors: number;
  conversion: number;
}

export interface DaySummary {
  retailTotal: number;
  proTotal: number;
  returnsTotal: number;
  returnsPercent: number;
  
  lyTotal: number;
  lyRetailTotal: number;
  lyProTotal: number;
  lyReturnsTotal: number;

  hourlyData: DayDetail[];
}

// Store Master Data (matches Excel structure)
export const STORES_LIST = [
  { id: 'S001', name: 'Tantallon', region: 'Nova Scotia' },
  { id: 'S002', name: 'Almon', region: 'Nova Scotia' },
  { id: 'S003', name: 'Elmsdale', region: 'Nova Scotia' },
  { id: 'S004', name: 'Windmill', region: 'Nova Scotia' },
  { id: 'S005', name: 'Charlottetown', region: 'Prince Edward Island' },
  { id: 'S006', name: 'Moncton', region: 'New Brunswick' }
];

const REGIONS = ['Nova Scotia', 'Prince Edward Island', 'New Brunswick'];

/**
 * Simulates Microsoft Graph API call to read Excel table
 * In real implementation:
 * 
 * const response = await graphClient
 *   .api(`/sites/${siteId}/drive/items/${fileId}/workbook/worksheets/${sheetName}/tables/${tableName}/rows`)
 *   .get();
 * 
 * Or for ranges:
 * const response = await graphClient
 *   .api(`/sites/${siteId}/drive/items/${fileId}/workbook/worksheets/${sheetName}/range(address='A1:G100')`)
 *   .get();
 */

/**
 * Reads Store Master data from Excel
 * Excel file: StoresMaster.xlsx
 * Sheet: Stores
 * Table/Range: A1:C7 (headers + 6 stores)
 */
export const getStoreSales = async (): Promise<StoreSale[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In real implementation, this would parse Excel rows
  // Mock data simulating Excel table structure
  return STORES_LIST.map((store, i) => {
    const current = Math.floor(Math.random() * 500000) + 200000;
    const prev = Math.floor(Math.random() * 500000) + 200000;
    return {
      storeId: store.id,
      storeName: store.name,
      region: store.region,
      currentYearSales: current,
      previousYearSales: prev,
      growth: ((current - prev) / prev) * 100
    };
  });
};

/**
 * Reads Customer Sales data from Excel
 * Excel file: CustomerSales.xlsx
 * Sheet: Customers
 * Table/Range: A1:E11 (headers + 10 customers)
 */
export const getCustomerSales = async (): Promise<CustomerSale[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock Excel data
  return Array.from({ length: 10 }).map((_, i) => {
    const current = Math.floor(Math.random() * 50000) + 5000;
    const prev = Math.floor(Math.random() * 40000) + 5000;
    return {
      customerId: `CUST-${i + 100}`,
      customerName: `Customer ${String.fromCharCode(65 + i)}`,
      currentYearSales: current,
      previousYearSales: prev,
      status: current > prev ? 'Active' : 'Inactive'
    };
  });
};

/**
 * Reads KPI data from Excel
 * Excel file: StoreKPIs.xlsx
 * Sheet: KPIs
 * Table/Range: A1:D5 (headers + 4 KPIs)
 */
export const getKPIs = async (): Promise<KPI[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Mock Excel KPI data
  return [
    { label: 'Total Revenue', value: '$4.2M', trend: 'up', percentage: '+12.5%' },
    { label: 'Avg Order Value', value: '$345', trend: 'up', percentage: '+4.2%' },
    { label: 'Active Customers', value: '1,234', trend: 'down', percentage: '-2.1%' },
    { label: 'Conversion Rate', value: '3.2%', trend: 'neutral', percentage: '0.0%' },
  ];
};

/**
 * Reads Regions from Excel
 * Excel file: RegionsMaster.xlsx
 * Sheet: Regions
 * Table/Range: A1:B4 (headers + 3 regions)
 */
export const getRegions = async (): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return REGIONS;
};

/**
 * Reads Fiscal Calendar weeks from Excel
 * Excel file: FiscalCalendar.xlsx
 * Sheet: Calendar
 * Extracts unique week numbers
 */
export const getWeeks = async (): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);
};

/**
 * Reads Daily Sales Performance from Excel with filters
 * Excel file: DailySalesPerformance.xlsx
 * Sheet: Sales
 * Filters applied: StoreID, Region (via StoreID lookup), Week
 * 
 * In real implementation, would use:
 * - Filter query parameters on the Excel table
 * - Or fetch all rows and filter client-side
 */
export const getDailyPerformance = async (
  storeId?: string,
  region?: string,
  week?: string
): Promise<DailyPerformance[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  let baseSales = 5000;
  if (storeId) baseSales = 8000;
  if (region) baseSales = 7000;

  // Simulate reading Excel rows and transforming to data structure
  return days.map((day, index) => {
    const netSales = baseSales + (Math.random() * 4000) - 2000;
    const lyNetSales = netSales * (0.9 + Math.random() * 0.2);
    
    const weekNum = week ? parseInt(week.replace('Week ', '')) : 1;
    const daysPassed = (weekNum - 1) * 7 + index;
    const ytdNetSales = netSales + (daysPassed * baseSales);
    const lyYtdNetSales = lyNetSales + (daysPassed * (baseSales * 0.95));

    const gpPercent = 25 + Math.random() * 10;
    const lyGpPercent = 25 + Math.random() * 10;

    return {
      day,
      date: `2024-01-${14 + index}`,
      netSales,
      gpPercent,
      ytdNetSales,
      ytdGpPercent: (gpPercent + 30) / 2,
      lyNetSales,
      lyGpPercent,
      lyYtdNetSales,
      lyYtdGpPercent: (lyGpPercent + 30) / 2,
      yoyNetSalesPercent: ((netSales - lyNetSales) / lyNetSales) * 100,
      basketSize: 45 + Math.random() * 20
    };
  });
};

/**
 * Reads Hourly Sales Detail from Excel
 * Excel file: HourlySalesDetail.xlsx
 * Sheet: Hourly
 * Filters: Date, StoreID
 */
export const getDayDetails = async (day: string): Promise<DaySummary> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const hours = [
    '8am', '9am', '10am', '11am', '12pm', '1pm', 
    '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm'
  ];

  let retailTotal = 0;
  let proTotal = 0;
  let returnsTotal = 0;
  let lyTotal = 0;
  let lyRetailTotal = 0;
  let lyProTotal = 0;
  let lyReturnsTotal = 0;

  // Simulate reading Excel rows for hourly breakdown
  const hourlyData = hours.map(hour => {
    const isPeak = ['12pm', '1pm', '5pm', '6pm'].includes(hour);
    const base = isPeak ? 800 : 300;
    
    const totalSales = base + Math.random() * 400;
    const proShare = 0.3 + Math.random() * 0.2;
    const proSales = totalSales * proShare;
    const retailSales = totalSales - proSales;
    
    const lySales = totalSales * (0.85 + Math.random() * 0.3);
    const lyProSales = lySales * (proShare + (Math.random() * 0.05 - 0.025));
    const lyRetailSales = lySales - lyProSales;

    const returns = totalSales * (0.02 + Math.random() * 0.05);
    const lyReturns = lySales * (0.02 + Math.random() * 0.05);

    retailTotal += retailSales;
    proTotal += proSales;
    returnsTotal += returns;
    lyTotal += lySales;
    lyRetailTotal += lyRetailSales;
    lyProTotal += lyProSales;
    lyReturnsTotal += lyReturns;

    return {
      hour,
      sales: totalSales,
      retailSales,
      proSales,
      lySales,
      returns,
      visitors: (base / 20) + Math.random() * 20,
      conversion: 20 + Math.random() * 10
    };
  });

  return {
    retailTotal,
    proTotal,
    returnsTotal,
    returnsPercent: (returnsTotal / (retailTotal + proTotal)) * 100,
    lyTotal,
    lyRetailTotal,
    lyProTotal,
    lyReturnsTotal,
    hourlyData
  };
};

/**
 * Helper function to construct Microsoft Graph API URL for Excel file
 * For use in actual SPFx implementation
 */
export const buildExcelApiUrl = (
  siteId: string,
  fileId: string,
  sheetName: string,
  tableName?: string,
  range?: string
): string => {
  let url = `/sites/${siteId}/drive/items/${fileId}/workbook/worksheets/${sheetName}`;
  
  if (tableName) {
    url += `/tables/${tableName}/rows`;
  } else if (range) {
    url += `/range(address='${range}')`;
  }
  
  return url;
};

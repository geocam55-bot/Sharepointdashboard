import { addMonths, subYears, format } from 'date-fns';

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
  basketSize: number; // Suggested KPI
}

export interface DayDetail {
  hour: string;
  sales: number;
  retailSales: number;
  proSales: number;
  lySales: number; // Previous Year total for this hour
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

// Mock Data Generators

const REGIONS = ['Nova Scotia', 'Prince Edward Island', 'New Brunswick'];

export const STORES_LIST = [
  { id: 'S001', name: 'Tantallon', region: 'Nova Scotia' },
  { id: 'S002', name: 'Almon', region: 'Nova Scotia' },
  { id: 'S003', name: 'Elmsdale', region: 'Nova Scotia' },
  { id: 'S004', name: 'Windmill', region: 'Nova Scotia' },
  { id: 'S005', name: 'Charlottetown', region: 'Prince Edward Island' },
  { id: 'S006', name: 'Moncton', region: 'New Brunswick' }
];

export const getStoreSales = async (): Promise<StoreSale[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

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

export const getCustomerSales = async (): Promise<CustomerSale[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
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

export const getKPIs = async (): Promise<KPI[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [
    { label: 'Total Revenue', value: '$4.2M', trend: 'up', percentage: '+12.5%' },
    { label: 'Avg Order Value', value: '$345', trend: 'up', percentage: '+4.2%' },
    { label: 'Active Customers', value: '1,234', trend: 'down', percentage: '-2.1%' },
    { label: 'Conversion Rate', value: '3.2%', trend: 'neutral', percentage: '0.0%' },
  ];
};

export const getRegions = async (): Promise<string[]> => {
  return REGIONS;
};

export const getWeeks = async (): Promise<string[]> => {
  return Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);
};

export const getDailyPerformance = async (
  storeId?: string,
  region?: string,
  week?: string
): Promise<DailyPerformance[]> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate slightly longer query

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Base numbers to randomize around
  let baseSales = 5000;
  if (storeId) baseSales = 8000; // Specific store might have different profile
  if (region) baseSales = 7000;

  return days.map((day, index) => {
    // Generate realistic looking daily data
    const netSales = baseSales + (Math.random() * 4000) - 2000;
    const lyNetSales = netSales * (0.9 + Math.random() * 0.2); // +/- 10% of this year roughly
    
    // Accumulate YTD (simulated)
    const weekNum = week ? parseInt(week.replace('Week ', '')) : 1;
    const daysPassed = (weekNum - 1) * 7 + index;
    const ytdNetSales = netSales + (daysPassed * baseSales);
    const lyYtdNetSales = lyNetSales + (daysPassed * (baseSales * 0.95));

    const gpPercent = 25 + Math.random() * 10; // 25-35%
    const lyGpPercent = 25 + Math.random() * 10;

    return {
      day,
      date: `2024-01-${14 + index}`, // Mock date
      netSales,
      gpPercent,
      ytdNetSales,
      ytdGpPercent: (gpPercent + 30) / 2, // Smooth it out for YTD
      lyNetSales,
      lyGpPercent,
      lyYtdNetSales,
      lyYtdGpPercent: (lyGpPercent + 30) / 2,
      yoyNetSalesPercent: ((netSales - lyNetSales) / lyNetSales) * 100,
      basketSize: 45 + Math.random() * 20
    };
  });
};

export const getDayDetails = async (day: string): Promise<DaySummary> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Store opening hours: 8am to 9pm (13 hours)
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

  const hourlyData = hours.map(hour => {
    // Peak hours around 12pm and 5pm
    const isPeak = ['12pm', '1pm', '5pm', '6pm'].includes(hour);
    const base = isPeak ? 800 : 300;
    
    // Generate realistic splits
    const totalSales = base + Math.random() * 400;
    const proShare = 0.3 + Math.random() * 0.2; // 30-50% is Pro
    const proSales = totalSales * proShare;
    const retailSales = totalSales - proSales;
    
    // Last Year Generation (roughly similar split but different totals)
    const lySales = totalSales * (0.85 + Math.random() * 0.3); // LY variation
    const lyProSales = lySales * (proShare + (Math.random() * 0.05 - 0.025)); // Slightly different mix
    const lyRetailSales = lySales - lyProSales;

    const returns = totalSales * (0.02 + Math.random() * 0.05); // 2-7% returns
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

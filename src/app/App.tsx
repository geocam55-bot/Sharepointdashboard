import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  Settings, 
  Bell, 
  Search,
  Menu,
  PieChart,
  Filter,
  Calendar,
  MapPin,
  Building2,
  X,
  ChevronDown
} from 'lucide-react';
import { 
  getStoreSales, 
  getCustomerSales, 
  getKPIs,
  getRegions,
  getWeeks,
  getDailyPerformance,
  StoreSale,
  CustomerSale,
  KPI,
  DailyPerformance,
  STORES_LIST
} from '@/app/services/excelSharePointService'; // Changed from mockSharePoint to excelSharePointService
import { KPICard } from '@/app/components/dashboard/KPICard';
import { StoreSalesChart } from '@/app/components/dashboard/StoreSalesChart';
import { CustomerSalesList } from '@/app/components/dashboard/CustomerSalesList';
import { StorePerformanceTable } from '@/app/components/dashboard/StorePerformanceTable';
import { DayDetailModal } from '@/app/components/dashboard/DayDetailModal';
import { motion, AnimatePresence } from 'motion/react';
import * as Tooltip from '@radix-ui/react-tooltip';

const App = () => {
  const [activeTab, setActiveTab] = useState('stores');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Overview Data
  const [storeData, setStoreData] = useState<StoreSale[]>([]);
  const [customerData, setCustomerData] = useState<CustomerSale[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);

  // Store Dashboard Filter State
  const [regions, setRegions] = useState<string[]>([]);
  const [weeks, setWeeks] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('Week 1');
  const [dailyPerformance, setDailyPerformance] = useState<DailyPerformance[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);
  
  // Drill down state
  const [selectedDayData, setSelectedDayData] = useState<DailyPerformance | null>(null);

  // Initial Data Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stores, customers, kpiData, regionList, weekList] = await Promise.all([
          getStoreSales(),
          getCustomerSales(),
          getKPIs(),
          getRegions(),
          getWeeks()
        ]);
        setStoreData(stores);
        setCustomerData(customers);
        setKpis(kpiData);
        setRegions(regionList);
        setWeeks(weekList);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch Table Data when filters change
  useEffect(() => {
    const fetchDailyData = async () => {
      setLoadingTable(true);
      try {
        const data = await getDailyPerformance(selectedStore, selectedRegion, selectedWeek);
        setDailyPerformance(data);
      } catch (error) {
        console.error("Failed to fetch daily performance", error);
      } finally {
        setLoadingTable(false);
      }
    };

    if (activeTab === 'stores') {
      fetchDailyData();
    }
  }, [selectedStore, selectedRegion, selectedWeek, activeTab]);

  const filteredStores = selectedRegion 
    ? STORES_LIST.filter(s => s.region === selectedRegion)
    : STORES_LIST;

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-x-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-white z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PieChart className="text-white w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg tracking-tight">RONA Atlantic</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 px-4 space-y-2 mt-2">
                <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => handleNavClick('overview')} />
                <NavItem icon={<Store size={20} />} label="Stores" active={activeTab === 'stores'} onClick={() => handleNavClick('stores')} />
                <NavItem icon={<Users size={20} />} label="Customers" active={activeTab === 'customers'} onClick={() => handleNavClick('customers')} />
                <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => handleNavClick('settings')} />
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="bg-slate-900 text-white flex-shrink-0 z-20 hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out"
      >
        <div className="p-6 flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <PieChart className="text-white w-5 h-5" />
          </div>
          <motion.span 
            animate={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
            className="font-bold text-lg tracking-tight"
          >
            RONA Atlantic
          </motion.span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} isOpen={sidebarOpen} />
          <NavItem icon={<Store size={20} />} label="Stores" active={activeTab === 'stores'} onClick={() => setActiveTab('stores')} isOpen={sidebarOpen} />
          <NavItem icon={<Users size={20} />} label="Customers" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} isOpen={sidebarOpen} />
          <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} isOpen={sidebarOpen} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
          >
            {sidebarOpen ? <div className="flex items-center gap-2"><Menu size={20} /> <span className="text-sm">Collapse</span></div> : <Menu size={20} />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 flex-shrink-0">
          <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleMobileMenu}
                className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-lg md:text-xl font-bold text-slate-900 truncate">
                {activeTab === 'overview' && 'Sales Overview'}
                {activeTab === 'stores' && 'Store Dashboard'}
                {activeTab === 'customers' && 'Customer Insights'}
                {activeTab === 'settings' && 'Settings'}
              </h1>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 lg:w-64 transition-all"
                />
              </div>
              <button className="p-2 relative hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-200">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-20">
            
            {activeTab === 'overview' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 flex items-start gap-3 shadow-sm">
                  <div className="mt-0.5 text-lg">ℹ️</div>
                  <div>
                    <p className="font-semibold">Excel-Based Data Integration</p>
                    <p className="mt-1 text-blue-700">
                      Currently viewing mock data simulating Excel files from SharePoint. Deploy as SPFx web part to connect to real data.
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
                     <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
                     <p>Loading overview...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                      {kpis.map((kpi, i) => <KPICard key={kpi.label} kpi={kpi} index={i} />)}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 min-h-[350px] md:h-[400px]">
                        <StoreSalesChart data={storeData} />
                      </div>
                      <div className="lg:col-span-1">
                         <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-6 text-white h-full flex flex-col justify-between shadow-lg min-h-[250px]">
                            <div>
                              <h3 className="text-xl font-bold mb-2">Q1 Targets</h3>
                              <p className="text-indigo-100 text-sm opacity-90">You're on track to exceed monthly projections.</p>
                            </div>
                            <div className="mt-8">
                               <div className="flex justify-between text-sm font-medium mb-2">
                                 <span>85% Complete</span>
                                 <span className="opacity-80">Goal: $5.2M</span>
                               </div>
                               <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "85%" }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-white/90 rounded-full" 
                                 />
                               </div>
                               <button className="mt-6 w-full py-2.5 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 active:scale-95 transition-all text-sm shadow-sm">
                                 View Detailed Report
                               </button>
                            </div>
                         </div>
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <CustomerSalesList data={customerData} />
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'stores' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Mobile Collapsible Filters */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                   <div 
                      className="p-4 md:p-5 flex items-center justify-between cursor-pointer md:cursor-default"
                      onClick={() => window.innerWidth < 768 && setFiltersVisible(!filtersVisible)}
                   >
                      <div className="flex items-center gap-2 text-slate-800 font-semibold">
                        <Filter className="w-5 h-5 text-indigo-600" />
                        <h2>Report Filters</h2>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 md:hidden transition-transform ${filtersVisible ? 'rotate-180' : ''}`} />
                   </div>
                  
                  <AnimatePresence initial={false}>
                    {(filtersVisible || window.innerWidth >= 768) && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 md:px-5 md:pb-5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FilterSelect 
                            label="Region" 
                            icon={<MapPin size={14} />}
                            value={selectedRegion}
                            onChange={(e) => {
                              setSelectedRegion(e.target.value);
                              setSelectedStore('');
                            }}
                            options={[{value: "", label: "All Regions"}, ...regions.map(r => ({value: r, label: r}))]}
                          />

                          <FilterSelect 
                            label="Store" 
                            icon={<Building2 size={14} />}
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.target.value)}
                            options={[{value: "", label: "All Stores"}, ...filteredStores.map(s => ({value: s.id, label: s.name}))]}
                          />

                          <FilterSelect 
                            label="Week of Year" 
                            icon={<Calendar size={14} />}
                            value={selectedWeek}
                            onChange={(e) => setSelectedWeek(e.target.value)}
                            options={weeks.map(w => ({value: w, label: w}))}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Performance Table */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Weekly Performance Detail</h3>
                      <p className="text-slate-500 text-sm mt-1">
                        Showing data for <span className="font-semibold text-indigo-600">{selectedWeek}</span>
                        {selectedRegion && <span> in <span className="font-semibold text-indigo-600">{selectedRegion}</span></span>}
                      </p>
                    </div>
                    <button className="text-sm bg-white border border-slate-200 px-4 py-2 rounded-lg text-indigo-600 font-medium hover:bg-indigo-50 transition-colors shadow-sm">
                      Export CSV
                    </button>
                  </div>
                  
                  <StorePerformanceTable 
                    data={dailyPerformance} 
                    isLoading={loadingTable} 
                    onDayClick={setSelectedDayData}
                  />
                  <p className="text-xs text-slate-400 mt-2 italic text-center sm:text-left">
                    * Click on any row to view hourly breakdown
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'customers' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
                     <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
                     <p>Loading customer data...</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold mb-1">Customer Insights</h3>
                          <p className="text-indigo-100 text-sm opacity-90">
                            Tracking {customerData.length} customer accounts across Atlantic region
                          </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <Users className="w-10 h-10" />
                        </div>
                      </div>
                    </div>
                    
                    <CustomerSalesList data={customerData} />
                  </>
                )}
              </motion.div>
            )}
            
            {activeTab === 'settings' && (
               <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white rounded-xl border border-slate-100 border-dashed">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                   <Settings className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Settings</h3>
                <p className="text-slate-500 mt-2 max-w-sm">System configuration and preferences would go here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Detail Modal Layer */}
      <DayDetailModal 
        isOpen={!!selectedDayData} 
        onClose={() => setSelectedDayData(null)}
        dayData={selectedDayData}
      />
    </div>
  );
};

// Subcomponents

interface FilterSelectProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string, label: string }[];
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, icon, value, onChange, options }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 ml-1">
      {icon} {label}
    </label>
    <div className="relative">
      <select 
        value={value}
        onChange={onChange}
        className="w-full pl-3 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none"
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <ChevronDown size={16} />
      </div>
    </div>
  </div>
);

const NavItem = ({ 
  icon, 
  label, 
  active = false, 
  isOpen = true,
  onClick
}: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean, 
  isOpen?: boolean,
  onClick?: () => void
}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg transition-all duration-200
      ${active 
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }
    `}
  >
    <div className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
      {icon}
    </div>
    <AnimatePresence>
      {isOpen && (
        <motion.span 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          className="text-sm font-medium whitespace-nowrap overflow-hidden"
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>
  </button>
);

export default App;
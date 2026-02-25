import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaShoppingCart, FaFileInvoice, FaUsers, FaUserTie, FaCubes } from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import {
  fetchTotalSalesOrders,
  fetchTotalPurchaseOrders,
  fetchTotalClients,
  fetchTotalVendors,
  fetchTotalComponents,
  fetchMonthlySalesOrders,
  fetchMonthlyPurchaseOrders,
} from "@/features/dashboard/salesOrderSlice";

import type { AppDispatch } from "@/store";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define interface for Redux state
interface DashboardState {
  totalSalesOrders: number;
  salesPercentageIncrease: number;
  salesLoading: boolean;
  salesError: string | null;
  totalPurchaseOrders: number;
  purchasePercentageIncrease: number;
  purchaseLoading: boolean;
  purchaseError: string | null;
  totalClients: number;
  clientsLoading: boolean;
  clientsError: string | null;
  totalVendors: number;
  vendorsLoading: boolean;
  vendorsError: string | null;
  totalComponents: number;
  componentsLoading: boolean;
  componentsError: string | null;
  monthlySalesOrders: { month: string; total: number }[];
  monthlySalesLoading: boolean;
  monthlySalesError: string | null;
  monthlyPurchaseOrders: { month: string; total: number }[];
  monthlyPurchaseLoading: boolean;
  monthlyPurchaseError: string | null;
}

// Chart options with TypeScript typing
const chartOptions: ChartOptions<"line" | "bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12,
          weight: 500,
        },
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      titleFont: {
        size: 14,
        weight: 600,
      },
      bodyFont: {
        size: 13,
      },
      cornerRadius: 8,
      displayColors: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
  },
};

// Determine greeting based on time of day
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    totalSalesOrders,
    salesPercentageIncrease,
    salesLoading,
    salesError,
    totalPurchaseOrders,
    purchasePercentageIncrease,
    purchaseLoading,
    purchaseError,
    totalClients,
    clientsLoading,
    clientsError,
    totalVendors,
    vendorsLoading,
    vendorsError,
    totalComponents,
    componentsLoading,
    componentsError,
    monthlySalesOrders,
    monthlySalesLoading,
    monthlySalesError,
    monthlyPurchaseOrders,
    monthlyPurchaseLoading,
    monthlyPurchaseError,
  } = useSelector((state: { dashboard: DashboardState }) => state.dashboard);

  // Chart data for sales orders
  const salesData: ChartData<"line"> = {
    labels: monthlySalesOrders.length > 0
      ? monthlySalesOrders.map((item) => item.month)
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales Orders",
        data: monthlySalesOrders.length > 0
          ? monthlySalesOrders.map((item) => item.total)
          : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart data for purchase orders
  const purchaseData: ChartData<"bar"> = {
    labels: monthlyPurchaseOrders.length > 0
      ? monthlyPurchaseOrders.map((item) => item.month)
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Purchase Orders",
        data: monthlyPurchaseOrders.length > 0
          ? monthlyPurchaseOrders.map((item) => item.total)
          : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "rgb(245, 158, 11)",
        borderColor: "rgb(245, 158, 11)",
        borderWidth: 1,
      },
    ],
  };

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchTotalSalesOrders());
    dispatch(fetchTotalPurchaseOrders());
    dispatch(fetchTotalClients());
    dispatch(fetchTotalVendors());
    dispatch(fetchTotalComponents());
    dispatch(fetchMonthlySalesOrders());
    dispatch(fetchMonthlyPurchaseOrders());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 relative z-0">
      {/* Header Section */}
      <header className="bg-white/80 backdrop-blur-sm shadow-md border-b border-gray-200/50 sticky top-0 z-[5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                {getGreeting()}, let's drive your business to new heights today! 🚀
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-0">
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center w-full max-w-lg border-2 border-gray-200 rounded-full shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:border-blue-300">
            <Input
              className="border-none focus-visible:ring-0 rounded-l-full bg-transparent pl-6"
              placeholder="Search orders, customers, or vendors..."
            />
            <Button
              variant="outline"
              className="h-10 w-10 p-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full border-none text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="group bg-gradient-to-br from-white to-green-50/50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center space-x-4 border border-green-100/50 hover:border-green-300 hover:-translate-y-1">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <FaShoppingCart className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Sales Orders</p>
              <p className="text-2xl font-bold text-gray-800 truncate">
                {salesLoading ? (
                  <span className="text-sm text-gray-400">Loading...</span>
                ) : salesError ? (
                  <span className="text-sm text-red-500">Error</span>
                ) : (
                  totalSalesOrders.toLocaleString()
                )}
              </p>
              {!salesLoading && !salesError && (
                <p className={`text-xs font-semibold mt-1 ${salesPercentageIncrease >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {salesPercentageIncrease >= 0 ? "↑" : "↓"} {Math.abs(salesPercentageIncrease)}% from last month
                </p>
              )}
            </div>
          </div>
          
          <div className="group bg-gradient-to-br from-white to-amber-50/50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center space-x-4 border border-amber-100/50 hover:border-amber-300 hover:-translate-y-1">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <FaFileInvoice className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Purchase Orders</p>
              <p className="text-2xl font-bold text-gray-800 truncate">
                {purchaseLoading ? (
                  <span className="text-sm text-gray-400">Loading...</span>
                ) : purchaseError ? (
                  <span className="text-sm text-red-500">Error</span>
                ) : (
                  totalPurchaseOrders.toLocaleString()
                )}
              </p>
              {!purchaseLoading && !purchaseError && (
                <p className={`text-xs font-semibold mt-1 ${purchasePercentageIncrease >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {purchasePercentageIncrease >= 0 ? "↑" : "↓"} {Math.abs(purchasePercentageIncrease)}% from last month
                </p>
              )}
            </div>
          </div>
          
          <div className="group bg-gradient-to-br from-white to-purple-50/50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center space-x-4 border border-purple-100/50 hover:border-purple-300 hover:-translate-y-1">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <FaUsers className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800 truncate">
                {clientsLoading ? (
                  <span className="text-sm text-gray-400">Loading...</span>
                ) : clientsError ? (
                  <span className="text-sm text-red-500">Error</span>
                ) : (
                  totalClients.toLocaleString()
                )}
              </p>
            </div>
          </div>
          
          <div className="group bg-gradient-to-br from-white to-teal-50/50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center space-x-4 border border-teal-100/50 hover:border-teal-300 hover:-translate-y-1">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <FaUserTie className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Total Vendors</p>
              <p className="text-2xl font-bold text-gray-800 truncate">
                {vendorsLoading ? (
                  <span className="text-sm text-gray-400">Loading...</span>
                ) : vendorsError ? (
                  <span className="text-sm text-red-500">Error</span>
                ) : (
                  totalVendors.toLocaleString()
                )}
              </p>
            </div>
          </div>
          
          <div className="group bg-gradient-to-br from-white to-indigo-50/50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center space-x-4 border border-indigo-100/50 hover:border-indigo-300 hover:-translate-y-1">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <FaCubes className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Total Components</p>
              <p className="text-2xl font-bold text-gray-800 truncate">
                {componentsLoading ? (
                  <span className="text-sm text-gray-400">Loading...</span>
                ) : componentsError ? (
                  <span className="text-sm text-red-500">Error</span>
                ) : (
                  totalComponents.toLocaleString()
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-blue-50/30 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Sales Orders Trend
              </h2>
            </div>
            <div className="h-64">
              {monthlySalesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Loading chart data...</p>
                  </div>
                </div>
              ) : monthlySalesError ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500 font-medium">Error: {monthlySalesError}</p>
                </div>
              ) : (
                <Line data={salesData} options={chartOptions} />
              )}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-amber-50/30 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></div>
                Purchase Orders Trend
              </h2>
            </div>
            <div className="h-64">
              {monthlyPurchaseLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Loading chart data...</p>
                  </div>
                </div>
              ) : monthlyPurchaseError ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500 font-medium">Error: {monthlyPurchaseError}</p>
                </div>
              ) : (
                <Bar data={purchaseData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 relative z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="mb-6">
                <img 
                  src="/mscorpreslogo.png" 
                  alt="MsCorpres Logo" 
                  className="w-40 mb-4 brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" 
                />
                <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full"></div>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <p className="text-lg font-bold text-white mb-3">MsCorpres Automation Pvt Ltd</p>
                <p className="flex items-start gap-2">
                  <span className="text-teal-400 mt-1">📍</span>
                  <span>Office No. 1 and 2, 3rd Floor, Plot number B-88 Sector 83, Noida, Gautam Buddha Nagar, 201305</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-teal-400">📞</span>
                  <a href="tel:+918826788880" className="hover:text-teal-400 transition-colors">+91 88 26 788880</a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-teal-400">✉️</span>
                  <a href="mailto:marketing@mscorpres.in" className="hover:text-teal-400 transition-colors">marketing@mscorpres.in</a>
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-start md:items-end">
              <p className="text-sm text-gray-300 mb-4 font-medium">Stay updated with our latest products and updates.</p>
              <div className="flex w-full max-w-sm border-2 border-gray-700 rounded-full shadow-lg bg-gray-800/50 backdrop-blur-sm hover:border-teal-500/50 transition-all duration-300">
                <Input
                  className="border-none focus-visible:ring-0 rounded-l-full bg-transparent text-white placeholder:text-gray-400 pl-6"
                  placeholder="Enter your email"
                />
                <Button
                  variant="outline"
                  className="h-10 w-10 p-0 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 rounded-full border-none text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-6 text-center md:text-right">
                © 2024 MsCorpres Automation Pvt. Ltd. | All rights reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
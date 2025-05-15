import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaChartLine, FaShoppingCart, FaFileInvoice, FaUsers, FaUserTie, FaCubes } from "react-icons/fa";
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
    },
  },
  scales: {
    y: {
      beginAtZero: true,
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {getGreeting()}, let's drive your business to new heights today!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center w-full max-w-lg border border-gray-300 rounded-full shadow-md bg-white">
            <Input
              className="border-none focus-visible:ring-0 rounded-l-full"
              placeholder="Search orders, customers, or vendors..."
            />
            <Button
              variant="outline"
              className="h-10 w-10 p-0 bg-blue-100 rounded-full border-none"
            >
              <Search className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:shadow-lg transition-shadow">
            <FaChartLine className="h-10 w-10 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-semibold text-gray-800">$45,230</p>
              <p className="text-xs text-green-500">+12% from last month</p>
            </div>
          </div> */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:shadow-lg transition-shadow">
            <FaShoppingCart className="h-10 w-10 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Sales Orders</p>
              <p className="text-2xl font-semibold text-gray-800">
                {salesLoading ? "Loading..." : salesError ? `Error: ${salesError}` : totalSalesOrders}
              </p>
              <p className={`text-xs ${salesPercentageIncrease >= 0 ? "text-green-500" : "text-red-500"}`}>
                {salesLoading || salesError ? "" : `${salesPercentageIncrease >= 0 ? "+" : ""}${salesPercentageIncrease}% from last month`}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:shadow-lg transition-shadow">
            <FaFileInvoice className="h-10 w-10 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-500">Purchase Orders</p>
              <p className="text-2xl font-semibold text-gray-800">
                {purchaseLoading ? "Loading..." : purchaseError ? `Error: ${purchaseError}` : totalPurchaseOrders}
              </p>
              <p className={`text-xs ${purchasePercentageIncrease >= 0 ? "text-green-500" : "text-red-500"}`}>
                {purchaseLoading || purchaseError ? "" : `${purchasePercentageIncrease >= 0 ? "+" : ""}${purchasePercentageIncrease}% from last month`}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:shadow-lg transition-shadow">
            <FaUsers className="h-10 w-10 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-800">
                {clientsLoading ? "Loading..." : clientsError ? `Error: ${clientsError}` : totalClients}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:shadow-lg transition-shadow">
            <FaUserTie className="h-10 w-10 text-teal-600" />
            <div>
              <p className="text-sm text-gray-500">Total Vendors</p>
              <p className="text-2xl font-semibold text-gray-800">
                {vendorsLoading ? "Loading..." : vendorsError ? `Error: ${vendorsError}` : totalVendors}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:shadow-lg transition-shadow">
            <FaCubes className="h-10 w-10 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500">Total Components</p>
              <p className="text-2xl font-semibold text-gray-800">
                {componentsLoading ? "Loading..." : componentsError ? `Error: ${componentsError}` : totalComponents}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales Orders Trend</h2>
            <div className="h-64">
              {monthlySalesLoading ? (
                <p>Loading...</p>
              ) : monthlySalesError ? (
                <p>Error: {monthlySalesError}</p>
              ) : (
                <Line data={salesData} options={chartOptions} />
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Purchase Orders Trend</h2>
            <div className="h-64">
              {monthlyPurchaseLoading ? (
                <p>Loading...</p>
              ) : monthlyPurchaseError ? (
                <p>Error: {monthlyPurchaseError}</p>
              ) : (
                <Bar data={purchaseData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="mb-6 sm:mb-0">
            <img src="/mscorpreslogo.png" alt="MsCorpres Logo" className="w-32 mb-4" />
            <div className="text-sm text-gray-500">
              <p>MsCorpres Automation Pvt Ltd</p>
              <p>Office No. 1 and 2, 3rd Floor, Plot number B-88 Sector 83, Noida,</p>
              <p>Gautam Buddha Nagar, 201305</p>
              <p>Phone: +91 88 26 788880</p>
              <p>Email: marketing@mscorpres.in</p>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end">
            <p className="text-sm text-gray-500 mb-4">Stay updated with our latest products and updates.</p>
            <div className="flex w-full max-w-sm border border-gray-300 rounded-full shadow-md bg-white">
              <Input
                className="border-none focus-visible:ring-0 rounded-l-full"
                placeholder="Enter your email"
              />
              <Button
                variant="outline"
                className="h-10 w-10 p-0 bg-blue-100 rounded-full border-none"
              >
                <Send className="h-5 w-5 text-blue-600" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">© 2024 MsCorpres Automation Pvt. Ltd. | All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
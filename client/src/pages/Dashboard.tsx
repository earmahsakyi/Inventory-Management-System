import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopNav from "@/components/dashboard/DashboardTopNav";
import KPICards from "@/components/dashboard/KPICards";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import RecentSalesTable from "@/components/dashboard/RecentSalesTable";
import LowStockCard from "@/components/dashboard/LowStockCard";
import ProductsPage from "@/pages/dashboard/ProductsPage";
import SuppliersPage from "@/pages/dashboard/SuppliersPage";
import CategoriesPage from "@/pages/dashboard/CategoriesPage";
import SalesPage from "@/pages/dashboard/SalesPage";
import ReportsPage from "@/pages/dashboard/ReportsPage";

const DashboardHome = () => (
  <div className="space-y-6">
    <KPICards />
    <DashboardCharts />
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <RecentSalesTable />
      </div>
      <LowStockCard />
    </div>
  </div>
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <DashboardTopNav onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
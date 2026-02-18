import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Truck,
  FolderTree,
  ShoppingCart,
  BarChart3,
  Package as Logo,
  LogOut,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/store/authSlice";
import { useAppDispatch } from "@/store/store";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Products", icon: Package, path: "/dashboard/products" },
  { label: "Suppliers", icon: Truck, path: "/dashboard/suppliers" },
  { label: "Categories", icon: FolderTree, path: "/dashboard/categories" },
  { label: "Sales", icon: ShoppingCart, path: "/dashboard/sales" },
  { label: "Reports", icon: BarChart3, path: "/dashboard/reports" },
];

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

const DashboardSidebar = ({ open, onClose }: DashboardSidebarProps) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogout = (): void => {
    setLoading(true);
    toast({ title: "Logging out...", description: "You are being logged out" });
    dispatch(logout());
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Logged out successfully", description: "Redirecting to login page..." });
      navigate("/login");
    }, 3000);
  };

  const handleNavClick = () => {
    // Close sidebar on mobile when a nav item is clicked
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <aside
      className={cn(
        // Base styles
        "fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-30 transition-transform duration-300 ease-in-out",
        // Mobile: slide in/out; Desktop: always visible
        open ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Logo className="h-4 w-4 text-primary" />
          </div>
          <span className="font-heading font-semibold text-foreground">InvenFlow</span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
        >
          <X className="h-4 w-4 text-sidebar-foreground" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="h-5 w-5" />
              Logout
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
import { Link, useLocation,useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  LayoutDashboard,
  Package,
  Truck,
  FolderTree,
  ShoppingCart,
  BarChart3,
  Package as Logo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/store/authSlice";
import { useAppDispatch } from '../../store/store';
import { useToast } from "@/hooks/use-toast";
import {
  LogOut,
  Loader2,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Products", icon: Package, path: "/dashboard/products" },
  { label: "Suppliers", icon: Truck, path: "/dashboard/suppliers" },
  { label: "Categories", icon: FolderTree, path: "/dashboard/categories" },
  { label: "Sales", icon: ShoppingCart, path: "/dashboard/sales" },
  { label: "Reports", icon: BarChart3, path: "/dashboard/reports" },

];

const DashboardSidebar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate()

   const handleLogout = (): void => {
    setLoading(true);
    
    // Show toast notification
    toast({
      title: "Logging out...",
      description: "You are being logged out",
    });

    // Dispatch logout action
    dispatch(logout());

    // Wait a bit then navigate
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Logged out successfully",
        description: "Redirecting to login page...",
      });
      navigate('/login');
    }, 3000);
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-30">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Logo className="h-4 w-4 text-primary" />
        </div>
        <span className="font-heading font-semibold text-foreground">InvenFlow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="border-t border-sidebar-border p-3">
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
      </div>
    </aside>
  );
};

export default DashboardSidebar;

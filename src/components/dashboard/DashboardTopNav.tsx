import { Search, Bell } from "lucide-react";

const DashboardTopNav = () => (
  <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
    {/* Search */}
    <div className="relative w-80">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search products, suppliers..."
        className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors duration-200"
      />
    </div>

    {/* Right */}
    <div className="flex items-center gap-4">
      <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
        <Bell className="h-4 w-4 text-muted-foreground" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
      </button>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
          JD
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-foreground leading-none">John Doe</p>
          <p className="text-xs text-muted-foreground mt-0.5">Admin</p>
        </div>
      </div>
    </div>
  </header>
);

export default DashboardTopNav;

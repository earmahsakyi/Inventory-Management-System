import { useState, useRef, useEffect, useMemo } from "react";
import { Search, Bell, Package, Truck, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/store";

interface Result {
  id: number;
  label: string;
  sub: string;
  type: "product" | "supplier";
  route: string;
}

interface DashboardTopNavProps {
  onMenuClick: () => void;
}

const DashboardTopNav = ({ onMenuClick }: DashboardTopNavProps) => {
  const navigate = useNavigate();
  const username = useAppSelector((state) => state.auth.username);
  const { products } = useAppSelector((state) => state.product);
  const { suppliers } = useAppSelector((state) => state.supplier);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo((): Result[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matchedProducts: Result[] = products
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map((p) => ({
        id: p.product_id,
        label: p.name,
        sub: `GH₵${Number(p.price).toFixed(2)} · ${p.stock_quantity} in stock`,
        type: "product",
        route: "/dashboard/products",
      }));

    const matchedSuppliers: Result[] = suppliers
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map((s) => ({
        id: s.supplier_id,
        label: s.name,
        sub: s.email || "No email",
        type: "supplier",
        route: "/dashboard/suppliers",
      }));

    return [...matchedProducts, ...matchedSuppliers];
  }, [query, products, suppliers]);

  const handleSelect = (result: Result) => {
    setQuery("");
    setOpen(false);
    navigate(result.route);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-20 gap-4">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors shrink-0"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-xs md:max-w-sm" ref={containerRef}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products, suppliers..."
          className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors duration-200"
        />

        {/* Dropdown */}
        {open && query.trim() && (
          <div className="absolute top-11 left-0 w-full rounded-lg border border-border bg-background shadow-lg overflow-hidden z-50">
            {results.length > 0 ? (
              <ul>
                {results.map((r) => (
                  <li key={`${r.type}-${r.id}`}>
                    <button
                      onMouseDown={() => handleSelect(r)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        {r.type === "product" ? (
                          <Package className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Truck className="h-3.5 w-3.5 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-foreground truncate">{r.label}</p>
                        <p className="text-xs text-muted-foreground truncate">{r.sub}</p>
                      </div>
                      <span className="ml-auto text-xs text-muted-foreground shrink-0 capitalize">
                        {r.type}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No results for "{query}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
            {username?.slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground leading-none">{username}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopNav;
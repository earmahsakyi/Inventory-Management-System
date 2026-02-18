import { useEffect } from "react";
import { DollarSign, Package, Truck, ShoppingCart, TrendingUp, TrendingDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getAllSales } from "@/store/saleSlice";
import { getAllProducts } from "@/store/productSlice";
import { getAllSuppliers } from "@/store/supplierSlice";

const KPICards = () => {
  const dispatch = useAppDispatch();
  const { sales } = useAppSelector((state) => state.sale);
  const { products } = useAppSelector((state) => state.product);
  const { suppliers } = useAppSelector((state) => state.supplier);

  useEffect(() => {
    dispatch(getAllSales({ limit: 1000 }));
    dispatch(getAllProducts({}));
    dispatch(getAllSuppliers({}));
  }, [dispatch]);

  // Total revenue — sum of all sale total_amounts
  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);

  // Today's sales count and revenue
  const today = new Date().toDateString();
  const todaySales = sales.filter(
    (s) => s.sale_date && new Date(s.sale_date).toDateString() === today
  );
  const todayRevenue = todaySales.reduce((sum, s) => sum + Number(s.total_amount), 0);

  // Yesterday's sales revenue (for trend comparison)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayRevenue = sales
    .filter((s) => s.sale_date && new Date(s.sale_date).toDateString() === yesterday.toDateString())
    .reduce((sum, s) => sum + Number(s.total_amount), 0);

  // Revenue trend vs yesterday
  const revenueTrend = yesterdayRevenue > 0
    ? (((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(1)
    : null;

  const formatGHS = (amount: number) =>
    amount.toLocaleString("en-GH", { style: "currency", currency: "GHS" });

  const kpis = [
    {
      label: "Total Revenue",
      value: formatGHS(totalRevenue),
      change: revenueTrend ? `${Number(revenueTrend) >= 0 ? "+" : ""}${revenueTrend}% today` : "vs yesterday",
      trend: revenueTrend === null || Number(revenueTrend) >= 0 ? "up" as const : "down" as const,
      icon: DollarSign,
    },
    {
      label: "Total Products",
      value: products.length.toLocaleString(),
      change: `${products.filter((p) => p.stock_quantity < 10).length} low stock`,
      trend: products.filter((p) => p.stock_quantity < 10).length === 0 ? "up" as const : "down" as const,
      icon: Package,
    },
    {
      label: "Active Suppliers",
      value: suppliers.length.toLocaleString(),
      change: `${suppliers.length} total`,
      trend: "up" as const,
      icon: Truck,
    },
    {
      label: "Sales Today",
      value: todaySales.length.toLocaleString(),
      change: `${todaySales.length > 0 ? formatGHS(todayRevenue) : formatGHS(0)} revenue`,
      trend: todaySales.length > 0 ? "up" as const : "down" as const,
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <kpi.icon className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="font-mono text-2xl font-bold text-foreground">{kpi.value}</p>
            <span
              className={`flex items-center gap-0.5 text-xs font-medium ${
                kpi.trend === "up" ? "text-success" : "text-destructive"
              }`}
            >
              {kpi.trend === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {kpi.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
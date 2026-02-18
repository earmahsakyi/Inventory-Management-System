import { useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { AlertTriangle } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { toast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  getSalesByProduct,
  getSalesByDate,
  clearError,
} from "@/store/reportSlice";
import { getAllProducts } from "@/store/productSlice";

const tooltipStyle = {
  background: "hsl(220 40% 13%)",
  border: "1px solid hsl(217 33% 20%)",
  borderRadius: 8,
  color: "hsl(210 40% 98%)",
};

// Low stock threshold
const LOW_STOCK_THRESHOLD = 10;

const ReportsPage = () => {
  const dispatch = useAppDispatch();
  const { salesByProduct, salesByDate, loading, error } = useAppSelector(
    (state) => state.report
  );
  const { products } = useAppSelector((state) => state.product);

  // Fetch all report data on mount
  useEffect(() => {
    dispatch(getSalesByProduct());
    dispatch(getSalesByDate());
    dispatch(getAllProducts({}));
  }, [dispatch]);

  // Show error toast from Redux
  useEffect(() => {
    if (error) {
      toast({ title: error, variant: "destructive" });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Derive low stock from products in the store
  const lowStock = products
    .filter((p) => p.stock_quantity < LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stock_quantity - b.stock_quantity);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Reports" description="Sales analytics and stock reports" />
        <div className="text-center text-muted-foreground py-12">
          Loading reports...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Sales analytics and stock reports" />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales by Product */}
        <div className="glass-card p-5">
          <p className="text-sm font-medium text-foreground mb-4">Sales by Product</p>
          {salesByProduct.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByProduct}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 20%)" />
                <XAxis
                  dataKey="product_name"
                  tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar
                  dataKey="total_sales"
                  fill="hsl(217 91% 60%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm py-8 text-center">
              No data available
            </p>
          )}
        </div>

        {/* Sales by Date */}
        <div className="glass-card p-5">
          <p className="text-sm font-medium text-foreground mb-4">Sales by Date</p>
          {salesByDate.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 20%)" />
                <XAxis
                  dataKey="sale_date"
                  tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="total_revenue"
                  stroke="hsl(160 84% 39%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(160 84% 39%)", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm py-8 text-center">
              No data available
            </p>
          )}
        </div>
      </div>

      {/* Low Stock */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <p className="text-sm font-medium text-foreground">
            Low Stock Report{" "}
            <span className="text-muted-foreground font-normal">
              (below {LOW_STOCK_THRESHOLD} units)
            </span>
          </p>
        </div>
        {lowStock.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border/50">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Price</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Supplier</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-foreground">{item.name}</td>
                    <td className="px-4 py-3 font-mono text-destructive font-medium">
                      {item.stock_quantity}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground hidden md:table-cell">
                      ${Number(item.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {item.supplier_name || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm py-4 text-center">
            No low stock items
          </p>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle } from "lucide-react";
import { reportsApi } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";

const tooltipStyle = {
  background: "hsl(220 40% 13%)",
  border: "1px solid hsl(217 33% 20%)",
  borderRadius: 8,
  color: "hsl(210 40% 98%)",
};

const ReportsPage = () => {
  const [salesByProduct, setSalesByProduct] = useState<any[]>([]);
  const [salesByDate, setSalesByDate] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [byProduct, byDate, low] = await Promise.allSettled([
          reportsApi.salesByProduct(),
          reportsApi.salesByDate(),
          reportsApi.lowStock(),
        ]);
        if (byProduct.status === "fulfilled") setSalesByProduct(Array.isArray(byProduct.value.data) ? byProduct.value.data : byProduct.value.data.data || []);
        if (byDate.status === "fulfilled") setSalesByDate(Array.isArray(byDate.value.data) ? byDate.value.data : byDate.value.data.data || []);
        if (low.status === "fulfilled") setLowStock(Array.isArray(low.value.data) ? low.value.data : low.value.data.data || []);
      } catch {} finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Sales analytics and stock reports" />
      <div className="text-center text-muted-foreground py-12">Loading reports...</div>
    </div>
  );

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
                <XAxis dataKey="name" tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="total_sales" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-muted-foreground text-sm py-8 text-center">No data available</p>}
        </div>

        {/* Sales by Date */}
        <div className="glass-card p-5">
          <p className="text-sm font-medium text-foreground mb-4">Sales by Date</p>
          {salesByDate.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 20%)" />
                <XAxis dataKey="date" tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="total" stroke="hsl(160 84% 39%)" strokeWidth={2} dot={{ fill: "hsl(160 84% 39%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-muted-foreground text-sm py-8 text-center">No data available</p>}
        </div>
      </div>

      {/* Low Stock */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <p className="text-sm font-medium text-foreground">Low Stock Report</p>
        </div>
        {lowStock.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border/50">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Price</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((item: any, i: number) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-foreground">{item.name}</td>
                    <td className="px-4 py-3 font-mono text-destructive font-medium">{item.stock_quantity}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground hidden md:table-cell">${Number(item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-muted-foreground text-sm py-4 text-center">No low stock items</p>}
      </div>
    </div>
  );
};

export default ReportsPage;

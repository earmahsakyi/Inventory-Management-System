import { useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getSalesByProduct, getSalesByDate } from "@/store/reportSlice";
import { formatGHS } from "@/lib/format";

const tooltipStyle = {
  background: "hsl(220 40% 13%)",
  border: "1px solid hsl(217 33% 20%)",
  borderRadius: 8,
  color: "hsl(210 40% 98%)",
};

const formatAxisGHS = (value: number) =>
  `GH₵${value.toLocaleString("en-GH")}`;

const formatAxisDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GH", { month: "short", day: "numeric" });
};

const DashboardCharts = () => {
  const dispatch = useAppDispatch();
  const { salesByProduct, salesByDate } = useAppSelector((state) => state.report);

  useEffect(() => {
    dispatch(getSalesByProduct());
    dispatch(getSalesByDate());
  }, [dispatch]);

  // Top 8 products by revenue for the bar chart
  const revenueData = [...salesByProduct]
    .sort((a, b) => b.total_sales - a.total_sales)
    .slice(0, 8)
    .map((p) => ({
      name: p.product_name.length > 12
        ? p.product_name.slice(0, 12) + "…"
        : p.product_name,
      revenue: Number(p.total_sales),
    }));

  // Last 14 days for the line chart, sorted oldest → newest
  const trendData = [...salesByDate]
    .sort((a, b) => new Date(a.sale_date).getTime() - new Date(b.sale_date).getTime())
    .slice(-14)
    .map((d) => ({
      day: formatAxisDate(d.sale_date),
      revenue: Number(d.total_revenue),
      sales: d.total_transactions,
    }));

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Revenue by Product */}
      <div className="glass-card p-5">
        <p className="text-sm font-medium text-foreground mb-4">Revenue by Product</p>
        {revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 20%)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                angle={-15}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatAxisGHS}
                width={80}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => [formatGHS(value), "Revenue"]}
              />
              <Bar dataKey="revenue" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-sm py-8 text-center">No data available</p>
        )}
      </div>

      {/* Sales Trend */}
      <div className="glass-card p-5">
        <p className="text-sm font-medium text-foreground mb-4">Sales Trend (Last 14 Days)</p>
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 20%)" />
              <XAxis
                dataKey="day"
                tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatAxisGHS}
                width={80}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number, name: string) => [
                  name === "revenue" ? formatGHS(value) : value,
                  name === "revenue" ? "Revenue" : "Transactions",
                ]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(160 84% 39%)"
                strokeWidth={2}
                dot={{ fill: "hsl(160 84% 39%)", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-sm py-8 text-center">No data available</p>
        )}
      </div>
    </div>
  );
};

export default DashboardCharts;
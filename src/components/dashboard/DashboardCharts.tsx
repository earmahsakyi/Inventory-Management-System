import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 4200 }, { month: "Feb", revenue: 5800 },
  { month: "Mar", revenue: 4900 }, { month: "Apr", revenue: 7200 },
  { month: "May", revenue: 6100 }, { month: "Jun", revenue: 8400 },
  { month: "Jul", revenue: 7800 }, { month: "Aug", revenue: 9200 },
];

const salesData = [
  { day: "Mon", sales: 42 }, { day: "Tue", sales: 58 },
  { day: "Wed", sales: 35 }, { day: "Thu", sales: 72 },
  { day: "Fri", sales: 64 }, { day: "Sat", sales: 89 },
  { day: "Sun", sales: 51 },
];

const tooltipStyle = {
  background: "hsl(220 40% 13%)",
  border: "1px solid hsl(217 33% 20%)",
  borderRadius: 8,
  color: "hsl(210 40% 98%)",
};

const DashboardCharts = () => (
  <div className="grid lg:grid-cols-2 gap-6">
    <div className="glass-card p-5">
      <p className="text-sm font-medium text-foreground mb-4">Revenue Overview</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 20%)" />
          <XAxis dataKey="month" tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="revenue" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="glass-card p-5">
      <p className="text-sm font-medium text-foreground mb-4">Sales Trend</p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 20%)" />
          <XAxis dataKey="day" tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="sales" stroke="hsl(160 84% 39%)" strokeWidth={2} dot={{ fill: "hsl(160 84% 39%)", r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default DashboardCharts;

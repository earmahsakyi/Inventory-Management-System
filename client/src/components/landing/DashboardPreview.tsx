import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle } from "lucide-react";

const barData = [
  { name: "Jan", revenue: 4200 }, { name: "Feb", revenue: 5800 },
  { name: "Mar", revenue: 4900 }, { name: "Apr", revenue: 7200 },
  { name: "May", revenue: 6100 }, { name: "Jun", revenue: 8400 },
];

const lineData = [
  { name: "Mon", sales: 42 }, { name: "Tue", sales: 58 },
  { name: "Wed", sales: 35 }, { name: "Thu", sales: 72 },
  { name: "Fri", sales: 64 }, { name: "Sat", sales: 89 },
  { name: "Sun", sales: 51 },
];

const salesRows = [
  { id: "#2401", customer: "Acme Corp", product: "Widget Pro", amount: "$1,240", status: "Completed" },
  { id: "#2402", customer: "TechStart Inc", product: "Sensor Kit", amount: "$890", status: "Processing" },
  { id: "#2403", customer: "Global Retail", product: "Display Unit", amount: "$2,100", status: "Completed" },
];

const lowStock = [
  { name: "USB-C Cable 2m", stock: 3, min: 20 },
  { name: "LED Panel 60W", stock: 5, min: 15 },
  { name: "Thermal Paste 10g", stock: 8, min: 25 },
];

const CountUp = ({ target, prefix = "" }: { target: number; prefix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref} className="font-mono text-2xl font-bold text-foreground">{prefix}{count.toLocaleString()}</span>;
};

const DashboardPreview = () => (
  <section id="preview" className="py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 space-y-4"
      >
        <p className="text-sm font-medium text-primary tracking-wide uppercase">Dashboard Preview</p>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
          Powerful insights at a glance
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-card p-6 lg:p-8 space-y-6"
      >
        {/* Revenue counter */}
        <div className="flex flex-wrap gap-8 mb-2">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Revenue</p>
            <CountUp target={48200} prefix="$" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Sales</p>
            <CountUp target={1284} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Active Suppliers</p>
            <CountUp target={64} />
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-4">
            <p className="text-sm font-medium text-foreground mb-4">Monthly Revenue</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 20%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(220 40% 13%)", border: "1px solid hsl(217 33% 20%)", borderRadius: 8, color: "hsl(210 40% 98%)" }}
                />
                <Bar dataKey="revenue" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm font-medium text-foreground mb-4">Weekly Sales</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 20%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(220 40% 13%)", border: "1px solid hsl(217 33% 20%)", borderRadius: 8, color: "hsl(210 40% 98%)" }}
                />
                <Line type="monotone" dataKey="sales" stroke="hsl(160 84% 39%)" strokeWidth={2} dot={{ fill: "hsl(160 84% 39%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent sales table */}
          <div className="lg:col-span-2 glass-card p-4">
            <p className="text-sm font-medium text-foreground mb-3">Recent Sales</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border/50">
                    <th className="pb-2 pr-4 font-medium">Order</th>
                    <th className="pb-2 pr-4 font-medium">Customer</th>
                    <th className="pb-2 pr-4 font-medium">Product</th>
                    <th className="pb-2 pr-4 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {salesRows.map((row) => (
                    <tr key={row.id} className="border-b border-border/30">
                      <td className="py-2.5 pr-4 font-mono text-xs text-muted-foreground">{row.id}</td>
                      <td className="py-2.5 pr-4 text-foreground">{row.customer}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{row.product}</td>
                      <td className="py-2.5 pr-4 font-mono text-foreground">{row.amount}</td>
                      <td className="py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          row.status === "Completed"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low stock alert */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <p className="text-sm font-medium text-foreground">Low Stock Alert</p>
            </div>
            <div className="space-y-3">
              {lowStock.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Min: {item.min} units</p>
                  </div>
                  <span className="font-mono text-sm text-destructive font-medium">{item.stock}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default DashboardPreview;

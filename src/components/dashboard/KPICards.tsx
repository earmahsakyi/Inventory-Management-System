import { DollarSign, Package, Truck, ShoppingCart, TrendingUp, TrendingDown } from "lucide-react";

const kpis = [
  { label: "Total Revenue", value: "$48,250", change: "+12.5%", trend: "up" as const, icon: DollarSign },
  { label: "Total Products", value: "1,284", change: "+3.2%", trend: "up" as const, icon: Package },
  { label: "Active Suppliers", value: "64", change: "+2", trend: "up" as const, icon: Truck },
  { label: "Sales Today", value: "326", change: "-4.1%", trend: "down" as const, icon: ShoppingCart },
];

const KPICards = () => (
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
          <span className={`flex items-center gap-0.5 text-xs font-medium ${
            kpi.trend === "up" ? "text-success" : "text-destructive"
          }`}>
            {kpi.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {kpi.change}
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default KPICards;

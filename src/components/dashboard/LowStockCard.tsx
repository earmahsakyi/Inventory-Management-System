import { AlertTriangle } from "lucide-react";

const items = [
  { name: "USB-C Cable 2m", stock: 3, min: 20 },
  { name: "LED Panel 60W", stock: 5, min: 15 },
  { name: "Thermal Paste 10g", stock: 8, min: 25 },
  { name: "HDMI Adapter 4K", stock: 4, min: 12 },
];

const LowStockCard = () => (
  <div className="glass-card p-5">
    <div className="flex items-center gap-2 mb-4">
      <AlertTriangle className="h-4 w-4 text-warning" />
      <p className="text-sm font-medium text-foreground">Low Stock Alert</p>
    </div>
    <div className="space-y-3">
      {items.map((item) => {
        const percentage = (item.stock / item.min) * 100;
        return (
          <div key={item.name} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground">{item.name}</p>
              <span className="font-mono text-xs text-destructive font-medium">{item.stock} left</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-destructive/70 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default LowStockCard;

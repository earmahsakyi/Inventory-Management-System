import { AlertTriangle } from "lucide-react";
import { useAppSelector } from "@/store/store";

// Products below this quantity are considered low stock
const LOW_STOCK_THRESHOLD = 10;

const LowStockCard = () => {
  const { products } = useAppSelector((state) => state.product);

  // No need to fetch here — products are already loaded by the dashboard/ProductsPage
  const lowStock = [...products]
    .filter((p) => p.stock_quantity < LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stock_quantity - b.stock_quantity)
    .slice(0, 5);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <p className="text-sm font-medium text-foreground">Low Stock Alert</p>
        {lowStock.length > 0 && (
          <span className="ml-auto text-xs font-medium bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
            {lowStock.length} item{lowStock.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {lowStock.length > 0 ? (
        <div className="space-y-3">
          {lowStock.map((item) => {
            const percentage = Math.min((item.stock_quantity / LOW_STOCK_THRESHOLD) * 100, 100);
            return (
              <div key={item.product_id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground truncate max-w-[70%]">{item.name}</p>
                  <span className="font-mono text-xs text-destructive font-medium">
                    {item.stock_quantity} left
                  </span>
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
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          All products are well stocked.
        </p>
      )}
    </div>
  );
};

export default LowStockCard;
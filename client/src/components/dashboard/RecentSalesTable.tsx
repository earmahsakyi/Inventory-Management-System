import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getAllSales } from "@/store/saleSlice";
import { formatGHS } from "../../lib/format";

const statusColors: Record<string, string> = {
  Completed: "bg-success/10 text-success",
  Processing: "bg-warning/10 text-warning",
  Shipped: "bg-primary/10 text-primary",
};

const getRelativeDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

const RecentSalesTable = () => {
  const dispatch = useAppDispatch();
  const { sales } = useAppSelector((state) => state.sale);

  useEffect(() => {
    dispatch(getAllSales({ limit: 10 }));
  }, [dispatch]);

  // Most recent 5 sales
  const recent = [...sales]
    .sort((a, b) => new Date(b.sale_date!).getTime() - new Date(a.sale_date!).getTime())
    .slice(0, 5);

  return (
    <div className="glass-card p-5">
      <p className="text-sm font-medium text-foreground mb-4">Recent Sales</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border/50">
              <th className="pb-3 pr-4 font-medium">Sale #</th>
              <th className="pb-3 pr-4 font-medium">Created By</th>
              <th className="pb-3 pr-4 font-medium">Amount</th>
              <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Date</th>
              <th className="pb-3 font-medium">Items</th>
            </tr>
          </thead>
          <tbody>
            {recent.length > 0 ? (
              recent.map((s) => (
                <tr
                  key={s.sale_id}
                  className="border-b border-border/30 hover:bg-muted/20 transition-colors duration-150"
                >
                  <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
                    #{s.sale_id}
                  </td>
                  <td className="py-3 pr-4 text-foreground">
                    {s.created_by || "—"}
                  </td>
                  <td className="py-3 pr-4 font-mono text-foreground">
                    {formatGHS(Number(s.total_amount))}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground hidden sm:table-cell">
                    {s.sale_date ? getRelativeDate(s.sale_date) : "—"}
                  </td>
                  <td className="py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors["Completed"]}`}>
                      Completed
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No sales recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentSalesTable;
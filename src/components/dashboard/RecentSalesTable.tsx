const sales = [
  { id: "#INV-2401", customer: "Acme Corp", product: "Widget Pro X", amount: "$1,240.00", date: "Today", status: "Completed" },
  { id: "#INV-2402", customer: "TechStart Inc", product: "Sensor Kit v3", amount: "$890.00", date: "Today", status: "Processing" },
  { id: "#INV-2403", customer: "Global Retail", product: "Display Unit HD", amount: "$2,100.00", date: "Yesterday", status: "Completed" },
  { id: "#INV-2404", customer: "Nova Systems", product: "Power Module", amount: "$456.00", date: "Yesterday", status: "Completed" },
  { id: "#INV-2405", customer: "BuildRight Co", product: "Cable Harness", amount: "$1,890.00", date: "2 days ago", status: "Shipped" },
];

const statusColors: Record<string, string> = {
  Completed: "bg-success/10 text-success",
  Processing: "bg-warning/10 text-warning",
  Shipped: "bg-primary/10 text-primary",
};

const RecentSalesTable = () => (
  <div className="glass-card p-5">
    <p className="text-sm font-medium text-foreground mb-4">Recent Sales</p>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground border-b border-border/50">
            <th className="pb-3 pr-4 font-medium">Order</th>
            <th className="pb-3 pr-4 font-medium">Customer</th>
            <th className="pb-3 pr-4 font-medium hidden md:table-cell">Product</th>
            <th className="pb-3 pr-4 font-medium">Amount</th>
            <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Date</th>
            <th className="pb-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors duration-150">
              <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{s.id}</td>
              <td className="py-3 pr-4 text-foreground">{s.customer}</td>
              <td className="py-3 pr-4 text-muted-foreground hidden md:table-cell">{s.product}</td>
              <td className="py-3 pr-4 font-mono text-foreground">{s.amount}</td>
              <td className="py-3 pr-4 text-muted-foreground hidden sm:table-cell">{s.date}</td>
              <td className="py-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[s.status] || ""}`}>
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentSalesTable;

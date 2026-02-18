import { useState, useEffect, useMemo } from "react";
import { Plus, Eye } from "lucide-react";
import { salesApi, productsApi } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import FormModal from "@/components/dashboard/FormModal";
import FormFieldComponent from "@/components/dashboard/FormField";
import { toast } from "@/hooks/use-toast";

interface Sale {
  sale_id: number;
  sale_date: string;
  total_amount: number;
  created_by: string;
  items?: any[];
}

interface SaleItem {
  product_id: string;
  quantity: string;
  price: string;
}

const SalesPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<{ product_id: number; name: string; price: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([{ product_id: "", quantity: "1", price: "" }]);
  const [detailSale, setDetailSale] = useState<Sale | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salesRes, prodRes] = await Promise.all([salesApi.getAll(), productsApi.getAll()]);
      setSales(Array.isArray(salesRes.data) ? salesRes.data : salesRes.data.data || []);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.data || []);
    } catch { setSales([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => sales.filter((s) =>
    String(s.sale_id).includes(search) || s.created_by?.toLowerCase().includes(search.toLowerCase())
  ), [sales, search]);

  const addItem = () => setSaleItems([...saleItems, { product_id: "", quantity: "1", price: "" }]);
  const removeItem = (i: number) => setSaleItems(saleItems.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: string, value: string) => {
    const updated = [...saleItems];
    (updated[i] as any)[field] = value;
    if (field === "product_id") {
      const prod = products.find((p) => p.product_id === parseInt(value));
      if (prod) updated[i].price = String(prod.price);
    }
    setSaleItems(updated);
  };

  const total = saleItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const items = saleItems.map((si) => ({
      product_id: parseInt(si.product_id),
      quantity: parseInt(si.quantity),
      price: parseFloat(si.price),
      total: parseFloat(si.price) * parseInt(si.quantity),
    }));
    try {
      await salesApi.create({ total_amount: total, items });
      toast({ title: "Sale recorded" });
      setModalOpen(false);
      setSaleItems([{ product_id: "", quantity: "1", price: "" }]);
      fetchData();
    } catch { toast({ title: "Error recording sale", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const viewDetail = async (id: number) => {
    try {
      const { data } = await salesApi.getById(id);
      setDetailSale(data);
    } catch { toast({ title: "Error loading sale details", variant: "destructive" }); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Sales" description="Track and record sales" action={
        <button onClick={() => { setModalOpen(true); setSaleItems([{ product_id: "", quantity: "1", price: "" }]); }} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> New Sale</button>
      } />
      <DataTable
        columns={[
          { key: "sale_id", label: "Sale #", render: (s) => <span className="font-mono text-xs text-muted-foreground">#{s.sale_id}</span> },
          { key: "sale_date", label: "Date", render: (s) => <span className="text-foreground">{new Date(s.sale_date).toLocaleDateString()}</span> },
          { key: "total_amount", label: "Total", render: (s) => <span className="font-mono text-foreground font-medium">${Number(s.total_amount).toFixed(2)}</span> },
          { key: "created_by", label: "Created By", render: (s) => <span className="text-muted-foreground">{s.created_by || "—"}</span>, className: "hidden md:table-cell" },
          { key: "actions", label: "", render: (s) => (
            <button onClick={() => viewDetail(s.sale_id)} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></button>
          )},
        ]}
        data={filtered} loading={loading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search sales..." emptyMessage="No sales found."
      />

      {/* New Sale Modal */}
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Record New Sale" onSubmit={handleSubmit} loading={saving}>
        <div className="space-y-3">
          {saleItems.map((item, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1">
                <FormFieldComponent label="Product" name="product_id" value={item.product_id} onChange={(e) => updateItem(i, "product_id", e.target.value)} as="select" required options={products.map((p) => ({ value: p.product_id, label: `${p.name} ($${p.price})` }))} />
              </div>
              <div className="w-20">
                <FormFieldComponent label="Qty" name="quantity" value={item.quantity} onChange={(e) => updateItem(i, "quantity", e.target.value)} type="number" required min={1} />
              </div>
              <div className="w-24">
                <FormFieldComponent label="Price" name="price" value={item.price} onChange={(e) => updateItem(i, "price", e.target.value)} type="number" required step="0.01" />
              </div>
              {saleItems.length > 1 && (
                <button type="button" onClick={() => removeItem(i)} className="pb-0.5 text-destructive text-xs hover:underline">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addItem} className="text-sm text-primary hover:underline">+ Add Item</button>
          <div className="text-right pt-2 border-t border-border/50">
            <span className="text-sm text-muted-foreground">Total: </span>
            <span className="font-mono text-lg font-bold text-foreground">${total.toFixed(2)}</span>
          </div>
        </div>
      </FormModal>

      {/* Sale Detail Modal */}
      {detailSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setDetailSale(null)} />
          <div className="relative glass-card w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Sale #{detailSale.sale_id}</h2>
            <p className="text-sm text-muted-foreground mb-1">Date: {new Date(detailSale.sale_date).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mb-4">Total: <span className="font-mono text-foreground font-medium">${Number(detailSale.total_amount).toFixed(2)}</span></p>
            {detailSale.items && detailSale.items.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Items:</p>
                {detailSale.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm text-muted-foreground">
                    <span>{item.product_name || `Product #${item.product_id}`} × {item.quantity}</span>
                    <span className="font-mono">${Number(item.total).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setDetailSale(null)} className="mt-4 w-full px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:bg-muted/50 transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;

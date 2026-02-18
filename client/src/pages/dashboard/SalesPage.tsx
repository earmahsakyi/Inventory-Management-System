import { useState, useEffect, useMemo } from "react";
import { Plus, Eye } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import FormModal from "@/components/dashboard/FormModal";
import FormFieldComponent from "@/components/dashboard/FormField";
import { toast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  createSale,
  getAllSales,
  getSaleById,
  clearError,
  clearMessage,
  clearSale,
} from "@/store/saleSlice";
import { getAllProducts } from "@/store/productSlice";

interface SaleItem {
  product_id: string;
  quantity: string;
  price: string;
}

const emptyItem: SaleItem = { product_id: "", quantity: "1", price: "" };

const SalesPage = () => {
  const dispatch = useAppDispatch();
  const { sales, sale, loading, error, message } = useAppSelector((state) => state.sale);
  const { products } = useAppSelector((state) => state.product);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([emptyItem]);
  const [detailOpen, setDetailOpen] = useState(false);

  // Fetch sales and products on mount
  useEffect(() => {
    dispatch(getAllSales({}));
    dispatch(getAllProducts({}));
  }, [dispatch]);

  // Show error toast from Redux
  useEffect(() => {
    if (error) {
      toast({ title: error, variant: "destructive" });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Show success toast from Redux
  useEffect(() => {
    if (message) {
      toast({ title: message });
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  const filtered = useMemo(
    () =>
      sales.filter(
        (s) =>
          String(s.sale_id).includes(search) ||
          s.created_by?.toLowerCase().includes(search.toLowerCase())
      ),
    [sales, search]
  );

  // Sale item helpers
  const addItem = () => setSaleItems([...saleItems, { ...emptyItem }]);

  const removeItem = (i: number) =>
    setSaleItems(saleItems.filter((_, idx) => idx !== i));

  const updateItem = (i: number, field: string, value: string) => {
    const updated = [...saleItems];
    updated[i] = { ...updated[i], [field]: value };
    // Auto-fill price when product is selected
    if (field === "product_id") {
      const prod = products.find((p) => p.product_id === parseInt(value));
      if (prod) updated[i].price = String(prod.price);
    }
    setSaleItems(updated);
  };

  const total = saleItems.reduce(
    (sum, item) =>
      sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Backend only needs product_id and quantity — price/total computed server-side
    const items = saleItems.map((si) => ({
      product_id: parseInt(si.product_id),
      quantity: parseInt(si.quantity),
    }));
    try {
      await dispatch(createSale({ items })).unwrap();
      setModalOpen(false);
      setSaleItems([{ ...emptyItem }]);
      dispatch(getAllSales({}));
    } catch {
      // error toast handled by the error useEffect above
    } finally {
      setSaving(false);
    }
  };

  const viewDetail = async (id: number) => {
    await dispatch(getSaleById(id)).unwrap().catch(() => {});
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    dispatch(clearSale());
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales"
        description="Track and record sales"
        action={
          <button
            onClick={() => {
              setSaleItems([{ ...emptyItem }]);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> New Sale
          </button>
        }
      />
      <DataTable
        columns={[
          {
            key: "sale_id",
            label: "Sale #",
            render: (s) => (
              <span className="font-mono text-xs text-muted-foreground">
                #{s.sale_id}
              </span>
            ),
          },
          {
            key: "sale_date",
            label: "Date",
            render: (s) => (
              <span className="text-foreground">
                {new Date(s.sale_date!).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "total_amount",
            label: "Total",
            render: (s) => (
              <span className="font-mono text-foreground font-medium">
                ${Number(s.total_amount).toFixed(2)}
              </span>
            ),
          },
          {
            key: "created_by",
            label: "Created By",
            render: (s) => (
              <span className="text-muted-foreground">{s.created_by || "—"}</span>
            ),
            className: "hidden md:table-cell",
          },
          {
            key: "actions",
            label: "",
            render: (s) => (
              <button
                onClick={() => viewDetail(s.sale_id)}
                className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            ),
          },
        ]}
        data={filtered}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search sales..."
        emptyMessage="No sales found."
      />

      {/* New Sale Modal */}
      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record New Sale"
        onSubmit={handleSubmit}
        loading={saving}
      >
        <div className="space-y-3">
          {saleItems.map((item, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1">
                <FormFieldComponent
                  label="Product"
                  name="product_id"
                  value={item.product_id}
                  onChange={(e) => updateItem(i, "product_id", e.target.value)}
                  as="select"
                  required
                  options={products.map((p) => ({
                    value: p.product_id,
                    label: `${p.name} ($${p.price})`,
                  }))}
                />
              </div>
              <div className="w-20">
                <FormFieldComponent
                  label="Qty"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, "quantity", e.target.value)}
                  type="number"
                  required
                  min={1}
                />
              </div>
              <div className="w-24">
                <FormFieldComponent
                  label="Price"
                  name="price"
                  value={item.price}
                  onChange={(e) => updateItem(i, "price", e.target.value)}
                  type="number"
                  required
                  step="0.01"
                />
              </div>
              {saleItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="pb-0.5 text-destructive text-xs hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="text-sm text-primary hover:underline"
          >
            + Add Item
          </button>
          <div className="text-right pt-2 border-t border-border/50">
            <span className="text-sm text-muted-foreground">Total: </span>
            <span className="font-mono text-lg font-bold text-foreground">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </FormModal>

      {/* Sale Detail Modal */}
      {detailOpen && sale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={closeDetail}
          />
          <div className="relative glass-card w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
              Sale #{sale.sale_id}
            </h2>
            <p className="text-sm text-muted-foreground mb-1">
              Date: {new Date(sale.sale_date!).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Total:{" "}
              <span className="font-mono text-foreground font-medium">
                ${Number(sale.total_amount).toFixed(2)}
              </span>
            </p>
            {sale.items && sale.items.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Items:</p>
                {sale.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm text-muted-foreground"
                  >
                    <span>
                      {item.product_name || `Product #${item.product_id}`} ×{" "}
                      {item.quantity}
                    </span>
                    <span className="font-mono">
                      ${Number(item.total).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={closeDetail}
              className="mt-4 w-full px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;
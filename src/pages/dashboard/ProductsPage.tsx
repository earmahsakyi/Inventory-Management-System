import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { productsApi, suppliersApi, categoriesApi } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import FormModal from "@/components/dashboard/FormModal";
import FormFieldComponent from "@/components/dashboard/FormField";
import { toast } from "@/hooks/use-toast";

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  supplier_id: number;
  category_id: number;
  supplier_name?: string;
  category_name?: string;
}

const empty = { name: "", description: "", price: "", stock_quantity: "", supplier_id: "", category_id: "" };

const ProductsPage = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<{ supplier_id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ category_id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, supRes, catRes] = await Promise.all([productsApi.getAll(), suppliersApi.getAll(), categoriesApi.getAll()]);
      setItems(Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.data || []);
      setSuppliers(Array.isArray(supRes.data) ? supRes.data : supRes.data.data || []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.data || []);
    } catch { setItems([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())), [items, search]);

  const handleChange = (e: React.ChangeEvent<any>) => setForm({ ...form, [e.target.name]: e.target.value });
  const openCreate = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || "", price: String(p.price), stock_quantity: String(p.stock_quantity), supplier_id: String(p.supplier_id), category_id: String(p.category_id) });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, price: parseFloat(form.price), stock_quantity: parseInt(form.stock_quantity), supplier_id: parseInt(form.supplier_id), category_id: parseInt(form.category_id) };
    try {
      if (editing) { await productsApi.update(editing.product_id, payload); toast({ title: "Product updated" }); }
      else { await productsApi.create(payload); toast({ title: "Product created" }); }
      setModalOpen(false); fetchData();
    } catch { toast({ title: "Error saving product", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try { await productsApi.delete(id); toast({ title: "Product deleted" }); fetchData(); }
    catch { toast({ title: "Error deleting product", variant: "destructive" }); }
  };

  const getSupplierName = (id: number) => suppliers.find((s) => s.supplier_id === id)?.name || "—";
  const getCategoryName = (id: number) => categories.find((c) => c.category_id === id)?.name || "—";

  return (
    <div className="space-y-6">
      <PageHeader title="Products" description="Manage your product inventory" action={
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Add Product</button>
      } />
      <DataTable
        columns={[
          { key: "name", label: "Product", render: (p) => <span className="text-foreground font-medium">{p.name}</span> },
          { key: "price", label: "Price", render: (p) => <span className="font-mono text-foreground">${Number(p.price).toFixed(2)}</span> },
          { key: "stock_quantity", label: "Stock", render: (p) => (
            <span className={`font-mono ${p.stock_quantity < 10 ? "text-destructive" : "text-foreground"}`}>{p.stock_quantity}</span>
          )},
          { key: "supplier", label: "Supplier", render: (p) => <span className="text-muted-foreground">{p.supplier_name || getSupplierName(p.supplier_id)}</span>, className: "hidden md:table-cell" },
          { key: "category", label: "Category", render: (p) => <span className="text-muted-foreground">{p.category_name || getCategoryName(p.category_id)}</span>, className: "hidden lg:table-cell" },
          { key: "actions", label: "", render: (p) => (
            <div className="flex items-center gap-1 justify-end">
              <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
              <button onClick={() => handleDelete(p.product_id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
            </div>
          )},
        ]}
        data={filtered} loading={loading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search products..." emptyMessage="No products found."
      />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Product" : "Add Product"} onSubmit={handleSubmit} loading={saving}>
        <FormFieldComponent label="Name" name="name" value={form.name} onChange={handleChange} required placeholder="Product name" />
        <FormFieldComponent label="Description" name="description" value={form.description} onChange={handleChange} as="textarea" placeholder="Product description" />
        <div className="grid grid-cols-2 gap-4">
          <FormFieldComponent label="Price" name="price" value={form.price} onChange={handleChange} type="number" required min={0} step="0.01" placeholder="0.00" />
          <FormFieldComponent label="Stock Qty" name="stock_quantity" value={form.stock_quantity} onChange={handleChange} type="number" required min={0} placeholder="0" />
        </div>
        <FormFieldComponent label="Supplier" name="supplier_id" value={form.supplier_id} onChange={handleChange} as="select" required options={suppliers.map((s) => ({ value: s.supplier_id, label: s.name }))} />
        <FormFieldComponent label="Category" name="category_id" value={form.category_id} onChange={handleChange} as="select" required options={categories.map((c) => ({ value: c.category_id, label: c.name }))} />
      </FormModal>
    </div>
  );
};

export default ProductsPage;

import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { suppliersApi } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import FormModal from "@/components/dashboard/FormModal";
import FormFieldComponent from "@/components/dashboard/FormField";
import { toast } from "@/hooks/use-toast";

interface Supplier {
  supplier_id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const emptySupplier = { name: "", email: "", phone: "", address: "" };

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState(emptySupplier);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await suppliersApi.getAll();
      setSuppliers(Array.isArray(data) ? data : data.data || []);
    } catch { setSuppliers([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() =>
    suppliers.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase())),
    [suppliers, search]
  );

  const handleChange = (e: React.ChangeEvent<any>) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => { setEditing(null); setForm(emptySupplier); setModalOpen(true); };
  const openEdit = (s: Supplier) => { setEditing(s); setForm({ name: s.name, email: s.email || "", phone: s.phone || "", address: s.address || "" }); setModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await suppliersApi.update(editing.supplier_id, form);
        toast({ title: "Supplier updated" });
      } else {
        await suppliersApi.create(form);
        toast({ title: "Supplier created" });
      }
      setModalOpen(false);
      fetchData();
    } catch { toast({ title: "Error saving supplier", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this supplier?")) return;
    try {
      await suppliersApi.delete(id);
      toast({ title: "Supplier deleted" });
      fetchData();
    } catch { toast({ title: "Error deleting supplier", variant: "destructive" }); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Suppliers" description="Manage your suppliers" action={
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Supplier
        </button>
      } />
      <DataTable
        columns={[
          { key: "name", label: "Name", render: (s) => <span className="text-foreground font-medium">{s.name}</span> },
          { key: "email", label: "Email", render: (s) => <span className="text-muted-foreground">{s.email || "—"}</span> },
          { key: "phone", label: "Phone", render: (s) => <span className="text-muted-foreground">{s.phone || "—"}</span>, className: "hidden md:table-cell" },
          { key: "address", label: "Address", render: (s) => <span className="text-muted-foreground truncate max-w-[200px] block">{s.address || "—"}</span>, className: "hidden lg:table-cell" },
          { key: "actions", label: "", render: (s) => (
            <div className="flex items-center gap-1 justify-end">
              <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
              <button onClick={() => handleDelete(s.supplier_id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
            </div>
          )},
        ]}
        data={filtered}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search suppliers..."
        emptyMessage="No suppliers found."
      />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Supplier" : "Add Supplier"} onSubmit={handleSubmit} loading={saving}>
        <FormFieldComponent label="Name" name="name" value={form.name} onChange={handleChange} required placeholder="Supplier name" />
        <FormFieldComponent label="Email" name="email" value={form.email} onChange={handleChange} type="email" placeholder="email@example.com" />
        <FormFieldComponent label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890" />
        <FormFieldComponent label="Address" name="address" value={form.address} onChange={handleChange} as="textarea" placeholder="Full address" />
      </FormModal>
    </div>
  );
};

export default SuppliersPage;

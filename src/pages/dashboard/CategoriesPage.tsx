import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { categoriesApi } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable from "@/components/dashboard/DataTable";
import FormModal from "@/components/dashboard/FormModal";
import FormFieldComponent from "@/components/dashboard/FormField";
import { toast } from "@/hooks/use-toast";

interface Category {
  category_id: number;
  name: string;
  description: string;
}

const empty = { name: "", description: "" };

const CategoriesPage = () => {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try { setLoading(true); const { data } = await categoriesApi.getAll(); setItems(Array.isArray(data) ? data : data.data || []); }
    catch { setItems([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => items.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())), [items, search]);

  const handleChange = (e: React.ChangeEvent<any>) => setForm({ ...form, [e.target.name]: e.target.value });
  const openCreate = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, description: c.description || "" }); setModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await categoriesApi.update(editing.category_id, form); toast({ title: "Category updated" }); }
      else { await categoriesApi.create(form); toast({ title: "Category created" }); }
      setModalOpen(false); fetchData();
    } catch { toast({ title: "Error saving category", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    try { await categoriesApi.delete(id); toast({ title: "Category deleted" }); fetchData(); }
    catch { toast({ title: "Error deleting category", variant: "destructive" }); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" description="Manage product categories" action={
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Add Category</button>
      } />
      <DataTable
        columns={[
          { key: "name", label: "Name", render: (c) => <span className="text-foreground font-medium">{c.name}</span> },
          { key: "description", label: "Description", render: (c) => <span className="text-muted-foreground truncate max-w-[300px] block">{c.description || "—"}</span> },
          { key: "actions", label: "", render: (c) => (
            <div className="flex items-center gap-1 justify-end">
              <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
              <button onClick={() => handleDelete(c.category_id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
            </div>
          )},
        ]}
        data={filtered} loading={loading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search categories..." emptyMessage="No categories found."
      />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "Add Category"} onSubmit={handleSubmit} loading={saving}>
        <FormFieldComponent label="Name" name="name" value={form.name} onChange={handleChange} required placeholder="Category name" />
        <FormFieldComponent label="Description" name="description" value={form.description} onChange={handleChange} as="textarea" placeholder="Category description" />
      </FormModal>
    </div>
  );
};

export default CategoriesPage;

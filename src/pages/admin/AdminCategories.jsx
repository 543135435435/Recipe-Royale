import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Loader2 } from 'lucide-react';
import AnimatedSection from '../../components/animations/AnimatedSection';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { categoryService } from '../../services/recipeService';
import { toast } from 'sonner';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data.data || []);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openForm = (cat = null) => {
    setEditCat(cat);
    setFormName(cat?.name || '');
    setFormDesc(cat?.description || '');
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editCat) {
        await categoryService.updateCategory(editCat.id, { name: formName, description: formDesc });
        toast.success('Category updated');
      } else {
        await categoryService.createCategory({ name: formName, description: formDesc });
        toast.success('Category created');
      }
      setShowForm(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await categoryService.deleteCategory(deleteId); setCategories(categories.filter((c) => c.id !== deleteId)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
    setDeleteId(null);
  };

  return (
    <div>
      <AnimatedSection className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-serif text-charcoal dark:text-white">Categories</h1>
        <button onClick={() => openForm()} className="flex items-center gap-2 px-4 py-2 bg-gold text-white text-sm font-medium rounded-full hover:bg-gold-dark">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </AnimatedSection>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6">
          <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Category name" required
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm mb-3 focus:ring-2 focus:ring-gold" />
          <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Description" rows={2}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm mb-3 focus:ring-2 focus:ring-gold resize-none" />
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-5 py-2 bg-gold text-white text-sm font-medium rounded-lg hover:bg-gold-dark disabled:opacity-50 flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editCat ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-gray-700">
        {loading ? <p className="p-6 text-center text-gray-400">Loading...</p> : categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
            <div>
              <h3 className="font-medium text-charcoal dark:text-white">{cat.name}</h3>
              {cat.description && <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => openForm(cat)} className="p-2 text-gray-400 hover:text-gold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Edit className="w-4 h-4" /></button>
              <button onClick={() => setDeleteId(cat.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Category" message="This will permanently delete this category." />
    </div>
  );
}

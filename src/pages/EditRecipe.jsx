import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Plus, Trash2, Save } from 'lucide-react';
import PageTransition from '../components/animations/PageTransition';
import AnimatedSection from '../components/animations/AnimatedSection';
import { recipeService } from '../services/recipeService';
import { toast } from 'sonner';
import { CUISINES, DIFFICULTIES } from '../constants';

const inputClass = 'w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-charcoal dark:text-white focus:ring-2 focus:ring-gold focus:border-transparent transition-all';

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', coverImage: '', cuisine: '', difficulty: 'medium',
    prepTime: 0, cookTime: 0, servings: 4, tags: '',
  });
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await recipeService.getRecipeById(id);
        const r = res.data.data;
        setForm({
          title: r.title, description: r.description, coverImage: r.coverImage || '',
          cuisine: r.cuisine, difficulty: r.difficulty, prepTime: r.prepTime, cookTime: r.cookTime,
          servings: r.servings, tags: (r.tags || []).join(', '),
        });
        setIngredients(r.ingredients || []);
        setInstructions(r.instructions || []);
      } catch { toast.error('Recipe not found'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await recipeService.updateRecipe(id, {
        ...form,
        prepTime: Number(form.prepTime), cookTime: Number(form.cookTime), servings: Number(form.servings),
        ingredients: ingredients.filter((i) => i.name.trim()),
        instructions: instructions.filter((i) => i.description.trim()),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      toast.success('Recipe updated!');
      navigate(`/recipes/${id}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;

  return (
    <PageTransition>
      <div className="min-h-screen py-10 bg-cream dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4">
          <AnimatedSection className="mb-8">
            <h1 className="text-3xl font-bold font-serif text-charcoal dark:text-white">Edit Recipe</h1>
          </AnimatedSection>
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8 space-y-4">
            <Field label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} required /></Field>
            <Field label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass + ' resize-none'} rows={3} required /></Field>
            <Field label="Cover Image URL"><input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} className={inputClass} /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Cuisine">
                <select value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} className={inputClass}>
                  {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Difficulty">
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className={inputClass}>
                  {DIFFICULTIES.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
              </Field>
              <Field label="Prep Time (min)"><input type="number" value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} className={inputClass} /></Field>
              <Field label="Cook Time (min)"><input type="number" value={form.cookTime} onChange={(e) => setForm({ ...form, cookTime: e.target.value })} className={inputClass} /></Field>
            </div>
            <Field label="Tags"><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputClass} placeholder="tag1, tag2" /></Field>

            <div>
              <h3 className="font-semibold text-charcoal dark:text-white mb-3">Ingredients</h3>
              {ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input value={ing.amount} onChange={(e) => { const u = [...ingredients]; u[i] = { ...u[i], amount: e.target.value }; setIngredients(u); }} className={inputClass + ' w-20'} placeholder="Amt" />
                  <input value={ing.unit} onChange={(e) => { const u = [...ingredients]; u[i] = { ...u[i], unit: e.target.value }; setIngredients(u); }} className={inputClass + ' w-24'} placeholder="Unit" />
                  <input value={ing.name} onChange={(e) => { const u = [...ingredients]; u[i] = { ...u[i], name: e.target.value }; setIngredients(u); }} className={inputClass + ' flex-1'} placeholder="Name" />
                  <button type="button" onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))} className="p-2 text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => setIngredients([...ingredients, { name: '', amount: '', unit: '' }])} className="text-gold text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal dark:text-white mb-3">Instructions</h3>
              {instructions.map((inst, i) => (
                <div key={i} className="mb-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gold text-white flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <input value={inst.title || ''} onChange={(e) => { const u = [...instructions]; u[i] = { ...u[i], title: e.target.value }; setInstructions(u); }} className={inputClass + ' flex-1'} placeholder="Step title" />
                    <button type="button" onClick={() => setInstructions(instructions.filter((_, idx) => idx !== i))} className="p-2 text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <textarea value={inst.description} onChange={(e) => { const u = [...instructions]; u[i] = { ...u[i], description: e.target.value }; setInstructions(u); }} className={inputClass + ' resize-none'} rows={2} required />
                </div>
              ))}
              <button type="button" onClick={() => setInstructions([...instructions, { title: '', description: '', timer: 0 }])} className="text-gold text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add Step</button>
            </div>

            <button type="submit" disabled={saving} className="w-full py-3 bg-gradient-to-r from-gold to-food-orange text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}

function Field({ label, children }) {
  return <div><label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1.5">{label}</label>{children}</div>;
}

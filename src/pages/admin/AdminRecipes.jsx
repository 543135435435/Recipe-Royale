import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit, Eye } from 'lucide-react';
import AnimatedSection from '../../components/animations/AnimatedSection';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { recipeService } from '../../services/recipeService';
import { toast } from 'sonner';

export default function AdminRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await recipeService.getRecipes({ limit: 50, sort: '-createdAt' });
      setRecipes(res.data.data || []);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try {
      await recipeService.deleteRecipe(deleteId);
      setRecipes(recipes.filter((r) => r.id !== deleteId));
      toast.success('Recipe deleted');
    } catch { toast.error('Failed'); }
    setDeleteId(null);
  };

  return (
    <div>
      <AnimatedSection className="mb-6"><h1 className="text-2xl font-bold font-serif text-charcoal dark:text-white">Manage Recipes</h1></AnimatedSection>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 text-left">
                <th className="px-6 py-3 font-medium text-gray-500">Recipe</th>
                <th className="px-6 py-3 font-medium text-gray-500">Author</th>
                <th className="px-6 py-3 font-medium text-gray-500">Cuisine</th>
                <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : recipes.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      {r.coverImage && <img src={r.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                      <Link to={`/recipes/${r.id}`} className="font-medium text-charcoal dark:text-white hover:text-gold line-clamp-1">{r.title}</Link>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{r.author?.firstName} {r.author?.lastName}</td>
                  <td className="px-6 py-3 text-gray-500">{r.cuisine}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${r.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{r.status}</span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1">
                      <Link to={`/recipes/${r.id}`} className="p-1.5 text-gray-400 hover:text-gold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Eye className="w-4 h-4" /></Link>
                      <Link to={`/edit-recipe/${r.id}`} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Edit className="w-4 h-4" /></Link>
                      <button onClick={() => setDeleteId(r.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Recipe" message="Are you sure? This cannot be undone." />
    </div>
  );
}

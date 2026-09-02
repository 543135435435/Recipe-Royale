import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import RecipeCard, { RecipeCardSkeleton } from '../components/common/RecipeCard';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import PageTransition from '../components/animations/PageTransition';
import { recipeService } from '../services/recipeService';

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const page = 1;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await recipeService.getMyRecipes({ page, limit: 12 });
        setRecipes(res.data.data || []);
        setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
      } catch {} finally { setLoading(false); }
    };
    load();
  }, [page]);

  return (
    <PageTransition>
      <div className="min-h-screen py-10 bg-cream dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold font-serif text-charcoal dark:text-white">My Recipes</h1>
            <Link to="/create-recipe" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold to-food-orange text-white text-sm font-semibold rounded-full hover:shadow-lg transition-all">
              <Plus className="w-4 h-4" /> New Recipe
            </Link>
          </div>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
            </div>
          ) : recipes.length === 0 ? (
            <EmptyState type="recipes" title="No recipes yet" description="Start creating your first recipe!"
              action={<Link to="/create-recipe" className="px-6 py-2 bg-gold text-white rounded-full font-medium">Create Recipe</Link>} />
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
              </div>
              <div className="mt-8"><Pagination page={pagination.page} pages={pagination.pages} onPageChange={() => {}} /></div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

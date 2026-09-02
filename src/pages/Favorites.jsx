import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import RecipeCard, { RecipeCardSkeleton } from '../components/common/RecipeCard';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import PageTransition from '../components/animations/PageTransition';
import { recipeService } from '../services/recipeService';

export default function Favorites() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await recipeService.getFavorites({ page: 1, limit: 12 });
        setRecipes(res.data.data || []);
        setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen py-10 bg-cream dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold font-serif text-charcoal dark:text-white mb-8 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" /> My Favorites
          </h1>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
            </div>
          ) : recipes.length === 0 ? (
            <EmptyState type="favorites" title="No favorites yet" description="Start exploring recipes and save your favorites here."
              action={<Link to="/recipes" className="px-6 py-2 bg-gold text-white rounded-full font-medium">Browse Recipes</Link>} />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

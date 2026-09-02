import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Loader2 } from 'lucide-react';
import AnimatedSection from '../components/animations/AnimatedSection';
import RecipeCard from '../components/common/RecipeCard';
import EmptyState from '../components/common/EmptyState';
import PageTransition from '../components/animations/PageTransition';
import { recipeService } from '../services/recipeService';

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await recipeService.getRecipes({ saved: true });
        setRecipes(res.data.data || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-8">
              <Bookmark className="w-8 h-8 text-gold" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal dark:text-white">
                Saved Recipes
              </h1>
            </div>
          </AnimatedSection>

          {recipes.length === 0 ? (
            <EmptyState
              title="No saved recipes"
              description="Bookmark recipes you want to try later."
              actionLabel="Browse Recipes"
              actionLink="/recipes"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe, i) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

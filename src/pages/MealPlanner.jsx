import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Calendar } from 'lucide-react';
import AnimatedSection from '../components/animations/AnimatedSection';
import PageTransition from '../components/animations/PageTransition';
import { mealPlanService, recipeService } from '../services/recipeService';
import { DAYS_OF_WEEK } from '../constants';
import { toast } from 'sonner';

export default function MealPlanner() {
  const [plan, setPlan] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('monday');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [planRes, recipesRes] = await Promise.all([
          mealPlanService.getPlan(),
          recipeService.getRecipes({ limit: 50 }),
        ]);
        setPlan(planRes.data.data);
        setRecipes(recipesRes.data.data || []);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const addMeal = async (recipeId) => {
    try {
      const res = await mealPlanService.addMeal({ day: selectedDay, recipe: recipeId, mealType: 'lunch' });
      setPlan(res.data.data);
      setShowAddModal(false);
      toast.success('Meal added!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const removeMeal = async (day, mealId) => {
    try {
      const res = await mealPlanService.removeMeal(day, mealId, plan.weekStart);
      setPlan(res.data.data);
      toast.success('Meal removed');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;

  const dayPlan = plan?.days?.find((d) => d.day === selectedDay) || { meals: [] };

  return (
    <PageTransition>
      <div className="min-h-screen py-10 bg-cream dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-8">
            <h1 className="text-3xl font-bold font-serif text-charcoal dark:text-white flex items-center gap-3">
              <Calendar className="w-8 h-8 text-gold" /> Meal Planner
            </h1>
            <p className="text-gray-500 mt-1">Plan your meals for the week</p>
          </AnimatedSection>

          {/* Day Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {DAYS_OF_WEEK.map((day) => {
              const dayData = plan?.days?.find((d) => d.day === day);
              const mealCount = dayData?.meals?.length || 0;
              return (
                <button key={day} onClick={() => setSelectedDay(day)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                    selectedDay === day ? 'bg-gold text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gold/10'
                  }`}
                >
                  {day} {mealCount > 0 && <span className="ml-1 text-xs opacity-70">({mealCount})</span>}
                </button>
              );
            })}
          </div>

          {/* Day's Meals */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-charcoal dark:text-white capitalize">{selectedDay}&apos;s Meals</h2>
              <button onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-white text-sm font-medium rounded-full hover:bg-gold-dark transition-colors">
                <Plus className="w-4 h-4" /> Add Meal
              </button>
            </div>

            {dayPlan.meals?.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No meals planned for this day. Add a recipe!</p>
            ) : (
              <div className="space-y-3">
                {dayPlan.meals?.map((meal) => (
                  <motion.div key={meal.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-4 p-4 bg-cream dark:bg-gray-700/50 rounded-xl"
                  >
                    {meal.recipe?.coverImage && (
                      <img src={meal.recipe.coverImage} alt="" className="w-14 h-14 rounded-lg object-cover" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-charcoal dark:text-white text-sm">{meal.recipe?.title || 'Unknown recipe'}</p>
                      <span className="text-xs text-gold capitalize">{meal.mealType}</span>
                    </div>
                    <button onClick={() => removeMeal(selectedDay, meal.id)} className="p-2 text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Add Meal Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowAddModal(false)}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[70vh] overflow-y-auto p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-4">Choose a Recipe</h3>
                <div className="space-y-2">
                  {recipes.map((r) => (
                    <button key={r.id} onClick={() => addMeal(r.id)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors text-left"
                    >
                      {r.coverImage && <img src={r.coverImage} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                      <div>
                        <p className="text-sm font-medium text-charcoal dark:text-white">{r.title}</p>
                        <p className="text-xs text-gray-500">{r.cuisine}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

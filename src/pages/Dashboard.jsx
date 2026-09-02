import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen, Heart, Star, Users, Plus, ChefHat,
  ArrowRight, Sparkles, Crown, Settings,
} from 'lucide-react';
import AnimatedSection from '../components/animations/AnimatedSection';
import PageTransition from '../components/animations/PageTransition';
import RecipeCard from '../components/common/RecipeCard';
import { useAuth } from '../context/AuthContext';
import { recipeService } from '../services/recipeService';
import { RecipeCardSkeleton } from '../components/common/RecipeCard';
import { staggerContainer, staggerItem } from '../utils/animations';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: recipesRes, isLoading: recipesLoading } = useQuery({
    queryKey: ['recipes', 'my-recipes', 'dashboard'],
    queryFn: () => recipeService.getMyRecipes({ limit: 4 }),
    staleTime: 5 * 60 * 1000,
  });
  const { data: favsRes, isLoading: favsLoading } = useQuery({
    queryKey: ['recipes', 'favorites', 'dashboard'],
    queryFn: () => recipeService.getFavorites({ limit: 4 }),
    staleTime: 5 * 60 * 1000,
  });
  const myRecipes = recipesRes?.data?.data || [];
  const favorites = favsRes?.data?.data || [];

  const stats = [
    { icon: <BookOpen className="w-6 h-6" />, label: 'My Recipes', value: myRecipes.length, color: 'from-gold to-gold-light' },
    { icon: <Heart className="w-6 h-6" />, label: 'Favorites', value: favorites.length, color: 'from-red-400 to-pink-500' },
    { icon: <Star className="w-6 h-6" />, label: 'Reviews', value: 0, color: 'from-yellow-400 to-orange-500' },
    { icon: <Users className="w-6 h-6" />, label: 'Followers', value: user?.followers?.length || 0, color: 'from-blue-400 to-indigo-500' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen py-10 bg-cream dark:bg-gray-950">
        <div className="section-container">
          {/* Welcome Banner */}
          <AnimatedSection className="mb-10">
            <div className="bg-gradient-to-r from-gold via-food-orange to-food-red rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold overflow-hidden ring-2 ring-white/30">
                    {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : (user?.firstName?.[0] || 'U').toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold font-serif">Welcome, {user?.firstName}!</h1>
                    <p className="opacity-90">{user?.biography || 'Ready to cook something amazing today?'}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-6">
                  <Link to="/create-recipe" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-gold font-semibold rounded-full hover:shadow-lg transition-all text-sm">
                    <Plus className="w-4 h-4" /> New Recipe
                  </Link>
                  <Link to="/recipes" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/20 text-white font-medium rounded-full hover:bg-white/30 transition-all text-sm backdrop-blur-sm">
                    Browse Recipes <ArrowRight className="w-4 h-4" />
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/20 text-white font-medium rounded-full hover:bg-white/30 transition-all text-sm backdrop-blur-sm">
                      <Crown className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={staggerItem}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3 shadow-sm`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-charcoal dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[
              { to: '/create-recipe', label: 'Create Recipe', icon: <Plus className="w-5 h-5" />, color: 'bg-gold text-white', desc: 'Share a new recipe' },
              { to: '/favorites', label: 'My Favorites', icon: <Heart className="w-5 h-5" />, color: 'bg-red-50 text-red-500', desc: 'View saved recipes' },
              { to: '/meal-planner', label: 'Meal Planner', icon: <ChefHat className="w-5 h-5" />, color: 'bg-food-green/10 text-food-green', desc: 'Plan your meals' },
            ].map((action, i) => (
              <Link key={i} to={action.to}
                className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color} shadow-sm`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-charcoal dark:text-white text-sm block">{action.label}</span>
                  <span className="text-xs text-gray-400">{action.desc}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>

          {/* My Recipes */}
          <AnimatedSection>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold font-serif text-charcoal dark:text-white">My Recipes</h2>
                <p className="text-sm text-gray-500 mt-0.5">Recipes you&apos;ve created</p>
              </div>
              <Link to="/my-recipes" className="text-sm text-gold hover:text-gold-dark font-medium flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {recipesLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
              </div>
            ) : myRecipes.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {myRecipes.map((recipe, i) => (
                  <RecipeCard key={recipe.id} recipe={recipe} index={i} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center shadow-card">
                <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">You haven&apos;t created any recipes yet</p>
                <Link to="/create-recipe" className="btn-royal !py-2.5 !text-sm">
                  <Plus className="w-4 h-4" /> Create Your First Recipe
                </Link>
              </div>
            )}
          </AnimatedSection>

          {/* Favorites */}
          {favorites.length > 0 && (
            <AnimatedSection className="mt-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-serif text-charcoal dark:text-white">My Favorites</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Recipes you&apos;ve saved</p>
                </div>
                <Link to="/favorites" className="text-sm text-gold hover:text-gold-dark font-medium flex items-center gap-1 transition-colors">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {favorites.map((recipe, i) => (
                  <RecipeCard key={recipe.id} recipe={recipe} index={i} />
                ))}
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

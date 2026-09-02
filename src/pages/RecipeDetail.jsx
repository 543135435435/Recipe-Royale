import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Users, ChefHat, Heart, Share2, Star, Printer, ArrowLeft,
  Check, Send, Trash2, Edit, Play, ChevronRight, ChevronLeft,
  ShoppingCart, Copy, Minus, Plus, Flame, Leaf, Award,
  Timer, X, BookOpen, Utensils,
} from 'lucide-react';
import AnimatedSection from '../components/animations/AnimatedSection';
import RatingStars from '../components/common/RatingStars';
import ConfirmDialog from '../components/common/ConfirmDialog';
import PageTransition from '../components/animations/PageTransition';
import { recipeService } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import { formatTime, formatDate, getDifficultyColor, getImageUrl, getCountryFlag, adjustIngredientQuantity } from '../utils/helpers';
import { staggerContainer, staggerItem } from '../utils/animations';
import { toast } from 'sonner';
import SEO from '../components/common/SEO';

export default function RecipeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [servings, setServings] = useState(4);
  const [cookingMode, setCookingMode] = useState(false);
  const [cookingStep, setCookingStep] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());

  const loadRecipe = useCallback(async () => {
    setLoading(true);
    try {
      const res = await recipeService.getRecipeById(id);
      setRecipe(res.data.data);
      setServings(res.data.data?.servings || 4);
      const revRes = await recipeService.getReviews(id);
      setReviews(revRes.data.data || []);
    } catch {
      toast.error('Recipe not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadRecipe(); }, [loadRecipe]);

  useEffect(() => {
    if (user && recipe) {
      recipeService.checkFavorite(id)
        .then((res) => setFavorited(res.data.favorited))
        .catch(() => {});
    } else {
      setFavorited(false);
    }
  }, [id, user?.id, recipe]);

  // Keep screen awake in cooking mode
  useEffect(() => {
    let wakeLock = null;
    if (cookingMode && 'wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then((lock) => {
        wakeLock = lock;
      }).catch(() => {});
    }
    return () => { if (wakeLock) wakeLock.release(); };
  }, [cookingMode]);

  const handleFavorite = async () => {
    if (!user) { toast.error('Please login to favorite'); return; }
    try {
      const res = await recipeService.toggleFavorite(id);
      setFavorited(res.data.favorited);
      toast.success(res.data.message);
    } catch { toast.error('Failed to update favorite'); }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await recipeService.createReview(id, { rating: reviewRating, comment: reviewText });
      setReviews([res.data.data, ...reviews]);
      setReviewText('');
      setReviewRating(5);
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDelete = async () => {
    try {
      await recipeService.deleteRecipe(id);
      toast.success('Recipe deleted');
      window.location.href = '/recipes';
    } catch { toast.error('Failed to delete'); }
    setDeleteConfirm(false);
  };

  const toggleStep = (index) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: recipe.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const adjustServings = (newServings) => {
    if (newServings < 1 || newServings > 20) return;
    setServings(newServings);
  };

  const copyIngredients = () => {
    const text = recipe.ingredients?.map((ing) => {
      const qty = adjustIngredientQuantity(ing, recipe.servings || 4, servings);
      return `${qty.amount ? `${qty.amount} ${qty.unit || ''}`.trim() : ''} ${ing.name}`.trim();
    }).join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Ingredients copied!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">🍽️</span>
        <p className="text-xl text-gray-500 font-medium">Recipe not found</p>
        <Link to="/recipes" className="btn-royal">Browse all recipes</Link>
      </div>
    );
  }

  const originalServings = recipe.servings || 4;
  const totalTime = recipe.totalTime || (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <PageTransition>
      <SEO
        title={recipe.title}
        description={recipe.description}
        image={recipe.coverImage}
        type="article"
        recipe={recipe}
      />
      {/* Cooking Mode Overlay */}
      <AnimatePresence>
        {cookingMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-charcoal text-white flex flex-col"
          >
            {/* Cooking Mode Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <button onClick={() => setCookingMode(false)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" /> Exit
              </button>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Cooking Mode</p>
                <p className="text-sm font-medium">{recipe.title}</p>
              </div>
              <div className="text-sm text-gray-400">
                Step {cookingStep + 1} / {recipe.instructions?.length || 0}
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-gold to-food-orange"
                animate={{ width: `${((cookingStep + 1) / (recipe.instructions?.length || 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Step Content */}
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="max-w-2xl w-full text-center">
                <motion.div
                  key={cookingStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-food-orange flex items-center justify-center text-white text-2xl font-bold mb-8 mx-auto">
                    {cookingStep + 1}
                  </div>
                  {recipe.instructions?.[cookingStep]?.title && (
                    <h3 className="text-xl font-semibold mb-4">{recipe.instructions[cookingStep].title}</h3>
                  )}
                  <p className="text-lg leading-relaxed text-gray-300">
                    {recipe.instructions?.[cookingStep]?.description}
                  </p>
                  {recipe.instructions?.[cookingStep]?.timer > 0 && (
                    <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-food-orange/20 rounded-full text-food-orange">
                      <Timer className="w-5 h-5" />
                      <span className="font-medium">{recipe.instructions[cookingStep].timer} minutes</span>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between px-6 py-6 border-t border-white/10">
              <button
                onClick={() => setCookingStep(Math.max(0, cookingStep - 1))}
                disabled={cookingStep === 0}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full font-medium disabled:opacity-30 hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>
              <button
                onClick={() => {
                  if (cookingStep < (recipe.instructions?.length || 1) - 1) {
                    setCookingStep(cookingStep + 1);
                  } else {
                    setCookingMode(false);
                    toast.success('🎉 Recipe completed! Enjoy your meal!');
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 btn-royal"
              >
                {cookingStep < (recipe.instructions?.length || 1) - 1 ? (
                  <>Next Step <ChevronRight className="w-5 h-5" /></>
                ) : (
                  <>Complete <Check className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Image */}
      <section className="relative h-[45vh] lg:h-[55vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          src={getImageUrl(recipe.coverImage)}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <Link
          to="/recipes"
          className="absolute top-6 left-6 w-11 h-11 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-charcoal" />
        </Link>

        {/* Action buttons */}
        <div className="absolute top-6 right-6 flex gap-2">
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleShare}
            className="w-11 h-11 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
            <Share2 className="w-5 h-5 text-charcoal" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleFavorite}
            className="w-11 h-11 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
            <Heart className={`w-5 h-5 ${favorited ? 'fill-red-500 text-red-500' : 'text-charcoal'}`} />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => window.print()}
            className="w-11 h-11 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg hidden sm:flex">
            <Printer className="w-5 h-5 text-charcoal" />
          </motion.button>
        </div>

        {/* Badges */}
        <div className="absolute bottom-6 left-6 flex gap-2">
          <span className="px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-sm font-medium text-charcoal shadow-sm">
            {getCountryFlag(recipe.cuisine)} {recipe.cuisine}
          </span>
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm shadow-sm ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title & Meta */}
            <AnimatedSection>
              <div className="flex items-center gap-2 mb-3">
                {recipe.category && (
                  <Link to={`/recipes?category=${recipe.category.slug}`} className="badge-royal hover:bg-gold/20 transition-colors">
                    {recipe.category.name}
                  </Link>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold font-serif text-charcoal dark:text-white mb-4">
                {recipe.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {recipe.author && (
                  <Link to={`/chefs/${recipe.author.id}`} className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-food-orange flex items-center justify-center text-white text-xs font-bold overflow-hidden ring-2 ring-gold/20">
                      {recipe.author.avatar ? (
                        <img src={recipe.author.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (recipe.author.firstName?.[0] || 'C').toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-charcoal dark:text-white group-hover:text-gold transition-colors">
                        {recipe.author.firstName} {recipe.author.lastName}
                      </span>
                    </div>
                  </Link>
                )}
                <RatingStars rating={recipe.rating} count={recipe.reviewCount} />
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{recipe.description}</p>
            </AnimatedSection>

            {/* Cooking Info */}
            <AnimatedSection delay={0.1}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: <Clock className="w-5 h-5" />, label: 'Prep Time', value: formatTime(recipe.prepTime), color: 'from-blue-500 to-blue-600' },
                  { icon: <Flame className="w-5 h-5" />, label: 'Cook Time', value: formatTime(recipe.cookTime), color: 'from-food-orange to-food-red' },
                  { icon: <Clock className="w-5 h-5" />, label: 'Total Time', value: formatTime(totalTime), color: 'from-gold to-gold-dark' },
                  { icon: <Users className="w-5 h-5" />, label: 'Servings', value: servings, color: 'from-food-green to-food-emerald' },
                ].map((info, i) => (
                  <div key={i} className="bg-cream dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-700/50">
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center text-white shadow-sm`}>
                      {info.icon}
                    </div>
                    <p className="text-xs text-gray-500 mb-0.5">{info.label}</p>
                    <p className="text-sm font-bold text-charcoal dark:text-white">{info.value}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Start Cooking Button */}
            <AnimatedSection delay={0.12}>
              <button
                onClick={() => { setCookingMode(true); setCookingStep(0); }}
                className="w-full btn-royal !py-4 !text-base"
              >
                <Play className="w-5 h-5" /> Start Cooking Mode
              </button>
            </AnimatedSection>

            {/* Ingredients */}
            <AnimatedSection delay={0.15}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold font-serif text-charcoal dark:text-white">Ingredients</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => adjustServings(servings - 1)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gold/10 transition-colors" disabled={servings <= 1}>
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-charcoal dark:text-white min-w-[60px] text-center">{servings} servings</span>
                  <button onClick={() => adjustServings(servings + 1)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gold/10 transition-colors" disabled={servings >= 20}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-50 dark:divide-gray-700/50">
                {recipe.ingredients?.map((ing, i) => {
                  const adjusted = adjustIngredientQuantity(ing, originalServings, servings);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.02 }}
                      className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-cream/50 dark:hover:bg-gray-700/30 transition-colors ${checkedIngredients.has(i) ? 'opacity-50' : ''}`}
                      onClick={() => toggleIngredient(i)}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${checkedIngredients.has(i) ? 'bg-food-green border-food-green' : 'border-gray-300 dark:border-gray-600'}`}>
                        {checkedIngredients.has(i) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`flex-1 text-sm ${checkedIngredients.has(i) ? 'line-through text-gray-400' : 'text-charcoal dark:text-gray-300'}`}>
                        {adjusted.amount && <span className="font-semibold">{adjusted.amount} {adjusted.unit}</span>}
                        {' '}{ing.name}
                      </span>
                      {ing.optional && <span className="text-xs text-gray-400 italic">optional</span>}
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex gap-2 mt-3">
                <button onClick={copyIngredients} className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gold/10 hover:text-gold transition-colors">
                  <Copy className="w-3.5 h-3.5" /> Copy List
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gold/10 hover:text-gold transition-colors">
                  <ShoppingCart className="w-3.5 h-3.5" /> Add to Shopping List
                </button>
              </div>
            </AnimatedSection>

            {/* Instructions */}
            <AnimatedSection delay={0.2}>
              <h2 className="text-2xl font-bold font-serif text-charcoal dark:text-white mb-4">Instructions</h2>
              <div className="space-y-4">
                {recipe.instructions?.map((inst, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className={`bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-300 ${
                      completedSteps.has(i) ? 'border-food-green bg-food-green/5' : 'border-gray-50 dark:border-gray-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-4 p-5">
                      <button
                        onClick={() => toggleStep(i)}
                        className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm transition-all ${
                          completedSteps.has(i)
                            ? 'bg-food-green text-white shadow-sm'
                            : 'bg-gold/10 text-gold hover:bg-gold hover:text-white'
                        }`}
                      >
                        {completedSteps.has(i) ? <Check className="w-4 h-4" /> : i + 1}
                      </button>
                      <div className="flex-1">
                        {inst.title && <h3 className="font-semibold text-charcoal dark:text-white mb-1">{inst.title}</h3>}
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{inst.description}</p>
                        {inst.timer > 0 && (
                          <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-food-orange/10 text-food-orange text-xs font-medium rounded-full">
                            <Timer className="w-3 h-3" /> {inst.timer} min
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            {/* Nutrition */}
            {recipe.nutrition && recipe.nutrition.calories > 0 && (
              <AnimatedSection delay={0.25}>
                <h2 className="text-2xl font-bold font-serif text-charcoal dark:text-white mb-4">Nutrition</h2>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {[
                    { label: 'Calories', value: recipe.nutrition.calories, unit: 'kcal', color: 'text-food-orange' },
                    { label: 'Protein', value: recipe.nutrition.protein, unit: 'g', color: 'text-food-red' },
                    { label: 'Carbs', value: recipe.nutrition.carbs, unit: 'g', color: 'text-gold' },
                    { label: 'Fat', value: recipe.nutrition.fat, unit: 'g', color: 'text-food-green' },
                    { label: 'Fiber', value: recipe.nutrition.fiber, unit: 'g', color: 'text-emerald-600' },
                    { label: 'Sugar', value: recipe.nutrition.sugar, unit: 'g', color: 'text-purple-600' },
                  ].map((n, i) => (
                    <div key={i} className="bg-cream dark:bg-gray-800 rounded-xl p-3.5 text-center border border-gray-100 dark:border-gray-700/50">
                      <p className={`text-lg font-bold ${n.color}`}>{n.value}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.unit}</p>
                      <p className="text-xs text-gray-500 font-medium">{n.label}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Reviews */}
            <AnimatedSection delay={0.3}>
              <h2 className="text-2xl font-bold font-serif text-charcoal dark:text-white mb-4">
                Reviews ({reviews.length})
              </h2>

              {user ? (
                <form onSubmit={handleSubmitReview} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 mb-6">
                  <div className="mb-3">
                    <label className="text-sm font-medium text-charcoal dark:text-gray-300 mb-2 block">Your Rating</label>
                    <RatingStars rating={reviewRating} onChange={setReviewRating} interactive size="lg" />
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this recipe..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm resize-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    rows={3}
                    required
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="mt-3 btn-royal !py-2.5 !text-sm disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <p className="text-sm text-gray-500 mb-6">
                  <Link to="/login" className="text-gold hover:underline font-medium">Login</Link> to leave a review.
                </p>
              )}

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-food-orange flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                          {review.user?.avatar ? (
                            <img src={review.user.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (review.user?.firstName?.[0] || 'U').toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-charcoal dark:text-white">
                            {review.user?.firstName} {review.user?.lastName}
                          </p>
                          <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <RatingStars rating={review.rating} size="sm" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Tags */}
              {recipe.tags?.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-bold text-charcoal dark:text-white mb-3 uppercase tracking-wider">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/recipes?search=${tag}`}
                        className="px-3 py-1.5 bg-cream dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-full hover:bg-gold/10 hover:text-gold transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {user && (user.id === recipe.author?.id || user.role === 'admin') && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-bold text-charcoal dark:text-white mb-3 uppercase tracking-wider">Actions</h3>
                  <div className="space-y-2">
                    <Link
                      to={`/edit-recipe/${recipe.id}`}
                      className="flex items-center gap-2 w-full px-4 py-2.5 bg-cream dark:bg-gray-700 text-sm font-medium text-charcoal dark:text-white rounded-xl hover:bg-gold/10 hover:text-gold transition-colors"
                    >
                      <Edit className="w-4 h-4" /> Edit Recipe
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(true)}
                      className="flex items-center gap-2 w-full px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-sm font-medium text-red-600 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Recipe
                    </button>
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-bold text-charcoal dark:text-white mb-3 uppercase tracking-wider">Share this recipe</h3>
                <div className="flex gap-2">
                  <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-cream dark:bg-gray-700 rounded-xl text-sm font-medium hover:bg-gold/10 transition-colors">
                    <Share2 className="w-4 h-4" /> Copy Link
                  </button>
                  <button onClick={() => window.print()} className="flex items-center justify-center px-4 py-2.5 bg-cream dark:bg-gray-700 rounded-xl hover:bg-gold/10 transition-colors">
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
      />
    </PageTransition>
  );
}

import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Heart, Clock, Star, Flame, Users } from 'lucide-react';
import { formatTime, getDifficultyColor, getImageUrl, getCountryFlag, formatRating } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export default function RecipeCard({ recipe, index = 0, variant = 'default' }) {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(false);
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef(null);

  // 3D tilt on mouse move
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to favorite recipes');
      return;
    }
    setFavorited(!favorited);
    toast.success(favorited ? 'Removed from favorites' : 'Added to favorites');
  };

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="group"
      >
        <Link to={`/recipes/${recipe.id}`} className="block">
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                <img
                  src={imgError ? getImageUrl(null) : getImageUrl(recipe.coverImage)}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={() => setImgError(true)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 group-hover:to-transparent transition-all duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="badge-royal">
                    <Flame className="w-3 h-3" /> Featured
                  </span>
                </div>
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                {recipe.cuisine && (
                  <span className="text-sm font-semibold text-gold mb-2 tracking-wide uppercase">
                    {getCountryFlag(recipe.cuisine)} {recipe.cuisine}
                  </span>
                )}
                <h3 className="text-xl md:text-2xl font-bold font-serif text-charcoal dark:text-white mb-3 group-hover:text-gold transition-colors">
                  {recipe.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                  {recipe.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(recipe.totalTime || (recipe.prepTime || 0) + (recipe.cookTime || 0))}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    {formatRating(recipe.rating)}
                  </span>
                  {recipe.servings && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {recipe.servings}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative"
    >
      <Link to={`/recipes/${recipe.id}`}>
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 shine-effect">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={imgError ? getImageUrl(null) : getImageUrl(recipe.coverImage)}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              onError={() => setImgError(true)}
              loading="lazy"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Cuisine badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full text-charcoal dark:text-white shadow-sm">
                {recipe.cuisine && getCountryFlag(recipe.cuisine)} {recipe.cuisine}
              </span>
            </div>

            {/* Difficulty badge */}
            <div className="absolute top-3 right-3 z-10">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full backdrop-blur-md ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
            </div>

            {/* Favorite Button */}
            <motion.button
              onClick={handleFavorite}
              whileTap={{ scale: 0.8 }}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110"
            >
              <Heart className={`w-5 h-5 transition-all duration-300 ${favorited ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600 dark:text-gray-300'}`} />
            </motion.button>

            {/* Time pill */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full text-charcoal dark:text-white shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                {formatTime(recipe.totalTime || (recipe.prepTime || 0) + (recipe.cookTime || 0))}
              </span>
            </div>

            {/* Category tag */}
            {recipe.category && (
              <div className="absolute bottom-3 left-3 opacity-100 group-hover:opacity-0 transition-opacity duration-300 z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full text-charcoal dark:text-white shadow-sm">
                  {recipe.category.name}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-charcoal dark:text-white text-[0.95rem] leading-snug mb-2 group-hover:text-gold transition-colors duration-300 line-clamp-1">
              {recipe.title}
            </h3>

            {recipe.author && (
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold to-food-orange flex items-center justify-center text-white text-[10px] font-bold overflow-hidden ring-2 ring-white dark:ring-gray-800">
                  {recipe.author.avatar ? (
                    <img src={recipe.author.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (recipe.author.firstName?.[0] || 'C').toUpperCase()
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {recipe.author.firstName} {recipe.author.lastName}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-700/50">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-gold fill-gold" />
                <span className="text-sm font-semibold text-charcoal dark:text-white">
                  {formatRating(recipe.rating)}
                </span>
                {recipe.reviewCount > 0 && (
                  <span className="text-xs text-gray-400 ml-0.5">({recipe.reviewCount})</span>
                )}
              </div>
              {recipe.favoriteCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Heart className="w-3.5 h-3.5 fill-gray-300 dark:fill-gray-600" />
                  {recipe.favoriteCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function RecipeCardSkeleton({ variant = 'default' }) {
  if (variant === 'featured') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-card animate-pulse">
        <div className="grid md:grid-cols-2">
          <div className="aspect-[4/3] md:aspect-auto bg-gray-200 dark:bg-gray-700" />
          <div className="p-8 space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card animate-pulse">
      <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6" />
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, TrendingUp, Clock, Sparkles, ArrowRight } from 'lucide-react';
import RecipeCard, { RecipeCardSkeleton } from '../components/common/RecipeCard';
import EmptyState from '../components/common/EmptyState';
import PageTransition from '../components/animations/PageTransition';
import { recipeService } from '../services/recipeService';
import { useDebounce } from '../hooks/useDebounce';
import { CUISINES } from '../constants';
import { staggerContainer, staggerItem } from '../utils/animations';
import { getCountryFlag } from '../utils/helpers';

const TRENDING_SEARCHES = [
  { term: 'Biryani', emoji: '🍚' },
  { term: 'Pasta', emoji: '🍝' },
  { term: 'Sushi', emoji: '🍣' },
  { term: 'Curry', emoji: '🍛' },
  { term: 'Pizza', emoji: '🍕' },
  { term: 'Ramen', emoji: '🍜' },
  { term: 'Chocolate', emoji: '🍫' },
  { term: 'Tacos', emoji: '🌮' },
  { term: 'Butter Chicken', emoji: '🍗' },
  { term: 'Sourdough', emoji: '🍞' },
];

const RECENT_SEARCHES_KEY = 'recentSearches';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 400);

  // Load recent searches
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); setHasSearched(false); return; }
    setLoading(true);
    setHasSearched(true);
    recipeService.getRecipes({ search: debouncedQuery, limit: 20 })
      .then((res) => setResults(res.data.data || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const saveRecentSearch = (term) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSearch = (term) => {
    setQuery(term);
    setSearchParams({ q: term });
    saveRecentSearch(term);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  return (
    <PageTransition>
      <div className="min-h-screen py-12 bg-cream dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 badge-royal mb-4"
            >
              <Sparkles className="w-3.5 h-3.5" /> Find Your Recipe
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-3xl lg:text-4xl font-bold font-serif text-charcoal dark:text-white mb-4"
            >
              Search Recipes
            </motion.h1>

            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative max-w-2xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/15 to-food-orange/15 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm" />
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-royal border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    autoFocus
                    onChange={(e) => { setQuery(e.target.value); setSearchParams({ q: e.target.value }); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && query.trim()) saveRecentSearch(query.trim()); }}
                    className="w-full pl-13 pr-12 py-4.5 bg-transparent text-lg text-charcoal dark:text-white placeholder-gray-400 focus:outline-none"
                    placeholder="Search recipes, cuisines, ingredients..."
                  />
                  {query && (
                    <button
                      onClick={() => { setQuery(''); setSearchParams({}); inputRef.current?.focus(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Pre-search suggestions */}
          {!hasSearched && (
            <div className="space-y-8">
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Recent Searches</span>
                    </div>
                    <button onClick={clearRecent} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gold/10 hover:text-gold transition-all shadow-sm border border-gray-100 dark:border-gray-700"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Trending searches */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-4 text-gold">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-wider">Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {TRENDING_SEARCHES.map((item, i) => (
                    <motion.button
                      key={item.term}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 + i * 0.03 }}
                      onClick={() => handleSearch(item.term)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gold/10 hover:text-gold transition-all shadow-sm border border-gray-100 dark:border-gray-700 hover:border-gold/20"
                    >
                      <span>{item.emoji}</span>
                      {item.term}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Browse by cuisine */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-gold">
                    <span className="text-sm font-bold uppercase tracking-wider">Browse by Cuisine</span>
                  </div>
                  <Link to="/recipes" className="text-xs text-gold hover:text-gold-dark flex items-center gap-1 transition-colors">
                    View All <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {CUISINES.slice(0, 10).map((cuisine, i) => (
                    <motion.button
                      key={cuisine}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.03 }}
                      onClick={() => handleSearch(cuisine)}
                      className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gold/10 hover:text-gold transition-all shadow-sm border border-gray-100 dark:border-gray-700 text-left"
                    >
                      <span className="text-lg">{getCountryFlag(cuisine)}</span>
                      {cuisine}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {Array.from({ length: 6 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
            </div>
          ) : hasSearched && results.length === 0 ? (
            <EmptyState
              type="search"
              title="No results found"
              description={`No recipes match "${query}". Try different keywords or browse by cuisine.`}
            />
          ) : hasSearched && results.length > 0 ? (
            <div className="mt-8">
              <p className="text-sm text-gray-500 mb-4">
                {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;<span className="font-medium text-gold">{query}</span>&rdquo;
              </p>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {results.map((recipe, i) => (
                  <motion.div key={recipe.id} variants={staggerItem}>
                    <RecipeCard recipe={recipe} index={i} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : null}
        </div>
      </div>
    </PageTransition>
  );
}

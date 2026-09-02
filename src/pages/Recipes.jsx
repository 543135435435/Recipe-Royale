import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown, Sparkles, Globe } from 'lucide-react';
import RecipeCard, { RecipeCardSkeleton } from '../components/common/RecipeCard';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import AnimatedSection from '../components/animations/AnimatedSection';
import PageTransition from '../components/animations/PageTransition';
import { recipeService } from '../services/recipeService';
import { useDebounce } from '../hooks/useDebounce';
import { CUISINES, DIFFICULTIES, SORT_OPTIONS, COUNTRIES } from '../constants';
import { getCountryFlag } from '../utils/helpers';

export default function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [cuisine, setCuisine] = useState(searchParams.get('cuisine') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-createdAt');
  const page = parseInt(searchParams.get('page') || '1');

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12, sort: sortBy, status: 'published' };
        if (debouncedSearch) params.search = debouncedSearch;
        if (cuisine) params.cuisine = cuisine;
        if (difficulty) params.difficulty = difficulty;

        const res = await recipeService.getRecipes(params);
        setRecipes(res.data.data || []);
        setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
      } catch {
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, [page, debouncedSearch, cuisine, difficulty, sortBy]);

  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearch('');
    setCuisine('');
    setDifficulty('');
    setSortBy('-createdAt');
    setSearchParams({});
  };

  const removeFilter = (key) => {
    switch (key) {
      case 'search': setSearch(''); break;
      case 'cuisine': setCuisine(''); break;
      case 'difficulty': setDifficulty(''); break;
      default: break;
    }
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  const activeFilters = [
    search && { key: 'search', label: `"${search}"` },
    cuisine && { key: 'cuisine', label: cuisine },
    difficulty && { key: 'difficulty', label: difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
  ].filter(Boolean);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="pt-12 pb-8 bg-gradient-to-b from-cream to-white dark:from-gray-950 dark:to-gray-900">
        <div className="section-container">
          <AnimatedSection className="text-center mb-8">
            <div className="inline-flex items-center gap-2 badge-royal mb-4">
              <Globe className="w-3.5 h-3.5" /> Recipe Collection
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold font-serif text-charcoal dark:text-white mb-3">
              Explore <span className="text-gradient">Recipes</span>
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Discover extraordinary recipes from cuisines around the world
            </p>
          </AnimatedSection>

          {/* Search & Filters */}
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipes, cuisines, ingredients..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); updateParams('search', e.target.value); }}
                className="w-full pl-13 pr-12 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-charcoal dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent shadow-card"
              />
              {search && (
                <button
                  onClick={() => { setSearch(''); updateParams('search', ''); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                  showFilters
                    ? 'bg-gold text-white border-gold'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-charcoal dark:text-white hover:border-gold/50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilters.length > 0 && (
                  <span className="w-5 h-5 bg-white/20 text-xs rounded-full flex items-center justify-center">{activeFilters.length}</span>
                )}
              </button>
              <p className="text-sm text-gray-500">
                {loading ? '...' : `${pagination.total} recipe${pagination.total !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {/* Active Filter Chips */}
            <AnimatePresence>
              {activeFilters.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap items-center gap-2"
                >
                  {activeFilters.map((f) => (
                    <motion.button
                      key={f.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => removeFilter(f.key)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 text-gold text-xs font-medium rounded-full hover:bg-gold/20 transition-colors"
                    >
                      {f.label}
                      <X className="w-3 h-3" />
                    </motion.button>
                  ))}
                  <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-red-500 font-medium ml-1 transition-colors">
                    Clear all
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700"
                >
                  <div className="grid sm:grid-cols-3 gap-4">
                    <FilterSelect
                      label="Cuisine"
                      value={cuisine}
                      onChange={(v) => { setCuisine(v); updateParams('cuisine', v); }}
                      options={[{ value: '', label: 'All Cuisines' }, ...CUISINES.map((c) => ({ value: c, label: `${getCountryFlag(c)} ${c}` }))]}
                    />
                    <FilterSelect
                      label="Difficulty"
                      value={difficulty}
                      onChange={(v) => { setDifficulty(v); updateParams('difficulty', v); }}
                      options={[{ value: '', label: 'All Levels' }, ...DIFFICULTIES.map((d) => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1) }))]}
                    />
                    <FilterSelect
                      label="Sort By"
                      value={sortBy}
                      onChange={(v) => { setSortBy(v); updateParams('sort', v); }}
                      options={SORT_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="py-10 bg-white dark:bg-gray-900">
        <div className="section-container">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
            </div>
          ) : recipes.length === 0 ? (
            <EmptyState
              type="recipes"
              title="No recipes found"
              description="Try adjusting your search or filters to find what you're looking for."
              action={
                <button onClick={clearFilters} className="btn-royal !py-2.5 !text-sm">
                  Clear Filters
                </button>
              }
            />
          ) : (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.06 } },
                }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {recipes.map((recipe, i) => (
                  <motion.div
                    key={recipe.id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                    }}
                  >
                    <RecipeCard recipe={recipe} index={i} />
                  </motion.div>
                ))}
              </motion.div>
              <div className="mt-12">
                <Pagination page={pagination.page} pages={pagination.pages} onPageChange={handlePageChange} />
              </div>
            </>
          )}
        </div>
      </section>
    </PageTransition>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-sm font-medium text-charcoal dark:text-gray-300 mb-2 block">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-gold focus:border-transparent appearance-none pr-10"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

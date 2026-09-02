import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  Flame,
  Users,
  BookOpen,
  Crown,
  Star,
  ArrowRight,
  Clock,
  TrendingUp,
  Globe,
  Utensils,
  Heart,
  Zap,
  Leaf,
  Award,
  MapPin,
  ChefHat,
  Sparkles,
  ArrowUpRight,
  Coffee,
  Cake,
  Pizza,
  UtensilsCrossed,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import AnimatedSection from "../components/animations/AnimatedSection";
import RecipeCard, {
  RecipeCardSkeleton,
} from "../components/common/RecipeCard";
import ChefCard from "../components/common/ChefCard";
import { recipeService } from "../services/recipeService";
import {
  CUISINES,
  CUISINE_IMAGES,
  CONTINENTS,
  CATEGORIES,
  FOOD_CATEGORY_IMAGES,
} from "../constants";
import {
  staggerContainer,
  staggerItem,
  heroReveal,
  heroWord,
  floatingAnimation,
  floatingAnimationSlow,
} from "../utils/animations";
import { formatTime, getImageUrl, getCountryFlag } from "../utils/helpers";
import WorldGlobe from "../components/globe/WorldGlobe";

export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.2]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ["recipes", "trending"],
    queryFn: () => recipeService.getTrending(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ["recipes", "featured"],
    queryFn: () => recipeService.getFeatured(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: latestData } = useQuery({
    queryKey: ["recipes", "latest"],
    queryFn: () =>
      recipeService.getRecipes({
        limit: 8,
        sort: "-createdAt",
        status: "published",
      }),
    staleTime: 5 * 60 * 1000,
  });

  const trendingRecipes = trendingData?.data?.data || [];
  const featuredRecipe = featuredData?.data?.data || trendingRecipes[0];
  const latestRecipes = latestData?.data?.data || [];

  return (
    <div>
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cream via-orange-50/80 to-amber-50/60 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
          <div className="absolute inset-0 opacity-[0.07] dark:opacity-[0.04]">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Floating 3D Elements */}
        <motion.div
          {...floatingAnimation}
          className="absolute top-32 right-[12%] w-20 h-20 rounded-3xl bg-gradient-to-br from-gold/15 to-food-orange/10 backdrop-blur-sm hidden lg:flex items-center justify-center border border-gold/10"
        >
          <span className="text-3xl">🌿</span>
        </motion.div>
        <motion.div
          {...floatingAnimationSlow}
          className="absolute bottom-40 left-[8%] w-16 h-16 rounded-2xl bg-gradient-to-br from-food-orange/15 to-food-red/10 backdrop-blur-sm hidden lg:flex items-center justify-center border border-food-orange/10"
        >
          <span className="text-2xl">🌶️</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[55%] right-[6%] w-24 h-24 rounded-full bg-gradient-to-br from-gold/8 to-gold/3 backdrop-blur-sm hidden lg:flex items-center justify-center border border-gold/5"
        >
          <span className="text-4xl">🍳</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-[25%] left-[5%] w-14 h-14 rounded-2xl bg-gradient-to-br from-food-green/10 to-food-emerald/5 backdrop-blur-sm hidden lg:flex items-center justify-center border border-food-green/10"
        >
          <span className="text-2xl">🍋</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, -5, 0] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-[25%] right-[20%] w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/10 to-purple-500/5 backdrop-blur-sm hidden lg:flex items-center justify-center border border-purple-400/10"
        >
          <span className="text-xl">🫐</span>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 section-container py-24 lg:py-0"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              variants={heroReveal}
              initial="hidden"
              animate="visible"
              className="space-y-7"
            >
              <motion.div
                variants={heroWord}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full border border-gold/15"
              >
                <Flame className="w-4 h-4 text-gold" />
                <span className="text-sm font-semibold text-gold tracking-wide">
                  Premium Culinary Platform
                </span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold font-serif leading-[1.1] tracking-tight">
                {[
                  "Discover",
                  "the",
                  "World,",
                  "One",
                  "Recipe",
                  "at",
                  "a",
                  "Time.",
                ].map((word, i) => (
                  <motion.span
                    key={i}
                    variants={heroWord}
                    className={`inline-block mr-3 ${
                      ["World,", "Recipe"].includes(word)
                        ? "text-gradient-royal"
                        : "text-charcoal dark:text-white"
                    }`}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                variants={heroWord}
                className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed"
              >
                Explore thousands of authentic recipes from cuisines around the
                globe. Cook, share, and celebrate the art of food with a
                community that&apos;s passionate about flavor.
              </motion.p>

              {/* Search Bar */}
              <motion.div variants={heroWord}>
                <Link to="/search" className="block max-w-lg">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-food-orange/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                    <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-full shadow-royal border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <div className="pl-5 pr-3 text-gray-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 py-4 pr-3 text-sm text-gray-400">
                        Search for Biryani, Pasta, Sushi...
                      </div>
                      <div className="pr-2">
                        <span className="px-5 py-2.5 bg-gradient-to-r from-gold to-food-orange text-white text-sm font-semibold rounded-full">
                          Search
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* CTAs */}
              <motion.div
                variants={heroWord}
                className="flex flex-col sm:flex-row gap-4 pt-2"
              >
                <Link to="/recipes" className="btn-royal">
                  <Utensils className="w-5 h-5" />
                  Explore Recipes
                </Link>
                <Link to="/register" className="btn-outline-royal">
                  Share Your Recipe
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={heroWord}
                className="flex items-center gap-8 pt-6"
              >
                {[
                  {
                    icon: <BookOpen className="w-5 h-5" />,
                    value: "500+",
                    label: "Recipes",
                    color: "from-gold to-gold-light",
                  },
                  {
                    icon: <Users className="w-5 h-5" />,
                    value: "50K+",
                    label: "Members",
                    color: "from-food-orange to-food-red",
                  },
                  {
                    icon: <Globe className="w-5 h-5" />,
                    value: "35+",
                    label: "Countries",
                    color: "from-food-green to-food-emerald",
                  },
                  {
                    icon: <Star className="w-5 h-5" />,
                    value: "4.9",
                    label: "Rating",
                    color: "from-gold to-food-orange",
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-charcoal dark:text-white leading-tight">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Featured Recipe Card (Desktop) */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block"
              style={{ perspective: 1200 }}
            >
              {featuredRecipe && (
                <Link
                  to={`/recipes/${featuredRecipe.id}`}
                  className="block group"
                >
                  <div className="relative rounded-3xl overflow-hidden shadow-royal-lg transform-gpu transition-transform duration-500 group-hover:scale-[1.02]">
                    <div className="aspect-[3/4]">
                      <img
                        src={getImageUrl(featuredRecipe.coverImage)}
                        alt={featuredRecipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    </div>
                    {/* Floating badge */}
                    <div className="absolute top-5 left-5">
                      <span className="badge-royal">
                        <Sparkles className="w-3 h-3" /> Recipe of the Day
                      </span>
                    </div>
                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gold">
                          {featuredRecipe.cuisine}
                        </span>
                        <span className="text-white/40">•</span>
                        <span className="text-sm text-white/70">
                          {formatTime(featuredRecipe.totalTime)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold font-serif text-white mb-2">
                        {featuredRecipe.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <RatingDots rating={featuredRecipe.rating} />
                        {featuredRecipe.author && (
                          <span className="text-sm text-white/60">
                            by {featuredRecipe.author.firstName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">
              Scroll to explore
            </span>
            <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center pt-2">
              <motion.div className="w-1.5 h-1.5 bg-gold rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ==================== 3D WORLD GLOBE ==================== */}
      <WorldGlobe />

      {/* ==================== TRENDING RECIPES ==================== */}
      <section className="py-20 lg:py-24 bg-white dark:bg-gray-900">
        <div className="section-container">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-food-orange flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gold uppercase tracking-wider">
                    Trending Now
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold font-serif text-charcoal dark:text-white">
                  Most Popular Recipes
                </h2>
              </div>
              <Link
                to="/recipes"
                className="hidden sm:flex items-center gap-1.5 text-gold hover:text-gold-dark font-medium text-sm transition-colors group"
              >
                View All{" "}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </AnimatedSection>

          {trendingLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                nextEl: ".swiper-next-trending",
                prevEl: ".swiper-prev-trending",
              }}
              pagination={{
                clickable: true,
                el: ".swiper-pagination-trending",
              }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="pb-14"
            >
              {trendingRecipes.map((recipe, i) => (
                <SwiperSlide key={recipe.id}>
                  <RecipeCard recipe={recipe} index={i} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* ==================== EXPLORE BY CUISINE ==================== */}
      <section className="py-20 lg:py-24 bg-cream dark:bg-gray-950">
        <div className="section-container">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-2 badge-royal mb-4">
              <Globe className="w-3.5 h-3.5" /> World Flavors
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-charcoal dark:text-white mb-3">
              Explore by Cuisine
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              From the streets of Lahore to the kitchens of Paris — discover
              flavors from every corner of the world
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
          >
            {CUISINES.slice(0, 10).map((cuisine, i) => (
              <motion.div key={cuisine} variants={staggerItem}>
                <Link
                  to={`/recipes?cuisine=${cuisine}`}
                  className="group relative block aspect-square rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500"
                >
                  <img
                    src={CUISINE_IMAGES[cuisine] || CUISINE_IMAGES["Italian"]}
                    alt={cuisine}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-bold text-base">
                      {cuisine}
                    </h3>
                    <p className="text-white/60 text-xs mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore recipes →
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== RECIPE OF THE DAY ==================== */}
      {featuredRecipe && (
        <section className="py-20 lg:py-24 bg-white dark:bg-gray-900">
          <div className="section-container">
            <AnimatedSection className="text-center mb-12">
              <div className="inline-flex items-center gap-2 badge-royal mb-4">
                <Award className="w-3.5 h-3.5" /> Editor&apos;s Pick
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold font-serif text-charcoal dark:text-white">
                Recipe of the Day
              </h2>
            </AnimatedSection>

            <AnimatedSection direction="scale">
              <Link
                to={`/recipes/${featuredRecipe.id}`}
                className="group block"
              >
                <div className="grid lg:grid-cols-2 gap-0 bg-cream dark:bg-gray-800 rounded-3xl overflow-hidden shadow-royal-lg">
                  <div className="relative aspect-square lg:aspect-auto overflow-hidden">
                    <img
                      src={getImageUrl(featuredRecipe.coverImage)}
                      alt={featuredRecipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-5 left-5">
                      <span className="px-4 py-1.5 bg-gold text-white text-sm font-semibold rounded-full shadow-lg">
                        ★ Recipe of the Day
                      </span>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <span className="text-sm font-semibold text-gold mb-2 tracking-wide uppercase">
                      {getCountryFlag(featuredRecipe.cuisine)}{" "}
                      {featuredRecipe.cuisine}
                    </span>
                    <h3 className="text-2xl lg:text-3xl font-bold font-serif text-charcoal dark:text-white mb-4 group-hover:text-gold transition-colors">
                      {featuredRecipe.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6 line-clamp-3">
                      {featuredRecipe.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gold" />{" "}
                        {formatTime(featuredRecipe.totalTime)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-gold fill-gold" />{" "}
                        {featuredRecipe.rating?.toFixed(1) || "New"}
                      </span>
                      <span className="capitalize">
                        {featuredRecipe.difficulty}
                      </span>
                    </div>
                    {featuredRecipe.author && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-food-orange flex items-center justify-center text-white font-bold text-sm overflow-hidden ring-2 ring-white dark:ring-gray-800">
                          {featuredRecipe.author.avatar ? (
                            <img
                              src={featuredRecipe.author.avatar}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            (
                              featuredRecipe.author.firstName?.[0] || "C"
                            ).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-charcoal dark:text-white">
                            {featuredRecipe.author.firstName}{" "}
                            {featuredRecipe.author.lastName}
                          </p>
                          <p className="text-xs text-gray-500">Chef</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ==================== EXPLORE BY CONTINENT ==================== */}
      <section className="py-20 lg:py-24 bg-cream dark:bg-gray-950">
        <div className="section-container">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-2 badge-royal mb-4">
              <MapPin className="w-3.5 h-3.5" /> Geography
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-charcoal dark:text-white mb-3">
              Explore the World Through Food
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Journey through continents and discover the culinary traditions
              that connect us all
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {CONTINENTS.map((continent, i) => (
              <motion.div key={continent.name} variants={staggerItem}>
                <Link
                  to={`/recipes?cuisine=${continent.countries[0]}`}
                  className="group block relative aspect-[16/10] rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500"
                >
                  <img
                    src={continent.image}
                    alt={continent.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-bold text-lg mb-0.5">
                      {continent.name}
                    </h3>
                    <p className="text-white/60 text-xs line-clamp-1">
                      {continent.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {continent.countries.slice(0, 3).map((c) => (
                        <span
                          key={c}
                          className="text-[10px] font-medium px-2 py-0.5 bg-white/15 rounded-full text-white/80"
                        >
                          {c}
                        </span>
                      ))}
                      {continent.countries.length > 3 && (
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-white/15 rounded-full text-white/80">
                          +{continent.countries.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== POPULAR CATEGORIES ==================== */}
      <section className="py-20 lg:py-24 bg-white dark:bg-gray-900">
        <div className="section-container">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-2 badge-royal mb-4">
              <UtensilsCrossed className="w-3.5 h-3.5" /> Categories
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-charcoal dark:text-white mb-3">
              Browse by Category
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              From quick breakfasts to elaborate dinner parties — find exactly
              what you&apos;re craving
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {CATEGORIES.slice(0, 12).map((cat, i) => (
              <motion.div key={cat.slug} variants={staggerItem}>
                <Link
                  to={`/recipes?category=${cat.slug}`}
                  className="group flex flex-col items-center p-5 bg-cream dark:bg-gray-800 rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-card transition-all duration-300 text-center"
                >
                  <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </span>
                  <span className="text-sm font-semibold text-charcoal dark:text-white group-hover:text-gold transition-colors">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-20 lg:py-24 bg-cream dark:bg-gray-950">
        <div className="section-container">
          <AnimatedSection className="text-center mb-16">
            <span className="badge-royal mb-4 inline-flex">Simple Process</span>
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-charcoal dark:text-white">
              How Recipe Royale Works
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BookOpen className="w-7 h-7" />,
                title: "Discover",
                desc: "Browse hundreds of curated recipes from world-class chefs across every cuisine.",
                color: "from-gold to-gold-light",
                emoji: "🔍",
              },
              {
                icon: <Flame className="w-7 h-7" />,
                title: "Cook",
                desc: "Follow detailed step-by-step instructions with timers and tips for perfect results.",
                color: "from-food-orange to-food-red",
                emoji: "👨‍🍳",
              },
              {
                icon: <Users className="w-7 h-7" />,
                title: "Share",
                desc: "Share your own recipes and connect with passionate food lovers worldwide.",
                color: "from-food-green to-emerald-500",
                emoji: "📸",
              },
              {
                icon: <Crown className="w-7 h-7" />,
                title: "Crown",
                desc: "Earn recognition, build your chef profile, and join the exclusive Crown Circle.",
                color: "from-gold to-amber-500",
                emoji: "👑",
              },
            ].map((step, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 text-center hover:shadow-card-hover transition-all duration-500 group border border-gray-50 dark:border-gray-700/50">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg`}
                  >
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-charcoal dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CROWN CIRCLE ==================== */}
      <section className="py-20 lg:py-24 bg-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal" />

        <div className="section-container relative z-10">
          <AnimatedSection className="text-center mb-12">
            <Crown className="w-14 h-14 text-gold mx-auto mb-5" />
            <h2 className="text-3xl lg:text-4xl font-bold font-serif mb-4">
              Join the Crown Circle
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
              An exclusive community of passionate cooks. Share recipes, compete
              in challenges, and earn your place among the culinary elite.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
            {[
              { value: "2,500+", label: "Members" },
              { value: "35+", label: "Countries" },
              { value: "15K+", label: "Recipes Shared" },
            ].map((stat, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-3xl lg:text-4xl font-bold text-gold mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center">
            <Link to="/crown-circle" className="btn-royal">
              Enter the Crown Circle <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== LATEST RECIPES ==================== */}
      {latestRecipes.length > 0 && (
        <section className="py-20 lg:py-24 bg-white dark:bg-gray-900">
          <div className="section-container">
            <AnimatedSection>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-food-green to-food-emerald flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-bold text-food-green uppercase tracking-wider">
                      Fresh & New
                    </span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold font-serif text-charcoal dark:text-white">
                    Recently Added
                  </h2>
                </div>
                <Link
                  to="/recipes"
                  className="hidden sm:flex items-center gap-1.5 text-gold hover:text-gold-dark font-medium text-sm transition-colors group"
                >
                  View All{" "}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </AnimatedSection>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {latestRecipes.slice(0, 8).map((recipe, i) => (
                <motion.div key={recipe.id} variants={staggerItem}>
                  <RecipeCard recipe={recipe} index={i} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-20 lg:py-24 bg-cream dark:bg-gray-950">
        <div className="section-container">
          <AnimatedSection className="text-center mb-12">
            <span className="badge-royal mb-4 inline-flex">Testimonials</span>
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-charcoal dark:text-white">
              What Our Community Says
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah M.",
                role: "Home Chef",
                text: "Recipe Royale transformed my cooking. The step-by-step instructions and timer features make complex recipes feel achievable.",
                avatar: "SM",
                rating: 5,
              },
              {
                name: "Ahmed K.",
                role: "Food Blogger",
                text: "As a Pakistani food blogger, I love sharing authentic recipes here. The Crown Circle community is incredibly supportive.",
                avatar: "AK",
                rating: 5,
              },
              {
                name: "Yuki T.",
                role: "Professional Chef",
                text: "The quality of recipes on this platform is unmatched. It's become my go-to for both inspiration and sharing my creations.",
                avatar: "YT",
                rating: 5,
              },
            ].map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 relative shadow-card hover:shadow-card-hover transition-shadow duration-300">
                  <div className="text-6xl text-gold/10 absolute top-3 left-5 font-serif leading-none">
                    &ldquo;
                  </div>
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 pt-2">
                    {t.text}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-food-orange flex items-center justify-center text-white text-sm font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-charcoal dark:text-white">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ==================== HELPER COMPONENTS ====================
function RatingDots({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating || 0) ? "text-gold fill-gold" : "text-white/30"}`}
        />
      ))}
      <span className="text-sm font-medium text-white ml-1">
        {rating?.toFixed(1)}
      </span>
    </div>
  );
}

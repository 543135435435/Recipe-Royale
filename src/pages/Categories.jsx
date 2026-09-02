import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Grid3X3 } from 'lucide-react';
import AnimatedSection from '../components/animations/AnimatedSection';
import PageTransition from '../components/animations/PageTransition';
import { categoryService } from '../services/recipeService';
import { CATEGORIES, FOOD_CATEGORY_IMAGES } from '../constants';
import { staggerContainer, staggerItem } from '../utils/animations';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService.getCategories().then((res) => {
      setCategories(res.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="py-12 bg-gradient-to-b from-cream to-white dark:from-gray-950 dark:to-gray-900">
        <div className="section-container">
          <AnimatedSection className="text-center mb-10">
            <div className="inline-flex items-center gap-2 badge-royal mb-4">
              <Grid3X3 className="w-3.5 h-3.5" /> Browse
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold font-serif text-charcoal dark:text-white mb-3">
              Recipe <span className="text-gradient">Categories</span>
            </h1>
            <p className="text-gray-500 max-w-lg mx-auto">
              From quick breakfasts to elaborate dinner parties — find exactly what you&apos;re craving
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-10 bg-white dark:bg-gray-900">
        <div className="section-container">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : (
            <>
              {/* Quick Categories (from constants) */}
              <div className="mb-12">
                <h2 className="text-xl font-bold font-serif text-charcoal dark:text-white mb-6">
                  Popular Categories
                </h2>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                >
                  {CATEGORIES.map((cat, i) => (
                    <motion.div key={cat.slug} variants={staggerItem}>
                      <Link
                        to={`/recipes?category=${cat.slug}`}
                        className="group block bg-cream dark:bg-gray-800 rounded-2xl p-5 text-center hover:bg-white dark:hover:bg-gray-700 hover:shadow-card transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                      >
                        <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform duration-300">
                          {cat.icon}
                        </span>
                        <h3 className="text-sm font-bold text-charcoal dark:text-white group-hover:text-gold transition-colors">
                          {cat.name}
                        </h3>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Database Categories (if any) */}
              {categories.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold font-serif text-charcoal dark:text-white mb-6">
                    All Categories
                  </h2>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {categories.map((cat, i) => (
                      <motion.div key={cat.id} variants={staggerItem}>
                        <Link
                          to={`/recipes?category=${cat.id}`}
                          className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500"
                        >
                          {cat.image && (
                            <div className="aspect-[16/9] overflow-hidden">
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="p-5">
                            <h3 className="font-bold text-charcoal dark:text-white group-hover:text-gold transition-colors text-lg">
                              {cat.name}
                            </h3>
                            {cat.description && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                            )}
                            {cat.recipeCount > 0 && (
                              <p className="text-xs text-gold font-medium mt-2">{cat.recipeCount} recipes</p>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageTransition>
  );
}

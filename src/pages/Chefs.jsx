import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Award } from 'lucide-react';
import ChefCard from '../components/common/ChefCard';
import AnimatedSection from '../components/animations/AnimatedSection';
import PageTransition from '../components/animations/PageTransition';
import { userService } from '../services/recipeService';
import { staggerContainer, staggerItem } from '../utils/animations';

export default function Chefs() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await userService.getUsers({ limit: 20 });
        setChefs(res.data.data || []);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-cream to-white dark:from-gray-950 dark:to-gray-900">
        <div className="section-container">
          <AnimatedSection className="text-center">
            <div className="inline-flex items-center gap-2 badge-royal mb-4">
              <Award className="w-3.5 h-3.5" /> Our Talented Chefs
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold font-serif text-charcoal dark:text-white mb-3">
              Meet Our <span className="text-gradient">Chefs</span>
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Discover talented chefs and passionate home cooks from around the world
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Chef Grid */}
      <section className="py-10 bg-white dark:bg-gray-900">
        <div className="section-container">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {chefs.map((chef, i) => (
                <motion.div key={chef.id} variants={staggerItem}>
                  <ChefCard chef={chef} index={i} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && chefs.length === 0 && (
            <div className="text-center py-16">
              <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No chefs found yet. Be the first to join!</p>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, MapPin, Award, Users, BookOpen, Heart } from 'lucide-react';
import AnimatedSection from '../components/animations/AnimatedSection';
import PageTransition from '../components/animations/PageTransition';
import { userService } from '../services/recipeService';
import { staggerContainer, staggerItem } from '../utils/animations';

export default function CrownCircle() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await userService.getUsers({ limit: 12 });
        setMembers(res.data.data || []);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative py-24 bg-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center">
            <Crown className="w-16 h-16 text-gold mx-auto mb-6" />
            <h1 className="text-4xl lg:text-5xl font-bold font-serif mb-4">Crown Circle</h1>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              An exclusive community of passionate cooks and culinary enthusiasts. Share recipes, compete, and earn your crown.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
            {[
              { value: '2,500+', label: 'Members', icon: <Users className="w-6 h-6" /> },
              { value: '45', label: 'Countries', icon: <MapPin className="w-6 h-6" /> },
              { value: '15K+', label: 'Recipes', icon: <BookOpen className="w-6 h-6" /> },
              { value: '50K+', label: 'Favorites', icon: <Heart className="w-6 h-6" /> },
            ].map((stat, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-gold mb-2 flex justify-center">{stat.icon}</div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Members */}
      <section className="py-20 bg-cream dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">Our Community</span>
            <h2 className="text-3xl font-bold font-serif text-charcoal dark:text-white mt-2">Featured Members</h2>
          </AnimatedSection>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {members.map((member, i) => (
                <motion.div key={member.id} variants={staggerItem}>
                  <Link to={`/chefs/${member.id}`}
                    className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-5 hover:shadow-lg transition-all group"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-food-orange flex items-center justify-center text-white text-lg font-bold overflow-hidden flex-shrink-0">
                      {member.avatar ? <img src={member.avatar} alt="" className="w-full h-full object-cover" /> : (member.firstName?.[0] || 'U').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-charcoal dark:text-white text-sm group-hover:text-gold transition-colors truncate">
                        {member.firstName} {member.lastName}
                      </h3>
                      {member.country && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {member.country}
                        </p>
                      )}
                      {member.favoriteCuisine && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gold/10 text-gold rounded-full">{member.favoriteCuisine}</span>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-500 capitalize">{member.experienceLevel}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          <AnimatedSection className="text-center mt-12">
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-food-orange text-white font-semibold rounded-full hover:shadow-xl transition-all">
              <Crown className="w-5 h-5" /> Join the Crown Circle
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </PageTransition>
  );
}

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Globe, Award, Users, ChefHat, ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/animations/AnimatedSection';
import PageTransition from '../components/animations/PageTransition';

export default function About() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-cream via-orange-50 to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="max-w-2xl">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">About Us</span>
            <h1 className="text-4xl lg:text-5xl font-bold font-serif text-charcoal dark:text-white mt-3 mb-6">
              Passion for <span className="text-gradient">Culinary Excellence</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Recipe Royale is more than a recipe platform — it&apos;s a celebration of food, culture, and the joy of cooking. We bring together passionate cooks from around the world to share, learn, and inspire.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <span className="text-sm font-semibold text-gold uppercase tracking-wider">Our Mission</span>
              <h2 className="text-3xl font-bold font-serif text-charcoal dark:text-white mt-2 mb-6">
                Making Great Food Accessible to Everyone
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                We believe that every person deserves access to extraordinary recipes and the knowledge to bring them to life. Our platform connects home cooks with professional chefs, creating a vibrant community where culinary traditions are preserved and new ones are born.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                From the streets of Lahore to the kitchens of Paris, Recipe Royale celebrates the universal language of food. We&apos;re committed to curating authentic, tested recipes that honor the cultures they come from.
              </p>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Heart className="w-6 h-6" />, title: 'Passion', desc: 'Food is love, shared.' },
                  { icon: <Globe className="w-6 h-6" />, title: 'Global', desc: 'Cuisines from 50+ countries.' },
                  { icon: <Award className="w-6 h-6" />, title: 'Quality', desc: 'Every recipe tested and verified.' },
                  { icon: <Users className="w-6 h-6" />, title: 'Community', desc: '50K+ active food lovers.' },
                ].map((v, i) => (
                  <div key={i} className="bg-cream dark:bg-gray-800 rounded-2xl p-6">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-3">{v.icon}</div>
                    <h3 className="font-bold text-charcoal dark:text-white mb-1">{v.title}</h3>
                    <p className="text-sm text-gray-500">{v.desc}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-gold to-food-orange text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <AnimatedSection>
            <ChefHat className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl lg:text-4xl font-bold font-serif mb-4">Ready to Start Your Culinary Journey?</h2>
            <p className="text-lg opacity-90 mb-8">Join thousands of food lovers and start sharing your recipes today.</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gold font-semibold rounded-full hover:shadow-xl transition-all"
            >
              Join Recipe Royale <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </PageTransition>
  );
}

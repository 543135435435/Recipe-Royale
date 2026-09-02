import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Mail, ArrowRight, Heart, Globe, Play, ThumbsUp, MessageCircle } from 'lucide-react';
import { newsletterService } from '../../services/recipeService';
import { CUISINES, CONTINENTS } from '../../constants';
import AnimatedSection from '../animations/AnimatedSection';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      await newsletterService.subscribe(email);
      setSubscribed(true);
      setEmail('');
    } catch {
      // Silently fail for newsletter
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-charcoal text-white relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Newsletter Section */}
      <div className="py-16 border-b border-white/5">
        <div className="section-container">
          <AnimatedSection className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full mb-6">
              <Mail className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold">Weekly Recipes</span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold font-serif mb-3">
              Get Inspired Every Week
            </h3>
            <p className="text-gray-400 mb-8">
              Join 50,000+ food lovers. Receive curated recipes, culinary tips, and seasonal inspiration delivered to your inbox.
            </p>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-food-green/10 border border-food-green/20 rounded-full text-food-green"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Welcome aboard! Check your inbox.</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 bg-white/5 border border-white/10 rounded-l-full text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 bg-gradient-to-r from-gold to-food-orange rounded-r-full text-white font-medium text-sm hover:shadow-lg hover:shadow-gold/25 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </AnimatedSection>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2.5 mb-5">
                <ChefHat className="w-8 h-8 text-gold" />
                <span className="text-xl font-bold font-serif">
                  Recipe <span className="text-gold">Royale</span>
                </span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                Where every recipe tells a story. Discover, cook, share, and celebrate the world&apos;s finest culinary creations.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: <Globe className="w-4 h-4" />, label: 'Instagram' },
                  { icon: <Play className="w-4 h-4" />, label: 'YouTube' },
                  { icon: <ThumbsUp className="w-4 h-4" />, label: 'Facebook' },
                  { icon: <MessageCircle className="w-4 h-4" />, label: 'Twitter' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-gold flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                    aria-label={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Explore */}
            <div>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Explore</h3>
              <ul className="space-y-2.5">
                {[
                  { to: '/recipes', label: 'All Recipes' },
                  { to: '/countries', label: 'Countries' },
                  { to: '/chefs', label: 'Our Chefs' },
                  { to: '/crown-circle', label: 'Crown Circle' },
                  { to: '/categories', label: 'Categories' },
                  { to: '/search', label: 'Search' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-gray-400 hover:text-gold text-sm transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cuisines */}
            <div>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Top Cuisines</h3>
              <ul className="space-y-2.5">
                {['Pakistani', 'Indian', 'Italian', 'Japanese', 'Mexican', 'Thai'].map((cuisine) => (
                  <li key={cuisine}>
                    <Link to={`/recipes?cuisine=${cuisine}`} className="text-gray-400 hover:text-gold text-sm transition-colors duration-200">
                      {cuisine} Cuisine
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Community</h3>
              <ul className="space-y-2.5">
                {[
                  { to: '/register', label: 'Join Us' },
                  { to: '/create-recipe', label: 'Share a Recipe' },
                  { to: '/dashboard', label: 'Dashboard' },
                  { to: '/about', label: 'About Us' },
                  { to: '/services', label: 'Services' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-gray-400 hover:text-gold text-sm transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6">
        <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Recipe Royale. Crafted with <Heart className="w-3.5 h-3.5 inline text-red-500 fill-red-500" /> for food lovers worldwide.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

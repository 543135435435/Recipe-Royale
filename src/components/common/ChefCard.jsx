import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { MapPin, BookOpen, Users, Star } from 'lucide-react';

export default function ChefCard({ chef, index = 0 }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    y.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group"
    >
      <Link to={`/chefs/${chef.id}`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 shine-effect">
          {/* Header gradient */}
          <div className="relative h-44 bg-gradient-to-br from-gold/20 via-food-orange/10 to-food-red/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            {/* Avatar */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gradient-to-br from-gold to-food-orange flex items-center justify-center text-3xl text-white font-bold">
                {chef.avatar ? (
                  <img src={chef.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (chef.firstName?.[0] || 'C').toUpperCase()
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-14 pb-5 px-5 text-center">
            <h3 className="font-bold text-charcoal dark:text-white text-base group-hover:text-gold transition-colors">
              {chef.firstName} {chef.lastName}
            </h3>
            
            {chef.country && (
              <p className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {chef.city ? `${chef.city}, ` : ''}{chef.country}
              </p>
            )}

            {chef.favoriteCuisine && (
              <span className="inline-block mt-2.5 px-3 py-1 text-xs font-semibold bg-gold/10 text-gold rounded-full">
                {chef.favoriteCuisine}
              </span>
            )}

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/50">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gold mb-0.5">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm font-bold text-charcoal dark:text-white">{chef.recipeCount || 0}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Recipes</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gold mb-0.5">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm font-bold text-charcoal dark:text-white">{chef.followerCount || chef.followers?.length || 0}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Followers</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

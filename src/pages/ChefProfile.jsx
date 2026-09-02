import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, BookOpen, Users, Heart, Loader2, ArrowLeft, Award } from 'lucide-react';
import RecipeCard from '../components/common/RecipeCard';
import AnimatedSection from '../components/animations/AnimatedSection';
import PageTransition from '../components/animations/PageTransition';
import { userService, recipeService } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import { formatDate, getCountryFlag } from '../utils/helpers';
import { staggerContainer, staggerItem } from '../utils/animations';

export default function ChefProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, recipesRes] = await Promise.all([
          userService.getUserById(id),
          recipeService.getRecipes({ author: id, limit: 12 }),
        ]);
        setProfile(profileRes.data.data);
        setRecipes(recipesRes.data.data || []);
        setFollowing(currentUser?.following?.includes(id) || false);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, [id, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) return;
    try {
      await userService.followUser(id);
      setFollowing(!following);
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="text-5xl">👨‍🍳</span>
        <p className="text-xl text-gray-500 font-medium">Chef not found</p>
        <Link to="/chefs" className="btn-royal">Browse all chefs</Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-gray-950">
        {/* Hero Header */}
        <div className="relative h-56 lg:h-72 bg-gradient-to-r from-gold/30 via-food-orange/20 to-food-red/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-cream dark:from-gray-950 to-transparent" />
          <Link to="/chefs" className="absolute top-6 left-6 w-11 h-11 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg z-10">
            <ArrowLeft className="w-5 h-5 text-charcoal" />
          </Link>
        </div>

        <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-10">
          <AnimatedSection>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-royal p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gradient-to-br from-gold to-food-orange flex items-center justify-center text-4xl text-white font-bold flex-shrink-0">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (profile.firstName?.[0] || 'C').toUpperCase()
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold font-serif text-charcoal dark:text-white">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  {profile.country && (
                    <p className="text-sm text-gray-500 flex items-center gap-1 justify-center sm:justify-start mt-1">
                      {getCountryFlag(profile.country)} {profile.city ? `${profile.city}, ` : ''}{profile.country}
                    </p>
                  )}
                  {profile.biography && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-lg leading-relaxed">
                      {profile.biography}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start flex-wrap">
                    {profile.favoriteCuisine && (
                      <span className="px-3 py-1 text-xs font-semibold bg-gold/10 text-gold rounded-full">
                        {profile.favoriteCuisine}
                      </span>
                    )}
                    <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full capitalize">
                      {profile.experienceLevel}
                    </span>
                    {profile.role === 'admin' && (
                      <span className="px-3 py-1 text-xs font-semibold bg-gold/10 text-gold rounded-full flex items-center gap-1">
                        <Award className="w-3 h-3" /> Admin
                      </span>
                    )}
                  </div>
                </div>

                {/* Follow Button */}
                {currentUser && currentUser.id !== id && (
                  <button
                    onClick={handleFollow}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      following
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                        : 'btn-royal !py-2.5'
                    }`}
                  >
                    {following ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700/50">
                {[
                  { value: recipes.length, label: 'Recipes', icon: <BookOpen className="w-4 h-4" /> },
                  { value: profile.followers?.length || 0, label: 'Followers', icon: <Users className="w-4 h-4" /> },
                  { value: profile.following?.length || 0, label: 'Following', icon: <Heart className="w-4 h-4" /> },
                  { value: formatDate(profile.createdAt), label: 'Joined', icon: <Calendar className="w-4 h-4" /> },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-gold flex justify-center mb-1">{s.icon}</div>
                    <p className="text-lg font-bold text-charcoal dark:text-white">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Recipes */}
          {recipes.length > 0 && (
            <AnimatedSection className="mt-10 mb-10">
              <h2 className="text-xl font-bold font-serif text-charcoal dark:text-white mb-6">
                Recipes by {profile.firstName}
              </h2>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {recipes.map((r, i) => (
                  <motion.div key={r.id} variants={staggerItem}>
                    <RecipeCard recipe={r} index={i} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, BookOpen, Users, Heart, Loader2 } from 'lucide-react';
import AnimatedSection from '../components/animations/AnimatedSection';
import RecipeCard from '../components/common/RecipeCard';
import PageTransition from '../components/animations/PageTransition';
import { userService, recipeService } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';

export default function Profile() {
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
    try {
      await userService.followUser(id);
      setFollowing(!following);
    } catch {}
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center text-gray-500">Profile not found</div>;

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-gray-950">
        <div className="h-48 bg-gradient-to-r from-gold/20 to-food-orange/20" />
        <div className="max-w-4xl mx-auto px-4 -mt-20">
          <AnimatedSection>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gradient-to-br from-gold to-food-orange flex items-center justify-center text-4xl text-white font-bold">
                  {profile.avatar ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" /> : (profile.firstName?.[0] || 'U').toUpperCase()}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-charcoal dark:text-white">{profile.firstName} {profile.lastName}</h1>
                  {profile.country && <p className="text-sm text-gray-500 flex items-center gap-1 justify-center sm:justify-start"><MapPin className="w-3.5 h-3.5" /> {profile.city ? `${profile.city}, ` : ''}{profile.country}</p>}
                  {profile.biography && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-lg">{profile.biography}</p>}
                </div>
                {currentUser && currentUser.id !== id && (
                  <button onClick={handleFollow} className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${following ? 'bg-gray-100 dark:bg-gray-700 text-gray-600' : 'bg-gold text-white hover:bg-gold-dark'}`}>
                    {following ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
                {[
                  { value: profile.recipeCount || recipes.length, label: 'Recipes' },
                  { value: profile.followerCount || profile.followers?.length || 0, label: 'Followers' },
                  { value: profile.followingCount || profile.following?.length || 0, label: 'Following' },
                  { value: profile.experienceLevel || 'beginner', label: 'Level' },
                  { value: profile.favoriteCuisine || '-', label: 'Cuisine' },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-lg font-bold text-charcoal dark:text-white">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {recipes.length > 0 && (
            <AnimatedSection className="mt-10">
              <h2 className="text-xl font-bold font-serif text-charcoal dark:text-white mb-6">Recipes</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Star, Heart, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AnimatedSection from '../../components/animations/AnimatedSection';
import { userService } from '../../services/recipeService';
import { getRelativeTime } from '../../utils/helpers';
import { staggerContainer, staggerItem } from '../../utils/animations';

const COLORS = ['#C5973E', '#E8683A', '#52B788', '#D4380D', '#4F46E5'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getAdminStats().then((res) => {
      setStats(res.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;
  if (!stats) return <p className="text-gray-500">Failed to load stats</p>;

  const overviewStats = [
    { label: 'Total Users', value: stats.totalUsers, icon: <Users className="w-5 h-5" />, color: 'from-blue-500 to-indigo-500', change: `+${stats.newUsers} this month` },
    { label: 'Total Recipes', value: stats.totalRecipes, icon: <BookOpen className="w-5 h-5" />, color: 'from-gold to-food-orange', change: `+${stats.newRecipes} this month` },
    { label: 'Total Reviews', value: stats.totalReviews, icon: <Star className="w-5 h-5" />, color: 'from-yellow-400 to-orange-500' },
    { label: 'Total Favorites', value: stats.totalFavorites, icon: <Heart className="w-5 h-5" />, color: 'from-red-400 to-pink-500' },
  ];

  const cuisineData = (stats.popularCuisines || []).map((c) => ({ name: c.id, count: c.count }));

  return (
    <div>
      <AnimatedSection className="mb-8">
        <h1 className="text-2xl font-bold font-serif text-charcoal dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your platform</p>
      </AnimatedSection>

      {/* Stats Grid */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {overviewStats.map((stat, i) => (
          <motion.div key={i} variants={staggerItem}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              {stat.change && <span className="text-xs text-food-green font-medium">{stat.change}</span>}
            </div>
            <p className="text-2xl font-bold text-charcoal dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <AnimatedSection>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-charcoal dark:text-white mb-4">Popular Cuisines</h3>
            {cuisineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={cuisineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#C5973E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-sm py-8 text-center">No data available</p>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-charcoal dark:text-white mb-4">Platform Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={[
                  { name: 'Users', value: stats.totalUsers },
                  { name: 'Recipes', value: stats.totalRecipes },
                  { name: 'Reviews', value: stats.totalReviews },
                  { name: 'Favorites', value: stats.totalFavorites },
                ]} dataKey="value" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                  {[0, 1, 2, 3].map((i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AnimatedSection>
      </div>

      {/* Recent */}
      <div className="grid lg:grid-cols-2 gap-6">
        <AnimatedSection>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-charcoal dark:text-white mb-4">Recent Users</h3>
            <div className="space-y-3">
              {(stats.recentUsers || []).map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-food-orange flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : (u.firstName?.[0] || 'U').toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-charcoal dark:text-white">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {getRelativeTime(u.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-charcoal dark:text-white mb-4">Recent Recipes</h3>
            <div className="space-y-3">
              {(stats.recentRecipes || []).map((r) => (
                <div key={r.id} className="flex items-center gap-3">
                  {r.coverImage && <img src={r.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-charcoal dark:text-white line-clamp-1">{r.title}</p>
                    <p className="text-xs text-gray-500">by {r.author?.firstName} {r.author?.lastName}</p>
                  </div>
                  <span className="text-xs text-gray-400">{getRelativeTime(r.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

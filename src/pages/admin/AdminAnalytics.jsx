import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import AnimatedSection from '../../components/animations/AnimatedSection';
import { userService } from '../../services/recipeService';

const COLORS = ['#C5973E', '#E8683A', '#52B788', '#D4380D', '#4F46E5'];

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getAdminStats().then((res) => setStats(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;
  if (!stats) return <p className="text-gray-500">Failed to load</p>;

  const cuisineData = (stats.popularCuisines || []).map((c) => ({ name: c.id, count: c.count }));

  const overviewData = [
    { name: 'Users', total: stats.totalUsers, new: stats.newUsers },
    { name: 'Recipes', total: stats.totalRecipes, new: stats.newRecipes },
    { name: 'Reviews', total: stats.totalReviews, new: 0 },
    { name: 'Favorites', total: stats.totalFavorites, new: 0 },
  ];

  return (
    <div>
      <AnimatedSection className="mb-6">
        <h1 className="text-2xl font-bold font-serif text-charcoal dark:text-white">Analytics</h1>
      </AnimatedSection>

      <div className="grid lg:grid-cols-2 gap-6">
        <AnimatedSection>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-charcoal dark:text-white mb-4">Platform Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={overviewData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#C5973E" radius={[6, 6, 0, 0]} />
                <Bar dataKey="new" fill="#E8683A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-charcoal dark:text-white mb-4">Popular Cuisines</h3>
            {cuisineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={cuisineData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, count }) => `${name} (${count})`}>
                    {cuisineData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-sm text-center py-12">No data available</p>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

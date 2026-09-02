import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Tag, Star, BarChart3, Settings, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

const links = [
  { to: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Users' },
  { to: '/admin/recipes', icon: <BookOpen className="w-5 h-5" />, label: 'Recipes' },
  { to: '/admin/categories', icon: <Tag className="w-5 h-5" />, label: 'Categories' },
  { to: '/admin/reviews', icon: <Star className="w-5 h-5" />, label: 'Reviews' },
  { to: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics' },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <ChefHat className="w-7 h-7 text-gold" />
            <span className="font-bold font-serif text-charcoal dark:text-white">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-gold/10 text-gold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1">
        {/* Mobile admin nav */}
        <div className="lg:hidden flex overflow-x-auto border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive ? 'bg-gold/10 text-gold' : 'text-gray-600 dark:text-gray-400'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

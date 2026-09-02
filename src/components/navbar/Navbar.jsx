import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Search, ChefHat, Moon, Sun, LogOut,
  User, Heart, PlusCircle, LayoutDashboard, Settings,
  Globe, Compass, Crown, BookOpen, Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { staggerContainer, staggerItem } from '../../utils/animations';
import { CUISINES, CONTINENTS } from '../../constants';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(null);
  const megaTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const handleMegaEnter = (menu) => {
    clearTimeout(megaTimeoutRef.current);
    setMegaMenuOpen(menu);
  };

  const handleMegaLeave = () => {
    megaTimeoutRef.current = setTimeout(() => setMegaMenuOpen(null), 200);
  };

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-gold'
        : 'text-charcoal/70 dark:text-gray-300 hover:text-gold dark:hover:text-gold'
    }`;

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/recipes', label: 'Recipes' },
    { to: '/countries', label: 'Countries' },
    { to: '/chefs', label: 'Chefs' },
    { to: '/crown-circle', label: 'Crown Circle' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_24px_rgba(0,0,0,0.04)] border-b border-white/10'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="relative"
              >
                <ChefHat className="w-8 h-8 text-gold" />
                <motion.div
                  className="absolute -inset-1 rounded-full bg-gold/10"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold font-serif text-charcoal dark:text-white tracking-tight">
                  Recipe <span className="text-gradient">Royale</span>
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {publicLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={navLinkClass}>
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="navIndicator"
                          className="absolute bottom-0 left-1 right-1 h-0.5 bg-gradient-to-r from-gold to-food-orange rounded-full"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}

              {/* Cuisine Mega Menu */}
              <div
                onMouseEnter={() => handleMegaEnter('cuisine')}
                onMouseLeave={handleMegaLeave}
                className="relative"
              >
                <button className="relative px-3 py-2 text-sm font-medium text-charcoal/70 dark:text-gray-300 hover:text-gold dark:hover:text-gold transition-colors flex items-center gap-1">
                  Cuisines
                  <motion.svg
                    animate={{ rotate: megaMenuOpen === 'cuisine' ? 180 : 0 }}
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {megaMenuOpen === 'cuisine' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2"
                      onMouseEnter={() => handleMegaEnter('cuisine')}
                      onMouseLeave={handleMegaLeave}
                    >
                      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-royal-lg border border-gray-100 dark:border-gray-800 p-6 w-[600px]">
                        <div className="grid grid-cols-3 gap-4">
                          {CONTINENTS.slice(0, 6).map((continent) => (
                            <div key={continent.name}>
                              <p className="text-xs font-bold text-gold uppercase tracking-wider mb-2">{continent.name}</p>
                              <ul className="space-y-1">
                                {continent.countries.slice(0, 4).map((country) => (
                                  <li key={country}>
                                    <Link
                                      to={`/recipes?cuisine=${country}`}
                                      onClick={() => setMegaMenuOpen(null)}
                                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gold transition-colors block py-0.5"
                                    >
                                      {country}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                          <Link
                            to="/recipes"
                            onClick={() => setMegaMenuOpen(null)}
                            className="text-sm font-medium text-gold hover:text-gold-dark transition-colors flex items-center gap-1"
                          >
                            <Globe className="w-4 h-4" /> All Cuisines
                          </Link>
                          <span className="text-xs text-gray-400">{CUISINES.length}+ cuisines</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <Link
                to="/search"
                className="p-2.5 rounded-full hover:bg-gold/10 dark:hover:bg-gold/10 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-charcoal/70 dark:text-gray-300" />
              </Link>

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full hover:bg-gold/10 dark:hover:bg-gold/10 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gold" />
                ) : (
                  <Moon className="w-5 h-5 text-charcoal/70" />
                )}
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gold/10 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-food-orange flex items-center justify-center text-white text-sm font-bold overflow-hidden ring-2 ring-gold/20">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        (user.firstName?.[0] || 'U').toUpperCase()
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-royal-lg border border-gray-100 dark:border-gray-800 py-2 z-50"
                        onMouseLeave={() => setUserMenuOpen(false)}
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                          <p className="font-semibold text-sm text-charcoal dark:text-white">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <DropdownLink to="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" onClick={() => setUserMenuOpen(false)} />
                          <DropdownLink to="/my-recipes" icon={<ChefHat className="w-4 h-4" />} label="My Recipes" onClick={() => setUserMenuOpen(false)} />
                          <DropdownLink to="/create-recipe" icon={<PlusCircle className="w-4 h-4" />} label="Create Recipe" onClick={() => setUserMenuOpen(false)} />
                          <DropdownLink to="/favorites" icon={<Heart className="w-4 h-4" />} label="Favorites" onClick={() => setUserMenuOpen(false)} />
                          <DropdownLink to="/meal-planner" icon={<BookOpen className="w-4 h-4" />} label="Meal Planner" onClick={() => setUserMenuOpen(false)} />
                          <DropdownLink to="/settings" icon={<Settings className="w-4 h-4" />} label="Settings" onClick={() => setUserMenuOpen(false)} />
                          {user.role === 'admin' && (
                            <>
                              <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
                              <DropdownLink to="/admin" icon={<Crown className="w-4 h-4" />} label="Admin Panel" onClick={() => setUserMenuOpen(false)} />
                            </>
                          )}
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-800 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-5 py-2 text-sm font-medium text-charcoal dark:text-white hover:text-gold transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-royal !px-5 !py-2 !text-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    Join Free
                  </Link>
                </div>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-full hover:bg-gold/10 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-[360px] bg-white dark:bg-gray-950 shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-8">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                    <ChefHat className="w-7 h-7 text-gold" />
                    <span className="text-lg font-bold font-serif">
                      Recipe <span className="text-gradient">Royale</span>
                    </span>
                  </Link>
                  <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search shortcut */}
                <Link
                  to="/search"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-400 mb-6"
                >
                  <Search className="w-5 h-5" />
                  <span className="text-sm">Search recipes...</span>
                </Link>

                {/* Nav Links */}
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-1">
                  {[
                    { to: '/', label: 'Home', icon: <ChefHat className="w-4 h-4" /> },
                    { to: '/recipes', label: 'Recipes', icon: <BookOpen className="w-4 h-4" /> },
                    { to: '/countries', label: 'Countries', icon: <Globe className="w-4 h-4" /> },
                    { to: '/chefs', label: 'Chefs', icon: <User className="w-4 h-4" /> },
                    { to: '/crown-circle', label: 'Crown Circle', icon: <Crown className="w-4 h-4" /> },
                    { to: '/about', label: 'About', icon: <Compass className="w-4 h-4" /> },
                  ].map((link) => (
                    <motion.div key={link.to} variants={staggerItem}>
                      <NavLink
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                            isActive ? 'bg-gold/10 text-gold' : 'text-charcoal dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                          }`
                        }
                      >
                        {link.icon}
                        {link.label}
                      </NavLink>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Cuisine quick links */}
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <p className="px-4 text-xs font-bold text-gold uppercase tracking-wider mb-3">Popular Cuisines</p>
                  <div className="flex flex-wrap gap-2 px-4">
                    {['Pakistani', 'Indian', 'Italian', 'Japanese', 'Mexican', 'Thai'].map((cuisine) => (
                      <Link
                        key={cuisine}
                        to={`/recipes?cuisine=${cuisine}`}
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-1.5 text-xs font-medium bg-gray-50 dark:bg-gray-900 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gold/10 hover:text-gold transition-colors"
                      >
                        {cuisine}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Auth section */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 px-4 py-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-food-orange flex items-center justify-center text-white font-bold overflow-hidden">
                          {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : (user.firstName?.[0] || 'U').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-charcoal dark:text-white">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <MobileLink to="/dashboard" label="Dashboard" onClick={() => setMobileOpen(false)} />
                      <MobileLink to="/create-recipe" label="Create Recipe" onClick={() => setMobileOpen(false)} />
                      <MobileLink to="/favorites" label="Favorites" onClick={() => setMobileOpen(false)} />
                      <MobileLink to="/settings" label="Settings" onClick={() => setMobileOpen(false)} />
                      {user.role === 'admin' && <MobileLink to="/admin" label="Admin Panel" onClick={() => setMobileOpen(false)} />}
                      <button
                        onClick={() => { handleLogout(); setMobileOpen(false); }}
                        className="w-full text-left px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 px-4">
                      <Link
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                        className="block w-full text-center px-4 py-3 border-2 border-gold text-gold rounded-full font-medium hover:bg-gold/5 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileOpen(false)}
                        className="block w-full text-center px-4 py-3 btn-royal"
                      >
                        Join Recipe Royale
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function DropdownLink({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gold transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileLink({ to, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gold transition-colors"
    >
      {label}
    </Link>
  );
}

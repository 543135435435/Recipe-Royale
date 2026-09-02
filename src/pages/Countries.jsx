import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MapPin, ChevronRight, Search } from 'lucide-react';
import AnimatedSection from '../components/animations/AnimatedSection';
import PageTransition from '../components/animations/PageTransition';
import { CONTINENTS, COUNTRIES, CUISINE_IMAGES } from '../constants';
import { staggerContainer, staggerItem } from '../utils/animations';

export default function Countries() {
  const [activeContinent, setActiveContinent] = useState(null);
  const [search, setSearch] = useState('');

  const filteredCountries = COUNTRIES.filter((c) => {
    if (activeContinent) {
      const continent = CONTINENTS.find((con) => con.name === activeContinent);
      if (continent && !continent.countries.includes(c.name)) return false;
    }
    if (search) {
      return c.name.toLowerCase().includes(search.toLowerCase()) ||
             c.cuisine.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-charcoal via-gray-900 to-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1600" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="section-container relative z-10">
          <AnimatedSection className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full mb-6 border border-gold/15">
              <Globe className="w-4 h-4 text-gold" />
              <span className="text-sm font-semibold text-gold tracking-wide">World Cuisine</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold font-serif text-white mb-4">
              Explore the World <br className="hidden sm:block" />
              <span className="text-gradient">Through Food</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              Journey through continents and discover the culinary traditions that connect us all
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Continents */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="section-container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold font-serif text-charcoal dark:text-white mb-3">
              Choose a Continent
            </h2>
            <p className="text-gray-500">Start your culinary journey from any corner of the globe</p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {/* All button */}
            <motion.div variants={staggerItem}>
              <button
                onClick={() => setActiveContinent(null)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                  !activeContinent
                    ? 'border-gold bg-gold/5 shadow-royal-gold'
                    : 'border-gray-100 dark:border-gray-700 hover:border-gold/30 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌍</span>
                    <div>
                      <p className="font-bold text-charcoal dark:text-white">All Countries</p>
                      <p className="text-xs text-gray-500">{COUNTRIES.length} countries</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-colors ${!activeContinent ? 'text-gold' : 'text-gray-400'}`} />
                </div>
              </button>
            </motion.div>

            {CONTINENTS.map((continent) => (
              <motion.div key={continent.name} variants={staggerItem}>
                <button
                  onClick={() => setActiveContinent(activeContinent === continent.name ? null : continent.name)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                    activeContinent === continent.name
                      ? 'border-gold bg-gold/5 shadow-royal-gold'
                      : 'border-gray-100 dark:border-gray-700 hover:border-gold/30 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-charcoal dark:text-white mb-0.5">{continent.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{continent.description}</p>
                    </div>
                    <div className="text-sm text-gray-400">
                      {continent.countries.length}+
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Country Grid */}
      <section className="py-16 bg-cream dark:bg-gray-950">
        <div className="section-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold font-serif text-charcoal dark:text-white">
                {activeContinent || 'All'} Countries
              </h2>
              <p className="text-sm text-gray-500 mt-1">{filteredCountries.length} countries</p>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search countries..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredCountries.map((country, i) => (
              <motion.div key={country.code} variants={staggerItem}>
                <Link
                  to={`/recipes?cuisine=${country.cuisine}`}
                  className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={CUISINE_IMAGES[country.cuisine] || CUISINE_IMAGES['Italian']}
                      alt={country.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="text-3xl">{country.flag}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-lg">{country.name}</h3>
                      <p className="text-white/60 text-xs">{country.cuisine} Cuisine</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filteredCountries.length === 0 && (
            <div className="text-center py-16">
              <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No countries match your search</p>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}

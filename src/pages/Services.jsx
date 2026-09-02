import { Link } from 'react-router-dom';
import { BookOpen, Users, Crown, ChefHat, Utensils, Calendar, ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/animations/AnimatedSection';
import PageTransition from '../components/animations/PageTransition';

export default function Services() {
  const services = [
    { icon: <BookOpen className="w-7 h-7" />, title: 'Recipe Library', desc: 'Access hundreds of curated recipes from world cuisines with step-by-step instructions, nutrition info, and cooking timers.', color: 'from-gold to-gold-light' },
    { icon: <Crown className="w-7 h-7" />, title: 'Crown Circle', desc: 'Join our exclusive culinary community for networking, competitions, and premium content from top chefs.', color: 'from-food-orange to-food-red' },
    { icon: <Utensils className="w-7 h-7" />, title: 'Meal Planning', desc: 'Plan your weekly meals with our intelligent planner. Organize recipes, track nutrition, and simplify your cooking routine.', color: 'from-food-green to-emerald-500' },
    { icon: <ChefHat className="w-7 h-7" />, title: 'Chef Profiles', desc: 'Build your professional chef profile, showcase your recipes, and grow your following in the culinary community.', color: 'from-purple-500 to-pink-500' },
    { icon: <Users className="w-7 h-7" />, title: 'Community', desc: 'Connect with food enthusiasts worldwide. Share tips, review recipes, and discover new culinary perspectives.', color: 'from-blue-500 to-cyan-500' },
    { icon: <Calendar className="w-7 h-7" />, title: 'Culinary Events', desc: 'Participate in recipe challenges, cooking competitions, and virtual culinary events with the global community.', color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <PageTransition>
      <section className="py-24 bg-gradient-to-br from-cream via-orange-50 to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold text-gold uppercase tracking-wider">What We Offer</span>
            <h1 className="text-4xl lg:text-5xl font-bold font-serif text-charcoal dark:text-white mt-3 mb-6">
              Our <span className="text-gradient">Services</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to elevate your cooking journey, all in one premium platform.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                    {s.icon}
                  </div>
                  <h3 className="text-xl font-bold text-charcoal dark:text-white mb-3">{s.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-16">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-food-orange text-white font-semibold rounded-full hover:shadow-xl hover:shadow-gold/25 transition-all"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </PageTransition>
  );
}

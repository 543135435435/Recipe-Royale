import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Save } from 'lucide-react';
import PageTransition from '../components/animations/PageTransition';
import AnimatedSection from '../components/animations/AnimatedSection';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { CUISINES, EXPERIENCE_LEVELS } from '../constants';

const inputClass = 'w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-charcoal dark:text-white focus:ring-2 focus:ring-gold focus:border-transparent';

export default function Settings() {
  const { user, updateProfile, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '',
    phone: user?.phone || '', country: user?.country || '', city: user?.city || '',
    favoriteCuisine: user?.favoriteCuisine || '', experienceLevel: user?.experienceLevel || '',
    biography: user?.biography || '', avatar: user?.avatar || '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This cannot be undone.')) return;
    await logout();
    navigate('/');
  };

  return (
    <PageTransition>
      <div className="min-h-screen py-10 bg-cream dark:bg-gray-950">
        <div className="max-w-2xl mx-auto px-4">
          <AnimatedSection className="mb-8">
            <h1 className="text-3xl font-bold font-serif text-charcoal dark:text-white">Settings</h1>
          </AnimatedSection>
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First Name"><input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} /></Field>
              <Field label="Last Name"><input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} /></Field>
              <Field label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} /></Field>
              <Field label="Country"><input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputClass} /></Field>
              <Field label="City"><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} /></Field>
              <Field label="Avatar URL"><input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className={inputClass} /></Field>
              <Field label="Favorite Cuisine">
                <select value={form.favoriteCuisine} onChange={(e) => setForm({ ...form, favoriteCuisine: e.target.value })} className={inputClass}>
                  <option value="">Select</option>
                  {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Experience Level">
                <select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })} className={inputClass}>
                  <option value="">Select</option>
                  {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Biography"><textarea value={form.biography} onChange={(e) => setForm({ ...form, biography: e.target.value })} className={inputClass + ' resize-none'} rows={3} /></Field>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-gold to-food-orange text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
            <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all data.</p>
            <button onClick={handleDeleteAccount} className="px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function Field({ label, children }) {
  return <div><label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1.5">{label}</label>{children}</div>;
}

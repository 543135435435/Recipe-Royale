import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ChefHat, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/animations/PageTransition';
import { toast } from 'sonner';
import { CUISINES, EXPERIENCE_LEVELS } from '../constants';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  country: z.string().optional(),
  city: z.string().optional(),
  favoriteCuisine: z.string().optional(),
  experienceLevel: z.string().optional(),
  biography: z.string().max(500).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const { confirmPassword, ...submitData } = data;
    try {
      await registerUser(submitData);
      toast.success('Welcome to Recipe Royale!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <ChefHat className="w-10 h-10 text-gold" />
              <span className="text-2xl font-bold font-serif text-charcoal dark:text-white">Recipe <span className="text-gold">Royale</span></span>
            </Link>
            <h1 className="text-2xl font-bold text-charcoal dark:text-white">Create Your Account</h1>
            <p className="text-gray-500 mt-1">Join our culinary community today</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First Name" error={errors.firstName}>
                <input {...register('firstName')} className={inputClass} placeholder="First name" />
              </Field>
              <Field label="Last Name" error={errors.lastName}>
                <input {...register('lastName')} className={inputClass} placeholder="Last name" />
              </Field>
              <Field label="Email" error={errors.email} className="sm:col-span-2">
                <input type="email" {...register('email')} className={inputClass} placeholder="your@email.com" />
              </Field>
              <Field label="Phone" className="sm:col-span-2">
                <input type="tel" {...register('phone')} className={inputClass} placeholder="+92 300 1234567" />
              </Field>
              <Field label="Password" error={errors.password}>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} {...register('password')} className={inputClass + ' pr-10'} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>
              <Field label="Confirm Password" error={errors.confirmPassword}>
                <input type="password" {...register('confirmPassword')} className={inputClass} placeholder="••••••••" />
              </Field>
              <Field label="Country">
                <input {...register('country')} className={inputClass} placeholder="Country" />
              </Field>
              <Field label="City">
                <input {...register('city')} className={inputClass} placeholder="City" />
              </Field>
              <Field label="Favorite Cuisine">
                <select {...register('favoriteCuisine')} className={inputClass}>
                  <option value="">Select cuisine</option>
                  {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Experience Level">
                <select {...register('experienceLevel')} className={inputClass}>
                  <option value="">Select level</option>
                  {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                </select>
              </Field>
              <Field label="Bio" className="sm:col-span-2">
                <textarea {...register('biography')} className={inputClass + ' resize-none'} rows={3} placeholder="Tell us about your cooking journey..." />
              </Field>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 bg-gradient-to-r from-gold to-food-orange text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-gold/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</> : 'Create Account'}
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-gold hover:text-gold-dark font-medium">Sign in</Link>
            </p>
          </motion.form>
        </div>
      </div>
    </PageTransition>
  );
}

const inputClass = 'w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-charcoal dark:text-white focus:ring-2 focus:ring-gold focus:border-transparent transition-all';

function Field({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

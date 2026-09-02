import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Mail, Loader2 } from 'lucide-react';
import PageTransition from '../components/animations/PageTransition';
import api from '../api/axios';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[85vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <ChefHat className="w-10 h-10 text-gold" />
              <span className="text-2xl font-bold font-serif">Recipe <span className="text-gold">Royale</span></span>
            </Link>
            <h1 className="text-2xl font-bold text-charcoal dark:text-white">Reset Password</h1>
            <p className="text-gray-500 mt-1">Enter your email to receive a reset link</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            {sent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-food-green/10 flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-food-green" />
                </div>
                <h2 className="text-lg font-semibold text-charcoal dark:text-white mb-2">Check your email</h2>
                <p className="text-sm text-gray-500 mb-6">We&apos;ve sent a password reset link to <strong>{email}</strong></p>
                <Link to="/login" className="text-sm text-gold hover:text-gold-dark font-medium">← Back to login</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1.5">Email</label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-charcoal dark:text-white focus:ring-2 focus:ring-gold"
                    placeholder="your@email.com"
                  />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-gold to-food-orange text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : 'Send Reset Link'}
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Remember your password? <Link to="/login" className="text-gold hover:text-gold-dark font-medium">Sign in</Link>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

import { useState, useEffect } from 'react';
import { Trash2, Shield, User as UserIcon } from 'lucide-react';
import AnimatedSection from '../../components/animations/AnimatedSection';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { userService } from '../../services/recipeService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    try {
      const res = await userService.getUsers({ limit: 50 });
      setUsers(res.data.data || []);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [user?.id, user?.role]);

  const handleDelete = async () => {
    try {
      await userService.deleteUser(deleteId);
      setUsers(users.filter((u) => u.id !== deleteId));
      toast.success('User deleted');
    } catch { toast.error('Failed'); }
    setDeleteId(null);
  };

  return (
    <div>
      <AnimatedSection className="mb-6">
        <h1 className="text-2xl font-bold font-serif text-charcoal dark:text-white">Manage Users</h1>
      </AnimatedSection>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 text-left">
                <th className="px-6 py-3 font-medium text-gray-500">User</th>
                <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                <th className="px-6 py-3 font-medium text-gray-500">Role</th>
                <th className="px-6 py-3 font-medium text-gray-500">Country</th>
                <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-food-orange flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                        {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : (u.firstName?.[0] || 'U').toUpperCase()}
                      </div>
                      <span className="font-medium text-charcoal dark:text-white">{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{u.email}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${u.role === 'admin' ? 'bg-gold/10 text-gold' : u.role === 'chef' ? 'bg-food-orange/10 text-food-orange' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{u.country || '-'}</td>
                  <td className="px-6 py-3">
                    <button onClick={() => setDeleteId(u.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete User" message="Are you sure? This will delete all their data." />
    </div>
  );
}

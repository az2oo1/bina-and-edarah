import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Users, Plus, Loader2, Trash2, Edit2, Shield, X, Lock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlatformUser {
  id: string;
  username: string;
  name: string;
  role: string;
  email?: string;
  createdAt: string;
}

export default function AdminUsers() {
  const { language } = useLanguage();
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [email, setEmail] = useState('');

  // Get current logged in user from localStorage
  const currentUserId = (() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u).id : '';
    } catch (_) {
      return '';
    }
  })();

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setError(language === 'ar' ? 'فشل تحميل مستخدمي المنصة' : 'Failed to fetch platform users');
      }
    } catch (err) {
      setError(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setName('');
    setRole('ADMIN');
    setEmail('');
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (user: PlatformUser) => {
    setEditingId(user.id);
    setUsername(user.username);
    setName(user.name);
    setRole(user.role);
    setEmail(user.email || '');
    setPassword(''); // leave blank if no password change
    setShowAddForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (id === currentUserId) {
      alert(language === 'ar' ? 'لا يمكنك حذف حسابك الشخصي الذي تستخدمه حالياً!' : 'You cannot delete your own active account!');
      return;
    }
    if (!window.confirm(language === 'ar' ? `هل أنت متأكد من حذف المستخدم "${name}"؟` : `Are you sure you want to delete user "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
        showSuccess(language === 'ar' ? 'تم حذف المستخدم بنجاح' : 'User deleted successfully');
      } else {
        const errData = await res.json();
        alert(errData.error || (language === 'ar' ? 'فشل حذف المستخدم' : 'Failed to delete user'));
      }
    } catch (err) {
      alert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error');
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');

    const payload = {
      username,
      name,
      role,
      email,
      ...(password ? { password } : {})
    };

    try {
      const url = editingId ? `/api/admin/users/${editingId}` : '/api/admin/users';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showSuccess(editingId 
          ? (language === 'ar' ? 'تم تعديل المستخدم بنجاح' : 'User updated successfully')
          : (language === 'ar' ? 'تم إضافة المستخدم بنجاح' : 'User added successfully')
        );
        resetForm();
        fetchUsers();
      } else {
        const errData = await res.json();
        setError(errData.error || (language === 'ar' ? 'فشل حفظ بيانات المستخدم' : 'Failed to save user'));
      }
    } catch (err) {
      setError(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {language === 'ar' ? 'مستخدمو المنصة (الموظفون)' : 'Platform Users & Staff'}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'ar' ? 'إدارة حسابات الموظفين والمسؤولين وصلاحياتهم' : 'Manage administrator and staff accounts and permissions'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (showAddForm) resetForm();
            else setShowAddForm(true);
          }}
          className="btn-primary flex items-center gap-1.5 h-10 px-5 text-xs font-bold rounded-lg shadow-sm"
        >
          {showAddForm ? (
            <>
              <X className="w-4 h-4" />
              <span>{language === 'ar' ? 'إلغاء' : 'Cancel'}</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة مستخدم جديد' : 'Add New User'}</span>
            </>
          )}
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-xs font-bold">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {showAddForm ? (
          <motion.form
            key="userForm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm max-w-xl space-y-5"
          >
            <h3 className="font-bold text-sm text-foreground border-b border-border pb-2 mb-4">
              {editingId ? (language === 'ar' ? 'تعديل بيانات الحساب' : 'Edit Account Details') : (language === 'ar' ? 'إنشاء حساب موظف جديد' : 'Create New Staff Account')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input-field"
                  placeholder={language === 'ar' ? 'الاسم المعروض للموظف' : 'Staff display name'}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
                <input
                  required
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="input-field"
                  placeholder={language === 'ar' ? 'اسم تسجيل الدخول' : 'Login username'}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  {language === 'ar' ? 'كلمة المرور' : 'Password'}
                  {editingId && <span className="text-[10px] text-muted-foreground font-normal ml-1">({language === 'ar' ? 'اتركه فارغاً بعدم التعديل' : 'leave blank to keep unchanged'})</span>}
                </label>
                <input
                  required={!editingId}
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field"
                  placeholder={editingId ? '********' : (language === 'ar' ? 'كلمة السر' : 'Password')}
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'الدور / الصلاحيات' : 'Role / Permissions'}</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="input-field"
                >
                  <option value="ADMIN">{language === 'ar' ? 'مسؤول النظام (Admin)' : 'System Admin'}</option>
                  <option value="MANAGER">{language === 'ar' ? 'مدير مكتب (Manager)' : 'Office Manager'}</option>
                  <option value="AGENT">{language === 'ar' ? 'وكيل عقاري (Agent)' : 'Real Estate Agent'}</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'البريد الإلكتروني للتنبيهات' : 'Notification Email Address'}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="employee@yourdomain.com"
                dir="ltr"
              />
            </div>

            <div className="pt-2 border-t border-border flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="btn-outline h-9 px-4 text-xs font-semibold rounded-lg"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="btn-primary h-9 px-6 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? (language === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (language === 'ar' ? 'إنشاء الحساب' : 'Create Account')}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="usersList"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
                <span className="text-xs">{language === 'ar' ? 'جاري تحميل المستخدمين...' : 'Loading accounts...'}</span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-20 bg-card border border-border rounded-xl">
                <Users className="w-10 h-10 mx-auto text-muted-foreground opacity-50 mb-3" />
                <p className="text-sm font-semibold text-foreground">
                  {language === 'ar' ? 'لا يوجد مستخدمون حالياً' : 'No staff accounts found'}
                </p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-right rtl:text-right ltr:text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border text-muted-foreground text-xs font-bold">
                        <th className="px-6 py-4">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</th>
                        <th className="px-6 py-4">{language === 'ar' ? 'اسم المستخدم' : 'Username'}</th>
                        <th className="px-6 py-4">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</th>
                        <th className="px-6 py-4">{language === 'ar' ? 'الدور / الصلاحية' : 'Role'}</th>
                        <th className="px-6 py-4 text-center">{language === 'ar' ? 'التحكم' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-xs">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4 font-bold text-foreground flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-border flex items-center justify-center font-bold text-primary">
                              {u.name.charAt(0)}
                            </div>
                            <span>{u.name}</span>
                            {u.id === currentUserId && (
                              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                                {language === 'ar' ? 'أنت' : 'You'}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-medium text-foreground text-justify" dir="ltr">
                            {u.username}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground" dir="ltr">
                            {u.email || '—'}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            <span className="inline-flex items-center gap-1 bg-slate-100 border border-border px-2.5 py-1 rounded-md text-[11px] font-semibold text-gray-800">
                              <Shield className="w-3.5 h-3.5 text-primary" />
                              {u.role === 'ADMIN' ? (language === 'ar' ? 'مسؤول نظام' : 'System Admin') : u.role === 'MANAGER' ? (language === 'ar' ? 'مدير مكتب' : 'Manager') : (language === 'ar' ? 'موظف/وكيل' : 'Agent')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(u)}
                                className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors cursor-pointer"
                                title={language === 'ar' ? 'تعديل' : 'Edit'}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              
                              <button
                                onClick={() => handleDelete(u.id, u.name)}
                                disabled={u.id === currentUserId}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${u.id === currentUserId ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-destructive/10 hover:bg-destructive/20 text-destructive cursor-pointer'}`}
                                title={language === 'ar' ? 'حذف' : 'Delete'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

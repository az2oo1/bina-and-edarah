import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Users, Plus, Loader2, Trash2, Edit2, Shield, X, CheckCircle2, Building2, Save, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDialog } from '../context/DialogContext';
import { CustomSelect } from '../components/CustomSelect';

interface PlatformUser {
  id: string;
  username: string;
  name: string;
  role: string;
  email?: string;
  assignedBuildings?: { id: string; name: string }[];
  createdAt: string;
}

export default function AdminUsers() {
  const { language } = useLanguage();
  const { showAlert, showConfirm } = useDialog();
  const [users, setUsers] = useState<PlatformUser[]>([]);
const [allBuildings, setAllBuildings] = useState<{ id: string; name: string; _count?: { units: number }; units?: any[] }[]>([]);

function isUnitName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (!trimmed) return false;
  if (/^\d+$/.test(trimmed) || /^[a-zA-Z]{1,2}-?\d+$/.test(trimmed)) return true;
  const unitRegex = /^(شقة|وحدة|محل|معرض|مكتب|دور|غرفة|استديو|ستوديو|جناح|unit|apt|apartment|flat|room|suite|shop|office|studio)\b/i;
  return unitRegex.test(trimmed);
}
  const [buildingSearch, setBuildingSearch] = useState('');
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
  const [selectedBuildingIds, setSelectedBuildingIds] = useState<string[]>([]);

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

  const fetchBuildings = async () => {
    try {
      const res = await fetch('/api/admin/buildings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const filtered = data.filter((b: any) => b.name && !isUnitName(b.name));
          const uniqueById = Array.from(new Map(filtered.map((b: any) => [b.id, b])).values());
          setAllBuildings(uniqueById);
        } else {
          setAllBuildings([]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch buildings", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBuildings();
  }, []);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setName('');
    setRole('ADMIN');
    setEmail('');
    setSelectedBuildingIds([]);
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (user: PlatformUser) => {
    setEditingId(user.id);
    setUsername(user.username);
    setName(user.name);
    setRole(user.role);
    setEmail(user.email || '');
    setSelectedBuildingIds(user.assignedBuildings?.map(b => b.id) || []);
    setPassword(''); // leave blank if no password change
    setShowAddForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (id === currentUserId) {
      await showAlert(language === 'ar' ? 'لا يمكنك حذف حسابك الشخصي الذي تستخدمه حالياً!' : 'You cannot delete your own active account!');
      return;
    }
    const confirmed = await showConfirm(language === 'ar' ? `هل أنت متأكد من حذف المستخدم "${name}"؟` : `Are you sure you want to delete user "${name}"?`);
    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
        showSuccess(language === 'ar' ? 'تم حذف المستخدم بنجاح' : 'User deleted successfully');
      } else {
        const errData = await res.json();
        await showAlert(errData.error || (language === 'ar' ? 'فشل حذف المستخدم' : 'Failed to delete user'));
      }
    } catch (err) {
      await showAlert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error');
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
      assignedBuildingIds: selectedBuildingIds,
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
      {/* Standard Admin Header Block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">
              {language === 'ar' ? 'مستخدمو المنصة (الموظفون)' : 'Platform Users & Staff'}
            </h1>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {language === 'ar' ? 'إدارة حسابات الموظفين والمسؤولين وصلاحياتهم وتعيينهم للمباني' : 'Manage administrator and staff accounts, permissions, and building assignments'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (showAddForm) resetForm();
            else setShowAddForm(true);
          }}
          className={`h-9 px-4 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${
            showAddForm 
              ? 'border border-border bg-card text-foreground hover:bg-muted' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {showAddForm ? (
            <>
              <X className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إلغاء' : 'Cancel'}</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
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
            className="bg-card border border-border rounded-2xl p-6 shadow-sm w-full space-y-5"
          >
            <h3 className="font-bold text-sm text-foreground border-b border-border pb-3 flex items-center justify-between">
              <span>
                {editingId ? (language === 'ar' ? 'تعديل بيانات الحساب' : 'Edit Account Details') : (language === 'ar' ? 'إنشاء حساب موظف جديد' : 'Create New Staff Account')}
              </span>
              <span className="text-xs text-muted-foreground font-normal hidden sm:inline">
                {language === 'ar' ? 'قم بتعبئة البيانات وتحديد المباني المشرف عليها الموظف' : 'Fill account details & select assigned buildings'}
              </span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Account Credentials Column */}
              <div className="lg:col-span-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <CustomSelect
                      value={role}
                      onChange={val => setRole(val)}
                      options={[
                        { value: 'MAINTENANCE', label: language === 'ar' ? 'مسؤول / فني صيانة (Maintenance Staff)' : 'Maintenance Staff' },
                        { value: 'MANAGER', label: language === 'ar' ? 'مدير مكتب (Manager)' : 'Office Manager' },
                        { value: 'ADMIN', label: language === 'ar' ? 'مسؤول النظام (Admin)' : 'System Admin' },
                        { value: 'AGENT', label: language === 'ar' ? 'وكيل عقاري (Agent)' : 'Real Estate Agent' }
                      ]}
                    />
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

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="btn-primary h-10 px-6 text-xs font-extrabold flex items-center gap-2 cursor-pointer"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{editingId ? (language === 'ar' ? 'تحديث البيانات' : 'Update User') : (language === 'ar' ? 'حفظ الحساب الجديد' : 'Save New User')}</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-outline h-10 px-5 text-xs font-bold cursor-pointer"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </div>

              {/* Building Overseer Selection Panel */}
              <div className="lg:col-span-6 bg-primary/5 p-4 rounded-2xl border border-primary/20 h-full flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-primary/10 mb-3">
                    <label className="text-xs font-black text-foreground flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-primary" />
                      <span>{language === 'ar' ? 'تحديد المباني التي يشرف عليها الموظف:' : 'Select Buildings Overseen by Staff:'}</span>
                      <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 font-bold px-2 py-0.5 rounded-full ml-1">
                        {selectedBuildingIds.length} {language === 'ar' ? 'مبنى محدد' : 'selected'}
                      </span>
                    </label>
                    
                    {allBuildings.length > 0 && (
                      <div className="flex items-center gap-2 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => setSelectedBuildingIds(allBuildings.map(b => b.id))}
                          className="text-primary hover:underline cursor-pointer"
                        >
                          {language === 'ar' ? 'تحديد الكل' : 'Select All'}
                        </button>
                        <span className="text-muted-foreground">•</span>
                        <button
                          type="button"
                          onClick={() => setSelectedBuildingIds([])}
                          className="text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
                        >
                          {language === 'ar' ? 'إلغاء الكل' : 'Clear All'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Real-time Search Input */}
                  <div className="relative mb-3">
                    <Search className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto pointer-events-none" />
                    <input
                      type="text"
                      value={buildingSearch}
                      onChange={e => setBuildingSearch(e.target.value)}
                      placeholder={language === 'ar' ? 'ابحث باسم المبنى...' : 'Search building by full name...'}
                      className="w-full bg-card border border-border rounded-xl py-2 px-9 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground shadow-2xs"
                    />
                    {buildingSearch && (
                      <button
                        type="button"
                        onClick={() => setBuildingSearch('')}
                        className="absolute left-3 top-1/2 -translate-y-1/2 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-muted-foreground hover:text-foreground p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Full Name Vertical List Layout */}
                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar p-1">
                    {allBuildings.length === 0 ? (
                      <span className="text-[11px] text-muted-foreground py-4 text-center">{language === 'ar' ? 'لا توجد مباني مضافة حتى الآن' : 'No buildings created yet'}</span>
                    ) : (() => {
                      const filtered = allBuildings.filter(b => b.name.toLowerCase().includes(buildingSearch.toLowerCase()));
                      if (filtered.length === 0) {
                        return (
                          <div className="py-6 text-center text-xs text-muted-foreground font-medium">
                            {language === 'ar' ? 'لا يوجد مبنى يطابق نتيجة البحث' : 'No building matches search query'}
                          </div>
                        );
                      }
                      return filtered.map(b => {
                        const checked = selectedBuildingIds.includes(b.id);
                        return (
                          <label key={b.id} className={`flex items-center gap-3 text-xs font-extrabold cursor-pointer select-none p-3 rounded-xl border transition-all ${
                            checked 
                              ? 'bg-primary/10 border-primary/40 text-primary shadow-2xs ring-1 ring-primary/30' 
                              : 'bg-card border-border/80 text-foreground hover:bg-muted/50'
                          }`}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={e => {
                                if (e.target.checked) {
                                  setSelectedBuildingIds(prev => [...prev, b.id]);
                                } else {
                                  setSelectedBuildingIds(prev => prev.filter(id => id !== b.id));
                                }
                              }}
                              className="rounded text-primary focus:ring-primary h-4 w-4 shrink-0 cursor-pointer"
                            />
                            <Building2 className="w-4 h-4 shrink-0 opacity-70" />
                            <div className="flex-1 flex items-center justify-between gap-2 overflow-hidden">
                              <span className="break-words leading-snug">{b.name}</span>
                              <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full shrink-0 border border-primary/20">
                                {b._count?.units !== undefined ? b._count.units : (b.units?.length || 0)} {language === 'ar' ? 'وحدة' : 'units'}
                              </span>
                            </div>
                          </label>
                        );
                      });
                    })()}
                  </div>
                </div>

                <div className="pt-2 border-t border-primary/10 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-semibold">{language === 'ar' ? 'إجمالي المباني في المنصة:' : 'Total Platform Buildings:'} {allBuildings.length}</span>
                  <span className="font-mono font-bold text-primary">{selectedBuildingIds.length} / {allBuildings.length}</span>
                </div>
              </div>
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
              <div className="admin-card overflow-hidden shadow-xs">
                <div className="overflow-x-auto overflow-y-hidden">
                  <table className="w-full text-right rtl:text-right ltr:text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border text-muted-foreground text-xs font-bold">
                        <th className="px-6 py-4">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</th>
                        <th className="px-6 py-4">{language === 'ar' ? 'اسم المستخدم' : 'Username'}</th>
                        <th className="px-6 py-4">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</th>
                        <th className="px-6 py-4">{language === 'ar' ? 'الدور والتعيينات' : 'Role & Assignments'}</th>
                        <th className="px-6 py-4 text-center">{language === 'ar' ? 'التحكم' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-xs">
                      {users.map((u, idx) => (
                        <tr 
                          key={u.id} 
                          className="hover:bg-muted/10 transition-colors admin-stagger-item"
                          style={{ animationDelay: `${idx * 25}ms` }}
                        >
                          <td className="px-6 py-4 font-bold text-foreground flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-border flex items-center justify-center font-bold text-primary shrink-0">
                              {u.name.charAt(0)}
                            </div>
                            <span>{u.name}</span>
                            {u.id === currentUserId && (
                              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium shrink-0">
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
                            <div className="flex flex-col gap-1 items-start">
                              <span className="inline-flex items-center gap-1 bg-slate-100 border border-border px-2.5 py-1 rounded-md text-[11px] font-semibold text-gray-800">
                                <Shield className="w-3.5 h-3.5 text-primary" />
                                {u.role === 'ADMIN' ? (language === 'ar' ? 'مسؤول نظام' : 'System Admin') : u.role === 'MANAGER' ? (language === 'ar' ? 'مدير مكتب' : 'Manager') : u.role === 'MAINTENANCE' ? (language === 'ar' ? 'مسؤول صيانة' : 'Maintenance Staff') : (language === 'ar' ? 'موظف/وكيل' : 'Agent')}
                              </span>
                              {u.assignedBuildings && u.assignedBuildings.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {u.assignedBuildings.map(b => (
                                    <span key={b.id} className="inline-flex items-center gap-1 text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                                      <Building2 className="w-3 h-3" />
                                      <span>{b.name}</span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(u)}
                                className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-transform active:scale-[0.97] cursor-pointer"
                                title={language === 'ar' ? 'تعديل' : 'Edit'}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              
                              <button
                                onClick={() => handleDelete(u.id, u.name)}
                                disabled={u.id === currentUserId}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform active:scale-[0.97] ${u.id === currentUserId ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-destructive/10 hover:bg-destructive/20 text-destructive cursor-pointer'}`}
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


import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Users, Search, Building2, Phone, Plus, UserPlus, Pencil, Trash2, Home, Check, Loader2, X, Wrench, Calendar, FileText } from 'lucide-react';
import { useDialog } from '../context/DialogContext';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface RenterUnit {
  id: string;
  unitNumber: string;
  contractEndDate: string | null;
  rentAmount: number | null;
  building?: {
    id: string;
    name: string;
  };
}

interface RenterUser {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  units: RenterUnit[];
}

interface Building {
  id: string;
  name: string;
  units?: RenterUnit[];
}

export default function AdminRenters() {
  const { language } = useLanguage();
  const { showAlert, showConfirm } = useDialog();

  const [renters, setRenters] = useState<RenterUser[]>([]);
  const [allUnits, setAllUnits] = useState<RenterUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add / Edit Renter Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRenter, setEditingRenter] = useState<RenterUser | null>(null);
  const [renterNameInput, setRenterNameInput] = useState('');
  const [renterPhoneInput, setRenterPhoneInput] = useState('');
  const [savingRenter, setSavingRenter] = useState(false);

  // Assign Unit Modal
  const [assigningRenter, setAssigningRenter] = useState<RenterUser | null>(null);
  const [selectedUnitIdToAssign, setSelectedUnitIdToAssign] = useState('');
  const [unitSearchQuery, setUnitSearchQuery] = useState('');
  const [assigningUnit, setAssigningUnit] = useState(false);

  const fetchRenterUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/renters-users');
      if (res.ok) {
        const data = await res.json();
        setRenters(data);
      }
      // Also fetch all units for assignment
      const rentersUnitsRes = await fetch('/api/admin/renters');
      if (rentersUnitsRes.ok) {
        const unitsData = await rentersUnitsRes.json();
        setAllUnits(unitsData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenterUsers();
  }, []);

  const handleSaveRenterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renterNameInput || !renterPhoneInput) return;

    setSavingRenter(true);
    try {
      const isEdit = !!editingRenter;
      const url = isEdit ? `/api/admin/renters-users/${editingRenter.id}` : '/api/admin/renters-users';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: renterNameInput,
          phone: renterPhoneInput
        })
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setEditingRenter(null);
        setRenterNameInput('');
        setRenterPhoneInput('');
        fetchRenterUsers();
        await showAlert(language === 'ar' ? 'تم حفظ بيانات المستأجر بنجاح' : 'Renter saved successfully');
      } else {
        const data = await res.json().catch(() => ({}));
        await showAlert(data.error || (language === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Failed to save renter'));
      }
    } catch (err) {
      console.error(err);
      await showAlert(language === 'ar' ? 'حدث خطأ في النظام' : 'System error');
    } finally {
      setSavingRenter(false);
    }
  };

  const handleDeleteRenterUser = async (renterId: string) => {
    const confirmed = await showConfirm(
      language === 'ar' ? 'هل أنت تأكد من حذف هذا المستأجر من النظام؟' : 'Are you sure you want to delete this renter user?'
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/renters-users/${renterId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchRenterUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignUnitToRenter = async () => {
    if (!assigningRenter || !selectedUnitIdToAssign) return;
    setAssigningUnit(true);
    try {
      const res = await fetch(`/api/admin/units/${selectedUnitIdToAssign}/assign-renter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ renterId: assigningRenter.id })
      });

      if (res.ok) {
        setAssigningRenter(null);
        setSelectedUnitIdToAssign('');
        fetchRenterUsers();
        await showAlert(language === 'ar' ? 'تم ربط الوحدة بالمستأجر بنجاح' : 'Unit assigned successfully');
      } else {
        await showAlert(language === 'ar' ? 'فشل ربط الوحدة' : 'Failed to assign unit');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAssigningUnit(false);
    }
  };

  const handleUnassignUnit = async (unitId: string) => {
    try {
      const res = await fetch(`/api/admin/units/${unitId}/assign-renter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ renterId: null })
      });

      if (res.ok) {
        fetchRenterUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    let normalized = phone.replace(/\D/g, '');
    if (normalized.startsWith('0')) normalized = '966' + normalized.substring(1);
    if (!normalized.startsWith('966')) normalized = '966' + normalized;
    window.open(`https://wa.me/${normalized}?text=${encodeURIComponent(`مرحباً ${name}`)}`, '_blank');
  };

  const filteredRenters = renters.filter(r => {
    const query = search.toLowerCase();
    const nameMatch = (r.name || '').toLowerCase().includes(query);
    const phoneMatch = (r.phone || '').toLowerCase().includes(query);
    const unitMatch = r.units.some(u => 
      (u.unitNumber || '').toLowerCase().includes(query) || 
      (u.building?.name || '').toLowerCase().includes(query)
    );
    return nameMatch || phoneMatch || unitMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            {language === 'ar' ? 'إدارة المستأجرين (المستخدمين)' : 'Renter Users Management'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'ar'
              ? 'عرض وإضافة المستأجرين كمستخدمين في النظام وتعيين الوحدات والمباني التابعة لهم'
              : 'View, add, and manage renter user accounts and assign building units to them'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="flex items-center gap-2 border border-border rounded-xl px-3 bg-background focus-within:ring-1 focus-within:ring-primary w-full sm:w-64 h-9">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'ar' ? 'بحث بالاسم، رقم الجوال، الوحدة...' : 'Search name, phone, unit...'}
              className="w-full bg-transparent border-0 outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-0 p-0 text-xs text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingRenter(null);
              setRenterNameInput('');
              setRenterPhoneInput('');
              setIsAddModalOpen(true);
            }}
            className="w-full sm:w-auto h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة مستأجر جديد' : 'Add New Renter'}</span>
          </button>
        </div>
      </div>

      {/* Renter Users Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-card border border-border rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredRenters.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-primary" />
          <p className="text-sm font-bold">{language === 'ar' ? 'لا يوجد مستأجرين مسجلين' : 'No renters found'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRenters.map((renter) => (
            <div key={renter.id} className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-all space-y-4">
              <div className="space-y-4">
                {/* Renter Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                      {renter.name.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base leading-tight">{renter.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span dir="ltr" className="text-xs font-mono text-muted-foreground">{renter.phone}</span>
                        <button
                          type="button"
                          onClick={() => openWhatsApp(renter.phone, renter.name)}
                          className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                          title="WhatsApp"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRenter(renter);
                        setRenterNameInput(renter.name);
                        setRenterPhoneInput(renter.phone);
                        setIsAddModalOpen(true);
                      }}
                      className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted cursor-pointer"
                      title={language === 'ar' ? 'تعديل البيانات' : 'Edit Renter'}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRenterUser(renter.id)}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                      title={language === 'ar' ? 'حذف المستأجر' : 'Delete Renter'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Assigned Units List */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Home className="w-3.5 h-3.5 text-primary" />
                      {language === 'ar' ? `الوحدات المستأجرة (${renter.units.length})` : `Assigned Units (${renter.units.length})`}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAssigningRenter(renter);
                        setSelectedUnitIdToAssign('');
                      }}
                      className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      {language === 'ar' ? 'ربط وحدة' : 'Assign Unit'}
                    </button>
                  </div>

                  {renter.units.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {renter.units.map((u) => (
                        <div key={u.id} className="p-2.5 rounded-xl bg-muted/40 border border-border/70 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-foreground">{u.building?.name || 'مبنى غير مسمى'}</p>
                            <p className="text-[11px] text-muted-foreground font-bold">
                              {language === 'ar' ? `وحدة رقم: ${u.unitNumber}` : `Unit #${u.unitNumber}`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUnassignUnit(u.id)}
                            className="p-1 text-muted-foreground hover:text-red-500 rounded cursor-pointer"
                            title={language === 'ar' ? 'إلغاء ربط الوحدة' : 'Unassign unit'}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic py-2">
                      {language === 'ar' ? 'لا يوجد وحدات مرتبطة بعد' : 'No units assigned yet'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Renter Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                {editingRenter 
                  ? (language === 'ar' ? 'تعديل بيانات المستأجر' : 'Edit Renter') 
                  : (language === 'ar' ? 'إضافة مستأجر جديد للنظام' : 'Add New Renter User')}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRenterUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">
                  {language === 'ar' ? 'اسم المستأجر الثلاثي / الكامل' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={renterNameInput}
                  onChange={(e) => setRenterNameInput(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: محمد عبدالله أحمد' : 'e.g. John Doe'}
                  className="cn-input text-xs h-10 bg-background"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">
                  {language === 'ar' ? 'رقم الجوال المسجل (للدخول برمز OTP)' : 'Phone Number (for OTP Login)'}
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={renterPhoneInput}
                  onChange={(e) => setRenterPhoneInput(e.target.value)}
                  placeholder="0500000000"
                  className="cn-input text-xs h-10 bg-background"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-border hover:bg-muted cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={savingRenter}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 cursor-pointer"
                >
                  {savingRenter ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{language === 'ar' ? 'حفظ البيانات' : 'Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Unit Modal */}
      {assigningRenter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                {language === 'ar' ? `ربط وحدة للمستأجر: ${assigningRenter.name}` : `Assign Unit to ${assigningRenter.name}`}
              </h3>
              <button
                type="button"
                onClick={() => setAssigningRenter(null)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 border border-border rounded-xl px-3 bg-background focus-within:ring-1 focus-within:ring-primary h-9">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    value={unitSearchQuery}
                    onChange={(e) => setUnitSearchQuery(e.target.value)}
                    placeholder={language === 'ar' ? 'ابحث عن اسم المبنى أو رقم الوحدة...' : 'Search by building name or unit number...'}
                    className="w-full bg-transparent border-0 outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-0 p-0 text-xs text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                  {(() => {
                    const filteredUnits = allUnits.filter(u => {
                      const q = unitSearchQuery.trim().toLowerCase();
                      if (!q) return true;
                      const bName = u.building?.name ? u.building.name.toLowerCase() : '';
                      const uNum = String(u.unitNumber).toLowerCase();
                      return bName.includes(q) || uNum.includes(q);
                    });

                    if (filteredUnits.length === 0) {
                      return (
                        <div className="text-center py-6 text-xs text-muted-foreground">
                          {language === 'ar' ? 'لم يتم العثور على وحدة مطابقة' : 'No matching units found'}
                        </div>
                      );
                    }

                    return filteredUnits.map(u => {
                      const isSelected = selectedUnitIdToAssign === u.id;
                      return (
                        <div
                          key={u.id}
                          onClick={() => setSelectedUnitIdToAssign(u.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                              : 'border-border/70 hover:border-primary/40 bg-card hover:bg-muted/40 text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            }`}>
                              <Building2 className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold">{u.building?.name || (language === 'ar' ? 'مبنى' : 'Building')}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {language === 'ar' ? `وحدة رقم: ${u.unitNumber}` : `Unit #${u.unitNumber}`}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningRenter(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-border hover:bg-muted cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleAssignUnitToRenter}
                  disabled={assigningUnit || !selectedUnitIdToAssign}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {assigningUnit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{language === 'ar' ? 'تأكيد الربط' : 'Confirm Assignment'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

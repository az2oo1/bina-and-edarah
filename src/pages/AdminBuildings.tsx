import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';
import { PlusCircle, Loader2, Trash2, Building2, UploadCloud, Users, Settings as SettingsIcon, ImagePlus, X, Save, Phone, History, CheckCircle2, Calendar, Search } from 'lucide-react';
import { SrIcon } from '../components/SrIcon';
import * as XLSX from 'xlsx';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

interface RentHistory {
  id: string;
  dueDate: string;
  paidDate: string;
  amount: string;
  receiptUrl: string | null;
}

interface Renter {
  id: string;
  unitNumber: string;
  renterName: string;
  renterPhone: string;
  contractEndDate: string;
  nextRentDue: string;
  rentAmount: number | null;
  buildingId: string;
  building: {
    name: string;
  };
  rentHistory: RentHistory[];
}

interface Building {
  id: string;
  name: string;
  transferDetails: string | null;
  photos: string | null;
  _count: { units: number };
}

export default function AdminBuildings() {
  const { language } = useLanguage();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBuildingName, setNewBuildingName] = useState('');
  const [addingBuilding, setAddingBuilding] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingBuildingId, setEditingBuildingId] = useState<string | null>(null);

  // States for edit form
  const [editTransferDetails, setEditTransferDetails] = useState('');
  const [editPhotos, setEditPhotos] = useState<string[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);

  // States for Building Renters Modal
  const [loadingRentersBuilding, setLoadingRentersBuilding] = useState<string | null>(null);
  const [selectedBuildingForRenters, setSelectedBuildingForRenters] = useState<Building | null>(null);
  const [buildingRenters, setBuildingRenters] = useState<Renter[]>([]);
  const [searchRenters, setSearchRenters] = useState('');
  
  // State for Renter History Modal (nested or instead)
  const [selectedRenterForHistory, setSelectedRenterForHistory] = useState<Renter | null>(null);

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const res = await fetch('/api/admin/buildings');
      const data = await res.json();
      setBuildings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuildingName.trim()) return;
    setAddingBuilding(true);
    try {
      const res = await fetch('/api/admin/buildings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBuildingName })
      });
      if (res.ok) {
        setNewBuildingName('');
        fetchBuildings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingBuilding(false);
    }
  };

  const executeDeleteBuilding = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/buildings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBuildings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setUploadMessage({ type, text });
    setTimeout(() => setUploadMessage(null), 5000);
  };

  const handleFileUpload = async (buildingId: string, file: File) => {
    setUploadingFor(buildingId);
    setUploadMessage(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // Build rows manually to capture comments and cell types
      let rows: string[][] = [];
      const rangeStr = worksheet['!ref'];
      if (rangeStr) {
         const range = XLSX.utils.decode_range(rangeStr);
         for (let R = range.s.r; R <= range.e.r; ++R) {
            let row: string[] = [];
            let rowIsEmpty = true;
            for (let C = range.s.c; C <= range.e.c; ++C) {
               const cell_address = XLSX.utils.encode_cell({r: R, c: C});
               const cell = worksheet[cell_address];
               
               let val = "";
               let comment = "";
               if (cell) {
                  if (cell.w !== undefined) {
                     val = cell.w; // Prefer Excel's formatted text
                  } else if (cell.t === 'd' && cell.v instanceof Date) {
                     val = cell.v.toISOString().split('T')[0];
                  } else if (typeof cell.v === 'number') {
                     val = (Math.round(cell.v * 100) / 100).toString();
                  } else {
                     val = (cell.v ?? "").toString();
                  }
                  
                  if (cell.c && cell.c.length > 0) {
                     comment = cell.c.map((c:any) => c.t).join(" ");
                  }
               }
               
               let finalVal = val;
               if (comment.trim()) {
                  finalVal = finalVal + "|||COMMENT:" + comment.trim();
                  rowIsEmpty = false;
               } else if (val.trim()) {
                  rowIsEmpty = false;
               }
               row.push(finalVal);
            }
            if (!rowIsEmpty) {
               rows.push(row);
            }
         }
      }

      
      // rows is now an array of arrays.

      
      const res = await fetch(`/api/admin/buildings/${buildingId}/upload-json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows })
      });
      const data = await res.json();
      if (res.ok) {
        fetchBuildings();
        showMessage('success', language === 'ar' ? `تم استيراد ${data.count || 0} وحدة بنجاح` : `Imported ${data.count || 0} units successfully`);
      } else {
         showMessage('error', data.error || (language === 'ar' ? 'حدث خطأ في استيراد البيانات' : 'Error importing data'));
      }
    } catch (err) {
      console.error(err);
      showMessage('error', language === 'ar' ? 'فصل قراءة الملف' : 'File parsing failed');
    } finally {
      setUploadingFor(null);
    }
  };

  const openEditModal = (b: Building) => {
    setEditingBuildingId(b.id);
    setEditTransferDetails(b.transferDetails || '');
    try {
      setEditPhotos(b.photos ? JSON.parse(b.photos) : []);
    } catch (e) {
      setEditPhotos([]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files) as File[];
    
    for (const file of files) {
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result && typeof event.target.result === 'string') resolve(event.target.result);
            else reject(new Error('Failed to convert to base64'));
          };
          reader.onerror = () => reject(new Error('File reading error'));
          reader.readAsDataURL(file);
        });
        setEditPhotos(prev => [...prev, base64]);
      } catch (err) {
        console.error(err);
      }
    }
    e.target.value = '';
  };

  const openBuildingRenters = async (b: Building) => {
    setLoadingRentersBuilding(b.id);
    try {
      const res = await fetch(`/api/admin/renters`);
      const data = await res.json();
      if (Array.isArray(data)) {
         setBuildingRenters(data.filter((r: Renter) => r.buildingId === b.id));
         setSelectedBuildingForRenters(b);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRentersBuilding(null);
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const formatted = phone.replace(/^0+/, '');
    const wsNumber = `966${formatted}`;
    const message = language === 'ar' ? `مرحباً ${name}،` : `Hello ${name},`;
    window.open(`https://wa.me/${wsNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const executeSaveEdit = async () => {
    if (!editingBuildingId) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/buildings/${editingBuildingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transferDetails: editTransferDetails,
          photos: JSON.stringify(editPhotos)
        })
      });
      if (res.ok) {
        fetchBuildings();
        setEditingBuildingId(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
        <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {language === 'ar' ? 'إدارة المباني والمستأجرين' : 'Buildings & Renters Management'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'ar' ? 'إضافة المباني واستيراد بيانات المستأجرين (يدعم Excel, CSV, Apple Numbers)' : 'Add buildings and import renters data (Supports Excel, CSV, Apple Numbers)'}
          </p>
        </div>
      </div>

      <div className="shadcn-card p-5 mb-6">
        <h3 className="text-sm font-bold text-foreground mb-3">{language === 'ar' ? 'إضافة مبنى جديد' : 'Add New Building'}</h3>
        <form onSubmit={handleAddBuilding} className="flex gap-4">
          <input 
            type="text" 
            required 
            value={newBuildingName}
            onChange={e => setNewBuildingName(e.target.value)}
            placeholder={language === 'ar' ? 'اسم المبنى (مثال: عمارة الشدي الوادي)' : 'Building Name'}
            className="flex-1 cn-input"
          />
          <button 
            type="submit" 
            disabled={addingBuilding}
            className="btn-primary h-9 px-4 text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {addingBuilding ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
            {language === 'ar' ? 'إضافة' : 'Add'}
          </button>
        </form>
      </div>

      {uploadMessage && (
        <div className={`p-4 rounded-xl font-bold border flex items-center gap-3 ${uploadMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
           {uploadMessage.type === 'success' ? <UploadCloud className="w-5 h-5 flex-shrink-0" /> : <Loader2 className="w-5 h-5 flex-shrink-0" />}
           {uploadMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {buildings.map(b => (
          <div key={b.id} className="shadcn-card p-4 flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground mb-1">{b.name}</h3>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="w-5 h-5" /> 
                <span>{b._count.units} {language === 'ar' ? 'وحدة / مستأجر' : 'Units / Renters'}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <label className="relative cursor-pointer bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5">
                 <input 
                   type="file" 
                   accept=".csv,.xlsx,.xls,.numbers"
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   onChange={(e) => {
                     const f = e.target.files?.[0];
                     if(f) handleFileUpload(b.id, f);
                     e.target.value = '';
                   }}
                   disabled={uploadingFor === b.id}
                 />
                 {uploadingFor === b.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                 {language === 'ar' ? 'استيراد ملف' : 'Import File'}
              </label>

              <button 
                onClick={() => openBuildingRenters(b)}
                disabled={loadingRentersBuilding === b.id}
                className="btn-secondary px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                title={language === 'ar' ? 'عرض المستأجرين' : 'View Renters'}
              >
                {loadingRentersBuilding === b.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
                {language === 'ar' ? 'المستأجرين' : 'Renters'}
              </button>

              <button 
                onClick={() => openEditModal(b)}
                className="p-2 text-muted-foreground hover:text-foreground rounded border border-border bg-card cursor-pointer"
                title={language === 'ar' ? 'تعديل بيانات المبنى' : 'Edit Building Details'}
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => setDeleteConfirmId(b.id)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded border border-border bg-card cursor-pointer"
                title={language === 'ar' ? 'حذف' : 'Delete'}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {buildings.length === 0 && (
          <div className="text-center p-8 text-sm text-muted-foreground bg-card rounded-lg border border-border shadow-xs">
            {language === 'ar' ? 'لا يوجد مباني مضافة حتى الآن' : 'No buildings added yet'}
          </div>
        )}
      </div>

      {editingBuildingId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-card rounded-lg border border-border w-full max-w-3xl overflow-hidden shadow-md flex flex-col max-h-[90vh]">
            <div className="bg-muted/40 p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">{language === 'ar' ? 'تعديل بيانات المبنى' : 'Edit Building Details'}</h3>
              <button onClick={() => setEditingBuildingId(null)} className="w-7 h-7 rounded border border-border flex items-center justify-center bg-card text-muted-foreground hover:text-foreground cursor-pointer">
                 <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto bg-muted/10 flex-1 space-y-5">
              <div>
                <label className="cn-label mb-2">{language === 'ar' ? 'تفاصيل التحويل البنكي' : 'Bank Transfer Details'}</label>
                <textarea 
                  value={editTransferDetails}
                  onChange={e => setEditTransferDetails(e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل تفاصيل ومشتملات الحساب البنكي، والآيبان...' : 'Enter bank account details, IBAN...'}
                  rows={4}
                  className="cn-input min-h-[100px] resize-y"
                />
              </div>

              <div>
                <label className="cn-label mb-2">{language === 'ar' ? 'صور المبنى' : 'Building Photos'}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {editPhotos.map((url, index) => (
                    <div key={index} className="relative aspect-[4/3] rounded-md overflow-hidden group border border-border shadow-xs">
                      <img src={url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => setEditPhotos(editPhotos.filter((_, i) => i !== index))}
                          className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <label className="aspect-[4/3] flex flex-col items-center justify-center border border-dashed border-border rounded-md cursor-pointer transition-colors bg-muted/10 hover:bg-muted/30">
                    <ImagePlus className="w-8 h-8 text-primary mb-2" />
                    <span className="text-sm font-bold text-primary">{language === 'ar' ? 'إضافة صور' : 'Add Photos'}</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-card border-t border-border flex justify-end gap-2">
               <button onClick={() => setEditingBuildingId(null)} className="btn-outline px-4 h-9 text-xs font-semibold rounded-md shadow-xs cursor-pointer">
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
               </button>
               <button onClick={executeSaveEdit} disabled={savingEdit} className="btn-primary px-4 h-9 text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer">
                  {savingEdit ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
               </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full mx-auto shadow-2xl"
          >
            <h3 className="text-xl font-bold text-foreground mb-4">{language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}</h3>
            <p className="text-muted-foreground mb-8">{language === 'ar' ? 'هل أنت متأكد من حذف هذا المبنى؟ ستحذف جميع بيانات المستأجرين المتعلقة به بشكل دائم.' : 'Are you sure you want to delete this building? All associated renter data will be permanently deleted.'}</p>
            <div className="flex gap-4">
              <button
                onClick={() => executeDeleteBuilding(deleteConfirmId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
              >
                {language === 'ar' ? 'نعم، احذف' : 'Yes, delete'}
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-muted hover:bg-gray-200 text-foreground font-bold py-3 px-4 rounded-xl transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {selectedBuildingForRenters && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-card rounded-lg border border-border w-full max-w-6xl overflow-hidden shadow-md flex flex-col max-h-[90vh]">
            <div className="bg-muted/40 p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-primary" />
                  {selectedBuildingForRenters.name} — {language === 'ar' ? 'المستأجرين' : 'Renters'}
                </h3>
              </div>
              <button onClick={() => setSelectedBuildingForRenters(null)} className="w-7 h-7 bg-card border border-border rounded flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer">
                 <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 border-b border-border">
               <div className="relative max-w-md">
                 <div className="absolute inset-y-0 ltr:left-0 ltr:right-auto rtl:right-0 rtl:left-auto flex items-center px-3 pointer-events-none text-gray-400">
                   <Search className="w-5 h-5" />
                 </div>
                 <input
                   type="text"
                   value={searchRenters}
                   onChange={e => setSearchRenters(e.target.value)}
                   className="cn-input ltr:pl-10 rtl:pr-10"
                   placeholder={language === 'ar' ? 'ابحث بالاسم، الرقم، الوحدة...' : 'Search name, phone, unit...'}
                 />
               </div>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1 bg-slate-50/30">
               {(() => {
                 const grouped = new Map<string, Renter & { allUnitNumbers: string[], totalRent: number, history?: any[] }>();
                 for (const r of buildingRenters) {
                    const isAvail = !r.renterPhone && (r.renterName.includes('متاح') || r.renterName.includes('فاضي') || r.renterName.includes('شاغر') || r.renterName.includes('غيرمؤجر') || r.renterName.includes('غير مؤجر'));
                    
                    if (isAvail || !r.renterPhone) {
                        grouped.set(r.id, { ...r, allUnitNumbers: [r.unitNumber], totalRent: r.rentAmount || 0 });
                        continue;
                    }
                    if (!grouped.has(r.renterPhone)) {
                        grouped.set(r.renterPhone, { ...r, allUnitNumbers: [r.unitNumber], totalRent: r.rentAmount || 0 });
                    } else {
                        const existing = grouped.get(r.renterPhone)!;
                        if (!existing.allUnitNumbers.includes(r.unitNumber)) {
                            existing.allUnitNumbers.push(r.unitNumber);
                        }
                        if (r.history && (!existing.history || existing.history.length < r.history.length)) {
                            existing.history = r.history;
                        }
                        if (r.rentAmount) {
                            existing.totalRent += r.rentAmount;
                        }
                    }
                 }
                 const unifiedRenters = Array.from(grouped.values());

                 const filtered = unifiedRenters.filter(r => 
                   r.renterName.includes(searchRenters) || 
                   r.renterPhone.includes(searchRenters) || 
                   r.unitNumber.includes(searchRenters) ||
                   (r.allUnitNumbers && r.allUnitNumbers.some(u => u.includes(searchRenters)))
                 );

                 if (filtered.length === 0) {
                   return <div className="text-center text-muted-foreground py-12">{language === 'ar' ? 'لا يوجد مستأجرين' : 'No renters found'}</div>;
                 }
                 return (
                   <div className="overflow-x-auto bg-card rounded-lg border border-border">
                     <table className="w-full text-right border-collapse">
                       <thead>
                         <tr className="bg-muted/40 text-muted-foreground text-xs border-b border-border">
                           <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">{language === 'ar' ? 'المستأجر' : 'Renter'}</th>
                           <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">{language === 'ar' ? 'التواصل' : 'Contact'}</th>
                           <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">{language === 'ar' ? 'الوحدة' : 'Unit'}</th>
                           <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">{language === 'ar' ? 'قيمة الإيجار' : 'Rent Amount'}</th>
                           <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">{language === 'ar' ? 'التاريخ/التفاصيل' : 'History'}</th>
                         </tr>
                       </thead>
                       <motion.tbody
                         initial="hidden"
                         animate="visible"
                         variants={{
                           visible: { transition: { staggerChildren: 0.05 } }
                         }}
                       >
                          {filtered.map(r => {
                            const isEmpty = !r.renterPhone && (r.renterName.includes('متاح') || r.renterName.includes('فاضي') || r.renterName.includes('شاغر') || r.renterName.includes('غيرمؤجر') || r.renterName.includes('غير مؤجر'));
                            return (
                            <motion.tr 
                              key={r.id} 
                              variants={{
                                hidden: { opacity: 0, y: 10 },
                                visible: { opacity: 1, y: 0 }
                              }}
                              className={`border-b border-border hover:bg-slate-50/40 transition-colors ${isEmpty ? 'bg-muted/10' : ''}`}
                            >
                              <td className="p-4">
                                {isEmpty ? (
                                  <p className="font-bold text-gray-400">{r.renterName}</p>
                                ) : (
                                  <>
                                    <p className="font-semibold text-xs text-foreground">{r.renterName}</p>
                                    <p className="text-[10px] text-muted-foreground dir-ltr font-mono mt-0.5">{r.renterPhone}</p>
                                  </>
                                )}
                              </td>
                                                           <td className="p-4">
                                {!isEmpty && (
                                <div className="flex items-center gap-2">
                                  <a 
                                    href={`tel:${r.renterPhone}`}
                                    className="w-7 h-7 rounded bg-slate-100 border border-border text-foreground hover:bg-slate-200/50 flex flex-col items-center justify-center transition-colors"
                                    title={language === 'ar' ? 'اتصال' : 'Call'}
                                  >
                                    <Phone className="w-4 h-4" />
                                  </a>
                                  <button 
                                    onClick={() => openWhatsApp(r.renterPhone, r.renterName)}
                                    className="w-7 h-7 rounded bg-emerald-50 border border-emerald-200 text-emerald-600 flex flex-col items-center justify-center hover:bg-emerald-100/50 transition-colors"
                                    title="WhatsApp"
                                  >
                                    <WhatsAppIcon className="w-4 h-4" />
                                  </button>
                                </div>
                                )}
                              </td>
                             <td className="p-4">
                               <div className="flex flex-wrap gap-1 max-w-[200px]">
                                 {r.allUnitNumbers && r.allUnitNumbers.length > 0 ? (
                                    r.allUnitNumbers.map((u, i) => (
                                      <span key={i} className="inline-flex items-center justify-center bg-slate-100 border border-border text-foreground text-[10px] px-1.5 py-0.5 rounded">
                                        {u}
                                      </span>
                                    ))
                                 ) : (
                                   <span className="font-bold text-foreground line-clamp-1 max-w-[150px]">{r.unitNumber}</span>
                                 )}
                               </div>
                             </td>
                             <td className="p-4 text-foreground font-bold">
                                {r.totalRent || r.rentAmount ? (
                                  <div className="flex items-center gap-1">
                                    {((r.totalRent || r.rentAmount) || 0).toLocaleString()} <SrIcon className="w-4 h-4 text-gray-400" />
                                  </div>
                                ) : (
                                  <span className="text-gray-400 font-medium">{language === 'ar' ? 'غير مسجل' : 'N/A'}</span>
                                )}
                             </td>
                                                           <td className="p-4">
                                {!isEmpty && (
                                <button 
                                  onClick={() => setSelectedRenterForHistory(r)}
                                  className="btn-secondary px-3 py-1.5 text-xs rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer"
                                >
                                  <History className="w-4 h-4" />
                                  {language === 'ar' ? 'السجل' : 'History'}
                                </button>
                                )}
                              </td>
                            </motion.tr>
                            );
                          })}
                        </motion.tbody>
                     </table>
                   </div>
                 );
               })()}
            </div>
          </div>
        </div>
      )}

      {selectedRenterForHistory && (
         <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
           <div className="bg-card rounded-lg border border-border w-full max-w-3xl overflow-hidden shadow-md flex flex-col max-h-[90vh]">
             <div className="bg-muted/40 p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-foreground">{selectedRenterForHistory.renterName}</h3>
                  <div className="text-muted-foreground font-medium flex items-center gap-2 mt-2">
                    <Building2 className="w-4 h-4" />
                    {selectedRenterForHistory.building?.name || selectedBuildingForRenters?.name} — {language === 'ar' ? 'وحدة' : 'Unit'} {selectedRenterForHistory.unitNumber}
                  </div>
                </div>
                <button onClick={() => setSelectedRenterForHistory(null)} className="w-7 h-7 bg-card rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer">
                   <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="p-5 overflow-y-auto bg-slate-50/30 flex-1">
               {selectedRenterForHistory.rentHistory && selectedRenterForHistory.rentHistory.length > 0 ? (
                 <div className="space-y-4">
                   {selectedRenterForHistory.rentHistory.map((h, i) => {
                      const paidDateStr = h.paidDate || '';
                      const amountStr = typeof h.amount === 'string' ? h.amount : (h.amount?.toString() || '');
                      const isCourt = paidDateStr.includes('محكمة') || paidDateStr.includes('تنفيذ') || paidDateStr.includes('تم الرفع') || amountStr.includes('محكمة') || amountStr.includes('تنفيذ') || amountStr.includes('تم الرفع');
                      const isLate = paidDateStr.includes('متاخرات') || amountStr.includes('متاخرات');
                      const isPaid = !!h.receiptUrl || (paidDateStr.trim() !== '' && !isCourt && !isLate) || amountStr.includes('مسدد') || (!isNaN(Number(amountStr)) && Number(amountStr) > 0 && !isCourt && !isLate);

                           let isUnpaidPassed = false;
                           let isFuture = false;
                           let actualPaidDate = '';
                           
                           const dueDateObj = new Date(h.dueDate);
                           if (!isNaN(dueDateObj.getTime())) {
                               const today = new Date();
                               today.setHours(0,0,0,0);
                               const d = new Date(dueDateObj);
                               d.setHours(0,0,0,0);
                               if (d > today) {
                                   isFuture = true;
                               } else {
                                   isUnpaidPassed = true;
                               }
                           }

                           let statusText = language === 'ar' ? 'غير مسدد' : 'Unpaid';
                           if (isCourt) {
                              statusText = language === 'ar' ? 'مسار محكمة/تنفيذ' : 'Court/Tanfeeth';
                              if (paidDateStr.includes('محكمة') || paidDateStr.includes('تم الرفع')) statusText = paidDateStr;
                              else if (amountStr.includes('محكمة') || amountStr.includes('تم الرفع')) statusText = amountStr;
                           } else if (isLate) {
                              statusText = language === 'ar' ? 'متأخرات' : 'Late';
                              if (paidDateStr.includes('متاخرات')) statusText = paidDateStr;
                              else if (amountStr.includes('متاخرات')) statusText = amountStr;
                           } else if (isPaid) {
                              statusText = language === 'ar' ? 'مسدد' : 'Paid';
                              if (paidDateStr.trim()) actualPaidDate = paidDateStr;
                           } else if (isFuture) {
                              statusText = language === 'ar' ? 'مجدول' : 'Scheduled';
                           } else {
                              statusText = language === 'ar' ? 'مستحق الدفع' : 'Payment Due'; 
                           }
                           
                           const isScheduled = !isPaid && !isCourt && !isLate && isFuture;
                           const isDue = !isPaid && !isCourt && !isLate && isUnpaidPassed;

                           return (
                             <div key={h.id || i} className={`border rounded-md p-3 flex flex-col justify-between gap-2 ${isPaid ? 'border-green-100 bg-green-50/30' : isCourt ? 'border-red-200 bg-red-50/50' : isLate ? 'border-orange-200 bg-orange-50/50' : isDue ? 'border-orange-200 bg-orange-50/50' : isScheduled ? 'border-blue-200 bg-blue-50/50' : 'border-border bg-card'}`}>
                               <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                     <div className={`w-8 h-8 rounded-full flex flex-col items-center justify-center flex-shrink-0 ${isPaid ? 'bg-green-100 text-green-600' : isCourt ? 'bg-red-100 text-red-600' : isScheduled ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                   {isPaid ? <CheckCircle2 className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                                </div>
                                <div>
                                   <p className="font-bold text-foreground text-sm whitespace-nowrap">{language === 'ar' ? `الدفعة (${i + 1})` : `Payment (${i + 1})`}</p>
                                   <p className="text-sm text-muted-foreground" dir="ltr">{h.dueDate}</p>
                                </div>
                             </div>
                             {h.receiptUrl && (
                                <a href={h.receiptUrl} target="_blank" rel="noreferrer" className="btn-outline h-7 px-2.5 text-[10px] rounded-md shadow-xs shrink-0 inline-flex items-center justify-center">
                                  {language === 'ar' ? 'عرض الإيصال' : 'Receipt'}
                                </a>
                             )}
                          </div>
                          
                          <div className="pt-2 border-t border-border/50 flex flex-col gap-1 text-xs font-medium">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">{language === 'ar' ? 'الحالة:' : 'Status:'}</span>
                              <span className={`font-bold ${isPaid ? 'text-green-600' : isCourt ? 'text-red-600' : isScheduled ? 'text-blue-600' : 'text-orange-600'}`}>
                                {statusText}
                              </span>
                            </div>
                            {isPaid && actualPaidDate && !isCourt && actualPaidDate !== statusText && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">{language === 'ar' ? 'تاريخ السداد:' : 'Paid Date:'}</span>
                                <span className="text-foreground font-bold">{actualPaidDate}</span>
                              </div>
                            )}
                            {amountStr.trim() !== '' && !isCourt && !isLate && statusText !== amountStr && actualPaidDate !== amountStr && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">{language === 'ar' ? 'المبلغ:' : 'Amount:'}</span>
                                <span className="text-foreground font-bold">{amountStr}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                 </div>
               ) : (
                 <div className="text-center text-gray-400 py-12">
                    {language === 'ar' ? 'لا يوجد سجلات تأجير' : 'No rent history available'}
                 </div>
               )}
             </div>
           </div>
         </div>
      )}
    </motion.div>
  );
}

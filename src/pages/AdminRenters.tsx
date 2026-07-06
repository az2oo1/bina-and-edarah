import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';
import { Users, Search, Building2, Phone, Calendar, Wallet, X, CheckCircle2, ArrowRight, Trash2, Eye } from 'lucide-react';
import { SrIcon } from '../components/SrIcon';

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
  building: {
    name: string;
  };
  rentHistory: RentHistory[];
}

export default function AdminRenters() {
  const { language } = useLanguage();
  const [renters, setRenters] = useState<Renter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteUnitConfirmId, setDeleteUnitConfirmId] = useState<string | null>(null);
  
  const [selectedRenterPhone, setSelectedRenterPhone] = useState<string | null>(null);

  const fetchRenters = () => {
    setLoading(true);
    fetch('/api/admin/renters')
      .then(res => res.json())
      .then(data => {
        setRenters(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRenters();
  }, []);

  const executeDeleteUnit = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/units/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteUnitConfirmId(null);
        fetchRenters();
        // If they just deleted the only unit for this customer, close the modal later or just let the empty state show.
      } else {
        alert('Failed to delete unit.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Group renters by phone so we have a unified "accounts" list
  const groupedRenters = React.useMemo(() => {
    const acc = new Map<string, typeof renters[0] & { totalUnits: number, allBuildings: string[], allNames: string[], allUnitNumbers: string[], totalRentAmount: number }>();
    for (const r of renters) {
      const isAvailable = r.renterName.includes('متاح') || r.renterName.includes('فاضي') || r.renterName.includes('شاغر') || r.renterName.includes('غيرمؤجر') || r.renterName.includes('غير مؤجر');
      if (!r.renterPhone || isAvailable) continue;
      const key = r.renterPhone;
      if (!acc.has(key)) {
        acc.set(key, { ...r, totalUnits: 1, allBuildings: r.building?.name ? [r.building.name] : [], allNames: [r.renterName], allUnitNumbers: [r.unitNumber], totalRentAmount: r.rentAmount || 0 });
      } else {
        const existing = acc.get(key)!;
        existing.totalUnits++;
        if (r.building?.name && !existing.allBuildings.includes(r.building.name)) {
          existing.allBuildings.push(r.building.name);
        }
        if (!existing.allNames.includes(r.renterName)) {
          existing.allNames.push(r.renterName);
        }
        if (!existing.allUnitNumbers.includes(r.unitNumber)) {
          existing.allUnitNumbers.push(r.unitNumber);
        }
        if (r.rentAmount) {
          existing.totalRentAmount += r.rentAmount;
        }
      }
    }
    return Array.from(acc.values());
  }, [renters]);

  const filtered = groupedRenters.filter(r => 
    r.allNames.some(n => n.includes(search)) || 
    r.renterPhone.includes(search) || 
    r.unitNumber.includes(search) ||
    r.allBuildings.some(b => b.includes(search))
  );

  // For the account popup
  const customerUnits = selectedRenterPhone ? renters.filter(r => r.renterPhone === selectedRenterPhone) : [];
  const customerNames: string[] = Array.from(new Set(customerUnits.map(u => u.renterName)));
  const customerName = customerNames.join(' | ');
  const customerHasCourtOrder = customerUnits.some(u => u.isTanfeeth);

  const openWhatsApp = (phone: string, names: string[]) => {
    const formatted = phone.replace(/^0+/, '');
    const wsNumber = `966${formatted}`;
    const message = language === 'ar' ? `مرحباً ${names.join(' / ')}،` : `Hello ${names.join(' / ')},`;
    window.open(`https://wa.me/${wsNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {selectedRenterPhone && customerUnits.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
             <button onClick={() => { setSelectedRenterPhone(null); }} className="w-7 h-7 bg-white rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer">
                <ArrowRight className="w-5 h-5 rtl:block hidden" />
                <ArrowRight className="w-5 h-5 ltr:block hidden rotate-180" />
             </button>
             <h2 className="text-sm font-bold text-foreground">{language === 'ar' ? 'تفاصيل الحساب' : 'Account Details'}</h2>
          </div>
          
          <div className="bg-card rounded-lg border border-border w-full overflow-hidden shadow-xs flex flex-col">
             <div className="bg-slate-50 border-b border-border p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded border border-border flex items-center justify-center ${customerHasCourtOrder ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-100 text-primary'}`}>
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      {customerName}
                      {customerHasCourtOrder && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                           <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                           {language === 'ar' ? 'يوجد أمر محكمة' : 'Court Order'}
                        </span>
                      )}
                    </h3>
                    <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> <span dir="ltr">{selectedRenterPhone}</span></span>
                      <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {customerUnits.length} {language === 'ar' ? 'وحدات' : 'Units'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => openWhatsApp(selectedRenterPhone!, customerNames)}
                    className="w-7 h-7 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded flex items-center justify-center hover:bg-emerald-100/5 transition-colors cursor-pointer"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                  </button>
                </div>
             </div>
             
             <div className="p-5 bg-slate-50/30 flex-1 space-y-5">
               {customerUnits.map((unit, idx) => (
                 <div key={unit.id || idx} className="shadcn-card overflow-hidden">
                   <div className="bg-slate-50 p-3 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-3">
                     <div>
                       <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                         <Building2 className="w-4 h-4 text-primary" />
                         {unit.building?.name || (language === 'ar' ? 'مبنى غير محدد' : 'Unknown Building')}
                       </h4>
                       <p className="text-muted-foreground text-sm mt-1 flex flex-wrap items-center gap-2 font-medium">
                         <span className="bg-slate-100 border border-border text-foreground px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1">
                           <Users className="w-3 h-3" />
                           {unit.renterName}
                         </span>
                         <span className="bg-slate-100 border border-border text-foreground px-1.5 py-0.5 rounded text-[10px]">
                           {language === 'ar' ? 'رقم الوحدة:' : 'Unit Number:'} {unit.unitNumber}
                         </span>
                         {unit.isTanfeeth && (
                           <span className="text-red-500 font-bold flex items-center gap-1 text-xs">
                             <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                             {language === 'ar' ? 'أمر تنفيذ/محكمة' : 'Court Order Active'}
                           </span>
                         )}
                       </p>
                     </div>
                     <div className="flex gap-4 sm:flex-row flex-col text-sm md:text-right">
                       <div>
                         <span className="text-muted-foreground block text-[10px] uppercase font-bold">{language === 'ar' ? 'قيمة الإيجار' : 'Rent Amount'}</span>
                         <span className="font-semibold text-xs text-foreground flex items-center gap-1 md:justify-end">
                           {unit.rentAmount?.toLocaleString() || '-'} <SrIcon className="w-3 h-3 text-gray-400" />
                         </span>
                       </div>
                       <div>
                         <span className="text-muted-foreground block text-[10px] uppercase font-bold">{language === 'ar' ? 'نهاية العقد' : 'Contract Ends'}</span>
                         <span className="font-semibold text-xs text-foreground flex items-center gap-1 md:justify-end">
                           {unit.contractEndDate || '-'}
                         </span>
                       </div>
                       <div>
                         <span className="text-muted-foreground block text-[10px] uppercase font-bold">{language === 'ar' ? 'الدفعة القادمة' : 'Next Due'}</span>
                         <span className="font-semibold text-orange-600 flex items-center gap-1 md:justify-end">
                           {unit.nextRentDue || '-'}
                         </span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="p-4">
                     <h5 className="font-bold text-xs text-foreground mb-3 flex items-center gap-2">
                       <Wallet className="w-4 h-4 text-gray-400" />
                       {language === 'ar' ? 'الدفعات المستحقة والسجل' : 'Payments & History'}
                     </h5>
                     {unit.rentHistory && unit.rentHistory.length > 0 ? (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                         {unit.rentHistory.map((h, i) => {
                           const paidDateStr = h.paidDate || '';
                           const amountStr = typeof h.amount === 'string' ? h.amount : (h.amount?.toString() || '');
                           const isLate = paidDateStr.includes('متاخرات') || amountStr.includes('متاخرات');
                           const isPaid = !!h.receiptUrl || (paidDateStr.trim() !== '' && !isLate) || amountStr.includes('مسدد') || (!isNaN(Number(amountStr)) && Number(amountStr) > 0 && !isLate);

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
                           if (isLate) {
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
                           
                           const isScheduled = !isPaid && !isLate && isFuture;
                           const isDue = !isPaid && !isLate && isUnpaidPassed;

                           return (
                             <div key={h.id || i} className={`border rounded-md p-3 flex flex-col justify-between gap-2 ${isPaid ? 'border-green-100 bg-green-50/30' : isLate ? 'border-orange-200 bg-orange-50/50' : isDue ? 'border-orange-200 bg-orange-50/50' : isScheduled ? 'border-blue-200 bg-blue-50/50' : 'border-border bg-card'}`}>
                               <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                     <div className={`w-8 h-8 rounded-full flex flex-col items-center justify-center flex-shrink-0 ${isPaid ? 'bg-green-100 text-green-600' : isScheduled ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {isPaid ? <CheckCircle2 className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                                     </div>
                                     <div>
                                        <p className="font-bold text-foreground text-sm whitespace-nowrap">{language === 'ar' ? `الدفعة (${i + 1})` : `Payment (${i + 1})`}</p>
                                        <p className="text-sm text-muted-foreground" dir="ltr">{h.dueDate}</p>
                                     </div>
                                  </div>
                                  {h.receiptUrl && (
                                     <a href={h.receiptUrl} target="_blank" rel="noreferrer" className="btn-outline h-7 px-2.5 text-[10px] rounded-md shadow-xs shrink-0 inline-flex items-center justify-center gap-1 cursor-pointer">
                                       <Eye className="w-3 h-3" />
                                       {language === 'ar' ? 'عرض الإيصال' : 'Receipt'}
                                     </a>
                                  )}
                               </div>
                               <div className="pt-2 border-t border-border/50 flex flex-col gap-1 text-xs font-medium">
                                 <div className="flex items-center gap-1">
                                   <span className="text-muted-foreground">{language === 'ar' ? 'الحالة:' : 'Status:'}</span>
                                   <span className={`font-bold ${isPaid ? 'text-green-600' : isScheduled ? 'text-blue-600' : 'text-orange-600'}`}>
                                     {statusText}
                                   </span>
                                 </div>
                                 {isPaid && actualPaidDate && actualPaidDate !== statusText && (
                                   <div className="flex items-center gap-1">
                                     <span className="text-muted-foreground">{language === 'ar' ? 'تاريخ السداد / ملاحظات:' : 'Paid / Notes:'}</span>
                                     <span className="text-foreground font-bold">{actualPaidDate}</span>
                                   </div>
                                 )}
                                 {amountStr.trim() !== '' && statusText !== amountStr && actualPaidDate !== amountStr && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">{language === 'ar' ? 'المبلغ:' : 'Amount:'}</span>
                                    <span className="text-foreground font-bold">{amountStr} {language === 'ar' ? 'ريال' : 'SAR'}</span>
                                  </div>
                                 )}
                               </div>
                             </div>
                           )
                         })}
                       </div>
                     ) : (
                       <div className="text-center text-gray-400 py-6 text-sm">
                          {language === 'ar' ? 'لا يوجد سجلات دفع لهذه الوحدة' : 'No payment records for this unit'}
                       </div>
                     )}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center mb-8 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {language === 'ar' ? 'المستأجرين' : 'Renters'}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'ar' ? 'عرض والبحث في جميع المستأجرين' : 'View and search all renters'}
                </p>
              </div>
            </div>

        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center px-3 pointer-events-none text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="cn-input ltr:pl-10 rtl:pr-10"
            placeholder={language === 'ar' ? 'ابحث بالاسم، الرقم، الوحدة...' : 'Search name, phone, unit...'}
          />
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            {language === 'ar' ? 'لا يوجد مستأجرين' : 'No renters found'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground text-xs border-b border-border">
                  <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">{language === 'ar' ? 'المستأجر' : 'Renter'}</th>
                  <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">{language === 'ar' ? 'التواصل' : 'Contact'}</th>
                  <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">{language === 'ar' ? 'المبنى / الوحدة' : 'Building / Unit'}</th>
                  <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">{language === 'ar' ? 'قيمة الإيجار' : 'Rent Amount'}</th>
                  <th className="px-4 py-3 font-semibold text-[11px] uppercase tracking-wider">{language === 'ar' ? 'عرض الحساب' : 'Account'}</th>
                </tr>
              </thead>
              <motion.tbody 
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
              >
                {filtered.map(r => (
                  <motion.tr 
                    key={r.id} 
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-semibold text-xs text-foreground">{r.allNames.join(' | ')}</p>
                      <p className="text-[10px] text-muted-foreground dir-ltr font-mono mt-0.5">{r.renterPhone}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <a 
                          href={`tel:${r.renterPhone}`}
                          className="w-7 h-7 rounded bg-slate-100 border border-border text-foreground hover:bg-slate-200/50 flex flex-col items-center justify-center transition-colors"
                          title={language === 'ar' ? 'اتصال' : 'Call'}
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => openWhatsApp(r.renterPhone, r.allNames)}
                          className="w-7 h-7 rounded bg-emerald-50 border border-emerald-200 text-emerald-600 flex flex-col items-center justify-center hover:bg-emerald-100/50 transition-colors cursor-pointer"
                          title="WhatsApp"
                        >
                          <WhatsAppIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-xs text-foreground line-clamp-1 max-w-[200px]">
                        {r.allBuildings.length > 1 ? r.allBuildings.join('، ') : (r.allBuildings[0] || (language === 'ar' ? 'غير محدد' : 'Unknown'))}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1 max-w-[200px]">
                        {renters.filter(u => u.renterPhone === r.renterPhone).map((u, i) => (
                           <span key={i} className="inline-flex items-center justify-center bg-slate-100 border border-border text-foreground text-[10px] px-1.5 py-0.5 rounded">
                             {u.unitNumber}
                           </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-foreground font-bold">
                       {/* Calculate total rent by adding all units a renter owns, using real array not grouped ones for amount */}
                       {(() => {
                         const total = renters.filter(x => x.renterPhone === r.renterPhone).reduce((sum, u) => sum + (u.rentAmount || 0), 0);
                         return total > 0 ? (
                           <div className="flex items-center gap-1">
                             {total.toLocaleString()} <SrIcon className="w-4 h-4 text-gray-400" />
                           </div>
                         ) : (
                           <span className="text-gray-400 font-medium">{language === 'ar' ? 'غير مسجل' : 'N/A'}</span>
                         )
                       })()}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => {
                          setSelectedRenterPhone(r.renterPhone);
                        }}
                        className="btn-secondary px-3 py-1.5 text-xs rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Wallet className="w-4 h-4" />
                        {language === 'ar' ? 'عرض الحساب' : 'View Account'}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        )}
      </div>
      </>
      )}

      {deleteUnitConfirmId && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg border border-border shadow-md w-full max-w-md p-6"
          >
            <h3 className="text-sm font-bold text-foreground mb-3">{language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}</h3>
            <p className="text-xs text-muted-foreground mb-6">{language === 'ar' ? 'هل أنت متأكد من حذف هذه الوحدة؟ لن تتمكن من استعادة البيانات المرتبطة بها مثل الإيصالات.' : 'Are you sure you want to delete this unit? You will not be able to recover associated data like receipts.'}</p>
            <div className="flex gap-4">
              <button
                onClick={() => executeDeleteUnit(deleteUnitConfirmId)}
                className="flex-1 btn-primary bg-red-600 hover:bg-red-700 border-red-600 text-white h-9 px-4 text-xs font-semibold rounded-md shadow-xs cursor-pointer"
              >
                {language === 'ar' ? 'نعم، احذف الوحدة' : 'Yes, delete unit'}
              </button>
              <button
                onClick={() => setDeleteUnitConfirmId(null)}
                className="flex-1 btn-outline h-9 px-4 text-xs font-semibold rounded-md shadow-xs cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function AdminReceipts() {
  const { language } = useLanguage();
  const [receipts, setReceipts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/receipts')
      .then(res => res.json())
      .then(data => {
        setReceipts(data || []);
        setLoading(false);
      });
  }, []);

  const filteredReceipts = receipts.filter(r => 
    r.renterName?.includes(search) || 
    r.renterPhone?.includes(search) ||
    r.buildingName?.includes(search) ||
    r.unitNumber?.includes(search)
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3 pb-4 border-b border-border">
        <div>
          <h1 className="text-lg font-bold text-foreground">
            {language === 'ar' ? 'إيصالات السداد' : 'Payment Receipts'}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'ar' ? 'جميع إيصالات التحويل والمطالبات' : 'All transfer and claim receipts'}
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute top-1/2 -translate-y-1/2 text-muted-foreground/60 w-4 h-4 ltr:left-3 rtl:right-3" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'بحث (الاسم، الجوال، العقار)...' : 'Search (Name, Phone, Property)...'}
            className="w-full input-field py-1.5 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-sm text-muted-foreground">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>
      ) : filteredReceipts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-border shadow-xs">
          <p className="text-sm text-muted-foreground">
            {language === 'ar' ? 'لا توجد إيصالات أو لم يتم العثور على نتائج' : 'No receipts found'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReceipts.map(r => (
            <div key={r.id} className="shadcn-card group overflow-hidden block flex flex-col hover:shadow-xs transition-shadow">
               {r.receiptUrl ? (
                 <a href={r.receiptUrl} target="_blank" rel="noreferrer" className="block aspect-[4/3] bg-gray-100 overflow-hidden relative cursor-pointer border-b border-border">
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10"></div>
                   <img src={r.receiptUrl} alt="Receipt" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                 </a>
               ) : (
                 <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-xs text-muted-foreground border-b border-border">
                   {language === 'ar' ? 'لا توجد صورة' : 'No Image'}
                 </div>
               )}
               <div className="p-4">
                 <h3 className="font-bold text-xs text-foreground border-b border-border pb-2.5 mb-2.5">
                   {r.renterName} <span className="text-[10px] font-normal text-muted-foreground dir-ltr inline-block ltr:ml-2 rtl:mr-2">{r.renterPhone}</span>
                 </h3>
                 <div className="grid grid-cols-2 gap-y-2 text-xs">
                   <div className="text-muted-foreground">{language === 'ar' ? 'المبنى / الوحدة' : 'Building / Unit'}</div>
                   <div className="font-semibold text-foreground text-left ltr:text-right">{r.buildingName} - {r.unitNumber}</div>
                   
                   <div className="text-muted-foreground">{language === 'ar' ? 'المبلغ' : 'Amount'}</div>
                   <div className="font-bold text-emerald-600 text-left ltr:text-right">{r.amount || '-'}</div>

                   <div className="text-muted-foreground">{language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}</div>
                   <div className="font-semibold text-foreground text-left ltr:text-right">{r.dueDate || '-'}</div>

                   <div className="text-muted-foreground">{language === 'ar' ? 'تاريخ الرفع' : 'Uploaded'}</div>
                   <div className="font-semibold text-muted-foreground text-left ltr:text-right">{new Date(r.createdAt).toLocaleDateString()}</div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

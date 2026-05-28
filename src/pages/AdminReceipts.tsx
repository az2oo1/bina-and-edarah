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
      className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {language === 'ar' ? 'إيصالات السداد' : 'Payment Receipts'}
          </h1>
          <p className="text-gray-500 mt-2">
            {language === 'ar' ? 'جميع إيصالات التحويل والمطالبات' : 'All transfer and claim receipts'}
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 ltr:left-3 rtl:right-3" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'بحث (الاسم، الجوال، العقار)...' : 'Search (Name, Phone, Property)...'}
            className="w-full bg-white border border-gray-300 rounded-xl py-3 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>
      ) : filteredReceipts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium">
            {language === 'ar' ? 'لا توجد إيصالات أو لم يتم العثور على نتائج' : 'No receipts found'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReceipts.map(r => (
            <div key={r.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all">
               {r.receiptUrl ? (
                 <a href={r.receiptUrl} target="_blank" rel="noreferrer" className="block aspect-[4/3] bg-gray-100 overflow-hidden relative cursor-pointer group">
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10"></div>
                   <img src={r.receiptUrl} alt="Receipt" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                 </a>
               ) : (
                 <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400">
                   لا توجد صورة
                 </div>
               )}
               <div className="p-5">
                 <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 mb-3">
                   {r.renterName} <span className="text-sm font-normal text-gray-500 dir-ltr inline-block ltr:ml-2 rtl:mr-2">{r.renterPhone}</span>
                 </h3>
                 <div className="grid grid-cols-2 gap-y-3 text-sm">
                   <div className="text-gray-500">{language === 'ar' ? 'المبنى / الوحدة' : 'Building / Unit'}</div>
                   <div className="font-medium text-gray-900 text-left ltr:text-right">{r.buildingName} - {r.unitNumber}</div>
                   
                   <div className="text-gray-500">{language === 'ar' ? 'المبلغ' : 'Amount'}</div>
                   <div className="font-bold text-green-600 text-left ltr:text-right">{r.amount || '-'}</div>

                   <div className="text-gray-500">{language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}</div>
                   <div className="font-medium text-gray-900 text-left ltr:text-right">{r.dueDate || '-'}</div>

                   <div className="text-gray-500">{language === 'ar' ? 'تاريخ الرفع' : 'Uploaded'}</div>
                   <div className="font-medium text-gray-500 text-left ltr:text-right">{new Date(r.createdAt).toLocaleDateString()}</div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

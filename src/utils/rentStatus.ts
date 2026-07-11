export interface RentHistoryItem {
  id?: string;
  dueDate: string;
  paidDate?: string;
  amount?: string | number;
  receiptUrl?: string | null;
}

export function getRentStatus(h: RentHistoryItem, language: string) {
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

  return {
    isCourt,
    isLate,
    isPaid,
    isFuture,
    isUnpaidPassed,
    isScheduled,
    isDue,
    statusText,
    actualPaidDate
  };
}

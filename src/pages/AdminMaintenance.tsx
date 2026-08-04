import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { 
  Wrench, Search, CheckCircle2, Clock, XCircle, Building2, 
  User, Image as ImageIcon, Image, MessageSquare, 
  Loader2, Check, Send, Upload, FileText, DollarSign, 
  Paperclip, Eye, X, Shield, UserCheck, CheckCheck,
  Tag, CalendarDays, Receipt, TrendingUp, RefreshCw, Layers,
  Plus, Trash2, Printer, Calculator, PieChart, CreditCard, AlertTriangle, FileCheck,
  LayoutGrid, List, ArrowRight, Sliders, Camera
} from 'lucide-react';
import { useDialog } from '../context/DialogContext';
import { CustomSelect } from '../components/CustomSelect';

export interface CostBreakdownItem {
  id: string;
  title: string;
  category: 'MATERIALS' | 'LABOR' | 'INSPECTION' | 'VENDOR_FEE' | 'EMERGENCY' | 'OTHER';
  amount: number;
  supplier?: string;
}

export interface ReceiptItem {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  amount?: number;
}

export interface ExpenseRecord {
  id: string;
  title: string;
  category: 'MATERIALS' | 'LABOR' | 'INSPECTION' | 'VENDOR_FEE' | 'EMERGENCY' | 'OTHER';
  vendorName?: string;
  invoiceNumber?: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  costPayer: 'OWNER' | 'RENTER' | 'PROPERTY_MANAGEMENT' | 'WARRANTY_VENDOR';
  paymentStatus: 'UNPAID' | 'PAID' | 'DEDUCTED_FROM_DEPOSIT' | 'REIMBURSED';
  receiptUrl?: string;
  date: string;
  notes?: string;
  items?: CostBreakdownItem[];
}

interface MaintenanceMessage {
  id: string;
  senderRole: 'RENTER' | 'ADMIN' | 'TECHNICIAN';
  senderName: string;
  message: string;
  attachments: string; // JSON string
  isRead: boolean;
  deliveredAt?: string | null;
  readAt?: string | null;
  createdAt: string;
}

interface MaintenanceLog {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  createdAt: string;
}

interface MaintenanceReport {
  id: string;
  requestCode?: string | null;
  category?: string;
  priority?: string;
  description: string;
  images: string; // JSON string
  status: 'PENDING' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  adminResponse: string | null;
  technicianName?: string | null;
  technicianPhone?: string | null;
  scheduledDate?: string | null;
  completedAt?: string | null;
  estimatedCost?: number | null;
  actualCost?: number | null;
  costPayer?: 'OWNER' | 'RENTER' | 'PROPERTY_MANAGEMENT' | 'WARRANTY_VENDOR' | string | null;
  paymentStatus?: 'UNPAID' | 'PAID' | 'DEDUCTED_FROM_DEPOSIT' | 'REIMBURSED' | string | null;
  invoiceNumber?: string | null;
  vendorName?: string | null;
  taxAmount?: number | null;
  taxRate?: number | null;
  costBreakdown?: string | null;
  receipts?: string | null;
  expenses?: string | null;
  receiptUrl?: string | null;
  proofImages?: string; // JSON string
  rating?: number | null;
  feedback?: string | null;
  claimedBy?: string | null;
  claimedAt?: string | null;
  approvedById?: string | null;
  approvedByName?: string | null;
  approvedAt?: string | null;
  assignedToId?: string | null;
  assignedToName?: string | null;
  assignedAt?: string | null;
  denialReason?: string | null;
  createdAt: string;
  renter: {
    id: string;
    name: string;
    phone: string;
  };
  renterUnit: {
    id: string;
    unitNumber: string;
    building?: {
      id: string;
      name: string;
    };
  };
  messages?: MaintenanceMessage[];
  logs?: MaintenanceLog[];
}

export default function AdminMaintenance({ buildingIdFilter }: { buildingIdFilter?: string }) {
  const { language } = useLanguage();
  const { showAlert } = useDialog();

  const currentUser = (() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch (_) {
      return null;
    }
  })();

  const currentUserName = currentUser?.name || currentUser?.username || 'الموظف';

  const [reports, setReports] = useState<MaintenanceReport[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [payerFilter, setPayerFilter] = useState<string>('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('ALL');
  const [claimViewTab] = useState<'my' | 'unclaimed' | 'all'>('all');

  // CMMS Atlas Navigation & Master-Detail Tabs
  const [mainTab, setMainTab] = useState<'orders' | 'ledger' | 'logs'>('orders');
  const [workspaceSubTab, setWorkspaceSubTab] = useState<'details' | 'financials' | 'logs'>('details');

  // Modals & Details Sub-Tabs
  const [detailsModalReport, setDetailsModalReport] = useState<MaintenanceReport | null>(null);
  const [modalSubTab, setModalSubTab] = useState<'info' | 'actions' | 'expenses'>('info');
  const [chatPopupReport, setChatPopupReport] = useState<MaintenanceReport | null>(null);
  const [invoiceVoucherReport, setInvoiceVoucherReport] = useState<MaintenanceReport | null>(null);

  // Approve & Deny & Assign Modal States
  const [maintenanceUsersList, setMaintenanceUsersList] = useState<any[]>([]);
  const [approveModalReport, setApproveModalReport] = useState<MaintenanceReport | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [approvalInternalNote, setApprovalInternalNote] = useState<string>('');
  const [expectedStartDateInput, setExpectedStartDateInput] = useState<string>('');
  const [estimatedDurationInput, setEstimatedDurationInput] = useState<string>('');
  const [priorityInput, setPriorityInput] = useState<string>('NORMAL');
  const [approving, setApproving] = useState(false);

  const [denyModalReport, setDenyModalReport] = useState<MaintenanceReport | null>(null);
  const [denialReasonInput, setDenialReasonInput] = useState<string>('');
  const [denying, setDenying] = useState(false);

  const [assignModalReport, setAssignModalReport] = useState<MaintenanceReport | null>(null);
  const [assigningStaffId, setAssigningStaffId] = useState<string>('');
  const [assigning, setAssigning] = useState(false);

  // Financial & Expense Form Inputs inside Modal
  const [adminResponseInput, setAdminResponseInput] = useState('');
  const [technicianNameInput, setTechnicianNameInput] = useState('');
  const [technicianPhoneInput, setTechnicianPhoneInput] = useState('');
  const [scheduledDateInput, setScheduledDateInput] = useState('');
  const [estimatedCostInput, setEstimatedCostInput] = useState<string>('');
  const [actualCostInput, setActualCostInput] = useState<string>('');
  const [costPayerInput, setCostPayerInput] = useState<string>('OWNER');
  const [paymentStatusInput, setPaymentStatusInput] = useState<string>('UNPAID');
  const [invoiceNumberInput, setInvoiceNumberInput] = useState<string>('');
  const [vendorNameInput, setVendorNameInput] = useState<string>('');
  const [taxRateInput, setTaxRateInput] = useState<number>(15);
  const [costBreakdownItems, setCostBreakdownItems] = useState<CostBreakdownItem[]>([]);
  const [receiptsItems, setReceiptsItems] = useState<ReceiptItem[]>([]);

  // Multi-Expense Ledger State
  const [expensesLedger, setExpensesLedger] = useState<ExpenseRecord[]>([]);
  const [expenseModalOpen, setExpenseModalOpen] = useState<boolean>(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [singleVoucherExpense, setSingleVoucherExpense] = useState<ExpenseRecord | null>(null);

  // Add/Edit Single Expense Form State
  const [expTitleInput, setExpTitleInput] = useState('');
  const [expCategoryInput, setExpCategoryInput] = useState<'MATERIALS' | 'LABOR' | 'INSPECTION' | 'VENDOR_FEE' | 'EMERGENCY' | 'OTHER'>('MATERIALS');
  const [expVendorInput, setExpVendorInput] = useState('');
  const [expInvoiceNumInput, setExpInvoiceNumInput] = useState('');
  const [expAmountInput, setExpAmountInput] = useState('');
  const [expTaxRateInput, setExpTaxRateInput] = useState<number>(15);
  const [expIncludeTax, setExpIncludeTax] = useState<boolean>(true);
  const [expPayerInput, setExpPayerInput] = useState<'OWNER' | 'RENTER' | 'PROPERTY_MANAGEMENT' | 'WARRANTY_VENDOR'>('OWNER');
  const [expPaymentStatusInput, setExpPaymentStatusInput] = useState<'UNPAID' | 'PAID' | 'DEDUCTED_FROM_DEPOSIT' | 'REIMBURSED'>('UNPAID');
  const [expReceiptUrlInput, setExpReceiptUrlInput] = useState<string | null>(null);
  const [expDateInput, setExpDateInput] = useState<string>('');
  const [expNotesInput, setExpNotesInput] = useState('');
  const [expLineItemsInput, setExpLineItemsInput] = useState<CostBreakdownItem[]>([]);

  const [receiptUrlInput, setReceiptUrlInput] = useState<string | null>(null);
  const [proofImagesInput, setProofImagesInput] = useState<string[]>([]);
  const [statusInput, setStatusInput] = useState<string>('PENDING');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleDirectStatusChange = async (reportId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/maintenance-reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setReports(prev => prev.map(r => r.id === updated.id ? updated : r));
        if (detailsModalReport?.id === updated.id) setDetailsModalReport(updated);
        await showAlert(language === 'ar' ? 'تم تحديث حالة البلاغ بنجاح' : 'Status updated successfully');
      } else {
        const errData = await res.json();
        await showAlert(errData.error || (language === 'ar' ? 'فشل تحديث الحالة' : 'Failed to update status'));
      }
    } catch (err) {
      console.error(err);
      await showAlert(language === 'ar' ? 'حدث خطأ في النظام' : 'System error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Chat States
  const [chatMessage, setChatMessage] = useState('');
  const [chatSenderRole] = useState<'ADMIN' | 'TECHNICIAN'>('ADMIN');
  const [chatSenderName] = useState(currentUserName);
  const [chatAttachments, setChatAttachments] = useState<string[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const fetchMaintenanceUsers = async (bId?: string) => {
    try {
      const url = bId ? `/api/admin/maintenance-users?buildingId=${bId}` : '/api/admin/maintenance-users';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMaintenanceUsersList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch maintenance users list', err);
    }
  };

  useEffect(() => {
    fetchMaintenanceUsers(buildingIdFilter);
  }, [buildingIdFilter]);

  const handleOpenApproveModal = (report: MaintenanceReport) => {
    setApproveModalReport(report);
    setSelectedStaffId(report.assignedToId || '');
    setApprovalInternalNote(language === 'ar' ? 'تم قبول طلب الصيانة وتوجيه الطلب للمعالجة والتنفيذ.' : 'Maintenance request approved and queued for processing.');
    setExpectedStartDateInput((report as any).expectedStartDate || '');
    setEstimatedDurationInput((report as any).estimatedDuration || '');
    setPriorityInput(report.priority || 'NORMAL');
    fetchMaintenanceUsers(report.renterUnit?.building?.id);
  };

  const handleOpenDenyModal = (report: MaintenanceReport) => {
    setDenyModalReport(report);
    setDenialReasonInput('');
  };

  const handleOpenAssignModal = (report: MaintenanceReport) => {
    setAssignModalReport(report);
    setAssigningStaffId(report.assignedToId || '');
    fetchMaintenanceUsers(report.renterUnit?.building?.id);
  };

  const handleExecuteApprove = async () => {
    if (!approveModalReport) return;
    setApproving(true);
    try {
      const res = await fetch(`/api/admin/maintenance-reports/${approveModalReport.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignedToId: selectedStaffId || undefined,
          internalNote: approvalInternalNote || undefined,
          expectedStartDate: expectedStartDateInput || undefined,
          estimatedDuration: estimatedDurationInput || undefined,
          priority: priorityInput || undefined
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setReports(prev => prev.map(r => r.id === updated.id ? updated : r));
        if (detailsModalReport?.id === updated.id) setDetailsModalReport(updated);
        setApproveModalReport(null);
        await showAlert(language === 'ar' ? 'تم قبول بلاغ الصيانة وجدولة الموعد بنجاح' : 'Maintenance request approved successfully');
      } else {
        const errData = await res.json();
        await showAlert(errData.error || (language === 'ar' ? 'فشل قبول طلب الصيانة' : 'Failed to approve request'));
      }
    } catch (err) {
      console.error(err);
      await showAlert(language === 'ar' ? 'حدث خطأ في النظام' : 'System error');
    } finally {
      setApproving(false);
    }
  };

  const handleExecuteDeny = async () => {
    if (!denyModalReport) return;
    if (!denialReasonInput.trim()) {
      await showAlert(language === 'ar' ? 'الرجاء كتابة سبب رفض طلب الصيانة' : 'Please enter a reason for disapproval');
      return;
    }
    setDenying(true);
    try {
      const res = await fetch(`/api/admin/maintenance-reports/${denyModalReport.id}/deny`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          denialReason: denialReasonInput.trim()
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setReports(prev => prev.map(r => r.id === updated.id ? updated : r));
        if (detailsModalReport?.id === updated.id) setDetailsModalReport(updated);
        setDenyModalReport(null);
        await showAlert(language === 'ar' ? 'تم رفض بلاغ الصيانة' : 'Maintenance request denied');
      } else {
        const errData = await res.json();
        await showAlert(errData.error || (language === 'ar' ? 'فشل رفض طلب الصيانة' : 'Failed to deny request'));
      }
    } catch (err) {
      console.error(err);
      await showAlert(language === 'ar' ? 'حدث خطأ في النظام' : 'System error');
    } finally {
      setDenying(false);
    }
  };

  const handleExecuteAssign = async () => {
    if (!assignModalReport || !assigningStaffId) return;
    setAssigning(true);
    try {
      const res = await fetch(`/api/admin/maintenance-reports/${assignModalReport.id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignedToId: assigningStaffId
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setReports(prev => prev.map(r => r.id === updated.id ? updated : r));
        if (detailsModalReport?.id === updated.id) setDetailsModalReport(updated);
        setAssignModalReport(null);
        await showAlert(language === 'ar' ? 'تم تعيين الموظف لبلاغ الصيانة بنجاح' : 'Staff assigned to request successfully');
      } else {
        const errData = await res.json();
        await showAlert(errData.error || (language === 'ar' ? 'فشل تعيين الموظف' : 'Failed to assign staff'));
      }
    } catch (err) {
      console.error(err);
      await showAlert(language === 'ar' ? 'حدث خطأ في النظام' : 'System error');
    } finally {
      setAssigning(false);
    }
  };

  // Lightbox Image Viewer
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const handleDeleteReport = async (reportId: string) => {
    if (!window.confirm(language === 'ar' ? 'هل أنت تأكد من حذف هذا البلاغ؟' : 'Are you sure you want to delete this report?')) return;
    try {
      const res = await fetch(`/api/admin/maintenance-reports/${reportId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setReports(prev => prev.filter(r => r.id !== reportId));
        if (detailsModalReport?.id === reportId) setDetailsModalReport(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      let url = '/api/admin/maintenance-reports';
      const params = new URLSearchParams();
      if (buildingIdFilter) params.append('buildingId', buildingIdFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setReports(data);
        if (data.length > 0 && !selectedId) {
          selectTicket(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [buildingIdFilter, statusFilter]);

  const selectTicket = (report: MaintenanceReport) => {
    setSelectedId(report.id);
    setStatusInput(report.status);
    setAdminResponseInput(report.adminResponse || '');
    setTechnicianNameInput(report.technicianName || '');
    setTechnicianPhoneInput(report.technicianPhone || '');
    setScheduledDateInput(report.scheduledDate ? new Date(report.scheduledDate).toISOString().substring(0, 16) : '');
    setEstimatedCostInput(report.estimatedCost !== null && report.estimatedCost !== undefined ? String(report.estimatedCost) : '');
    setActualCostInput(report.actualCost !== null && report.actualCost !== undefined ? String(report.actualCost) : '');
    setCostPayerInput(report.costPayer || 'OWNER');
    setPaymentStatusInput(report.paymentStatus || 'UNPAID');
    setInvoiceNumberInput(report.invoiceNumber || '');
    setVendorNameInput(report.vendorName || '');
    setTaxRateInput(report.taxRate !== null && report.taxRate !== undefined ? report.taxRate : 15);
    setReceiptUrlInput(report.receiptUrl || null);
    setProofImagesInput(parseImages(report.proofImages));

    try {
      const breakdown = report.costBreakdown ? JSON.parse(report.costBreakdown) : [];
      setCostBreakdownItems(Array.isArray(breakdown) ? breakdown : []);
    } catch (_) {
      setCostBreakdownItems([]);
    }

    try {
      const recs = report.receipts ? JSON.parse(report.receipts) : [];
      setReceiptsItems(Array.isArray(recs) ? recs : []);
    } catch (_) {
      setReceiptsItems([]);
    }

    try {
      const exps = report.expenses ? JSON.parse(report.expenses) : [];
      let loadedExps: ExpenseRecord[] = Array.isArray(exps) ? exps : [];
      if (loadedExps.length === 0) {
        const cbItems: CostBreakdownItem[] = report.costBreakdown ? JSON.parse(report.costBreakdown) : [];
        if (Array.isArray(cbItems) && cbItems.length > 0) {
          loadedExps = cbItems.map((cb: CostBreakdownItem) => ({
            id: cb.id || Date.now().toString() + Math.random().toString(36).substring(2, 5),
            title: cb.title || 'بند مصروفات',
            category: cb.category || 'MATERIALS',
            vendorName: cb.supplier || report.vendorName || undefined,
            invoiceNumber: report.invoiceNumber || undefined,
            amount: cb.amount || 0,
            taxAmount: (cb.amount || 0) * ((report.taxRate || 15) / 100),
            totalAmount: (cb.amount || 0) * (1 + ((report.taxRate || 15) / 100)),
            costPayer: (report.costPayer as any) || 'OWNER',
            paymentStatus: (report.paymentStatus as any) || 'UNPAID',
            receiptUrl: report.receiptUrl || undefined,
            date: report.createdAt || new Date().toISOString()
          }));
        }
      }
      setExpensesLedger(loadedExps);
    } catch (_) {
      setExpensesLedger([]);
    }
  };

  const calculateLedgerTotals = () => {
    const totalSpent = expensesLedger.reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);
    const ownerShare = expensesLedger.filter(i => i.costPayer === 'OWNER').reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);
    const renterShare = expensesLedger.filter(i => i.costPayer === 'RENTER').reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);
    const unpaidShare = expensesLedger.filter(i => i.paymentStatus === 'UNPAID').reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);
    return { totalSpent, ownerShare, renterShare, unpaidShare };
  };

  const handleAddModalLineItem = () => {
    const newItem: CostBreakdownItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      title: '',
      category: 'MATERIALS',
      amount: 0
    };
    setExpLineItemsInput(prev => [...prev, newItem]);
  };

  const handleUpdateModalLineItem = (id: string, field: keyof CostBreakdownItem, val: any) => {
    setExpLineItemsInput(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const handleRemoveModalLineItem = (id: string) => {
    setExpLineItemsInput(prev => prev.filter(item => item.id !== id));
  };

  const handleOpenAddExpenseModal = () => {
    setEditingExpenseId(null);
    setExpTitleInput('');
    setExpCategoryInput('MATERIALS');
    setExpVendorInput('');
    setExpInvoiceNumInput('');
    setExpAmountInput('');
    setExpTaxRateInput(15);
    setExpIncludeTax(true);
    setExpPayerInput('OWNER');
    setExpPaymentStatusInput('UNPAID');
    setExpReceiptUrlInput(null);
    setExpDateInput(new Date().toISOString().substring(0, 10));
    setExpNotesInput('');
    setExpLineItemsInput([]);
    setExpenseModalOpen(true);
  };

  const handleOpenEditExpenseModal = (exp: ExpenseRecord) => {
    setEditingExpenseId(exp.id);
    setExpTitleInput(exp.title);
    setExpCategoryInput(exp.category);
    setExpVendorInput(exp.vendorName || '');
    setExpInvoiceNumInput(exp.invoiceNumber || '');
    setExpAmountInput(String(exp.amount));
    setExpTaxRateInput(15);
    setExpIncludeTax(exp.taxAmount > 0);
    setExpPayerInput(exp.costPayer);
    setExpPaymentStatusInput(exp.paymentStatus);
    setExpReceiptUrlInput(exp.receiptUrl || null);
    setExpDateInput(exp.date ? new Date(exp.date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10));
    setExpNotesInput(exp.notes || '');
    setExpLineItemsInput(exp.items || []);
    setExpenseModalOpen(true);
  };

  const handleSaveExpenseEntry = () => {
    if (!expTitleInput.trim()) {
      showAlert(language === 'ar' ? 'الرجاء كتابة مسمى أو وصف السند' : 'Please enter expense title');
      return;
    }
    const subItemsTotal = expLineItemsInput.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalAmt = expLineItemsInput.length > 0 ? subItemsTotal : (parseFloat(expAmountInput) || 0);

    const entry: ExpenseRecord = {
      id: editingExpenseId || Date.now().toString() + Math.random().toString(36).substring(2, 5),
      title: expTitleInput.trim(),
      category: expCategoryInput,
      vendorName: expVendorInput.trim() || undefined,
      invoiceNumber: expInvoiceNumInput.trim() || undefined,
      amount: totalAmt,
      taxAmount: 0,
      totalAmount: totalAmt,
      costPayer: expPayerInput,
      paymentStatus: expPaymentStatusInput,
      receiptUrl: expReceiptUrlInput || undefined,
      date: expDateInput || new Date().toISOString(),
      notes: expNotesInput.trim() || undefined,
      items: expLineItemsInput.length > 0 ? expLineItemsInput : undefined
    };

    if (editingExpenseId) {
      setExpensesLedger(prev => prev.map(item => item.id === editingExpenseId ? entry : item));
    } else {
      setExpensesLedger(prev => [...prev, entry]);
    }
    setExpenseModalOpen(false);
  };

  const handleDeleteExpenseEntry = (expId: string) => {
    setExpensesLedger(prev => prev.filter(item => item.id !== expId));
  };

  const handleUploadSingleExpenseReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setExpReceiptUrlInput(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const getAllExpensesLedger = () => {
    const list: { report: MaintenanceReport; expense: ExpenseRecord }[] = [];
    reports.forEach(report => {
      try {
        const exps: ExpenseRecord[] = report.expenses ? JSON.parse(report.expenses) : [];
        if (Array.isArray(exps)) {
          exps.forEach(expense => {
            list.push({ report, expense });
          });
        }
      } catch (_) {}
    });
    return list;
  };

  const calculateSubtotal = () => {
    return costBreakdownItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  const calculateTaxAmount = () => {
    const subtotal = calculateSubtotal();
    return subtotal * ((taxRateInput || 15) / 100);
  };

  const calculateTotalCost = () => {
    const lineTotal = calculateSubtotal() + calculateTaxAmount();
    return lineTotal > 0 ? lineTotal : (actualCostInput ? parseFloat(actualCostInput) : 0);
  };

  const handleAddCostItem = () => {
    const newItem: CostBreakdownItem = {
      id: Date.now().toString(),
      title: '',
      category: 'MATERIALS',
      amount: 0,
      supplier: ''
    };
    setCostBreakdownItems(prev => [...prev, newItem]);
  };

  const handleRemoveCostItem = (itemId: string) => {
    setCostBreakdownItems(prev => prev.filter(i => i.id !== itemId));
  };

  const handleUpdateCostItem = (itemId: string, field: keyof CostBreakdownItem, val: any) => {
    setCostBreakdownItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, [field]: val };
      }
      return item;
    }));
  };

  const handleUploadMultiReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          const newReceipt: ReceiptItem = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
            name: file.name,
            url: ev.target.result as string,
            uploadedAt: new Date().toISOString(),
          };
          setReceiptsItems(prev => [...prev, newReceipt]);
          if (!receiptUrlInput) {
            setReceiptUrlInput(ev.target.result as string);
          }
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const openDetailsModal = (report: MaintenanceReport) => {
    selectTicket(report);
    setDetailsModalReport(report);
    setModalSubTab('info');
  };

  const selectedReport = reports.find(r => r.id === selectedId);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedReport?.messages, chatPopupReport?.messages]);

  const handleSaveReportDetails = async (targetReportId?: string) => {
    const rId = targetReportId || selectedReport?.id || detailsModalReport?.id;
    if (!rId) return;
    setUpdatingStatus(true);
    try {
      const computedActualCost = costBreakdownItems.length > 0 
        ? calculateTotalCost() 
        : (actualCostInput !== '' ? parseFloat(actualCostInput) : null);

      const res = await fetch(`/api/admin/maintenance-reports/${rId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusInput,
          adminResponse: adminResponseInput,
          technicianName: technicianNameInput,
          technicianPhone: technicianPhoneInput,
          scheduledDate: scheduledDateInput || null,
          estimatedCost: estimatedCostInput !== '' ? parseFloat(estimatedCostInput) : null,
          actualCost: computedActualCost,
          costPayer: costPayerInput,
          paymentStatus: paymentStatusInput,
          invoiceNumber: invoiceNumberInput,
          vendorName: vendorNameInput,
          taxAmount: calculateTaxAmount(),
          taxRate: taxRateInput,
          costBreakdown: JSON.stringify(costBreakdownItems),
          receipts: JSON.stringify(receiptsItems),
          expenses: JSON.stringify(expensesLedger),
          receiptUrl: receiptUrlInput,
          proofImages: proofImagesInput
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setReports(prev => prev.map(r => r.id === updated.id ? updated : r));
        if (detailsModalReport?.id === updated.id) setDetailsModalReport(updated);
        await showAlert(language === 'ar' ? 'تم حفظ بيانات البلاغ والمصاريف بالفاتورة بنجاح' : 'Report & costs updated successfully');
      } else {
        await showAlert(language === 'ar' ? 'فشل التحديث' : 'Update failed');
      }
    } catch (err) {
      console.error(err);
      await showAlert(language === 'ar' ? 'حدث خطأ في النظام' : 'System error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent, targetReportId?: string) => {
    e.preventDefault();
    const repId = targetReportId || selectedReport?.id;
    if (!repId || (!chatMessage.trim() && chatAttachments.length === 0)) return;

    setSendingMessage(true);
    try {
      const res = await fetch(`/api/maintenance-reports/${repId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderRole: chatSenderRole,
          senderName: chatSenderName || (chatSenderRole === 'TECHNICIAN' ? 'الفني' : currentUserName),
          message: chatMessage,
          attachments: chatAttachments
        })
      });

      if (res.ok) {
        setChatMessage('');
        setChatAttachments([]);
        const repRes = await fetch(`/api/maintenance-reports/${repId}`);
        if (repRes.ok) {
          const freshReport = await repRes.json();
          setReports(prev => prev.map(r => r.id === freshReport.id ? freshReport : r));
          if (chatPopupReport?.id === freshReport.id) setChatPopupReport(freshReport);
          if (detailsModalReport?.id === freshReport.id) setDetailsModalReport(freshReport);
        }
      } else {
        await showAlert(language === 'ar' ? 'فشل إرسال الرسالة' : 'Failed to send message');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleAddProofPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          setProofImagesInput(prev => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file as File);
    });
    e.target.value = '';
  };

  const handleUploadReceiptFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setReceiptUrlInput(ev.target.result);
      }
    };
    reader.readAsDataURL(file as File);
    e.target.value = '';
  };

  const handleAddChatAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          setChatAttachments(prev => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file as File);
    });
    e.target.value = '';
  };

  const parseImages = (jsonStr?: string | null): string[] => {
    if (!jsonStr) return [];
    try {
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const filteredReports = reports.filter(r => {
    const query = search.toLowerCase();
    const renterName = (r.renter?.name || '').toLowerCase();
    const renterPhone = (r.renter?.phone || '').toLowerCase();
    const unitNumber = (r.renterUnit?.unitNumber || '').toLowerCase();
    const buildingName = (r.renterUnit?.building?.name || '').toLowerCase();
    const description = (r.description || '').toLowerCase();
    const category = (r.category || '').toLowerCase();
    const reportCode = (r.requestCode || r.id || '').toLowerCase();

    const matchesSearch = (
      renterName.includes(query) ||
      renterPhone.includes(query) ||
      unitNumber.includes(query) ||
      buildingName.includes(query) ||
      description.includes(query) ||
      category.includes(query) ||
      reportCode.includes(query)
    );

    if (!matchesSearch) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && (r.category || '').toUpperCase() !== categoryFilter.toUpperCase()) return false;
    if (payerFilter !== 'ALL' && (r.costPayer || 'OWNER') !== payerFilter) return false;
    if (paymentStatusFilter !== 'ALL' && (r.paymentStatus || 'UNPAID') !== paymentStatusFilter) return false;

    if (claimViewTab === 'unclaimed') return !r.claimedBy;
    if (claimViewTab === 'my') return r.claimedBy === currentUserName;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return { label: language === 'ar' ? 'معلق' : 'Pending', class: 'bg-amber-500 text-white font-extrabold shadow-md border border-amber-400/40' };
      case 'APPROVED':
        return { label: language === 'ar' ? 'معتمد' : 'Approved', class: 'bg-indigo-600 text-white font-extrabold shadow-md border border-indigo-400/40' };
      case 'IN_PROGRESS':
        return { label: language === 'ar' ? 'جاري المعالجة' : 'In Progress', class: 'bg-sky-500 text-white font-extrabold shadow-md border border-sky-400/40' };
      case 'COMPLETED':
        return { label: language === 'ar' ? 'مكتمل' : 'Completed', class: 'bg-emerald-500 text-white font-extrabold shadow-md border border-emerald-400/40' };
      case 'REJECTED':
      case 'DENIED':
        return { label: language === 'ar' ? 'مرفوض' : 'Denied', class: 'bg-rose-600 text-white font-extrabold shadow-md border border-rose-400/40' };
      case 'CANCELLED':
        return { label: language === 'ar' ? 'ملغى' : 'Cancelled', class: 'bg-red-500 text-white font-extrabold shadow-md border border-red-400/40' };
      default:
        return { label: status, class: 'bg-slate-700 text-white font-extrabold border border-slate-500/40' };
    }
  };

  const getCategoryLabel = (cat?: string) => {
    switch (cat?.toUpperCase()) {
      case 'PLUMBING': return language === 'ar' ? 'سباكة' : 'Plumbing';
      case 'ELECTRICAL': return language === 'ar' ? 'كهرباء' : 'Electrical';
      case 'AC': return language === 'ar' ? 'تكييف' : 'AC & Cooling';
      case 'ELEVATOR': return language === 'ar' ? 'مصاعد' : 'Elevators';
      case 'CLEANING': return language === 'ar' ? 'نظافة' : 'Cleaning';
      case 'GENERAL': return language === 'ar' ? 'صيانة عامة' : 'General';
      default: return language === 'ar' ? 'صيانة عامة' : 'General';
    }
  };

  return (
    <div className="space-y-6 select-none">
      {!detailsModalReport ? (
        /* MASTER MAINTENANCE WORK ORDERS LIST PAGE */
        <div className="space-y-6">
          {/* Standard Admin Header Block */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border select-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-foreground tracking-tight">
                  {language === 'ar' ? 'إدارة تقارير وسندات الصيانة' : 'Maintenance Reports & Ledgers'}
                </h1>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {language === 'ar'
                    ? 'متابعة بلاغات المستأجرين، تعيين موظفي الصيانة، تتبع السندات والمصاريف المتعددة، وطباعة الفواتير الضريبية'
                    : 'Track renter work orders, assign staff, manage multi-receipt financial ledgers, and print tax invoices'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              {/* View Mode Switcher */}
              <div className="flex items-center p-1 bg-muted/40 rounded-full border border-border">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'table' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'جدول' : 'Table'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'بطاقات' : 'Cards'}</span>
                </button>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={fetchReports}
                className="p-2 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs shrink-0"
                title={language === 'ar' ? 'تحديث البيانات' : 'Refresh'}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* KPI METRICS OVERVIEW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div 
              onClick={() => setStatusFilter('ALL')} 
              className={`p-4.5 rounded-2xl border transition-all cursor-pointer ${statusFilter === 'ALL' ? 'bg-primary/10 border-primary text-primary shadow-xs ring-1 ring-primary' : 'bg-card border-border hover:border-primary/40'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-muted-foreground">{language === 'ar' ? 'إجمالي طلبات الصيانة' : 'Total Work Orders'}</span>
                <div className="p-2 rounded-xl bg-primary/10 text-primary"><Layers className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-black mt-2 font-mono">{reports.length}</p>
            </div>

            <div 
              onClick={() => setStatusFilter('PENDING')} 
              className={`p-4.5 rounded-2xl border transition-all cursor-pointer ${statusFilter === 'PENDING' ? 'bg-amber-500/10 border-amber-500 text-amber-600 shadow-xs ring-1 ring-amber-500' : 'bg-card border-border hover:border-primary/40'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-muted-foreground">{language === 'ar' ? 'بانتظار الاعتماد والقبول' : 'Pending Approval'}</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500"><Clock className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-black mt-2 font-mono text-amber-600">
                {reports.filter(r => r.status === 'PENDING').length}
              </p>
            </div>

            <div 
              onClick={() => setStatusFilter('IN_PROGRESS')} 
              className={`p-4.5 rounded-2xl border transition-all cursor-pointer ${statusFilter === 'IN_PROGRESS' ? 'bg-blue-500/10 border-blue-500 text-blue-600 shadow-xs ring-1 ring-blue-500' : 'bg-card border-border hover:border-primary/40'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-muted-foreground">{language === 'ar' ? 'قيد التنفيذ والمتابعة' : 'In Progress'}</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><Wrench className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-black mt-2 font-mono text-blue-600">
                {reports.filter(r => r.status === 'IN_PROGRESS').length}
              </p>
            </div>

            <div 
              onClick={() => setStatusFilter('COMPLETED')} 
              className={`p-4.5 rounded-2xl border transition-all cursor-pointer ${statusFilter === 'COMPLETED' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 shadow-xs ring-1 ring-emerald-500' : 'bg-card border-border hover:border-primary/40'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-muted-foreground">{language === 'ar' ? 'مكتملة ومقفلة' : 'Completed'}</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-black mt-2 font-mono text-emerald-600">
                {reports.filter(r => r.status === 'COMPLETED').length}
              </p>
            </div>
          </div>

          {/* FILTERS & SEARCH BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3.5 rounded-2xl shadow-xs">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0 w-full sm:w-auto">
              {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    statusFilter === st 
                      ? 'bg-primary text-primary-foreground shadow-2xs' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {st === 'ALL' ? (language === 'ar' ? 'جميع البلاغات' : 'All Reports') :
                   st === 'PENDING' ? (language === 'ar' ? 'قيد الانتظار' : 'Pending') :
                   st === 'IN_PROGRESS' ? (language === 'ar' ? 'قيد التنفيذ' : 'In Progress') :
                   st === 'COMPLETED' ? (language === 'ar' ? 'مكتمل' : 'Completed') : (language === 'ar' ? 'ملغى' : 'Cancelled')}
                </button>
              ))}
            </div>

            {/* Search Input - Matching AdminRenters.tsx */}
            <div className="flex items-center gap-2 border border-border rounded-full px-3.5 bg-muted/30 focus-within:bg-card focus-within:ring-1 focus-within:ring-primary w-full sm:w-72 h-9 transition-all shrink-0">
              <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={language === 'ar' ? 'بحث باسم المستأجر، رقم الوحدة، المبنى...' : 'Search renter, unit, building...'}
                className="w-full bg-transparent border-0 outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-0 p-0 text-[11px] text-foreground placeholder:text-muted-foreground font-medium"
              />
              {search && (
                <button onClick={() => setSearch('')} className="p-0.5 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* MASTER MAINTENANCE WORK ORDERS LIST (TABLE & GRID VIEWS) */}
          {loading ? (
            <div className="p-16 text-center bg-card border border-border rounded-2xl space-y-3 shadow-xs">
              <Loader2 className="w-9 h-9 animate-spin text-primary mx-auto" />
              <p className="text-xs font-extrabold text-muted-foreground">{language === 'ar' ? 'جاري تحميل بلاغات وسندات الصيانة...' : 'Loading work orders and ledgers...'}</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-16 text-center bg-card border border-border rounded-2xl space-y-3 shadow-xs">
              <Wrench className="w-12 h-12 text-muted-foreground/30 mx-auto" />
              <h3 className="font-extrabold text-sm text-foreground">{language === 'ar' ? 'لا توجد طلبات صيانة مطابقة' : 'No matching maintenance requests'}</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {language === 'ar' ? 'لم يتم العثور على أي بلاغات صيانة في هذه الفئة حالياً.' : 'No maintenance reports found under current filter criteria.'}
              </p>
            </div>
          ) : viewMode === 'table' ? (
            /* ULTRA CLEAN MINIMAL TABLE VIEW */
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-right rtl:text-right ltr:text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/50 text-muted-foreground font-black border-b border-border text-[11px] uppercase tracking-wider">
                      <th className="p-4">{language === 'ar' ? 'رمز الطلب والمستأجر' : 'Code & Tenant'}</th>
                      <th className="p-4">{language === 'ar' ? 'العقار والوحدة' : 'Property & Unit'}</th>
                      <th className="p-4">{language === 'ar' ? 'نوع الصيانة' : 'Category'}</th>
                      <th className="p-4 text-center">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                      <th className="p-4 text-center">{language === 'ar' ? 'إجمالي السندات والمصاريف' : 'Total Cost'}</th>
                      <th className="p-4 text-center">{language === 'ar' ? 'الإجراء' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-medium">
                    {filteredReports.map((report) => {
                      const statusInfo = getStatusBadge(report.status);

                      return (
                        <tr 
                          key={report.id} 
                          className="hover:bg-muted/30 transition-colors group cursor-pointer"
                          onClick={() => openDetailsModal(report)}
                        >
                          {/* Code & Renter */}
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-mono font-black text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 whitespace-nowrap">
                                #{report.requestCode || report.id.slice(0, 6)}
                              </span>
                              <span className="font-extrabold text-foreground text-xs">{report.renter?.name || 'مستأجر'}</span>
                            </div>
                          </td>

                          {/* Property & Unit */}
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 text-xs">
                              <Building2 className="w-4 h-4 text-primary shrink-0" />
                              <span className="font-bold text-foreground">{report.renterUnit?.building?.name || 'مبنى'}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground font-semibold">{language === 'ar' ? `وحدة ${report.renterUnit?.unitNumber}` : `Unit ${report.renterUnit?.unitNumber}`}</span>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-xl bg-muted text-[10.5px] font-bold text-foreground border border-border">
                              {getCategoryLabel(report.category)}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black ${statusInfo.class}`}>
                              {statusInfo.label}
                            </span>
                          </td>

                          {/* Total Cost */}
                          <td className="p-4 text-center whitespace-nowrap font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs">
                            {Number(report.actualCost || report.estimatedCost || 0).toFixed(2)} SAR
                          </td>

                          {/* Single Clean Action Button */}
                          <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => openDetailsModal(report)}
                              className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-4 rounded-full shadow-2xs cursor-pointer inline-flex items-center gap-1.5 transition-all whitespace-nowrap"
                            >
                              <span>{language === 'ar' ? 'عرض وتتبع الطلب' : 'View Order'}</span>
                              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 ltr:rotate-0" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* WORK ORDERS GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((report) => {
                const statusInfo = getStatusBadge(report.status);

                return (
                  <div 
                    key={report.id}
                    onClick={() => openDetailsModal(report)}
                    className="bg-card border border-border hover:border-primary/40 rounded-2xl p-5 space-y-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Bar */}
                      <div className="flex items-center justify-between border-b border-border/60 pb-3">
                        <span className="text-xs font-mono font-black text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                          #{report.requestCode || report.id.slice(0, 6)}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Renter & Unit Details */}
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-foreground">{report.renter?.name || 'مستأجر'}</h4>
                        <p className="text-xs font-extrabold text-primary flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{report.renterUnit?.building?.name} - {language === 'ar' ? `وحدة ${report.renterUnit?.unitNumber}` : `Unit ${report.renterUnit?.unitNumber}`}</span>
                        </p>
                      </div>

                      {/* Problem Category Tag */}
                      <div className="pt-1">
                        <span className="text-[10.5px] font-extrabold px-2.5 py-1 rounded-xl bg-muted border border-border text-foreground">
                          {getCategoryLabel(report.category)}
                        </span>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                      <div>
                        <span className="block text-[9.5px] font-bold text-muted-foreground">{language === 'ar' ? 'إجمالي السندات:' : 'Total Cost:'}</span>
                        <span className="font-mono font-black text-emerald-600 text-sm">
                          {Number(report.actualCost || report.estimatedCost || 0).toFixed(2)} SAR
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => openDetailsModal(report)}
                        className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-3.5 rounded-full flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <span>{language === 'ar' ? 'عرض الطلب' : 'View'}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 ltr:rotate-0" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* DEDICATED FULL-PAGE WORKSPACE FOR THE REPORT */
        <div className="bg-card border border-border w-full rounded-2xl shadow-xs overflow-hidden flex flex-col min-h-[750px] animate-fade-in p-6 space-y-6">
          {/* Top Back Navigation & Workspace Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border select-none">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDetailsModalReport(null)}
                className="h-9 px-4 rounded-full border border-border bg-card text-foreground hover:bg-muted text-xs font-bold cursor-pointer flex items-center gap-2 shadow-2xs transition-all shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180 text-primary" />
                <span>{language === 'ar' ? 'العودة إلى قائمة البلاغات' : 'Back to Reports List'}</span>
              </button>

              <div className="h-6 w-[1px] bg-border hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold shrink-0">
                  <Wrench className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground tracking-tight">
                    {detailsModalReport.renter?.name || 'مستأجر'}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="font-bold text-foreground">{detailsModalReport.renterUnit?.building?.name || 'مبنى'}</span>
                    <span className="text-muted-foreground/60">•</span>
                    <span>{language === 'ar' ? `وحدة ${detailsModalReport.renterUnit?.unitNumber}` : `Unit ${detailsModalReport.renterUnit?.unitNumber}`}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setChatPopupReport(detailsModalReport)}
                className="h-9 px-4 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'المحادثة المباشرة' : 'Live Chat'}</span>
              </button>

              {detailsModalReport.status === 'PENDING' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleOpenApproveModal(detailsModalReport)}
                    className="h-9 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'قبول وتعيين' : 'Approve'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDenyModal(detailsModalReport)}
                    className="h-9 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'رفض' : 'Deny'}</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  handleDeleteReport(detailsModalReport.id);
                  setDetailsModalReport(null);
                }}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-full border border-border/60 hover:border-red-500/30 cursor-pointer transition-all"
                title={language === 'ar' ? 'حذف البلاغ' : 'Delete'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-Tabs Navigation - Matching Admin.tsx style */}
          <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-full border border-border overflow-x-auto custom-scrollbar">
            <button
              type="button"
              onClick={() => setModalSubTab('info')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                modalSubTab === 'info' 
                  ? 'bg-primary text-primary-foreground shadow-2xs' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تفاصيل البلاغ والمعالجة' : 'Request Details'}</span>
            </button>

            <button
              type="button"
              onClick={() => setModalSubTab('actions')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                modalSubTab === 'actions' 
                  ? 'bg-primary text-primary-foreground shadow-2xs' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الإجراءات والتنفيذ' : 'Actions & Workflow'}</span>
            </button>

            <button
              type="button"
              onClick={() => setModalSubTab('expenses')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                modalSubTab === 'expenses' 
                  ? 'bg-emerald-600 text-white shadow-2xs' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تتبع المصاريف والفواتير (Atlas CMMS)' : 'Financial Expenses & Ledger'}</span>
            </button>
          </div>

          {/* Workspace Body */}
          <div className="space-y-6 text-xs">
              
              {modalSubTab === 'info' ? (
                <>
                  {/* METADATA GRID CARD */}
                  <div className="bg-card border border-border/80 rounded-3xl p-5 space-y-5 shadow-2xs">
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                          <Tag className="w-4 h-4 text-primary" />
                          <span>{language === 'ar' ? 'بيانات الطلب الأساسية' : 'Work Order Metadata'}</span>
                        </span>
                      </div>

                      <div className="text-xs font-mono font-black text-amber-600 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                        ID: #{detailsModalReport.requestCode || detailsModalReport.id.slice(0, 8)}
                      </div>
                    </div>

                    {/* Key-Value Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div className="bg-muted/20 border border-border/60 p-3.5 rounded-2xl space-y-1">
                        <span className="block text-muted-foreground font-bold text-[10.5px]">{language === 'ar' ? 'رمز البلاغ' : 'Work Order ID'}</span>
                        <span className="font-mono font-black text-foreground text-sm block">#{detailsModalReport.requestCode || detailsModalReport.id.slice(0, 8)}</span>
                      </div>

                      <div className="bg-muted/20 border border-border/60 p-3.5 rounded-2xl space-y-1">
                        <span className="block text-muted-foreground font-bold text-[10.5px]">{language === 'ar' ? 'تصنيف الصيانة' : 'Category'}</span>
                        <span className="font-extrabold text-foreground text-sm block">{getCategoryLabel(detailsModalReport.category)}</span>
                      </div>

                      <div className="bg-muted/20 border border-border/60 p-3.5 rounded-2xl space-y-1">
                        <span className="block text-muted-foreground font-bold text-[10.5px]">{language === 'ar' ? 'الأولوية' : 'Priority'}</span>
                        <div>
                          <span className={`inline-block font-black text-xs px-2.5 py-0.5 rounded-md ${
                            detailsModalReport.priority === 'URGENT' ? 'bg-red-500/10 text-red-600 border border-red-500/20' :
                            detailsModalReport.priority === 'HIGH' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                            detailsModalReport.priority === 'LOW' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                            'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          }`}>
                            {detailsModalReport.priority === 'URGENT' ? (language === 'ar' ? 'عاجلة / طارئة' : 'Urgent') :
                             detailsModalReport.priority === 'HIGH' ? (language === 'ar' ? 'عالية' : 'High') :
                             detailsModalReport.priority === 'LOW' ? (language === 'ar' ? 'منخفضة' : 'Low') :
                             (language === 'ar' ? 'عادية' : 'Normal')}
                          </span>
                        </div>
                      </div>

                      <div className="bg-muted/20 border border-border/60 p-3.5 rounded-2xl space-y-1">
                        <span className="block text-muted-foreground font-bold text-[10.5px]">{language === 'ar' ? 'الموقع والعقار' : 'Location'}</span>
                        <span className="font-extrabold text-primary text-xs block truncate">{detailsModalReport.renterUnit?.building?.name || 'مبنى'}</span>
                      </div>

                      <div className="bg-muted/20 border border-border/60 p-3.5 rounded-2xl space-y-1">
                        <span className="block text-muted-foreground font-bold text-[10.5px]">{language === 'ar' ? 'الوحدة السكنية' : 'Asset / Unit'}</span>
                        <span className="font-extrabold text-primary text-xs block">{language === 'ar' ? `وحدة ${detailsModalReport.renterUnit?.unitNumber}` : `Unit ${detailsModalReport.renterUnit?.unitNumber}`}</span>
                      </div>

                      <div className="bg-muted/20 border border-border/60 p-3.5 rounded-2xl space-y-1">
                        <span className="block text-muted-foreground font-bold text-[10.5px]">{language === 'ar' ? 'تاريخ البدء المتوقع' : 'Expected Start Date'}</span>
                        <span className="font-mono font-bold text-foreground text-xs block">
                          {(detailsModalReport as any).expectedStartDate
                            ? new Date((detailsModalReport as any).expectedStartDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')
                            : (language === 'ar' ? 'غير محدد' : 'Not set')}
                        </span>
                      </div>

                      <div className="bg-muted/20 border border-border/60 p-3.5 rounded-2xl space-y-1">
                        <span className="block text-muted-foreground font-bold text-[10.5px]">{language === 'ar' ? 'المدة التقديرية' : 'Estimated Duration'}</span>
                        <span className="font-bold text-foreground text-xs block">
                          {(detailsModalReport as any).estimatedDuration || (language === 'ar' ? 'غير محدودة' : 'N/A')}
                        </span>
                      </div>

                      <div className="bg-muted/20 border border-border/60 p-3.5 rounded-2xl space-y-1">
                        <span className="block text-muted-foreground font-bold text-[10.5px]">{language === 'ar' ? 'تاريخ الإنشاء' : 'Date Created'}</span>
                        <span className="font-mono font-bold text-foreground text-xs block">{new Date(detailsModalReport.createdAt).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                      </div>

                      <div className="bg-muted/20 border border-border/60 p-3.5 rounded-2xl space-y-1">
                        <span className="block text-muted-foreground font-bold text-[10.5px]">{language === 'ar' ? 'المعتمد بواسطة' : 'Approved By'}</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs block">
                          {detailsModalReport.approvedByName || (language === 'ar' ? 'في انتظار الاعتماد' : 'Pending')}
                        </span>
                      </div>

                      <div className="col-span-2 md:col-span-3 bg-muted/20 border border-border/60 p-3.5 rounded-2xl flex items-center justify-between gap-3">
                        <div>
                          <span className="block text-muted-foreground font-bold text-[10.5px] mb-0.5">{language === 'ar' ? 'المسؤول المكلف' : 'Assigned Staff'}</span>
                          <span className="font-extrabold text-primary text-xs flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-primary" />
                            <span>{detailsModalReport.assignedToName || (language === 'ar' ? 'غير مسند لموظف' : 'Unassigned')}</span>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenAssignModal(detailsModalReport)}
                          className="text-xs font-extrabold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer border border-primary/20 shadow-2xs"
                        >
                          {language === 'ar' ? 'تغيير المسؤول' : 'Re-assign'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTION & ATTACHMENTS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Issue Description */}
                    <div className="bg-card border border-border/80 rounded-3xl p-5 space-y-3 shadow-2xs">
                      <h4 className="font-extrabold text-foreground text-xs flex items-center gap-2 border-b border-border/60 pb-3">
                        <FileText className="w-4 h-4 text-primary" />
                        <span>{language === 'ar' ? 'وصف المشكلة من المستأجر:' : 'Issue Description:'}</span>
                      </h4>
                      <div className="p-4 bg-muted/20 rounded-2xl border border-border/60 text-foreground leading-relaxed whitespace-pre-wrap min-h-[140px] text-xs font-medium">
                        {detailsModalReport.description || (language === 'ar' ? 'لا يوجد وصف مدخل' : 'No description provided')}
                      </div>
                    </div>

                    {/* Attached Renter Images Grid */}
                    <div className="bg-card border border-border/80 rounded-3xl p-5 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-border/60 pb-3">
                        <h4 className="font-extrabold text-foreground text-xs flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-primary" />
                          <span>{language === 'ar' ? 'الصور المرفقة من المستأجر:' : 'Renter Uploaded Photos:'}</span>
                        </h4>
                        <span className="text-[10px] font-mono font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-md border border-border">
                          {parseImages(detailsModalReport.images).length} {language === 'ar' ? 'صور' : 'photos'}
                        </span>
                      </div>

                      {parseImages(detailsModalReport.images).length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {parseImages(detailsModalReport.images).map((img, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setLightboxImg(img)}
                              className="aspect-square rounded-2xl overflow-hidden border border-border/80 hover:opacity-95 transition-all cursor-pointer group relative shadow-2xs bg-muted/20"
                            >
                              <img src={img} alt={`Issue ${idx+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity backdrop-blur-[2px]">
                                <Eye className="w-5 h-5" />
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 bg-muted/20 rounded-2xl border border-dashed border-border/80 text-center text-muted-foreground text-xs min-h-[140px] flex flex-col items-center justify-center gap-2">
                          <ImageIcon className="w-7 h-7 text-muted-foreground/40" />
                          <span>{language === 'ar' ? 'لا توجد صور مرفقة من المستأجر' : 'No renter photos attached'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : modalSubTab === 'actions' ? (
                /* TAB 2: DEDICATED ORDER CONTROLS & ACTIONS SUITE */
                <div className="space-y-6">

                  {/* Section 1: Order Status & Direct Actions */}
                  <div className="bg-card border border-border/80 rounded-3xl p-5 space-y-4 shadow-2xs">
                    <h4 className="font-extrabold text-foreground text-xs flex items-center gap-2 border-b border-border/60 pb-3">
                      <Sliders className="w-4 h-4 text-primary" />
                      <span>{language === 'ar' ? 'التحكم في حالة البلاغ والتوجيه:' : 'Order Status & Direct Actions:'}</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                      {/* Status Selector Dropdown */}
                      <div className="space-y-1.5">
                        <label className="block font-extrabold text-muted-foreground text-[11px]">
                          {language === 'ar' ? 'تغيير حالة الطلب المباشرة:' : 'Change Request Status:'}
                        </label>
                        <CustomSelect
                          value={detailsModalReport.status}
                          disabled={updatingStatus}
                          onChange={async (val) => {
                            await handleDirectStatusChange(detailsModalReport.id, val);
                          }}
                          options={[
                            { value: 'PENDING', label: language === 'ar' ? 'قيد الانتظار' : 'Pending' },
                            { value: 'APPROVED', label: language === 'ar' ? 'معتمد' : 'Approved' },
                            { value: 'IN_PROGRESS', label: language === 'ar' ? 'قيد التنفيذ' : 'In Progress' },
                            { value: 'COMPLETED', label: language === 'ar' ? 'مكتمل ومغلق' : 'Completed' },
                            { value: 'REJECTED', label: language === 'ar' ? 'مرفوض' : 'Rejected' },
                            { value: 'CANCELLED', label: language === 'ar' ? 'ملغى' : 'Cancelled' }
                          ]}
                        />
                      </div>

                      {/* Quick Action Control Buttons */}
                      <div className="space-y-1.5">
                        <label className="block font-extrabold text-muted-foreground text-[11px]">
                          {language === 'ar' ? 'إجراءات التكليف والجدولة:' : 'Assignment & Schedule Actions:'}
                        </label>

                        <div className="flex items-center gap-2 flex-wrap">
                          {detailsModalReport.status === 'PENDING' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenApproveModal(detailsModalReport)}
                                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl transition-all cursor-pointer shadow-xs flex items-center gap-2"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{language === 'ar' ? 'قبول وجدولة الموعد' : 'Approve & Schedule'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenDenyModal(detailsModalReport)}
                                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl transition-all cursor-pointer shadow-xs flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>{language === 'ar' ? 'رفض الطلب' : 'Deny Request'}</span>
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenApproveModal(detailsModalReport)}
                              className="px-4 py-2.5 bg-muted/80 hover:bg-muted text-foreground border border-border font-extrabold text-xs rounded-2xl transition-all cursor-pointer shadow-xs flex items-center gap-2"
                            >
                              <CalendarDays className="w-4 h-4 text-primary" />
                              <span>{language === 'ar' ? 'تعديل الموعد والأولوية' : 'Edit Schedule & Priority'}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleOpenAssignModal(detailsModalReport)}
                            className="px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-extrabold text-xs rounded-2xl transition-all cursor-pointer shadow-xs flex items-center gap-2"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>{language === 'ar' ? 'تغيير الفني المسند' : 'Assign Staff'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Work Completion Proof Upload & Photos Grid */}
                  <div className="bg-card border border-border/80 rounded-3xl p-5 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <h4 className="font-extrabold text-foreground text-xs flex items-center gap-2">
                        <Camera className="w-4 h-4 text-blue-500" />
                        <span>{language === 'ar' ? 'صور إثبات العمل والإنجاز:' : 'Work Completion Proof Photos:'}</span>
                      </h4>
                      <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/30 rounded-2xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-2 shadow-2xs">
                        <Upload className="w-4 h-4" />
                        <span>{language === 'ar' ? 'إضافة صور إثبات الإنجاز' : 'Upload Proof Photos'}</span>
                        <input type="file" accept="image/*" multiple onChange={handleAddProofPhoto} className="hidden" />
                      </label>
                    </div>

                    {proofImagesInput.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {proofImagesInput.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-border group shadow-2xs bg-muted/20">
                            <img src={img} alt={`Proof ${idx+1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity backdrop-blur-[2px]">
                              <button
                                type="button"
                                onClick={() => setLightboxImg(img)}
                                className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors cursor-pointer"
                                title={language === 'ar' ? 'تكبير' : 'Enlarge'}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setProofImagesInput(prev => prev.filter((_, i) => i !== idx))}
                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors cursor-pointer"
                                title={language === 'ar' ? 'حذف' : 'Remove'}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 bg-muted/15 rounded-3xl border border-dashed border-border/80 text-center text-muted-foreground text-xs flex flex-col items-center justify-center gap-2">
                        <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                        <span className="font-extrabold text-foreground text-xs">{language === 'ar' ? 'لم يتم إضافة صور إثبات إنجاز العمل بعد.' : 'No proof of work photos uploaded yet.'}</span>
                        <span className="text-[11px] text-muted-foreground">{language === 'ar' ? 'انقر على زر "إضافة صور إثبات الإنجاز" بالأعلى لرفع الصور.' : 'Click "Upload Proof Photos" above to attach proof images.'}</span>
                      </div>
                    )}
                  </div>

                  {/* Section 3: Technician Field Notes & Admin Response */}
                  <div className="bg-card border border-border/80 rounded-3xl p-5 space-y-3 shadow-2xs">
                    <h4 className="font-extrabold text-foreground text-xs flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span>{language === 'ar' ? 'ملاحظات وإفادة الفني/المنفذ:' : 'Technician Field Notes & Report:'}</span>
                    </h4>
                    <textarea
                      rows={4}
                      value={adminResponseInput}
                      onChange={(e) => setAdminResponseInput(e.target.value)}
                      placeholder={language === 'ar' ? 'اكتب ملاحظات الفني أو تفاصيل المعالجة والإنجاز...' : 'Write technician notes or completion details...'}
                      className="w-full bg-background border border-border focus:ring-2 focus:ring-primary/20 rounded-2xl p-4 text-xs text-foreground outline-none resize-none transition-all"
                    />
                  </div>

                  {/* Save Actions & Updates Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => handleSaveReportDetails()}
                      className="px-6 py-3 bg-primary text-primary-foreground font-black text-xs rounded-2xl shadow-xs flex items-center gap-2 cursor-pointer hover:bg-primary/90 transition-all"
                    >
                      {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      <span>{language === 'ar' ? 'حفظ الإجراءات والتحديثات' : 'Save Actions & Updates'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* TAB 3: COMPLETE FINANCIAL & EXPENSES MANAGEMENT SUITE */
                <div className="space-y-6">

                  {/* MULTI-RECEIPT LEDGER KPI OVERVIEW METRICS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <div className="p-4 bg-card border border-border/80 rounded-2xl space-y-1 shadow-2xs">
                      <span className="text-[10.5px] font-extrabold text-muted-foreground block">{language === 'ar' ? 'إجمالي المصاريف المسجلة:' : 'Total Ledger Spent:'}</span>
                      <p className="text-lg font-mono font-black text-emerald-600 dark:text-emerald-400">
                        {calculateLedgerTotals().totalSpent.toFixed(2)} SAR
                      </p>
                    </div>

                    <div className="p-4 bg-card border border-border/80 rounded-2xl space-y-1 shadow-2xs">
                      <span className="text-[10.5px] font-extrabold text-muted-foreground block">{language === 'ar' ? 'حصة المالك:' : 'Landlord Share:'}</span>
                      <p className="text-lg font-mono font-black text-blue-600 dark:text-blue-400">
                        {calculateLedgerTotals().ownerShare.toFixed(2)} SAR
                      </p>
                    </div>

                    <div className="p-4 bg-card border border-border/80 rounded-2xl space-y-1 shadow-2xs">
                      <span className="text-[10.5px] font-extrabold text-muted-foreground block">{language === 'ar' ? 'حصة المستأجر:' : 'Tenant Share:'}</span>
                      <p className="text-lg font-mono font-black text-amber-600 dark:text-amber-400">
                        {calculateLedgerTotals().renterShare.toFixed(2)} SAR
                      </p>
                    </div>

                    <div className="p-4 bg-card border border-border/80 rounded-2xl space-y-1 shadow-2xs">
                      <span className="text-[10.5px] font-extrabold text-muted-foreground block">{language === 'ar' ? 'المتبقي المستحق:' : 'Unpaid Balance:'}</span>
                      <p className="text-lg font-mono font-black text-red-600 dark:text-red-400">
                        {calculateLedgerTotals().unpaidShare.toFixed(2)} SAR
                      </p>
                    </div>
                  </div>

                  {/* MULTI-EXPENSE RECEIPT VOUCHERS LEDGER TABLE */}
                  <div className="bg-card border border-border/80 rounded-3xl p-5 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <h4 className="font-extrabold text-xs text-foreground">
                          {language === 'ar' ? 'سجل الفواتير والمصاريف' : 'Expenses Ledger'}
                        </h4>
                        <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          {expensesLedger.length} {language === 'ar' ? 'فواتير' : 'invoices'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleOpenAddExpenseModal}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{language === 'ar' ? 'إضافة فاتورة جديدة' : 'Add Invoice'}</span>
                      </button>
                    </div>

                    {expensesLedger.length === 0 ? (
                      <div className="p-10 text-center border border-dashed border-border/80 rounded-3xl space-y-3 bg-muted/10">
                        <Receipt className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                        <p className="font-extrabold text-xs text-foreground">
                          {language === 'ar' ? 'لم يتم إضافة فواتير في السجل بعد' : 'No expense invoices added yet'}
                        </p>
                        <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                          {language === 'ar' ? 'يمكنك إضافة فواتير للمشتريات وأجور الفنيين عبر زر "إضافة فاتورة جديدة".' : 'Click "Add Invoice" to log receipt invoices with different vendors and payers.'}
                        </p>
                        <button
                          type="button"
                          onClick={handleOpenAddExpenseModal}
                          className="mt-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-2xl inline-flex items-center gap-2 cursor-pointer shadow-2xs transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{language === 'ar' ? 'إضافة أول فاتورة' : 'Add First Invoice'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto custom-scrollbar rounded-2xl border border-border/60">
                        <table className="w-full text-right rtl:text-right ltr:text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-muted/50 text-muted-foreground font-black border-b border-border text-[10.5px]">
                              <th className="p-3">{language === 'ar' ? 'التاريخ والسند' : 'Date & Title'}</th>
                              <th className="p-3">{language === 'ar' ? 'المورد / رقم الفاتورة' : 'Vendor & Inv #'}</th>
                              <th className="p-3 text-center">{language === 'ar' ? 'صورة الإيصال' : 'Receipt File'}</th>
                              <th className="p-3 text-center">{language === 'ar' ? 'الطرف المتحمل' : 'Cost Payer'}</th>
                              <th className="p-3 text-center">{language === 'ar' ? 'حالة السداد' : 'Payment Status'}</th>
                              <th className="p-3 text-center">{language === 'ar' ? 'المبلغ الإجمالي' : 'Total Gross'}</th>
                              <th className="p-3 text-center">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60 font-medium">
                            {expensesLedger.map((exp) => (
                              <tr key={exp.id} className="hover:bg-muted/20 transition-colors">
                                <td className="p-3">
                                  <div>
                                    <span className="font-extrabold text-foreground block">{exp.title}</span>
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                      {exp.date ? new Date(exp.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : ''}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-3 font-mono text-[11px]">
                                  <span className="font-extrabold text-foreground block">{exp.vendorName || '-'}</span>
                                  <span className="text-muted-foreground text-[10px]">{exp.invoiceNumber ? `#${exp.invoiceNumber}` : '-'}</span>
                                </td>
                                <td className="p-3 text-center">
                                  {exp.receiptUrl ? (
                                    <button
                                      type="button"
                                      onClick={() => setLightboxImg(exp.receiptUrl!)}
                                      className="w-8 h-8 rounded-xl overflow-hidden border border-border bg-black/10 shrink-0 cursor-pointer inline-flex items-center justify-center group relative shadow-2xs"
                                    >
                                      {exp.receiptUrl.startsWith('data:image') || exp.receiptUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                                        <img src={exp.receiptUrl} alt="Receipt" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                      ) : (
                                        <FileText className="w-4 h-4 text-primary" />
                                      )}
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-muted-foreground italic">-</span>
                                  )}
                                </td>
                                <td className="p-3 text-center">
                                  <span className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                                    exp.costPayer === 'RENTER' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                                    exp.costPayer === 'OWNER' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                                    'bg-purple-500/10 text-purple-600 border border-purple-500/20'
                                  }`}>
                                    {exp.costPayer === 'RENTER' ? (language === 'ar' ? 'المستأجر' : 'Renter') :
                                     exp.costPayer === 'OWNER' ? (language === 'ar' ? 'مالك العقار' : 'Owner') :
                                     exp.costPayer === 'PROPERTY_MANAGEMENT' ? (language === 'ar' ? 'إدارة الأملاك' : 'PM Co.') : (language === 'ar' ? 'الضمان' : 'Warranty')}
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  <span className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                                    exp.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                                    exp.paymentStatus === 'UNPAID' ? 'bg-red-500/10 text-red-600 border border-red-500/20' :
                                    'bg-sky-500/10 text-sky-600 border border-sky-500/20'
                                  }`}>
                                    {exp.paymentStatus === 'PAID' ? (language === 'ar' ? 'مدفوع' : 'Paid') :
                                     exp.paymentStatus === 'UNPAID' ? (language === 'ar' ? 'غير مدفوع' : 'Unpaid') :
                                     exp.paymentStatus === 'DEDUCTED_FROM_DEPOSIT' ? (language === 'ar' ? 'خصم تأمين' : 'Deposit') : (language === 'ar' ? 'تعويض' : 'Reimbursed')}
                                  </span>
                                </td>
                                <td className="p-3 text-center font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs">
                                  {Number(exp.totalAmount || exp.amount || 0).toFixed(2)} SAR
                                </td>
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => setSingleVoucherExpense(exp)}
                                      className="p-1.5 text-emerald-600 hover:bg-emerald-500/10 rounded-xl transition-colors cursor-pointer"
                                      title={language === 'ar' ? 'طباعة سند الفاتورة' : 'Print Voucher'}
                                    >
                                      <Printer className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditExpenseModal(exp)}
                                      className="p-1.5 text-primary hover:bg-primary/10 rounded-xl transition-colors cursor-pointer"
                                      title={language === 'ar' ? 'تعديل' : 'Edit'}
                                    >
                                      <Sliders className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteExpenseEntry(exp.id)}
                                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                                      title={language === 'ar' ? 'حذف' : 'Delete'}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* BOTTOM SAVE & STATEMENT ACTION BAR */}
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/80">
                    <div className="text-xs text-muted-foreground font-semibold">
                      {language === 'ar' 
                        ? `إجمالي السندات المسجلة: ${expensesLedger.length} سند بمبلغ ${calculateLedgerTotals().totalSpent.toFixed(2)} SAR`
                        : `Total ${expensesLedger.length} vouchers logged with sum of ${calculateLedgerTotals().totalSpent.toFixed(2)} SAR`}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInvoiceVoucherReport(detailsModalReport)}
                        className="px-4.5 py-2.5 bg-card border border-border hover:bg-muted font-extrabold text-xs rounded-2xl flex items-center gap-2 cursor-pointer text-foreground shadow-2xs transition-all"
                      >
                        <Printer className="w-4 h-4 text-emerald-600" />
                        <span>{language === 'ar' ? 'معاينة وطباعة الكشف الشامل' : 'View Full Statement'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={updatingStatus}
                        onClick={() => handleSaveReportDetails()}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                      >
                        {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        <span>{language === 'ar' ? 'حفظ المصاريف والسندات' : 'Save Financial Ledger'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* CHAT POPUP MODAL (Direct Realtime Messaging Modal) */}
      {chatPopupReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setChatPopupReport(null)}>
          <div 
            className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[620px] animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-3.5 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-foreground">{chatPopupReport.renter?.name}</span>
                <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                  {chatPopupReport.renterUnit?.building?.name} - {language === 'ar' ? `وحدة ${chatPopupReport.renterUnit?.unitNumber}` : `Unit ${chatPopupReport.renterUnit?.unitNumber}`}
                </span>
              </div>
              <button onClick={() => setChatPopupReport(null)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Scroll Thread */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-muted/5 custom-scrollbar">
              {chatPopupReport.messages && chatPopupReport.messages.map((msg) => {
                const isMe = msg.senderRole === 'ADMIN' || msg.senderRole === 'TECHNICIAN';
                const msgImgs = parseImages(msg.attachments);

                return (
                  <div key={msg.id} className={`w-full flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start gap-1.5 max-w-[80%] ${isMe ? 'flex-row-reverse' : ''}`}>
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[9px] shrink-0">
                        {msg.senderName.charAt(0)}
                      </div>
                      <div className={`py-2 px-3 rounded-xl text-[11px] space-y-1 ${isMe ? 'bg-primary/10 border border-primary/25' : 'bg-card border border-border'}`}>
                        <div className="font-extrabold text-foreground">{msg.senderName}</div>
                        <p className="whitespace-pre-wrap m-0">{msg.message}</p>
                        {msgImgs.length > 0 && (
                          <div className="flex gap-1 pt-1">
                            {msgImgs.map((att, aIdx) => (
                              <button key={aIdx} type="button" onClick={() => setLightboxImg(att)} className="w-12 h-12 rounded overflow-hidden">
                                <img src={att} alt="" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-end gap-1 text-[8px] opacity-70">
                          <span>{new Date(msg.createdAt).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMe && (msg.isRead ? <CheckCheck className="w-3.5 h-3.5 text-sky-500 font-bold" /> : <Check className="w-3 h-3 text-muted-foreground" />)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Composer */}
            <form onSubmit={(e) => handleSendMessage(e, chatPopupReport.id)} className="p-3 border-t border-border bg-card space-y-2 shrink-0">
              <div className="flex items-center gap-2">
                <label className="p-1.5 text-muted-foreground hover:text-primary cursor-pointer">
                  <input type="file" accept="image/*" multiple onChange={handleAddChatAttachment} className="hidden" />
                  <Paperclip className="w-4 h-4" />
                </label>
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={language === 'ar' ? 'اكتب رسالة للدردشة المباشرة...' : 'Type message...'}
                  className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
                <button type="submit" disabled={sendingMessage} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer">
                  {sendingMessage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{language === 'ar' ? 'إرسال' : 'Send'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SINGLE EXPENSE RECEIPT PRINTABLE TAX VOUCHER MODAL */}
      {singleVoucherExpense && selectedReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <Printer className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-foreground">
                  {language === 'ar' ? 'معاينة سند مصروف وفاتورة ضريبية فردية' : 'Single Expense Voucher & Tax Invoice'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{language === 'ar' ? 'طباعة السند' : 'Print Voucher'}</span>
                </button>
                <button onClick={() => setSingleVoucherExpense(null)} className="p-1.5 text-muted-foreground hover:text-foreground cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE VOUCHER CONTENT */}
            <div className="bg-background print:bg-white p-6 rounded-2xl border border-border print:border-none space-y-6 text-xs" id="printable-single-voucher">
              {/* Header Letterhead */}
              <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-4">
                <div className="space-y-1">
                  <h2 className="text-base font-black text-foreground print:text-black flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <span>شركة بناء وإدارة للأصول والعقارات</span>
                  </h2>
                  <p className="text-[10px] text-muted-foreground print:text-gray-600">Benaa & Edarah Property Management & Facilities</p>
                  <p className="text-[10px] text-muted-foreground print:text-gray-600 font-mono">الرقم الضريبي: 310482910300003</p>
                </div>

                <div className="text-left ltr:text-right rtl:text-left space-y-1">
                  <div className="inline-block bg-emerald-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-md">
                    سند صرف وتكاليف صيانة
                  </div>
                  <p className="text-[10px] font-mono font-bold text-foreground print:text-black">
                    رقم السند: {singleVoucherExpense.invoiceNumber || `EXP-${singleVoucherExpense.id.slice(0, 6)}`}
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground print:text-gray-600">
                    التاريخ: {new Date(singleVoucherExpense.date).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>

              {/* Customer & Unit Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-muted/30 print:bg-gray-100 rounded-xl border border-border print:border-gray-300">
                <div>
                  <span className="block text-[9.5px] font-bold text-muted-foreground print:text-gray-600">{language === 'ar' ? 'اسم المستأجر / العميل:' : 'Tenant Name:'}</span>
                  <span className="font-extrabold text-foreground print:text-black">{selectedReport.renter?.name || 'مستأجر'}</span>
                </div>
                <div>
                  <span className="block text-[9.5px] font-bold text-muted-foreground print:text-gray-600">{language === 'ar' ? 'العقار والوحدة:' : 'Property & Unit:'}</span>
                  <span className="font-extrabold text-foreground print:text-black">
                    {selectedReport.renterUnit?.building?.name || 'مبنى'} - وحدة {selectedReport.renterUnit?.unitNumber}
                  </span>
                </div>
                <div>
                  <span className="block text-[9.5px] font-bold text-muted-foreground print:text-gray-600">{language === 'ar' ? 'المورد / المقاول:' : 'Vendor:'}</span>
                  <span className="font-extrabold text-foreground print:text-black">{singleVoucherExpense.vendorName || 'غير محدد'}</span>
                </div>
                <div>
                  <span className="block text-[9.5px] font-bold text-muted-foreground print:text-gray-600">{language === 'ar' ? 'الطرف المتحمل للتكلفة:' : 'Payer:'}</span>
                  <span className="font-extrabold text-emerald-600 print:text-black">
                    {singleVoucherExpense.costPayer === 'OWNER' ? 'مالك العقار / المؤجر' :
                     singleVoucherExpense.costPayer === 'RENTER' ? 'المستأجر (على حسابه)' :
                     singleVoucherExpense.costPayer === 'PROPERTY_MANAGEMENT' ? 'شركة إدارة الأملاك' : 'الضمان / المقاول'}
                  </span>
                </div>
                <div>
                  <span className="block text-[9.5px] font-bold text-muted-foreground print:text-gray-600">{language === 'ar' ? 'حالة السداد:' : 'Payment Status:'}</span>
                  <span className="font-extrabold text-foreground print:text-black">
                    {singleVoucherExpense.paymentStatus === 'PAID' ? 'تم السداد بالكامل' :
                     singleVoucherExpense.paymentStatus === 'DEDUCTED_FROM_DEPOSIT' ? 'خصم من التأمين' :
                     singleVoucherExpense.paymentStatus === 'REIMBURSED' ? 'تم التعويض' : 'غير مدفوع (مستحق)'}
                  </span>
                </div>
              </div>

              {/* Single Charge Detail Table */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-foreground print:text-black border-b border-border pb-1">
                  {language === 'ar' ? 'تفاصيل بند الصيانة والمصروف:' : 'Charge Expense Details:'}
                </h4>

                <table className="w-full border-collapse border border-border print:border-gray-400 text-xs">
                  <thead>
                    <tr className="bg-muted/50 print:bg-gray-200 text-muted-foreground print:text-black font-extrabold border-b border-border">
                      <th className="p-2 text-right rtl:text-right ltr:text-left border-r border-border">{language === 'ar' ? 'مسمى المصروف / البند' : 'Description'}</th>
                      <th className="p-2 text-right rtl:text-right ltr:text-left border-r border-border">{language === 'ar' ? 'التصنيف' : 'Category'}</th>
                      <th className="p-2 text-center border-r border-border">{language === 'ar' ? 'رقم الفاتورة' : 'Invoice #'}</th>
                      <th className="p-2 text-left rtl:text-left ltr:text-right">{language === 'ar' ? 'المبلغ الصافي' : 'Net Subtotal'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2.5 border-r border-border font-bold">{singleVoucherExpense.title}</td>
                      <td className="p-2.5 border-r border-border">{singleVoucherExpense.category}</td>
                      <td className="p-2.5 text-center border-r border-border font-mono">{singleVoucherExpense.invoiceNumber || '-'}</td>
                      <td className="p-2.5 text-left rtl:text-left ltr:text-right font-mono font-bold">{Number(singleVoucherExpense.amount || 0).toFixed(2)} SAR</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Individual Receipt Image Preview if attached */}
              {singleVoucherExpense.receiptUrl && (
                <div className="space-y-2 border-t border-border pt-4 print:border-gray-400">
                  <h4 className="font-bold text-xs text-foreground print:text-black flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'ar' ? 'صورة ومستند إيصال السداد المرفق:' : 'Attached Digital Receipt Image:'}</span>
                  </h4>
                  <div className="max-h-64 overflow-hidden rounded-xl border border-border print:border-gray-400 p-2 bg-muted/20">
                    <img src={singleVoucherExpense.receiptUrl} alt="Receipt" className="max-h-56 mx-auto object-contain rounded-lg" />
                  </div>
                </div>
              )}
              {/* Financial Totals Summary Box */}
              <div className="flex justify-end pt-2">
                <div className="w-full sm:w-72 bg-muted/20 print:bg-gray-100 p-3 rounded-xl border border-border print:border-gray-400">
                  <div className="flex justify-between font-black text-sm text-emerald-600 print:text-black">
                    <span>{language === 'ar' ? 'الإجمالي النهائي للسند:' : 'Total Voucher Amount:'}</span>
                    <span className="font-mono text-base">{Number(singleVoucherExpense.totalAmount || singleVoucherExpense.amount || 0).toFixed(2)} SAR</span>
                  </div>
                </div>
              </div>

              {/* Authorization Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border print:border-gray-400 text-center">
                <div className="space-y-6">
                  <span className="block font-bold text-muted-foreground print:text-black text-[11px]">{language === 'ar' ? 'توقيع واعتماد قسم الصيانة' : 'Maintenance Manager Signature'}</span>
                  <div className="h-10 border-b border-dashed border-border print:border-gray-500 w-3/4 mx-auto"></div>
                </div>
                <div className="space-y-6">
                  <span className="block font-bold text-muted-foreground print:text-black text-[11px]">{language === 'ar' ? 'توقيع المستلم / المستأجر' : 'Recipient Signature'}</span>
                  <div className="h-10 border-b border-dashed border-border print:border-gray-500 w-3/4 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONSOLIDATED MAINTENANCE TAX INVOICE MODAL */}
      {invoiceVoucherReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <Printer className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-foreground">
                  {language === 'ar' ? 'معاينة كشف حساب الصيانة والفاتورة الضريبية الشاملة' : 'Consolidated Maintenance Voucher & Tax Invoice'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{language === 'ar' ? 'طباعة الكشف' : 'Print Statement'}</span>
                </button>
                <button onClick={() => setInvoiceVoucherReport(null)} className="p-1.5 text-muted-foreground hover:text-foreground cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE VOUCHER CONTENT */}
            <div className="bg-background print:bg-white p-6 rounded-2xl border border-border print:border-none space-y-6 text-xs" id="printable-consolidated-voucher">
              {/* Header Letterhead */}
              <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-4">
                <div className="space-y-1">
                  <h2 className="text-base font-black text-foreground print:text-black flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <span>شركة بناء وإدارة للأصول والعقارات</span>
                  </h2>
                  <p className="text-[10px] text-muted-foreground print:text-gray-600">Benaa & Edarah Property Management & Facilities</p>
                  <p className="text-[10px] text-muted-foreground print:text-gray-600 font-mono">الرقم الضريبي: 310482910300003</p>
                </div>

                <div className="text-left ltr:text-right rtl:text-left space-y-1">
                  <div className="inline-block bg-emerald-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-md">
                    كشف حساب وسند صيانة شامل
                  </div>
                  <p className="text-[10px] font-mono font-bold text-foreground print:text-black">
                    رقم البلاغ: #{invoiceVoucherReport.requestCode || invoiceVoucherReport.id.substring(0, 8)}
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground print:text-gray-600">
                    التاريخ: {new Date(invoiceVoucherReport.createdAt).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>

              {/* Customer & Unit Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-muted/30 print:bg-gray-100 rounded-xl border border-border print:border-gray-300">
                <div>
                  <span className="block text-[9.5px] font-bold text-muted-foreground print:text-gray-600">{language === 'ar' ? 'اسم المستأجر / العميل:' : 'Tenant Name:'}</span>
                  <span className="font-extrabold text-foreground print:text-black">{invoiceVoucherReport.renter?.name || 'مستأجر'}</span>
                </div>
                <div>
                  <span className="block text-[9.5px] font-bold text-muted-foreground print:text-gray-600">{language === 'ar' ? 'العقار والوحدة:' : 'Property & Unit:'}</span>
                  <span className="font-extrabold text-foreground print:text-black">
                    {invoiceVoucherReport.renterUnit?.building?.name || 'مبنى'} - وحدة {invoiceVoucherReport.renterUnit?.unitNumber}
                  </span>
                </div>
                <div>
                  <span className="block text-[9.5px] font-bold text-muted-foreground print:text-gray-600">{language === 'ar' ? 'تصنيف الصيانة:' : 'Category:'}</span>
                  <span className="font-extrabold text-foreground print:text-black">{getCategoryLabel(invoiceVoucherReport.category)}</span>
                </div>
                <div>
                  <span className="block text-[9.5px] font-bold text-muted-foreground print:text-gray-600">{language === 'ar' ? 'مسؤول الصيانة:' : 'Staff:'}</span>
                  <span className="font-extrabold text-foreground print:text-black">{invoiceVoucherReport.assignedToName || invoiceVoucherReport.technicianName || 'فريق الصيانة'}</span>
                </div>
                <div>
                  <span className="block text-[9.5px] font-bold text-muted-foreground print:text-gray-600">{language === 'ar' ? 'الطرف المتحمل للتكلفة:' : 'Payer:'}</span>
                  <span className="font-extrabold text-emerald-600 print:text-black">
                    {invoiceVoucherReport.costPayer === 'OWNER' ? 'مالك العقار / المؤجر' :
                     invoiceVoucherReport.costPayer === 'RENTER' ? 'المستأجر (على حسابه)' :
                     invoiceVoucherReport.costPayer === 'PROPERTY_MANAGEMENT' ? 'شركة إدارة الأملاك' : 'الضمان / المقاول'}
                  </span>
                </div>
                <div>
                  <span className="block text-[9.5px] font-bold text-muted-foreground print:text-gray-600">{language === 'ar' ? 'حالة السداد:' : 'Payment Status:'}</span>
                  <span className="font-extrabold text-foreground print:text-black">
                    {invoiceVoucherReport.paymentStatus === 'PAID' ? 'تم السداد بالكامل' :
                     invoiceVoucherReport.paymentStatus === 'DEDUCTED_FROM_DEPOSIT' ? 'خصم من التأمين' :
                     invoiceVoucherReport.paymentStatus === 'REIMBURSED' ? 'تم التعويض' : 'غير مدفوع (مستحق)'}
                  </span>
                </div>
              </div>

              {/* Itemized Line Items Table */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-foreground print:text-black border-b border-border pb-1">
                  {language === 'ar' ? 'تفاصيل السندات والمصروفات المسجلة للبلاغ:' : 'Itemized Maintenance Expenses:'}
                </h4>

                <table className="w-full border-collapse border border-border print:border-gray-400 text-xs">
                  <thead>
                    <tr className="bg-muted/50 print:bg-gray-200 text-muted-foreground print:text-black font-extrabold border-b border-border">
                      <th className="p-2 text-right rtl:text-right ltr:text-left border-r border-border">#</th>
                      <th className="p-2 text-right rtl:text-right ltr:text-left border-r border-border">{language === 'ar' ? 'وصف السند / المصروف' : 'Description'}</th>
                      <th className="p-2 text-right rtl:text-right ltr:text-left border-r border-border">{language === 'ar' ? 'التصنيف والمورد' : 'Category & Vendor'}</th>
                      <th className="p-2 text-center border-r border-border">{language === 'ar' ? 'الطرف المتحمل وحالة السداد' : 'Payer & Status'}</th>
                      <th className="p-2 text-left rtl:text-left ltr:text-right">{language === 'ar' ? 'المبلغ الإجمالي (SAR)' : 'Total Gross'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border print:divide-gray-300">
                    {(() => {
                      let exps: any[] = [];
                      try { exps = invoiceVoucherReport.expenses ? JSON.parse(invoiceVoucherReport.expenses) : []; } catch (_) {}
                      if (!Array.isArray(exps) || exps.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="p-3 text-center text-muted-foreground print:text-black font-medium">
                              تجميع تكلفة صيانة العطل العامة ({invoiceVoucherReport.actualCost || invoiceVoucherReport.estimatedCost || 0} ريال)
                            </td>
                          </tr>
                        );
                      }
                      return exps.map((item, idx) => (
                        <tr key={idx} className="hover:bg-muted/20">
                          <td className="p-2 border-r border-border font-mono">{idx + 1}</td>
                          <td className="p-2 border-r border-border font-bold">{item.title}</td>
                          <td className="p-2 border-r border-border">{item.category} {item.vendorName ? `(${item.vendorName})` : ''}</td>
                          <td className="p-2 text-center border-r border-border">
                            <span className="font-bold block text-[11px]">
                              {item.costPayer === 'RENTER' ? (language === 'ar' ? 'المستأجر' : 'Renter') :
                               item.costPayer === 'OWNER' ? (language === 'ar' ? 'مالك العقار' : 'Owner') :
                               item.costPayer === 'PROPERTY_MANAGEMENT' ? (language === 'ar' ? 'إدارة الأملاك' : 'PM Co.') : (language === 'ar' ? 'الضمان' : 'Warranty')}
                            </span>
                            <span className="text-[10px] text-muted-foreground print:text-gray-700 block">
                              {item.paymentStatus === 'PAID' ? (language === 'ar' ? 'تم السداد' : 'Paid') :
                               item.paymentStatus === 'UNPAID' ? (language === 'ar' ? 'غير مدفوع (مستحق)' : 'Unpaid') :
                               item.paymentStatus === 'DEDUCTED_FROM_DEPOSIT' ? (language === 'ar' ? 'خصم تأمين' : 'Deposit') : (language === 'ar' ? 'تعويض' : 'Reimbursed')}
                            </span>
                          </td>
                          <td className="p-2 text-left rtl:text-left ltr:text-right font-mono font-bold">{Number(item.totalAmount || item.amount || 0).toFixed(2)}</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals Summary Box */}
              <div className="flex justify-end pt-2">
                <div className="w-full sm:w-72 bg-muted/20 print:bg-gray-100 p-3 rounded-xl border border-border print:border-gray-400 space-y-1.5">
                  <div className="flex justify-between text-muted-foreground print:text-black font-bold">
                    <span>{language === 'ar' ? 'إجمالي التكاليف:' : 'Total Cost:'}</span>
                    <span className="font-mono font-black text-emerald-600 print:text-black">{Number(invoiceVoucherReport.actualCost || 0).toFixed(2)} SAR</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border print:border-gray-400 text-center">
                <div className="space-y-6">
                  <span className="block font-bold text-muted-foreground print:text-black text-[11px]">{language === 'ar' ? 'توقيع واعتماد قسم الصيانة' : 'Maintenance Manager Signature'}</span>
                  <div className="h-10 border-b border-dashed border-border print:border-gray-500 w-3/4 mx-auto"></div>
                </div>
                <div className="space-y-6">
                  <span className="block font-bold text-muted-foreground print:text-black text-[11px]">{language === 'ar' ? 'توقيع المستلم / المستأجر' : 'Recipient / Tenant Signature'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* APPROVE & SCHEDULE MODAL */}
      {approveModalReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setApproveModalReport(null)}>
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-foreground">
                  {language === 'ar' ? 'قبول طلب الصيانة وتحديد المواعيد والأولوية' : 'Approve & Schedule Maintenance Request'}
                </h3>
              </div>
              <button onClick={() => setApproveModalReport(null)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-muted/20 p-3 rounded-xl border border-border/60 text-xs space-y-1">
              <div className="font-extrabold text-foreground">{approveModalReport.renter?.name}</div>
              <div className="text-muted-foreground">{approveModalReport.renterUnit?.building?.name} - {language === 'ar' ? `وحدة ${approveModalReport.renterUnit?.unitNumber}` : `Unit ${approveModalReport.renterUnit?.unitNumber}`}</div>
            </div>

            <div className="space-y-3 text-xs">
              {/* Priority Selector */}
              <div>
                <label className="block font-bold text-foreground mb-1">
                  {language === 'ar' ? 'الأولوية:' : 'Priority:'}
                </label>
                <CustomSelect
                  value={priorityInput}
                  onChange={(val) => setPriorityInput(val)}
                  options={[
                    { value: 'NORMAL', label: language === 'ar' ? 'عادية' : 'Normal' },
                    { value: 'LOW', label: language === 'ar' ? 'منخفضة' : 'Low' },
                    { value: 'HIGH', label: language === 'ar' ? 'عالية' : 'High' },
                    { value: 'URGENT', label: language === 'ar' ? 'عاجلة / طارئة' : 'Urgent' }
                  ]}
                />
              </div>

              {/* Expected Start Date */}
              <div>
                <label className="block font-bold text-foreground mb-1">
                  {language === 'ar' ? 'تاريخ البدء المتوقع:' : 'Expected start date:'}
                </label>
                <input
                  type="date"
                  value={expectedStartDateInput ? expectedStartDateInput.split('T')[0] : ''}
                  onChange={(e) => setExpectedStartDateInput(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold font-mono outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Estimated Duration */}
              <div>
                <label className="block font-bold text-foreground mb-1">
                  {language === 'ar' ? 'المدة التقديرية:' : 'Estimated Duration:'}
                </label>
                <input
                  type="text"
                  value={estimatedDurationInput}
                  onChange={(e) => setEstimatedDurationInput(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: ساعتان / 2 hours' : 'e.g. 2 hours / 1 day'}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Assign Staff */}
              <div>
                <label className="block font-bold text-foreground mb-1">
                  {language === 'ar' ? 'تعيين إلى فني الصيانة:' : 'Assign to Maintenance Technician:'}
                </label>
                <CustomSelect
                  value={selectedStaffId}
                  onChange={(val) => setSelectedStaffId(val)}
                  placeholder={language === 'ar' ? '-- اختر فني الصيانة (اختياري) --' : '-- Select Technician (Optional) --'}
                  options={maintenanceUsersList.filter(s => s.role === 'MAINTENANCE').map(staff => ({
                    value: staff.id,
                    label: `${staff.name} (${staff.username})`
                  }))}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setApproveModalReport(null)}
                className="btn-outline h-9 px-4 text-xs font-bold rounded-xl cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={approving}
                onClick={handleExecuteApprove}
                className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-5 text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{language === 'ar' ? 'تأكيد القبول والجدولة' : 'Confirm Approval & Schedule'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DENY MODAL */}
      {denyModalReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setDenyModalReport(null)}>
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold">
                  <XCircle className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-foreground">
                  {language === 'ar' ? 'رفض طلب الصيانة' : 'Deny Maintenance Request'}
                </h3>
              </div>
              <button onClick={() => setDenyModalReport(null)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1">
                  {language === 'ar' ? 'سبب الرفض (مطلوب):' : 'Reason for Disapproval (Required):'}
                </label>
                <textarea
                  rows={3}
                  value={denialReasonInput}
                  onChange={(e) => setDenialReasonInput(e.target.value)}
                  placeholder={language === 'ar' ? 'اكتب سبب رفض طلب الصيانة للمستأجر...' : 'Reason for denial...'}
                  className="w-full bg-background border border-border rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-red-500 resize-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDenyModalReport(null)}
                className="btn-outline h-9 px-4 text-xs font-bold rounded-xl cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={denying}
                onClick={handleExecuteDeny}
                className="bg-red-600 hover:bg-red-700 text-white h-9 px-5 text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {denying ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                <span>{language === 'ar' ? 'تأكيد الرفض' : 'Confirm Denial'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN MODAL */}
      {assignModalReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setAssignModalReport(null)}>
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-foreground">
                  {language === 'ar' ? 'تغيير المسؤول المكلف بالطلب' : 'Change Assigned Staff'}
                </h3>
              </div>
              <button onClick={() => setAssignModalReport(null)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1">
                  {language === 'ar' ? 'اختر فني الصيانة المسؤول:' : 'Select Maintenance Technician:'}
                </label>
                <CustomSelect
                  value={assigningStaffId}
                  onChange={(val) => setAssigningStaffId(val)}
                  placeholder={language === 'ar' ? '-- إلغاء الإسناد (بدون مسؤول) --' : '-- Unassign --'}
                  options={maintenanceUsersList.filter(s => s.role === 'MAINTENANCE').map(staff => ({
                    value: staff.id,
                    label: `${staff.name} (${staff.username})`
                  }))}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAssignModalReport(null)}
                className="btn-outline h-9 px-4 text-xs font-bold rounded-xl cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={assigning}
                onClick={handleExecuteAssign}
                className="btn-primary h-9 px-5 text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {assigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                <span>{language === 'ar' ? 'حفظ التغيير' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT SINGLE EXPENSE RECEIPT ENTRY MODAL */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setExpenseModalOpen(false)}>
          <div className="bg-card border border-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center font-bold">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-foreground">
                    {editingExpenseId 
                      ? (language === 'ar' ? 'تعديل الفاتورة' : 'Edit Invoice') 
                      : (language === 'ar' ? 'إضافة فاتورة جديدة' : 'Add New Invoice')}
                  </h3>
                  <p className="text-[10.5px] text-muted-foreground">
                    {language === 'ar' ? 'أدخل بيانات الفاتورة، البنود، والطرف المدفوع له' : 'Enter invoice details, itemized breakdown, and cost payer.'}
                  </p>
                </div>
              </div>
              <button onClick={() => setExpenseModalOpen(false)} className="p-1.5 text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs max-h-[75vh] overflow-y-auto custom-scrollbar px-1">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-foreground mb-1">
                    {language === 'ar' ? 'وصف الفاتورة:' : 'Invoice Description:'}
                  </label>
                  <input
                    type="text"
                    value={expTitleInput}
                    onChange={(e) => setExpTitleInput(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: شراء قطع سباكة وأجرة فني' : 'e.g. Plumbing parts & labor'}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-foreground mb-1">
                    {language === 'ar' ? 'نوع الفاتورة:' : 'Invoice Type:'}
                  </label>
                  <CustomSelect
                    value={expCategoryInput}
                    onChange={(val) => setExpCategoryInput(val as any)}
                    options={[
                      { value: 'MATERIALS', label: language === 'ar' ? 'قطع غيار' : 'Materials & Parts' },
                      { value: 'LABOR', label: language === 'ar' ? 'أجرة تركيب' : 'Labor & Installation' },
                      { value: 'INSPECTION', label: language === 'ar' ? 'رسوم فحص' : 'Inspection & Diagnostics' },
                      { value: 'VENDOR_FEE', label: language === 'ar' ? 'رسوم مقاول' : 'Vendor / Contractor Fee' },
                      { value: 'EMERGENCY', label: language === 'ar' ? 'صيانة طارئة' : 'Emergency Maintenance' },
                      { value: 'OTHER', label: language === 'ar' ? 'مصاريف أخرى' : 'Other Expenses' }
                    ]}
                  />
                </div>
              </div>

              {/* Vendor & Invoice Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-muted-foreground mb-1">
                    {language === 'ar' ? 'اسم المحل أو الفني:' : 'Vendor / Technician Name:'}
                  </label>
                  <input
                    type="text"
                    value={expVendorInput}
                    onChange={(e) => setExpVendorInput(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: محل أدوات السباكة' : 'e.g. Plumbing Supply Co.'}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-muted-foreground mb-1">
                    {language === 'ar' ? 'رقم الفاتورة:' : 'Invoice #:'}
                  </label>
                  <input
                    type="text"
                    value={expInvoiceNumInput}
                    onChange={(e) => setExpInvoiceNumInput(e.target.value)}
                    placeholder="INV-9902"
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-mono font-bold outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Dynamic Itemized Sub-Items Breakdown inside the Receipt Modal */}
              <div className="p-3.5 bg-muted/20 border border-border rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <div className="flex items-center gap-1.5 font-extrabold text-foreground text-xs">
                    <Calculator className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'ar' ? 'بنود الفاتورة:' : 'Invoice Line Items:'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddModalLineItem}
                    className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/20 font-bold text-[10.5px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'إضافة بند' : 'Add Item'}</span>
                  </button>
                </div>

                {expLineItemsInput.length === 0 ? (
                  <div className="text-center py-3 text-muted-foreground text-[11px]">
                    <span>{language === 'ar' ? 'انقر على "إضافة بند" أعلاه لتفصيل المواد والأجور داخل الفاتورة.' : 'Click "Add Item" to detail materials, labor fees and costs inside this invoice.'}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2 text-[9.5px] font-extrabold text-muted-foreground uppercase border-b border-border pb-1 px-1">
                      <div className="col-span-5">{language === 'ar' ? 'وصف البند' : 'Description'}</div>
                      <div className="col-span-4">{language === 'ar' ? 'التصنيف' : 'Category'}</div>
                      <div className="col-span-3 text-center">{language === 'ar' ? 'المبلغ (ريال)' : 'Amount'}</div>
                    </div>

                    {expLineItemsInput.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-background p-2 rounded-xl border border-border/80">
                        <div className="col-span-5">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateModalLineItem(item.id, 'title', e.target.value)}
                            placeholder={language === 'ar' ? 'مثال: محبس ماء / أجرة يد' : 'Item description'}
                            className="w-full bg-background border border-border rounded-lg px-2.5 py-1 text-xs font-medium outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="col-span-4">
                          <CustomSelect
                            value={item.category}
                            onChange={(val) => handleUpdateModalLineItem(item.id, 'category', val)}
                            options={[
                              { value: 'MATERIALS', label: language === 'ar' ? 'قطع غيار' : 'Materials' },
                              { value: 'LABOR', label: language === 'ar' ? 'أجرة يد' : 'Labor' },
                              { value: 'INSPECTION', label: language === 'ar' ? 'رسوم كشف' : 'Inspection' },
                              { value: 'VENDOR_FEE', label: language === 'ar' ? 'رسوم مقاول' : 'Vendor Fee' },
                              { value: 'EMERGENCY', label: language === 'ar' ? 'رسوم طارئة' : 'Emergency' },
                              { value: 'OTHER', label: language === 'ar' ? 'أخرى' : 'Other' }
                            ]}
                          />
                        </div>
                        <div className="col-span-3 flex items-center gap-1">
                          <input
                            type="number"
                            value={item.amount || ''}
                            onChange={(e) => handleUpdateModalLineItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs font-mono font-bold outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveModalLineItem(item.id)}
                            className="p-1 text-red-500 hover:bg-red-500/10 rounded-md transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Final Voucher Price / Total inside Sub-Items Box */}
                <div className="pt-2 border-t border-border/80 flex items-center justify-between bg-card p-3 rounded-xl border border-emerald-500/30">
                  <span className="text-xs font-bold text-foreground">
                    {language === 'ar' ? 'المبلغ الإجمالي:' : 'Total Amount:'}
                  </span>
                  <span className="text-base font-mono font-black text-emerald-600 dark:text-emerald-400">
                    {(expLineItemsInput.length > 0 ? expLineItemsInput.reduce((s, i) => s + (Number(i.amount) || 0), 0) : (parseFloat(expAmountInput) || 0)).toFixed(2)} SAR
                  </span>
                </div>
              </div>

              {/* Cost Payer & Payment Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-foreground mb-1">
                    {language === 'ar' ? 'الطرف المتحمل للتكلفة:' : 'Cost Payer:'}
                  </label>
                  <CustomSelect
                    value={expPayerInput}
                    onChange={(val) => setExpPayerInput(val as any)}
                    options={[
                      { value: 'OWNER', label: language === 'ar' ? 'المالك' : 'Landlord / Property Owner' },
                      { value: 'RENTER', label: language === 'ar' ? 'المستأجر' : 'Renter / Tenant' },
                      { value: 'PROPERTY_MANAGEMENT', label: language === 'ar' ? 'شركة الإدارة' : 'Property Management Co.' },
                      { value: 'WARRANTY_VENDOR', label: language === 'ar' ? 'الضمان' : 'Warranty / Vendor' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-foreground mb-1">
                    {language === 'ar' ? 'حالة الدفع:' : 'Payment Status:'}
                  </label>
                  <CustomSelect
                    value={expPaymentStatusInput}
                    onChange={(val) => setExpPaymentStatusInput(val as any)}
                    options={[
                      { value: 'UNPAID', label: language === 'ar' ? 'غير مدفوع' : 'Unpaid' },
                      { value: 'PAID', label: language === 'ar' ? 'مدفوع' : 'Paid' },
                      { value: 'DEDUCTED_FROM_DEPOSIT', label: language === 'ar' ? 'خصم من التأمين' : 'Deducted from Deposit' },
                      { value: 'REIMBURSED', label: language === 'ar' ? 'تم التعويض' : 'Reimbursed' }
                    ]}
                  />
                </div>
              </div>

              {/* Date & Receipt Attachment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-bold text-muted-foreground mb-1">
                    {language === 'ar' ? 'تاريخ الفاتورة:' : 'Voucher Date:'}
                  </label>
                  <input
                    type="date"
                    value={expDateInput}
                    onChange={(e) => setExpDateInput(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-muted-foreground mb-1">
                    {language === 'ar' ? 'مرفق الفاتورة:' : 'Receipt Attachment:'}
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>{language === 'ar' ? 'رفع الفاتورة' : 'Upload Receipt'}</span>
                      <input type="file" accept="image/*,.pdf" onChange={handleUploadSingleExpenseReceipt} className="hidden" />
                    </label>
                    {expReceiptUrlInput && (
                      <div className="flex items-center gap-1 overflow-hidden">
                        <button type="button" onClick={() => setLightboxImg(expReceiptUrlInput)} className="text-[11px] text-primary font-bold underline truncate">
                          {language === 'ar' ? 'معاينة المرفق' : 'Preview Attachment'}
                        </button>
                        <button type="button" onClick={() => setExpReceiptUrlInput(null)} className="p-1 text-red-500 hover:text-red-700">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-muted-foreground mb-1">
                  {language === 'ar' ? 'ملاحظات وتفاصيل إضافية:' : 'Notes / Remarks:'}
                </label>
                <textarea
                  rows={2}
                  value={expNotesInput}
                  onChange={(e) => setExpNotesInput(e.target.value)}
                  placeholder={language === 'ar' ? 'ملاحظات إضافية...' : 'Additional notes...'}
                  className="w-full bg-background border border-border rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setExpenseModalOpen(false)}
                className="btn-outline h-9 px-4 text-xs font-bold rounded-xl cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveExpenseEntry}
                className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-5 text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>{language === 'ar' ? 'حفظ الفاتورة' : 'Save Invoice'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX IMAGE PREVIEW MODAL */}
      {lightboxImg && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImg(null)}
        >
          <button 
            type="button"
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-3 rounded-full bg-white/10 transition-colors cursor-pointer z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={lightboxImg} 
            alt="Preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl animate-in zoom-in-95" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

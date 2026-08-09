import React from 'react';
import { useLanguage } from '../../LanguageContext';
import { Download, Upload, Loader2, Database, Archive, FileJson, CheckCircle2, ShieldAlert } from 'lucide-react';

interface BackupSettingsTabProps {
  exportingDb: boolean;
  exportingType?: 'full' | 'db' | null;
  handleExportDatabase: (type: 'full' | 'db') => Promise<void>;
  restoringDb: boolean;
  restoreProgress?: number | null;
  handleRestoreDatabase: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const BackupSettingsTab: React.FC<BackupSettingsTabProps> = ({
  exportingDb,
  exportingType,
  handleExportDatabase,
  restoringDb,
  restoreProgress,
  handleRestoreDatabase,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-4 inline-flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          <span>{language === 'ar' ? 'إدارة النسخ الاحتياطية واستعادة البيانات' : 'Database Backup & System Restore'}</span>
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'ar'
            ? 'قم بحفظ نسخة احتياطية كاملة أو استعادة بيانات النظام والوسائط بأمان مع دعم الملفات الكبيرة حتى 2GB.'
            : 'Create complete backups or securely restore system data and media with large file support up to 2GB.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Full ZIP Export Card */}
        <div className="bg-card/70 backdrop-blur-xs border border-border/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5 hover:border-primary/40 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <Archive className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {language === 'ar' ? 'نسخة شاملة (ZIP)' : 'Full Archive (ZIP)'}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">
                {language === 'ar' ? 'نسخة كاملة مع الوسائط (Full Backup ZIP)' : 'Full Site Backup (ZIP)'}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                {language === 'ar'
                  ? 'يشمل جميع بيانات قاعدة البيانات بالإضافة إلى ملفات الوسائط والصور المرفوعة.'
                  : 'Includes full database records plus all uploaded property photos and media files.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleExportDatabase('full')}
            disabled={exportingDb}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs font-bold"
          >
            {exportingDb && exportingType === 'full' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>
              {exportingDb && exportingType === 'full'
                ? (language === 'ar' ? 'جاري تجهيز وتحميل النسخة...' : 'Preparing ZIP archive...')
                : (language === 'ar' ? 'تحميل النسخة الكاملة (ZIP)' : 'Download Full Backup (ZIP)')}
            </span>
          </button>
        </div>

        {/* Database-Only JSON Export Card */}
        <div className="bg-card/70 backdrop-blur-xs border border-border/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5 hover:border-emerald-500/40 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                <FileJson className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {language === 'ar' ? 'فائق السرعة (JSON)' : 'Fast (JSON)'}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">
                {language === 'ar' ? 'نسخة قاعدة البيانات فقط (DB-Only JSON)' : 'Database Only (JSON)'}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                {language === 'ar'
                  ? 'تحميل سريع وفوري لسجلات العقارات، المستأجرين، الطلبات، والإعدادات بحجم ملف صغير جداً.'
                  : 'Instant lightweight download for properties, renters, contracts, and settings without media.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleExportDatabase('db')}
            disabled={exportingDb}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs font-bold transition-all"
          >
            {exportingDb && exportingType === 'db' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>
              {exportingDb && exportingType === 'db'
                ? (language === 'ar' ? 'جاري التحميل...' : 'Downloading...')
                : (language === 'ar' ? 'تحميل بيانات القاعدة (JSON)' : 'Download Database Only (JSON)')}
            </span>
          </button>
        </div>
      </div>

      {/* Restore Section Card */}
      <div className="bg-card/70 backdrop-blur-xs border border-border/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">
                {language === 'ar' ? 'استعادة نسخة احتياطية (Restore System)' : 'Restore Backup'}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {language === 'ar'
                  ? 'يدعم رفع ملفات .zip (كاملة) أو .json (قاعدة البيانات فقط) حتى 2GB.'
                  : 'Supports both .zip (full archive) and .json (database only) files up to 2GB.'}
              </p>
            </div>
          </div>
        </div>

        {restoringDb && (
          <div className="p-4 bg-muted/40 rounded-xl border border-border/60 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-foreground flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                {restoreProgress !== null && restoreProgress !== undefined && restoreProgress < 100
                  ? (language === 'ar' ? 'جاري رفع ملف النسخة الاحتياطية إلى الخادم...' : 'Uploading backup file to server...')
                  : (language === 'ar' ? 'جاري فك الضغط وتحديث قاعدة البيانات...' : 'Processing and restoring database...')}
              </span>
              <span className="font-mono text-primary font-bold">
                {restoreProgress !== null && restoreProgress !== undefined ? `${restoreProgress}%` : ''}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${restoreProgress || 5}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              {language === 'ar'
                ? 'يرجى عدم إغلاق أو إعادة تحميل الصفحة أثناء عملية الاستعادة.'
                : 'Please do not close or reload the browser while restore is running.'}
            </p>
          </div>
        )}

        <label className="w-full cursor-pointer block">
          <input
            type="file"
            accept=".zip,.json"
            onChange={handleRestoreDatabase}
            disabled={restoringDb || exportingDb}
            className="hidden"
          />
          <div className="w-full btn-outline py-3.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs font-bold border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all">
            {restoringDb ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <Upload className="w-4 h-4 text-primary" />
            )}
            <span>
              {restoringDb
                ? (language === 'ar' ? 'جاري المعالجة والاستعادة...' : 'Restoring backup...')
                : (language === 'ar' ? 'اختر ملف النسخة الاحتياطية (.zip أو .json) لبدء الاستعادة' : 'Select backup file (.zip or .json) to restore')}
            </span>
          </div>
        </label>

        {/* Informative Tip */}
        <div className="flex items-start gap-2.5 p-3.5 bg-muted/30 rounded-xl border border-border/50 text-[11px] text-muted-foreground">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">
              {language === 'ar' ? 'ملاحظات هامة حول النسخ الاحتياطي:' : 'Important Backup Notes:'}
            </p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>
                {language === 'ar'
                  ? 'تم تمديد مهلة الخادم إلى 30 دقيقة لدعم الملفات الكبيرة بدون انقطاع.'
                  : 'Server timeout is configured for 30 minutes to support large files without interruption.'}
              </li>
              <li>
                {language === 'ar'
                  ? 'إذا كانت سرعة الإنترنت بطيئة، يمكنك استخدام خيار (قاعدة البيانات فقط - JSON) للنسخ والاستعادة في ثوانٍ.'
                  : 'For slower internet connections, using "Database Only (JSON)" allows lightning-fast exports and restores.'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

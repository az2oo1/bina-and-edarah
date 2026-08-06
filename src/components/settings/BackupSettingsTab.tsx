import React from 'react';
import { useLanguage } from '../../LanguageContext';
import { Download, Upload, Loader2 } from 'lucide-react';

interface BackupSettingsTabProps {
  exportingDb: boolean;
  handleExportDatabase: () => Promise<void>;
  restoringDb: boolean;
  restoreProgress?: number | null;
  handleRestoreDatabase: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const BackupSettingsTab: React.FC<BackupSettingsTabProps> = ({
  exportingDb,
  handleExportDatabase,
  restoringDb,
  restoreProgress,
  handleRestoreDatabase,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-4 inline-block">
          {language === 'ar' ? 'إدارة النسخ الاحتياطية وتصدير البيانات' : 'Database Backup & Export'}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'ar'
            ? 'احفظ نسخة احتياطية كاملة من قاعدة بيانات النظام أو قم باستعادتها عند الحاجة.'
            : 'Create full database backups or restore system data when needed.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2">
              <Download className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-foreground">
              {language === 'ar' ? 'تحميل نسخة احتياطية (JSON Backup)' : 'Download Backup (JSON)'}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {language === 'ar'
                ? 'يحتوي الملف على جميع العقارات، الوحدات، الطلبات، والمستأجرين المسجلين في النظام.'
                : 'Includes all properties, units, callback requests, and renters registered in the system.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportDatabase}
            disabled={exportingDb}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {exportingDb ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{language === 'ar' ? 'تصدير وتحميل النسخة الآن' : 'Export & Download Backup'}</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-foreground">
              {language === 'ar' ? 'استعادة نسخة احتياطية (Restore)' : 'Restore Backup'}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {language === 'ar'
                ? 'رفع ملف نسخة احتياطية (ZIP) لاستعادة قاعدة البيانات والملفات وتحديث النظام.'
                : 'Upload a backup ZIP file to restore the database, uploads, and update system state.'}
            </p>
          </div>

          <label className="w-full cursor-pointer">
            <input
              type="file"
              accept=".zip,.json"
              onChange={handleRestoreDatabase}
              disabled={restoringDb}
              className="hidden"
            />
            <div className="w-full btn-outline py-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
              {restoringDb ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>
                {restoringDb
                  ? (restoreProgress !== undefined && restoreProgress !== null
                      ? `${language === 'ar' ? 'جاري الرفع:' : 'Uploading:'} ${restoreProgress}%`
                      : (language === 'ar' ? 'جاري الاستعادة...' : 'Restoring...'))
                  : (language === 'ar' ? 'رفع واستعادة النسخة' : 'Upload & Restore Backup')}
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

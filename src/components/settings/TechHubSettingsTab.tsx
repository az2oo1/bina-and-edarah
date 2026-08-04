import React from 'react';
import { useLanguage } from '../../LanguageContext';
import { RefreshCw, KeyRound, Globe, Info } from 'lucide-react';

interface TechHubSettingsTabProps {
  techHubApiKey: string;
  setTechHubApiKey: (val: string) => void;
  techHubEndpointUrl: string;
  setTechHubEndpointUrl: (val: string) => void;
  techHubSyncEnabled: boolean;
  setTechHubSyncEnabled: (val: boolean) => void;
}

export const TechHubSettingsTab: React.FC<TechHubSettingsTabProps> = ({
  techHubApiKey,
  setTechHubApiKey,
  techHubEndpointUrl,
  setTechHubEndpointUrl,
  techHubSyncEnabled,
  setTechHubSyncEnabled,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-4 inline-block">
          {language === 'ar' ? 'إعدادات ربط بوابة TechHub للصيانة' : 'TechHub Maintenance Portal Integration'}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'ar'
            ? 'تكوين مفاتيح الربط ومزامنة طلبات الصيانة تلقائياً مع منصة TechHub الخارجية.'
            : 'Configure API keys and automated maintenance request synchronization with TechHub.'}
        </p>
      </div>

      <div className="bg-muted/10 p-5 rounded-2xl space-y-5 border border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">
                {language === 'ar' ? 'تفعيل المزامنة التلقائية مع TechHub' : 'Enable Automatic TechHub Sync'}
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {language === 'ar' ? 'إرسال البلاغات فور تقديمها إلى TechHub' : 'Automatically dispatch maintenance tickets to TechHub'}
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={techHubSyncEnabled} 
              onChange={(e) => setTechHubSyncEnabled(e.target.checked)} 
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-border/40">
          <div className="space-y-1.5">
            <label className="cn-label flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-muted-foreground" />
              <span>{language === 'ar' ? 'مفتاح API الخاص بـ TechHub' : 'TechHub API Key'}</span>
            </label>
            <input
              type="password"
              value={techHubApiKey}
              onChange={(e) => setTechHubApiKey(e.target.value)}
              className="cn-input font-mono text-xs h-10 dir-ltr bg-background"
              placeholder="th_live_secret_..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="cn-label flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span>{language === 'ar' ? 'رابط خادم TechHub (Endpoint URL)' : 'TechHub Endpoint URL'}</span>
            </label>
            <input
              type="url"
              value={techHubEndpointUrl}
              onChange={(e) => setTechHubEndpointUrl(e.target.value)}
              className="cn-input font-mono text-xs h-10 dir-ltr bg-background"
              placeholder="https://api.techhub.sa/v1/tickets"
            />
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/40 p-3.5 rounded-xl border border-border/50 flex items-start gap-2">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            {language === 'ar' 
              ? 'تتيح هذه الإعدادات للفنيين والمشرفين متابعة وتوجيه البلاغات مباشرة عبر نظام إدارة الصيانة الخاص بـ TechHub.'
              : 'Allows technicians and field supervisors to receive & handle tickets directly in TechHub maintenance portal.'}
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '../LanguageContext';

type PolicySection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

const sections: Record<'en' | 'ar', PolicySection[]> = {
  en: [
    {
      title: 'Information we collect',
      items: [
        'Account and authentication information, including phone numbers, one-time verification information, and administrator account credentials.',
        'Property and tenancy information, including names, unit details, rental and contract information, payment or receipt references, and information associated with your account.',
        'Maintenance and communication information, including request descriptions, categories, priorities, messages, and status updates.',
        'Photos and documents that you choose to capture or select, including maintenance photos, property documents, and payment receipts.',
        'Device, notification, technical, connection, log, and error information needed to operate and secure the service.',
      ],
      paragraphs: [
        'We do not request access to your camera or photo library unless you choose a feature that requires it. You can deny or later revoke these permissions in your device settings, although some upload features may not work.',
      ],
    },
    {
      title: 'How we use information',
      items: [
        'Create and authenticate accounts and maintain secure sessions.',
        'Display the properties, units, tenancy information, and services associated with your account.',
        'Receive, manage, assign, and track maintenance requests.',
        'Transmit photos, documents, receipts, and messages that you choose to submit.',
        'Send service updates, maintenance messages, status changes, and other necessary notifications.',
        'Provide support, troubleshoot problems, protect the service, and comply with legal obligations.',
      ],
    },
    {
      title: 'How we share information',
      paragraphs: [
        'We may share information with the property owner, property manager, administrator, or maintenance personnel responsible for providing services to you. We may also use service providers that host, operate, secure, or support the service, only as needed to provide those services.',
        'We may disclose information when required by law, legal process, or a valid governmental request; to protect the rights, safety, and security of users, the service, or others; or in connection with a merger, acquisition, restructuring, or transfer of the service.',
        'We do not sell your personal information or share it with third parties for their own advertising purposes.',
      ],
    },
    {
      title: 'Photos, documents, and notifications',
      paragraphs: [
        'If you use camera or photo-library features, the service accesses only the media you select or capture for the requested action. Those files are transmitted to our service and made available to the property or maintenance team handling the relevant request.',
        'With your permission, the service may send push notifications about maintenance requests, messages, status changes, and service updates. You can disable notifications through your device settings.',
      ],
    },
    {
      title: 'Local storage and security',
      paragraphs: [
        'The App stores limited information locally on your device to keep you signed in and remember preferences. Authentication tokens and similar session information are stored using secure device storage where available. Data transmitted between the App and the service is protected using HTTPS/TLS where supported.',
        'No method of transmission or storage is completely secure. We use reasonable technical and organizational measures appropriate to the nature of the information, but cannot guarantee absolute security.',
      ],
    },
    {
      title: 'Retention and your choices',
      paragraphs: [
        'We retain personal information for as long as reasonably necessary to provide services, manage maintenance and tenancy records, resolve disputes, comply with legal and accounting obligations, and enforce our agreements.',
      ],
      items: [
        'Decline camera, photo-library, and notification permissions.',
        'Log out and remove locally stored session information through the App where available.',
        'Request access to, correction of, or deletion of personal information associated with your account, subject to legal and operational requirements.',
      ],
    },
    {
      title: 'Children, international transfers, and changes',
      paragraphs: [
        'The service is intended for property, tenancy, and maintenance management and is not directed to children under 13. We do not knowingly collect personal information from children under 13.',
        'Your information may be processed in the country where the service operator or its service providers operate. Where required, we use appropriate safeguards for cross-border processing.',
        'We may update this policy from time to time. We will update the effective date below and, where appropriate, provide additional notice in the App or through the service.',
      ],
    },
  ],
  ar: [
    {
      title: 'المعلومات التي نجمعها',
      items: [
        'معلومات الحساب والمصادقة، بما في ذلك رقم الهاتف ومعلومات التحقق لمرة واحدة وبيانات حسابات المسؤولين.',
        'معلومات العقارات والوحدات والإيجار والعقود وإيصالات السداد والمعلومات المرتبطة بحسابك.',
        'معلومات طلبات الصيانة والتواصل، مثل الوصف والتصنيف والأولوية والرسائل وتحديثات الحالة.',
        'الصور والمستندات التي تختار التقاطها أو تحديدها، بما في ذلك صور الأعطال ومستندات العقار وإيصالات السداد.',
        'المعلومات التقنية ومعلومات الجهاز والإشعارات والسجلات اللازمة لتشغيل الخدمة وحمايتها.',
      ],
      paragraphs: [
        'لا نطلب الوصول إلى الكاميرا أو مكتبة الصور إلا عند استخدام ميزة تحتاج إلى ذلك. يمكنك رفض الأذونات أو إلغاؤها من إعدادات جهازك، وقد يؤدي ذلك إلى عدم توفر بعض ميزات الرفع.',
      ],
    },
    {
      title: 'كيف نستخدم المعلومات',
      items: [
        'إنشاء الحسابات والمصادقة عليها والحفاظ على الجلسات الآمنة.',
        'عرض العقارات والوحدات ومعلومات الإيجار والخدمات المرتبطة بحسابك.',
        'استقبال طلبات الصيانة وإدارتها وتعيينها ومتابعتها.',
        'إرسال الصور والمستندات والإيصالات والرسائل التي تختار تقديمها.',
        'إرسال تحديثات الخدمة ورسائل الصيانة وتغييرات الحالة والإشعارات اللازمة.',
        'تقديم الدعم وحل المشكلات وحماية الخدمة والامتثال للالتزامات النظامية.',
      ],
    },
    {
      title: 'مشاركة المعلومات',
      paragraphs: [
        'قد نشارك المعلومات مع مالك العقار أو مديره أو المسؤولين أو فريق الصيانة المكلف بتقديم الخدمة لك، ومع مقدمي الخدمات الذين يستضيفون أو يشغلون أو يؤمنون الخدمة عند الحاجة لذلك.',
        'قد نكشف المعلومات إذا كان ذلك مطلوباً بموجب النظام أو إجراء قانوني أو طلب حكومي صحيح، أو لحماية حقوق وسلامة وأمن المستخدمين أو الخدمة أو الآخرين، أو ضمن عملية اندماج أو استحواذ أو إعادة هيكلة.',
        'لا نبيع معلوماتك الشخصية ولا نشاركها مع أطراف أخرى لأغراضهم الإعلانية الخاصة.',
      ],
    },
    {
      title: 'الصور والمستندات والإشعارات',
      paragraphs: [
        'عند استخدام الكاميرا أو مكتبة الصور، يصل التطبيق فقط إلى الوسائط التي تلتقطها أو تختارها للإجراء المطلوب. يتم إرسالها إلى خدمتنا وإتاحتها للفريق المسؤول عن طلب الصيانة المعني.',
        'بعد الحصول على إذنك، قد نرسل إشعارات حول طلبات الصيانة والرسائل وتغييرات الحالة وتحديثات الخدمة. يمكنك إيقاف الإشعارات من إعدادات جهازك.',
      ],
    },
    {
      title: 'التخزين المحلي والأمان',
      paragraphs: [
        'يخزن التطبيق معلومات محدودة على جهازك للحفاظ على تسجيل الدخول وتذكر التفضيلات. تُحفظ رموز المصادقة ومعلومات الجلسة المماثلة باستخدام التخزين الآمن للجهاز عند توفره، وتحمي البيانات المنقولة باستخدام HTTPS/TLS حيثما كان ذلك مدعوماً.',
        'لا توجد وسيلة نقل أو تخزين آمنة بشكل كامل. نستخدم إجراءات تقنية وتنظيمية معقولة ومناسبة لطبيعة المعلومات، دون ضمان الأمان المطلق.',
      ],
    },
    {
      title: 'الاحتفاظ بالمعلومات وحقوقك',
      paragraphs: [
        'نحتفظ بالمعلومات الشخصية للمدة اللازمة بشكل معقول لتقديم الخدمات وإدارة سجلات الصيانة والإيجار وحل النزاعات والامتثال للالتزامات النظامية والمحاسبية وتنفيذ اتفاقياتنا.',
      ],
      items: [
        'رفض أذونات الكاميرا ومكتبة الصور والإشعارات.',
        'تسجيل الخروج وإزالة معلومات الجلسة المخزنة محلياً حيثما كان ذلك متاحاً.',
        'طلب الوصول إلى معلومات حسابك أو تصحيحها أو حذفها، مع مراعاة المتطلبات النظامية والتشغيلية.',
      ],
    },
    {
      title: 'الأطفال والنقل الدولي والتحديثات',
      paragraphs: [
        'الخدمة مخصصة لإدارة العقارات والإيجارات والصيانة وليست موجهة للأطفال دون 13 عاماً، ولا نجمع معلوماتهم الشخصية عن علم.',
        'قد تتم معالجة معلوماتك في الدولة التي يعمل فيها مشغل الخدمة أو مقدمو خدماته. نستخدم الضمانات المناسبة لعمليات النقل الدولي عندما يكون ذلك مطلوباً.',
        'قد نحدّث سياسة الخصوصية من وقت لآخر، وسنحدّث تاريخ السريان ونقدم إشعاراً إضافياً عند الحاجة.',
      ],
    },
  ],
};

export default function PrivacyPolicy() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const BackArrow = isArabic ? ArrowRight : ArrowLeft;
  const policySections = sections[language];

  return (
    <div className="bg-background min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-foreground font-sans">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-10 transition-colors"
        >
          <BackArrow className="w-3.5 h-3.5 text-primary" />
          <span>{isArabic ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </Link>

        <header className="text-center mb-12">
          <div className="mx-auto mb-5 w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
            {isArabic ? 'الخصوصية وحماية البيانات' : 'Privacy & Data Protection'}
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {isArabic ? 'تاريخ السريان: 9 أكتوبر 2026' : 'Effective date: October 9, 2026'}
          </p>
        </header>

        <div className="bg-card/50 border border-border/70 rounded-2xl p-6 sm:p-10 space-y-9">
          <p className="text-sm sm:text-base leading-8 text-muted-foreground">
            {isArabic
              ? 'توضح سياسة الخصوصية هذه كيفية جمع واستخدام ومشاركة وحماية المعلومات عند استخدام خدمات بناء وإدارة العقارية والتطبيق المرتبط بها.'
              : 'This Privacy Policy explains how Benaa & Edara Real Estate collects, uses, shares, and protects information when you use our website and related application.'}
          </p>

          {policySections.map((section) => (
            <section key={section.title} className="border-t border-border/60 pt-7 first:border-t-0 first:pt-0">
              <h2 className="text-lg sm:text-xl font-bold mb-4">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-muted-foreground mb-3 last:mb-0">
                  {paragraph}
                </p>
              ))}
              {section.items && (
                <ul className={`list-disc space-y-2 text-sm leading-7 text-muted-foreground ${isArabic ? 'pr-5' : 'pl-5'}`}>
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}

          <section className="border-t border-border/60 pt-7">
            <h2 className="text-lg sm:text-xl font-bold mb-4">{isArabic ? 'التواصل معنا' : 'Contact us'}</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {isArabic ? 'للاستفسارات أو طلبات الخصوصية، يرجى التواصل معنا عبر ' : 'For privacy questions or requests, contact us through '}
              <a href="https://rbmc.sa" target="_blank" rel="noreferrer" className="text-primary hover:underline">rbmc.sa</a>
              {isArabic ? '.' : '.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

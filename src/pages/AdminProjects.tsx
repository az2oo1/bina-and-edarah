import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { PlusCircle, Loader2, Trash2, MapPin, ImagePlus, X, Building2 } from 'lucide-react';
import { compressImage } from '../lib/image';

interface Project {
  id: string;
  titleAr: string;
  titleEn: string;
  tier: string;
}

const PREDEFINED_DETAILS = [
  { keyAr: 'الواجهة', keyEn: 'Facade', example: 'نطاق جهة (شمالية، شرقية)' },
  { keyAr: 'عرض الشارع', keyEn: 'Street Width', example: '36م' },
  { keyAr: 'عدد الغرف', keyEn: 'Rooms', example: '5' },
  { keyAr: 'غرف النوم', keyEn: 'Bedrooms', example: '4' },
  { keyAr: 'الصالات', keyEn: 'Halls', example: '2' },
  { keyAr: 'دورات المياه', keyEn: 'Bathrooms', example: '3' },
  { keyAr: 'الدور', keyEn: 'Floor', example: '2' },
  { keyAr: 'مواقف سيارات', keyEn: 'Parking Spaces', example: '2' },
  { keyAr: 'مصاعد', keyEn: 'Elevators', example: '1' },
  { keyAr: 'عدد الوحدات', keyEn: 'Number of Units', example: '4' },
  { keyAr: 'مسطح البناء', keyEn: 'Built Area', example: '300 م²' },
  { keyAr: 'المرحلة', keyEn: 'Phase', example: 'الأولى' },
  { keyAr: 'تاريخ التسليم', keyEn: 'Delivery Date', example: '2025' },
  { keyAr: 'ضمانات', keyEn: 'Warranties', example: '10 سنوات' },
];

const PREDEFINED_FEATURES = [
  { keyAr: 'نظام ذكي', keyEn: 'Smart Home System' },
  { keyAr: 'نادي رياضي', keyEn: 'Gym' },
  { keyAr: 'كاميرات مراقبة', keyEn: 'Security Cameras' },
  { keyAr: 'أمن وحراسة', keyEn: 'Security' },
  { keyAr: 'دخول ذكي', keyEn: 'Smart Access' },
  { keyAr: 'مستودع', keyEn: 'Storage' },
  { keyAr: 'مسبح', keyEn: 'Pool' },
  { keyAr: 'حديقة', keyEn: 'Garden' },
  { keyAr: 'مدخل خاص', keyEn: 'Private Entrance' },
  { keyAr: 'مطبخ راكب', keyEn: 'Kitchen Installed' },
  { keyAr: 'غرفة خادمة', keyEn: 'Maid Room' },
  { keyAr: 'غرفة سائق', keyEn: 'Driver Room' },
  { keyAr: 'ملحق خارجي', keyEn: 'Outdoor Annex' },
  { keyAr: 'تكييف مركزي', keyEn: 'Central AC' },
  { keyAr: 'مكيفات راكبة', keyEn: 'Installed ACs' },
  { keyAr: 'مدخل سيارة', keyEn: 'Car Entrance' },
  { keyAr: 'خزان غاز', keyEn: 'Gas Tank' },
  { keyAr: 'مؤثثة', keyEn: 'Furnished' },
];

export default function AdminProjects() {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    tier: 'OTHER',
    propertyCategory: 'VILLA',
    area: '',
    locationLink: '',
    locationText: '',
    featuresList: [] as {id: string, value: string}[],
    propertyAge: '',
    description: '',
    imageUrls: [] as string[],
    detailsList: [] as {id: string, key: string, value: string}[],
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    let base64Images: string[] = [...formData.imageUrls];
    for (const file of Array.from(files) as File[]) {
      try {
        const base64 = await compressImage(file);
        base64Images.push(base64);
      } catch (err) {
        console.error(err);
      }
    }
    setFormData(prev => ({ ...prev, imageUrls: base64Images }));
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.imageUrls];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, imageUrls: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      features: JSON.stringify(formData.featuresList),
      details: JSON.stringify(formData.detailsList),
      imageUrls: JSON.stringify(formData.imageUrls)
    };

    try {
      const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowAddForm(false);
        setEditingId(null);
        resetForm();
        fetchProjects();
      } else {
        alert('Error saving project');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.deleteConfirm') || 'Are you sure?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      
      setFormData({
        titleAr: data.titleAr,
        titleEn: data.titleEn,
        tier: data.tier || 'OTHER',
        propertyCategory: data.propertyCategory || 'VILLA',
        area: data.area?.toString() || '',
        locationLink: data.locationLink || '',
        locationText: data.locationText || '',
        description: data.description || '',
        propertyAge: data.propertyAge?.toString() || '',
        featuresList: data.features ? JSON.parse(data.features) : [],
        detailsList: data.details ? JSON.parse(data.details) : [],
        imageUrls: data.imageUrls ? JSON.parse(data.imageUrls) : [],
      });
      setEditingId(id);
      setShowAddForm(true);
    } catch (error) {
      console.error(error);
    }
  };

  const addDetail = (key?: string) => {
    setFormData(prev => ({
      ...prev,
      detailsList: [...prev.detailsList, { id: Date.now().toString(), key: key || '', value: '' }]
    }));
  };

  const updateDetail = (id: string, field: 'key' | 'value', val: string) => {
    setFormData(prev => ({
      ...prev,
      detailsList: prev.detailsList.map(d => d.id === id ? { ...d, [field]: val } : d)
    }));
  };

  const removeDetail = (id: string) => {
    setFormData(prev => ({
      ...prev,
      detailsList: prev.detailsList.filter(d => d.id !== id)
    }));
  };

  const addFeature = (value?: string) => {
    setFormData(prev => ({
      ...prev,
      featuresList: [...prev.featuresList, { id: Date.now().toString(), value: value || '' }]
    }));
  };

  const updateFeature = (id: string, val: string) => {
    setFormData(prev => ({
      ...prev,
      featuresList: prev.featuresList.map(f => f.id === id ? { ...f, value: val } : f)
    }));
  };

  const removeFeature = (id: string) => {
    setFormData(prev => ({
      ...prev,
      featuresList: prev.featuresList.filter(f => f.id !== id)
    }));
  };

  const resetForm = () => {
    setFormData({
      titleAr: '', titleEn: '', tier: 'OTHER', propertyCategory: 'VILLA',
      area: '', locationLink: '', locationText: '', description: '',
      propertyAge: '', featuresList: [], imageUrls: [], detailsList: [],
    });
  };

  return (
    <div className="min-h-[500px]">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            {showAddForm ? (editingId ? (language === 'ar' ? 'تعديل مشروع' : 'Edit Project') : (language === 'ar' ? 'إضافة مشروع' : 'Add Project')) : (language === 'ar' ? 'إدارة المشاريع' : 'Manage Projects')}
          </h2>
        </div>
        <button 
          onClick={() => {
            if (showAddForm) {
              setShowAddForm(false);
              setEditingId(null);
              resetForm();
            } else {
              setShowAddForm(true);
            }
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all shadow-md cursor-pointer ${
            showAddForm 
              ? 'btn-secondary text-foreground' 
              : 'btn-primary text-white hover:opacity-90'
          }`}
        >
          {showAddForm ? (
            <>{language === 'ar' ? 'إلغاء' : 'Cancel'}</>
          ) : (
            <><PlusCircle className="w-5 h-5" />{language === 'ar' ? 'إضافة مشروع' : 'Add Project'}</>
          )}
        </button>
      </div>

      {showAddForm ? (
        <form onSubmit={handleSubmit} className="shadcn-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5">{language === 'ar' ? 'المعلومات الأساسية' : 'Basic Info'}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="cn-label mb-2">{t('admin.placeholder.titleAr') || 'Title (Ar)'}</label>
                  <input required type="text" value={formData.titleAr} onChange={(e) => setFormData({...formData, titleAr: e.target.value})} className="cn-input" dir="rtl" />
                </div>
                <div>
                  <label className="cn-label mb-2">{t('admin.placeholder.titleEn') || 'Title (En)'}</label>
                  <input required type="text" value={formData.titleEn} onChange={(e) => setFormData({...formData, titleEn: e.target.value})} className="cn-input" dir="ltr" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="cn-label mb-2">{language === 'ar' ? 'تصنيف المشروع (Tier)' : 'Project Tier'}</label>
                  <select value={formData.tier} onChange={(e) => setFormData({...formData, tier: e.target.value})} className="cn-input">
                    <option value="BIG" className="bg-card text-foreground">{language === 'ar' ? 'مشروع كبير (Big)' : 'Big Project'}</option>
                    <option value="MID" className="bg-card text-foreground">{language === 'ar' ? 'مشروع متوسط (Mid)' : 'Mid Project'}</option>
                    <option value="OTHER" className="bg-card text-foreground">{language === 'ar' ? 'مشاريع أخرى (Other)' : 'Other Projects'}</option>
                  </select>
                </div>
                <div>
                  <label className="cn-label mb-2">{t('admin.placeholder.category') || 'Property Category'}</label>
                  <select value={formData.propertyCategory} onChange={(e) => setFormData({...formData, propertyCategory: e.target.value})} className="cn-input">
                    <option value="VILLA" className="bg-card text-foreground">{t('cat.VILLA') || 'Villa'}</option>
                    <option value="APARTMENT" className="bg-card text-foreground">{t('cat.APARTMENT') || 'Apartment'}</option>
                    <option value="COMPOUND" className="bg-card text-foreground">{t('cat.COMPOUND') || 'Compound'}</option>
                    <option value="TOWER" className="bg-card text-foreground">{t('cat.TOWER') || 'Tower'}</option>
                    <option value="BUILDING" className="bg-card text-foreground">{t('cat.BUILDING') || 'Building'}</option>
                    <option value="MALL" className="bg-card text-foreground">{t('cat.MALL') || 'Mall'}</option>
                    <option value="SHOP" className="bg-card text-foreground">{t('cat.SHOP') || 'Shop'}</option>
                    <option value="OFFICE" className="bg-card text-foreground">{t('cat.OFFICE') || 'Office'}</option>
                    <option value="RESORT" className="bg-card text-foreground">{t('cat.RESORT') || 'Resort'}</option>
                    <option value="HOTEL" className="bg-card text-foreground">{t('cat.HOTEL') || 'Hotel'}</option>
                    <option value="HOSPITAL" className="bg-card text-foreground">{t('cat.HOSPITAL') || 'Hospital'}</option>
                    <option value="WAREHOUSE" className="bg-card text-foreground">{t('cat.WAREHOUSE') || 'Warehouse'}</option>
                    <option value="FARM" className="bg-card text-foreground">{t('cat.FARM') || 'Farm'}</option>
                    <option value="LAND" className="bg-card text-foreground">{t('cat.LAND') || 'Land'}</option>
                    <option value="ROOM" className="bg-card text-foreground">{t('cat.ROOM') || 'Room'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="cn-label mb-2">{language === 'ar' ? 'الوصف (عربي أو إنجليزي)' : 'Description'}</label>
                <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="cn-input min-h-[100px] resize-y" dir="rtl" />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5">{language === 'ar' ? 'الموقع والمساحة' : 'Location & Area'}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="cn-label mb-2">{t('admin.placeholder.area') || 'Area'}</label>
                  <input type="number" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} className="cn-input" />
                </div>
                <div>
                  <label className="cn-label mb-2">{t('admin.placeholder.age') || 'Age'}</label>
                  <input type="number" value={formData.propertyAge} onChange={(e) => setFormData({...formData, propertyAge: e.target.value})} className="cn-input" />
                </div>
              </div>

              <div>
                <label className="cn-label mb-2">{t('admin.placeholder.locationLink') || 'Location Link'}</label>
                <input type="text" value={formData.locationLink} onChange={(e) => setFormData({...formData, locationLink: e.target.value})} className="cn-input" dir="ltr" />
              </div>
              
              <div>
                <label className="cn-label mb-2">{t('admin.placeholder.locationText') || 'Location Text'}</label>
                <input type="text" value={formData.locationText} onChange={(e) => setFormData({...formData, locationText: e.target.value})} className="cn-input" />
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5">{language === 'ar' ? 'الصور' : 'Images'}</h3>
            <div className="border border-dashed border-border rounded-lg p-6 text-center hover:bg-slate-50 transition-colors bg-slate-50/30">
              <label className="cursor-pointer flex flex-col items-center">
                <ImagePlus className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-muted-foreground font-medium mb-2">{language === 'ar' ? 'اضغط لاختيار الصور' : 'Click to select images'}</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            {formData.imageUrls.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
                {formData.imageUrls.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-md border border-border overflow-hidden group shadow-xs">
                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details & Features Container */}
          <div className="mt-8 space-y-8">
            {/* Additional Details (Key-Value) Card */}
            <div className="bg-card/50 border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-2 mb-2">
                  <span className="bg-primary/10 text-primary w-5 h-5 rounded-lg inline-flex items-center justify-center text-xs font-bold">1</span>
                  {language === 'ar' ? 'التفاصيل الإضافية للمشروع (خصائص بقيمة)' : 'Project Additional Details (Key & Value)'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' 
                    ? 'أدخل خصائص محددة بقيمة للمشروع، مثل: (الواجهة: شمالية، الضمانات: 10 سنوات). ملاحظة: عمر العقار موجود في البيانات الأساسية.'
                    : 'Enter specific key-value properties for the project, e.g., (Facade: North, Warranties: 10 Years). Note: Property Age is configured under Basic Information.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 py-2">
                {PREDEFINED_DETAILS.map((d, i) => (
                  <button 
                    key={i} 
                    type="button" 
                    onClick={() => addDetail(language === 'ar' ? d.keyAr : d.keyEn)}
                    className="bg-background border border-border text-foreground px-2.5 py-1 rounded-full text-xs font-medium hover:bg-muted flex items-center gap-1 transition shadow-sm"
                  >
                    + {language === 'ar' ? d.keyAr : d.keyEn}
                  </button>
                ))}
              </div>
              
              <div className="space-y-4">
                {formData.detailsList.length > 0 && (
                  <div className="grid grid-cols-[1fr_2fr_auto] gap-4 px-1 text-xs font-semibold text-muted-foreground">
                    <div>{language === 'ar' ? 'الخاصية / التفصيل' : 'Property / Detail'}</div>
                    <div>{language === 'ar' ? 'القيمة' : 'Value'}</div>
                    <div className="w-10"></div>
                  </div>
                )}
                {formData.detailsList.map((detail, index) => (
                  <div key={detail.id} className="flex gap-4 items-center">
                    <div className="w-1/3">
                      <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'الخاصية (مثال: الواجهة)' : 'Key (e.g. Facade)'} 
                        value={detail.key} 
                        onChange={(e) => updateDetail(detail.id, 'key', e.target.value)} 
                        className="input-field text-sm" 
                      />
                    </div>
                    <div className="flex-1">
                      <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'القيمة (مثال: شمالية)' : 'Value (e.g. North)'} 
                        value={detail.value} 
                        onChange={(e) => updateDetail(detail.id, 'value', e.target.value)} 
                        className="input-field text-sm" 
                      />
                    </div>
                    <button type="button" onClick={() => removeDetail(detail.id)} className="p-2 text-red-500 hover:bg-red-50 rounded border border-border transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2 mt-2">
                  <button type="button" onClick={() => addDetail()} className="btn-outline px-3 h-8 text-xs rounded-md shadow-xs cursor-pointer">
                    + {language === 'ar' ? 'إضافة تفصيل مخصص' : 'Add Custom Detail'}
                  </button>
                </div>
              </div>
            </div>

            {/* Features & Amenities (Single Tags) Card */}
            <div className="bg-card/50 border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-2 mb-2">
                  <span className="bg-primary/10 text-primary w-5 h-5 rounded-lg inline-flex items-center justify-center text-xs font-bold">2</span>
                  {language === 'ar' ? 'المميزات والمرافق للمشروع (نصوص فردية)' : 'Project Features & Amenities (Single Tags)'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' 
                    ? 'أدخل مميزات فردية أو خدمات عامة للمشروع، مثل: (مسبح، نادي رياضي، دخول ذكي، حديقة).' 
                    : 'Enter individual amenities or facilities, e.g., (Pool, Gym, Smart Access, Garden).'}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 py-2">
                {PREDEFINED_FEATURES.map((f, i) => (
                  <button 
                    key={i} 
                    type="button" 
                    onClick={() => addFeature(language === 'ar' ? f.keyAr : f.keyEn)}
                    className="bg-background border border-border text-foreground px-2.5 py-1 rounded-full text-xs font-medium hover:bg-muted flex items-center gap-1 transition shadow-sm"
                  >
                    + {language === 'ar' ? f.keyAr : f.keyEn}
                  </button>
                ))}
              </div>
              
              <div className="space-y-4">
                {formData.featuresList.length > 0 && (
                  <div className="grid grid-cols-[1fr_auto] gap-4 px-1 text-xs font-semibold text-muted-foreground">
                    <div>{language === 'ar' ? 'اسم الميزة' : 'Feature Name'}</div>
                    <div className="w-10"></div>
                  </div>
                )}
                {formData.featuresList.map((feature) => (
                  <div key={feature.id} className="flex gap-4 items-center">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'الميزة (مثال: مسبح)' : 'Feature (e.g. Pool)'} 
                        value={feature.value} 
                        onChange={(e) => updateFeature(feature.id, e.target.value)} 
                        className="input-field text-sm" 
                      />
                    </div>
                    <button type="button" onClick={() => removeFeature(feature.id)} className="p-2 text-red-500 hover:bg-red-50 rounded border border-border transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2 mt-2">
                  <button type="button" onClick={() => addFeature()} className="btn-outline px-3 h-8 text-xs rounded-md shadow-xs cursor-pointer">
                    + {language === 'ar' ? 'إضافة ميزة مخصصة' : 'Add Custom Feature'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t pt-8">
            <button type="submit" disabled={loading} className="btn-primary w-full h-10 text-sm rounded-md shadow-xs cursor-pointer">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (editingId ? (language === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (language === 'ar' ? 'حفظ المشروع' : 'Save Project'))}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fetching ? (
            <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-muted-foreground" /></div>
          ) : projects.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted-foreground bg-card rounded-3xl border border-dashed border-border shadow-xs">
              {language === 'ar' ? 'لا توجد مشاريع مضافة' : 'No projects added yet'}
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="shadcn-card group overflow-hidden block flex flex-col hover:shadow-sm transition-shadow">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-sm text-foreground mb-1" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        {language === 'ar' ? project.titleAr : project.titleEn}
                      </h3>
                      <span className="inline-flex bg-primary/10 text-primary border border-primary/20 text-[10px] px-2 py-0.5 rounded font-semibold">
                         {project.tier === 'BIG' ? (language === 'ar' ? 'مشروع كبير' : 'Big Project') : project.tier === 'MID' ? (language === 'ar' ? 'مشروع متوسط' : 'Mid Project') : (language === 'ar' ? 'مشاريع أخرى' : 'Other Projects')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-muted/40 border-t border-border flex justify-between items-center">
                  <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-600 p-2 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleEdit(project.id)} className="btn-primary px-3 h-8 text-xs rounded-md shadow-xs cursor-pointer">
                    {language === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

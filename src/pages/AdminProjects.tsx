import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { PlusCircle, Loader2, Trash2, MapPin, ImagePlus, X, Building2 } from 'lucide-react';

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
  { keyAr: 'عمر العقار', keyEn: 'Property Age', example: 'جديد / 5 سنوات' },
  { keyAr: 'مواقف سيارات', keyEn: 'Parking Spaces', example: '2' },
  { keyAr: 'مصاعد', keyEn: 'Elevators', example: '1' },
  { keyAr: 'عدد الوحدات', keyEn: 'Number of Units', example: '4' },
  { keyAr: 'مسطح البناء', keyEn: 'Built Area', example: '300 م²' },
  { keyAr: 'المرحلة', keyEn: 'Phase', example: 'الأولى' },
  { keyAr: 'تاريخ التسليم', keyEn: 'Delivery Date', example: '2025' },
  { keyAr: 'ضمانات', keyEn: 'Warranties', example: '10 سنوات' },
];

const PREDEFINED_FEATURES = [
  { keyAr: 'مسبح', keyEn: 'Pool' },
  { keyAr: 'حديقة', keyEn: 'Garden' },
  { keyAr: 'غرفة خادمة', keyEn: 'Maid Room' },
  { keyAr: 'غرفة سائق', keyEn: 'Driver Room' },
  { keyAr: 'ملحق خارجي', keyEn: 'Outdoor Annex' },
  { keyAr: 'تكييف مركزي', keyEn: 'Central AC' },
  { keyAr: 'مدخل سيارة', keyEn: 'Car Entrance' },
  { keyAr: 'مستودع', keyEn: 'Storage' },
  { keyAr: 'نظام ذكي', keyEn: 'Smart Home System' },
  { keyAr: 'نادي رياضي', keyEn: 'Gym' },
  { keyAr: 'كاميرات مراقبة', keyEn: 'Security Cameras' },
  { keyAr: 'أمن وحراسة', keyEn: 'Security' },
  { keyAr: 'دخول ذكي', keyEn: 'Smart Access' },
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    let base64Images: string[] = [...formData.imageUrls];
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          base64Images.push(event.target.result);
          setFormData(prev => ({ ...prev, imageUrls: [...base64Images] }));
        }
      };
      reader.readAsDataURL(file);
    });
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
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-yellow-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
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
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-md ${
            showAddForm 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-black text-white hover:bg-gray-800'
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
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold border-b pb-2">{language === 'ar' ? 'المعلومات الأساسية' : 'Basic Info'}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.titleAr') || 'Title (Ar)'}</label>
                  <input required type="text" value={formData.titleAr} onChange={(e) => setFormData({...formData, titleAr: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500" dir="rtl" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.titleEn') || 'Title (En)'}</label>
                  <input required type="text" value={formData.titleEn} onChange={(e) => setFormData({...formData, titleEn: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500" dir="ltr" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{language === 'ar' ? 'تصنيف المشروع (Tier)' : 'Project Tier'}</label>
                  <select value={formData.tier} onChange={(e) => setFormData({...formData, tier: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 bg-white">
                    <option value="BIG">{language === 'ar' ? 'مشروع كبير (Big)' : 'Big Project'}</option>
                    <option value="MID">{language === 'ar' ? 'مشروع متوسط (Mid)' : 'Mid Project'}</option>
                    <option value="OTHER">{language === 'ar' ? 'مشاريع أخرى (Other)' : 'Other Projects'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.category') || 'Property Category'}</label>
                  <select value={formData.propertyCategory} onChange={(e) => setFormData({...formData, propertyCategory: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 bg-white">
                    <option value="VILLA">{t('cat.VILLA') || 'Villa'}</option>
                    <option value="APARTMENT">{t('cat.APARTMENT') || 'Apartment'}</option>
                    <option value="COMPOUND">{t('cat.COMPOUND') || 'Compound'}</option>
                    <option value="TOWER">{t('cat.TOWER') || 'Tower'}</option>
                    <option value="BUILDING">{t('cat.BUILDING') || 'Building'}</option>
                    <option value="MALL">{t('cat.MALL') || 'Mall'}</option>
                    <option value="SHOP">{t('cat.SHOP') || 'Shop'}</option>
                    <option value="OFFICE">{t('cat.OFFICE') || 'Office'}</option>
                    <option value="RESORT">{t('cat.RESORT') || 'Resort'}</option>
                    <option value="HOTEL">{t('cat.HOTEL') || 'Hotel'}</option>
                    <option value="HOSPITAL">{t('cat.HOSPITAL') || 'Hospital'}</option>
                    <option value="WAREHOUSE">{t('cat.WAREHOUSE') || 'Warehouse'}</option>
                    <option value="FARM">{t('cat.FARM') || 'Farm'}</option>
                    <option value="LAND">{t('cat.LAND') || 'Land'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{language === 'ar' ? 'الوصف (عربي أو إنجليزي)' : 'Description'}</label>
                <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3" dir="rtl" />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold border-b pb-2">{language === 'ar' ? 'الموقع والمساحة' : 'Location & Area'}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.area') || 'Area'}</label>
                  <input type="number" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.age') || 'Age'}</label>
                  <input type="number" value={formData.propertyAge} onChange={(e) => setFormData({...formData, propertyAge: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.locationLink') || 'Location Link'}</label>
                <input type="url" value={formData.locationLink} onChange={(e) => setFormData({...formData, locationLink: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3" dir="ltr" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.locationText') || 'Location Text'}</label>
                <input type="text" value={formData.locationText} onChange={(e) => setFormData({...formData, locationText: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3" />
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-bold border-b pb-2">{language === 'ar' ? 'الصور' : 'Images'}</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors">
              <label className="cursor-pointer flex flex-col items-center">
                <ImagePlus className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-gray-600 font-medium mb-2">{language === 'ar' ? 'اضغط لاختيار الصور' : 'Click to select images'}</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            {formData.imageUrls.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
                {formData.imageUrls.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-bold border-b pb-2">{language === 'ar' ? 'التفاصيل الإضافية (مثل: عدد الغرف، الواجهة)' : 'Additional Details (e.g., Rooms, Facade)'}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {PREDEFINED_DETAILS.map((d, i) => (
                <button 
                  key={i} 
                  type="button" 
                  onClick={() => addDetail(language === 'ar' ? d.keyAr : d.keyEn)}
                  className="bg-yellow-50 text-yellow-800 hover:bg-yellow-100 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border border-yellow-200"
                >
                  + {language === 'ar' ? d.keyAr : d.keyEn}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {formData.detailsList.map((detail, index) => (
                <div key={detail.id} className="flex gap-4 items-center">
                  <div className="w-1/3">
                    <input type="text" placeholder={language === 'ar' ? 'الخاصية (مثال: عدد الغرف)' : 'Key (e.g. Rooms)'} value={detail.key} onChange={(e) => updateDetail(detail.id, 'key', e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 outline-none" />
                  </div>
                  <div className="flex-1">
                    <input type="text" placeholder={language === 'ar' ? 'القيمة (مثال: 5)' : 'Value (e.g. 5)'} value={detail.value} onChange={(e) => updateDetail(detail.id, 'value', e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 outline-none" />
                  </div>
                  <button type="button" onClick={() => removeDetail(detail.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 mt-4">
                <button type="button" onClick={() => addDetail()} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold transition-colors">
                  + {language === 'ar' ? 'إضافة تفصيل مخصص' : 'Add Custom Detail'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-bold border-b pb-2">{language === 'ar' ? 'المميزات والمرافق (مثل: مسبح، حديقة)' : 'Features & Facilities (e.g., Pool, Garden)'}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {PREDEFINED_FEATURES.map((f, i) => (
                <button 
                  key={i} 
                  type="button" 
                  onClick={() => addFeature(language === 'ar' ? f.keyAr : f.keyEn)}
                  className="bg-green-50 text-green-800 hover:bg-green-100 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border border-green-200"
                >
                  + {language === 'ar' ? f.keyAr : f.keyEn}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {formData.featuresList.map((feature) => (
                <div key={feature.id} className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input type="text" placeholder={language === 'ar' ? 'الميزة (مثال: مسبح)' : 'Feature (e.g. Pool)'} value={feature.value} onChange={(e) => updateFeature(feature.id, e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <button type="button" onClick={() => removeFeature(feature.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 mt-4">
                <button type="button" onClick={() => addFeature()} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold transition-colors">
                  + {language === 'ar' ? 'إضافة ميزة مخصصة' : 'Add Custom Feature'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t pt-8">
            <button type="submit" disabled={loading} className="w-full bg-black text-white font-bold py-4 px-4 rounded-xl hover:bg-gray-900 transition-all flex justify-center items-center gap-2 text-lg shadow-lg">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (editingId ? (language === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (language === 'ar' ? 'حفظ المشروع' : 'Save Project'))}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fetching ? (
            <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-gray-400" /></div>
          ) : projects.length === 0 ? (
            <div className="col-span-full py-20 text-center text-gray-500 bg-white rounded-3xl border border-dashed border-gray-300">
              {language === 'ar' ? 'لا توجد مشاريع مضافة' : 'No projects added yet'}
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="bg-white border text-left border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-xl text-gray-900 mb-1" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        {language === 'ar' ? project.titleAr : project.titleEn}
                      </h3>
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold">
                         {project.tier === 'BIG' ? (language === 'ar' ? 'مشروع كبير' : 'Big Project') : project.tier === 'MID' ? (language === 'ar' ? 'مشروع متوسط' : 'Mid Project') : (language === 'ar' ? 'مشاريع أخرى' : 'Other Projects')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                  <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleEdit(project.id)} className="bg-black text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors">
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

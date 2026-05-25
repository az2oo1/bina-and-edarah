import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router';

interface Project {
  id: string;
  titleAr: string;
  titleEn: string;
  tier: string;
  description: string;
  imageUrls: string; // JSON
}

export default function Projects() {
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const bigProjects = projects.filter(p => p.tier === 'BIG');
  const midProjects = projects.filter(p => p.tier === 'MID');
  const otherProjects = projects.filter(p => p.tier === 'OTHER');

  const getFirstImage = (imageUrlsStr: string) => {
    try {
      const urls = JSON.parse(imageUrlsStr || '[]');
      return urls.length > 0 ? urls[0] : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop';
    } catch {
      return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop';
    }
  };

  const renderProjectSection = (title: string, data: Project[]) => {
    if (data.length === 0) return null;
    return (
      <div className="mb-20">
        <h2 className="text-3xl font-black mb-8 border-b pb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((project) => (
            <Link to={`/projects/${project.id}`} key={project.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={getFirstImage(project.imageUrls)} 
                  alt={language === 'ar' ? project.titleAr : project.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{language === 'ar' ? project.titleAr : project.titleEn}</h3>
                <p className="text-gray-600 leading-relaxed text-lg line-clamp-3">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="bg-black text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
            alt="Cityscape Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            {t('nav.projects')}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {language === 'ar' 
              ? 'مجموعة من أبرز المشاريع التي قمنا بتطويرها وإدارتها لتشكل علامة فارقة في السوق العقاري.' 
              : 'A collection of the most prominent projects we have developed and managed to set a benchmark in the real estate market.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-xl font-medium">
            {language === 'ar' ? 'لا توجد مشاريع مضافة حالياً' : 'No projects available currently'}
          </div>
        ) : (
          <>
            {renderProjectSection(language === 'ar' ? 'مشاريع كبرى' : 'Big Projects', bigProjects)}
            {renderProjectSection(language === 'ar' ? 'مشاريع متوسطة' : 'Mid Projects', midProjects)}
            {renderProjectSection(language === 'ar' ? 'مشاريع أخرى' : 'Other Projects', otherProjects)}
          </>
        )}
      </div>
    </div>
  );
}


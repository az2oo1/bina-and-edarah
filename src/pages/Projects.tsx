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
        setProjects(Array.isArray(data) ? data : []);
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
      <div className="mb-16">
        <h2 className="text-xl font-bold mb-6 border-b border-border pb-3 text-foreground tracking-tight">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((project) => (
            <Link to={`/projects/${project.id}`} key={project.id} className="shadcn-card hover:shadow-md transition-all duration-200 group flex flex-col overflow-hidden">
              <div className="relative h-48 overflow-hidden bg-muted">
                <img 
                  src={getFirstImage(project.imageUrls)} 
                  alt={language === 'ar' ? project.titleAr : project.titleEn}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-grow">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">{language === 'ar' ? project.titleAr : project.titleEn}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      <div className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
            alt="Cityscape Background"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl font-extrabold mb-4 tracking-tight">
            {t('nav.projects')}
          </h1>
          <p className="text-sm text-slate-200 max-w-2xl mx-auto leading-relaxed">
            {language === 'ar' 
              ? 'مجموعة من أبرز المشاريع التي قمنا بتطويرها وإدارتها لتشكل علامة فارقة في السوق العقاري.' 
              : 'A collection of the most prominent projects we have developed and managed to set a benchmark in the real estate market.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm font-medium">
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


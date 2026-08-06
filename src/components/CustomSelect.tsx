import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = '-- اختر --',
  className = '',
  disabled = false,
  searchable = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = searchable && searchTerm.trim() !== ''
    ? options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()) || (opt.sublabel && opt.sublabel.toLowerCase().includes(searchTerm.toLowerCase())))
    : options;

  return (
    <div className={`relative inline-block w-full text-right ${className}`} ref={containerRef} dir="rtl">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`custom-select-trigger w-full bg-background border border-border hover:border-primary/60 rounded-xl px-3.5 py-2.5 text-xs font-bold text-foreground flex items-center justify-between gap-2 outline-none transition-all shadow-xs ${
          isOpen ? 'is-open' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : <span className="text-muted-foreground">{placeholder}</span>}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 left-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg p-1 max-h-60 overflow-y-auto custom-scrollbar space-y-0.5 animate-in fade-in-50 zoom-in-95">
          {searchable && (
            <div className="p-1 mb-1 border-b border-border/60 sticky top-0 bg-card z-10">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="بحث..."
                  className="w-full bg-muted/40 border border-border/50 rounded-lg pr-8 pl-2 py-1.5 text-xs font-bold outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {filteredOptions.length === 0 ? (
            <div className="p-3 text-center text-xs font-bold text-muted-foreground">
              لا توجد خيارات متاحة
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    buttonRef.current?.blur();
                  }}
                  className={`w-full text-right px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-primary/10 text-primary font-extrabold'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <div className="flex flex-col truncate">
                    <span>{opt.label}</span>
                    {opt.sublabel && <span className="text-[10px] text-muted-foreground">{opt.sublabel}</span>}
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Button, ButtonVariant } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, Download, Send, Sparkles } from 'lucide-react';

export const ButtonShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'pairs' | 'sizes'>('matrix');
  const [clickedAction, setClickedAction] = useState<string | null>(null);

  const handleButtonClick = (actionName: string) => {
    setClickedAction(actionName);
    setTimeout(() => setClickedAction(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 text-slate-900 dark:text-slate-100">
      {/* Header section matching Image 1 title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Design System Template
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Button States vs Button Styles
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Unified app-wide button component system inspired by NN/g state guidelines and modern rounded pill aesthetics.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200 dark:border-slate-700 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${activeTab === 'matrix' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            States Matrix (NN/g)
          </button>
          <button
            onClick={() => setActiveTab('pairs')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${activeTab === 'pairs' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Action Button Groups
          </button>
          <button
            onClick={() => setActiveTab('sizes')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${activeTab === 'sizes' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Sizes & Icons
          </button>
        </div>
      </div>

      {clickedAction && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-xl flex items-center justify-between animate-fade-in">
          <span>Triggered button action: <strong>{clickedAction}</strong></span>
          <Check className="w-4 h-4" />
        </div>
      )}

      {/* Tab 1: Image 1 Matrix Template */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80">
                  <th className="p-4 font-bold text-xs text-slate-500 uppercase tracking-wider w-40">Style / State</th>
                  <th className="p-4 font-bold text-xs text-slate-700 dark:text-slate-300 text-center">Enabled</th>
                  <th className="p-4 font-bold text-xs text-slate-700 dark:text-slate-300 text-center">Focus</th>
                  <th className="p-4 font-bold text-xs text-slate-700 dark:text-slate-300 text-center">Hover</th>
                  <th className="p-4 font-bold text-xs text-slate-700 dark:text-slate-300 text-center">Disabled</th>
                  <th className="p-4 font-bold text-xs text-slate-700 dark:text-slate-300 text-center">Loading</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {/* Primary Style */}
                <tr className="hover:bg-slate-100/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-semibold text-xs text-slate-700 dark:text-slate-300">
                    Primary Style
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="primary" onClick={() => handleButtonClick('Primary Enabled')}>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="primary" isFocusedState onClick={() => handleButtonClick('Primary Focus')}>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="primary" isHoveredState onClick={() => handleButtonClick('Primary Hover')}>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="primary" disabled>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="primary" isLoading>Label</Button>
                  </td>
                </tr>

                {/* Secondary Style (Matching Image 2 right button) */}
                <tr className="hover:bg-slate-100/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-semibold text-xs text-slate-700 dark:text-slate-300">
                    Secondary Style
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="secondary" onClick={() => handleButtonClick('Secondary Enabled')}>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="secondary" isFocusedState onClick={() => handleButtonClick('Secondary Focus')}>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="secondary" isHoveredState onClick={() => handleButtonClick('Secondary Hover')}>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="secondary" disabled>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="secondary" isLoading>Label</Button>
                  </td>
                </tr>

                {/* Tertiary Style */}
                <tr className="hover:bg-slate-100/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-semibold text-xs text-slate-700 dark:text-slate-300">
                    Tertiary Style
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="tertiary" onClick={() => handleButtonClick('Tertiary Enabled')}>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="tertiary" isFocusedState onClick={() => handleButtonClick('Tertiary Focus')}>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="tertiary" isHoveredState onClick={() => handleButtonClick('Tertiary Hover')}>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="tertiary" disabled>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="tertiary" isLoading>Label</Button>
                  </td>
                </tr>

                {/* Outline Style */}
                <tr className="hover:bg-slate-100/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-semibold text-xs text-slate-700 dark:text-slate-300">
                    Outline Style
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="outline" onClick={() => handleButtonClick('Outline Enabled')}>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="outline" isFocusedState onClick={() => handleButtonClick('Outline Focus')}>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="outline" isHoveredState onClick={() => handleButtonClick('Outline Hover')}>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="outline" disabled>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="outline" isLoading>Label</Button>
                  </td>
                </tr>

                {/* Destructive Style */}
                <tr className="hover:bg-slate-100/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-semibold text-xs text-slate-700 dark:text-slate-300">
                    Destructive Style
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="destructive" onClick={() => handleButtonClick('Destructive Enabled')}>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="destructive" isFocusedState onClick={() => handleButtonClick('Destructive Focus')}>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="destructive" isHoveredState onClick={() => handleButtonClick('Destructive Hover')}>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="destructive" disabled>Label</Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="destructive" isLoading>Label</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Image 2 Action Button Groups */}
      {activeTab === 'pairs' && (
        <div className="space-y-8">
          {/* Reference Image 2 exact replica */}
          <div className="p-6 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/20 space-y-4">
            <div className="flex items-center justify-between border-b border-blue-100 dark:border-blue-900/40 pb-3">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Reference Image 2 Template (Primary + Secondary Arabic Pair)
              </span>
              <span className="text-xs text-slate-400">RTL Action Pair</span>
            </div>

            <div className="flex items-center justify-center p-8 bg-white dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm" dir="rtl">
              <ButtonGroup align="start" gap="md">
                <Button 
                  variant="primary" 
                  size="md" 
                  startIcon={<ArrowLeft className="w-4 h-4" />}
                  onClick={() => handleButtonClick('التالي (Next)')}
                >
                  التالي
                </Button>
                <Button 
                  variant="secondary" 
                  size="md"
                  onClick={() => handleButtonClick('إلغاء (Cancel)')}
                >
                  إلغاء
                </Button>
              </ButtonGroup>
            </div>
          </div>

          {/* Form Action Dialog Pair */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Standard Dialog & Modal Footers
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English Pair */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3">
                <span className="text-xs text-slate-500 font-medium">LTR Standard Actions</span>
                <ButtonGroup align="end" gap="sm">
                  <Button variant="secondary" onClick={() => handleButtonClick('Cancel')}>Cancel</Button>
                  <Button variant="primary" startIcon={<Send className="w-4 h-4" />} onClick={() => handleButtonClick('Submit')}>Submit</Button>
                </ButtonGroup>
              </div>

              {/* Destructive Pair */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3">
                <span className="text-xs text-slate-500 font-medium">Destructive Confirmation</span>
                <ButtonGroup align="end" gap="sm">
                  <Button variant="secondary" onClick={() => handleButtonClick('Cancel Delete')}>Keep Record</Button>
                  <Button variant="destructive" startIcon={<Trash2 className="w-4 h-4" />} onClick={() => handleButtonClick('Confirm Delete')}>Delete Item</Button>
                </ButtonGroup>
              </div>
            </div>
          </div>

          {/* Segmented Button Group */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Segmented View Switcher Group
            </h3>

            <div className="flex justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <ButtonGroup segmented align="center">
                <Button variant="primary" size="sm">Active View</Button>
                <Button variant="ghost" size="sm">Pending</Button>
                <Button variant="ghost" size="sm">Archived</Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Sizes & Icons */}
      {activeTab === 'sizes' && (
        <div className="space-y-8">
          {/* Sizes */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Button Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm" variant="primary" startIcon={<Plus className="w-3.5 h-3.5" />}>Small (32px)</Button>
              <Button size="md" variant="primary" startIcon={<Plus className="w-4 h-4" />}>Medium (40px)</Button>
              <Button size="lg" variant="primary" startIcon={<Plus className="w-5 h-5" />}>Large (48px)</Button>
            </div>
          </div>

          {/* Icon Position Variations */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Icon Combinations</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" startIcon={<Download className="w-4 h-4" />}>Download Report</Button>
              <Button variant="secondary" endIcon={<ArrowRight className="w-4 h-4" />}>Continue Next</Button>
              <Button variant="outline" startIcon={<Sparkles className="w-4 h-4" />}>AI Generate</Button>
              <Button variant="destructive" startIcon={<Trash2 className="w-4 h-4" />}>Remove</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

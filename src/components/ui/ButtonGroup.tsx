import React from 'react';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  align?: 'start' | 'center' | 'end' | 'between' | 'stretch';
  gap?: 'sm' | 'md' | 'lg' | 'none';
  segmented?: boolean;
  fullWidth?: boolean;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  align = 'end',
  gap = 'md',
  segmented = false,
  fullWidth = false,
  className = '',
  ...props
}) => {

  const orientationStyles = orientation === 'horizontal' ? 'flex-row' : 'flex-col';

  const alignStyles: Record<string, string> = {
    start: 'justify-start items-center',
    center: 'justify-center items-center',
    end: 'justify-end items-center',
    between: 'justify-between items-center',
    stretch: 'items-stretch w-full'
  };

  const gapStyles: Record<string, string> = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  };

  const widthStyle = fullWidth ? 'w-full' : '';
  const alignClass = alignStyles[align] || alignStyles.end;
  const gapClass = gapStyles[gap] || gapStyles.md;
  const safeClassName = typeof className === 'string' ? className : '';

  return (
    <div
      className={`
        flex flex-wrap ${orientationStyles}
        ${alignClass}
        ${segmented ? 'gap-0 rounded-full shadow-xs border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100/60 dark:bg-slate-800/60 overflow-hidden' : gapClass}
        ${widthStyle}
        ${safeClassName}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
    </div>
  );
};

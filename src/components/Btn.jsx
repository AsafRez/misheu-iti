import React from 'react';

export default function Btn({
  children,
  onClick,
  variant = 'blue', // 'blue' | 'green' | 'clay' | 'outline' | 'card' | 'ghost'
  size = 'normal', // 'normal' | 'huge'
  className = '',
  type = 'button',
  disabled = false,
  ariaLabel,
  ariaPressed,
  ariaExpanded,
  ariaControls,
  ...rest
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold rounded-3xl transition-all duration-200 select-none cursor-pointer focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] text-center px-6 py-4';

  const sizeStyles =
    size === 'huge'
      ? 'min-h-[100px] text-[26px] leading-tight w-full justify-start gap-5'
      : 'min-h-[64px] text-[22px] md:text-[24px] leading-snug';

  let variantStyles = '';
  switch (variant) {
    case 'green':
      variantStyles = 'bg-appGreen text-white hover:brightness-110 active:brightness-95';
      break;
    case 'clay':
      variantStyles = 'bg-appClay text-white hover:brightness-110 active:brightness-95';
      break;
    case 'blue':
      variantStyles = 'bg-appBlue text-white hover:brightness-110 active:brightness-95';
      break;
    case 'outline':
      variantStyles =
        'bg-appCard text-appInk border-2 border-appLine hover:border-appBlue hover:bg-slate-50 dark:hover:bg-slate-800';
      break;
    case 'card':
      variantStyles =
        'bg-appCard text-appInk border border-appLine hover:border-appGreen shadow-md';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent text-appInk border border-appLine hover:bg-black/5 dark:hover:bg-white/5';
      break;
    default:
      variantStyles = 'bg-appBlue text-white';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

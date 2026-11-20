import React from 'react';

export default function Card({ children, className = '', as = 'div', ...props }) {
  const Component = as;
  return (
    <Component
      className={`bg-appCard text-appInk rounded-3xl border border-appLine shadow-md p-6 md:p-8 backdrop-blur-none ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

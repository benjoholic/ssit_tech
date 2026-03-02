import React from 'react';

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface GradientOutlineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  hideArrow?: boolean;
}

const GradientOutlineButton = ({ children, hideArrow = false, ...props }: GradientOutlineButtonProps) => (
  <button {...props} className="gradient-outline-btn flex items-center relative overflow-hidden px-4 py-2 rounded-full border-2 border-blue-500 text-white font-semibold transition-all duration-300 group bg-transparent">
    <span className="flex items-center">
      {!hideArrow && (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:translate-x-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
        </svg>
      )}
      <span>{children}</span>
    </span>
    <style jsx>{`
      .gradient-outline-btn {
        background: transparent;
        position: relative;
        z-index: 1;
      }
      .gradient-outline-btn:before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 9999px;
        background: linear-gradient(90deg, #3654ff 0%, #4f8cff 100%);
        opacity: 0;
        z-index: -1;
        transition: opacity 0.3s;
      }
      .gradient-outline-btn:hover:before {
        opacity: 0.15;
      }
      .gradient-outline-btn:hover {
        background: #3654ff;
        border-color: #3654ff;
        color: #fff;
      }
    `}</style>
  </button>
);

export default GradientOutlineButton;

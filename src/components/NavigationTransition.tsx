
import { ReactNode } from 'react';

interface NavigationTransitionProps {
  children: ReactNode;
  isVisible: boolean;
  direction?: 'slide-right' | 'slide-left' | 'fade' | 'scale';
}

const NavigationTransition = ({ 
  children, 
  isVisible, 
  direction = 'fade' 
}: NavigationTransitionProps) => {
  const getTransitionClasses = () => {
    const baseClasses = "transition-all duration-150 ease-out transform-gpu";
    
    switch (direction) {
      case 'slide-right':
        return `${baseClasses} ${
          isVisible 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-8 opacity-0 scale-98'
        }`;
      case 'slide-left':
        return `${baseClasses} ${
          isVisible 
            ? 'translate-x-0 opacity-100 scale-100' 
            : '-translate-x-8 opacity-0 scale-98'
        }`;
      case 'scale':
        return `${baseClasses} ${
          isVisible 
            ? 'scale-100 opacity-100' 
            : 'scale-96 opacity-0'
        }`;
      default: // fade
        return `${baseClasses} ${
          isVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-1 scale-99'
        }`;
    }
  };

  return (
    <div className={`${getTransitionClasses()} will-change-transform`}>
      {children}
    </div>
  );
};

export default NavigationTransition;

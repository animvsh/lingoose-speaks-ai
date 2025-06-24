
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
    const baseClasses = "transition-all duration-300 ease-in-out";
    
    switch (direction) {
      case 'slide-right':
        return `${baseClasses} ${
          isVisible 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-full opacity-0'
        }`;
      case 'slide-left':
        return `${baseClasses} ${
          isVisible 
            ? 'translate-x-0 opacity-100' 
            : '-translate-x-full opacity-0'
        }`;
      case 'scale':
        return `${baseClasses} ${
          isVisible 
            ? 'scale-100 opacity-100' 
            : 'scale-95 opacity-0'
        }`;
      default: // fade
        return `${baseClasses} ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-2'
        }`;
    }
  };

  return (
    <div className={getTransitionClasses()}>
      {children}
    </div>
  );
};

export default NavigationTransition;

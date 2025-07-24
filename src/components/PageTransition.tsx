import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  isTransitioning: boolean;
  transitionKey: string;
}

const PageTransition = ({ 
  children, 
  isTransitioning, 
  transitionKey 
}: PageTransitionProps) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isTransitioning) {
      // Start fade out
      setIsVisible(false);
      
      // After fade out completes, update content and fade in
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsVisible(true);
      }, 150);

      return () => clearTimeout(timer);
    } else {
      setDisplayChildren(children);
      setIsVisible(true);
    }
  }, [children, isTransitioning, transitionKey]);

  return (
    <div 
      className={`transition-all duration-300 ease-in-out transform ${
        isVisible && !isTransitioning
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 translate-y-2'
      }`}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
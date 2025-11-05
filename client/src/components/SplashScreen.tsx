import { useEffect, useState } from 'react';
import splashLogo from '@assets/splash-logo.png';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1f25] transition-opacity duration-500"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <img
        src={splashLogo}
        alt="calcula.AI"
        className="w-64 h-auto animate-pulse"
      />
    </div>
  );
}

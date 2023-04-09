import { FC } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { useState, useEffect } from 'react';
import { themeColor } from '@/redux/slices/vendorSlice';
import { ArrowUpwardOutlined } from '@mui/icons-material';

const ScrollToTopButton: FC = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    locale: { isRTL }
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 100); 
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div
        className={`${!isRTL ? `left-0` : `right-0`}`}
      >
      <button
        className={`fixed bottom-4 right-4 z-50 bg-white py-2 px-2 h-12 w-12 rounded-full transition-opacity duration-300 ${
          isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={scrollToTop}
      >
        <ArrowUpwardOutlined style={{ color }} />
      </button>
    </div>
  );
};

export default ScrollToTopButton;

import { FC, Suspense, useEffect, useState } from 'react';
import BackBtn from '@/components/BackBtn';
import { useRouter } from 'next/router';
import SlideTopNav from '@/components/home/SlideTopNav';
import LoadingSpinner from '@/components/LoadingSpinner';
import { debounce } from 'lodash';

const AppHeader: FC = () => {
  const [offset, setOffset] = useState(0);
  const router = useRouter();
  const [isHome, setIsHome] = useState(
    router.pathname === '/' || router.pathname === '/home'
  );

  useEffect(() => {
    const onScroll = () => setOffset(window.pageYOffset);
    // const handleMouseUp = () => console.log('up');
    window.addEventListener('scroll', onScroll, { passive: true });
    // window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('scroll', debounce(onScroll, 400));
      // window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [router.pathname]);

  return (
    <Suspense fallback={<LoadingSpinner fullWidth={false} />}>
      <header
        className={`${offset <= 80 ? `bg-white` : `bg-transparent`} ${
          isHome ? `bg-transparent` : `bg-white`
        } relative sticky top-0 z-50 flex flex-col justify-start items-center w-full scroll-smooth`}
      >
        {router.asPath === '/' ||
          (!router.asPath.includes('/home') && (
            <BackBtn backHome={false} offset={offset} />
          ))}
        <SlideTopNav offset={offset} isHome={isHome} />
      </header>
    </Suspense>
  );
};

export default AppHeader;

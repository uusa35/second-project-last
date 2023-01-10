import { FC, Suspense, useEffect, useState } from 'react';
import BackBtn from '@/components/BackBtn';
import { useRouter } from 'next/router';
import SlideTopNav from '@/components/home/SlideTopNav';
import LoadingSpinner from '@/components/LoadingSpinner';

const AppHeader: FC = () => {
  const [offset, setOffset] = useState(0);
  const router = useRouter();
  const [isHome, setIsHome] = useState(
    router.pathname === '/' || router.pathname === '/home'
  );

  useEffect(() => {
    const onScroll = () => setOffset(window.pageYOffset);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [router.pathname]);

  console.log('router', router.pathname);

  return (
    <Suspense fallback={<LoadingSpinner fullWidth={false} />}>
      <header
        className={`${
          offset <= 80 ? `bg-white` : `bg-transparent`
        } relative sticky top-0 z-50 flex flex-col justify-start items-center w-full scroll-smooth`}
      >
        {router.asPath === '/' ||
          (!router.asPath.includes('/home') && (
            <BackBtn backHome={false} offset={offset} />
          ))}
        <SlideTopNav offset={isHome ? 100 : offset} />
      </header>
    </Suspense>
  );
};

export default AppHeader;

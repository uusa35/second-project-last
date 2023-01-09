import { FC, Suspense, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isAuthenticated } from '@/redux/slices/authSlice';
import dynamic from 'next/dynamic';
import SideMenuSkelton from '@/components/sideMenu/SideMenuSkelton';
import BackBtn from '@/components/BackBtn';
import { useRouter } from 'next/router';
import SlideTopNav from '@/components/home/SlideTopNav';
import { isEqual } from 'lodash';
import LoadingSpinner from '@/components/LoadingSpinner';

const AppHeader: FC = () => {
  const {
    locale: { lang },
    appSetting: { sideMenuOpen },
    country: {
      id: country_id,
      name: country_name,
      name_ar: country_name_ar,
      currency: country_currency,
    },
    auth: {
      user: { avatar, name, id: user_id },
    },
  } = useAppSelector((state) => state);
  const [offset, setOffset] = useState(0);
  const isAuth = useAppSelector(isAuthenticated);
  const { locale } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setOffset(window.pageYOffset);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [router.pathname]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <header
        className={`${
          offset <= 80 ? `bg-white` : `bg-transparent`
        } relative sticky top-0 z-50 flex flex-col justify-start items-center w-full scroll-smooth`}
      >
        {router.asPath === '/' ||
          (!router.asPath.includes('/home') && (
            <BackBtn backHome={false} offset={offset} />
          ))}
        <SlideTopNav offset={offset} />
      </header>
    </Suspense>
  );
};

export default AppHeader;

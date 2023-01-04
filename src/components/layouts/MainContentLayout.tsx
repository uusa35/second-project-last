import { FC, ReactNode, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
const BackBtn = dynamic(() => import(`@/components/BackBtn`), {
  ssr: false,
});
import { useAppSelector } from '@/redux/hooks';
import { setApiCountry } from '@/constants/*';
const AppHeader = dynamic(() => import(`@/components/AppHeader`), {
  ssr: false,
});
const AppFooter = dynamic(() => import(`@/components/AppFooter`), {
  ssr: false,
});
const SideMenu = dynamic(() => import(`@/components/sideMenu`), {
  ssr: false,
});

type Props = {
  children: ReactNode | undefined;
  backHome?: boolean;
  hideBack?: boolean;
  showMotion?: boolean;
  backRoute?: string | null;
};

const MainContentLayout: FC<Props> = ({
  children,
  backHome = false,
  hideBack = false,
  backRoute = null,
  showMotion = true,
}): JSX.Element => {
  const {
    locale: { isRTL },
    country,
    appSetting,
  } = useAppSelector((state) => state);

  useEffect(() => {
    setApiCountry(JSON.stringify(country));
  }, [country]);

  return (
    <div
      className={`flex flex-col justify-start items-start w-full lg:w-2/4 xl:w-1/3 overflow-hidden`}
    >
      <SideMenu />
      {appSetting.showHeader && <AppHeader />}
      <main className={`w-full`}>{children}</main>
      <AppFooter />
    </div>
  );
};

export default MainContentLayout;

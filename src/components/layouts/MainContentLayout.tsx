import { FC, ReactNode, useEffect } from 'react';
import dynamic from 'next/dynamic';
const BackBtn = dynamic(() => import(`@/components/BackBtn`), {
  ssr: false,
});
import { useAppSelector } from '@/redux/hooks';
import { setApiCountry } from '@/constants/*';
import AppFooter from '@/components/AppFooter';
const AppHeader = dynamic(() => import(`@/components/AppHeader`), {
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
      className={`flex flex-col min-h-screen justify-start items-start w-full lg:w-2/4 xl:w-1/3 overflow-hidden`}
    >
      <SideMenu />
      {appSetting.showHeader && <AppHeader />}
      <main className={`w-full h-full h-full`}>{children}</main>

      <AppFooter />
    </div>
  );
};

export default MainContentLayout;

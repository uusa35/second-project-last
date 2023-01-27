import { FC, ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useAppSelector } from '@/redux/hooks';
import OffLineWidget from '@/widgets/OffLineWidget';
import NoInternet from '@/appImages/no_internet.png';
import NextNProgress from 'nextjs-progressbar';
import { themeColor } from '@/redux/slices/vendorSlice';
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
  handleSubmit?: (element?: any) => void | undefined | Promise<any>;
};

const MainContentLayout: FC<Props> = ({
  children,
  backHome = false,
  hideBack = false,
  backRoute = null,
  showMotion = true,
  handleSubmit,
}): JSX.Element => {
  const {
    appSetting: { showHeader, showFooter },
    locale: { isRTL },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [isOnline]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col justify-start items-start w-full lg:w-2/4 xl:w-1/3 relative`}
    >
      <SideMenu />
      {showHeader && <AppHeader />}
      <main
        className={`w-full mb-[50%] relative rounded-t-full min-h-screen`}
        style={{ height: '100%' }}
      >
        {isOnline ? (
          children
        ) : (
          <OffLineWidget
            message={`network_is_not_available_please_check_your_internet`}
            img={`${NoInternet.src}`}
          />
        )}
      </main>
      <AppFooter handleSubmit={handleSubmit} />
      <NextNProgress
        color={color}
        startPosition={0.3}
        transformCSS={() => {
          return (
            <style jsx>
              {isRTL
                ? `#nprogress {
                 pointer-events: none;
                transform: scale(-1,-1);
              }
              #nprogress .bar {
               position: fixed;
               z-index: 999;
               top: 0;
               left: auto !important;
               right: 0;
               width: 100%;
               height: 0.3rem;
                box-shadow: 1px 1px 3px gray;
              }
            `
                : `#nprogress {
                 pointer-events: none;
                transform: unset;
              }
              #nprogress .bar {
               position: fixed;
               z-index: 999;
               top: 0;
               left: auto !important;
               right: 0;
               width: 100%;
               height: 0.3rem;
                box-shadow: 1px 1px 3px gray;
              }`}
            </style>
          );
        }}
        stopDelayMs={200}
        height={10.5}
        showOnShallow={true}
        // options={{ showSpinner: false }}
        options={{
          template: `<div class="bar" role="progressbar" aria-role="Changing page" style="background-color: ${color}"></div>`,
          barSelector: '[role="progressbar"]',
          showSpinner: false,
        }}
      />
    </motion.div>
  );
};

export default MainContentLayout;

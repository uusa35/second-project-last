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
      <NextNProgress
        color={color}
        startPosition={0.3}
        stopDelayMs={200}
        height={3.5}
        showOnShallow={true}
        options={{ showSpinner: false }}
      />
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
    </motion.div>
  );
};

export default MainContentLayout;

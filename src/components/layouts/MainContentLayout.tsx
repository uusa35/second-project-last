import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { Offline, Online } from 'react-detect-offline';
import OffLineWidget from '@/widgets/OffLineWidget';
import NoInternet from '@/appImages/no_internet.png';
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
  const { t } = useTranslation();
  const {
    appSetting: { showHeader, showFooter },
    locale: { isRTL },
  } = useAppSelector((state) => state);

  return (
    <div
      className={`flex flex-col justify-start items-start w-full lg:w-2/4 xl:w-1/3 relative`}
    >
      <SideMenu />
      {showHeader && <AppHeader />}
      <main className={`w-full mb-36 relative`}>
        <motion.div
          animate={{ x: [isRTL ? -1000 : 1000, 0, 0] }}
          transition={{
            type: 'spring',
            bounce: 5,
            duration: showMotion ? 0.2 : 0,
          }}
        >
          <Online>{children}</Online>
          <Offline>
            <OffLineWidget
              message={`network_is_not_available_please_check_your_internet`}
              img={`${NoInternet.src}`}
            />
          </Offline>
        </motion.div>
      </main>
      <AppFooter />
    </div>
  );
};

export default MainContentLayout;

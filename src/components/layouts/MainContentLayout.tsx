import { FC, ReactNode, Suspense } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
const BackBtn = dynamic(() => import(`@/components/BackBtn`), {
  ssr: false,
});
import { useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '@/components/LoadingSpinner';
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
    appSetting,
    locale: { isRTL },
  } = useAppSelector((state) => state);

  return (
    <div
      className={`flex flex-col justify-start items-start w-full lg:w-2/4 xl:w-1/3 relative`}
    >
      <SideMenu />
      {appSetting.showHeader && <AppHeader />}
      <main className={`w-full mb-36 relative`}>
        <motion.div
          animate={{ x: [isRTL ? -1000 : 1000, 0, 0] }}
          transition={{
            type: 'spring',
            bounce: 5,
            duration: showMotion ? 0.2 : 0,
          }}
        >
          {children}
        </motion.div>
      </main>
      <AppFooter />
    </div>
  );
};

export default MainContentLayout;

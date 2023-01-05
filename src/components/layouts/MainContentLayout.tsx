import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
const BackBtn = dynamic(() => import(`@/components/BackBtn`), {
  ssr: false,
});
import { useAppSelector } from '@/redux/hooks';
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
    appSetting,
    locale: { isRTL },
  } = useAppSelector((state) => state);

  return (
    <div
      className={`flex flex-col justify-start items-start w-full lg:w-2/4 xl:w-1/3 overflow-hidden`}
    >
      <SideMenu />
      {appSetting.showHeader && <AppHeader />}
      <main className={`w-full px-4`}>
        <motion.div
          animate={{ x: [isRTL ? -1000 : 1000, 0, 0] }}
          transition={{
            type: 'spring',
            bounce: 5,
            duration: showMotion ? 0.2 : 0,
          }}
          viewport={{ once: true }}
        >
          {children}
        </motion.div>
      </main>
      <AppFooter />
    </div>
  );
};

export default MainContentLayout;

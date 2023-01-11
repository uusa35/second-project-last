import { useTranslation } from 'react-i18next';
import { FC, ReactNode, Suspense } from 'react';
import { appLinks, submitBtnClass } from '@/constants/*';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';
import PoweredByQ from '@/components/PoweredByQ';

type Props = {
  children?: ReactNode;
};
const AppFooter: FC<Props> = ({ children }): JSX.Element => {
  const {
    appSetting: { showFooter },
    locale: { isRTL },
  } = useAppSelector((state) => state);
  return (
    <Suspense>
      <footer
        className={`${showFooter ? `h-12` : `h-24`} ${
          !isRTL ? `left-0` : `right-0`
        } fixed w-full lg:w-2/4 xl:w-1/3  -bottom-1 flex flex-col justify-center items-center text-center p-6 bg-white bg-opacity-60`}
      >
        <PoweredByQ />
        <div className={`w-full text-center`}>{children ?? null}</div>
      </footer>
    </Suspense>
  );
};

export default AppFooter;

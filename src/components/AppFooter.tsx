import { useTranslation } from 'react-i18next';
import { FC, Suspense } from 'react';
import { appLinks, submitBtnClass } from '@/constants/*';
import { useAppSelector } from '@/redux/hooks';
import PoweredByQ from '@/components/PoweredByQ';

type Props = {
  productShow: boolean;
  cartReview: boolean;
};

const AppFooter: FC = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    appSetting: { showFooterElement },
    locale: { isRTL },
    cartProduct: { Price },
  } = useAppSelector((state) => state);
  return (
    <Suspense>
      <footer
        className={`${!isRTL ? `left-0` : `right-0`} ${
          showFooterElement === `home` ? `bottom-0` : `-bottom-2`
        } fixed w-full lg:w-2/4 xl:w-1/3 h-auto  flex flex-col justify-center items-center text-center bg-white bg-opacity-60`}
      >
        <PoweredByQ />
        {showFooterElement === 'productShow' && (
          <div
            className={`w-full h-1/2 flex  ${submitBtnClass} cursor-auto rounded-none opacity-100 flex justify-between items-center px-8 rounded-t-2xl`}
          >
            <button
              // onClick={() => dispatch(addToCar)}
              className={`p-2 px-4 rounded-2xl w-fit  bg-primary_BG hover:bg-opacity-90 bg-opacity-60  border border-primary_BG shadow-xl`}
            >
              {t('start_ordering')}
            </button>
            <span className={`flex flex-row items-center gap-2`}>
              <p className={`text-xl`}>{Price}</p> {t('kd')}
            </span>
          </div>
        )}
      </footer>
    </Suspense>
  );
};

export default AppFooter;

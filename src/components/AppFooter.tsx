import { useTranslation } from 'react-i18next';
import { FC, Suspense } from 'react';
import { appLinks, submitBtnClass, suppressText } from '@/constants/*';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import PoweredByQ from '@/components/PoweredByQ';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { setAddToCart } from '@/redux/slices/cartSlice';
import { useRouter } from 'next/router';
type Props = {
  productShow: boolean;
  cartReview: boolean;
};

const AppFooter: FC = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    appSetting: { showFooterElement },
    locale: { isRTL },
    productCart,
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleAddToCart = () => {
    if (!productCart.enabled) {
      dispatch(
        showToastMessage({
          content: `please_review_sections_some_r_required`,
          type: `info`,
        })
      );
    } else {
      dispatch(setAddToCart(productCart));
      dispatch(
        showToastMessage({ content: `item_added_success`, type: `success` })
      );
    }
  };

  return (
    <Suspense>
      <footer
        className={`${!isRTL ? `left-0` : `right-0`} ${
          showFooterElement === `home` ? `bottom-0` : `-bottom-2`
        } fixed w-full lg:w-2/4 xl:w-1/3 h-auto flex flex-col justify-center items-center text-center bg-white bg-opacity-60`}
      >
        <PoweredByQ />
        {showFooterElement === 'productShow' && (
          <div
            className={`w-full h-fit flex ${submitBtnClass} cursor-auto rounded-none opacity-100 flex justify-between items-center px-8 py-8 rounded-t-2xl`}
          >
            <button
              // disabled={!productCart.enabled}
              onClick={() => handleAddToCart()}
              className={`p-2 px-4 rounded-2xl w-fit  bg-primary_BG disabled:bg-stone-600 disabled:text-stone-700 disabled:bg-opacity-40 disabled:opacity-60 hover:bg-opacity-90 bg-opacity-60  border border-primary_BG shadow-xl capitalize`}
            >
              {t('add_to_cart')}
            </button>
            <span className={`flex flex-row items-center gap-2`}>
              <p className={`text-xl`}>{productCart.subTotalPrice}</p> {t('kd')}
            </span>
          </div>
        )}
        {showFooterElement === 'cartIndex' && (
          <div className="bg-gray-100 w-full">
            <div className="bg-sky-600 w-full h-32 flex justify-center items-center rounded-t-xl">
              <button
                className="bg-sky-500 rounded-full text-white h-8 px-4 py-1"
                suppressHydrationWarning={suppressText}
                onClick={() => router.push(`/customer/info`)}
              >
                {t('continue')}
              </button>
            </div>
          </div>
        )}
        {showFooterElement === 'cartAddress' && (
          <div className="bg-gray-100 w-full">
            <div className="bg-sky-600 w-full h-32 flex justify-center items-center rounded-t-xl">
              <button
                className="bg-sky-500 rounded-full text-white h-8 px-4 py-1"
                suppressHydrationWarning={suppressText}
                onClick={() => router.push(`/customer/info`)}
              >
                {t('continue')}
              </button>
            </div>
          </div>
        )}
      </footer>
    </Suspense>
  );
};

export default AppFooter;

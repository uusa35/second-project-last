import { useTranslation } from 'react-i18next';
import { FC, Suspense } from 'react';
import {
  appLinks,
  footerBtnClass,
  mainBg,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
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
            className={`${mainBg} w-full h-fit flex cursor-auto rounded-none opacity-100 flex justify-between items-center px-8 py-8 rounded-t-2xl
            `}
          >
            <button
              onClick={() => handleAddToCart()}
              className={`${footerBtnClass}`}
            >
              {t('add_to_cart')}
            </button>
            <span className={`flex flex-row items-center gap-2`}>
              <p className={`text-xl`}>{productCart.subTotalPrice}</p> {t('kd')}
            </span>
          </div>
        )}
        {showFooterElement === 'cartIndex' && (
          <div
            className={`${mainBg} w-full h-32 flex justify-center items-center rounded-t-xl`}
          >
            <button
              className={`${footerBtnClass}`}
              suppressHydrationWarning={suppressText}
              onClick={() => router.push(`/customer/info`)}
            >
              {t('continue')}
            </button>
          </div>
        )}
        {showFooterElement === 'cartAddress' && (
          <div
            className={`${mainBg} bg-sky-600 w-full h-32 flex justify-center items-center rounded-t-xl`}
          >
            <button
              className={`${footerBtnClass}`}
              suppressHydrationWarning={suppressText}
              onClick={() => router.push(`/customer/info`)}
            >
              {t('continue')}
            </button>
          </div>
        )}
      </footer>
    </Suspense>
  );
};

export default AppFooter;

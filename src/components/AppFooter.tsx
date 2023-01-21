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
import Link from 'next/link';
import FeedbackIcon from '@/appIcons/feedback.svg';
import Facebook from '@/appIcons/facebook.svg';
import Twitter from '@/appIcons/twitter.svg';
import Instagram from '@/appIcons/instagram.svg';
import CustomImage from '@/components/CustomImage';

type Props = {
  handleSubmit?: () => void;
};

const AppFooter: FC<Props> = ({ handleSubmit }): JSX.Element => {
  const { t } = useTranslation();
  const {
    appSetting: { showFooterElement },
    locale: { isRTL },
    productCart,
    cart,
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
          showFooterElement === `home` ? `bottom-0` : `bottom-0`
        } fixed w-full lg:w-2/4 xl:w-1/3 h-auto flex flex-col justify-center items-center text-center bg-white bg-opacity-60`}
      >
        {showFooterElement === 'product_show' && (
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
              <p className={`text-xl`}>{productCart.grossTotalPrice}</p>{' '}
              {t('kd')}
            </span>
          </div>
        )}
        {showFooterElement === 'cart_index' && cart.items.length > 0 && (
          <div
            className={`${mainBg} w-full h-20 flex justify-center items-center rounded-t-xl`}
          >
            <button
              className={`${footerBtnClass}`}
              suppressHydrationWarning={suppressText}
              onClick={() => router.push(appLinks.customerInfo.path)}
            >
              {t('continue')}
            </button>
          </div>
        )}
        {showFooterElement === 'cart_address' && (
          <div
            className={`${mainBg} bg-sky-600 w-full h-20 flex justify-center items-center rounded-t-xl`}
          >
            <button
              className={`${footerBtnClass}`}
              suppressHydrationWarning={suppressText}
              onClick={() => (handleSubmit ? handleSubmit() : null)}
            >
              {t('continue')}
            </button>
          </div>
        )}

        {showFooterElement === 'customerInfo' && (
          <div
            className={`${mainBg} bg-sky-600 w-full h-20 flex justify-center items-center rounded-t-xl`}
          >
            <button
              className={`${footerBtnClass}`}
              suppressHydrationWarning={suppressText}
              onClick={() => (handleSubmit ? handleSubmit() : null)}
            >
              {t('continue')}
            </button>
          </div>
        )}
        {showFooterElement === 'order_review' && (
          <div
            className={`${mainBg} bg-sky-600 w-full h-20 flex justify-center items-center rounded-t-xl`}
          >
            <Link
              className={`${footerBtnClass}`}
              suppressHydrationWarning={suppressText}
              href={`#`}
            >
              {t('checkout')}
            </Link>
          </div>
        )}
        {showFooterElement === 'vendor_show' && (
          <div className="w-full py-8 px-4">
            <div className="py-5">
              <button className={`${submitBtnClass}`}>
                <div className="flex justify-center items-center">
                  <CustomImage
                    className="w-5 h-5"
                    src={FeedbackIcon}
                    alt={t('feedback')}
                  />
                  <p
                    className="text-white px-2"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('leave_feedback')}
                  </p>
                </div>
              </button>
            </div>
            <div className="flex justify-evenly items-center w-[80%] m-auto">
              <Link href={'/'}>
                <CustomImage
                  className="w-5 h-5"
                  src={Facebook}
                  alt={t('facebook')}
                />
              </Link>
              <Link href={'/'}>
                <CustomImage
                  className="w-5 h-5"
                  src={Instagram}
                  alt={t('instagram')}
                />
              </Link>
              <Link href={'/'}>
                <CustomImage
                  className="w-5 h-5"
                  src={Twitter}
                  alt={t('twiiter')}
                />
              </Link>
            </div>
          </div>
        )}
        <PoweredByQ />
      </footer>
    </Suspense>
  );
};

export default AppFooter;

import { useTranslation } from 'react-i18next';
import { FC, Suspense, useState } from 'react';
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
import { useRouter } from 'next/router';
import Link from 'next/link';
import FeedbackIcon from '@/appIcons/feedback.svg';
import Facebook from '@/appIcons/facebook.svg';
import Twitter from '@/appIcons/twitter.svg';
import Instagram from '@/appIcons/instagram.svg';
import CustomImage from '@/components/CustomImage';
import {
  useAddToCartMutation,
  useGetCartProductsQuery,
  useLazyCheckPromoCodeQuery,
  useLazyGetCartProductsQuery,
} from '@/redux/api/cartApi';
import { filter, isEmpty, isNull, kebabCase, lowerCase } from 'lodash';
import { setCartPromoSuccess } from '@/redux/slices/cartSlice';

type Props = {
  handleSubmit?: () => void;
};

const AppFooter: FC<Props> = ({ handleSubmit }): JSX.Element => {
  const { t } = useTranslation();
  const {
    appSetting: { showFooterElement, method },
    customer: { userAgent },
    locale: { isRTL },
    productCart,
    branch: { id: branchId },
    cart: { promoCode: coupon },
    area,
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [triggerAddToCart] = useAddToCartMutation();
  const [triggerGetCartProducts] = useLazyGetCartProductsQuery();
  const {
    data: cartItems,
    isSuccess,
    refetch: refetchCart,
  } = useGetCartProductsQuery({
    UserAgent: userAgent,
  });
  const [triggerCheckPromoCode] = useLazyCheckPromoCodeQuery();

  console.log('branch', branchId);
  console.log('area', area.id);
  const handleAddToCart = async () => {
    if (isNull(area.id) ?? isNull(branchId)) {
      router
        .push(appLinks.cartSelectMethod.path)
        .then(() =>
          dispatch(
            showToastMessage({ content: `choose_area_or_branch`, type: `info` })
          )
        );
    } else {
      if (!productCart.enabled) {
        dispatch(
          showToastMessage({
            content: `please_review_sections_some_r_required`,
            type: `info`,
          })
        );
      } else {
        if (
          (isNull(branchId) ?? isNull(area.id)) &&
          !isEmpty(productCart) &&
          userAgent
        ) {
          await triggerAddToCart({
            process_type: method,
            area_branch:
              method === 'delivery' ? area.id : method === 'pickup' && branchId,
            body: {
              UserAgent: userAgent,
              Cart:
                cartItems && cartItems.data && cartItems.data.Cart
                  ? filter(
                      cartItems.data.Cart,
                      (i) => i.id !== productCart.id
                    ).concat(productCart)
                  : [productCart],
            },
          }).then((r: any) => {
            if (
              r &&
              r.data &&
              r.data.status &&
              r.data.data &&
              r.data.data.Cart &&
              r.data.data.Cart.length > 0
            ) {
              triggerGetCartProducts({ UserAgent: userAgent }).then((r) => {
                console.log('getCart', r); /// case here to change
                if (r.data && r.data.data && r.data.data.Cart) {
                }
                dispatch(
                  showToastMessage({
                    content: 'item_added_successfully',
                    type: `success`,
                  })
                );
              });
            }
          });
        }
      }
    }
  };

  const handleCartIndex = async () => {
    if (
      (isNull(branchId) ?? isNull(area.id)) &&
      !isEmpty(productCart) &&
      userAgent
    ) {
      // coupon case
      if (
        coupon.length > 3 &&
        userAgent &&
        isSuccess &&
        cartItems &&
        cartItems.data &&
        !isEmpty(cartItems.data?.Cart)
      ) {
        await triggerCheckPromoCode({
          userAgent,
          PromoCode: coupon,
        }).then((r: any) => {
          if (r.data && r.data.status && r.data.promoCode) {
            // promoCode Success case
            dispatch(setCartPromoSuccess(r.data.promoCode));
            refetchCart();
            dispatch(
              showToastMessage({
                content: lowerCase(kebabCase(r.data.msg)),
                type: `success`,
              })
            );
          } else if (r.error && r.error?.data && r.error?.data?.msg) {
            dispatch(
              showToastMessage({
                content: lowerCase(kebabCase(r.error.data.msg)),
                type: `error`,
              })
            );
          }
        });
      }
      triggerAddToCart({
        process_type: method,
        area_branch:
          method === 'delivery' ? area.id : method === 'pickup' && branchId,
        body: {
          UserAgent: userAgent,
          Cart:
            cartItems && cartItems.data && cartItems.data.Cart
              ? filter(
                  cartItems.data.Cart,
                  (i) => i.id !== productCart.id
                ).concat(productCart)
              : [productCart],
        },
      })
        .then((r: any) => {
          if (
            r &&
            r.data &&
            r.data.status &&
            r.data.data &&
            r.data.data.Cart &&
            r.data.data.Cart.length > 0
          ) {
            triggerGetCartProducts({ UserAgent: userAgent }).then((r) => {
              console.log('getCart', r);
              if (r.data && r.data.data && r.data.data.Cart) {
              }
              dispatch(
                showToastMessage({
                  content: 'item_added_successfully',
                  type: `success`,
                })
              );
            });
          }
        })
        .then(() => router.push(appLinks.customerInfo.path));
    }
  };

  return (
    <Suspense>
      <footer
        className={`${!isRTL ? `left-0` : `right-0`} ${
          showFooterElement === `home` ? `bottom-0` : `bottom-0`
        } fixed w-full lg:w-2/4 xl:w-1/3 h-auto flex flex-col justify-center items-center text-center bg-white bg-opacity-60 capitalize`}
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
              {isNull(area.id) ?? isNull(branchId)
                ? t(`start_ordering`)
                : t('add_to_cart')}
            </button>
            <span className={`flex flex-row items-center gap-2`}>
              <p className={`text-xl`}>{productCart.grossTotalPrice}</p>
              {t('kwd')}
            </span>
          </div>
        )}
        {showFooterElement === 'cart_index' &&
          isSuccess &&
          cartItems.data?.Cart?.length > 0 && (
            <div
              className={`${mainBg} w-full h-20 flex justify-center items-center rounded-t-xl`}
            >
              <button
                className={`${footerBtnClass}`}
                suppressHydrationWarning={suppressText}
                onClick={() => handleCartIndex()}
              >
                {t('continue')}
              </button>
            </div>
          )}
        {showFooterElement === 'cart_address' && (
          <div
            className={` bg-primary_BG text-white w-full h-24 flex justify-center items-center rounded-t-xl`}
          >
            <button
              className={`${footerBtnClass} rounded-full bg-blue-400 py-1`}
              suppressHydrationWarning={suppressText}
              onClick={() => (handleSubmit ? handleSubmit() : null)}
            >
              {t('continue')}
            </button>
          </div>
        )}

        {showFooterElement === 'customerInfo' && (
          <div
            className={`${mainBg} bg-sky-600 w-full h-24 flex justify-center items-center rounded-t-xl`}
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
              href={`/order/success`}
            >
              {t('checkout')}
            </Link>
          </div>
        )}
        {/* {showFooterElement === 'vendor_show' && (

        )} */}
        <PoweredByQ />
      </footer>
    </Suspense>
  );
};

export default AppFooter;

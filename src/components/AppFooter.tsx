import { useTranslation } from 'react-i18next';
import { FC, Suspense, useEffect } from 'react';
import {
  appLinks,
  convertColor,
  footerBtnClass,
  mainBg,
  suppressText,
} from '@/constants/*';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import PoweredByQ from '@/components/PoweredByQ';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  useAddToCartMutation,
  useGetCartProductsQuery,
  useLazyCheckPromoCodeQuery,
  useLazyGetCartProductsQuery,
} from '@/redux/api/cartApi';
import { filter, isEmpty, isNull, kebabCase, lowerCase } from 'lodash';
import { setCartPromoSuccess } from '@/redux/slices/cartSlice';
import { themeColor } from '@/redux/slices/vendorSlice';

type Props = {
  handleSubmit?: (element?: any) => void;
};

const AppFooter: FC<Props> = ({ handleSubmit }): JSX.Element => {
  const { t } = useTranslation();
  const {
    appSetting: { showFooterElement, method },
    customer: { userAgent, id: customerId },
    locale: { isRTL },
    productCart,
    branch: { id: branchId },
    cart: { promoCode: coupon },
    area,
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
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

  useEffect(() => {
    if (
      showFooterElement === 'cart_index' &&
      ((isNull(area.id) && isNull(branchId)) || isEmpty(method))
    ) {
      router
        .push(appLinks.cartSelectMethod.path)
        .then(() =>
          dispatch(
            showToastMessage({ content: `choose_area_or_branch`, type: `info` })
          )
        );
    }
  }, []);

  const handleAddToCart = async () => {
    if ((isNull(area.id) && isNull(branchId)) || isEmpty(method)) {
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
          (!isNull(branchId) && !isNull(area.id)) ||
          (!isEmpty(productCart) && userAgent)
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
                if (r.data && r.data.data && r.data.data.Cart) {
                }
                dispatch(
                  showToastMessage({
                    content: 'item_added_successfully',
                    type: `success`,
                  })
                );
              });
            } else {
              if (r.error && r.error.data) {
                dispatch(
                  showToastMessage({
                    content: lowerCase(kebabCase(r.error.data.msg)),
                    type: `error`,
                  })
                );
              }
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
      userAgent &&
      !isEmpty(method)
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
            className={`w-full h-fit flex cursor-auto rounded-none opacity-100 flex justify-between items-center px-8 py-8 rounded-t-2xl
            `}
            style={{
              background: `-webkit-gradient(linear, left top, right top, from(${color}), color-stop(100%, ${color}), color-stop(50%, ${color}))`,
            }}
          >
            <button
              onClick={() => handleAddToCart()}
              className={`${footerBtnClass}`}
              style={{
                backgroundColor: convertColor(color, 100),
                color: `white`,
              }}
            >
              {isNull(area.id) && isNull(branchId)
                ? t(`start_ordering`)
                : t('add_to_cart')}
            </button>
            <span className={`flex flex-row items-center gap-2`}>
              <p className={`text-xl text-white`}>
                {productCart.grossTotalPrice}
              </p>
              <span className={`text-white`}>{t('kwd')}</span>
            </span>
          </div>
        )}
        {showFooterElement === 'cart_index' &&
          isSuccess &&
          cartItems.data?.Cart?.length > 0 && (
            <div
              className={`text-white w-full h-24 flex justify-center items-center rounded-t-xl`}
              style={{
                background: `-webkit-gradient(linear, left top, right top, from(${color}), color-stop(100%, ${color}), color-stop(50%, ${color}))`,
              }}
            >
              <button
                className={`${footerBtnClass}`}
                style={{
                  backgroundColor: `${color}`,
                  color: `white`,
                }}
                suppressHydrationWarning={suppressText}
                onClick={() => handleCartIndex()}
              >
                {t('continue')}
              </button>
            </div>
          )}
        {showFooterElement === 'cart_address' && (
          <div
            className={`text-white w-full h-24 flex justify-center items-center rounded-t-xl`}
            style={{
              background: `-webkit-gradient(linear, left top, right top, from(${color}), color-stop(100%, ${color}), color-stop(50%, ${color}))`,
            }}
          >
            <button
              type="submit"
              form="hook-form"
              className={`${footerBtnClass}`}
              style={{ backgroundColor: `${color}`, color: `white` }}
              suppressHydrationWarning={suppressText}
            >
              {t('continue')}
            </button>
          </div>
        )}

        {showFooterElement === 'customerInfo' && (
          <div
            className={`text-white w-full h-24 flex justify-center items-center rounded-t-xl`}
            style={{
              background: `-webkit-gradient(linear, left top, right top, from(${color}), color-stop(100%, ${color}), color-stop(50%, ${color}))`,
            }}
          >
            <button
              className={`${footerBtnClass}`}
              style={{ backgroundColor: `${color}`, color: `white` }}
              suppressHydrationWarning={suppressText}
              onClick={() => (handleSubmit ? handleSubmit() : null)}
            >
              {t('continue')}
            </button>
          </div>
        )}
        {showFooterElement === 'order_review' && (
          <div
            className={`text-white w-full h-24 flex justify-center items-center rounded-t-xl`}
            style={{
              background: `-webkit-gradient(linear, left top, right top, from(${color}), color-stop(100%, ${color}), color-stop(50%, ${color}))`,
            }}
          >
            <button
              disabled={!customerId || !userAgent}
              className={`${footerBtnClass}`}
              style={{ backgroundColor: `${color}`, color: `white` }}
              suppressHydrationWarning={suppressText}
              onClick={() => (handleSubmit ? handleSubmit() : null)}
            >
              {t('checkout')}
            </button>
          </div>
        )}
        <PoweredByQ />
      </footer>
    </Suspense>
  );
};

export default AppFooter;

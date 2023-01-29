import { useTranslation } from 'react-i18next';
import { FC, Suspense } from 'react';
import {
  appLinks,
  convertColor,
  footerBtnClass,
  suppressText,
} from '@/constants/*';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import PoweredByQ from '@/components/PoweredByQ';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { useRouter } from 'next/router';
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
  handleIncreaseProductQty?: () => void;
  handleDecreaseProductQty?: () => void;
  productCurrentQty?:number | undefined
};

const AppFooter: FC<Props> = ({
  handleSubmit,
  handleDecreaseProductQty,
  handleIncreaseProductQty,
  productCurrentQty
}): JSX.Element => {
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

  const handleAddToCart = async () => {
    if (
      (method === `pickup` && isNull(branchId)) ||
      (method === `delivery` && isNull(area.id))
    ) {
      router.push(appLinks.cartSelectMethod(`delivery`));
    }
    if (!productCart.enabled) {
      dispatch(
        showToastMessage({
          content: `please_review_sections_some_r_required`,
          type: `info`,
        })
      );
    } else {
      if (!isEmpty(productCart) && userAgent) {
        await triggerAddToCart({
          process_type: method,
          area_branch: method === 'delivery' ? area.id : branchId,
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
              console.log('error', r.error.data);
              dispatch(
                showToastMessage({
                  // content: lowerCase(kebabCase(r.error.data.msg)),
                  content: 'select_a_branch_or_area_before_order',
                  type: `error`,
                })
              );
            }
          }
        });
      }
    }
  };

  const handleCartIndex = async () => {
    if (
      (method === `pickup` && isNull(branchId)) ||
      (method === `delivery` && isNull(area.id))
    ) {
      router.push(appLinks.cartSelectMethod(`delivery`));
    }
    if (!isEmpty(productCart) && userAgent && !isEmpty(method)) {
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
        area_branch: method === 'delivery' ? area.id : branchId,
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
          <div className='w-full bg-gray-100'>
            {/* quantity meter */}
            <div className='flex justify-between items-center w-full px-8 bg-gray-100'>
              <p>{t('quantity')}</p>
              <div
                className={`flex flex-row justify-center items-center my-4 capitalize`}
              >
                <span className="isolate inline-flex rounded-xl shadow-sm">
                  <button
                    onClick={() =>
                      handleIncreaseProductQty
                        ? handleIncreaseProductQty()
                        : null
                    }
                    type="button"
                    className="relative inline-flex items-center ltr:rounded-l-xl rtl:rounded-r-xl bg-gray-100 px-4 py-2 text-sm font-medium text-black  focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="relative -ml-px inline-flex items-center  bg-gray-100 px-4 py-2 text-sm font-medium focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    style={{ color }}
                  >
                    {productCurrentQty}
                  </button>
                  <button
                    disabled={productCurrentQty === 0}
                    onClick={() =>
                      handleDecreaseProductQty
                        ? handleDecreaseProductQty()
                        : null
                    }
                    type="button"
                    className="relative -ml-px inline-flex items-center ltr:rounded-r-xl rtl:rounded-l-xl bg-gray-100 px-4 py-2 text-sm font-medium text-black  focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  >
                    -
                  </button>
                </span>
              </div>
            </div>

            {/* add to cart btn */}
            <div
              className={`w-full h-fit flex cursor-auto rounded-none opacity-100 flex justify-between items-center px-8 py-4 rounded-t-2xl
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
          </div>
        )}
        {showFooterElement === 'cart_index' &&
          isSuccess &&
          cartItems.data?.Cart?.length > 0 && (
            <div
              className={`text-white w-full h-fit px-8 py-4 flex justify-center items-center rounded-t-xl`}
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
            className={`text-white w-full h-fit px-8 py-4 flex justify-center items-center rounded-t-xl`}
            style={{
              background: `-webkit-gradient(linear, left top, right top, from(${color}), color-stop(100%, ${color}), color-stop(50%, ${color}))`,
            }}
          >
            <button
              onClick={() => (handleSubmit ? handleSubmit() : null)}
              // type="submit"
              // form="hook-form"
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
            className={`text-white w-full h-fit px-8 py-4 flex justify-center items-center rounded-t-xl`}
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
            className={`text-white w-full h-fit px-8 py-4 flex justify-center items-center rounded-t-xl`}
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
      </footer>
    </Suspense>
  );
};

export default AppFooter;

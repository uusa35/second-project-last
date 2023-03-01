import { useTranslation } from 'react-i18next';
import { FC, Suspense } from 'react';
import {
  appLinks,
  convertColor,
  footerBtnClass,
  suppressText,
} from '@/constants/*';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { useRouter } from 'next/router';
import {
  useAddToCartMutation,
  useGetCartProductsQuery,
  useLazyCheckPromoCodeQuery,
  useLazyGetCartProductsQuery,
} from '@/redux/api/cartApi';
import {
  debounce,
  first,
  isEmpty,
  isNull,
  kebabCase,
  lowerCase,
  values,
  map,
  find,
  isUndefined,
} from 'lodash';
import { setCartPromoSuccess } from '@/redux/slices/cartSlice';
import { themeColor } from '@/redux/slices/vendorSlice';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentSummary from '@/widgets/cart/review/PaymentSummary';
import {
  resetCheckBoxes,
  resetMeters,
  resetRadioBtns,
} from '@/redux/slices/productCartSlice';

type Props = {
  handleSubmit?: (element?: any) => void;
  handleIncreaseProductQty?: () => void;
  handleDecreaseProductQty?: () => void;
  productCurrentQty?: number | undefined;
};

const AppFooter: FC<Props> = ({
  handleSubmit,
  handleDecreaseProductQty,
  handleIncreaseProductQty,
  productCurrentQty,
}): JSX.Element => {
  const { t } = useTranslation();
  const {
    appSetting: { showFooterElement, method, url },
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
    area_branch:
      method === `pickup`
        ? { 'x-branch-id': branchId }
        : { 'x-area-id': area.id },
    url,
  });
  const [triggerCheckPromoCode] = useLazyCheckPromoCodeQuery();

  const handelCartPayload = () => {
    const items = map(cartItems?.data.Cart, (i) => {
      // if item is not in the cart return all items in cart
      if (i.id !== productCart.id) {
        return i;
      }
      // if item is in the cart return item but with quantity increased
      // if (i.id === productCart.id)
      else if (
        i.id?.split('_').sort().join(',') ===
        productCart.id.split('_').sort().join(',')
      ) {
        return {
          ...i,
          Quantity: i.Quantity + productCart.Quantity,
        };
      }
    });

    // if item is not in the cart add it
    if (isUndefined(find(items, (x) => x?.id === productCart.id))) {
      items.push(productCart);
    }

    return items;
  };

  const handleAddToCart = async () => {
    if (
      (method === `pickup` && !branchId) ||
      (method === `delivery` && !area.id)
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
                ? handelCartPayload()
                : [productCart],
          },
          url,
        }).then((r: any) => {
          if (r && r.data && r.data.status && r.data.data && r.data.data.Cart) {
            triggerGetCartProducts({
              UserAgent: userAgent,
              area_branch:
                method === `pickup` && branchId
                  ? { 'x-branch-id': branchId }
                  : method === `delivery` && area.id
                  ? { 'x-area-id': area.id }
                  : {},
              url,
            }).then((r) => {
              if ((r.data && r.data.data) || r.data?.data.Cart) {
                console.log('the r', r);
                dispatch(
                  showToastMessage({
                    content: 'item_added_successfully',
                    type: `success`,
                  })
                );
                dispatch(resetRadioBtns());
                dispatch(resetCheckBoxes());
                dispatch(resetMeters());
                console.log('router', router.query);
                if (
                  router.query.category_id &&
                  router.query.category_id !== 'null'
                ) {
                  router.replace(
                    appLinks.productIndex(
                      router.query.category_id.toString(),
                      ``
                    )
                  );
                } else {
                  router.replace(appLinks.productIndex(``, ``));
                }
              } else {
                console.log('else');
              }
            });
          } else {
            console.log('else');
            if (r.error && r.error.data) {
              console.log('r', r);
              // console.log('r', r.error.data.msg);
              // console.log('isArray', r.error.data.msg);
              dispatch(
                showToastMessage({
                  content: r.error.data.msg
                    ? lowerCase(
                        kebabCase(
                          r.error.data.msg.isArray
                            ? first(values(r.error.data.msg))
                            : r.error.data.msg
                        )
                      )
                    : 'select_a_branch_or_area_before_order_or_some_fields_are_required_missing',
                  type: `error`,
                })
              );
            } else {
            }
          }
        });
      }
    }
  };

  const handleCartIndex = async () => {
    if (
      (method === `pickup` && !branchId) ||
      (method === `delivery` && !area.id)
    ) {
      router.push(appLinks.cartSelectMethod(`delivery`));
    }
    if (!isEmpty(productCart) && userAgent && !isEmpty(method)) {
      // coupon case
      if (
        coupon &&
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
          area_branch: branchId
            ? { 'x-branch-id': branchId }
            : { 'x-area-id': area.id },
          url,
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
      triggerGetCartProducts({
        UserAgent: userAgent,
        area_branch:
          method === `pickup`
            ? { 'x-branch-id': branchId }
            : { 'x-area-id': area.id },
        url,
      }).then((r) => {
        if (r.data && r.data.data && r.data.data.Cart) {
          router.push(appLinks.customerInfo.path);
        }
      });
      // .then(() =>
      //   dispatch(
      //     showToastMessage({
      //       content: 'item_added_successfully',
      //       type: `success`,
      //     })
      //   )
      // );
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
          <div className="w-full bg-gray-100">
            {/* quantity meter */}
            <div className="flex justify-between items-center w-full px-8 bg-gray-100">
              <p style={{ color }}>{t('quantity')}</p>
              <div
                className={`flex flex-row justify-center items-center my-4 capitalize`}
              >
                <span className="isolate inline-flex rounded-xl flex-row-reverse">
                  <button
                    onClick={() =>
                      handleIncreaseProductQty
                        ? handleIncreaseProductQty()
                        : null
                    }
                    type="button"
                    className="relative -ml-px inline-flex items-center ltr:rounded-l-sm rtl:rounded-r-sm  bg-gray-100 px-1 py-1 text-sm font-medium text-black  focus:z-10 w-10"
                    style={{ color }}
                    data-cy="increase-product"
                  >
                    <span
                      className={`border border-gray-300 p-1 px-3 bg-white rounded-md text-md font-extrabold  w-8 h-8 flex justify-center items-center`}
                    >
                      +
                    </span>
                  </button>
                  <button
                    type="button"
                    className="relative -ml-px inline-flex items-center  bg-gray-100 px-4 py-2 text-sm font-medium focus:z-10 w-10"
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
                    className="relative inline-flex items-center ltr:rounded-r-sm rtl:rounded-l-sm bg-gray-100 px-1 py-1 text-sm font-medium text-black  focus:z-10 "
                    style={{ color }}
                    data-cy="decrease-product"
                  >
                    <span
                      className={`border border-gray-300 p-1 px-3 bg-white rounded-md text-md font-extrabold  w-8 h-8 flex justify-center items-center`}
                    >
                      -
                    </span>
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
                onClick={debounce(() => handleAddToCart(), 400)}
                className={`${footerBtnClass}`}
                style={{
                  backgroundColor: convertColor(color, 100),
                  color: `white`,
                }}
                data-cy="start-order"
              >
                {!area.id && !branchId ? t(`start_ordering`) : t('add_to_cart')}
              </button>
              <span className={`flex flex-row items-center gap-2`}>
                <p className={`text-xl text-white`}>
                  {parseFloat(productCart.grossTotalPrice).toFixed(3)}
                </p>
                <span className={`text-white uppercase`}>{t('kwd')}</span>
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
          <div className={`h-fit w-full`}>
            {isSuccess &&
              cartItems.data &&
              cartItems.data.total &&
              cartItems.data.subTotal && (
                <div className="px-4 pt-2 bg-stone-100 opacity-80">
                  <div className="flex items-center py-1">
                    <ReceiptIcon style={{ color }} />
                    <div className="ps-5">
                      <h4
                        className="font-semibold text-lg"
                        suppressHydrationWarning={suppressText}
                      >
                        {t('payment_summary')}
                      </h4>
                    </div>
                  </div>
                  <PaymentSummary />
                </div>
              )}
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
          </div>
        )}
      </footer>
    </Suspense>
  );
};

export default AppFooter;

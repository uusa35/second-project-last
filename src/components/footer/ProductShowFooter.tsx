import { appLinks, convertColor, footerBtnClass } from '@/constants/*';
import { useAddToCartMutation, useGetCartProductsQuery, useLazyGetCartProductsQuery } from '@/redux/api/cartApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { resetCheckBoxes, resetMeters, resetRadioBtns } from '@/redux/slices/productCartSlice';
import { themeColor } from '@/redux/slices/vendorSlice';
import { debounce, find, first, isEmpty, isUndefined, kebabCase, lowerCase, map, values } from 'lodash';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
type Props = {
  handleIncreaseProductQty?: () => void;
  handleDecreaseProductQty?: () => void;
  productCurrentQty?: number | undefined;
};
const ProductShowFooter: FC<Props> = ({
  handleIncreaseProductQty,
  handleDecreaseProductQty,
  productCurrentQty,
}) => {
  const {
    appSetting: { method, url },
    customer: { userAgent},
    locale: { isRTL },
    productCart,
    branch: { id: branchId },
    cart: { promoCode: coupon },
    area,
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const dispatch=useAppDispatch()
  const { t } = useTranslation();
  const router=useRouter()

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


  const handelCartPayload = () => {
    let items = map(cartItems?.data.Cart, (i) => {
      // if item is not in the cart return all items in cart
      if (
        i.id?.split('_').sort().join(',') !==
        productCart.id.split('_').sort().join(',')
      ) {
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
    if (
      isUndefined(
        find(
          items,
          (x) =>
            x?.id?.split('_').sort().join(',') ===
            productCart.id.split('_').sort().join(',')
        )
      )
    ) {
      items.push(productCart);
    }

    console.log('items', items);

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
                dispatch(
                  showToastMessage({
                    content: 'item_added_successfully',
                    type: `success`,
                  })
                );
                dispatch(resetRadioBtns());
                dispatch(resetCheckBoxes());
                dispatch(resetMeters());
                if (
                  router.query.category_id &&
                  router.query.category_id !== 'null'
                ) {
                  router.replace(
                    appLinks.productIndex(
                      router.query.category_id.toString(),
                      ``,
                      branchId,
                      area.id
                    )
                  );
                } else {
                  router.replace(
                    appLinks.productIndex(``, ``, branchId, area.id)
                  );
                }
              } else {
              }
            });
          } else {
            if (r.error && r.error.data) {
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

  return (
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
                handleIncreaseProductQty ? handleIncreaseProductQty() : null
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
                handleDecreaseProductQty ? handleDecreaseProductQty() : null
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
          disabled={
            parseFloat(productCart.grossTotalPrice).toFixed(3) === '0.000' &&
            !method
          }
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
            {parseFloat(productCart.grossTotalPrice).toFixed(3) === '0.000'
              ? t(`price_on_selection`)
              : parseFloat(productCart.grossTotalPrice).toFixed(3)}
          </p>
          {parseFloat(productCart.grossTotalPrice).toFixed(3) !== '0.000' && (
            <span className={`text-white uppercase`}>{t('kwd')}</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default ProductShowFooter;

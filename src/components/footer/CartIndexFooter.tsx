import { appLinks, footerBtnClass, suppressText } from '@/constants/*';
import { useGetCartProductsQuery, useLazyCheckPromoCodeQuery, useLazyGetCartProductsQuery } from '@/redux/api/cartApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { setCartPromoSuccess } from '@/redux/slices/cartSlice';
import { themeColor } from '@/redux/slices/vendorSlice';
import { isEmpty, kebabCase, lowerCase } from 'lodash';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
type Props = {};
const CartIndexFooter: FC<Props> = ({}) => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const {
    appSetting: { method, url },
    customer: { userAgent },
    productCart,
    branch: { id: branchId },
    cart: { promoCode: coupon },
    area,
  } = useAppSelector((state) => state);
  const router = useRouter();
  const dispatch=useAppDispatch()

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
  const [triggerGetCartProducts] = useLazyGetCartProductsQuery();

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
  );
};

export default CartIndexFooter;

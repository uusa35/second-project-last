import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { useEffect, Suspense, useCallback, useMemo } from 'react';
import {
  setCurrentModule,
  resetShowFooterElement,
  setShowFooterElement,
} from '@/redux/slices/appSettingSlice';
import { EditOutlined } from '@mui/icons-material';
import Promotion from '@/appIcons/promotion.svg';
import Notes from '@/appIcons/notes.svg';
import { appLinks, suppressText } from '@/constants/*';
import CustomImage from '@/components/CustomImage';
import {
  debounce,
  isEmpty,
  isNull,
  kebabCase,
  lowerCase,
  map,
  sumBy,
} from 'lodash';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import {
  removeFromCart,
  decreaseCartQty,
  increaseCartQty,
  setCartNotes,
  setCartPromoCode,
  setCartTotalAndSubTotal,
  setCartPromoSuccess,
} from '@/redux/slices/cartSlice';
import { QuantityMeters } from '@/types/index';
import Link from 'next/link';
import {
  useAddToCartMutation,
  useLazyCheckPromoCodeQuery,
  useLazyGetCartProductsQuery,
} from '@/redux/api/cartApi';
import PaymentSummary from '@/widgets/cart/review/PaymentSummary';
import TextTrans from '@/components/TextTrans';
const CartIndex: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    cart,
    branch: { id: branchId },
    area: { id: areaId },
    appSetting: { userAgent },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [triggerAddToCart, { isSuccess: addToCartIsSuccess }] =
    useAddToCartMutation();
  const [
    triggerCheckPromoCode,
    { data: promoCodeData, isSuccess: promoCodeSuccess },
  ] = useLazyCheckPromoCodeQuery();
  const [
    triggerGetCartProducts,
    { data: serverCart, isSuccess: serverCartIsSuccess },
  ] = useLazyGetCartProductsQuery();

  useEffect(() => {
    dispatch(setCurrentModule(t('cart')));
    dispatch(setShowFooterElement(`cart_index`));
    return () => {
      dispatch(resetShowFooterElement());
    };
  }, []);

  const handleCoupon = async (coupon: string) => {
    if (coupon.length > 3 && userAgent && !isEmpty(cart.items)) {
      dispatch(setCartPromoCode(coupon));
      await triggerCheckPromoCode({
        userAgent,
        PromoCode: coupon,
      }).then((r) => {
        if (r.data && r.data.status && r.data?.promoCode) {
          // promoCode Success
          dispatch(setCartPromoSuccess(r.data?.promoCode));
          dispatch(
            showToastMessage({
              content: lowerCase(kebabCase(r.data.msg)),
              type: `success`,
            })
          );
        } else if (r.error && r.error.data && r.error.data?.msg) {
          dispatch(
            showToastMessage({
              content: lowerCase(kebabCase(r.error.data.msg)),
              type: `error`,
            })
          );
        } else {
          dispatch(
            showToastMessage({
              content: `cart_unknown_coupon_error`,
              type: `error`,
            })
          );
        }
      });
    }
  };

  const handleRemove = async (id: any) => {
    await dispatch(removeFromCart(id));
    await dispatch(
      showToastMessage({
        content: `item_removed_from_cart`,
        type: `info`,
      })
    );
  };

  const handleCartCalculations = async () => {
    if (branchId && !isNull(branchId) && !isEmpty(cart.items) && userAgent) {
      await triggerAddToCart({
        branchId,
        body: { UserAgent: userAgent, Cart: cart.items },
      }).then((r: any) => {
        if (r.data && r.data.status && r.data.msg) {
          triggerGetCartProducts({ UserAgent: userAgent })
            .then((r: any) => {
              if (r.data && r.data.status) {
                dispatch(
                  setCartTotalAndSubTotal({
                    total: r.data.data.total,
                    subTotal: r.data.data.subTotal,
                    delivery_fees: r.data.data.delivery_fees,
                  })
                );
              }
            })
            .then(() =>
              dispatch(
                showToastMessage({
                  content: lowerCase(kebabCase(r.data.msg)),
                  type: `success`,
                })
              )
            );
        } else {
          dispatch(
            showToastMessage({
              content: lowerCase(
                kebabCase(
                  r.error?.data?.msg ?? `cart_is_not_ready_error_occurred`
                )
              ),
              type: `error`,
            })
          );
        }
      });
    }
  };

  useEffect(() => {
    handleCartCalculations();
  }, [cart.promoEnabled, cart.total, cart.grossTotal]);

  const handleIncrease = useCallback(
    (element: any) => {
      // console.log('element', element);
      dispatch(increaseCartQty(element));
    },
    [cart.total, cart.grossTotal]
  );

  const handleDecrease = useCallback(
    (element: any) => {
      dispatch(decreaseCartQty(element));
    },
    [cart.total, cart.grossTotal]
  );

  const handleChange = (notes: string) => {
    if (notes.length > 3) {
      dispatch(setCartNotes(notes));
    }
  };

  return (
    <MainContentLayout>
      <Suspense>
        {/* if cart is empty */}
        {isEmpty(cart.items) ? (
          <div className={'px-4'}>
            <div className="flex justify-center py-5">
              <p suppressHydrationWarning={suppressText}>
                {t('your_cart_is_empty')}
              </p>
            </div>
          </div>
        ) : (
          <Suspense>
            <div className={`space-y-8`}>
              <p
                className="mx-7 text-lg"
                suppressHydrationWarning={suppressText}
              >
                {t('items')}
              </p>
              {map(cart.items, (item, i) => (
                <div key={i}>
                  <div className="px-4">
                    <div className="mb-10 ">
                      <div className="flex px-5 items-center">
                        <div className="ltr:pr-3 rtl:pl-3 w-1/5">
                          <CustomImage
                            className="w-full rounded-lg border-[1px] border-gray-200"
                            alt={`${t('item')}`}
                            src={item.image}
                          />
                        </div>

                        <div className="w-full">
                          <div>
                            <div className="text-end">
                              <button
                                className="text-CustomRed pe-5 capitalize"
                                suppressHydrationWarning={suppressText}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemove(item.ProductID);
                                }}
                              >
                                {t('remove')}
                              </button>
                              <Link
                                href={`${appLinks.productShow(
                                  item.ProductID.toString(),
                                  branchId,
                                  item.ProductID,
                                  item.ProductName,
                                  areaId
                                )}`}
                              >
                                <EditOutlined />
                              </Link>
                            </div>
                          </div>
                          <Link
                            href={`${appLinks.productShow(
                              item.ProductID.toString(),
                              branchId,
                              item.ProductID,
                              item.ProductName,
                              areaId
                            )}`}
                          >
                            <p className="font-semibold">
                              <TextTrans ar={item.name_ar} en={item.name_en} />
                            </p>
                          </Link>
                          <div className="flex">
                            {map(
                              item.QuantityMeters,
                              (a: QuantityMeters, i) => (
                                <div className="w-fit pb-2" key={i}>
                                  <p
                                    className={`text-xs px-2 pe-3 text-gray-400 w-auto ${
                                      item.QuantityMeters.length > 1 &&
                                      'border-e-2 border-gray-400'
                                    }`}
                                  >
                                    <TextTrans
                                      ar={a.addons[0].name_ar}
                                      en={a.addons[0].name_en}
                                    />
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="px-3 flex justify-between items-center mt-3">
                        <span className="flex rounded-xl shadow-sm">
                          <button
                            type="button"
                            className="relative -ml-px inline-flex items-center ltr:rounded-l-xl rtl:rounded-r-xl  bg-gray-100 px-4 py-2 text-sm font-medium text-black  focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            onClick={() => {
                              handleIncrease(item);
                            }}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="relative -ml-px inline-flex items-center  bg-gray-100 px-4 py-2 text-sm font-medium text-primary_BG  focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                          >
                            {item.totalQty}
                          </button>
                          <button
                            type="button"
                            className="relative inline-flex items-center ltr:rounded-r-xl rtl:rounded-l-xl bg-gray-100 px-4 py-2 text-sm font-medium text-black  focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            onClick={() => {
                              handleDecrease(item);
                            }}
                          >
                            -
                          </button>
                        </span>
                        <div>
                          <p
                            className="text-primary_BG"
                            suppressHydrationWarning={suppressText}
                          >
                            {item.subTotalPrice} {t('kwd')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 px-5 py-1 bg-gray-100"></div>
                </div>
              ))}
              <div className="px-5">
                <div className="flex items-center">
                  <CustomImage
                    className="w-8 h-8"
                    src={Promotion}
                    alt={t('promotion')}
                  />
                  <p
                    className="font-semibold ps-2"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('promotion_code')}
                  </p>
                </div>

                <div className="flex items-center justify-between px-2 pt-3">
                  <input
                    type="text"
                    placeholder={`${t('enter_code_here')}`}
                    onChange={debounce(
                      (e) => handleCoupon(e.target.value),
                      400
                    )}
                    suppressHydrationWarning={suppressText}
                    className={`border-0 border-b-2 border-b-gray-200 w-full focus:ring-transparent`}
                  />
                </div>
              </div>

              <div className="px-5 mt-5">
                <div className="flex items-center">
                  <CustomImage
                    className="w-6 h-6"
                    src={Notes}
                    alt={`${t('note')}`}
                  />
                  <p
                    className="font-semibold ps-2"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('extra_notes')}
                  </p>
                </div>
                <input
                  type="text"
                  placeholder={`${t('enter_notes_here')}`}
                  suppressHydrationWarning={suppressText}
                  onChange={debounce((e) => handleChange(e.target.value), 400)}
                  className={`border-0 border-b-2 border-b-gray-200 w-full focus:ring-transparent`}
                />
              </div>
              {<PaymentSummary />}
            </div>
          </Suspense>
        )}
      </Suspense>
    </MainContentLayout>
  );
};

export default CartIndex;

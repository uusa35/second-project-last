import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { useEffect, Suspense, Fragment } from 'react';
import {
  setCurrentModule,
  resetShowFooterElement,
  setShowFooterElement,
} from '@/redux/slices/appSettingSlice';
import { EditOutlined } from '@mui/icons-material';
import Promotion from '@/appIcons/promotion.svg';
import Notes from '@/appIcons/notes.svg';
import { appLinks, cartInitialState, suppressText } from '@/constants/*';
import CustomImage from '@/components/CustomImage';
import { debounce, filter, isEmpty, kebabCase, lowerCase, map } from 'lodash';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { removeFromCart } from '@/redux/slices/cartSlice';
import { ProductCart, QuantityMeters, ServerCart } from '@/types/index';
import Link from 'next/link';
import {
  useAddToCartMutation,
  useGetCartProductsQuery,
  useLazyCheckPromoCodeQuery,
  useLazyGetCartProductsQuery,
} from '@/redux/api/cartApi';
import PaymentSummary from '@/widgets/cart/review/PaymentSummary';
import TextTrans from '@/components/TextTrans';
import { AppQueryResult } from '@/types/queries';
import { setNotes } from '@/redux/slices/customerSlice';
const CartIndex: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    branch: { id: branchId },
    area: { id: areaId },
    customer: { userAgent, notes },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [triggerAddToCart] = useAddToCartMutation();
  const {
    data: cartItems,
    isSuccess,
    isLoading,
    refetch: refetcCart,
  } = useGetCartProductsQuery<{
    data: AppQueryResult<ServerCart>;
    isSuccess: boolean;
    isLoading: boolean;
    refetch: () => void;
  }>({
    UserAgent: userAgent,
  });
  const [triggerCheckPromoCode] = useLazyCheckPromoCodeQuery();

  useEffect(() => {
    dispatch(setCurrentModule(t('cart')));
    dispatch(setShowFooterElement(`cart_index`));
    return () => {
      dispatch(resetShowFooterElement());
    };
  }, []);

  const handleCoupon = async (coupon: string) => {
    if (
      coupon.length > 3 &&
      userAgent &&
      isSuccess &&
      !isEmpty(cartItems.data?.Cart)
    ) {
      await triggerCheckPromoCode({
        userAgent,
        PromoCode: coupon,
      }).then((r) => {
        if (r.data && r.data.status && r.data.promoCode) {
          // promoCode Success
          console.log('r promoeCode', r.data.promoCode);
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
  };

  const handleRemove = async (element: ProductCart) => {
    console.log('cartItems', cartItems.data?.Cart);
    console.log('element', element.id);
    const items = filter(
      cartItems.data?.Cart,
      (item) => item.id !== element.id?.toString()
    );
    const currentItems = isEmpty(items) ? [cartInitialState.items] : items;
    console.log('currentItems', currentItems);
    triggerAddToCart({
      branchId,
      body: {
        UserAgent: userAgent,
        Cart: currentItems,
      },
    }).then((r) => {
      if (r.data?.status) {
        dispatch(
          showToastMessage({
            content: `cart_updated_successfully`,
            type: `success`,
          })
        );
      }
    });
  };

  const handleIncrease = (element: ProductCart) => {
    triggerAddToCart({
      branchId,
      body: {
        UserAgent: userAgent,
        Cart: [{ ...element, Quantity: element.Quantity + 1 }],
      },
    }).then((r) => {
      if (r.data?.status) {
        dispatch(
          showToastMessage({
            content: `cart_updated_successfully`,
            type: `success`,
          })
        );
      }
    });
  };

  const handleDecrease = (element: ProductCart) => {
    triggerAddToCart({
      branchId,
      body: {
        UserAgent: userAgent,
        Cart: [{ ...element, Quantity: element.Quantity - 1 }],
      },
    }).then((r) => {
      if (r.data?.status) {
        dispatch(
          showToastMessage({
            content: `cart_updated_successfully`,
            type: `success`,
          })
        );
      }
    });
  };

  const handleSetNotes = (notes: string) => {
    if (notes.length > 3) {
      dispatch(setNotes(notes));
    }
  };

  console.log('cartItems[0]', cartItems?.data?.Cart[0]);

  return (
    <Suspense>
      <MainContentLayout>
        {/* if cart is empty */}
        {isSuccess && isEmpty(cartItems?.data?.Cart) ? (
          <div className={'px-4'}>
            <div className="flex justify-center py-5">
              <p suppressHydrationWarning={suppressText}>
                {t('your_cart_is_empty')}
              </p>
            </div>
          </div>
        ) : (
          <div className={`space-y-8`}>
            <p className="mx-7 text-lg" suppressHydrationWarning={suppressText}>
              {t('items')}
            </p>
            {isSuccess &&
              cartItems.data?.subTotal > 0 &&
              map(cartItems.data?.Cart, (item, i) => (
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
                                onClick={() => handleRemove(item)}
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
                            {isSuccess && (
                              <div className="w-fit pb-2">
                                <div
                                  className={`flex text-gray-400 w-auto flex-wrap justify-between`}
                                >
                                  {!isEmpty(item.QuantityMeters) &&
                                    map(item.QuantityMeters, (q, i) => (
                                      <Fragment key={i}>
                                        {map(q.addons, (addon, i) => (
                                          <TextTrans
                                            key={i}
                                            className={`border-r-2 last:border-r-0 first:pr-1 px-1 text-xxs`}
                                            ar={addon.name}
                                            en={addon.name}
                                          />
                                        ))}
                                      </Fragment>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {isSuccess && (
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
                              {item.Quantity}
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
                              {item.Price} {t('kwd')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-10 px-5 py-1 bg-gray-100"></div>
                </div>
              ))}
            <div className="px-5">
              <div className="flex items-center">
                <CustomImage
                  className="w-8 h-8"
                  src={Promotion.src}
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
                  onChange={debounce((e) => handleCoupon(e.target.value), 400)}
                  suppressHydrationWarning={suppressText}
                  className={`border-0 border-b-2 border-b-gray-200 w-full focus:ring-transparent`}
                />
              </div>
            </div>

            <div className="px-5 mt-5">
              <div className="flex items-center">
                <CustomImage
                  className="w-6 h-6"
                  src={Notes.src}
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
                defaultValue={notes}
                onChange={debounce((e) => handleSetNotes(e.target.value), 400)}
                className={`border-0 border-b-2 border-b-gray-200 w-full focus:ring-transparent`}
              />
            </div>
            {isSuccess && (
              <PaymentSummary
                total={parseFloat(cartItems.data.total)}
                subTotal={parseFloat(cartItems.data.subTotal)}
                delivery={cartItems.data.delivery_fees}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </MainContentLayout>
    </Suspense>
  );
};

export default CartIndex;

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
import { appLinks, suppressText } from '@/constants/*';
import CustomImage from '@/components/CustomImage';
import { debounce, filter, isEmpty, kebabCase, lowerCase, map } from 'lodash';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { ProductCart, QuantityMeters, ServerCart } from '@/types/index';
import Link from 'next/link';
import {
  useAddToCartMutation,
  useGetCartProductsQuery,
  useLazyCheckPromoCodeQuery,
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
    appSetting: { method },
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

  console.log('Cart Now ==+>', cartItems?.data?.Cart);
  const handleRemove = async (element: ProductCart) => {
    const currentItems = filter(
      cartItems.data.Cart,
      (i) => i.id !== element.id
    );
    triggerAddToCart({
      process_type: method,
          area_branch:
            method === 'delivery' ? areaId : method === 'pickup' && branchId,
      body: {
        UserAgent: userAgent,
        Cart:
          isSuccess &&
          cartItems.data &&
          cartItems.data.Cart &&
          !isEmpty(currentItems)
            ? currentItems
            : cartItems.data.Cart, // empty Cart Case !!!
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
      process_type: method,
          area_branch:
            method === 'delivery' ? areaId : method === 'pickup' && branchId,
      body: {
        UserAgent: userAgent,
        Cart:
          isSuccess && cartItems.data && cartItems.data.Cart
            ? filter(cartItems.data.Cart, (i) => i.id !== element.id).concat({
                ...element,
                Quantity: element.Quantity + 1,
              })
            : cartItems.data.Cart,
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
      process_type: method,
          area_branch:
            method === 'delivery' ? areaId : method === 'pickup' && branchId,
      body: {
        UserAgent: userAgent,
        Cart:
          isSuccess && cartItems.data && cartItems.data.Cart
            ? filter(cartItems.data.Cart, (i) => i.id !== element.id).concat({
                ...element,
                Quantity: element.Quantity - 1,
              })
            : cartItems.data.Cart,
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
              map(cartItems.data?.Cart, (item: ProductCart, i) => (
                <div key={i}>
                  <div className="px-4">
                    <div className="mb-10 ">
                      <div className="flex px-5 items-center">
                        <Link
                          href={`${appLinks.productShow(
                            item.ProductID.toString(),
                            branchId,
                            item.ProductID,
                            item.ProductName,
                            areaId
                          )}`}
                          className="ltr:pr-3 rtl:pl-3 w-1/5"
                        >
                          <CustomImage
                            className="w-full rounded-lg border-[1px] border-gray-200 shadow-md"
                            alt={`${t('item')}`}
                            src={item.image}
                          />
                        </Link>

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
                              <TextTrans
                                ar={item.ProductName}
                                en={item.ProductName}
                              />
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
                                            className={`ltr:border-r-2 ltr:last:border-r-0 ltr:first:pr-1 rtl:border-l-2 rtl:last:border-l-0 rtl:first:pl-1 px-1 text-xs`}
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

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
import {
  debounce,
  filter,
  isEmpty,
  isNull,
  kebabCase,
  lowerCase,
  map,
} from 'lodash';
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
import {
  setCartPromoCode,
  setCartPromoSuccess,
  setCartTotalAndSubTotal,
} from '@/redux/slices/cartSlice';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useRouter } from 'next/router';

const CartIndex: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    branch: { id: branchId },
    area: { id: areaId },
    appSetting: { method },
    customer: { userAgent, notes },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const [triggerAddToCart] = useAddToCartMutation();
  const {
    data: cartItems,
    isSuccess,
    refetch: refetchCart,
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
    if (
      isSuccess &&
      cartItems.data &&
      cartItems.data.Cart &&
      !isEmpty(cartItems)
    ) {
      const { total, subTotal, delivery_fees }: any = cartItems.data;
      dispatch(setCartTotalAndSubTotal({ total, subTotal, delivery_fees }));
    }
  }, [cartItems]);

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
      dispatch(setCartPromoCode(coupon));
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
    }
  };

  const handleRemove = async (element: ProductCart) => {
    const currentItems = filter(
      cartItems.data.Cart,
      (i) => i.id !== element.id
    );
    triggerAddToCart({
      process_type: method,
      area_branch: method === 'delivery' ? areaId : branchId,
      body: {
        UserAgent: userAgent,
        Cart:
          isSuccess &&
          cartItems.data &&
          cartItems.data.Cart &&
          !isEmpty(currentItems)
            ? currentItems
            : [], // empty Cart Case !!!
      },
    }).then((r: any) => {
      if (r.data && r.data?.status) {
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
      area_branch: method === 'delivery' ? areaId : branchId,
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
    }).then((r: any) => {
      if (r.data && r.data?.status) {
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
      area_branch: method === 'delivery' ? areaId : branchId,
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
    }).then((r: any) => {
      if (r.data && r.data?.status) {
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
              <p suppressHydrationWarning={suppressText} className="capitalize">
                {t('your_cart_is_empty')}
              </p>
            </div>
          </div>
        ) : (
          <div className={`space-y-8`}>
            <p
              className="mx-7 text-lg capitalize"
              suppressHydrationWarning={suppressText}
            >
              {t('items')}
            </p>
            {isSuccess &&
              cartItems.data?.subTotal > 0 &&
              map(cartItems.data?.Cart, (item: ProductCart, i) => (
                <div key={i}>
                  <div className="px-4">
                    <div className="mb-10 ">
                      <div className="flex  items-center">
                        <Link
                          href={`${appLinks.productShow(
                            item.ProductID.toString(),
                            branchId,
                            item.ProductID.toString(),
                            item.ProductName,
                            areaId
                          )}`}
                          className="ltr:pr-3 rtl:pl-3 w-1/5"
                        >
                          <CustomImage
                            className="w-full rounded-lg border-[1px] aspect-1 border-gray-200 shadow-md"
                            alt={`${t('item')}`}
                            src={item.image}
                          />
                        </Link>
                        <div className="w-full">
                          <div className="flex flex-1 justify-between items-center">
                            <div className={`flex grow`}>
                              <Link
                                href={`${appLinks.productShow(
                                  item.ProductID.toString(),
                                  branchId,
                                  item.ProductID.toString(),
                                  item.ProductName,
                                  areaId
                                )}`}
                                className={`flex grow mb-2`}
                              >
                                <TextTrans
                                  className={`font-semibold capitalize`}
                                  ar={item.ProductName}
                                  en={item.ProductName}
                                />
                              </Link>
                            </div>
                            <div>
                              <button
                                className="text-red-700 capitalize"
                                suppressHydrationWarning={suppressText}
                                onClick={() => handleRemove(item)}
                              >
                                {t('remove')}
                              </button>
                            </div>
                          </div>
                          {/* addons items */}
                          <div className="flex">
                            <div className="w-fit pb-2">
                              <div
                                className={`flex text-gray-400 w-auto flex-wrap justify-between`}
                              >
                                {!isEmpty(item.QuantityMeters) &&
                                  map(
                                    item.QuantityMeters,
                                    (q: QuantityMeters, i) => (
                                      <Fragment key={i}>
                                        {map(q.addons, (addon, i) => (
                                          <TextTrans
                                            key={i}
                                            className={`ltr:border-r-2 ltr:last:border-r-0 ltr:first:pr-1 rtl:border-l-2 rtl:last:border-l-0 rtl:first:pl-1 px-1 text-xs capitalize`}
                                            ar={addon.name}
                                            en={addon.name}
                                          />
                                        ))}
                                      </Fragment>
                                    )
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* meters + / - */}
                      <div className="flex justify-between items-center mt-3">
                        <span className="flex rounded-xl shadow-sm">
                          <button
                            type="button"
                            className="relative -ml-px inline-flex items-center ltr:rounded-l-sm rtl:rounded-r-sm  bg-gray-100 px-1 py-1 text-sm font-medium text-black  focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            onClick={() => {
                              handleIncrease(item);
                            }}
                          >
                            <span
                              className={`border border-gray-300 p-1 px-3 bg-white rounded-md text-md font-extrabold  w-8 h-8 flex justify-center items-center`}
                            >
                              +
                            </span>
                          </button>
                          <button
                            type="button"
                            className="text-md relative -ml-px inline-flex items-center  bg-gray-100 px-4 py-2 text-sm font-medium focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 capitalize font-extrabold w-8"
                            style={{ color }}
                          >
                            {item.Quantity}
                          </button>
                          <button
                            type="button"
                            className="relative inline-flex items-center ltr:rounded-r-sm rtl:rounded-l-sm bg-gray-100 px-1 py-1 text-sm font-medium text-black  focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            onClick={() => {
                              handleDecrease(item);
                            }}
                          >
                            <span
                              className={`border border-gray-300 p-1 px-3 bg-white rounded-md text-md font-extrabold  w-8 h-8 flex justify-center items-center`}
                            >
                              -
                            </span>
                          </button>
                        </span>
                        <div>
                          <p
                            className=" uppercase"
                            style={{ color }}
                            suppressHydrationWarning={suppressText}
                          >
                            {item.Price} {t('kwd')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 px-0 py-1 bg-gray-100"></div>
                </div>
              ))}
            <div className="px-4">
              <div className="flex items-center">
                <CustomImage
                  className="w-8 h-8"
                  src={Promotion.src}
                  alt={t('promotion')}
                />
                <p
                  className="font-semibold ps-2 capitalize"
                  suppressHydrationWarning={suppressText}
                >
                  {t('promotion_code')}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3">
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
                  className="font-semibold ps-2 capitalize"
                  suppressHydrationWarning={suppressText}
                >
                  {t('extra_notes')}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3">
                <input
                  type="text"
                  placeholder={`${t('enter_notes_here')}`}
                  suppressHydrationWarning={suppressText}
                  defaultValue={notes}
                  onChange={debounce(
                    (e) => handleSetNotes(e.target.value),
                    400
                  )}
                  className={`border-0 border-b-2 border-b-gray-200 w-full focus:ring-transparent capitalize`}
                />
              </div>
            </div>
            {isSuccess && <PaymentSummary />}
          </div>
        )}
      </MainContentLayout>
    </Suspense>
  );
};

export default CartIndex;

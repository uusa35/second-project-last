import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { useEffect, Suspense, Fragment, useState } from 'react';
import {
  setCurrentModule,
  resetShowFooterElement,
  setShowFooterElement,
  setUrl,
} from '@/redux/slices/appSettingSlice';
import Promotion from '@/appIcons/promotion.svg';
import Notes from '@/appIcons/notes.svg';
import { appLinks, imageSizes, imgUrl, suppressText } from '@/constants/*';
import CustomImage from '@/components/CustomImage';
import {
  debounce,
  filter,
  isEmpty,
  kebabCase,
  lowerCase,
  map,
  startCase,
} from 'lodash';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import {
  CheckBoxes,
  ProductCart,
  QuantityMeters,
  RadioBtns,
  ServerCart,
} from '@/types/index';
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
import EmptyCart from '@/appImages/empty-cart.gif';
import { wrapper } from '@/redux/store';
import { Done } from '@mui/icons-material';

type Props = {
  url: string;
};
const CartIndex: NextPage<Props> = ({ url }): JSX.Element => {
  const { t } = useTranslation();
  const {
    branch: { id: branchId },
    area: { id: areaId },
    appSetting: { method },
    customer: { userAgent, notes },
    cart: { promoEnabled },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const [couponVal, setCouponVal] = useState<string | undefined>(undefined);
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
    area_branch:
      method === `pickup` && branchId
        ? { 'x-branch-id': branchId }
        : method === `delivery` && areaId
        ? { 'x-area-id': areaId }
        : {},
    url,
  });
  const [triggerCheckPromoCode] = useLazyCheckPromoCodeQuery();

  useEffect(() => {
    if (
      isSuccess &&
      cartItems.data &&
      cartItems.data.Cart &&
      !isEmpty(cartItems)
    ) {
      const { total, subTotal, delivery_fees, tax }: any = cartItems.data;
      dispatch(
        setCartTotalAndSubTotal({ total, subTotal, delivery_fees, tax })
      );
    }
  }, [cartItems]);

  useEffect(() => {
    dispatch(setCartPromoCode(''));
    dispatch(setCurrentModule('cart'));
    dispatch(setShowFooterElement(`cart_index`));
    if (url) {
      dispatch(setUrl(url));
    }
    return () => {
      dispatch(resetShowFooterElement());
    };
  }, []);

  const handleCoupon = async (coupon: string) => {
    if (userAgent && isSuccess && !isEmpty(cartItems.data?.Cart)) {
      dispatch(setCartPromoCode(coupon));
      if (
        userAgent &&
        isSuccess &&
        cartItems &&
        cartItems.data &&
        !isEmpty(cartItems.data?.Cart)
      ) {
        await triggerCheckPromoCode({
          userAgent,
          PromoCode: coupon,
          area_branch:
            method === `pickup` && branchId
              ? { 'x-branch-id': branchId }
              : method === `delivery` && areaId
              ? { 'x-area-id': areaId }
              : {},
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
    }
  };

  useEffect(() => {
    if (couponVal !== undefined) {
      handleCoupon(couponVal);
    }
    // debounce(() => handleCoupon(couponVal), 500);
  }, [couponVal]);

  const resetCoupon = () => {
    dispatch(setCartPromoCode(``));
    setCouponVal(undefined);
  };

  const handleRemove = async (element: ProductCart) => {
    resetCoupon();
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
      url,
    }).then((r: any) => {
      if (r.data && r.data?.status) {
        dispatch(
          showToastMessage({
            content: `cart_updated_successfully`,
            type: `success`,
          })
        );
      } else {
        if (r.error && r.error.data && r.error.data.msg) {
          dispatch(
            showToastMessage({
              content: lowerCase(kebabCase(r.error.data.msg)),
              type: `error`,
            })
          );
        }
      }
    });
  };

  const handleIncrease = (element: ProductCart) => {
    resetCoupon();
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
      url,
    }).then((r: any) => {
      if (r.data && r.data?.status) {
        dispatch(
          showToastMessage({
            content: `cart_updated_successfully`,
            type: `success`,
          })
        );
      } else {
        if (r.error && r.error.data && r.error.data.msg) {
          dispatch(
            showToastMessage({
              content: lowerCase(kebabCase(r.error.data.msg)),
              type: `error`,
            })
          );
        }
      }
    });
  };

  const handleDecrease = (element: ProductCart) => {
    resetCoupon();
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
      url,
    }).then((r: any) => {
      if (r.data && r.data?.status) {
        dispatch(
          showToastMessage({
            content: `cart_updated_successfully`,
            type: `success`,
          })
        );
      } else {
        if (r.error && r.error.data && r.error.data.msg) {
          dispatch(
            showToastMessage({
              content: lowerCase(kebabCase(r.error.data.msg)),
              type: `error`,
            })
          );
        }
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
      <MainContentLayout url={url} backHome={true}>
        {/* if cart is empty */}
        {isSuccess && isEmpty(cartItems?.data?.Cart) ? (
          <div className={'px-4'}>
            <div className="flex flex-col items-center justify-center py-5">
              <CustomImage
                src={EmptyCart.src}
                alt="empty_cart"
                className="w-2/3 h-auto my-5 px-3"
                width={100}
                height={100}
              />
              <p
                suppressHydrationWarning={suppressText}
                className="capitalize text-slate-600"
              >
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
                            lowerCase(kebabCase(item.ProductName)),
                            areaId
                          )}`}
                          className="ltr:pr-3 rtl:pl-3 w-1/5"
                        >
                          <CustomImage
                            className="w-full rounded-lg border-[1px] aspect-1 border-gray-200 shadow-md"
                            alt={`${t('item')}`}
                            src={imgUrl(item.ProductImage)}
                            width={imageSizes.xs}
                            height={imageSizes.xs}
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
                                  lowerCase(kebabCase(item.ProductName)),
                                  areaId
                                )}`}
                                className={`flex grow mb-2`}
                              >
                                <TextTrans
                                  className={`font-semibold capitalize`}
                                  ar={item.ProductName}
                                  en={item.ProductName}
                                  length={15}
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
                                className={`flex text-gray-400 w-auto flex-wrap`}
                              >
                                {!isEmpty(item.QuantityMeters) &&
                                  map(
                                    item.QuantityMeters,
                                    (q: QuantityMeters, i) => (
                                      <Fragment key={i}>
                                        {map(q.addons, (addon, i) => (
                                          <>
                                            <TextTrans
                                              key={i}
                                              className={`ltr:border-r-2 ltr:last:border-r-0 ltr:first:pr-1 rtl:border-l-2 rtl:last:border-l-0 rtl:first:pl-1 px-1 text-xxs capitalize`}
                                              ar={`${addon.name_ar} ${addon.Value} X`}
                                              en={`${addon.name_en} ${addon.Value} X`}
                                            />
                                          </>
                                        ))}
                                      </Fragment>
                                    )
                                  )}
                                {!isEmpty(item.RadioBtnsAddons) &&
                                  map(item.RadioBtnsAddons, (r: RadioBtns) => (
                                    <Fragment key={r.addons.attributeID}>
                                      <TextTrans
                                        key={r.addons.attributeID}
                                        className={`ltr:border-r-2 ltr:last:border-r-0 ltr:first:pr-1 rtl:border-l-2 rtl:last:border-l-0 rtl:first:pl-1 px-1 text-xxs capitalize text-gray-400`}
                                        ar={r.addons.name_ar}
                                        en={r.addons.name_en}
                                      />
                                    </Fragment>
                                  ))}
                                {!isEmpty(item.CheckBoxes) &&
                                  map(item.CheckBoxes, (c: CheckBoxes, i) => (
                                    <Fragment key={i}>
                                      {map(c.addons, (addon, i) => (
                                        <TextTrans
                                          key={i}
                                          className={`ltr:border-r-2 ltr:last:border-r-0 ltr:first:pr-1 rtl:border-l-2 rtl:last:border-l-0 rtl:first:pl-1 px-1 text-xxs capitalize`}
                                          ar={addon.name_ar}
                                          en={addon.name_en}
                                        />
                                      ))}
                                    </Fragment>
                                  ))}
                              </div>
                            </div>
                          </div>
                          {item.ExtraNotes && (
                            <div
                              className={`w-full border-t border-gray-200 pt-2`}
                            >
                              <p className={`text-xs`}>
                                {t('notes')} : {item.ExtraNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* meters + / - */}
                      <div className="flex justify-between items-center mt-3">
                        <span className="flex rounded-xl shadow-sm">
                          <button
                            type="button"
                            className="relative -ml-px inline-flex items-center ltr:rounded-l-sm rtl:rounded-r-sm  bg-gray-100 px-1 py-1 text-sm font-medium text-black  focus:z-10 w-10"
                            style={{ color }}
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
                            className="text-md relative -ml-px inline-flex items-center  bg-gray-100 px-4 py-2 text-sm font-medium focus:z-10  capitalize font-extrabold w-10"
                            style={{ color }}
                          >
                            {item.Quantity}
                          </button>
                          <button
                            type="button"
                            className="relative inline-flex items-center ltr:rounded-r-sm rtl:rounded-l-sm bg-gray-100 px-1 py-1 text-sm font-medium text-black  focus:z-10"
                            style={{ color }}
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
                <Promotion className="grayscale" />
                <p
                  className="font-semibold ps-2 capitalize"
                  suppressHydrationWarning={suppressText}
                >
                  {t('promotion_code')}
                </p>
              </div>

              <div className="relative flex items-center justify-between gap-x-2 pt-3">
                <input
                  type="text"
                  placeholder={`${startCase(t('enter_code_here').toString())}`}
                  value={couponVal}
                  onChange={(e) => setCouponVal(e.target.value)}
                  suppressHydrationWarning={suppressText}
                  className={`border-0 border-b-2 ${
                    promoEnabled
                      ? 'border-b-lime-500 focus:border-b-lime-500'
                      : 'border-b-gray-200 focus:border-b-gray-200'
                  } w-full focus:ring-transparent capitalize`}
                />
                {promoEnabled ? (
                  <Done className="!text-lime-500 absolute end-0" />
                ) : (
                  <></>
                )}
              </div>
            </div>

            <div className="px-5 mt-5 hidden">
              <div className="flex items-center">
                <CustomImage
                  className="w-6 h-6 grayscale"
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

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          url: req.headers.host,
        },
      };
    }
);

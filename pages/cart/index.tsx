import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { useEffect, Suspense } from 'react';
import {
  setCurrentModule,
  resetShowFooterElement,
  setShowFooterElement,
} from '@/redux/slices/appSettingSlice';
import NotFound from '@/appImages/not_found.png';
import Image from 'next/image';
import { EditOutlined } from '@mui/icons-material';
import Promotion from '@/appIcons/promotion.svg';
import Notes from '@/appIcons/notes.svg';
import { suppressText } from '@/constants/*';
import CustomImage from '@/components/CustomImage';
import { map, sumBy } from 'lodash';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import {
  removeFromCart,
  decreaseCartQty,
  increaseCartQty,
} from '@/redux/slices/cartSlice';
import { QuantityMeters } from '@/types/index';
const CartIndex: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    branches,
    cart,
    order,
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setCurrentModule(t('cart')));
    dispatch(setShowFooterElement(`cartIndex`));
    return () => {
      dispatch(resetShowFooterElement());
    };
  }, []);
  const handleRemove = (id: any) => {
    dispatch(removeFromCart(id));
    dispatch(
      showToastMessage({
        content: `item removed from cart`,
        type: `info`,
      })
    );
  };
  const handleIncrease = (element: any) => {
    dispatch(increaseCartQty(element));
  };
  const handleDecrease = (element: any) => {
    dispatch(decreaseCartQty(element));
  };
  console.log('the cart', cart);
  return (
    <MainContentLayout>
      <Suspense>
        {/* if cart is empty */}
        {cart.items.length === 0 ? (
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
            {map(cart.items, (item, i) => (
              <div key={i}>
                <div className="px-4">
                  <div className="mb-10 ">
                    <div className="flex px-5">
                      <div className="ltr:pr-3 rtl:pl-3 w-1/5">
                        <CustomImage
                          className="w-full  rounded-lg border-[1px] border-gray-200"
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
                            <button>
                              <EditOutlined />
                            </button>
                          </div>
                        </div>
                        <p className="font-semibold">{item.ProductName}</p>
                        <div className="flex">
                          {map(item.QuantityMeters, (a: QuantityMeters) => (
                            <div className="w-fit pb-2">
                              <p className="text-xs px-2 pe-3 text-gray-400 border-e-2 border-gray-400 w-auto">
                                {a.addons[0].name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="px-3 flex justify-between items-center mt-3">
                      {/* <div>
                      <button className="bg-gray-100 text-primary_BG outline-none p-2 mx-2 rounded-md font-semibold">
                        <RemoveOutlined />
                      </button>
                      <button className="text-primary_BG">quantity</button>
                      <button className="bg-gray-100 text-primary_BG outline-none p-2 mx-2 rounded-md font-semibold">
                        <AddOutlined />
                      </button>
                    </div> */}
                      <span className="flex rounded-xl shadow-sm">
                        <button
                          type="button"
                          className="relative inline-flex items-center ltr:rounded-l-xl rtl:rounded-r-xl bg-gray-100 px-4 py-2 text-sm font-medium text-black  focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                          onClick={() => {
                            handleDecrease(item);
                          }}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="relative -ml-px inline-flex items-center  bg-gray-100 px-4 py-2 text-sm font-medium text-primary_BG  focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                        >
                          {item.totalQty}
                        </button>
                        <button
                          type="button"
                          className="relative -ml-px inline-flex items-center ltr:rounded-r-xl rtl:rounded-l-xl  bg-gray-100 px-4 py-2 text-sm font-medium text-black  focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                          onClick={() => {
                            handleIncrease(item);
                          }}
                        >
                          +
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
                  </div>
                </div>
                <div className="mt-10 px-5 py-2 bg-gray-100"></div>
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
                  type="number"
                  placeholder={`${t('enter_code_here')}`}
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
                className={`border-0 border-b-2 border-b-gray-200 w-full focus:ring-transparent`}
              />
            </div>
            <div className={`px-4 py-4`}>
              <div className="flex justify-between mb-3 text-lg">
                <p suppressHydrationWarning={suppressText}>{t('subtotal')}</p>
                <p suppressHydrationWarning={suppressText}>
                  {sumBy(cart.items, (item: any) => item.subTotalPrice)}{' '}
                  {t('kwd')}
                </p>
              </div>
              <div className="flex justify-between mb-3 text-lg">
                <p suppressHydrationWarning={suppressText}>{t('subtotal')}</p>
                <p suppressHydrationWarning={suppressText}>
                  {sumBy(cart.items, (item: any) => item.subTotalPrice)}{' '}
                  {t('kwd')}
                </p>
              </div>

              <div className="flex justify-between mb-3 text-lg ">
                <p
                  className="font-semibold"
                  suppressHydrationWarning={suppressText}
                >
                  {t('total')}
                </p>
                <p
                  className="text-primary_BG"
                  suppressHydrationWarning={suppressText}
                >
                  {cart.grossTotal} {t('kwd')}
                </p>
              </div>
            </div>
          </div>
        )}
      </Suspense>
    </MainContentLayout>
  );
};

export default CartIndex;

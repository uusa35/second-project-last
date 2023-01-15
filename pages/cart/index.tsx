import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
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
import { removeFromCart, resetCart, decreaseCartQty, increaseCartQty } from '@/redux/slices/cartSlice';
import { useState } from 'react';
const CartIndex: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    branches,
    cart,
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [currentQty, setCurrentyQty] = useState<number>(0);
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
  }
  const handleIncrease = (element: any) => {
    dispatch(increaseCartQty(element));
    dispatch(
      showToastMessage({
        content: `item count increased`,
        type: `success`,
      })
    );
  }
  const handleDecreae = (element: any) => {
    dispatch(decreaseCartQty(element));
    dispatch(
      showToastMessage({
        content: `item count decreased`,
        type: `success`,
      })
    );
  }
  console.log('the cart', cart);

  return (
    <MainContentLayout>
       {/* if cart is empty */}
      {cart.items.length === 0 ?  <div className={'px-4'}>
      <div className="flex justify-center py-5">
            <p suppressHydrationWarning={suppressText}>
              {t('your_cart_is_empty')}
            </p>
          </div>
      </div> :
      <div className={'px-4'}>
        {map(cart.items, i => (
          <div key={i.ProductID}>
            <div>
              <p className="mx-7 text-lg" suppressHydrationWarning={suppressText}>
                {t('items')}
              </p>
              <div className=" pt-5">
                <div className="mb-10 ">
                  <div className="flex px-5">
                    <div className="ltr:pr-3 rtl:pl-3 w-1/5">
                      <CustomImage
                        className="w-full  rounded-lg border-[1px] border-gray-200"
                        alt={`${t('item')}`}
                        src={i.image? i.image: NotFound.src}
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
                              handleRemove(i.ProductID);
                            }}
                          >
                            {t('remove')}
                          </button>
                          <button>
                            <EditOutlined />
                          </button>
                        </div>
                      </div>
                      <p className="font-semibold">{i.ProductName}</p>
                      <div className='flex'>
                        {map(i.QuantityMeters, a => (
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
                        className="relative inline-flex items-center ltr:rounded-l-xl rtl:rounded-r-xl bg-primary_BG px-4 py-2 text-sm font-medium text-white  focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecreae(i);
                        }}
                      >
                        -
                      </button>
                      <button
                        type="button"
                        className="relative -ml-px inline-flex items-center  bg-primary_BG px-4 py-2 text-sm font-medium text-white  focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {i.totalQty}
                      </button>
                      <button
                        type="button"
                        className="relative -ml-px inline-flex items-center ltr:rounded-r-xl rtl:rounded-l-xl  bg-primary_BG px-4 py-2 text-sm font-medium text-white  focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIncrease(i);
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
                        {i.Price} {t('kwd')}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-200 w-full mt-5 p-0 h-2"></div>
                </div>
              </div>
            </div>
            <div className="mt-10 px-5 py-7 bg-gray-100">
        </div>
          </div>
        ))
          
        }

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
            <CustomImage className="w-6 h-6" src={Notes} alt={`${t('note')}`} />
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

        <div>
            <div className="flex justify-between mb-3 text-lg">
              <p suppressHydrationWarning={suppressText}>{t('subtotal')}</p>
              <p suppressHydrationWarning={suppressText}>{sumBy(cart.items, (item: any) => item.subTotalPrice)} {t('kwd')}</p>
            </div>

            <div className="flex justify-between mb-3 text-lg">
              <p suppressHydrationWarning={suppressText}>
                {t('delivery_services')}
              </p>
              <p suppressHydrationWarning={suppressText}>
                {0} {t('kwd')}
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
        
      </div>}
    </MainContentLayout>
  );
};

export default CartIndex;

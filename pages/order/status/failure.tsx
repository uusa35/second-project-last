import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import Image from 'next/image';
import Failure from '@/appImages/failed.png';
import {
  suppressText,
  submitBtnClass,
  appLinks,
  imageSizes,
} from '@/constants/*';
import { useTranslation } from 'react-i18next';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomImage from '@/components/CustomImage';
import { useEffect } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
const OrderFailure: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { 
    branch: { id: branchId },
    area: { id: areaId},
    customer: { userAgent },
  } = useAppSelector((state) => state);
  const { data: cartItems, isSuccess } = useGetCartProductsQuery({
    UserAgent: userAgent,
  });
  const dispatch = useAppDispatch();
    useEffect(() => {
      dispatch(setCurrentModule(t('order_failure')));
    }, []);
  return (
    <MainContentLayout>
      <div>
        <div className="flex flex-col items-center capitalize">
          <CustomImage
            src={Failure.src}
            alt={`${t('failure')}`}
            width={imageSizes.sm}
            height={imageSizes.sm}
          />
          <h4
            className="text-CustomRed font-semibold py-3"
            suppressHydrationWarning={suppressText}
          >
            {t('we_re_sorry')}
          </h4>
          <p suppressHydrationWarning={suppressText}>
            {t('your_order_placement_is_failed')}
          </p>
        </div>
        <div className="mt-10 px-5 py-1 bg-gray-100"></div>
        <div className="px-2">
          <div className="w-[60%] m-auto">
            <p
              className="text-center pt-4 pb-2"
              suppressHydrationWarning={suppressText}
            >
              {t(
                'you_can_retry_your_order_placement_or_check_your_cart_items_before_processing_your_order'
              )}
            </p>
          </div>
          <Link
            href={appLinks.cartIndex.path}
            className={`${submitBtnClass} flex items-center justify-center`}
            suppressHydrationWarning={suppressText}
          >
              <div className="bg-CustomRed rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                <p>{cartItems.data?.Cart?.length}</p>
              </div>
              <ShoppingBagOutlinedIcon className="w-6 h-6" />
              <p className="pt-1">{t('my_cart')}</p>
          </Link>
          <Link href={appLinks.productSearchIndex(branchId, ``, areaId)}>
            <p
              className={`${submitBtnClass} text-center`}
              suppressHydrationWarning={suppressText}
            >
              {t('retry_order')}
            </p>
          </Link>
        </div>
      </div>
    </MainContentLayout>
  );
};
export default OrderFailure;

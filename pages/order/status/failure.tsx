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
import { themeColor } from '@/redux/slices/vendorSlice';
import { wrapper } from '@/redux/store';

type Props = {
  url: string;
};
const OrderFailure: NextPage<Props> = ({ url }): JSX.Element => {
  const { t } = useTranslation();
  const {
    branch: { id: branchId },
    area: { id: areaId },
    customer: { userAgent },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const { data: cartItems, isSuccess } = useGetCartProductsQuery({
    UserAgent: userAgent,
    url,
  });
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setCurrentModule('order_failure'));
  }, []);
  return (
    <MainContentLayout>
      <div>
        <div className="flex flex-col items-center capitalize">
          <CustomImage
            src={Failure.src}
            alt={`${t('failure')}`}
            className={`w-22 h-auto`}
            width={imageSizes.sm}
            height={imageSizes.sm}
          />
          <h4
            className="text-red-700 font-semibold py-3"
            suppressHydrationWarning={suppressText}
          >
            {t('we_r_sorry')}
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
          {isSuccess && cartItems.data?.Cart?.length > 0 && (
            <Link
              href={appLinks.cartIndex.path}
              className={`${submitBtnClass} flex items-center justify-center gap-x-3`}
              suppressHydrationWarning={suppressText}
              style={{ backgroundColor: color }}
            >
              <div className="relative">
                <ShoppingBagOutlinedIcon className="w-6 h-6 drop-shadow-sm" />
                <div className="absolute -left-2 -top-2 opacity-90  rounded-full bg-red-600 w-6 h-6 top-0 shadow-xl flex items-center justify-center text-white">
                  <span className={`pt-[3.5px] shadow-md`}>
                    {cartItems.data?.Cart?.length}
                  </span>
                </div>
              </div>
              <p className="pt-1">{t('my_cart')}</p>
            </Link>
          )}
          <Link href={appLinks.productSearchIndex(branchId, ``, areaId)}>
            <p
              className={`${submitBtnClass}  text-center`}
              style={{ backgroundColor: color }}
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

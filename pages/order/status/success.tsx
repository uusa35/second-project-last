import { NextPage } from "next";
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from "react-i18next";
import Image from 'next/image';
import Link from 'next/link'
import Success from '@/appImages/success.png';
import { submitBtnClass, suppressText, appLinks } from "@/constants/*";
import { useAppSelector } from '@/redux/hooks';
import { kebabCase, lowerCase } from 'lodash';
import { useCheckOrderStatusQuery } from "@/redux/api/orderApi";

const OrderSuccess: NextPage = () => {
    const { t } = useTranslation();
    const {
        branch: { id: branchId },
        area: { id: areaId}
      } = useAppSelector((state) => state);
      const { data: orderSuccess, isSuccess} = useCheckOrderStatusQuery({
        status: 'success',
        order_id: `${130}`
    });
    console.log({orderSuccess})
    return (
        <MainContentLayout>
           <div>
            <div className="flex flex-col items-center">
                <Image 
                    src={Success} 
                    alt={`${t('success')}`} 
                    width={80} 
                    height={80} 
                    suppressHydrationWarning={suppressText} 
                />
                <h4 className="text-primary_BG font-semibold py-3" suppressHydrationWarning={suppressText}>
                    {t('thank_you')}
                </h4>
                <p suppressHydrationWarning={suppressText}>
                    {t('your_order_is_confirmed_and_on_its_way')}
                </p>
            </div>
            <div className="mt-10 px-5 py-1 bg-gray-100"></div>
            <div className="px-4">
                <div className="flex justify-between pt-4">
                    <h4 className="text-base font-semibold text-primary_BG" suppressHydrationWarning={suppressText}>
                        {t('order_id')}
                    </h4>
                    <p>{orderSuccess?.data.order_id}</p>
                </div>
                <div className="flex justify-between pt-4">
                    <h4 className="text-base font-semibold text-primary_BG" suppressHydrationWarning={suppressText}>
                        {t('vendor_name')}
                    </h4>
                    <p>{orderSuccess?.data.vendor_name}</p>
                </div>
            </div>
            <div className="mt-5 px-5 py-1 bg-gray-100"></div>
                <div className="px-2">
                    <p className="text-center pt-4 pb-2" suppressHydrationWarning={suppressText}>
                        {t('track_your_order_and_check_the_status_of_it_live')}
                    </p>
                    <Link href={{
                        pathname: `/order/receipt`,
                        query: {order_id: orderSuccess?.data.order_id}
                    }}>
                        <p className={`${submitBtnClass} text-center`} suppressHydrationWarning={suppressText}>
                            {t('view_receipt')}
                        </p>
                    </Link>
                    <Link href={{
                        pathname: `/order/track`,
                        query: {order_id: orderSuccess?.data.order_id}
                    }}>
                        <p className={`${submitBtnClass} text-center`} suppressHydrationWarning={suppressText}>
                            {t('track_order')}
                        </p>
                    </Link>
                    <Link  href={appLinks.productSearchIndex(branchId, ``, areaId)}>
                        <p className={`${submitBtnClass} text-center`} suppressHydrationWarning={suppressText}>
                            {t('order_again')}
                        </p>
                    </Link>
                </div>
           </div>
        </MainContentLayout>
    )
}

export default OrderSuccess;
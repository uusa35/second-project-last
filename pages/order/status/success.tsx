import { NextPage } from "next";
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from "react-i18next";
import Image from 'next/image';
import Success from '@/appImages/success.png';
import { submitBtnClass, suppressText } from "@/constants/*";
const OrderSuccess: NextPage = () => {
    const { t } = useTranslation();
    return (
        <MainContentLayout>
           <div>
            <div className="flex flex-col items-center">
                <Image src={Success} alt={`${t('success')}`} width={80} height={80} suppressHydrationWarning={suppressText} />
                <h4 className="text-primary_BG font-semibold py-3" suppressHydrationWarning={suppressText}>{t('thank_you')}</h4>
                <p suppressHydrationWarning={suppressText}>{t('your_order_is_confirmed_and_on_its_way')}</p>
            </div>
            <div className="mt-10 px-5 py-1 bg-gray-100"></div>
            <div className="px-4">
                <div className="flex justify-between pt-4">
                    <h4 className="text-base font-semibold text-primary_BG" suppressHydrationWarning={suppressText}>{t('order_id')}</h4>
                    <p>id</p>
                </div>
                <div className="flex justify-between pt-4">
                    <h4 className="text-base font-semibold text-primary_BG" suppressHydrationWarning={suppressText}>{t('estimated_time')}</h4>
                    <p>time</p>
                </div>
            </div>
            <div className="mt-5 px-5 py-1 bg-gray-100"></div>
                <div className="px-2">
                    <p className="text-center pt-4 pb-2" suppressHydrationWarning={suppressText}>{t('track_your_order_and_check_the_status_of_it_live')}</p>
                    <button className={`${submitBtnClass}`} suppressHydrationWarning={suppressText}>{t('view_receipt')}</button>
                    <button className={`${submitBtnClass}`} suppressHydrationWarning={suppressText}>{t('track_order')}</button>
                    <button className={`${submitBtnClass}`} suppressHydrationWarning={suppressText}>{t('order_again')}</button>
                </div>
           </div>
        </MainContentLayout>
    )
}

export default OrderSuccess;
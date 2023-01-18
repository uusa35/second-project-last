import MainContentLayout from "@/layouts/MainContentLayout";
import { useAppSelector } from "@/redux/hooks";
import { NextPage } from "next"; 
import Image from "next/image";
import { imgUrl, suppressText } from '@/constants/*';
import { useTranslation } from "react-i18next";
const Receipt: NextPage = (): JSX.Element => {
    const { vendor } = useAppSelector(state=>state);
    const { t } = useTranslation();
    return (
        <MainContentLayout>
            <div>
                <div className="flex px-4 justify-between pt-5">
                    <div className="flex items-center">
                        <Image src={`${imgUrl(vendor.logo)}`} alt='logo' width={60} height={60} />
                        <h4 className="px-2 font-semibold">{vendor.name}</h4>
                    </div>
                    <h4 className="px-2 font-semibold" suppressHydrationWarning={suppressText}>
                        {t('order')} {}
                    </h4>
                </div>
                <p className="font-semibold text-center pt-2" suppressHydrationWarning={suppressText}>
                    {t('pick_up_now')}
                </p>
                <div className="my-5 px-5 py-1 bg-gray-100"></div>
                <div className="flex justify-between px-4 py-2">
                    <div>
                        <h4 className="font-semibold" suppressHydrationWarning={suppressText}>
                            {t('customer_info')}
                        </h4>
                        <p>name</p>
                        <p>phone</p>
                        <p>email</p>
                    </div>
                    <div>
                        <h4 className="font-semibold" suppressHydrationWarning={suppressText}>
                            {t('pick_up_details')}
                        </h4>
                        <p suppressHydrationWarning={suppressText}>{t('branch')}</p>
                        <p suppressHydrationWarning={suppressText}>{t('map_location')}</p>
                    </div>
                </div>
                <div className="px-4">
                    <h4 className="font-semibold pb-2" suppressHydrationWarning={suppressText}>
                        {t('payment_details')}
                    </h4>
                </div>
                <div className="px-4">
                    <h4 className="font-semibold pb-2" suppressHydrationWarning={suppressText}>
                        {t('order_details')}
                    </h4>
                </div>
                <div className="my-5 px-5 py-1 bg-gray-100"></div>
                <div className="px-4">
                    <h4 className="font-semibold pb-2" suppressHydrationWarning={suppressText}>
                        {t('order_summary')}
                    </h4>
                    <div className="flex justify-between font-semibold">
                        <h5 suppressHydrationWarning={suppressText}>{t('qty')}</h5>
                        <h5 suppressHydrationWarning={suppressText}>{t('item')}</h5>
                        <h5 suppressHydrationWarning={suppressText}>{t('add_on')}</h5>
                        <h5 suppressHydrationWarning={suppressText}>{t('sp_req')}</h5>
                        <h5 suppressHydrationWarning={suppressText}>{t('price')}</h5>
                        <h5 suppressHydrationWarning={suppressText}>{t('total')}</h5>
                    </div>
                    <div className="flex justify-between">
                        <h5>qty</h5>
                        <h5>item</h5>
                        <h5>add on</h5>
                        <h5>sp_req</h5>
                        <h5>price</h5>
                        <h5>total</h5>
                    </div>
                </div>
                <div className={`px-4 py-4`}>
                    <div className="flex justify-between mb-3 text-lg">
                        <p suppressHydrationWarning={suppressText}>{t('subtotal')}</p>
                        <p suppressHydrationWarning={suppressText}>
                        {t('kwd')}
                        </p>
                    </div>
                    <div className="flex justify-between mb-3 text-lg">
                        <p suppressHydrationWarning={suppressText}>{t('delivery_services')}</p>
                        <p suppressHydrationWarning={suppressText}>
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
                        {t('kwd')}
                        </p>
                    </div>
                </div>
            </div>
        </MainContentLayout>
    )
}
export default Receipt;
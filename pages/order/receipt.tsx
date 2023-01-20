import MainContentLayout from "@/layouts/MainContentLayout";
import { useAppSelector } from "@/redux/hooks";
import { NextPage } from "next"; 
import Image from "next/image";
import { imgUrl, suppressText } from '@/constants/*';
import { useTranslation } from "react-i18next";
import { useGetInvoiceQuery } from "@/redux/api/orderApi";
import { map } from "lodash";
const Receipt: NextPage = (): JSX.Element => {
    const { vendor } = useAppSelector(state=>state);
    const { data: order, isSuccess} = useGetInvoiceQuery({order_id: `${130}`});
    const { t } = useTranslation();
    const handleMapLocation = (lat: string, long: string) => {
        window.open(`https://maps.google.com?q=${lat},${long}`);
    }
    console.log("order", order)
    return (
        <MainContentLayout>
            <div>
                <div className="flex px-4  pt-5 justify-between items-center">
                    <div className="flex items-center">
                        <Image src={`${imgUrl(vendor.logo)}`} alt='logo' width={60} height={60} />
                        <h4 className="px-2 font-semibold">{vendor.name}</h4>
                    </div>
                    <h4 className="px-2 font-semibold" suppressHydrationWarning={suppressText}>
                        {t('order')} {order?.data.order_code}
                    </h4>
                </div>
                <p className="font-semibold text-center pt-2" suppressHydrationWarning={suppressText}>
                    {t(`${order?.data.order_type}`)}
                </p>
                <div className="my-5 px-5 py-1 bg-gray-100"></div>
                <div className="flex justify-between px-4 py-2">
                    <div>
                        <h4 className="font-semibold" suppressHydrationWarning={suppressText}>
                            {t('customer_info')}
                        </h4>
                        <p className='py-1'>{order?.data.customer.name}</p>
                        <p className='py-1'>{order?.data.customer.phone}</p>
                        <p className='py-1'>{order?.data.customer.email}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold" suppressHydrationWarning={suppressText}>
                            {t('pick_up_details')}
                        </h4>
                        <p className='py-1' suppressHydrationWarning={suppressText}>{t('branch')} {order?.data.pickup_details.branch}</p>
                        <button suppressHydrationWarning={suppressText}
                        className='capitalize text-primary_BG py-1'
                        onClick={()=>handleMapLocation(order?.data.pickup_details.latitude, order?.data.pickup_details.longitude)} 
                        >{t('map_location')}</button>
                    </div>
                </div>
                <div className="px-4">
                    <h4 className="font-semibold pb-2" suppressHydrationWarning={suppressText}>
                        {t('payment_details')}
                    </h4>
                    <p>{order?.data.payment_type}</p>
                </div>
                <div className="px-4 pt-4">
                    <h4 className="font-semibold pb-2" suppressHydrationWarning={suppressText}>
                        {t('order_details')}
                    </h4>
                    <div className="flex items-center py-1">
                        <p className='pe-2' suppressHydrationWarning={suppressText}>{t('store_branch')}</p>
                        <p>{order?.data.order_details.branch} {order?.data.order_details.branch_address}</p>
                    </div>
                    <div className="flex items-center py-1">
                        <p className='pe-2' suppressHydrationWarning={suppressText}>{t('time_date')}</p>
                        <p>{order?.data.order_details.order_time} {order?.data.order_details.order_date}</p>
                    </div>

                </div>
                <div className="my-5 px-5 py-1 bg-gray-100"></div>
                <div className="px-4">
                    <h4 className="font-semibold pb-2" suppressHydrationWarning={suppressText}>
                        {t('order_summary')}
                    </h4>
                    <div className='relative overflow-x-auto '>
                <table className="table-auto w-full text-left mb-5">
                    <thead>
                        <tr className='whitespace-nowrap'>
                            <th scope="col" className="py-3 px-3" suppressHydrationWarning={suppressText}>{t('qty')}</th>
                            <th scope="col" className="py-3 px-3" suppressHydrationWarning={suppressText}>{t('item')}</th>
                            <th scope="col" className="py-3 px-3" suppressHydrationWarning={suppressText}>{t('add_on')}</th>
                            <th scope="col" className="py-3 px-3" suppressHydrationWarning={suppressText}>{t('sp_req')}</th>
                            <th scope="col" className="py-3 px-3" suppressHydrationWarning={suppressText}>{t('price')}</th>
                            <th scope="col" className="py-3 px-3" suppressHydrationWarning={suppressText}>{t('total')}</th>

                        </tr>
                    </thead>
                    <tbody>
                    {map(order?.data.order_summary.items, (item, idx) => <tr key={idx}>
                                    <td className='py-3 px-3'>{item.quantity}</td>
                                    <td className='py-3 px-3'>{item.item}</td>
                                    <td className='py-3 px-3'>{map(item.addon, (a)=> <span 
                                    className={`${
                                      item.addon.length > 1 &&
                                      'border-e-2 border-gray-400 pe-1'
                                    }`}>{a}</span>)}</td>
                                    <td className='py-3 px-3'></td>
                                    <td className='py-3 px-3'>{item.price}</td>
                                    <td className='py-3 px-3'>{item.total}{t("kwd")}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
                </div>
                <div className={`px-4 py-4`}>
                    <div className="flex justify-between mb-3 text-lg">
                        <p suppressHydrationWarning={suppressText}>{t('subtotal')}</p>
                        <p suppressHydrationWarning={suppressText}>
                        {order?.data.order_summary.sub_total} {t('kwd')}
                        </p>
                    </div>
                    <div className="flex justify-between mb-3 text-lg">
                        <p suppressHydrationWarning={suppressText}>{t('delivery_services')}</p>
                        <p suppressHydrationWarning={suppressText}>
                        {order?.data.order_summary.delivery_fee} {t('kwd')}
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
                        {order?.data.order_summary.total} {t('kwd')}
                        </p>
                    </div>
                </div>
            </div>
        </MainContentLayout>
    )
}
export default Receipt;
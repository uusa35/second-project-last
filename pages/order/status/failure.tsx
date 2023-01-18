import MainContentLayout from "@/layouts/MainContentLayout";
import { NextPage } from "next";
import Image from "next/image";
import Failure from '@/appImages/failed.png';
import { suppressText, submitBtnClass } from '@/constants/*';
import { useTranslation } from "react-i18next";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
const OrderFailure: NextPage = (): JSX.Element => {
    const { t } = useTranslation();
    return (
        <MainContentLayout>
            <div>
                <div className="flex flex-col items-center">
                    <Image src={Failure} alt={`${t('failure')}`} width={80} height={80} suppressHydrationWarning={suppressText} />
                    <h4 className="text-CustomRed font-semibold py-3" suppressHydrationWarning={suppressText}>{t('we_re_sorry')}</h4>
                    <p suppressHydrationWarning={suppressText}>{t('your_order_placement_is_failed')}</p>
                </div>
                <div className="mt-10 px-5 py-1 bg-gray-100"></div>
                <div className="px-2">
                    <div className="w-[60%] m-auto">
                    <p className="text-center pt-4 pb-2" suppressHydrationWarning={suppressText}>
                        {t('you_can_retry_your_order_placement_or_check_your_cart_items_before_processing_your_order')}
                    </p>
                    </div>
                    <button className={`${submitBtnClass}`} suppressHydrationWarning={suppressText}>
                        <div className="flex items-center justify-center">
                            <div className="bg-CustomRed rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                                <p>0</p>
                            </div>
                            <ShoppingBagOutlinedIcon className="w-6 h-6" />
                            <p className="pt-1">{t('my_cart')}</p>
                        </div>
                    </button>
                    <button className={`${submitBtnClass}`} suppressHydrationWarning={suppressText}>{t('retry_order')}</button>
                </div>
            </div>
        </MainContentLayout>
    )
}
export default OrderFailure;
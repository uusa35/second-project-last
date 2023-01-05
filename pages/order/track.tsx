import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import {suppressText, inputFieldClass, submitBtnClass} from '@/constants/*';


const TrackOrder: NextPage = (): JSX.Element => {
  const {t} = useTranslation();
  return (
    <MainContentLayout>
       <div>
        <h4 className='text-center text-primary_BG font-semibold pt-2' suppressHydrationWarning={suppressText}>{t('track_order')}</h4>
        <div className="px-5 mb-7">
            <p className="my-3">{t('check_your_order_status')}</p>
            <input
            className={`${inputFieldClass}`}
            type="text"
            placeholder={`${t('enter_order_id')}`}
            suppressHydrationWarning={suppressText}
            />
        </div>
            { 
                <div>
                     <div className="pb-2 px-7">
                        <div className="flex justify-between mt-4">
                        <p className=" text-btnBG text-primary_BG font-semibold" suppressHydrationWarning={suppressText}>{t("order_id")}</p>
                        <p>{}</p>
                        </div>

                        <div className="flex justify-between mt-5">
                        <p className="text-primary_BG font-semibold" suppressHydrationWarning={suppressText}>{t("estimated_time")}</p>
                        <p>{}</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-end px-7">
                        <p className="text-primary_BG font-semibold" suppressHydrationWarning={suppressText}>{t("order_pending")}</p>
                        <p className="text-primary_BG font-semibold"></p>
                    </div>
                    <div className="flex flex-col items-center pt-14">
                        <p className="mb-4 text-lg" suppressHydrationWarning={suppressText}>{t("delivering_to_your_address")}</p>
                        <p className="text-lg text-center">{}</p>
                    </div>
                    <div className='pt-10'>
                      <button className={`${submitBtnClass} px-4`}>
                        <div className='flex justify-between items-center'>
                          <a href='tel:+' className='text-white px-2' suppressHydrationWarning={suppressText}>{t("call_delivery")}</a>
                          <a href='tel:+' className='text-White' suppressHydrationWarning={suppressText}>{}</a>
                        </div>
                      </button>
                    </div>
                </div>
            }
        </div>
    </MainContentLayout>
  );
};

export default TrackOrder;

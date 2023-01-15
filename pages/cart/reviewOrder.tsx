import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import TrunkClock from '@/appIcons/trunk_clock.svg';
import { suppressText } from '@/constants/*';
import { LocationOnOutlined } from '@mui/icons-material';
import Home from '@/appIcons/home.svg';
import IDCard from '@/appIcons/id_card.svg';
import OrderSummary from '@/appIcons/summary.svg';
import CustomImage from '@/components/CustomImage';
import NotFound from '@/appImages/not_found.png';
const ReviewOrder: NextPage = () => {
    const { t } = useTranslation();
    return (
        <MainContentLayout>
            <div className={'px-4'}>
                <div className='flex justify-center items-center py-5'>
                    <Image src={TrunkClock} alt={`${t('trunk')}`} width={60} height={60} />
                    <div className='px-2'>
                        <h4 className='font-semibold text-lg'>{t('expected_delivery_time')}</h4>
                        <p>{}</p>
                    </div>
                </div>
                <div className="bg-gray-200 w-full mt-5 p-0 h-2"></div>
                {/* location */}
                <div className='py-5'>
                    <div className='flex justify-between'>
                        <div className='flex'>
                            <LocationOnOutlined className='text-primary_BG' />
                            <h5 className='px-2 text-base font-semibold' suppressHydrationWarning={suppressText}>
                                {t('delivery_to')}
                            </h5>
                        </div>
                        <button className='text-primary_BG text-base font-semibold' suppressHydrationWarning={suppressText}>
                            {t('change')}
                        </button>
                    </div>
                    <div className="w-full h-36 rounded-md">
                        {/* <GoogleMapReact
                        bootstrapURLKeys={{
                        // remove the key if you want to fork
                        key: 'AIzaSyChibV0_W_OlSRJg2GjL8TWVU8CzpRHRAE',
                        language: 'en',
                        region: 'US',
                        }}
                        defaultCenter={{
                        lat: parseInt(b.lat),
                        lng: parseInt(b.lang),
                        }}
                        defaultZoom={11}
                        >  
                        </GoogleMapReact> */}
                    </div>
                    <div className='flex justify-between'>
                        <div className='flex items-center'>
                            <Image src={Home} alt='home' width={25} height={25} />
                            <p className='text-md ps-5'>location</p>
                        </div>
                        <button className='text-primary_BG text-base font-semibold' suppressHydrationWarning={suppressText}>
                            {t('edit')}
                        </button>
                    </div>
                </div>
                <div className='flex justify-between items-center py-3'>
                    <div className='flex items-center'>
                        <Image src={IDCard} alt='id' width={25} height={25}/>
                        <div className='ps-5'>
                            <h4 className='font-semibold text-lg'>
                                customer name
                            </h4>
                            <p>customer phone</p>
                        </div>
                    </div>
                    <button className='text-primary_BG text-base font-semibold' suppressHydrationWarning={suppressText}>
                        {t('edit')}
                    </button>
                </div>
                <div>
                <div className='flex items-center py-3'>
                        <Image src={OrderSummary} alt='id' width={25} height={25}/>
                        <div className='ps-5'>
                            <h4 className='font-semibold text-lg'>
                                {t('order_summary')}
                            </h4>
                        </div>
                    </div>
                </div>
                <div className=" pt-5">
              <div className="mb-10 ">
                <div className="flex px-5">
                  <div className="ltr:pr-3 rtl:pl-3 w-1/5">
                    <CustomImage
                      className="w-full  rounded-lg border-[1px] border-gray-200"
                      alt={`${t('item')}`}
                      src={NotFound.src}
                    />
                  </div>

                  <div className="w-full">
                    <p className="font-semibold">product name</p>
                    <div className="w-fit pb-2">
                      <p className="text-xs pe-3 text-gray-400 border-e-2 border-gray-400 w-auto">
                        addons
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-200 w-full mt-5 p-0 h-2"></div>
              </div>
            </div>
            </div>
        </MainContentLayout>
    )
}

export default ReviewOrder;
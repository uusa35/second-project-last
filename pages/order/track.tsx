import { useEffect, useState, Suspense } from 'react';
import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import { suppressText, submitBtnClass } from '@/constants/*';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { useAppDispatch } from '@/redux/hooks';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useLazyCheckOrderStatusQuery, useLazyTrackOrderQuery } from '@/redux/api/orderApi';
import { debounce, isEmpty, lowerCase, snakeCase } from 'lodash';
import { useRouter } from 'next/router';

const TrackOrder: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [trigger, { data, isSuccess }] = useLazyTrackOrderQuery();
  const [checkOrderStatus, { data: orderSuccess, isSuccess: isSuccessOrder }] = useLazyCheckOrderStatusQuery();
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    dispatch(setCurrentModule(t('track_order')));
  }, []);

  const handleChange = async (order_code: string) => {
    await checkOrderStatus({
      status: 'success',
      order_id: `${router.query.order_id}`
    })
    .then((r: any) => {
      setOrderCode(r.data.data.orderCode);
      console.log({orderCode})
      trigger({ order_code: `${orderCode}` })
        .then((r: any) => {
          console.log({res: r});
          console.log({data})
        })
      }
      )
  };


  return (
    <MainContentLayout>
      <h4
        className="text-center text-primary_BG font-semibold pt-2"
        suppressHydrationWarning={suppressText}
      >
        {t('track_order')}
      </h4>
      <div className="px-5 pb-7 border-b-[12px] border-stone-100">
        <p className="my-3 text-sm font-semibold">
          {t('check_your_order_status')}
        </p>
        <div className={`w-full`}>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="search"
              name="search"
              id="search"
              onChange={debounce((e) => handleChange(e.target.value), 400)}
              className="block w-full rounded-md  focus:ring-1 focus:ring-primary_BG pl-10 border-none bg-gray-100 capitalize h-14"
              suppressHydrationWarning={suppressText}
              placeholder={`${t(`enter_order_id`)}`}
            />
          </div>
          <Suspense>
            {isSuccess &&
              !isEmpty(data) &&
              !data?.status &&
              orderCode &&
              orderCode?.length > 2 && (
                <p
                  className=" text-sm font-semibold text-red-700 text-center pt-6"
                  suppressHydrationWarning={suppressText}
                >
                  {data && data.msg && t(lowerCase(snakeCase(data.msg)))}
                </p>
              )}
          </Suspense>
        </div>
      </div>
      <Suspense>
        {isSuccess &&
          data &&
          data?.status &&
          orderCode &&
          orderCode?.length > 2 && (
            <div>
              <div className="p-7 border-b-[12px] border-stone-100">
                <div className="flex justify-between mt-4">
                  <p
                    className="text-primary_BG font-semibold"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('order_id')}
                  </p>
                  <p>{router.query.order_id}</p>
                </div>

                <div className="flex justify-between mt-5">
                  <p
                    className="text-primary_BG font-semibold"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('estimated_time')}
                  </p>
                  <p>{data.data.estimated_time}</p>
                </div>
              </div>
              <div className={`p-7`}>
                <div className="flex justify-between items-end  mb-5 ">
                  <p
                    className="font-semibold"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('order_status')}
                  </p>
                  <p>{data.data.order_status}</p>
                </div>
                <div className="flex justify-between items-end  ">
                  <p
                    className="font-semibold"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('order_time')}
                  </p>
                  <p className="font-semibold">{data.data.order_time}</p>
                </div>
              </div>

              <div className="flex flex-col items-center pt-5">
                <p
                  className="mb-4 text-lg"
                  suppressHydrationWarning={suppressText}
                >
                  {t('delivering_to_your_address')}
                </p>
                <p className="text-lg text-center text-primary_BG">{}</p>
              </div>
              <div className="pt-5 px-4 mt-[40%]">
                <button className={`${submitBtnClass} px-4`}>
                  <div className="flex justify-between items-center">
                    <a
                      href={`tel:+${data.data.branch_phone}`}
                      className="text-white px-2"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('call_delivery')}
                    </a>
                    <a
                      href={`tel:+${data.data.branch_phone}`}
                      className="text-White"
                      suppressHydrationWarning={suppressText}
                    >
                      {data.data.branch_phone}
                    </a>
                  </div>
                </button>
              </div>
            </div>
          )}
      </Suspense>
    </MainContentLayout>
  );
};

export default TrackOrder;

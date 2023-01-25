import { useEffect, useState, Suspense, useCallback } from 'react';
import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import { suppressText, submitBtnClass } from '@/constants/*';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { useAppDispatch } from '@/redux/hooks';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  useLazyCheckOrderStatusQuery,
  useLazyTrackOrderQuery,
} from '@/redux/api/orderApi';
import { debounce, isEmpty, lowerCase, snakeCase } from 'lodash';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/LoadingSpinner';

const TrackOrder: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [trigger, { data, isSuccess, isLoading }] = useLazyTrackOrderQuery();

  const handleChange = (order_code: string) => {
    if (order_code && order_code.length >= 3) {
      trigger({ order_code: `${order_code}` });
    }
  };

  useEffect(() => {
    if (router.isReady && router.query.order_code) {
      handleChange(`${router.query.order_code}`);
    }
  }, [router.isReady, router.query.order_code]);

  useEffect(() => {
    dispatch(setCurrentModule(t('track_order')));
  }, []);

  if (router.query.order_code && isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner fullWidth={false} />}>
      <MainContentLayout>
        <h4
          className="text-center text-primary_BG font-semibold pt-2 capitalize"
          suppressHydrationWarning={suppressText}
        >
          {t('track_order')}
        </h4>
        <div className="px-5 pb-7 border-b-[12px] border-stone-100 capitalize">
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
            {isSuccess && !isEmpty(data) && !data?.status && (
              <p
                className=" text-sm font-semibold text-red-700 text-center pt-6"
                suppressHydrationWarning={suppressText}
              >
                {data && data.msg && t(lowerCase(snakeCase(data.msg)))}
              </p>
            )}
          </div>
        </div>
        {isSuccess && data && data?.status && (
          <div>
            <div className="p-7 border-b-[12px] border-stone-100 capitalize">
              <div className="flex justify-between mt-4">
                <p
                  className="text-primary_BG font-semibold"
                  suppressHydrationWarning={suppressText}
                >
                  {t('order_id')}
                </p>
                <p>{router.query.order_code}</p>
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
            <div className={`p-7 capitalize`}>
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

            <div className="flex flex-col items-center pt-5 capitalize">
              <p
                className="mb-4 text-lg"
                suppressHydrationWarning={suppressText}
              >
                {t('delivering_to_your_address')}
              </p>
              <p className="text-lg text-center text-primary_BG">{}</p>
            </div>
            <div className="pt-5 px-4 mt-[40%] capitalize">
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
      </MainContentLayout>
    </Suspense>
  );
};

export default TrackOrder;

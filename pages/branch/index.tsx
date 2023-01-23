import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { branchApi } from '@/redux/api/branchApi';
import MainHead from '@/components/MainHead';
import { Branch } from '@/types/queries';
import { map } from 'lodash';
import Link from 'next/link';
import { useAppDispatch } from '@/redux/hooks';
import { setBranch } from '@/redux/slices/branchSlice';
import GoogleMapReact from 'google-map-react';
import Phone from '@/appIcons/phone.svg';
import { useTranslation } from 'react-i18next';
import { suppressText, submitBtnClass } from '@/constants/*';
import { useEffect, Suspense } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import CustomImage from '@/components/CustomImage';

type Props = {
  elements: Branch[];
};
const BranchIndex: NextPage<Props> = ({ elements }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(setCurrentModule(t('our_branches')));
  }, []);

  return (
    <div className={`px-4`}>
          <h4 className="text-center text-primary_BG font-semibold pt-2">
            {t('our_branches')}
          </h4>
          {map(elements, (b, i) => (
            <Link href={`#`} onClick={() => dispatch(setBranch(b))} key={i}>
              <p
                className="font-semibold pb-3"
                suppressHydrationWarning={suppressText}
              >
                {t(b.name)}
              </p>
              <div className="w-full h-36 rounded-md">
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: 'AIzaSyChibV0_W_OlSRJg2GjL8TWVU8CzpRHRAE',
                    language: 'en',
                    region: 'US',
                  }}
                  defaultCenter={{
                    lat: parseInt(b.lat),
                    lng: parseInt(b.lang),
                  }}
                  defaultZoom={11}
                ></GoogleMapReact>
              </div>
              <div className="flex justify-between my-5 items-center">
                <p
                  className="text-primary_BG text-lg font-semibold"
                  suppressHydrationWarning={suppressText}
                >
                  {t(b.location)}
                </p>
                <div className="flex rounded-2xl bg-LightGray py-1 px-5 ltr:ml-2 rtl:mr-2">
                  <CustomImage
                    src={Phone}
                    alt="phone"
                    className="ltr:mr-2 rtl:ml-2 h-5 items-center"
                  />
                  <p className="whitespace-nowrap">{b.mobile}</p>
                </div>
              </div>
            </Link>
          ))}
          <div className="py-2">
            <button className={`${submitBtnClass}`}>
              <div className="flex justify-center items-center">
                <p
                  className="text-white px-2"
                  suppressHydrationWarning={suppressText}
                >
                  {t('send_feedback')}
                </p>
              </div>
            </button>
          </div>
        </div>
  );
};

export default BranchIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ locale }) => {
      const { data: elements, isError } = await store.dispatch(
        branchApi.endpoints.getBranches.initiate({ lang: locale })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !elements.Data) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          elements: elements.Data,
        },
      };
    }
);

import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { branchApi } from '@/redux/api/branchApi';
import MainHead from '@/components/MainHead';
import { Branch } from '@/types/queries';
import { map } from 'lodash';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setBranch } from '@/redux/slices/branchSlice';
import GoogleMapReact from 'google-map-react';
import Phone from '@/appIcons/phone.svg';
import { Trans, useTranslation } from 'react-i18next';
import { suppressText, submitBtnClass } from '@/constants/*';
import { useEffect, Suspense } from 'react';
import { setCurrentModule, setUrl } from '@/redux/slices/appSettingSlice';
import CustomImage from '@/components/CustomImage';
import { themeColor } from '@/redux/slices/vendorSlice';
import { PhoneCallback } from '@mui/icons-material';

type Props = {
  elements: Branch[];
  url: string;
};
const BranchIndex: NextPage<Props> = ({ elements, url }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  useEffect(() => {
    dispatch(setCurrentModule('our_branches'));
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  return (
    <MainContentLayout>
      <div className={`px-4`}>
        {map(elements, (b, i) => (
          <Link href={`#`} onClick={() => dispatch(setBranch(b))} key={i}>
            <p
              className="font-semibold pb-3 capitalize"
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
                className=" text-lg font-semibold capitalize"
                suppressHydrationWarning={suppressText}
                style={{ color }}
              >
                {t(b.location)}
              </p>
              <div className="flex rounded-2xl bg-LightGray py-1 px-5 ltr:ml-2 rtl:mr-2">
                <PhoneCallback
                  style={{ color }}
                  className="ltr:mr-2 rtl:ml-2 h-5 items-center"
                />
                <p className="whitespace-nowrap capitalize">{b.mobile}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </MainContentLayout>
  );
};

export default BranchIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ locale, req }) => {
      // if (req.headers.host) {
      //   store.dispatch(setUrl(req.headers.host));
      // } else {
      //   return {
      //     notFound: true,
      //   };
      // }
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      const { data: elements, isError } = await store.dispatch(
        branchApi.endpoints.getBranches.initiate({
          lang: locale,
          url: req.headers.host,
        })
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
          url: req.headers.host,
        },
      };
    }
);

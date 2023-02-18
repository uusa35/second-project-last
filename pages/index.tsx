import { useEffect, Suspense } from 'react';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { NextPage } from 'next';
import { AppQueryResult } from '@/types/queries';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import MainContentLayout from '@/layouts/MainContentLayout';
import MainHead from '@/components/MainHead';
import { vendorApi } from '@/redux/api/vendorApi';
import { Vendor } from '@/types/index';
import { useGetCategoriesQuery } from '@/redux/api/categoryApi';
import { isEmpty, map } from 'lodash';
import CategoryWidget from '@/widgets/category/CategoryWidget';
import {
  appLinks,
  baseUrl,
  imageSizes,
  imgUrl,
  suppressText,
} from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { setLocale } from '@/redux/slices/localeSlice';
import {
  setCurrentModule,
  setShowFooterElement,
} from '@/redux/slices/appSettingSlice';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import HomeSelectMethod from '@/components/home/HomeSelectMethod';
import HomeVendorMainInfo from '@/components/home/HomeVendorMainInfo';
import { useRouter } from 'next/router';
import CustomImage from '@/components/CustomImage';
import LoadingSpinner from '@/components/LoadingSpinner';
import PoweredByQ from '@/components/PoweredByQ';

type Props = {
  element: Vendor;
  url: string;
};
const HomePage: NextPage<Props> = ({ element, url }): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    branch: { id: branch_id },
    area: { id: area_id },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: categories, isSuccess: categoriesSuccess } =
    useGetCategoriesQuery({
      lang,
      url,
    });

  useEffect(() => {
    dispatch(setCurrentModule('home'));
    dispatch(setShowFooterElement('home'));
  }, []);

  const handleFocus = () =>
    router.push(appLinks.productSearchIndex('', branch_id, area_id));

  return (
    <Suspense fallback={<LoadingSpinner fullWidth={false} />}>
      {/* SEO Head DEV*/}
      <MainHead
        title={element.name}
        mainImage={`${baseUrl}${element.logo}`}
        phone={element.phone}
      />
      <MainContentLayout url={url}>
        {/*  ImageBackGround Header */}
        <CustomImage
          src={`${imgUrl(element.cover)}`}
          alt={element.name}
          className={`block lg:hidden object-cover w-full h-1/5 absolute left-0 right-0 -top-40  shadow-xl z-0 overflow-hidden`}
          width={imageSizes.lg}
          height={imageSizes.lg}
        />
        <div className="bg-white mt-40 lg:mt-0 border-t-4 border-stone-100 lg:border-none rounded-none relative -top-10 lg:top-auto  pt-1 lg:pt-0 ">
          {/*  HomePage Header */}
          <div className={`px-6 mt-3 lg:mt-0`}>
            <HomeVendorMainInfo element={element} />
          </div>
          <HomeSelectMethod element={element} />
          {/* Search Input */}
          <div
            className={`flex flex-1 w-auto flex-grow mx-2 pb-4 border-b border-stone-300`}
          >
            <div className={`w-full`}>
              <div className="relative mt-1 rounded-md shadow-sm text-gray-400">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-6">
                  <MagnifyingGlassIcon className="h-8 w-8" aria-hidden="true" />
                </div>
                <input
                  type="search"
                  name="search"
                  id="search"
                  onFocus={() => handleFocus()}
                  className="block w-full rounded-md  pl-20 focus:ring-1 focus:ring-primary_BG border-none  bg-gray-100 h-12  text-lg capitalize"
                  suppressHydrationWarning={suppressText}
                  placeholder={`${t(`search_products`)}`}
                />
              </div>
            </div>
          </div>
          {/* Categories List */}
          {isEmpty(categories) && (
            <div className={`flex w-auto h-[30vh] justify-center items-center`}>
              <LoadingSpinner fullWidth={false} />
            </div>
          )}
          <div className="py-4 px-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-1">
            {categoriesSuccess &&
              !isEmpty(categories) &&
              map(categories.Data, (c, i) => (
                <CategoryWidget element={c} key={i} />
              ))}
          </div>
        </div>
        <div className={`mt-[10%]`}>
          <PoweredByQ />
        </div>
      </MainContentLayout>
    </Suspense>
  );
};

export default HomePage;
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale }) => {
      const url = req.headers.host;
      if (store.getState().locale.lang !== locale) {
        store.dispatch(setLocale(locale));
      }
      const {
        data: element,
        isError,
      }: { data: AppQueryResult<Vendor>; isError: boolean } =
        await store.dispatch(
          vendorApi.endpoints.getVendor.initiate({
            lang: locale,
            url,
          })
        );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !element.status || !element.Data) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          element: element.Data,
          url,
        },
      };
    }
);

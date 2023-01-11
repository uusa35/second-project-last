import { useState, useEffect, Suspense } from 'react';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { NextPage } from 'next';
import { AppQueryResult, Category } from '@/types/queries';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import MainContentLayout from '@/layouts/MainContentLayout';
import MainHead from '@/components/MainHead';
import { vendorApi } from '@/redux/api/vendorApi';
import { Vendor } from '@/types/index';
import { categoryApi } from '@/redux/api/categoryApi';
import { isEmpty, isNull, map } from 'lodash';
import CategoryWidget from '@/widgets/category/CategoryWidget';
import { suppressText } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { setLocale } from '@/redux/slices/localeSlice';
import { setCurrentModule, setUserAgent } from '@/redux/slices/appSettingSlice';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import HomeSelectMethod from '@/components/home/HomeSelectMethod';
import HomeVendorMainInfo from '@/components/home/HomeVendorMainInfo';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useLazyCreateTempIdQuery } from '@/redux/api/cartApi';

type Props = {
  categories: Category[];
  element: Vendor;
};
let renderCounter: number = 0;
const HomePage: NextPage<Props> = ({ element, categories }): JSX.Element => {
  console.log(`::: Log Home Render :::: ${renderCounter++}`);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCurrentModule(t('home')));
  }, []);

  return (
    <>
      {/* SEO Head DEV*/}
      <MainHead title={element.name} mainImage={element.logo} />
      <MainContentLayout>
        {/*  HomePage Header */}
        <div className={`px-14 mt-4`}>
          <HomeVendorMainInfo element={element} />
        </div>
        <HomeSelectMethod element={element} />
        {/* Search Input */}
        <div
          className={`flex flex-1 w-auto flex-grow mx-8 pb-8 border-b border-stone-100`}
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
                className="block w-full rounded-md  pl-20 focus:ring-1 focus:ring-primary_BG border-none  bg-gray-100 py-3 h-16  text-lg capitalize"
                suppressHydrationWarning={suppressText}
                placeholder={`${t(`search_products`)}`}
              />
            </div>
          </div>
        </div>
        {/* Categories List */}
        <div className="py-4 px-8 grid sm:grid-cols-3 lg:grid-cols-2 gap-6 ">
          {!isEmpty(categories) &&
            map(categories, (c, i) => <CategoryWidget element={c} key={i} />)}
        </div>
      </MainContentLayout>
    </>
  );
};

export default HomePage;
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ locale }) => {
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
          })
        );
      const {
        data: categories,
        isError: categoriesError,
      }: {
        data: AppQueryResult<Category[]>;
        isError: boolean;
      } = await store.dispatch(
        categoryApi.endpoints.getCategories.initiate({
          lang: locale,
        })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (
        isError ||
        !element.status ||
        !element.Data ||
        !categories.status ||
        !categories.Data ||
        categoriesError
      ) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          element: element.Data,
          categories: categories.Data,
        },
      };
    }
);

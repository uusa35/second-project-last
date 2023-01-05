import { useState, useEffect } from 'react';
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
import { isEmpty, map } from 'lodash';
import CategoryWidget from '@/widgets/category/CategoryWidget';
import CustomImage from '@/components/customImage';
import { imageSizes, imgUrl, suppressText } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { InfoOutlined, DiscountOutlined } from '@mui/icons-material';
import Link from 'next/link';
import Error from '@/pages/_error';
import { setLocale } from '@/redux/slices/localeSlice';

type Props = {
  categories: Category[];
  element: Vendor;
};
let renderCounter: number = 0;
const HomePage: NextPage<Props> = ({ element, categories }): JSX.Element => {
  console.log(`::: Log Home Render :::: ${renderCounter++}`);
  const { t } = useTranslation();
  console.log('element', element);
  console.log('category', categories);

  return (
    <>
      {/* SEO Head DEV*/}
      <MainHead title={element.name} mainImage={element.logo} />
      <MainContentLayout>
        <div>
          <div className="flex gap-x-2 justify-between">
            <div className="flex gap-x-2">
              <CustomImage
                width={imageSizes.xs}
                height={imageSizes.xs}
                className="rounded-md w-full h-full max-w-sm max-h-28"
                alt={element.name}
                src={imgUrl(element.logo)}
              />
              <div>
                <h1 className="font-bold text-lg mb-2 ">{element.name}</h1>
                <div className="text-sm text-gray-500">
                  <p suppressHydrationWarning={suppressText}>
                    {t('payment_by_cards')}
                  </p>
                  <p suppressHydrationWarning={suppressText}>
                    {t('cash_on_delivery')}
                  </p>
                </div>
              </div>
            </div>

            <Link href="#" scroll={false}>
              <InfoOutlined className="text-primary_BG" />
            </Link>
          </div>

          {element.desc && (
            <div className="flex gap-x-1 items-end justify-start mt-4">
              <DiscountOutlined className="text-primary_BG" />
              <p
                suppressHydrationWarning={suppressText}
                className="text-sm text-gray-500"
              >
                {element.desc}
              </p>
            </div>
          )}
        </div>
        <div className="mt-4 py-4 grid sm:grid-cols-3 lg:grid-cols-2 gap-6">
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

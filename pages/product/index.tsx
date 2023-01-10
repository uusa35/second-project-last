import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { productApi, useGetTopSearchQuery } from '@/redux/api/productApi';
import { Product } from '@/types/index';
import { NextPage } from 'next';
import { apiSlice } from '@/redux/api';
import { isEmpty, map } from 'lodash';
import { imageSizes, suppressText } from '@/constants/*';
import MainHead from '@/components/MainHead';
import Image from 'next/image';
import NotFoundImage from '@/appImages/not_found.png';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import VerProductWidget from '@/widgets/product/VerProductWidget';
import SearchIcon from '@/appIcons/search.svg';
import { inputFieldClass } from '@/constants/*';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type Props = {
  elements: Product[];
};
const ProductSearchIndex: NextPage<Props> = ({ elements }): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  console.log('elements', elements);

  useEffect(() => {
    dispatch(setCurrentModule(t('product_search_index')));
  }, []);

  return (
    <>
      <MainHead title={`productIndex`} description={`productIndex`} />
      <MainContentLayout>
        <div className={`px-4`}>
          <div className={`w-full`}>
            <div className="relative mt-1 rounded-md shadow-sm text-gray-400">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-6">
                <MagnifyingGlassIcon className="h-8 w-8" aria-hidden="true" />
              </div>
              <input
                type="search"
                name="search"
                id="search"
                className="block w-full focus:ring-1 focus:ring-primary_BG rounded-md  pl-20 border-none  bg-gray-100 py-3 h-16  text-lg capitalize"
                suppressHydrationWarning={suppressText}
                placeholder={`${t(`search_products`)}`}
              />
            </div>
          </div>
          <div className="my-4">
            {isEmpty(elements) && (
              <Image
                src={NotFoundImage.src}
                alt={`not_found`}
                width={imageSizes.sm}
                height={imageSizes.sm}
                className={`w-60 h-auto`}
              />
            )}
            {map(elements, (p, i) => (
              <VerProductWidget element={p} key={i} />
            ))}
          </div>
        </div>
      </MainContentLayout>
    </>
  );
};

export default ProductSearchIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, locale }) => {
      const { key, branch_id, area_id }: any = query;
      if (!branch_id) {
        return {
          notFound: true,
        };
      }
      const { data: elements, isError } = await store.dispatch(
        productApi.endpoints.getSearchProducts.initiate({
          key: key ?? ``,
          branchId: branch_id ?? null,
          areaId: area_id ?? ``,
          lang: locale,
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
        },
      };
    }
);

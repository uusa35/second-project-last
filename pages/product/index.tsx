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
import {inputFieldClass} from '@/constants/*';

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
          <div className={`mb-5 py-1 ${inputFieldClass} flex items-center`}>
              <Image src={SearchIcon} alt='search' />
              <input
                  type="text"
                  placeholder={`search`}
                  className={`m-0 py-0 pt-1 ${inputFieldClass} border-0`}
              ></input>
            </div>
          <div className="my-4 p-4">
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

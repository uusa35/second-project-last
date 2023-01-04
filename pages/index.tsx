import { useState, useEffect } from 'react';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { NextPage } from 'next';
import { AppQueryResult, Category } from '@/types/queries';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import MainContentLayout from '@/layouts/MainContentLayout';
import MainHead from '@/components/MainHead';
import { motion } from 'framer-motion';
import { vendorApi } from '@/redux/api/vendorApi';
import { locationApi } from '@/redux/api/locationApi';
import { Vendor } from '@/types/index';
import { categoryApi, useGetCategoriesQuery } from '@/redux/api/categoryApi';
import { isEmpty, map } from 'lodash';
import CategoryWidget from '@/widgets/category/CategoryWidget';

type Props = {
  categories: Category[];
  element: Vendor;
};
let renderCounter: number = 0;
const HomePage: NextPage<Props> = ({ element, categories }): JSX.Element => {
  console.log(`::: Log Home Render :::: ${renderCounter++}`);
  const {
    cart: { tempId },
  } = useAppSelector((state) => state);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();

  console.log('element', element);
  console.log('category', categories);

  useEffect(() => {
    if (isEmpty(tempId)) {
      // create tempId here if does not exist
    }
  }, []);

  return (
    <>
      {/* SEO Head DEV*/}
      <MainHead title={element.name} mainImage={element.logo} />
      <MainContentLayout>
        <div>
          
        </div>
        <div className="mt-4 p-4 grid sm:grid-cols-3 lg:grid-cols-2 gap-6">
          {!isEmpty(categories) &&
            map(categories, (c, i) => <CategoryWidget element={c} key={i} />)}
        </div>
      </MainContentLayout>
    </>
  );
};

export default HomePage;
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const {
      data: element,
      isError,
    }: { data: AppQueryResult<Vendor>; isError: boolean } =
      await store.dispatch(vendorApi.endpoints.getVendor.initiate());
    const {
      data: categories,
      isError: categoriesError,
    }: {
      data: AppQueryResult<Category[]>;
      isError: boolean;
    } = await store.dispatch(categoryApi.endpoints.getCategories.initiate());

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

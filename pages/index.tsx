import { useState, useEffect } from 'react';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { NextPage } from 'next';
import { AppQueryResult, Category } from '@/types/queries';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import MainContentLayout from '@/layouts/MainContentLayout';
import MainHead from '@/components/MainHead';
import { vendorApi } from '@/redux/api/vendorApi';
import { Cart, Vendor } from '@/types/index';
import { categoryApi } from '@/redux/api/categoryApi';
import { isEmpty, isNull, map } from 'lodash';
import CategoryWidget from '@/widgets/category/CategoryWidget';
import CustomImage from '@/components/CustomImage';
import {
  appLinks,
  imageSizes,
  imgUrl,
  inputFieldClass,
  normalBtnClass,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { InfoOutlined, DiscountOutlined } from '@mui/icons-material';
import Link from 'next/link';
import { setLocale } from '@/redux/slices/localeSlice';
import { selectMethod } from '@/redux/slices/cartSlice';
import { useRouter } from 'next/router';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import MotorIcon from '@/appIcons/motor.svg';
import TruckIcon from '@/appIcons/trunk.svg';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import HomeSelectMethod from '@/components/home/HomeSelectMethod';
import HomeVendorMainInfo from '@/components/home/HomeVendorMainInfo';

type Props = {
  categories: Category[];
  element: Vendor;
};
let renderCounter: number = 0;
const HomePage: NextPage<Props> = ({ element, categories }): JSX.Element => {
  console.log(`::: Log Home Render :::: ${renderCounter++}`);
  const { t } = useTranslation();
  const {
    cart: { tempId, method },
    area,
    branch,
  } = useAppSelector((state) => state);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isEmpty(tempId)) {
      // create tempId here if does not exist
    }
    dispatch(setCurrentModule(t('home')));
  }, []);

  console.log('vendor', element);
  console.log('area', area);

  return (
    <>
      {/* SEO Head DEV*/}
      <MainHead title={element.name} mainImage={element.logo} />
      <MainContentLayout>
        {/*  HomePage Header */}
        <div className={`py-8 px-4`}>
          <HomeVendorMainInfo element={element} />
          <HomeSelectMethod element={element} />
          {/* Search Input */}
          <div className={`flex flex-1 w-full flex-grow my-2`}>
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
                  className="block w-full rounded-md  pl-10 border-none bg-gray-100"
                  suppressHydrationWarning={suppressText}
                  placeholder={`${t(`search_products`)}`}
                />
              </div>
            </div>
          </div>
          {/* Categories List */}
          <div className="mt-4 py-4 grid sm:grid-cols-3 lg:grid-cols-2 gap-6 border-t border-stone-100">
            {!isEmpty(categories) &&
              map(categories, (c, i) => <CategoryWidget element={c} key={i} />)}
          </div>
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

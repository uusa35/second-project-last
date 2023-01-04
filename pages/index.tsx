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
import {
  InfoOutlined,
  DiscountOutlined,
  MopedOutlined,
  ElectricRickshawOutlined,
  SearchOutlined,
} from '@mui/icons-material';
import Link from 'next/link';
import GreyLine from '@/components/GreyLine';

type Props = {
  categories: Category[];
  element: Vendor;
};
let renderCounter: number = 0;
const HomePage: NextPage<Props> = ({ element, categories }): JSX.Element => {
  console.log(`::: Log Home Render :::: ${renderCounter++}`);
  const { t } = useTranslation();
  const {
    cart: { tempId },
  } = useAppSelector((state) => state);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();

  console.log('element', element);
  console.log('category', categories);

  const addressType = undefined;

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
            <div className="flex gap-x-1 items-end justify-start my-4">
              <DiscountOutlined className="text-primary_BG" />
              <p
                suppressHydrationWarning={suppressText}
                className="text-sm text-gray-500"
              >
                {element.desc}
              </p>
            </div>
          )}

          <div className="flex justify-between gap-x-2">
            <Link className='w-2/5' href="#" scroll={false}>
              <button className="bg-white hover:bg-gray-100 text-gray-800 font-thin  py-1 w-2/5 border border-gray-400 rounded shadow !w-full px-2">
                {t('delivery')}
              </button>
            </Link>
            <Link className='w-2/5' href="#" scroll={false}>
              <button className="bg-white hover:bg-gray-100 text-gray-800 font-thin  py-1 w-2/5 border border-gray-400 rounded shadow !w-full px-2">
                {t('pickUp')}
              </button>
            </Link>
          </div>

          <div className="my-5">
            <div className="flex items-center justify-between gap-x-2 mb-2">
              <div className="flex gap-x-2 items-center">
                <MopedOutlined
                  className="text-gray-800"
                  sx={{ fontSize: 40, fontWeight: 50 }}
                />
                <p suppressHydrationWarning={suppressText}>{t('deliver_to')}</p>
              </div>
              <Link href="#">
                <p suppressHydrationWarning={suppressText}>
                  {t('choose_location')}
                </p>
              </Link>
            </div>
            <div className="flex items-center justify-between gap-x-2">
              <div className="flex gap-x-2 items-center">
                <ElectricRickshawOutlined
                  className="text-gray-800 font-thin"
                  sx={{ fontSize: 40, fontWeight: 50 }}
                />
                <p suppressHydrationWarning={suppressText}>{t('deliver_to')}</p>
              </div>
              <Link href="#">
                <p suppressHydrationWarning={suppressText}>
                  {t('choose_location')}
                </p>
              </Link>
            </div>
          </div>

          <div
            className="flex items-center mt-3 gap-x-1 bg-gray-200 rounded-md px-2"
            onFocus={() => {}}
          >
            <SearchOutlined className="relative z-10 top-0 text-gray-700" />
            <input
              type="text"
              placeholder={`${t('search_products')}`}
              className="w-full bg-gray-200 text-sm  relative border-none shadow-none focus:shadow-none focus:ring-0"
            ></input>
          </div>

          <GreyLine className="my-5" />
        </div>
        <div className="py-4 grid sm:grid-cols-3 lg:grid-cols-2 gap-6">
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

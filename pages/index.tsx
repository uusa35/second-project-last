import { useEffect, Suspense } from 'react';
import { wrapper } from '@/redux/store';
import { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import MainContentLayout from '@/layouts/MainContentLayout';
import MainHead from '@/components/MainHead';
import { Product, Vendor } from '@/types/index';
import { useGetVendorQuery, vendorApi } from '@/redux/api/vendorApi';
import { useLazyGetCategoriesQuery } from '@/redux/api/categoryApi';
import { isEmpty, map } from 'lodash';
import CategoryWidget from '@/widgets/category/CategoryWidget';
import { appLinks, imageSizes } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { setLocale } from '@/redux/slices/localeSlice';
import {
  setCurrentModule,
  setShowFooterElement,
} from '@/redux/slices/appSettingSlice';
import HomeSelectMethod from '@/components/home/HomeSelectMethod';
import HomeVendorMainInfo from '@/components/home/HomeVendorMainInfo';
import { useRouter } from 'next/router';
import CustomImage from '@/components/CustomImage';
import LoadingSpinner from '@/components/LoadingSpinner';
import PoweredByQ from '@/components/PoweredByQ';
import { useLazyGetProductsQuery } from '@/redux/api/productApi';
import SearchInput from '@/components/SearchInput';
import { apiSlice } from '@/redux/api';
import { AppQueryResult } from '@/types/queries';
import ProductList from '@/components/home/ProductList';

type Props = {
  element: Vendor;
  url: string;
};
const HomePage: NextPage<Props> = ({ url, element }): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    branch: { id: branch_id },
    area: { id: area_id },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [
    triggerGetCategories,
    { data: categories, isSuccess: categoriesSuccess },
  ] = useLazyGetCategoriesQuery();
  const [triggerGetProducts, { data: elements, isSuccess: elementsSuccess }] =
    useLazyGetProductsQuery();
  const { data: vendorDetails, isSuccess: vendorSuccess } = useGetVendorQuery({
    lang,
    url,
  });

  useEffect(() => {
    dispatch(setCurrentModule('home'));
    dispatch(setShowFooterElement('home'));
  }, []);

  useEffect(() => {
    triggerGetProducts(
      {
        url,
        lang: router.locale,
        category_id: ``,
        page: `1`,
        limit: `10`,
        branch_id: branch_id.toString(),
        area_id: area_id.toString(),
      },
      false
    );
    triggerGetCategories(
      {
        lang: router.locale,
        url,
      },
      false
    );
  }, [router.locale]);

  const handleFocus = () =>
    router.push(appLinks.productSearchIndex('', branch_id, area_id));

  if (!element) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner fullWidth={true} />}>
      {/* SEO Head DEV*/}
      <MainHead
        title={element.name}
        mainImage={`${element.logo}`}
        icon={`${element.logo}`}
        phone={element.phone}
      />
      <MainContentLayout url={url}>
        {/*  ImageBackGround Header */}
        {vendorSuccess && vendorDetails && vendorDetails.Data && (
          <div className="block lg:hidden lg:h-auto h-60">
            <CustomImage
              src={`${vendorDetails?.Data?.cover}`}
              alt={vendorDetails?.Data?.name}
              className={`object-fit w-full h-full  shadow-xl z-0 overflow-hidden`}
              width={imageSizes.xl}
              height={imageSizes.xl}
            />
          </div>
        )}
        <div className="bg-white border-t-4 border-stone-100 lg:border-none rounded-none relative lg:top-auto  pt-1 lg:pt-0 ">
          {/*  HomePage Header */}
          <div className={`px-6 mt-3 lg:mt-0`}>
            <HomeVendorMainInfo url={url} />
          </div>
          {vendorSuccess && vendorDetails?.Data && (
            <HomeSelectMethod element={vendorDetails?.Data} url={url} />
          )}
          {/* Search Input */}
          <div
            className={`flex flex-1 w-auto flex-grow mx-2 pb-4 border-b border-stone-200`}
          >
            <div className={`w-full`}>
              <SearchInput
                placeholder={`${t(`search_products`)}`}
                onFocus={() => handleFocus()}
              />
            </div>
          </div>
          {/* Loading Spinner */}
          {!categoriesSuccess ||
            (!elementsSuccess && (
              <div
                className={`flex w-full h-[30vh] justify-center items-center w-full`}
              >
                <LoadingSpinner fullWidth={true} />
              </div>
            ))}
          <div className={`py-4 px-2`} data-cy="productCategoryContainer">
            {categoriesSuccess &&
            !isEmpty(categories) &&
            vendorDetails?.Data?.template_type === 'basic_category' ? (
              <div
                className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-1`}
              >
                {map(categories.Data, (c, i) => (
                  <CategoryWidget element={c} key={i} />
                ))}
              </div>
            ) : (
              vendorSuccess &&
              elements &&
              !isEmpty(elements.Data) &&
              elementsSuccess &&
              map(
                elements.Data,
                (
                  list: {
                    cat_id: number;
                    items: Product[];
                    name: string;
                  },
                  i
                ) => <ProductList i={i} list={list} />
              )
            )}
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
      if (isError || !element.status || !element.Data || !element) {
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

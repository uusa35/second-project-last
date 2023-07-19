import { useEffect, Suspense } from 'react';
import { wrapper } from '@/redux/store';
import { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import MainContentLayout from '@/layouts/MainContentLayout';
import MainHead from '@/components/MainHead';
import { Product, Vendor } from '@/types/index';
import { useLazyGetVendorQuery, vendorApi } from '@/redux/api/vendorApi';
import { useLazyGetCategoriesQuery } from '@/redux/api/categoryApi';
import { isEmpty, map } from 'lodash';
import CategoryWidget from '@/widgets/category/CategoryWidget';
import { appLinks, imageSizes } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { setLocale } from '@/redux/slices/localeSlice';
import {
  setCartMethod,
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
import { removeArea } from '@/redux/slices/areaSlice';
import { removeBranch } from '@/redux/slices/branchSlice';

type Props = {
  element: Vendor;
  currentLocale: string;
  url: string;
};
const HomePage: NextPage<Props> = ({
  url,
  element,
  currentLocale,
}): JSX.Element => {
  console.log('element ====>', element);
  const { t } = useTranslation();
  const {
    locale: { lang },
    branch: { id: branch_id },
    area: { id: area_id },
    appSetting: { method },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [
    triggerGetCategories,
    { data: categories, isSuccess: categoriesSuccess },
  ] = useLazyGetCategoriesQuery();
  const [triggerGetProducts, { data: elements, isSuccess: elementsSuccess }] =
    useLazyGetProductsQuery();
  const [triggerGetVendor, { data: vendorElement, isSuccess: vendorSuccess }] =
    useLazyGetVendorQuery();

  useEffect(() => {
    dispatch(setCurrentModule('home'));
    dispatch(setShowFooterElement('home'));
    getVendor();
  }, [element.id]);

  useEffect(() => {
    if (vendorSuccess && vendorElement && vendorElement.Data) {
      if (vendorElement?.Data?.delivery_pickup_type === 'pickup') {
        dispatch(setCartMethod('pickup'));
        dispatch(removeArea());
      } else if (vendorElement?.Data?.delivery_pickup_type === 'delivery') {
        dispatch(setCartMethod('delivery'));
        dispatch(removeBranch());
      }
    }
  }, [vendorSuccess, method, branch_id, area_id]);

  const getVendor = () => {
    triggerGetVendor(
      {
        lang,
        url,
        branch_id: method !== `pickup` ? branch_id : ``,
        area_id: method === `pickup` ? area_id : ``,
      },
      false
    );
  };

  useEffect(() => {
    triggerGetProducts(
      {
        url,
        lang: router.locale,
        category_id: ``,
        page: `1`,
        limit: `30`,
        branch_id: branch_id.toString(),
        area_id: area_id.toString(),
      },
      true
    );
    triggerGetCategories(
      {
        lang: router.locale,
        url,
      },
      true
    );
  }, [router.locale, branch_id, area_id]);

  const handleFocus = () =>
    router.push(appLinks.productSearchIndex('', branch_id, area_id));

  if (!element) {
    return <LoadingSpinner />;
  }

  console.log('elemnt', element);

  console.log('url', url);

  return (
    <Suspense fallback={<LoadingSpinner fullWidth={true} />}>
      {/* SEO Head DEV*/}
      <MainHead
        title={currentLocale === 'ar' ? element.name_ar : element.name_en}
        url={url}
        description={element.desc}
        mainImage={`${element.logo}`}
        icon={`${element.logo}`}
        phone={element.phone}
        twitter={element.twitter}
        facebook={element.facebook}
        instagram={element.instagram}
      />
      <MainContentLayout url={url}>
        {/*  ImageBackGround Header */}
        {vendorSuccess && vendorElement && vendorElement.Data && (
          <div className="block lg:hidden lg:h-auto h-60">
            <CustomImage
              src={`${vendorElement?.Data?.cover}`}
              alt={vendorElement?.Data?.name}
              className={`object-fit w-full h-full  shadow-xl z-0 overflow-hidden`}
              width={imageSizes.xl}
              height={imageSizes.xl}
            />
          </div>
        )}
        <div className="bg-white border-t-4 border-stone-100 lg:border-none rounded-none relative lg:top-auto  pt-1 lg:pt-0 min-h-screen">
          {/*  HomePage Header */}
          <div className={`px-6 mt-3 lg:mt-0`}>
            <HomeVendorMainInfo url={url} />
          </div>
          {vendorSuccess && vendorElement?.Data && (
            <HomeSelectMethod element={vendorElement?.Data} url={url} />
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
          !elementsSuccess ||
          !vendorSuccess ||
          !vendorElement ||
          !vendorElement.Data ||
          !categories ||
          !categories.Data ||
          !elements ||
          !elements.Data ||
          !elements ? (
            <div
              className={`flex w-full h-[30vh] mb-[100%] justify-center items-center w-full`}
            >
              <LoadingSpinner fullWidth={true} />
            </div>
          ) : (
            <div className={`py-4 px-2`} data-cy="productCategoryContainer">
              {!isEmpty(categories) &&
              vendorElement?.Data?.template_type === 'basic_category' ? (
                <div
                  className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-1`}
                >
                  {map(categories.Data, (c, i) => (
                    <CategoryWidget element={c} key={i} />
                  ))}
                </div>
              ) : (
                elements &&
                !isEmpty(elements.Data) &&
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
          )}
        </div>
        <div className={`mt-[10%]`}>
          <PoweredByQ />
        </div>
      </MainContentLayout>
    </Suspense>
  );
};

export default HomePage;
<<<<<<< HEAD

=======
>>>>>>> structure
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale, res }) => {
      const url = req.headers.host;
      if (store.getState().locale.lang !== locale) {
        store.dispatch(setLocale(locale));
      }
      const {
        data: element,
        isError,
      }: { data: AppQueryResult<Vendor>; isError: boolean } =
        await store.dispatch(
          vendorApi.endpoints.getVendor.initiate(
            {
              lang: locale,
              url,
            },
            {
              forceRefetch: true,
            }
          )
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
          currentLocale: locale,
          url,
        },
      };
    }
);

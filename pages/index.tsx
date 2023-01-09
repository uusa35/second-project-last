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
import CustomImage from '@/components/customImage';
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
import {
  InfoOutlined,
  DiscountOutlined,
  MopedOutlined,
  ElectricRickshawOutlined,
  SearchOutlined,
} from '@mui/icons-material';
import Link from 'next/link';
import GreyLine from '@/components/GreyLine';
import { setLocale } from '@/redux/slices/localeSlice';
import { selectMethod } from '@/redux/slices/cartSlice';
import { useRouter } from 'next/router';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import MotorIcon from '@/appIcons/motor.svg';
import TruckIcon from '@/appIcons/trunk.svg';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';


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
    area,
  } = useAppSelector((state) => state);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const addressType = undefined;

  useEffect(() => {
    if (isEmpty(tempId)) {
      // create tempId here if does not exist
    }
    dispatch(setCurrentModule(t('home')));
  }, []);

  const handleSelectMethod = (m: Cart['method']) => {
    dispatch(selectMethod(m));
    router.push(appLinks.cartSelectMethod.path);
  };

  console.log('vendor', element);
  console.log('area', area);

  return (
    <>
      {/* SEO Head DEV*/}
      <MainHead title={element.name} mainImage={element.logo} />
      <MainContentLayout>
        {/*  HomePage Header */}
        <div className={`py-8 px-4`}>
          <div className="flex gap-x-2 justify-between ">
            <div className="flex flex-grow gap-x-2">
              <CustomImage
                width={imageSizes.xs}
                height={imageSizes.xs}
                className="rounded-md w-1/4 h-fit aspect-square"
                alt={element.name}
                src={imgUrl(element.logo)}
              />
              <div className={`flex flex-col w-full p-2 space-y-2`}>
                <h1 className="font-bold text-lg ">{element.name}</h1>
                <div className="text-sm text-gray-500 space-y-1">
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
            <div className="flex gap-x-1 justify-start items-start mt-4">
              <DiscountOutlined className="text-primary_BG" />
              <p
                suppressHydrationWarning={suppressText}
                className="text-sm text-gray-500 px-2"
              >
                {element.desc}
              </p>
            </div>
          )}

          {/* Delivery / Pickup Btns */}
          <div className="flex flex-1 w-full flex-col md:flex-row justify-between items-center my-2">
            <button
              className={`${normalBtnClass}  md:ltr:mr-3 md:rtl:ml-3`}
              onClick={() => handleSelectMethod(`delivery`)}
              suppressHydrationWarning={suppressText}
            >
              {t('delivery')}
            </button>
            <button
              className={`${normalBtnClass}   md:ltr:mr-3 md:rtl:ml-3`}
              onClick={() => handleSelectMethod(`pickup`)}
              suppressHydrationWarning={suppressText}
            >
              {t('pickup')}
            </button>
          </div>
          {!isNull(area.id) && (
            <div className="flex flex-1 w-full flex-row justify-between items-center mt-4 mb-2">
              <div
                className={`flex flex-grow justify-start items-center md:ltr:mr-3 md:rtl:ml-3`}
              >
                <CustomImage
                  src={MotorIcon.src}
                  alt={t(`deliver_to`)}
                  width={imageSizes.xs}
                  height={imageSizes.xs}
                  className="h-8 w-8  ltr:mr-3 rtl:ml-3"
                />
                <h1 className={`pt-2`}>{t('delivery_to')}</h1>
              </div>
              <div className={`md:ltr:mr-3 md:rtl:ml-3 pt-2 text-primary_BG`}>
                {area.name}
              </div>
            </div>
          )}
          <div className="flex flex-1 w-full flex-row justify-between items-center mt-2 mb-4">
            <div
              className={`flex flex-grow justify-start items-center md:ltr:mr-3 md:rtl:ml-3`}
            >
              <CustomImage
                src={TruckIcon.src}
                alt={t(`deliver_to`)}
                width={imageSizes.xs}
                height={imageSizes.xs}
                className="h-8 w-8 ltr:mr-3 rtl:ml-3"
              />
              <h1 className={`pt-2`} suppressHydrationWarning={suppressText}>
                {t('earliest_delivery')}
              </h1>
            </div>
            <div className={`md:ltr:mr-3 md:rtl:ml-3 pt-2 text-primary_BG`}>
              {element.DeliveryTime}
            </div>
          </div>
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

import { FC } from 'react';
import Image from 'next/image';
import { appLinks, imageSizes, imgUrl, suppressText } from '@/constants/*';
import Link from 'next/link';
import { ShoppingBagOutlined } from '@mui/icons-material';
import CustomImage from '@/components/customImage';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import { Vendor } from '@/types/index';
import { useTranslation } from 'react-i18next';
import { setLocale } from '@/redux/slices/localeSlice';
import { showToastMessage } from '@/redux/slices/appSettingSlice';

type Props = {
  element: Vendor;
};
const MainAsideLayout: FC<Props> = ({ element }): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    locale: { otherLang },
    branch: { id: branchId },
  } = useAppSelector((state) => state);

  const handleChangeLang = async (locale: string) => {
    if (locale !== router.locale) {
      await dispatch(setLocale(locale));
      await router
        .push(router.pathname, router.asPath, {
          locale,
          scroll: false,
        })
        .then(() =>
          dispatch(
            showToastMessage({
              content: `language_changed_successfully`,
              type: `info`,
            })
          )
        );
    }
  };

  return (
    <div
      className={`hidden lg:block flex flex-row  w-full h-screen lg:w-2/4 xl:w-2/3 fixed ${
        router.locale === 'ar' ? 'left-0' : 'right-0'
      }`}
    >
      <div className="flex relative justify-center items-center top-0  w-full h-screen bg-gradient-to-tr from-gray-400 to-gray-800">
        <Image
          src={`${imgUrl(element.cover)}`}
          alt={element.name}
          className={`absolute top-0 object-cover w-full h-screen mix-blend-overlay`}
          width={imageSizes.lg}
          height={imageSizes.lg}
        />
        <div
          className={`absolute top-0 left-0 flex w-full justify-between items-center grow  z-90 text-white p-4
           `}
        >
          <div className="flex items-center gap-x-5">
            <Link scroll={false} href={appLinks.root.path}>
              <h1 suppressHydrationWarning={suppressText}>{t('home')}</h1>
            </Link>

            <Link scroll={false} href={appLinks.productSearchIndex(branchId)}>
              <h1 suppressHydrationWarning={suppressText}>{t('search')}</h1>
            </Link>

            <Link scroll={false} href={appLinks.trackOrder.path}>
              <h1 suppressHydrationWarning={suppressText}>
                {t('track_order')}
              </h1>
            </Link>
          </div>
          <div className={`flex flex-row justify-between items-center w-14`}>
            <Link scroll={false} href={appLinks.cartIndex.path}>
              <ShoppingBagOutlined />
            </Link>
            <button
              onClick={() => handleChangeLang(otherLang)}
              className={`text-lg font-bold capitalize`}
            >
              {t(`${otherLang}`)}
            </button>
          </div>
        </div>
        <div className={`text-center space-y-3 text-white`}>
          <CustomImage
            src={`${imgUrl(element.logo)}`}
            alt={element.name}
            className={`relative object-contain w-32 h-auto shadow-xl`}
            width={imageSizes.lg}
            height={imageSizes.lg}
          />
          <p suppressHydrationWarning={suppressText}>{element.name}</p>
        </div>
      </div>
    </div>
  );
};

export default MainAsideLayout;

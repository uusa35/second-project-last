import { FC } from 'react';
import { baseUrl, imageSizes, isLocal, suppressText } from '@/constants/*';
import Head from 'next/head';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

type Props = {
  title: string;
  description?: string;
  mainImage?: string;
  phone?: string;
};
const MainHead: FC<Props> = ({
  title = '',
  description = ``,
  mainImage = ``,
  phone = ``,
}): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="name" content={`${title}`} />
        <meta name="title" content={`${title}`} />
        <meta property="og:type" content={`${title}`} />
        <meta property="description" content={`${description}`} />
        <meta property="og:locale" content={`${router.locale}`} />
        <meta property="og:site_name" content={`${title}`} />
        <meta property="og:url" content={`${baseUrl}`} />
        <meta property="og:title" content={`${title}`} />
        <meta property="og:description" content={`${description}`} />
        <meta property="og:image" content={`${mainImage}`} />
        <meta name="logo" content={`${mainImage}`} />
        <link href={`${mainImage}`} rel="shortcut icon" type="image/png" />
        <meta property="og:image:alt" content={`${title}`} />
        <meta property="og:mobile" content={phone} />
        <meta property="og:whatsapp" content={phone} />
        <meta itemProp="instagram" content={baseUrl} />
        <meta property="instagram:url" content={baseUrl} />
        <meta property="instagram:title" content={`${title}`} />
        <meta property="instagram:description" content={`${description}`} />
        <meta property="instagram:image" content={`${mainImage}`} />
      </Head>
      {isLocal && false && (
        <div
          className={`flex p-3 w-1/3 items-center bg-gray-100 rounded-md flex-col capitalize`}
          suppressHydrationWarning={suppressText}
        >
          <span
            className={`text-bold underline`}
            suppressHydrationWarning={suppressText}
          >
            ({t('for_dev_use_only')}) :
          </span>
          <span suppressHydrationWarning={suppressText}>
            {t('title')} : {title}
          </span>
          <span suppressHydrationWarning={suppressText}>
            {t('description')} : {description}
          </span>
          <span suppressHydrationWarning={suppressText}>
            {t('url')} : {baseUrl}
          </span>
          <span suppressHydrationWarning={suppressText}>
            {t('image')}
            <Image
              src={mainImage}
              alt={`main_image`}
              className={`w-10 h-auto`}
              width={imageSizes.xs}
              height={imageSizes.xs}
            />
          </span>
        </div>
      )}
    </>
  );
};

export default MainHead;

import { useTranslation } from 'react-i18next';
import { FC, Suspense } from 'react';
import { appLinks, submitBtnClass } from '@/constants/*';
import Link from 'next/link';
const AppFooter: FC = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Suspense>
      <footer
        className={`fixed w-full lg:w-2/4 xl:w-1/3 h-24 left-0 -bottom-1 flex flex-col justify-center items-center text-center p-6 bg-white bg-opacity-60`}
      >
        <div className={`w-full text-center`}>
          <h1 className={`pt-2 opacity-80`}>{t('powered_by_queue')} &reg;</h1>
          <Link
            className={`flex flex-1 justify-center items-center ${submitBtnClass} opacity-100`}
            href={`${appLinks.cartIndex.path}`}
          >
            {t('review_order')}
          </Link>
        </div>
      </footer>
    </Suspense>
  );
};

export default AppFooter;

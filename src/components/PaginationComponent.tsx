import Link from 'next/link';
import { Pagination } from '@/types/queries';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/redux/hooks';
import { suppressText } from '../constants';

type Props = {
  pagination: Pagination | undefined;
};
const PaginationComponent: FC<Props> = ({ pagination }): JSX.Element => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div>
      {pagination && (pagination.links.next || pagination.links.previous) && (
        <div
          className={`flex flex-row flex-1 w-full items-center justify-center capitalize`}
        >
          {pagination.meta.page.isPrevious && (
            <Link
              scroll={false}
              href={{
                pathname: router.asPath.split('?')[0],
                query: {
                  page: `${pagination.meta.page.previous}`,
                },
              }}
              className="inline-flex items-center px-4 py-2 mx-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              suppressHydrationWarning={suppressText}
            >
              {t('previous')}
            </Link>
          )}
          {pagination.meta.page.isNext && (
            <Link
              href={{
                pathname: router.asPath.split('?')[0],
                query: {
                  page: `${pagination.meta.page.next}`,
                },
              }}
              replace
              className="inline-flex items-center px-4 py-2 ml-3 mx-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              suppressHydrationWarning={suppressText}
            >
              {t('next')}
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default PaginationComponent;

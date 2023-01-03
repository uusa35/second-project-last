import { FC } from 'react';
import { map, range } from 'lodash';
import { useTranslation } from 'react-i18next';
import { suppressText } from '@/constants/*';

const CategoryLoadingSkeleton: FC = (): JSX.Element => {
  const {t} = useTranslation(); 
  return (
    <div role="status" className="w-full space-y-3 animate-pulse">
      {map(range(0, 8), (i) => (
        <div key={i}>
          <div className="flex justify-between items-center border rounded-md border-gray-200 p-4">
            <div className={`my-2`}>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="h-12 bg-gray-300 dark:bg-gray-700 w-12"></div>
          </div>
          <span className="sr-only" suppressHydrationWarning={suppressText}>{t('loading...')}</span>
        </div>
      ))}
      <span className="sr-only" suppressHydrationWarning={suppressText}>{t('loading...')}</span>
    </div>
  );
};

export default CategoryLoadingSkeleton;

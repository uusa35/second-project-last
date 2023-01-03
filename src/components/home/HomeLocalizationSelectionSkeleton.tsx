import { map, range } from 'lodash';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
const HomeLocalizationSelectionSkeleton: FC = (): JSX.Element => {
  const {t} = useTranslation();
  return (
    <>
      {map(range(0, 2), (i) => (
        <div
          key={i}
          role="status"
          className="flex flex-1 flex-row items-center justify-between w-full animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded-sm dark:bg-gray-700 w-1/2  mx-4 "></div>
          <div className="h-4 bg-gray-200 rounded-sm dark:bg-gray-700 w-1/2  mx-4 "></div>
          <span className="sr-only">{t('loading...')}</span>
        </div>
      ))}
    </>
  );
};

export default HomeLocalizationSelectionSkeleton;

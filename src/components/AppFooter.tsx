import { useTranslation } from 'react-i18next';
import { FC, Suspense } from 'react';
const AppFooter: FC = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Suspense>
      <footer
        className={`relative left-0 bottom-0 py-4 w-full`}
      >
        <div className="flex justify-center text-gray-500 w-full">
          <h1> {t('powered_by_queue')} &reg;</h1>
        </div>
      </footer>
    </Suspense>
  );
};

export default AppFooter;

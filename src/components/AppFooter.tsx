import { useTranslation } from 'react-i18next';
import { FC, Suspense } from 'react';
const AppFooter: FC = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Suspense>
      <footer
        className={`fixed w-full lg:w-2/4 xl:w-1/3 h-16 left-0 bottom-0 flex flex-row justify-center items-center text-center py-4 border-amber-500 border-2 bg-blue-100`}
      >
        <h1> {t('powered_by_queue')} &reg;</h1>
      </footer>
    </Suspense>
  );
};

export default AppFooter;

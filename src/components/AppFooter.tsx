import { useTranslation } from 'react-i18next';
import { FC, Suspense } from 'react';
const AppFooter: FC = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Suspense>
      <footer
        className={`fixed w-full lg:w-2/4 xl:w-1/3 h-16 left-0 -bottom-1 flex flex-col justify-center items-center text-center py-4 bg-white py-2 shadow-inner shadow-lg`}
      >
        <div
          className={`w-full border-b border-stone-100 w-full text-center py-2`}
        >
          Cart Here
        </div>
      </footer>
    </Suspense>
  );
};

export default AppFooter;

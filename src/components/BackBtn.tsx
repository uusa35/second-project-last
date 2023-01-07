import { useAppSelector } from '@/redux/hooks';
import { FC, Suspense } from 'react';
import { useRouter } from 'next/router';
import { isNull } from 'lodash';
import { suppressText } from '../constants';

type Props = {
  backHome: boolean;
  backRoute?: string | null;
  offset: number;
};

const BackBtn: FC<Props> = ({
  backHome,
  backRoute = null,
  offset,
}): JSX.Element => {
  const {
    appSetting: { currentModule },
    locale: { lang },
    country,
  } = useAppSelector((state) => state);
  const router = useRouter();

  const handleGoHome = () => {
    router.push(`/`, ``, {
      scroll: false,
    });
  };

  return (
    <Suspense>
      <div
        className={`${
          offset < 80 ? `block` : `hidden`
        } flex w-full my-3 justify-center items-center rounded-md py-4 px-4`}
      >
        <button
          onClick={() =>
            backHome
              ? handleGoHome()
              : !isNull(backRoute)
              ? router.push(`${backRoute}`, undefined, {
                  locale: lang,
                  scroll: false,
                })
              : router.back()
          }
          className={`flex justify-start items-center pt-1 w-20`}
        >
          {router.locale === 'en' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          )}
        </button>
        <div
          className={`flex flex-1 justify-center items-center pt-1 ltr:pr-20 rtl:pl-20`}
        >
          <span
            className={`text-md capitalize truncate overflow-hidden max-w-md`}
            suppressHydrationWarning={suppressText}
          >
            {currentModule}
          </span>
        </div>
      </div>
    </Suspense>
  );
};

export default BackBtn;

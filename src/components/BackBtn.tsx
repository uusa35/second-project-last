import Image from 'next/image';
import LeftArrow from '@/appIcons/left_arrow.svg';
import RightArrow from '@/appIcons/right_arrow.svg';
import { useAppSelector } from '@/redux/hooks';
import { FC, Suspense } from 'react';
import { useRouter } from 'next/router';
import { isNull } from 'lodash';
import { imageSizes, suppressText } from '../constants';

type Props = {
  backHome: boolean;
  backRoute?: string | null;
};

const BackBtn: FC<Props> = ({ backHome, backRoute = null }): JSX.Element => {
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
      {router.pathname !== '/' && (
        <div className="flex w-full my-3 justify-center items-center rounded-md px-8">
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
            <Image
              src={router.locale === 'ar' ? RightArrow : LeftArrow}
              fill={false}
              width={imageSizes.xs}
              height={imageSizes.xs}
              className={`w-3 h-3 md:w-5 md:h-5 object-contain`}
              alt={`arrow`}
            />
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
      )}
    </Suspense>
  );
};

export default BackBtn;

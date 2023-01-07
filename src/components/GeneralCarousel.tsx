import React, { FC } from 'react';
import Carousel from 'react-material-ui-carousel';
import Image from 'next/image';
import { map } from 'lodash';
import ImageNotFound from '@/appImages/not_found.png';
import { imageSizes, suppressText } from '../constants';
import { useTranslation } from 'react-i18next';
import LogoImage from '@/appImages/logo.png';

type Props = {
  slides: any;
  cover?: boolean;
  h?: string;
  w?: string;
};
const GeneralCarousel: FC<Props> = ({
  slides = [],
  h = `8rem`,
  w = `w-full`,
  cover = true,
}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className={`flex flex-1 justify-center items-center  my-3`}>
      <Carousel
        className={`${w}`}
        navButtonsAlwaysInvisible={true}
        height={h}
        indicatorIconButtonProps={{
          style: {
            padding: '1px', // 1
            // color: 'blue'       // 3
          },
        }}
        activeIndicatorIconButtonProps={{
          style: {
            padding: '0.5px', // 1
            fontSize: '1px',
            // backgroundColor: 'red'
          },
        }}
        indicatorContainerProps={{
          style: {
            marginTop: '2px', // 5
          },
        }}
      >
        {slides.length === 0 ? (
          <div className="flex justify-center h-full">
            <Image
              alt={`${t('not_found')}`}
              className="h-full rounded-md"
              src={ImageNotFound}
              width={imageSizes.xs}
              height={imageSizes.xs}
              suppressHydrationWarning={suppressText}
            />
          </div>
        ) : (
          <div className="flex justify-center w-full h-auto rounded-md w-full h-auto">
            {map(slides, (img, i) => (
              <Image
                key={i}
                className={`${
                  cover ? `object-cover` : `object-contain`
                } w-full h-auto rounded-md`}
                src={img}
                alt={`${t('slides')}`}
                fill={true}
                suppressHydrationWarning={suppressText}
              />
            ))}
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default GeneralCarousel;

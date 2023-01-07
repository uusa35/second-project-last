import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';
import NoFoundImage from '@/appImages/not_found.png';
import { imageSizes } from '@/constants/*';

type Props = {
  src: string;
  alt: string;
  [x: string]: any;
  fill?: boolean;
};

const CustomImage: FC<Props> = ({
  src = '',
  alt = 'img',
  fill = false,
  ...rest
}): JSX.Element => {
  const [imgSrc, setImageSrc] = useState<string>(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      alt={alt}
      src={imgSrc}
      fill={fill}
      onError={(e) => {
        console.log('e image', e);
        setImageSrc(NoFoundImage.src);
      }}
    />
  );
};

export default CustomImage;

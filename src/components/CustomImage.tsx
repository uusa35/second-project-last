import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';
import NoFoundImage from '@/appImages/not_found.png';

type Props = {
  src: string;
  alt: string;
  className: string;
  fill?: boolean;
};

const CustomImage: FC<Props> = ({
  src,
  alt = 'img',
  fill = false,
  className,
  ...rest
}): JSX.Element => {
  const [imgSrc, setImageSrc] = useState<string>(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <Image
      alt={alt}
      src={imgSrc}
      fill={fill}
      onError={(e) => {
        console.log('e image', e);
        setImageSrc(NoFoundImage.src);
      }}
      className={className}
      {...rest}
    />
  );
};

export default CustomImage;

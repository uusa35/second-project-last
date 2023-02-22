import Image from 'next/image';
import React, { FC, useState } from 'react';
import NoFoundImage from '@/appImages/not_found.png';
import { imageSizes, suppressText } from '@/constants/*';

type Props = {
  src: string;
  alt: string;
  className: string;
  fill?: boolean;
  width?: number;
  height?: number;
};

const CustomImage: FC<Props> = ({
  src,
  alt = 'img',
  fill = false,
  className,
  width = imageSizes.xs,
  height = imageSizes.xs,
  ...rest
}): JSX.Element => {
  const [imgSrc, setImageSrc] = useState<string>(src);

  return (
    <Image
      {...rest}
      alt={alt}
      src={imgSrc}
      width={width}
      height={height}
      fill={fill}
      onError={(e) => {
        setImageSrc(NoFoundImage.src);
      }}
      className={className}
      suppressHydrationWarning={suppressText}
    />
  );
};

export default CustomImage;

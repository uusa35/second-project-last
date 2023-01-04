import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';
import img_not_found_thumbNail from '@/appImages/img_not_found_thumbNail.png';

type Props = {
  src: string;
  alt: string;
  [x: string]: any;
};

const CustomImage: FC<Props> = ({
  src = '',
  alt = 'img',
  ...rest
}): JSX.Element => {
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  // useEffect(()=>{
  //   console.log(error,src)
  // },[error])

  return (
    <Image
      {...rest}
      alt={alt}
      src={error ? img_not_found_thumbNail : src}
      onError={() => {
        setError(true);
      }}
    />
  );
};

export default CustomImage;

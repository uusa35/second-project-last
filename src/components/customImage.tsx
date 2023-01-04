import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';
import NoFoundImage from '@/appImages/not_found.png';

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
      src={error ? NoFoundImage.src : src}
      onError={() => {
        setError(true);
      }}
    />
  );
};

export default CustomImage;

import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';

type Props = {
  src: string;
  alt: string;
  [x:string]: any;
};

const CustomImage: FC<Props> = ({
  src = '',
  alt = '',
  ...rest
}): JSX.Element => {
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <Image
      {...rest}
      alt={alt}
      src={error ? '' : src}
      onError={() => {
        setError(true);
      }}
    />
  );
};

export default CustomImage;

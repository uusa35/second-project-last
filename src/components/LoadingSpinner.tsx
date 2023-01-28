import React, { FC } from 'react';
import ReactLoading from 'react-loading';

type Props = {
  fullWidth?: boolean;
};

const LoadingSpinner: FC<Props> = ({ fullWidth = true }): JSX.Element => {
  return (
    <div
      className={`${
        fullWidth ? `w-full lg:w-2/4 xl:w-1/3 min-h-screen` : `w-auto h-auto`
      } flex items-center justify-center`}
    >
      <ReactLoading type="spin" color="#9ca3af"></ReactLoading>
    </div>
  );
};

export default LoadingSpinner;

import React, { FC } from 'react';
import ReactLoading from 'react-loading';

const LoadingSpinner: FC = (): JSX.Element => {
  return (
    <div className="w-full lg:w-2/4 xl:w-1/3 min-h-screen flex items-center justify-center">
      <ReactLoading type="spin" color="#189EC9"></ReactLoading>
    </div>
  );
};

export default LoadingSpinner;

import React, { FC } from 'react';
import ReactLoading from 'react-loading';

const LoadingSpinner: FC = (): JSX.Element => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <ReactLoading type="spin" color="#189EC9"></ReactLoading>
    </div>
  );
};

export default LoadingSpinner;

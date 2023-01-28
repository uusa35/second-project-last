import React, { Suspense } from 'react';
import { ToastContainer, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import { useAppSelector } from '@/redux/hooks';
import { tajwalFont } from '@/constants/*';
import { themeColor } from '@/redux/slices/vendorSlice';
import CloseIcon from '@mui/icons-material/Close';

const ToastAppContainer = () => {
  const {
    locale: { isRTL },
    appSetting: {
      toastMessage: { type },
    },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  return (
    <Suspense>
      <ToastContainer
        position={isRTL ? `top-right` : 'top-left'}
        className={`${tajwalFont} opacity-80 shadow-inner shadow-lg mt-[7%] w-full lg:w-2/4 xl:w -1/3 rtl:right-0 ltr:left-0`}
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        transition={Flip}
        closeOnClick
        rtl={isRTL}
        pauseOnFocusLoss
        pauseOnHover
        // theme="light"
        // bodyStyle={{ backgroundColor: `yellow` }}
        // style={{ width: 'inherit' }}
        // toastClassName={`w-full`}
        // progressClassName={`bg-red-900`}
        // bodyClassName={`w-full`}
        toastStyle={{
          backgroundColor: type === `error` ? `red` : color,
          color: `white`,
        }}
        closeButton={
          <div>
            <CloseIcon color={`white`} />
          </div>
        }
      />
    </Suspense>
  );
};

export default ToastAppContainer;

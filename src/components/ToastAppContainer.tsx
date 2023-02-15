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
        position={isRTL ? `top-center` : 'top-center'}
        className={`${tajwalFont} opacity-90 shadow-inner font-extrabold text-white w-max`}
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        transition={Flip}
        limit={1}
        closeOnClick
        rtl={isRTL}
        pauseOnFocusLoss
        pauseOnHover
        // bodyStyle={{ height: 'auto' }}
        // style={{ width: `45vh` }}
        // theme="light"
        // progressClassName={`bg-red-900`}
        // toastClassName={`p-0 m-0 w-full `}
        // bodyClassName={`p-0 m-0 w-full `}
        toastStyle={{
          backgroundColor: type === `error` ? `red` : color,
          color: `white`,
        }}
        closeButton={
          <div>
            <CloseIcon style={{ color: `white` }} />
          </div>
        }
      />
    </Suspense>
  );
};

export default ToastAppContainer;

import React, { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
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
        position={isRTL ? `bottom-left` : 'bottom-right'}
        className={`${tajwalFont} opacity-80 shadow-inner shadow-lg`}
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={isRTL}
        pauseOnFocusLoss
        pauseOnHover
        // theme="light"
        // bodyStyle={{ backgroundColor: `yellow` }}
        // style={{ color: `white` }}
        // toastClassName={`bg-lime-600`}
        // progressClassName={`bg-red-900`}
        // bodyClassName={`bg-green-600`}
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

import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import { useAppSelector } from '@/redux/hooks';
import { tajwalFont } from '@/constants/*';

const ToastAppContainer = () => {
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);
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
        theme="colored"
      />
    </Suspense>
  );
};

export default ToastAppContainer;

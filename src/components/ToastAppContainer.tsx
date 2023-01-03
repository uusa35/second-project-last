import { ToastContainer } from 'react-toastify';
import { useAppSelector } from '@/redux/hooks';
import { tajwalFont } from '@/constants/*';

const ToastAppContainer = () => {
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);
  return (
    <ToastContainer
      position={isRTL ? `top-left` : 'top-right'}
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
  );
};

export default ToastAppContainer;

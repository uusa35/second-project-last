import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';

const ProductShow = () => {
  return (
    <MainContentLayout>
      <div>ProductShow</div>
    </MainContentLayout>
  );
};

export default ProductShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    return {
      props: {},
    };
  }
);

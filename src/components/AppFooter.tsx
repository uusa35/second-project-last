import { FC, Suspense } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import ProductShowFooter from '@/components/footer/ProductShowFooter';
import CartIndexFooter from '@/components/footer/CartIndexFooter';
import CartAddressFooter from '@/components/footer/CartAddressFooter';
import CutomerInfoFooter from '@/components/footer/CutomerInfoFooter';
import ReviewOrderFooter from '@/components/footer/ReviewOrderFooter';

type Props = {
  handleSubmit?: (element?: any) => void;
  handleIncreaseProductQty?: () => void;
  handleDecreaseProductQty?: () => void;
  productCurrentQty?: number | undefined;
  productOutStock?: boolean | undefined;
};

const AppFooter: FC<Props> = ({
  handleSubmit,
  handleDecreaseProductQty,
  handleIncreaseProductQty,
  productCurrentQty,
  productOutStock,
}): JSX.Element => {
  const {
    appSetting: { showFooterElement, method, url },
    customer: { userAgent },
    locale: { isRTL },
    branch: { id: branchId },
    area,
  } = useAppSelector((state) => state);
  const { data: cartItems, isSuccess } = useGetCartProductsQuery({
    UserAgent: userAgent,
    area_branch:
      method === `pickup`
        ? { 'x-branch-id': branchId }
        : { 'x-area-id': area.id },
    url,
  });

  return (
    <Suspense>
      <footer
        className={`${!isRTL ? `left-0` : `right-0`} ${
          showFooterElement === `home` ? `bottom-0` : `bottom-0`
        } fixed w-full lg:w-2/4 xl:w-1/3 h-auto flex flex-col justify-center items-center text-center bg-white bg-opacity-60 capitalize`}
      >
        {showFooterElement === 'product_show' && (
          <ProductShowFooter
            productCurrentQty={productCurrentQty}
            handleIncreaseProductQty={handleIncreaseProductQty}
            handleDecreaseProductQty={handleDecreaseProductQty}
            productOutStock={productOutStock}
          />
        )}
        {showFooterElement === 'cart_index' &&
          isSuccess &&
          cartItems &&
          cartItems.data &&
          cartItems.data?.Cart?.length > 0 && <CartIndexFooter />}

        {showFooterElement === 'cart_address' && (
          <CartAddressFooter handleSubmit={handleSubmit} />
        )}

        {showFooterElement === 'customerInfo' && (
          <CutomerInfoFooter handleSubmit={handleSubmit} />
        )}
        {showFooterElement === 'order_review' && (
          <ReviewOrderFooter handleSubmit={handleSubmit} />
        )}
      </footer>
    </Suspense>
  );
};

export default AppFooter;

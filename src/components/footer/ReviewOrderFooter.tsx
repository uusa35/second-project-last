import { footerBtnClass, suppressText } from '@/constants/*';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentSummary from '@/widgets/cart/review/PaymentSummary';
import { isEmpty } from 'lodash';

type Props = {
  handleSubmit?: (element?: any) => void;
};

const ReviewOrderFooter: FC<Props> = ({ handleSubmit }) => {
  const { t } = useTranslation();
  const {
    appSetting: { method, url },
    customer: { userAgent, name, phone, address },
    branch: { id: branchId },
    area,
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const {
    data: cartItems,
    isSuccess,
    refetch: refetchCart,
  } = useGetCartProductsQuery({
    UserAgent: userAgent,
    area_branch:
      method === `pickup`
        ? { 'x-branch-id': branchId }
        : { 'x-area-id': area.id },
    url,
  });
  return (
    <div className={`h-fit w-full`}>
      {isSuccess &&
        cartItems.data &&
        cartItems.data.total &&
        cartItems.data.subTotal && (
          <div className="px-4 pt-2 bg-stone-100 opacity-80">
            <div className="flex items-center py-1">
              <ReceiptIcon style={{ color }} />
              <div className="ps-5">
                <h4
                  className="font-semibold text-lg"
                  suppressHydrationWarning={suppressText}
                >
                  {t('payment_summary')}
                </h4>
              </div>
            </div>
            <PaymentSummary />
          </div>
        )}
      <div
        className={`text-white w-full h-fit px-8 py-4 flex justify-center items-center rounded-t-xl`}
        style={{
          background: `-webkit-gradient(linear, left top, right top, from(${color}), color-stop(100%, ${color}), color-stop(50%, ${color}))`,
        }}
      >
        <button
          disabled={!name || !phone || !userAgent}
          className={`${footerBtnClass}`}
          style={{ backgroundColor: `${color}`, color: `white` }}
          suppressHydrationWarning={suppressText}
          onClick={() => (handleSubmit ? handleSubmit() : null)}
        >
          {t('place_order')}
        </button>
      </div>
    </div>
  );
};

export default ReviewOrderFooter;

import Image from 'next/image';
import VisaImage from '@/appImages/payment/visa.png';
import KnetImage from '@/appImages/payment/knet.png';
import CashImage from '@/appImages/cash_on_delivery.png';
import { FC } from 'react';
import { imageSizes } from '@/constants/*';
import CustomImage from '@/components/CustomImage';

type Props = {
  paymentMethod: string;
};
const PaymentImage: FC<Props> = ({ paymentMethod }) => {
  switch (paymentMethod) {
    case `visa`:
      return (
        <CustomImage
          src={VisaImage.src}
          alt={`${paymentMethod}`}
          width={imageSizes.xs}
          height={imageSizes.xs}
          className={`w-6 h-5 rounded-sm object-cover`}
        />
      );
      break;
    case `knet`:
      return (
        <CustomImage
          src={KnetImage.src}
          width={imageSizes.xs}
          height={imageSizes.xs}
          alt={`${paymentMethod}`}
          className={`w-6 h-5 rounded-sm object-cover`}
        />
      );
      break;
    case `cash`:
      return (
        <CustomImage
          src={CashImage.src}
          width={imageSizes.xs}
          height={imageSizes.xs}
          alt={`${paymentMethod}`}
          className={`w-6 h-5 rounded-sm object-cover`}
        />
      );
      break;
    default:
      return (
        <CustomImage
          src={CashImage.src}
          width={imageSizes.xs}
          height={imageSizes.xs}
          alt={`${paymentMethod}`}
          className={`w-6 h-5 rounded-sm object-cover`}
        />
      );
      break;
  }
};

export default PaymentImage;

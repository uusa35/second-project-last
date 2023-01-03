import Image from 'next/image';
import VisaImage from '@/appImages/payment/visa.png';
import KnetImage from '@/appImages/payment/knet.png';
import CashImage from '@/appImages/cash_on_delivery.png';
import { FC } from 'react';
import { imageSizes } from '@/constants/*';

type Props = {
  paymentMethod: string;
};
const PaymentImage: FC<Props> = ({ paymentMethod }) => {
  switch (paymentMethod) {
    case `visa`:
      return (
        <Image
          src={VisaImage}
          alt={`${paymentMethod}`}
          width={imageSizes.xs}
          height={imageSizes.xs}
          className={`w-6 h-5 rounded-sm object-cover`}
        />
      );
      break;
    case `knet`:
      return (
        <Image
          src={KnetImage}
          width={imageSizes.xs}
          height={imageSizes.xs}
          alt={`${paymentMethod}`}
          className={`w-6 h-5 rounded-sm object-cover`}
        />
      );
      break;
    case `cash`:
      return (
        <Image
          src={CashImage}
          width={imageSizes.xs}
          height={imageSizes.xs}
          alt={`${paymentMethod}`}
          className={`w-6 h-5 rounded-sm object-cover`}
        />
      );
      break;
    default:
      return (
        <Image
          src={CashImage}
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

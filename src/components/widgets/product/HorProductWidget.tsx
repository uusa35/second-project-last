import { FC } from 'react';
import { appLinks, imageSizes, imgUrl } from '@/constants/*';
import { Product } from '@/types/index';
import NoFoundImage from '@/appImages/not_found.png';
import { first, isEmpty } from 'lodash';
import Link from 'next/link';
import CustomImage from '@/components/customImage';
import { useTranslation } from 'react-i18next';

type Props = {
  element: Product;
};
const HorProductWidget: FC<Props> = ({ element }): JSX.Element => {
  const { t } = useTranslation();
  const firstImage = !isEmpty(element.img)
    ? imgUrl(first(element.img).thumbnail)
    : NoFoundImage.src;

  // console.log('element', element);
  return (
    <Link
      href={`${appLinks.productShow(
        element.id.toString(),
        element.id,
        element.name
      )}`}
      className={`h-80 lg:h-80 shadow-7xl rounded-lg  mb-5 block border-gray-100 border-2`}
    >
      <div className="relative">
        <div className="h-60 w-full overflow-hidden rounded-lg">
          <CustomImage
            src={`${firstImage}`}
            alt={element.name}
            width={imageSizes.sm}
            height={imageSizes.sm}
            className="h-60 w-full object-cover object-center"
          />
        </div>
        <div className="ps-5 pt-3">
            <p className="text-md font-semibold truncate">
              {element.name}
            </p>
            <p className="text-lg text-primary_BG font-semibold capitalize">
              {element.price} {t(`kd`)}
            </p>
        </div>
        {/* <div className="absolute inset-x-0 top-0 flex h-full items-end justify-end overflow-hidden rounded-lg">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black opacity-60"
          />
          
        </div> */}
      </div>
    </Link>
  );
};

export default HorProductWidget;

import { FC } from 'react';
import { Category } from '@/types/queries';
import Image from 'next/image';
import { appLinks, imageSizes, imgUrl } from '@/constants/*';
import { Product } from '@/types/index';
import NoFoundImage from '@/appImages/not_found.png';
import { first, isEmpty } from 'lodash';
import Link from 'next/link';

type Props = {
  element: Product;
};
const HorProductWidget: FC<Props> = ({ element }) => {
  const firstImage = !isEmpty(element.img)
    ? imgUrl(first(element.img).thumbnail)
    : NoFoundImage.src;

  console.log('element', element);
  return (
    <Link
      key={element.id}
      href={`${appLinks.productShow(
        element.id.toString(),
        element.id,
        element.name
      )}`}
    >
      <div className="relative">
        <div className="relative h-60 w-full overflow-hidden rounded-lg">
          <Image
            src={`${firstImage}`}
            alt={element.name}
            width={imageSizes.sm}
            height={imageSizes.sm}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-x-0 top-0 flex h-60 items-end justify-end overflow-hidden rounded-lg">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
          />
          <div className="flex flex-row w-full px-2 justify-between items-center">
            <p className="relative text-md font-semibold text-white">
              {element.name}
            </p>
            <p className="relative text-md font-semibold text-white">
              {element.price}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HorProductWidget;

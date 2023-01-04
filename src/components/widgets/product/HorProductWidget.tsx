import { FC } from 'react';
import { Category } from '@/types/queries';
import Image from 'next/image';
import { imageSizes, imgUrl } from '@/constants/*';
import { Product } from '@/types/index';
import NoFoundImage from '@/appImages/not_found.png';

type Props = {
  element: Product;
};
const HorProductWidget: FC<Props> = ({ element }) => {
  return (
    <div key={element.id}>
      <div className="relative">
        <div className="relative h-60 w-full overflow-hidden rounded-lg">
          <Image
            src={`${NoFoundImage}`}
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
    </div>
  );
};

export default HorProductWidget;

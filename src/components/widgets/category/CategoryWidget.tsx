import { FC } from 'react';
import { Category } from '@/types/queries';
import CustomImage from '@/components/customImage';
import { appLinks, imageSizes, imgUrl } from '@/constants/*';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';

type Props = {
  element: Category;
};
const CategoryWidget: FC<Props> = ({ element }) => {
  const { branch } = useAppSelector((state) => state);
  return (
    <Link href={appLinks.productIndex(element.id.toString(), branch.id)}>
      <div className="relative h-auto">
        <div className="relative w-full h-auto overflow-hidden rounded-lg">
          <CustomImage
            src={`${imgUrl(element.img)}`}
            alt={element.name}
            width={imageSizes.sm}
            height={imageSizes.sm}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-x-0 top-0 flex h-full items-end justify-end overflow-hidden rounded-lg">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
          />
          <div className="flex flex-row w-full px-2 justify-between items-center py-4">
            <p className="relative text-md font-semibold text-white">
              {element.name}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryWidget;

import { FC } from 'react';
import { Category } from '@/types/queries';
import CustomImage from '@/components/CustomImage';
import { appLinks, imageSizes, imgUrl } from '@/constants/*';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';
import { isNull, kebabCase, lowerCase } from 'lodash';
import { suppressText } from '@/constants/*';
import TextTrans from '@/components/TextTrans';
import { motion } from 'framer-motion';

type Props = {
  element: Category;
};
const CategoryWidget: FC<Props> = ({ element }) => {
  const {
    branch,
    area,
    appSetting: { method },
  } = useAppSelector((state) => state);

  return (
    <motion.div whileTap={{ opacity: 1 }} whileHover={{ opacity: 0.8 }}>
      <Link
        href={
          (method === `pickup` && isNull(branch.id)) ||
          (method === `delivery` && isNull(area.id))
            ? appLinks.productIndex(
                element.id.toString(),
                kebabCase(lowerCase(element.name)),
                branch.id,
                area.id
              )
            : appLinks.productIndexDefined(
                element.id.toString(),
                kebabCase(lowerCase(element.name)),
                method,
                method === `delivery` ? area.id : branch.id
              )
        }
        className={`h-60 lg:h-72 shadow-lg rounded-lg capitalize`}
        suppressHydrationWarning={suppressText}
        data-cy="category"
      >
        <div className="relative">
          <div className="relative w-full h-auto overflow-hidden rounded-lg">
            <CustomImage
              src={`${imgUrl(element.img)}`}
              alt={element.name}
              width={imageSizes.sm}
              height={imageSizes.sm}
              className="h-60 lg:h-72 w-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-x-0 top-0 flex h-full items-end justify-end overflow-hidden rounded-lg">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black opacity-60"
            />
            <div className="flex flex-row w-full px-2 justify-between items-center py-4">
              <p
                className="relative text-md font-semibold text-white"
                suppressHydrationWarning={suppressText}
              >
                <TextTrans
                  style={{
                    maxWidth: '30ch',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow : 'hidden',
                    display:'block'
                  }}
                  ar={element.name_ar}
                  en={element.name_en}
                />
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryWidget;

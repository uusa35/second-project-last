import { FC } from 'react';
import { appLinks, imageSizes, imgUrl } from '@/constants/*';
import { Product } from '@/types/index';
import NoFoundImage from '@/appImages/not_found.png';
import { first, isEmpty } from 'lodash';
import Link from 'next/link';
import CustomImage from '@/components/CustomImage';
import { useTranslation } from 'react-i18next';
import { suppressText } from '@/constants/*';
import { useAppSelector } from '@/redux/hooks';
import TextTrans from '@/components/TextTrans';

type Props = {
  element: Product;
};
const HorProductWidget: FC<Props> = ({ element }): JSX.Element => {
  const { t } = useTranslation();
  const {
    branch: { id: branchId },
    area: { id: areaId },
  } = useAppSelector((state) => state);
  const firstImage: any = !isEmpty(element.img)
    ? imgUrl(first(element.img).thumbnail)
    : NoFoundImage.src;

  return (
    <Link
      href={`${appLinks.productShow(
        element.id.toString(),      
        element.id,
        element.name,
        branchId,
        areaId
      )}`}
      className={`h-80 lg:h-80 shadow-7xl rounded-lg  mb-5 block border-gray-100 border-2 capitalize`}
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
        <div className="pt-3 px-2">
          <p
            className="text-md font-semibold truncate"
            suppressHydrationWarning={suppressText}
          >
            <TextTrans ar={element.name_ar} en={element.name_en} />
            <TextTrans
              ar={element.description_ar}
              en={element.description_en}
            />
          </p>
          <div className="flex justify-between items-center">
            <p
              className="text-md text-primary_BG text-end uppercase pb-2"
              suppressHydrationWarning={suppressText}
            >
              {element.price} {t(`kwd`)}
            </p>
            <button
              className="border-[1px] rounded-md border-primary_BG px-4 uppercase text-center text-sm"
              suppressHydrationWarning={suppressText}
            >
              + {t('add')}
            </button>
          </div>
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

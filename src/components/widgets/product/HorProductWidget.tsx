import { FC } from 'react';
import { appLinks, imageSizes } from '@/constants/*';
import { Product } from '@/types/index';
import NoFoundImage from '@/appImages/not_found.png';
import { kebabCase, lowerCase } from 'lodash';
import Link from 'next/link';
import CustomImage from '@/components/CustomImage';
import { useTranslation } from 'react-i18next';
import { suppressText } from '@/constants/*';
import { useAppSelector } from '@/redux/hooks';
import TextTrans from '@/components/TextTrans';
import { themeColor } from '@/redux/slices/vendorSlice';
import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = {
  element: Product;
  category_id?: string | null;
};
const HorProductWidget: FC<Props> = ({
  element,
  category_id = null,
}): JSX.Element => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const {
    branch: { id: branchId },
    area: { id: areaId },
  } = useAppSelector((state) => state);
  return (
    <Link
      href={`${appLinks.productShow(
        element.id.toString(),
        element.id,
        lowerCase(kebabCase(element.name)),
        branchId,
        areaId,
        category_id
      )}`}
      className={`h-full  shadow-7xl block  capitalize mb-2 py-3 pb-8 border-b-2 border-gray-100  overflow-hidden`}
      data-cy="product"
    >
      <div className="h-3/4 w-full overflow-hidden rounded-lg">
        <Image
          src={`${element.cover}`}
          alt={element.name}
          width={imageSizes.lg}
          height={imageSizes.lg}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className=" h-1/4 pt-3 px-2">
        <p
          className="text-md font-semibold truncate"
          suppressHydrationWarning={suppressText}
        >
          <TextTrans
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              display: 'block',
              color: `black`,
            }}
            ar={element.name_ar}
            en={element.name_en}
            length={60}
          />
          <TextTrans
            style={{
              maxWidth: '30ch',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              display: 'block',
              color: `black`,
            }}
            ar={element.description_ar}
            en={element.description_en}
          />
        </p>
        <div className="flex justify-between items-end">
          {element.new_price && element.new_price !== element.price ? (
            <div>
              <p
                className="uppercase line-through"
                style={{ color }}
                suppressHydrationWarning={suppressText}
              >
                {element.price}
              </p>
              <p
                className=" uppercase"
                // style={{ color }}
                suppressHydrationWarning={suppressText}
              >
                {element.new_price} {t('kwd')}
              </p>
            </div>
          ) : (
            <p
              className="text-md uppercase"
              suppressHydrationWarning={suppressText}
              style={{ color: `black` }}
            >
              {parseFloat(element.price).toFixed(3) === '0.000' ? (
                <span className="text-xs">{t(`price_on_selection`)}</span>
              ) : (
                parseFloat(element.price).toFixed(3)
              )}
              {parseFloat(element.price).toFixed(3) !== '0.000' && (
                <span className={`uppercase px-1`}>{t('kwd')}</span>
              )}
            </p>
          )}
          <button
            className="border-[1px] rounded-md px-4 pt-1 uppercase text-center text-sm"
            suppressHydrationWarning={suppressText}
          >
            <div className={`flex justify-between rtl:flex-row-reverse`}>
              <p className="pe-2 rtl:ps-2 rtl:pe-0">+</p>
              <p>{t('add')}</p>
            </div>
          </button>
        </div>
      </div>
      {/* <div className="absolute inset-x-0 top-0 flex h-full items-end justify-end overflow-hidden rounded-lg">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black opacity-60"
          />

        </div> */}
    </Link>
  );
};

export default HorProductWidget;

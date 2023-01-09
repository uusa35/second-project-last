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
const VerProductWidget: FC<Props> = ({ element }): JSX.Element => {
  const { t } = useTranslation();
  const firstImage = !isEmpty(element.img)
    ? imgUrl(first(element.img).thumbnail)
    : NoFoundImage.src;
  console.log('element', element);
  return (
    <Link
      href={`${appLinks.productShow(
        element.id.toString(),
        element.id,
        element.name
      )}`}
      className={`h-36 shadow-7xl rounded-lg mb-10 block border-gray-100 border-2`}
    >
      <div className="relative">
        <div className='flex items-center'>
          <div className="h-auto w-32 overflow-hidden rounded-lg">
            <CustomImage
              src={`${firstImage}`}
              alt={element.name}
              width={imageSizes.sm}
              height={imageSizes.sm}
              className="h-36 w-full object-cover object-center"
            />
          </div>
          <div className="ps-5 w-[100%] pe-5">
            <p className="text-lg truncate pb-5">
              {element.name}
              {element.desc}
            </p>
            <div>
              <div>
                <p className="text-md text-primary_BG text-end uppercase pb-2">
                  {element.price} {t(`kwd`)}
                </p>
                <div className='text-end'>
                  <button className='border-[1px] rounded-md border-primary_BG px-7 uppercase text-center text-sm'>
                    + {t('add')}
                  </button>
                </div>
              </div>
          </div>
          </div>
         
        </div>
        {/* <div className="absolute inset-x-0 top-0 flex h-full items-end overflow-hidden rounded-lg">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black opacity-60"
          />
        </div> */}
      </div>
    </Link>
  );
};

export default VerProductWidget;

import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { grayBtnClass, imageSizes, suppressText } from '@/constants/*';
import { showAreaModal } from '@/redux/slices/appSettingSlice';
import { removeSearchArea } from '@/redux/slices/searchParamsSlice';
import Image from 'next/image';
import SelectedAreaIcon from '@/appIcons/white_area.svg';
import AreasIcon from '@/appIcons/areas.svg';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

const SelectAreaBtn: FC = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    searchParams: { searchArea },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  return (
    <>
      {searchArea.name ? (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          className={
            'grid grid-rows-2 gap-y-2 rounded-xl shadow-custome bg-primary_BG p-3 h-32 drop-shadow-sm'
          }
        >
          <div className="flex flex-col items-start text-white text-sm drop-shadow-sm">
            <p>{searchArea.name}</p>
            <p suppressHydrationWarning={suppressText}>{t('area_selected')}</p>
          </div>

          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <button
                onClick={() => dispatch(showAreaModal(undefined))}
                className={`${grayBtnClass} text-white text-xs bg-TransparentWhite border-0 mb-2`}
                suppressHydrationWarning={suppressText}
              >
                {t('change')}
              </button>
              <button
                onClick={() => {
                  dispatch(removeSearchArea());
                }}
                className={`${grayBtnClass} text-white text-xs bg-TransparentWhite border-0`}
                suppressHydrationWarning={suppressText}
              >
                {t('remove')}
              </button>
            </div>
            <Image
              src={SelectedAreaIcon}
              width={imageSizes.xs}
              height={imageSizes.xs}
              fill={false}
              alt={`sports`}
              className={`w-12 h-12`}
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          className={
            'relative rounded-xl col-span-1 p-8 shadow-lg flex flex-col xl:flex-row items-center justify-center xl:justify-between cursor-pointer  border border-gray-100 h-32 drop-shadow-sm'
          }
        >
          <button
            onClick={() => dispatch(showAreaModal(undefined))}
            className={`flex flex-col space-y-2 justify-center items-center flex-1 drop-shadow-sm`}
          >
            <div className={``}>
              <Image
                src={AreasIcon}
                width={imageSizes.xs}
                height={imageSizes.xs}
                fill={false}
                alt={`sports`}
                className={`w-12 h-12`}
              />
            </div>
            <div className="flex mx-auto items-center px-2 pt-1 text-sm">
              <span
                suppressHydrationWarning={suppressText}
                className={`capitalize`}
              >
                {t('select_area')}
              </span>
              {/* <Image
                  src={router.locale === 'ar' ? LeftArrow : RightArrow}
                  fill={false}
                  className={`w-3 h-3 md:w-5 md:h-5 object-contain`}
                  alt={`arrow`}
                  /> */}
              {/* {searchArea && <span>{searchArea.name}</span>} */}
            </div>
          </button>
        </motion.div>
      )}
    </>
  );
};

export default SelectAreaBtn;

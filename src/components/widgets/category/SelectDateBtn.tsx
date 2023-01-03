import React, { FC } from 'react';
import moment from 'moment/moment';
import { motion } from 'framer-motion';
import { grayBtnClass, imageSizes, suppressText } from '@/constants/*';
import { showPickDateModal } from '@/redux/slices/appSettingSlice';
import Image from 'next/image';
import WhiteCalender from '@/appIcons/white_calender.svg';
import CalenderIcon from '@/appIcons/calender.svg';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { dateSelected } from '@/redux/slices/searchParamsSlice';

const SelectDateBtn: FC = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const searchDateSelected = useAppSelector<string>(dateSelected);

  return (
    <>
      {/*   select date */}
      {moment(searchDateSelected).isValid() ? (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          className={
            'grid grid-rows-2 gap-y-2 rounded-xl shadow-lg bg-primary_BG  p-3 h-fit w-full cursor-pointer drop-shadow-sm'
          }
        >
          <div className="flex flex-col items-start text-white text-sm">
            <p suppressHydrationWarning={suppressText}>{searchDateSelected}</p>
            <p suppressHydrationWarning={suppressText}>{t('date_selected')}</p>
          </div>

          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <button
                onClick={() => dispatch(showPickDateModal(undefined))}
                className={`${grayBtnClass} text-white text-xs bg-TransparentWhite border-0 mb-2`}
                suppressHydrationWarning={suppressText}
              >
                {t('change')}
              </button>
            </div>
            <Image
              src={WhiteCalender}
              width={imageSizes.xs}
              height={imageSizes.xs}
              fill={false}
              alt={`date selected`}
              className={`w-12 h-12`}
            />
          </div>
        </motion.div>
      ) : (
        <motion.button
          onClick={() => dispatch(showPickDateModal(undefined))}
          className={
            'relative rounded-xl col-span-1 p-8 shadow-lg flex flex-col xl:flex-row items-center justify-between cursor-pointer  border border-gray-100 h-32 cursor-pointer drop-shadow-sm'
          }
        >
          <div>
            <Image
              src={CalenderIcon}
              width={imageSizes.xs}
              height={imageSizes.xs}
              fill={false}
              alt={`sports`}
              className={`w-12 h-12`}
            />
          </div>
          <div className="flex mx-auto items-center px-2 pt-1 text-sm drop-shadow-sm">
            <span
              suppressHydrationWarning={suppressText}
              className={`capitalize`}
            >
              {t('select_date')}
            </span>
            {/* <Image
                    src={router.locale === 'ar' ? LeftArrow : RightArrow}
                    fill={false}
                    className={`w-3 h-3 md:w-5 md:h-5 object-contain`}
                    alt={`arrow`}
                  /> */}
            {/* {searchDateSelected && (
                  <span className={`mt-4`}>
                    {t('date')} : {searchDateSelected}
                  </span>
                )} */}
          </div>
          <div className="h-full ">
            <CheckIcon className={`text-white`} />
          </div>
        </motion.button>
      )}
    </>
  );
};

export default SelectDateBtn;

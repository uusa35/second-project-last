import { footerBtnClass, suppressText } from '@/constants/*';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
type Props={
    handleSubmit?: (element?: any) => void;
}
const CutomerInfoFooter:FC<Props>=({handleSubmit}) =>{
    const { t } = useTranslation();
    const color = useAppSelector(themeColor);
    return (
         <div
            className={`text-white w-full h-fit px-8 py-4 flex justify-center items-center rounded-t-xl`}
            style={{
              background: `-webkit-gradient(linear, left top, right top, from(${color}), color-stop(100%, ${color}), color-stop(50%, ${color}))`,
            }}
          >
            <button
              className={`${footerBtnClass}`}
              style={{ backgroundColor: `${color}`, color: `white` }}
              suppressHydrationWarning={suppressText}
              onClick={() => (handleSubmit ? handleSubmit() : null)}
            >
              {t('continue')}
            </button>
          </div>
    );
}

export default CutomerInfoFooter;
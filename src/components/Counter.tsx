import React, { FC } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

type Props = {
  val?: string;
  inc: () => void;
  dec: () => void;
  iconClr?: string;
  iconSize?: number;
  inputClassName?: string;
  containerClassName?: string;
};

const Counter: FC<Props> = ({
  val = '1',
  inc,
  dec,
  iconClr = '',
  iconSize = 18,
  inputClassName = 'bg-primary_BG outline-none text-center text-white py-1 mx-2 w-10 h-6',
  containerClassName = '',
}): JSX.Element => {
  return (
    <div className={containerClassName + ' flex justif-center items-center'}>
      <div className="cursor-pointer" onClick={dec}>
        <RemoveIcon sx={{ color: iconClr, fontSize: iconSize }} />
      </div>
      <input
        value={val}
        type="text"
        readOnly
        className={`${inputClassName} rounded-full outline-none text-sm pt-2 ${router.locale === 'ar' && arboriaFont}`}
      />
      <div className="cursor-pointer" onClick={(e)=>{e.stopPropagation(); inc()}}>
        <AddIcon sx={{ color: iconClr, fontSize: iconSize }} />
      </div>
    </div>
  );
};

export default Counter;

import { FC } from 'react';
import { useAppSelector } from '@/redux/hooks';

type Props = {
  ar: string;
  en: string;
  className?: string;
  style?: {};
};
const TextTrans: FC<Props> = ({ ar, en, className = ``, style = {} }) => {
  const { isRTL } = useAppSelector((state) => state.locale);
  return (
    <span className={`capitalize ${className}`} style={style}>
      {isRTL ? ar : en}
    </span>
  );
};
export default TextTrans;

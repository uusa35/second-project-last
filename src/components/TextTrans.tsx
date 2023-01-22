import { FC } from 'react';
import { useAppSelector } from '@/redux/hooks';

type Props = {
  ar: string;
  en: string;
  className?: string;
};
const TextTrans: FC<Props> = ({ ar, en, className = `` }) => {
  const { isRTL } = useAppSelector((state) => state.locale);
  return <span className={`capitalize ${className}`}>{isRTL ? ar : en}</span>;
};
export default TextTrans;

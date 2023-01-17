import { FC } from 'react';
import { useAppSelector } from '@/redux/hooks';

type Props = {
  ar: string;
  en: string;
};
const TextTrans: FC<Props> = ({ ar, en }) => {
  const { isRTL } = useAppSelector((state) => state.locale);
  return <span className={`capitalize`}>{isRTL ? ar : en}</span>;
};
export default TextTrans;

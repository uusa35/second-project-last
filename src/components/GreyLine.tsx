import { FC } from 'react';

type Props = {
  className?: string;
};

const GreyLine: FC<Props> = ({ className='' }): JSX.Element => {
  return (
    <div className={'bg-SearchGrey h-px w-full ' + className}></div>
  );
};

export default GreyLine;

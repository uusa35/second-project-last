import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import ReactLoading from 'react-loading';

type Props = {
  buttonClass?: string;
  containerClass?: string;
  btnValue?: string;
  onClick: (e?: React.MouseEvent<HTMLElement>) => void;
  containerStyle?: Object;
  loading?: boolean;
};

const customButton: FC<Props> = ({
  buttonClass = '',
  containerClass = {},
  btnValue = '',
  onClick,
  containerStyle = {},
  loading = false,
}): JSX.Element => {
  return (
    <div
      // style={containerStyle}
      className={`${containerClass}`}
    >
      <button className={`${buttonClass}`} onClick={() => onClick()}>
        {loading && (
          <ReactLoading
            type="spinningBubbles"
            color="#fff"
            height={20}
            width={20}
          />
        )}
        {btnValue}
      </button>
    </div>
  );
};

export default customButton;

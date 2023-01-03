import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { range } from 'lodash';

function SideMenueSkelton() {
  return (
    <div className="pb-5 pt-3 px-3">
      <Skeleton
        variant="rectangular"
        width={'100%'}
        height={'3rem'}
        className="mb-7 rounded-md"
      />

      {range(0, 10).map((e, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          width={'100%'}
          height={'2rem'}
          className="mb-5 rounded-md"
        />
      ))}
      <Skeleton
        variant="rectangular"
        width={'100%'}
        height={'5rem'}
        className=" rounded-md"
      />
    </div>
  );
}

export default SideMenueSkelton;

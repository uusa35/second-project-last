import { appLinks } from '@/constants/*';
import { useAppSelector } from '@/redux/hooks';
import { Product } from '@/types/index';
import { isEmpty, kebabCase, lowerCase, map } from 'lodash';
import Link from 'next/link';
import React, { FC } from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import HorProductWidget from '../widgets/product/HorProductWidget';

type Props = {
  list: {
    cat_id: number;
    items: Product[];
    name: string;
  };
  i: number;
};
const ProductList: FC<Props> = ({ list, i }) => {
  const {
    branch: { id: branch_id },
    area: { id: area_id },
    appSetting: { method },
  } = useAppSelector((state) => state);
  return (
    <StickyContainer key={i}>
      <div key={i} className={`flex flex-col mt-2 gap-y-4`}>
        {!isEmpty(list.items) && (
          <Sticky>
            {({ style, isSticky }) => (
              <header
                style={style}
                className={`w-full bg-white z-40   ${
                  isSticky
                    ? `relative mt-[80px]   py-3 rounded-none border-t border-b-2 border-stone-100`
                    : ` bg-stone-100 rounded-md`
                }`}
              >
                <Link
                  href={
                    (method === `pickup` && !branch_id) ||
                    (method === `delivery` && !area_id)
                      ? appLinks.productIndex(
                          list.cat_id.toString(),
                          kebabCase(lowerCase(list.name)),
                          branch_id,
                          area_id
                        )
                      : appLinks.productIndexDefined(
                          list.cat_id.toString(),
                          kebabCase(lowerCase(list.name)),
                          method,
                          method === `delivery` ? area_id : branch_id
                        )
                  }
                  className={`flex flex-1 font-bold  ${
                    isSticky ? `text-xl` : `text-lg`
                  }`}
                >
                  {list.name}
                </Link>
              </header>
            )}
          </Sticky>
        )}
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-x-3 py-4'      
                          `}
          data-cy="items"
        >
          {!isEmpty(list.items) &&
            map(list.items, (p: Product, i) => (
              <HorProductWidget
                element={p}
                key={i}
                category_id={list.cat_id.toString()}
              />
            ))}
        </div>
      </div>
    </StickyContainer>
  );
};

export default ProductList;

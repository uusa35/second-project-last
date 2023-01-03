import { useState, useEffect } from 'react';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { NextPage } from 'next';
import { AppQueryResult } from '@/types/queries';
import { useAppDispatch } from '@/redux/hooks';
import MainContentLayout from '@/layouts/MainContentLayout';
import MainHead from '@/components/MainHead';
import { motion } from 'framer-motion';
import { vendorApi } from '@/redux/api/vendorApi';
import { locationApi } from '@/redux/api/locationApi';
import { Vendor } from '@/types/index';

type Props = {
  locations: Location[];
  element: Vendor;
};
let renderCounter: number = 0;
const HomePage: NextPage<Props> = ({ element, locations }): JSX.Element => {
  console.log(`::: Log Home Render :::: ${renderCounter++}`);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();

  console.log('element', element);
  console.log('locations', locations);

  const products = [
    {
      id: 1,
      name: 'Zip Tote Basket',
      color: 'White and black',
      href: '#',
      imageSrc:
        'https://tailwindui.com/img/ecommerce-images/product-page-03-related-product-01.jpg',
      imageAlt:
        'Front of zip tote bag with white canvas, black canvas straps and handle, and black zipper pulls.',
      price: '$140',
    },
    {
      id: 1,
      name: 'Zip Tote Basket',
      color: 'White and black',
      href: '#',
      imageSrc:
        'https://tailwindui.com/img/ecommerce-images/product-page-03-related-product-01.jpg',
      imageAlt:
        'Front of zip tote bag with white canvas, black canvas straps and handle, and black zipper pulls.',
      price: '$140',
    },
  ];

  return (
    <>
      {/* SEO Head DEV*/}
      <MainHead title={element.name} mainImage={element.logo} />
      <MainContentLayout>
        <div className="mt-4 p-4 grid sm:grid-cols-3 lg:grid-cols-2 gap-6">
          {products.map((product) => (
            <div key={product.id}>
              <div className="relative">
                <div className="relative h-60 w-full overflow-hidden rounded-lg">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="absolute inset-x-0 top-0 flex h-60 items-end justify-end overflow-hidden rounded-lg">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                  />
                  <div className="flex flex-row w-full px-2 justify-between items-center">
                    <p className="relative text-md font-semibold text-white">
                      {product.name}
                    </p>
                    <p className="relative text-md font-semibold text-white">
                      {product.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </MainContentLayout>
    </>
  );
};

export default HomePage;
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const {
      data: element,
      isError,
    }: { data: AppQueryResult<Vendor>; isError: boolean } =
      await store.dispatch(vendorApi.endpoints.getVendor.initiate());
    const {
      data: locations,
      isError: locationError,
    }: { data: AppQueryResult<Location>; isError: boolean } =
      await store.dispatch(locationApi.endpoints.getLocations.initiate());

    await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
    if (
      isError ||
      !element.status ||
      !element.Data ||
      !locations.status ||
      !locations.Data ||
      locationError
    ) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        element: element.Data,
        locations: locations.Data,
      },
    };
  }
);

import * as yup from 'yup';
import { kebabCase, lowerCase, split } from 'lodash';
export const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;
//https://pages.testbedbynd.com/
//https://pages-dash.testbedbynd.com/
export const apiUrl = `${baseUrl}api/`;
export const appLinks = {
  root: { path: '/home' },
  home: { path: '/home' },
  productIndex: (
    categoryId: string,
    slug: string,
    branchId?: string,
    areaId?: string,
    page?: string,
    limit?: string
  ) =>
    `/product/${categoryId}?&slug=${slug}&branch_id=${branchId ?? ''}&areaId=${
      areaId ?? ``
    }&page=${page ?? `1`}&limit=${limit ?? `10`}`,

  productSearchIndex: (query?: string, branchId?: string, areaId?: string) =>
    `/product/?key=${query ?? ``}&branch_id=${branchId ?? ''}&areaId=${
      areaId ?? ``
    }`,

  productShow: (
    id: string,
    product_id?: number,
    slug?: string,
    branchId?: string,
    areaId?: string
  ) =>
    `/product/show/${id}?product_id=${product_id}&slug=${kebabCase(
      lowerCase(slug)
    )}&branchId=${branchId ?? ``}&areaId=${areaId ?? ``}`,

  branchIndex: { path: '/branch' },
  cartIndex: { path: '/cart' },
  cartSelectMethod: (method: string) => `/cart/${method}/select`,
  trackOrder: { path: '/order/track' },
  orderReview: { path: '/cart/review' },
  orderFailure: { path: '/order/status/failure' },
  orderSuccess: (orderId: string) => `/order/status/${orderId}/success`,
  orderReceipt: { path: '/order/status/receipt' },
  customerInfo: { path: '/customer/info' },
  vendorShow: { path: '/vendor/show' },
  address: { path: `/cart/address` },
  orderInvoice: (orderId: string) => `/order/${orderId}/invoice`,
};

export const isClient = typeof window !== undefined;
export const isLocal = process.env.NODE_ENV !== 'production';
// export const isLocal = true;
export const inputFieldClass = `rounded-md px-3 py-2.5 mb-2 text-sm bg-gray-100 outline-none border-none capitalize`;
export const mainBg = `bg-gradient-to-tl mix-blend-multiply rounded-md text-sm text-white shadow-inner drop-shadow-md`;
export const submitBtnClass = `w-full ${mainBg} rounded-md text-sm text-white py-4 my-2 cursor-pointer shadow-lg capitalize disabled:from-gray-200 disabled:to-gray-400 drop-shadow-md`;
export const normalBtnClass = `w-full rounded-md text-sm text-white py-4 my-2 cursor-pointer shadow-lg capitalize disabled:from-gray-200 disabled:to-gray-400 drop-shadow-md text-black border border-stone-400 hover:bg-stone-100`;
export const subCategoryBtnClass = `flex w-full flex-row items-center justify-between border border-gray-200 rounded-lg p-4 shadow-md capitalize
                  rtl:bg-gradient-to-r ltr:bg-gradient-to-l from-gray-100 via-gray-200 to-gray-300 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 drop-shadow-md
                  `;
export const grayBtnClass = `rounded-lg bg-SearchGrey text-xs px-[6px] border border-SearchGrey shadow-sm py-1 capitalize drop-shadow-md`;
export const addressInputField = `border-0 outline-none border-b-2 border-b-gray-100 w-full py-4 focus:ring-0 capitalize`;
export const footerBtnClass = `p-2 px-6 rounded-lg w-fit disabled:bg-stone-600 disabled:text-stone-200 disabled:bg-opacity-40 disabled:opacity-60  shadow-xl capitalize border border-stone-100/25 hover:shadow-inner hover:border-stone-200/80 `;
export const tajwalFont = `font-tajwal-medium`;
export const arboriaFont = `font-arboria-light`;
export const gessFont = `font-gess-medium`;
export const langOptions = [
  {
    image: 'en.png',
    value: 'en',
    label: 'English',
  },
  {
    image: 'ar.png',
    value: 'ar',
    label: 'العربية',
  },
];

yup.setLocale({
  mixed: {
    required: 'validation.required',
  },
  number: {
    min: ({ min }) => ({ key: 'validation.min', values: { min } }),
    max: ({ max }) => ({ key: 'validation.max', values: { max } }),
  },
  string: {
    email: 'validation.email',
    min: ({ min }) => ({ key: `validation.min`, values: min }),
    max: ({ max }) => ({ key: 'validation.max', values: max }),
    matches: 'validation.matches',
  },
});

export const suppressText = true;
export const splitPrice = (
  price: string
): { price: string; currency: string } => {
  const element = split(price, ' ', 2);
  return { price: element[0], currency: element[1] };
};

export const apiLogin = async ({ access_token }: { access_token: string }) =>
  await fetch(`/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ access_token }),
  });

export const apiVerified = async ({ verified }: { verified: boolean }) =>
  await fetch(`/api/verified`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ verified }),
  });

export const apiLogout = async () =>
  await fetch(`/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

export const setApiCountry = (country: any) =>
  fetch(`/api/set/country`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ country }),
  });

export const getApiCountry = async () =>
  await fetch(`/api/get/country`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const imageSizes = {
  xs: 100,
  sm: 150,
  md: 250,
  lg: 500,
  xl: 650,
};

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export const imgUrl = (img: string) => `${baseUrl}${img}`;

export const convertColor = (hex: string, opacity: number) => {
  const tempHex = hex.replace('#', '');
  const r = parseInt(tempHex.substring(0, 2), 16);
  const g = parseInt(tempHex.substring(2, 4), 16);
  const b = parseInt(tempHex.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${opacity / 100})`;
};

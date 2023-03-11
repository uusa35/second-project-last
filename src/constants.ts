import NoFoundImage from '@/appImages/not_found.png';
export const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;
// export const xDomain = `next2-q.testbedbynd.com`;
export const xDomain = `next-q.testbedbynd.com`;
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
    `/category/${categoryId}?&slug=${slug}&branch_id=${
      branchId ?? ''
    }&area_id=${areaId ?? ``}&page=${page ?? `1`}&limit=${limit ?? `10`}`,
  productIndexDefined: (
    categoryId: string,
    slug: string,
    method: string,
    elementId: string,
    page?: string,
    limit?: string
  ) =>
    `/category/${categoryId}/${method}/${elementId}?slug=${slug}&page=${
      page ?? `1`
    }&limit=${limit ?? `10`}`,

  productSearchIndex: (query?: string, branchId?: string, areaId?: string) =>
    `/category/?key=${query ?? ``}&branch_id=${branchId ?? ''}&area_id=${
      areaId ?? ``
    }`,

  productShow: (
    id: string,
    product_id?: number,
    slug?: string,
    branchId?: string,
    areaId?: string,
    category_id?: string | null
  ) =>
    `/product/show/${id}?product_id=${product_id}&slug=${slug}&branchId=${
      branchId ?? ``
    }&areaId=${areaId ?? ``}&category_id=${category_id}`,

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
  orderInvoice: (
    orderId: string,
    method: string,
    branchAreaId: string | number
  ) => `/order/${orderId}/${method}/${branchAreaId}/invoice`,
};

export const isLocal = process.env.NODE_ENV !== 'production';
// export const isLocal = true;
export const mainBg = `bg-gradient-to-tl mix-blend-multiply rounded-md text-sm text-white shadow-inner drop-shadow-md`;
export const submitBtnClass = `w-full ${mainBg} rounded-md text-sm text-white py-4 my-2 cursor-pointer shadow-lg capitalize disabled:from-gray-200 disabled:to-gray-400 drop-shadow-md`;
export const addressInputField = `border-0 outline-none border-b-2 border-b-gray-100 w-full py-4 focus:ring-0`;
export const footerBtnClass = `p-2 px-6 rounded-lg w-fit disabled:bg-stone-600 disabled:text-stone-200 disabled:bg-opacity-40 disabled:opacity-60  shadow-xl capitalize border border-stone-100/25 hover:shadow-inner hover:border-stone-200/80 `;
export const tajwalFont = `font-tajwal-medium`;
export const arboriaFont = `font-arboria-light`;
export const gessFont = `font-gess-medium`;

export const suppressText = true;

export const imageSizes = {
  xs: 100,
  sm: 150,
  md: 250,
  lg: 500,
  xl: 650,
  xxl: 1250,
};

// export const imgUrl = (img: string) => `${baseUrl}${img}`;
export const imgUrl = (img: string) =>
  img.includes('http') ? img : NoFoundImage.src;

export const convertColor = (hex: string, opacity: number) => {
  const tempHex = hex.replace('#', '');
  const r = parseInt(tempHex.substring(0, 2), 16);
  const g = parseInt(tempHex.substring(2, 4), 16);
  const b = parseInt(tempHex.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity / 100})`;
};

export const iconColor = `grayscale`;

export const updateUrlParams = (
  url: string,
  name: string,
  value: string | number
) => {
  return url.replace(/\bpage=[0-9a-zA-Z_@.#+-]{1,50}\b/, `${name}=${value}`);
};

export const scrollClass = `scroll-smooth hover:scroll-auto scrollbar-hide`;

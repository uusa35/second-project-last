import { Area, Category, Country } from '@/types/queries';

export interface Product {
  id: number;
  name: string;
  desc: string;
  price: string;
  amount?: number;
  branch_id?: string;
  price_on_selection?: boolean;
  new_price?: string;
  img: img[];
  sections?: productSections[]
}

export interface productSections {
  id: number;
  title: string;
  must_select: string;
  selection_type: string;
  hidden: boolean;
  min_q: number;
  max_q: number;
  choices: sectionChoices[];
}

export interface sectionChoices {
  id: number;
  name: string;
  price: string;
  num: null | number;
}
export interface img {
  thumbnail: string;
  original: string;
}
export interface ProductAddon {
  id: string | number;
  qty: string | number;
  getLocalized?: (name?: string) => string;
  name: string;
  name_ar?: string;
  name_en?: string;
  selection?: string;
  type?: string;
  options?: AddonOption[];
}

export interface AddonOption {
  id: string | number;
  getLocalized?: (name?: string) => string;
  name: string;
  name_ar?: string;
  name_en?: string;
  price?: string | number;
  stock?: string | number;
}

export interface Vendor {
  id: string | number;
  name: string;
  status: string;
  phone: string;
  desc: string;
  cover: string;
  logo: string;
  delivery: string;
  location: string;
  WorkHours: string;
  DeliveryTime: string;
  Preorder_availability: string;
  Payment_Methods: {
    cash_on_delivery: 'yes' | 'no';
    knet: 'yes' | 'no';
    visa: 'yes' | 'no';
  };
}

export interface User {
  [key: string]: string;
  id: string | number;
  name: string;
  name_ar: string;
  name_en: string;
  image?: string;
  email: string;
  mobile?: string;
  description_ar?: string;
  description_en?: string;
}

export interface Locale {
  lang: 'ar' | 'en';
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
  label: string;
  otherLang: 'ar' | 'en';
}

export type ItemList<T> = {
  data: T[];
  links?: {
    first: string | null;
    last?: string | null;
    prev?: string | null;
    next: string | null;
  };
  meta?: {};
  isLoading?: boolean;
  categories?: Categories[] | [];
};
export type ProductList<T extends Product> = ItemList<T> & {
  selectedElement?: Product;
};

export interface User {
  id: number | string;
  name: string;
}

export type hor = `left` | `right`;
export type ver = `top` | `bottom`;
export type position = {
  position: Exclude<`${hor}-${ver}`, 'left-left'> | 'center';
};

export type appSetting = {
  showHeader: boolean;
  showFooter: boolean;
  showCart: boolean;
  sideMenuOpen: boolean;
  currentModule: string;
  showAreaModal: boolean;
  showPickDateModal: boolean;
  showChangePasswordModal: boolean;
  toastMessage: {
    content: string;
    type: string;
    title?: string;
    showToast: boolean;
  };
};

export interface Cart {
  tempId: string;
  products: Product[] | [];
  isEmpty: boolean;
  method: `delivery` | `pickup`;
  paymentMethods: PaymentMethod[];
}

export interface PaymentMethod {
  id: string | number;
  name: string;
  image: string;
}

export interface SearchParams {
  searchArea: Area | object;
  searchCountry: Country;
  searchMainCategory: Category | null;
  searchSubCategory: Category | null;
  searchDateSelected: string | Date;
  searchTimeSelected: string;
  searchGendersSelected: string[];
}

export interface Order {
  isEmpty: boolean;
  orderMode: string;
  order_id: string | number;
}

export interface UserAddress {
  id: number | string;
  area_id: number | string;
  customer_id?: number | string;
  area_id: number | string;
  address: UserAddressFields[];
  area: string;
  latitude?: string;
  longitude?: string;
  type: string;
}

export interface UserAddressFields {
  id: number | string;
  key: string;
  value: string;
}

export interface CustomerInfo{
  name:string,
  email:string,
  phone?:string
}

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
  sections?: productSections[];
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
  orderId: number;
  vendor_name: string;
  endor_logo: string;
  vendor_description: string[];
  branch_phone: string;
  branch_address: string;
}

export interface OrderInvoice {
  order_code: string;
  vendor_name: string;
  vendor_logo: string;
  order_type: string;
  customer: {
    id: number;
    name: string;
    phone: string;
    email: string;
  };
  payment_type: string;
  delivery_address: {
    address: {
      type: string;
      block: string;
      street: string;
    };
    latitude: string;
    longitude: string;
  };
  pickup_details: {
    branch: string;
    longitude: string;
    latitude: string;
  };
  delivery_instruction: string;
  order_details: {
    branch: string;
    branch_address: string;
    order_date: string;
    order_time: string;
  };
  order_summary: {
    sub_total: string;
    total: string;
    delivery_fee: string;
    items: [
      {
        quantity: number;
        item: string;
        addon: string[];
        price: string;
        total: number;
      }
    ];
  };
}

export interface OrderTrack {
  order_status: string;
  order_code: string;
  branch_phone: string;
  estimated_time: string | null;
  address: {
    latitude: string;
    longitude: string;
    address: {
      block: string;
      street: string;
      type: string;
    };
  };
}

export interface OrderUser {
  user_id: string;
  order_type: string;
  UserAgent: string;
  Date: string;
  Time: string;
  Messg: string;
  address_id: number;
  PaymentMethod: string;
}

export interface OrderAddress {
  id: number;
  type: string;
  address: {
    block: string;
    street: string;
  };
  customer_id: number;
}

export interface UserAddressFields {
  id: number | string;
  key: string;
  value: string;
}

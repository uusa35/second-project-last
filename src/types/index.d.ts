import { Address } from '@/types/queries';

export interface Product {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  desc: string;
  description_ar: string;
  description_en: string;
  price: string;
  amount: number | undefined;
  branch_id?: string;
  price_on_selection?: boolean;
  new_price?: string;
  img: img[];
  sections?: ProductSection[];
  cover: string;
}

export interface ProductSection {
  id: number;
  title: string;
  title_ar: string;
  title_en: string;
  must_select: string;
  selection_type: string;
  hidden: boolean;
  min_q: number;
  max_q: number;
  choices: SectionChoice[];
}

export interface SectionChoice {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  price: string;
  num: null | number;
  hidden: boolean;
}
export interface img {
  thumbnail: string;
  original: string;
}

export interface Vendor {
  id: string | number | null;
  name: string;
  name_ar: string;
  name_en: string;
  template_type: string;
  theme_color: string;
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

export type hor = `left` | `right`;
export type ver = `top` | `bottom`;
export type position = {
  position: Exclude<`${hor}-${ver}`, 'left-left'> | 'center';
};

export type appSetting = {
  method: `delivery` | `pickup`;
  url: string;
  productPreview: `hor` | `ver`;
  showFooterElement: string;
  showHeader: boolean;
  showFooter: boolean;
  showCart: boolean;
  sideMenuOpen: boolean;
  currentModule: string;
  showAreaModal: boolean;
  showPickDateModal: boolean;
  showChangePasswordModal: boolean;
  previousUrl: {
    asPath: string;
    pathName: string;
    prevRouterLocale: string;
  };
  toastMessage: {
    content: string;
    type: string;
    title?: string;
    showToast: boolean;
  };
};

export interface ServerCart {
  UserAgent?: string | null;
  Cart: ProductCart[];
  subTotal: number;
  total: number;
  delivery_fees: string;
  isEmpty?: boolean;
  promoCode?: any;
}

export interface ClientCart {
  subTotal: number;
  total: number;
  tax: number;
  delivery_fees: string;
  PromoCode: string | null;
  promoEnabled: boolean;
  delivery_fees: string | number | null;
  promoCode: {
    total_cart_before_tax: number;
    total_cart_after_tax: number;
    free_delivery: `true` | `false`;
  };
}
export interface ProductCart {
  ProductID: number;
  ProductName: string;
  ProductNameAr: string;
  ProductNameEn: string;
  ProductImage: string;
  ProductDesc: string;
  ExtraNotes: string;
  Quantity: number;
  Price: number;
  SalePrice?: number;
  totalQty: number;
  totalPrice: number;
  grossTotalPrice: number;
  RadioBtnsAddons: RadioBtns[];
  CheckBoxes: CheckBoxes[];
  QuantityMeters: QuantityMeters[];
  id?: string;
  enabled: boolean;
  image: string;
}

export interface RadioBtns {
  addonID: number;
  uId: string;
  addons: CartAddons;
}

export interface CheckBoxes {
  addonID: number;
  uId: string;
  addons: CartAddons[];
}

export interface QuantityMeters {
  addonID: number; // selectionId
  uId: string; // addonId+AttributeId
  uId2: string; //addonId+AttributeId+value
  addons: CartAddons[]; // choiceId
}

export interface CartAddons {
  attributeID: number;
  name: string;
  name_ar: string;
  name_en: string;
  // nameAr: string;
  // nameEn: string;
  Value?: number; // qty
  price?: number;
}

export interface Order {
  payment_method: string;
  orderId: string | null;
  vendor_name: string;
  vendor_name_ar: string;
  vendor_name_en: string;
  vendor_logo: string;
  vendor_description: string[];
  branch_phone: string;
  branch_address: string;
  orderCode: string | number;
  order_id: string | number;
}

export interface OrderInvoice {
  order_code: string;
  vendor_name: string;
  vendor_logo: string;
  order_type: string;
  area: string;
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
      additional?: string;
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
    tax: string;
    promo_code?: string;
    promo_code_value?: string | number;
    items: [
      {
        quantity: number;
        item: string;
        addon: InvoiceAddon[];
        price: string;
        total: number;
        extra_notes: string;
      }
    ];
  };
}

export interface InvoiceAddon {
  addon_id: string | number;
  addon_name: string;
  addon_quantity: string | number;
  addon_unit_price: string | number;
}

export interface OrderTrack {
  order_status: string;
  order_code: string;
  branch_phone: string;
  estimated_time: string | null;
  order_time: string | null;
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
  user_id: number;
  order_type: string;
  UserAgent: string;
  Date?: string;
  Time?: string;
  Messg: string;
  address_id?: number;
  PaymentMethod: `cash_on_delivery` | `knet` | `visa`;
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

export interface CustomerInfo {
  id: number | null;
  userAgent?: null | string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
  prefrences?: Prefrences;
  notes?: string;
}

export interface Prefrences {
  type: string;
  date?: string | Date;
  time?: string | Date;
}

export interface RadioBtnsAddons {
  addonID: number;
  addons: CartAddons;
}

export interface CheckBoxesAddons {
  addonID: number;
  addons: CartAddons[];
}

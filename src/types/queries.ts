export type AppQueryResult<T> = {
  success: boolean;
  status: string | number;
  message: string;
  msg?: string;
  data: T;
  Data?: T;
};

export type ProductPagination<T> = {
  current_page: string;
  next_page: string;
  per_page: string;
  prev_page: string;
  products: T[];
  total: string;
};

export type Category = {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  img: string;
};

export type Branch = {
  id: number | null;
  name: string;
  name_ar: string;
  name_en: string;
  location: string;
  mobile: string;
  lang: string;
  lat: string;
  status: string;
  delivery_type: string;
};

export interface Country {
  id: string | number;
  name: string;
  name_ar: string;
  name_en: string;
  code: string;
  currency: string;
  image: string;
  tax_status?: string | number;
  inclusive?: string | number;
  tax?: string;
  address_field?: [any];
}

export interface Auth {
  access_token: string | null;
  user: {
    id: string | number;
    name: string;
    phone: string;
    email: string;
    date_of_birth: string;
    gender: string;
    status: number | boolean;
    phone_verified: number;
    country_code: string;
    country_id?: string | number;
    avatar: string;
  };
}

export interface Area {
  id: string | number | null;
  name: string;
  name_ar: string;
  name_en: string;
}

export interface StaticPage {
  id: string | number;
  body: string;
  title: string;
}

export interface PreviousOrder {
  code: string;
  address: {
    street: string;
  };
  total: string;
  orderedOn: string;
}

export interface Guest {
  name: string;
  phone: string | number;
  gender: string;
  guestMode: boolean;
}

export interface PaymentProcess {
  url: string;
  invoice_id: number;
  category: string;
}

export interface Location {
  id: number;
  City: string;
  name_ar: string;
  name_en: string;
  Areas: Area[];
}


export interface Address {
  id: number | string;
  type: number | string;
  longitude: number | string;
  latitude: number | string;
  customer_id: number | string;
  address: { [key: string]: any };
}



import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { appSetting } from '@/types/index';
import { searchParamsSlice } from '@/redux/slices/searchParamsSlice';
import { lowerCase, snakeCase } from 'lodash';
import i18n from 'i18next';
import { countrySlice } from '@/redux/slices/countrySlice';
import { HYDRATE } from 'next-redux-wrapper';

const initialState: appSetting = {
  showHeader: true,
  showFooter: true,
  showCart: false,
  showAreaModal: false,
  showPickDateModal: false,
  sideMenuOpen: false,
  showChangePasswordModal: false,
  toastMessage: {
    title: ``,
    content: ``,
    showToast: false,
    type: `default`,
  },
  currentModule: `home`,
};

export const appSettingSlice = createSlice({
  name: 'appSetting',
  initialState,
  reducers: {
    showHeader: (state: typeof initialState, action: PayloadAction) => {
      return {
        ...state,
        showHeader: true,
      };
    },
    hideHeader: (state: typeof initialState, action: PayloadAction) => {
      return {
        ...state,
        showHeader: false,
      };
    },
    showFooter: (state: typeof initialState, action: PayloadAction) => {
      return {
        ...state,
        showFooter: true,
      };
    },
    hideFooter: (state: typeof initialState, action: PayloadAction) => {
      return {
        ...state,
        showFooter: false,
      };
    },
    showCart: (state: typeof initialState, action: PayloadAction) => {
      return {
        ...state,
        showCart: true,
      };
    },
    hideCart: (state: typeof initialState, action: PayloadAction) => {
      return {
        ...state,
        showCart: false,
      };
    },
    hideSideMenu: (state: typeof initialState, action: PayloadAction<void>) => {
      return {
        ...state,
        sideMenuOpen: false,
      };
    },
    showSideMenu: (state: typeof initialState, action: PayloadAction<void>) => {
      return {
        ...state,
        sideMenuOpen: true,
      };
    },
    setCurrentModule: (
      state: typeof initialState,
      action: PayloadAction<string | any>
    ) => {
      return {
        ...state,
        currentModule: action.payload,
      };
    },
    showAreaModal: (state: typeof initialState, action: PayloadAction) => {
      return {
        ...state,
        showAreaModal: true,
      };
    },
    hideAreaModal: (state: typeof initialState, action: PayloadAction) => {
      return {
        ...state,
        showAreaModal: false,
      };
    },
    showPickDateModal: (state: typeof initialState, action: PayloadAction) => {
      return {
        ...state,
        showPickDateModal: true,
      };
    },
    hidePickDateModal: (state: typeof initialState, action: PayloadAction) => {
      return {
        ...state,
        showPickDateModal: false,
      };
    },
    showChangePasswordModal: (
      state: typeof initialState,
      action: PayloadAction
    ) => {
      return {
        ...state,
        showChangePasswordModal: true,
      };
    },
    hideChangePasswordModal: (
      state: typeof initialState,
      action: PayloadAction
    ) => {
      return {
        ...state,
        showChangePasswordModal: false,
      };
    },
    showToastMessage: (
      state: typeof initialState,
      action: PayloadAction<{
        content: string;
        type: string;
        title?: string;
      }>
    ) => {
      return {
        ...state,
        toastMessage: {
          content: action.payload.content,
          showToast: true,
          type: `info`,
          title: action.payload.title ?? ``,
        },
      };
    },
    hideToastMessage: (state: typeof initialState, action: PayloadAction) => {
      return {
        ...state,
        toastMessage: {
          title: ``,
          content: ``,
          type: `info`,
          showToast: false,
        },
      };
    },
    resetAppSetting: (state: typeof initialState, action: PayloadAction) => {
      return {
        ...initialState,
      };
    },
  },

  extraReducers: (builder) => {
    builder.addCase(
      searchParamsSlice.actions.setSearchDateSelected,
      (state, action) => {
        state.showPickDateModal = false;
      }
    );
    builder.addCase(
      searchParamsSlice.actions.setSearchArea,
      (state, action) => {
        state.showAreaModal = false;
      }
    );
  },
});

export const {
  showHeader,
  hideHeader,
  showFooter,
  hideFooter,
  showCart,
  hideCart,
  hideSideMenu,
  showSideMenu,
  setCurrentModule,
  showAreaModal,
  hideAreaModal,
  showPickDateModal,
  hidePickDateModal,
  showToastMessage,
  hideToastMessage,
  showChangePasswordModal,
  hideChangePasswordModal,
  resetAppSetting,
} = appSettingSlice.actions;

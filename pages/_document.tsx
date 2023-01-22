// // @emotion/react @emotion/styled @heroicons/react @hookform/resolvers @mui/lab @mui/material @mui/x-date-pickers @reduxjs/toolkit @sentry/react @types/js-cookie @types/jsonwebtoken @types/lodash @types/node @types/pluralize @types/query-string @types/react-burger-menu @types/react-dom @types/react-redux @types/react-slick @types/redux-logger @types/redux-saga axios date-fns dayjs flowbite flowbite-react google-map-react i18next i18next-browser-languagedetector i18next-http-backend js-cookie next next-redux-wrapper pluralize query-string react react-burger-menu react-dom react-geocode react-google-map-picker react-hook-form react-i18next react-infinite-scroll-component react-loading react-loading-skeleton react-material-ui-carousel react-redux react-scrollspy react-select react-share react-slick react-toastify redux-logger redux-persist redux-saga slick-carousel web-vitals yup moment sharp
// //  @tailwindcss/aspect-ratio @tailwindcss/forms @tailwindcss/typography @types/react autoprefixer call-bind function-bind is-arguments msw postcss prettier tailwindcss tailwindcss-rtl typescript whatwg-fetch

import Document, { DocumentContext, DocumentInitialProps } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }
}

export default MyDocument;

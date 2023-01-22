import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { useEffect, Suspense } from 'react';
import {
  setCurrentModule,
  setShowFooterElement,
} from '@/redux/slices/appSettingSlice';
import { useAppDispatch } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';

const OrderReview: NextPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setCurrentModule(t('order_review')));
    dispatch(setShowFooterElement('order_review'));
  }, []);

  return (
    <MainContentLayout>
      <Suspense>
        <h1>Order Review</h1>
      </Suspense>
    </MainContentLayout>
  );
};

export default OrderReview;
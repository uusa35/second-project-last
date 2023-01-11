import { useEffect, useState } from 'react';
import OffLineWidget from '@/widgets/OffLineWidget';
import { useTranslation } from 'react-i18next';
import MainContentLayout from '@/layouts/MainContentLayout';
import NotFoundImage from '@/appImages/not_found.png';

export default function Custom404() {
  const { t } = useTranslation();
  const [message, setMessage] = useState<string>('not_found');

  useEffect(() => {
    window.addEventListener('offline', () =>
      setMessage('network_is_not_available_please_check_your_internet')
    );
    return () => {
      window.removeEventListener('offline', () => setMessage('not_found'));
    };
  }, []);

  return (
    <MainContentLayout backHome={true}>
      <OffLineWidget img={NotFoundImage.src} message={t(message)} />
    </MainContentLayout>
  );
}

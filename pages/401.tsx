import OffLineWidget from '@/widgets/OffLineWidget';
import { useTranslation } from 'react-i18next';
import MainContentLayout from '@/layouts/MainContentLayout';

export default function Custom401() {
  const { t } = useTranslation();
  return (
    <MainContentLayout backHome={true}>
      <OffLineWidget
        message={t('network_is_not_available_please_check_your_internet')}
      />
    </MainContentLayout>
  );
}

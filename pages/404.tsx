import OffLineWidget from '@/widgets/OffLineWidget';
import { useTranslation } from 'react-i18next';
import MainContentLayout from '@/layouts/MainContentLayout';

export default function Custom404() {
  const { t } = useTranslation();
  return (
    <MainContentLayout backHome={true}>
      <OffLineWidget
        message={t(
          'network_is_not_available_please_check_your_internet_or_the_item_you_looking_for_does_not_exist'
        )}
      />
    </MainContentLayout>
  );
}

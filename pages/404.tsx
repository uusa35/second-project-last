import OffLineWidget from '@/widgets/OffLineWidget';
import { useTranslation } from 'react-i18next';
import MainContentLayout from '@/layouts/MainContentLayout';
import error404 from '@/appImages/404_error.png';

export default function Custom404() {
  const { t } = useTranslation();
  return (
    <MainContentLayout backHome={true}>
      <OffLineWidget img={`${error404.src}`} message={t(`not_found`)} />
    </MainContentLayout>
  );
}

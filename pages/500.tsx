import OffLineWidget from '@/widgets/OffLineWidget';
import MainContentLayout from '@/layouts/MainContentLayout';

export default function Custom500() {
  return (
    <MainContentLayout backHome={true} url={``}>
      <OffLineWidget message={`500 - Server-side error occurred`} />
    </MainContentLayout>
  );
}

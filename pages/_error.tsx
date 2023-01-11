import { NextPage } from 'next';
import OffLineWidget from '@/widgets/OffLineWidget';
import MainContentLayout from '@/layouts/MainContentLayout';

const Error: NextPage = ({ statusCode, message = `` }: any) => {
  return (
    <MainContentLayout>
      <OffLineWidget
        message={
          statusCode
            ? `An error ${statusCode} occurred on server`
            : 'An error occurred on client'
        }
      />
    </MainContentLayout>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

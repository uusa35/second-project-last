import { NextPage } from 'next';
import MainHead from '@/components/MainHead';
import { wrapper } from '@/redux/store';
import { AppQueryResult, StaticPage } from '@/types/queries';
import { apiSlice } from '@/redux/api';
import Image from 'next/image';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { imageSizes } from '@/constants/*';

type Props = {
  element: StaticPage;
};
const TermsPage: NextPage<Props> = ({ element }): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setCurrentModule(t('terms')));
  }, []);

  const bodyMarkup = () => {
    return { __html: element.body.replace(/\&nbsp;/g, '') };
  };

  return (
    <>
      <MainHead title={element.title} description={element.title} />
      <MainContentLayout backHome={true}>
        <div className="flex flex-wrap justify-center">
          {/*<Image*/}
          {/*  className="w-40 h-40"*/}
          {/*  src={aboutImg}*/}
          {/*  width={imageSizes.xs}*/}
          {/*  alt="terms_image"*/}
          {/*/>*/}
        </div>
        <div className="rounded-lg border-2 border-slate-100 px-7 py-2 mt-5 text-justify">
          <div dangerouslySetInnerHTML={bodyMarkup()} />
        </div>
      </MainContentLayout>
    </>
  );
};

export default TermsPage;

export const getServerSideProps = wrapper.getStaticProps(
  (store) => async (context) => {
    return {
      props: {},
    };
  }
);

import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const PoweredByQ: FC = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className={`w-full h-1/2 flex justify-center items-center bg-white`}>
      <h1 className={`pt-2 capitalize`}>{t('powered_by_queue')} &reg;</h1>
    </div>
  );
};

export default PoweredByQ;

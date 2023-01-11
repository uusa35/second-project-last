import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const PoweredByQ: FC = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className={`w-full text-center`}>
      <h1 className={`pt-2 opacity-80`}>{t('powered_by_queue')} &reg;</h1>
    </div>
  );
};

export default PoweredByQ;

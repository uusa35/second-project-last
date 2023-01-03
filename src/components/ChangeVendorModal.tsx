import React, { FC } from 'react';
import Dialog from '@mui/material/Dialog';
import { useTranslation } from 'react-i18next';
import ChangeBranch from '@/appImages/store/change_branch.png';
import Image from 'next/image';
import { imageSizes } from '@/constants/*';

type Props = {
  ChangeVendor: () => void;
  OnClose: () => void;
  OpenModal: boolean;
};

const ChangeVendorModal: FC<Props> = ({
  OnClose,
  OpenModal,
  ChangeVendor,
}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Dialog onClose={OnClose} open={OpenModal} maxWidth="xs">
      <div className="flex flex-col items-center rounded-3xl p-5">
        <div className="mt-5">
          <Image
            src={ChangeBranch}
            alt="change"
            width={imageSizes.xs}
            height={imageSizes.xs}
            className="h-auto w-auto"
          />
        </div>
        <p className="text-lg font-semibold mb-3 mt-5">
          {t(`${'You_’re_about_to_change_the_store'}`)}
        </p>
        <p className="text-start text-sm">
          {t(
            `${"changing_the_store_might_result_in_removing_the_items_from_your_cart_because_the_new_selected_store_deliver's_separately"}`
          )}
        </p>
        <div className="flex justify-between w-full pt-5 gap-x-2 px-0 lg:px-5">
          <button
            onClick={() => OnClose()}
            className="text-primary_BG capitalize"
          >
            {t('cancel')}
          </button>
          <button
            onClick={() => {
              ChangeVendor();
              OnClose();
            }}
            className="text-CustomRed capitalize"
          >
            {t('change')}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ChangeVendorModal;

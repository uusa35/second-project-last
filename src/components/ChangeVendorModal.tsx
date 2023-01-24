import React, { FC } from 'react';
import Dialog from '@mui/material/Dialog';
import { useTranslation } from 'react-i18next';
import ChangeBranch from '@/appImages/change_branch.png';
import { imageSizes } from '@/constants/*';
import CustomImage from './CustomImage';
import { useLazyChangeLocationQuery } from '@/redux/api/cartApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Area, Branch } from '@/types/queries';
import { setBranch } from '@/redux/slices/branchSlice';
import { setArea } from '@/redux/slices/areaSlice';
import { useRouter } from 'next/router';
import { isNull } from 'lodash';

type Props = {
  SelectedAreaOrBranch: Branch | Area | undefined;
  OnClose: () => void;
  OpenModal: boolean;
  previousRoute: string | null;
};

const ChangeVendorModal: FC<Props> = ({
  OnClose,
  OpenModal,
  SelectedAreaOrBranch,
  previousRoute,
}): JSX.Element => {
  const { t } = useTranslation();
  const {
    customer: { userAgent },
    appSetting: { method },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [triggerChangeLocation] = useLazyChangeLocationQuery();

  const handelChangeLocReq = async () => {
    if (SelectedAreaOrBranch) {
      await triggerChangeLocation({
        UserAgent: userAgent,
        process_type: method,
        area_branch: SelectedAreaOrBranch.id?.toString() ?? '',
      }).then(() => {
        method === `pickup`
          ? dispatch(setBranch(SelectedAreaOrBranch as Branch))
          : dispatch(dispatch(setArea(SelectedAreaOrBranch as Area)));
        if (!isNull(previousRoute)) {
          router.push(previousRoute);
        } else {
          router.back();
        }
      });
    }
  };

  return (
    <Dialog
      className="w-1/3"
      onClose={OnClose}
      open={OpenModal}
      maxWidth="xs"
      // PaperProps={{ classes: { root: 'w-1/2 !rounded-3xl' } }}
      PaperProps={{ classes: { root: 'w-2/3' } }}
    >
      <div className="flex flex-col items-center p-5">
        <div className="mt-5">
          <CustomImage
            src={ChangeBranch.src}
            alt="change"
            width={imageSizes.xs}
            height={imageSizes.xs}
            className="h-auto w-auto"
          />
        </div>
        <p className="text-center text-lg font-semibold mb-3 mt-5 capitalize">
          {t(`${'You_’re_about_to_change_your_location'}`)}
        </p>
        <p className="text-start text-sm capitalize">
          {t(
            `${'changing_your_location_might_result_in_removing_the_items_from_your_cart'}`
          )}
        </p>
        <div className="flex justify-between w-full pt-5 gap-x-2 px-0 lg:px-5 capitalize">
          <button
            onClick={() => OnClose()}
            className="text-primary_BG capitalize"
          >
            {t('cancel')}
          </button>
          <button
            onClick={() => {
              handelChangeLocReq();
            }}
            className="text-primary_BG  capitalize"
          >
            {t('change')}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ChangeVendorModal;

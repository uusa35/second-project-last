import React, { FC } from 'react';
import Dialog from '@mui/material/Dialog';
import { useTranslation } from 'react-i18next';
import ChangeBranch from '@/appImages/change_branch.png';
import { imageSizes, suppressText } from '@/constants/*';
import CustomImage from './CustomImage';
import { useLazyChangeLocationQuery } from '@/redux/api/cartApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Area, Branch } from '@/types/queries';
import { setBranch } from '@/redux/slices/branchSlice';
import { setArea } from '@/redux/slices/areaSlice';
import { useRouter } from 'next/router';
import { themeColor } from '@/redux/slices/vendorSlice';
import { appSetting } from '../types';

type Props = {
  SelectedAreaOrBranch: {
    area: Area;
    branch: Branch;
    method: appSetting['method'];
  };
  OnClose: () => void;
  OpenModal: boolean;
  previousRoute: string | null;
};

const ChangeLocationModal: FC<Props> = ({
  OnClose,
  OpenModal,
  SelectedAreaOrBranch,
  previousRoute,
}): JSX.Element => {
  const { t } = useTranslation();
  const {
    customer: { userAgent },
    appSetting: { url },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const color = useAppSelector(themeColor);
  const [triggerChangeLocation] = useLazyChangeLocationQuery();

  const handelChangeLocReq = async () => {
    if (SelectedAreaOrBranch.method) {
      await triggerChangeLocation({
        UserAgent: userAgent,
        area_branch:
          SelectedAreaOrBranch.method === `pickup`
            ? { 'x-branch-id': SelectedAreaOrBranch.branch.id }
            : { 'x-area-id': SelectedAreaOrBranch.area.id },
        url,
      }).then(() => {
        SelectedAreaOrBranch.method === `pickup`
          ? dispatch(setBranch(SelectedAreaOrBranch.branch))
          : dispatch(setArea(SelectedAreaOrBranch.area));

        // get cart
        if (!previousRoute?.includes(`select`)) {
          router.back();
        } else {
          router.push(`/`);
        }
      });
    }
  };

  return (
    <Dialog
      onClose={OnClose}
      open={OpenModal}
      maxWidth="xs"
      suppressHydrationWarning={suppressText}
      classes={{
        container: `w-full lg:w-2/4 xl:w-1/3 ${
          router.locale === 'ar' ? 'float-right' : 'float-left'
        }`,
      }}
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
        <p
          suppressHydrationWarning={suppressText}
          className="text-center text-lg font-semibold mb-3 mt-5 capitalize font-tajwal-medium"
        >
          {t(`${'You_’re_about_to_change_your_location'}`)}
        </p>
        <p
          suppressHydrationWarning={suppressText}
          className="text-start text-sm capitalize font-tajwal-medium"
        >
          {t(
            `${'changing_your_location_might_result_in_removing_the_items_from_your_cart'}`
          )}
        </p>
        <div
          suppressHydrationWarning={suppressText}
          className="flex justify-between w-full pt-5 gap-x-2 px-0 lg:px-5 capitalize font-tajwal-medium"
        >
          <button
            onClick={() => OnClose()}
            suppressHydrationWarning={suppressText}
            className="capitalize font-tajwal-medium"
            style={{ color }}
          >
            {t('cancel')}
          </button>
          <button
            suppressHydrationWarning={suppressText}
            onClick={() => {
              handelChangeLocReq();
            }}
            className="capitalize font-tajwal-medium"
            style={{ color }}
          >
            {t('change')}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ChangeLocationModal;

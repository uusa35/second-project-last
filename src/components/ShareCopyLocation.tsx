import React, { FC } from 'react';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import Tooltip from '@mui/material/Tooltip';
import { WhatsappShareButton } from 'react-share';
import { useTranslation } from 'react-i18next';


type Props = {
  lat: string;
  long: string;
  ShareMsg?: string;
};

const ShareCopyLocation: FC<Props> = ({ lat = '', long = '', ShareMsg = '' }): JSX.Element => {
  const {t}=useTranslation()
  const ViewLoc = () => {
    window.open('https://maps.google.com?q=' + lat + ',' + long);
  };

  return (
    <div className="flex gap-x-2">
      <Tooltip title={t("share_location")} placement="top">
        <WhatsappShareButton
          url={`https://maps.google.com?q=${lat},${long}`}
          title={ShareMsg}
        >
          <div className="cursor-pointer">
            <IosShareOutlinedIcon />
          </div>
        </WhatsappShareButton>
      </Tooltip>

      <Tooltip title={t("view_location")} placement="top">
        <div className="cursor-pointer" onClick={() => ViewLoc()}>
          <LocationOnOutlinedIcon />
        </div>
      </Tooltip>
    </div>
  );
}

export default ShareCopyLocation;

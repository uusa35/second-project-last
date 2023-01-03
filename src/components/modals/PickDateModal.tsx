import React, { FC } from 'react';
import { Modal } from 'flowbite-react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { hidePickDateModal } from '@/redux/slices/appSettingSlice';
import moment from 'moment';
import { setSearchDateSelected } from '@/redux/slices/searchParamsSlice';
import { suppressText } from '@/constants/*';

const PickDateModal: FC = () => {
  const { t } = useTranslation();
  const {
    appSetting: { showPickDateModal },
    locale: { dir },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const minDate: string = moment(new Date()).format('YYYY-MM-DD');
  const maxDate: string = moment().add(3, 'months').format('YYYY-MM-DD');
  const handleClick = (a: string) => dispatch(setSearchDateSelected(a));
  // YYYY-MM-DD

  return (
    <React.Fragment>
      <Modal
        show={showPickDateModal}
        onClose={() => dispatch(hidePickDateModal())}
        className={`capitalize`}
      >
        <Modal.Header className={`flex`} dir={dir}>
          <div id={`headerModalTitle`} suppressHydrationWarning={suppressText}>
            {t('select_date')}
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CalendarPicker
                minDate={minDate}
                maxDate={maxDate}
                value={minDate}
                onChange={(e: any) => handleClick(e.toString())}
                disablePast
              />
            </LocalizationProvider>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default PickDateModal;

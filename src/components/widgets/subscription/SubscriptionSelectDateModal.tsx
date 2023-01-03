import { FC, Fragment } from 'react';
import { Modal, Button } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import {
  grayBtnClass,
  submitBtnClass,
  suppressText,
  tajwalFont,
} from '@/constants/*';
import CalenderIcon from '@/appIcons/blue_calender.svg';
import Image from 'next/image';
import { Label, Radio } from 'flowbite-react';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { showPickDateModal } from '@/redux/slices/appSettingSlice';
import { setSearchDateSelected } from '@/redux/slices/searchParamsSlice';

type Props = {
  showSubscriptionDateModal: boolean;
  setShowSubscriptionDateModal: (e: boolean) => void;
  showCalender: number;
};
const SubscriptionSelectDateModal: FC<Props> = ({
  showSubscriptionDateModal,
  setShowSubscriptionDateModal,
  showCalender = 0,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    locale: { dir },
    searchParams: { searchDateSelected },
  } = useAppSelector((state) => state);
  const today: string = moment(new Date()).toString();
  const tomorrow: string = moment(new Date()).add(1, 'day').toString();
  const searchDateSelectedFormated: string = moment(searchDateSelected)
    .format(`MMMM D, YYYY`)
    .toString();
  // const searchDateSelected = useAppSelector(dateSelected);
  // MMMM D, YYYY
  // YYYY-MM-DD

  return (
    <Fragment>
      <Modal
        show={showSubscriptionDateModal}
        position="bottom-center"
        onClose={() => setShowSubscriptionDateModal(false)}
        size={'full'}
        dir={dir}
        className={`${tajwalFont}`}
      >
        <div className={`flex flex-row w-2/3 mx-auto  p-6 pt-8`}>
          <div className="flex-1 flex flex-row">
            <Image
              src={CalenderIcon}
              alt={t('calender')}
              className={`w-6 h-6 object-contain`}
            />
            <p className="px-3" suppressHydrationWarning={suppressText}>
              {t('start_date')}
            </p>
          </div>
          <XMarkIcon
            className={`w-6 h-6 text-gray-500`}
            onClick={() => setShowSubscriptionDateModal(false)}
          />
        </div>
        <Modal.Body className={`w-2/3 mx-auto`}>
          <div className="flex flex-row justify-start items-start">
            <div className="flex items-center rtl:ml-10 ltr:mr-10">
              <Radio
                id="today"
                name="selectedDate"
                value={today}
                className={`rtl:ml-4 ltr:mr-4`}
                onChange={(e) =>
                  dispatch(setSearchDateSelected(e.target.value))
                }
              />
              <Label htmlFor="today" suppressHydrationWarning={suppressText}>
                {t(`start_today`)} {moment(today).format('MMMM D, YYYY')}
              </Label>
            </div>
            <div className="flex items-center ml-4">
              <Radio
                id="tomorrow"
                name="selectedDate"
                value={tomorrow}
                className={`rtl:ml-4 ltr:mr-4`}
                onChange={(e) =>
                  dispatch(setSearchDateSelected(e.target.value))
                }
              />
              <Label htmlFor="tomorrow" suppressHydrationWarning={suppressText}>
                {t(`start_tomorrow`)} {moment(tomorrow).format('MMMM D, YYYY')}
              </Label>
            </div>
          </div>
          {showCalender === 1 ? (
            <div className="flex flex-row justify-center items-center gap-4 my-4 border-t border-gray-200 pt-4 ">
              <div
                className={`flex flex-row flex-1 justify-center items-center flex-row gap-4 `}
              >
                <Radio
                  id="tomorrow"
                  name="selectedDate"
                  value={searchDateSelected}
                  className={`rtl:ml-4 ltr:mr-4`}
                  onChange={(e) =>
                    dispatch(setSearchDateSelected(e.target.value))
                  }
                />
                <Label
                  htmlFor="accept"
                  className={`flex flex-1 w-full flex-col space-y-2`}
                >
                  <p suppressHydrationWarning={suppressText}>
                    {t('select_a_date_to_start_ur_subscription')}
                  </p>
                  <p className={`text-gray-500`}>
                    <span className={`ltr:pr-3 rtl:pl-3`}>
                      {t('selected_date')}:
                    </span>
                    <span className={`text-primary_BG`}>
                      {searchDateSelectedFormated}
                    </span>
                  </p>
                </Label>
              </div>
              <button
                className={`${grayBtnClass}`}
                suppressHydrationWarning={suppressText}
                onClick={() => dispatch(showPickDateModal())}
              >
                {t('change')}
              </button>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer
          className={`w-2/3 mx-auto flex justify-center items-center`}
        >
          <Button
            onClick={() => setShowSubscriptionDateModal(false)}
            suppressHydrationWarning={suppressText}
            disabled={!searchDateSelected}
            className={`${submitBtnClass} py-0 w-full`}
          >
            {t('submit')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default SubscriptionSelectDateModal;

import { NextPage } from 'next';
import Modal from 'react-modal';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import ModalFeedbackIcon from '@/appIcons/modal_feedback.svg';
import Card from '@/appIcons/card.svg';
import Comment from '@/appIcons/comment.svg';
import Phone from '@/appIcons/phone.svg';
import CustomImage from '@/components/CustomImage';
import { useAppSelector } from '@/redux/hooks';

type Props = {
  isOpen: boolean;
  ariaHideApp: boolean;
  onRequestClose: () => void;
};
const Feedback: NextPage<Props> = ({
  isOpen,
  onRequestClose,
  ariaHideApp,
}): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);
  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={ariaHideApp}
      className={`absolute bottom-0 rounded-t-lg h-1/4 lg:w-2/6 ${
        isRTL ? `right-0` : `left-0`
      }`}
      style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
    >
      <div
        className={`bg-white rounded-t-lg bottom-0 absolute w-full lg:w-2/6`}
      >
        <div className="flex justify-between items-center px-5 py-4 w-full ">
          <div className="flex items-center">
            <CustomImage
              className="w-5 h-5"
              src={ModalFeedbackIcon}
              alt={t('feedback')}
            />
            <p className="ps-4 capitalize text-primary_BG fontsemibold">
              {t('leave_feedback')}
            </p>
          </div>

          <button
            className="text-black text-base font-bold"
            onClick={() => onRequestClose}
          >
            X
          </button>
        </div>

        <div className="px-4">
          <div className="flex text-black">
            <Image src={Card} alt="card" width={20} height={20} />
            <input
              //   onChange={(e)=>{handelChangeDate('user_name',e.target.value)}}
              className={`border-0 focus:ring-transparent outline-none capitalize`}
              type="text"
              placeholder={`${t(`enter_your_name`)}`}
            />
          </div>
          <div className="my-2 px-5 py-1 bg-gray-100"></div>
          <div className="flex justify-between">
            <div className="flex text-black">
              <Image src={Phone} alt="phone" width={20} height={20} />
              <input
                //   onChange={(e)=>{handelChangeDate('phone',e.target.value)}}
                className={`border-0 focus:ring-transparent outline-none capitalize`}
                type="text"
                placeholder={`${t(`enter_your_phone`)}`}
              />
            </div>
            <p className="text-primary_BG text-base capitalize">
              {t('(optional)')}
            </p>
          </div>
          <div className="my-2 px-5 py-1 bg-gray-100"></div>

          <div className="flex text-black">
            <Image src={Comment} alt="comment" width={20} height={20} />
            <input
              //   onChange={(e)=>{handelChangeDate('note',e.target.value)}}
              className={`border-0 focus:ring-transparent outline-none capitalize`}
              type="text"
              placeholder={`${t(`say_something_about_us`)}`}
            />
          </div>
        </div>

        {/* buttons */}
        <div className="px-5 pb-5">
          <button className="w-full py-2 bg-btnBG text-white rounded-md font-bold capitalize">
            {t('send_feedback')}
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default Feedback;

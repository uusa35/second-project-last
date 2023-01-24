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
import { useCreateFeedbackMutation } from '@/redux/api/feedbackApi';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { submitBtnClass, suppressText } from '@/constants/*';
import { useForm } from 'react-hook-form';
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
  
  const schema = yup
  .object({
    user_name: yup.string().min(2).max(50).required(),
    rate: yup.number().min(1).max(3).required(),
    note: yup.string().required().min(2).max(50),
    phone: yup.number().min(100000).max(999999999999),
  })
  .required();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: {
      user_name: ``,
      rate: ``,
      note: ``,
      phone: `` 
    },
  });

  const [triggerCreateFeedback] = useCreateFeedbackMutation();

  const onSubmit = async (body: any) => {
    await triggerCreateFeedback(body)
    .then((r: any) => {
      console.log({res: r, body})

      if(r.data && r.data.status) {
        console.log({res: r})
      }
    })
  }
  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={ariaHideApp}
      className={`rounded-t-lg h-1/4 w-full ${
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-4">
          <div className='flex'>
            <button onClick={()=>setValue('rate', 1)}>
                {t('can_be_better')}
            </button>
            <button onClick={()=>setValue('rate', 2)}>
                {t('it_was_okay')}
            </button>
            <button onClick={()=>setValue('rate', 3)}>
                {t('amazing')}
            </button>
            {errors?.rate?.message && (
            <p
              className={`text-base text-red-800 font-semibold py-2 capitalize`}
              suppressHydrationWarning={suppressText}
            >
              {t('rate_is_required')}
            </p>
          )}          </div>
          <div className="flex text-black">
            <Image src={Card} alt="card" width={20} height={20} />
            <input
              {...register('name')}
              className={`border-0 focus:ring-transparent outline-none capitalize`}
              type="text"
              placeholder={`${t(`enter_your_name`)}`}
              onChange={(e) => setValue('user_name', e.target.value)}
              aria-invalid={errors.user_name ? 'true' : 'false'}
            />
          </div>
          {errors?.user_name?.message && (
            <p
              className={`text-base text-red-800 font-semibold py-2 capitalize`}
              suppressHydrationWarning={suppressText}
            >
              {t('name_is_required')}
            </p>
          )}
          <div className="my-2 px-5 py-1 bg-gray-100"></div>
          <div className="flex justify-between">
            <div className="flex text-black">
              <Image src={Phone} alt="phone" width={20} height={20} />
              <input
                className={`border-0 focus:ring-transparent outline-none capitalize`}
                type="text"
                {...register('phone')}
                onChange={(e) => setValue('phone', e.target.value)}
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
              {...register('note')}
              aria-invalid={errors.note ? 'true' : 'false'}
              className={`border-0 focus:ring-transparent outline-none capitalize`}
              type="text"
              placeholder={`${t(`say_something_about_us`)}`}
              onChange={(e) => setValue('note', e.target.value)}
            />
          </div>
          <div>
            {errors?.note?.message && (
              <p
                className={`text-base text-red-800 font-semibold py-2 capitalize`}
                suppressHydrationWarning={suppressText}
              >
                {t('note_is_required')}
              </p>
            )}
          </div>
        </div>

        {/* buttons */}
        <div className="px-5 pb-5">
          <button className={`w-full capitalize ${submitBtnClass}`}>
            {t('send_feedback')}
          </button>
        </div>
        </form>
      </div>
    </Modal>
  );
};
export default Feedback;

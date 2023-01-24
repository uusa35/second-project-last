import { NextPage } from 'next';
import Modal from 'react-modal';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import ModalFeedbackIcon from '@/appIcons/modal_feedback.svg';
import Card from '@/appIcons/card.svg';
import Comment from '@/appIcons/comment.svg';
import Phone from '@/appIcons/phone.svg';
import CustomImage from '@/components/CustomImage';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useCreateFeedbackMutation } from '@/redux/api/feedbackApi';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { submitBtnClass, suppressText } from '@/constants/*';
import { useForm } from 'react-hook-form';
import { debounce, map } from 'lodash';
import { useState } from 'react';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
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
  console.log({isRTL})
  const schema = yup
  .object().shape({
    user_name: yup.string().min(2).max(50).required(),
    rate: yup.number().min(1).max(3).required(),
    note: yup.string().required().min(2).max(50),
  }).required()
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
  const [rateVal, setRateVal] = useState<number>();
  const [triggerCreateFeedback] = useCreateFeedbackMutation();
  const dispatch = useAppDispatch();

  const onSubmit = async (body: any) => {
    await triggerCreateFeedback(body)
    .then((r: any) => {
      console.log({res: r, body})

      if(r.data && r.data.status) {
        dispatch(
          showToastMessage({
            content: `${t(`thanks_for_your_feedback`)}`,
            type: `success`,
          }) 
        )
        onRequestClose()
      }
    })
  }
  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={ariaHideApp}
      className={`rounded-t-lg h-1/4 ${isRTL ? 'right-0': 'left-0'}`}
      style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
    >
      <div
        className={`bg-white rounded-t-lg bottom-0 absolute w-full lg:w-2/6 ${isRTL ? ' right-0': 'left-0'}`}
      >
        <div className={`flex justify-between items-center px-5 py-4 w-full ${
        isRTL && `flex-row-reverse`
      }`}>
          <div className="flex items-center">
            <CustomImage
              className="w-5 h-5"
              src={ModalFeedbackIcon}
              alt={t('feedback')}
            />
            <p className="ps-4 capitalize text-primary_BG fontsemibold" suppressHydrationWarning={suppressText}>
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
        <div className={`flex justify-between w-[80%] m-auto pb-4 ${isRTL && `flex-row-reverse`}`}>
            <button className={`border-zinc-400 border-2 px-2 rounded-full py-1 text-zinc-400 
              ${rateVal === 1 && 'bg-primary_BG text-white border-zinc-50'}`} 
              suppressHydrationWarning={suppressText}
              onClick={()=> {
                setValue('rate', 1);
                setRateVal(1);
              }}>
                {t('can_be_better')}
            </button>
            <button className={`border-zinc-400 border-2 px-2 rounded-full py-1 text-zinc-400 
              ${rateVal === 2 && 'bg-primary_BG text-white border-zinc-50'}`}
              suppressHydrationWarning={suppressText}  
              onClick={()=> {
              setValue('rate', 2);
              setRateVal(2);
            }}>
                {t('it_was_okay')}
            </button>
            <button className={`border-zinc-400 border-2 px-2 rounded-full py-1 text-zinc-400 
              ${rateVal === 3 && 'bg-primary_BG text-white border-zinc-50'}`}  
              suppressHydrationWarning={suppressText}
              onClick={()=> {
              setValue('rate', 3);
              setRateVal(3);
            }}>
                {t('amazing')}
            </button>         
        </div>
        <div>
          {errors?.rate?.message && (
              <p
                className={`text-base text-red-800 font-semibold py-2 capitalize`}
                suppressHydrationWarning={suppressText}
              >
                {t('rate_is_required')}
              </p>
            )} 
        </div>
          <div className={`flex text-black py-4 ${isRTL && `flex-row-reverse`}`}>
            <Image src={Card} alt="card" width={20} height={20} />
            <input
              {...register('name')}
              className={`px-4 border-0 focus:ring-transparent outline-none ${isRTL && 'text-right'}`}
              placeholder={`${t(`enter_your_name`)}`}
              onChange={(e) => setValue('user_name', e.target.value)}
              aria-invalid={errors.user_name ? 'true' : 'false'}
            />
          </div>
          <div>
            {errors?.user_name?.message && (
              <p
                className={`text-base text-red-800 font-semibold py-2 capitalize`}
                suppressHydrationWarning={suppressText}
              >
                {t('name_is_required')}
              </p>
            )}
          </div>
          <div className="my-2 px-5 py-1 bg-gray-100"></div>
          <div className={`flex justify-between py-4 ${isRTL && `flex-row-reverse`}`}>
            <div className={`flex text-black py-4 ${isRTL && `flex-row-reverse`}`}>
              <Image src={Phone} alt="phone" width={20} height={20} />
              <input
                className={`px-4 border-0 focus:ring-transparent outline-none ${isRTL && 'text-right'}`}
                {...register('phone')}
                onChange={(e) => setValue('phone', e.target.value)}
                aria-invalid={errors.phone ? 'true' : 'false'}
                placeholder={`${t(`enter_your_phone`)}`}
                suppressHydrationWarning={suppressText}
              />
            </div>
            <p className="text-primary_BG text-base capitalize">
              {t('(optional)')}
            </p>
          </div>
          <div className="my-2 px-5 py-1 bg-gray-100"></div>

          <div className={`flex text-black py-4 ${isRTL && `flex-row-reverse`}`}>
            <Image src={Comment} alt="comment" width={20} height={20} />
            <input
              {...register('note')}
              aria-invalid={errors.note ? 'true' : 'false'}
              className={`px-4 border-0 focus:ring-transparent outline-none ${isRTL && 'text-right'}`}
              type="text"
              placeholder={`${t(`say_something_about_us`)}`}
              onChange={(e) => setValue('note', e.target.value)}
              suppressHydrationWarning={suppressText}
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

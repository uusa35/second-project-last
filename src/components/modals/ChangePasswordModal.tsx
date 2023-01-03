import React, { FC, useEffect, useRef, useState } from 'react';
import { Modal } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  hideChangePasswordModal,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { RootState } from '@/redux/store';
import {
  inputFieldClass,
  submitBtnClass,
  suppressText,
  tajwalFont,
} from '@/constants/*';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Image from 'next/image';
import { EyeIcon } from '@heroicons/react/24/outline';
import { useResetPasswordMutation } from '@/redux/api/authApi';

const schema = yup
  .object({
    password: yup.string().min(6).max(50),
    old_password: yup.string().min(6).max(50),
    password_confirmation: yup.string().min(6).max(50),
  })
  .required();

type ChangePassProps = {
  password: string;
  old_password: string;
  password_confirmation: string;
};
const ChangePasswordModal: FC = () => {
  const { t } = useTranslation();
  const {
    appSetting: { showChangePasswordModal },
    locale: { dir },
    country: { id: country },
    auth: { access_token: token },
  } = useAppSelector<RootState>((state) => state);
  const dispatch = useAppDispatch();
  const [inputType, setInputType] = useState('password');
  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<ChangePassProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      password: ``,
      password_confirmation: ``,
    },
  });
  const [resetPassword, { data, isLoading, error }] =
    useResetPasswordMutation<any>();

  const onSubmit: SubmitHandler<ChangePassProps> = (body) => {
    resetPassword({ country, token, body })
      .then((r: any) => {
        if (r.data.success) {
          dispatch(
            showToastMessage({ content: r.data.message, type: 'success' })
          );
        }
      })
      .then(() => dispatch(hideChangePasswordModal()));
  };

  useEffect(() => {
    if (error?.data.message) {
      dispatch(
        showToastMessage({ content: error.data?.message, type: 'error' })
      );
    }
  }, [error]);

  return (
    <React.Fragment>
      <Modal
        show={showChangePasswordModal}
        onClose={() => dispatch(hideChangePasswordModal())}
        dir={dir}
        className={`${tajwalFont}`}
      >
        <Modal.Header className={`w-full items-center justify-center`}>
          <div id={`headerModalTitle`} suppressHydrationWarning={suppressText}>
            {t('change_password')}
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="h-full">
            <div className="flex justify-center mb-5">
              <p
                className="w-full text-center"
                suppressHydrationWarning={suppressText}
              >
                {t('edit_your_information')}
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`flex flex-col space-y-2`}
            >
              {/* old_pass */}
              <div
                className={`flex flex-1 w-full flex-row mx-2 justify-between items-center`}
              >
                <input
                  type={inputType}
                  {...register('old_password')}
                  placeholder={`${t('old_password')}`}
                  suppressHydrationWarning={suppressText}
                  aria-invalid={errors.old_password ? 'true' : 'false'}
                  className={`${inputFieldClass}`}
                />
                <EyeIcon
                  className={`w-4 h-4 relative rtl:left-8 ltr:right-8 bottom-1`}
                  onClick={() =>
                    setInputType(inputType === 'text' ? 'password' : 'text')
                  }
                />
              </div>
              {/*    new pass */}
              <div
                className={`flex flex-1 w-full flex-row mx-2 justify-between items-center`}
              >
                <input
                  type={inputType}
                  {...register('password')}
                  placeholder={`${t('password')}`}
                  suppressHydrationWarning={suppressText}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  className={`${inputFieldClass}`}
                />
                <EyeIcon
                  className={`w-4 h-4 relative rtl:left-8 ltr:right-8 bottom-1`}
                  onClick={() =>
                    setInputType(inputType === 'text' ? 'password' : 'text')
                  }
                />
              </div>
              {/*   cofirmation */}
              <div
                className={`flex flex-1 w-full flex-row mx-2 justify-between items-center`}
              >
                <input
                  type={inputType}
                  {...register('password_confirmation')}
                  placeholder={`${t('password_confirmation')}`}
                  suppressHydrationWarning={suppressText}
                  aria-invalid={errors.password_confirmation ? 'true' : 'false'}
                  className={`${inputFieldClass}`}
                />
                <EyeIcon
                  className={`w-4 h-4 relative rtl:left-8 ltr:right-8 bottom-1`}
                  onClick={() =>
                    setInputType(inputType === 'text' ? 'password' : 'text')
                  }
                />
              </div>
              <input
                type="submit"
                className={`${submitBtnClass}`}
                title={`${t('save')}`}
                value={`${t('save')}`}
                suppressHydrationWarning={suppressText}
              />
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default ChangePasswordModal;

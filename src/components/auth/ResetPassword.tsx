import React from 'react';
import { useForm } from 'react-hook-form';

import Button from '../Button';
import Input from '../Input';
import { useModalContext } from '../../state/modal-context';
import { useAuthenticate } from '../../hooks/useAuthenticate';
import { SignupData } from '../../types';

interface Props {}

const ResetPassword: React.FC<Props> = () => {
  const { setModalType } = useModalContext();
  const { loading, error, resetPassword, successMsg } = useAuthenticate();
  const { register, formState, handleSubmit } =
    useForm<Omit<SignupData, 'username' | 'password'>>();
  const { errors } = formState;

  const handleResetPassword = handleSubmit((data) => resetPassword(data));

  return (
    <>
      <div className="backdrop" onClick={() => setModalType('close')} />

      <div className="modal modal--auth-form">
        <div className="modal-close" onClick={() => setModalType('close')}>
          &times;
        </div>
        <h5 className="header--center paragraph--orange">
          Enter your email below to reset your password.
        </h5>
        <form className="form" onSubmit={handleResetPassword}>
          <Input
            placeholder="Your email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required.',
            })}
          />

          <Button loading={loading} width="100%" style={{ margin: '0.5rem 0' }}>
            Submit
          </Button>

          {error && <p className="paragraph paragraph--error">{error}</p>}
        </form>

        {successMsg && (
          <p className="paragraph--success paragraph--small">{successMsg}</p>
        )}
      </div>
    </>
  );
};

export default ResetPassword;

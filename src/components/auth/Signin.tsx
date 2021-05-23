import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import Button from '../Button';
import Input from '../Input';
import { useModalContext } from '../../state/modal-context';
import { useAuthenticate } from '../../hooks/useAuthenticate';
import { SignupData } from '../../types';
import SocialMediaLogin from './SocialMediaLogin';

interface Props {}

const Signin: React.FC<Props> = () => {
  const { setModalType } = useModalContext();
  const { signin, loading, error, socialLogin } = useAuthenticate();
  const { register, formState, handleSubmit } = useForm<Omit<SignupData, 'username'>>();
  const { errors } = formState;

  const history = useHistory();

  const handleSignin = handleSubmit(async (data) => {
    const response = await signin(data);
    if (response) setModalType('close');
  });

  const toggleBackdrop = () => {
    history.replace('/', undefined);
    setModalType('close');
  };

  return (
    <>
      <div className="backdrop" onClick={() => toggleBackdrop()} />

      <div className="modal modal--auth-form">
        <div className="modal-close" onClick={() => toggleBackdrop()}>
          &times;
        </div>

        <h3 className="header--center paragraph--orange">Sign in to Storeless</h3>

        <SocialMediaLogin socialLogin={socialLogin} loading={loading} />

        <hr></hr>
        <p className="paragraph--center paragraph--focus paragraph--small">
          Or sign up with an email
        </p>

        <form className="form" onSubmit={handleSignin}>
          <Input
            label="Email"
            placeholder="Your email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required.',
            })}
          />

          <Input
            type="password"
            label="Password"
            placeholder="Your password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required.',
            })}
          />

          <Button loading={loading} width="100%" style={{ margin: '0.5rem 0' }}>
            Submit
          </Button>

          {error && <p className="paragraph paragraph--error">{error}</p>}
        </form>

        <p className="paragraph paragraph--focus paragraph--small">
          Don't have an account yet?{' '}
          <span
            className="paragraph--orange paragraph--link"
            onClick={() => setModalType('signup')}
          >
            sign up
          </span>{' '}
          instead.
        </p>

        <p className="paragraph paragraph--focus paragraph--small">
          Forgot your password? Click{' '}
          <span
            className="paragraph--orange paragraph--link"
            onClick={() => setModalType('reset_password')}
          >
            here
          </span>
        </p>
      </div>
    </>
  );
};

export default Signin;

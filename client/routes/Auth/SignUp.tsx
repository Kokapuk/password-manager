'use client';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import { auth } from '@/utils/api';
import cn from 'classnames';
import Link from 'next/link';
import { useState } from 'react';
import { HiMiniLockClosed, HiMiniUser } from 'react-icons/hi2';
import styles from './Auth.module.scss';

const SignUp = () => {
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState<{ login: string; password: string; confirmPassword: string }>({
    login: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (credentials.password !== credentials.confirmPassword) {
      setError("Passwords don't match");
      return setLoading(false);
    }

    try {
      await auth(credentials.login, credentials.password, 'signUp');
      localStorage.setItem('login', credentials.login);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Sign Up</h2>
        <TextInput
          autoFocus={!credentials.login}
          value={credentials.login}
          onChange={(e) => setCredentials((prev) => ({ ...prev, login: e.target.value.trimStart() }))}
          required
          minLength={3}
          type="text"
          placeholder="Login"
          icon={<HiMiniUser />}
        />
        <TextInput
          autoFocus={!!credentials.login}
          value={credentials.password}
          onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
          required
          minLength={6}
          type="password"
          placeholder="Password"
          icon={<HiMiniLockClosed />}
        />
        <TextInput
            value={credentials.confirmPassword}
            onChange={(e) => setCredentials((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            required
            minLength={6}
            type="password"
            placeholder="Confirm password"
            icon={<HiMiniLockClosed />}
          />
        {error && <p className={styles.error}>{error}&nbsp;</p>}
        <div className={styles.buttonsContainer}>
          <Button loading={isLoading} className={styles.button}>
            Sign Up
          </Button>
          <Link href="/signIn">
            <Button loading={isLoading} className={cn(styles.button, styles.alternateAuth)} type="button">
              Sign In
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;

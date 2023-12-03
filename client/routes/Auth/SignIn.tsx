'use client';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import { auth } from '@/utils/api';
import cn from 'classnames';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HiMiniLockClosed, HiMiniUser } from 'react-icons/hi2';
import styles from './Auth.module.scss';

const SignIn = () => {
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState<{ login: string; password: string }>({
    login: '',
    password: '',
  });
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setCredentials((prev) => ({ ...prev, login: localStorage.getItem('login') ?? '' }));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await auth(credentials.login, credentials.password, 'signIn');
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
        <h2 className={styles.title}>Sign In</h2>
        <TextInput
          autoFocus={!localStorage.getItem('login')}
          value={credentials.login}
          onChange={(e) => setCredentials((prev) => ({ ...prev, login: e.target.value.trimStart() }))}
          required
          minLength={3}
          type="text"
          placeholder="Login"
          icon={<HiMiniUser />}
        />
        <TextInput
          autoFocus={!!localStorage.getItem('login')}
          value={credentials.password}
          onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
          required
          minLength={6}
          type="password"
          placeholder="Password"
          icon={<HiMiniLockClosed />}
        />
        {error && <p className={styles.error}>{error}&nbsp;</p>}
        <div className={styles.buttonsContainer}>
          <Button loading={isLoading} className={styles.button}>
            Sign In
          </Button>
          <Link href="/signUp">
            <Button loading={isLoading} className={cn(styles.button, styles.alternateAuth)} type="button">
              Sign Up
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;

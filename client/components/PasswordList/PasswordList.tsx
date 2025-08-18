import { limitPerPage } from '@/store/passwords';
import isDesktopApp from '@/utils/isDesktopApp';
import { Password as PasswordType } from '@/utils/types';
import dynamic from 'next/dynamic';
import { JSX, useEffect, useRef } from 'react';
import PasswordSkeleton from '../PasswordSkeleton';
import VirtualList from '../VirtualList';
import styles from './PasswordList.module.scss';

const Password = dynamic(() => import('../Password'), { ssr: false, loading: () => <PasswordSkeleton /> });

interface Props {
  passwords: PasswordType[];
  isFetching: boolean;
  isFetchFailed: boolean;
  query: string;
  selectedPasswordId?: string;
  totalCount?: number;
  onPasswordSelect?(password: PasswordType): void;
  onPaginationTriggerReached(): void;
}

const PasswordList = ({
  passwords,
  isFetching,
  isFetchFailed,
  query,
  selectedPasswordId,
  totalCount,
  onPasswordSelect,
  onPaginationTriggerReached,
}: Props) => {
  const list = useRef<HTMLDivElement>(null);
  let children: JSX.Element[] = [];

  useEffect(() => {
    if (passwords.length === 0) {
      list.current?.scrollTo({ top: 0 });
    }
  }, [passwords.length]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollBottom =
      event.currentTarget.scrollHeight - event.currentTarget.clientHeight - event.currentTarget.scrollTop;

    if (scrollBottom < 200) {
      onPaginationTriggerReached();
    }
  };

  children.push(
    ...passwords.map((password) => (
      <Password
        key={password._id}
        password={password}
        isSelected={selectedPasswordId === password._id}
        onClick={onPasswordSelect ? () => onPasswordSelect(password) : undefined}
      />
    ))
  );

  if (isFetching) {
    children.push(
      ...new Array(
        totalCount !== undefined && totalCount - passwords.length <= limitPerPage
          ? totalCount - passwords.length
          : limitPerPage
      )
        .fill(0)
        .map((_item, index) => <PasswordSkeleton key={`placeholder-2-${index}`} />)
    );
  }

  if (!isFetching && passwords.length === 0) {
    children.push(
      <p key="text" className={styles.emptyPlaceholder}>
        {isFetchFailed
          ? `Something went wrong, try ${
              isDesktopApp() ? 'reloading the app' : 'refreshing the page'
            }. If this error persists, please try again later.`
          : query
          ? 'Nothing found'
          : 'Nothing yet'}
      </p>
    );
  }

  return (
    <VirtualList ref={list} className={styles.list} itemHeight={80} gap={10} onScroll={handleScroll}>
      {children}
    </VirtualList>
  );
};

export default PasswordList;

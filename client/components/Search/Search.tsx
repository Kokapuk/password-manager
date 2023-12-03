import debounce from 'lodash/debounce';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HiMiniMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
import Button from '../Button';
import TextInput from '../TextInput';
import styles from './Search.module.scss';

const Buttons = dynamic(() => import('./Buttons'), { ssr: false });

interface Props {
  totalCount?: number;
  noButtons?: boolean;
  onQueryUpdate(query: string): void;
}

const Search = ({ totalCount, noButtons, onQueryUpdate }: Props) => {
  const [query, setQuery] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateQuery = useCallback(
    debounce((query: string) => onQueryUpdate(query), 500),
    [onQueryUpdate]
  );
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    updateQuery(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className={styles.container}>
      <TextInput
        autoFocus
        fullHeight
        icon={<HiMiniMagnifyingGlass />}
        value={query}
        onChange={handleInputChange}
        type="search"
        placeholder={totalCount ? `Search Vault (${totalCount})` : 'Search Vault'}
      >
        {!!query && (
          <Button onClick={handleClear} className={styles.clearButton}>
            <HiMiniXMark />
          </Button>
        )}
      </TextInput>

      {!noButtons && <Buttons />}
    </div>
  );
};

export default Search;

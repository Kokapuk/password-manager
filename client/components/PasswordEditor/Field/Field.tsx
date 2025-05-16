import Button from '@/components/Button';
import Tooltip from '@/components/Tooltip';
import useEditorStore from '@/store/editor';
import generatePassword from '@/utils/generatePassword';
import simplifyUrl from '@/utils/simplifyUrl';
import { Field as FieldType, Password } from '@/utils/types';
import Link from 'next/link';
import { Ref } from 'react';
import {
  HiMiniArrowPath,
  HiMiniArrowTopRightOnSquare,
  HiMiniEye,
  HiMiniEyeSlash,
  HiMiniSquare2Stack,
  HiMiniTrash,
} from 'react-icons/hi2';
import { defaults, startTransition } from 'react-smooth-flow';
import styles from './Field.module.scss';
import useToastsStore from '@/store/toasts';

interface Props {
  ref?: Ref<HTMLInputElement>;
  field: FieldType;
  isWebsite?: boolean;
}

const Field = ({ ref, field, isWebsite }: Props) => {
  const { selectedPassword, isEditing, setDraftPassword } = useEditorStore();
  const addToast = useToastsStore((st) => st.addToast);

  const handleChange = (value: string) => {
    setDraftPassword((prev) => {
      if (!prev) {
        return prev;
      }

      const prevState: Password = JSON.parse(JSON.stringify(prev));

      if (!prevState.credentials.fields) {
        return prev;
      }

      const index = prevState.credentials.fields.findIndex((item) => item._id === field._id);
      prevState.credentials.fields[index].value = value;

      return prevState;
    });
  };

  const handleWebsiteChange = (value: string) => {
    setDraftPassword(
      (prev) =>
        prev && {
          ...prev,
          website: value,
        }
    );
  };

  const handleBlur = () => {
    if (!isWebsite) {
      return;
    }

    setDraftPassword(
      (prev) =>
        prev && {
          ...prev,
          website: simplifyUrl(prev.website),
        }
    );
  };

  const handleToggleShow = () => {
    if (!isEditing && !selectedPassword?.credentials.fields?.find((item) => item._id === field._id)?.isPassword) {
      return;
    }

    setDraftPassword((prev) => {
      const prevState: Password = JSON.parse(JSON.stringify(prev));

      if (!prevState.credentials.fields) {
        return prev;
      }

      const index = prevState.credentials.fields.findIndex((item) => item._id === field._id);
      prevState.credentials.fields[index].isPassword = !prevState.credentials.fields[index].isPassword;

      return prevState;
    });
  };

  const handleRemove = () => {
    startTransition([`field-${field._id}`], () =>
      setDraftPassword((prev) => {
        const prevState: Password = JSON.parse(JSON.stringify(prev));

        if (!prevState.credentials.fields) {
          return prev;
        }

        prevState.credentials.fields = prevState.credentials.fields.filter((item) => item._id !== field._id);

        return prevState;
      })
    );
  };

  return (
    <div ref={ref} className={styles.container}>
      <p className={styles.title}>{field.title}</p>
      <input
        onBlur={handleBlur}
        onChange={(e) => (isWebsite ? handleWebsiteChange(e.currentTarget.value) : handleChange(e.currentTarget.value))}
        readOnly={!isEditing}
        value={field.value}
        className={styles.input}
        type={field.isPassword ? 'password' : 'text'}
        required={isWebsite}
        minLength={isWebsite ? 3 : undefined}
        maxLength={64}
      />
      <div className={styles.buttons}>
        {!isWebsite && isEditing && (
          <>
            <Tooltip content="Delete field" placement="top">
              <Button onClick={handleRemove} className={styles.button} type="button">
                <HiMiniTrash />
              </Button>
            </Tooltip>
            <Tooltip content="Generate random string" placement="top">
              <Button onClick={() => handleChange(generatePassword())} className={styles.button} type="button">
                <HiMiniArrowPath />
              </Button>
            </Tooltip>
          </>
        )}
        {!isWebsite &&
          (isEditing || selectedPassword?.credentials.fields?.find((item) => item._id === field._id)?.isPassword) && (
            <Tooltip content={field.isPassword ? 'Show' : 'Hide'} placement="top">
              <Button onClick={handleToggleShow} className={styles.button} type="button">
                {field.isPassword ? <HiMiniEye /> : <HiMiniEyeSlash />}
              </Button>
            </Tooltip>
          )}
        {isWebsite && field.value && (
          <Tooltip content="Visit website" placement="top">
            <Link href={`https://${field.value}`} target="_blank">
              <Button className={styles.button} type="button">
                <HiMiniArrowTopRightOnSquare />
              </Button>
            </Link>
          </Tooltip>
        )}
        <Tooltip content="Copy" placement="top">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(field.value);
              addToast({ type: 'info', content: `Copied <b>${field.title}<b>` }, 2500);
            }}
            className={styles.button}
            type="button"
          >
            <HiMiniSquare2Stack />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Field;

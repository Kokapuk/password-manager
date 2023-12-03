import useEditorStore from '@/store/editor';
import generatePassword from '@/utils/generatePassword';
import simplifyUrl from '@/utils/simplifyUrl';
import { Field as FieldType, Password } from '@/utils/types';
import classNames from 'classnames';
import Link from 'next/link';
import { DragEvent, MouseEvent, useState } from 'react';
import {
  HiMiniArrowPath,
  HiMiniArrowTopRightOnSquare,
  HiMiniEye,
  HiMiniEyeSlash,
  HiMiniSquare2Stack,
  HiMiniTrash,
} from 'react-icons/hi2';
import Button from '../../Button';
import Tooltip from '../../Tooltip';
import styles from './Field.module.scss';

interface Props {
  field: FieldType;
  isWebsite?: boolean;
}

const Field = ({ field, isWebsite }: Props) => {
  const { selectedPassword, isEditing, isDraggingField, setDraftPassword, setDraggingField } = useEditorStore();
  const [isDragOver, setDragOver] = useState(false);

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
    setDraftPassword((prev) => {
      const prevState: Password = JSON.parse(JSON.stringify(prev));

      if (!prevState.credentials.fields) {
        return prev;
      }

      prevState.credentials.fields = prevState.credentials.fields.filter((item) => item._id !== field._id);

      return prevState;
    });
  };

  const handleInputDragStart = (event: MouseEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    if (isWebsite) {
      return;
    }

    event.dataTransfer.setData('field', JSON.stringify(field));
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    setDraggingField(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (isWebsite || !isDraggingField) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    if (isWebsite || !isDraggingField) {
      return;
    }

    setDraggingField(false);
    setDragOver(false);

    const serializedData = event.dataTransfer.getData('field');

    if (!serializedData) {
      return;
    }

    const droppedField: FieldType = JSON.parse(serializedData);

    if (droppedField._id === field._id) {
      return;
    }

    setDraftPassword((prev) => {
      if (!prev) {
        return prev;
      }

      const prevState: Password = JSON.parse(JSON.stringify(prev));

      if (!prevState.credentials.fields) {
        return prev;
      }

      const originalFieldIndex = prevState.credentials.fields.findIndex((item) => item._id === field._id);
      const droppedFieldIndex = prevState.credentials.fields.findIndex((item) => item._id === droppedField._id);

      [prevState.credentials.fields[originalFieldIndex], prevState.credentials.fields[droppedFieldIndex]] = [
        prevState.credentials.fields[droppedFieldIndex],
        prevState.credentials.fields[originalFieldIndex],
      ];

      return prevState;
    });
  };

  return (
    <div
      className={classNames(
        styles.container,
        isEditing && styles.editing,
        !!isDraggingField && styles.dragging,
        isDragOver && styles.dragOver
      )}
      draggable={isEditing && !isWebsite}
      onDragStart={handleDragStart}
      onDragEnd={!isWebsite ? () => setDraggingField(false) : undefined}
      onDragEnter={!isWebsite && isDraggingField ? () => setDragOver(true) : undefined}
      onDragOver={handleDragOver}
      onDragLeave={!isWebsite && isDraggingField ? () => setDragOver(false) : undefined}
      onDrop={handleDrop}
    >
      <p className={styles.title}>{field.title}</p>
      <input
        onBlur={handleBlur}
        onChange={(e) => (isWebsite ? handleWebsiteChange(e.currentTarget.value) : handleChange(e.currentTarget.value))}
        draggable="true"
        onDragStart={handleInputDragStart}
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
          <Button onClick={() => navigator.clipboard.writeText(field.value)} className={styles.button} type="button">
            <HiMiniSquare2Stack />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Field;

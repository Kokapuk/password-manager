import Button from '@/components/Button';
import Modal from '@/components/Modal';
import TextInput from '@/components/TextInput';
import Tooltip from '@/components/Tooltip';
import useEditorStore from '@/store/editor';
import { Field, Password } from '@/utils/types';
import { Types } from 'mongoose';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { HiMiniLockClosed, HiMiniPlus } from 'react-icons/hi2';

interface Props {
  triggerClass: string;
}

const CreateFieldModal = ({ triggerClass }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const setDraftPassword = useEditorStore((state) => state.setDraftPassword);
  const newFieldInput = useRef<HTMLInputElement>(null);
  const [newFieldTitle, setNewFieldTitle] = useState('');
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isOpen && newFieldInput.current) {
      newFieldInput.current.focus();
    }
  }, [isOpen]);

  const createField = async () => {
    if (newFieldTitle.trim() === '') {
      return;
    }

    setDraftPassword((prev) => {
      const prevState: Password = JSON.parse(JSON.stringify(prev));

      if (!prevState.credentials.fields) {
        prevState.credentials.fields = [];
      }

      const field: Field = {
        _id: new Types.ObjectId().toString(),
        title: newFieldTitle,
        isPassword: newFieldTitle.toLocaleLowerCase().includes('password'),
        value: '',
      };
      prevState.credentials.fields.push(field);
      return prevState;
    });

    setNewFieldTitle('');
    setOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createField();
  };

  return (
    <>
      <Tooltip content="Add field" placement="bottom">
        <Button onClick={() => setOpen(true)} className={triggerClass} type="button">
          <HiMiniPlus />
        </Button>
      </Tooltip>
      <Modal
        onCloseRequest={() => setOpen(false)}
        isOpen={isOpen}
        title="Create new field"
        buttons={[
          {
            title: 'Create',
            onClick: () => (form.current?.checkValidity() ? createField() : form.current?.reportValidity()),
          },
        ]}
      >
        <form ref={form} onSubmit={handleSubmit}>
          <TextInput
            ref={newFieldInput}
            onChange={(e) => setNewFieldTitle(e.target.value.trimStart())}
            value={newFieldTitle}
            icon={<HiMiniLockClosed />}
            type="text"
            placeholder="Title"
            required
            minLength={1}
          />
          <button style={{ display: 'none' }} type="submit" />
        </form>
      </Modal>
    </>
  );
};

export default CreateFieldModal;

import Modal from '@/components/Modal';
import TextInput from '@/components/TextInput';
import useEditorStore from '@/store/editor';
import { Field, Password } from '@/utils/types';
import { Types } from 'mongoose';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { HiMiniLockClosed } from 'react-icons/hi2';

const CreateFieldModal = () => {
  const { isCreateFieldModalOpen, setDraftPassword, setCreateFieldModalOpen } = useEditorStore();
  const newFieldInput = useRef<HTMLInputElement>(null);
  const [newFieldTitle, setNewFieldTitle] = useState('');
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isCreateFieldModalOpen && newFieldInput.current) {
      newFieldInput.current.focus();
    }
  }, [isCreateFieldModalOpen]);

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
    setCreateFieldModalOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createField();
  };

  return (
    <Modal
      onCloseRequest={() => setCreateFieldModalOpen(false)}
      isOpen={isCreateFieldModalOpen}
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
  );
};

export default CreateFieldModal;

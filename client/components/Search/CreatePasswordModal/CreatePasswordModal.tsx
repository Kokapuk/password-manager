import Button from '@/components/Button';
import Modal from '@/components/Modal';
import TextInput from '@/components/TextInput';
import Tooltip from '@/components/Tooltip';
import usePasswordsStore from '@/store/passwords';
import { create } from '@/utils/api';
import simplifyUrl from '@/utils/simplifyUrl';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { HiMiniGlobeAlt, HiMiniLockClosed, HiMiniPlus } from 'react-icons/hi2';
import styles from './CreatePasswordModal.module.scss';

interface Props {
  triggerClass: string;
}

const CreatePasswordModal = ({ triggerClass }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const [newPasswordInfo, setNewPasswordInfo] = useState<{ name: string; website: string }>({ name: '', website: '' });
  const [creatingPassword, setCreatingPassword] = useState(false);
  const newPasswordInput = useRef<HTMLInputElement>(null);
  const { query, fetch: fetchPasswords } = usePasswordsStore();
  const form = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && newPasswordInput.current) {
      newPasswordInput.current.focus();
    }
  }, [isOpen]);

  const createPassword = async () => {
    if (!newPasswordInfo.name.trim() || !newPasswordInfo.website.trim()) {
      return;
    }

    setCreatingPassword(true);

    try {
      const newPassword = await create(newPasswordInfo.name, newPasswordInfo.website);
      await fetchPasswords(query);
      setOpen(false);
      router.push(`/passwords/${newPassword._id}`);
    } finally {
      setCreatingPassword(false);
      setNewPasswordInfo({ name: '', website: '' });
    }
  };

  const handleWebsiteFieldBlur = () => {
    setNewPasswordInfo((prev) => ({ ...prev, website: simplifyUrl(prev.website) }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createPassword();
  };

  return (
    <>
      <Tooltip content="Create password" placement="bottom">
        <Button onClick={() => setOpen(true)} className={triggerClass}>
          <HiMiniPlus />
        </Button>
      </Tooltip>
      <Modal
        title="Create password"
        open={isOpen}
        onClose={() => setOpen(false)}
        buttons={[
          {
            title: 'Create',
            onClick: () => (form.current?.checkValidity() ? createPassword() : form.current?.reportValidity()),
            loading: creatingPassword,
          },
        ]}
      >
        <form ref={form} className={styles.form} onSubmit={handleSubmit}>
          <TextInput
            ref={newPasswordInput}
            value={newPasswordInfo.name}
            onChange={(e) => setNewPasswordInfo((prev) => ({ ...prev, name: e.target.value.trimStart() }))}
            icon={<HiMiniLockClosed />}
            placeholder="Name"
            minLength={1}
            maxLength={64}
            required
          />
          <TextInput
            value={newPasswordInfo.website}
            onChange={(e) => setNewPasswordInfo((prev) => ({ ...prev, website: e.target.value }))}
            onBlur={handleWebsiteFieldBlur}
            icon={<HiMiniGlobeAlt />}
            placeholder="Website"
            minLength={3}
            required
          />
          <button type="submit" />
        </form>
      </Modal>
    </>
  );
};

export default CreatePasswordModal;

'use client';

import useEditorStore from '@/store/editor';
import isDesktopApp from '@/utils/isDesktopApp';
import { useEffect, useState } from 'react';
import Modal from '../Modal';

const CloseUnsavedChangesModal = () => {
  const [open, setOpen] = useState(false);
  const { isEditing, selectedPassword } = useEditorStore();

  useEffect(() => {
    if (!isDesktopApp()) {
      return;
    }

    window.electron.ipcRenderer.on('requestClose', () => {
      if (isEditing) {
        setOpen(true);
      } else {
        window.electron.ipcRenderer.send('forceClose');
      }
    });

    return () => window.electron.ipcRenderer.removeAllListeners('requestClose');
  }, [isEditing]);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      buttons={[
        { title: 'Yes', onClick: () => window.electron.ipcRenderer.send('forceClose'), secondary: true },
        { title: 'No', onClick: () => setOpen(false) },
      ]}
      title="Hold on!"
    >
      <p>
        You are currently editing <b>{selectedPassword?.name}</b>.
      </p>
      <p>Are you sure you want to close the app?</p>
      <p>All unsaved changes will be lost.</p>
    </Modal>
  );
};

export default CloseUnsavedChangesModal;

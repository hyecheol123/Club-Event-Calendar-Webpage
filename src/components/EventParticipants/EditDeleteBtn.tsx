/**
 * Edit/Delete buttons to edit/delete the participant entry
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';
// Material UI
import { Box, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
// Globally used Types
import ParticipantInfo from '../../globalType/ParticipantInfo';
const EditParticipantsModal = React.lazy(
  () => import('./EditParticipantsModal')
);

// Type for the component's props
type EditDeleteBtnProps = {
  eventId: string | number;
  data: ParticipantInfo;
  setModifiedFlagFunc: () => void;
};

/**
 * React Functional Component to generate EditDeleteBtn to show the Edit/Delete
 *   buttons
 *
 * @param {EditDeleteBtnProps} props Properties that passed from the parent
 *   Component.
 * @return {React.ReactElement} Renders EditDeleteBtn
 */
function EditDeleteBtn(props: EditDeleteBtnProps): React.ReactElement {
  const { eventId, data, setModifiedFlagFunc } = props;
  // State
  const [modalOpen, setModalOpen] = React.useState(false);

  // EventHandler for the buttons
  const deleteParticipant = React.useCallback((): void => {
    // TODO: API Call to delete Participants
    console.log(`Delete Participant ${data.id} of ${eventId}`);
    setModifiedFlagFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // EventHandler to open/close edit modal
  const openEditModal = React.useCallback((): void => setModalOpen(true), []);
  const closeEditModal = React.useCallback((): void => setModalOpen(false), []);

  return (
    <Box>
      <IconButton color="primary" onClick={openEditModal}>
        <Edit />
      </IconButton>
      {modalOpen && (
        <EditParticipantsModal
          isOpen={modalOpen}
          participantsDetail={data}
          eventId={eventId as string}
          handleClose={closeEditModal}
          setModifiedFlagFunc={setModifiedFlagFunc}
        />
      )}
      /
      <IconButton color="secondary" onClick={deleteParticipant}>
        <Delete />
      </IconButton>
    </Box>
  );
}

export default React.memo(EditDeleteBtn);

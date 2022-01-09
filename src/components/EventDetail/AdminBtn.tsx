/**
 * Admin Button to control the event
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Material UI
import { Box, Button, Divider, Typography } from '@mui/material';
// Global Type
import EventDetailData from '../../globalType/EventDetailData';
// Components
const AdminModifyDetailModal = React.lazy(
  () => import('./AdminModifyDetailModal')
);

// Type for AdminBtn's props
type AdminBtnProps = {
  eventId: string;
  eventDetail: EventDetailData;
  goBackFunc: () => void;
  setModifiedFlagFunc: () => void;
};

/**
 * React Functional Component to generate AdminBtn to control the event on the
 * eventDetail page
 *
 * @param {AdminBtnProps} props Properties that passed from the parent
 *   Component.
 * @return {React.ReactElement} Renders AdminBtn
 */
function AdminBtn(props: AdminBtnProps): React.ReactElement {
  const { eventId, eventDetail, goBackFunc, setModifiedFlagFunc } = props;
  const navigate = useNavigate();
  const location = useLocation();
  // State
  const [modalOpen, setModalOpen] = React.useState(false);

  // EventHandler for the admin buttons
  const deleteEvent = React.useCallback((): void => {
    // TODO: Call API to Delete Event
    console.log(`Delete event ${eventId}`);
    goBackFunc();
  }, [goBackFunc, eventId]);
  const openModifyModal = React.useCallback((): void => setModalOpen(true), []);
  const closeModifyModal = React.useCallback((): void => {
    setModalOpen(false);
  }, []);
  const moveEventParticipantsView = React.useCallback(
    (): void =>
      navigate('./participants', {
        state: { prevLocation: location.pathname },
      }),
    [location.pathname, navigate]
  );

  return (
    <>
      <Divider sx={{ margin: '10px 0' }} />
      <Box sx={{ margin: '15px 0' }}>
        <Typography variant="h6">Admin Only</Typography>
        <Box>
          <Button
            color="primary"
            variant="contained"
            sx={{ margin: '5px' }}
            onClick={openModifyModal}
          >
            Modify Event
          </Button>
          {modalOpen && (
            <AdminModifyDetailModal
              isOpen={modalOpen}
              eventDetail={eventDetail}
              eventId={eventId}
              handleClose={closeModifyModal}
              setModifiedFlagFunc={setModifiedFlagFunc}
            />
          )}
          <Button
            color="secondary"
            variant="contained"
            sx={{ margin: '5px' }}
            onClick={deleteEvent}
          >
            Delete Event
          </Button>
          <Button
            color="tertiary"
            variant="contained"
            onClick={moveEventParticipantsView}
            sx={{ margin: '5px' }}
          >
            View Participants
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default AdminBtn;

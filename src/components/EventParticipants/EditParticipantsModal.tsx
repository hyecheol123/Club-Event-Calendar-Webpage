/**
 * Modal which help admins to modify the participant information
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';
// Material UI
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Divider,
  Fade,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
// Global Style and Type
import modalStyle from '../../globalStyle/modalStyle';
import ParticipantInfo from '../../globalType/ParticipantInfo';

// Type for the component's props
type EditParticipantsModalProps = {
  isOpen: boolean;
  participantsDetail: ParticipantInfo;
  eventId: string;
  handleClose: () => void;
  setModifiedFlagFunc: () => void;
};

// Styles
const styles = {
  FormWrapper: {
    margin: '3px 0',
    overflowY: 'auto',
    flexGrow: 1,
    padding: '5px 2px',
  },
  TextField: { margin: '10px 0', width: '100%' },
  ButtonWrapper: { display: 'inline-flex', justifyContent: 'space-between' },
};

/**
 * React Functional Component to generate modal which helps admin to modify the
 *   participants information.
 *
 * @param {EditParticipantsModalProps} props Properties that passed from the
 *   parent component.
 * @return {React.ReactElement} Renders EditParticipantsModal
 */
function EditParticipantsModal(
  props: EditParticipantsModalProps
): React.ReactElement {
  const { isOpen, participantsDetail, eventId } = props;
  const { handleClose, setModifiedFlagFunc } = props;
  // State
  const [participantName, setParticipantName] = React.useState<string>(
    participantsDetail.participantName
  );
  const [email, setEmail] = React.useState<string>(participantsDetail.email);
  const [phoneNumber, setPhoneNumber] = React.useState<string>(
    participantsDetail.phoneNumber ? participantsDetail.phoneNumber : ''
  );
  const [comment, setComment] = React.useState<string>(
    participantsDetail.comment ? participantsDetail.comment : ''
  );
  const [disabled, setDisabled] = React.useState(false);
  const [error, setError] = React.useState({ error: false, msg: '' });

  // EventHandlers to prevent submit on enter
  const onKeyPress: React.KeyboardEventHandler = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    },
    []
  );

  // EventHandlers to modify form input
  const onParticipantNameChange = React.useCallback(
    (event: React.ChangeEvent) =>
      setParticipantName((event.target as HTMLInputElement).value),
    []
  );
  const onEmailChange = React.useCallback(
    (event: React.ChangeEvent) =>
      setEmail((event.target as HTMLInputElement).value),
    []
  );
  const onPhoneNumberChange = React.useCallback(
    (event: React.ChangeEvent) =>
      setPhoneNumber((event.target as HTMLInputElement).value),
    []
  );
  const onCommentChange = React.useCallback(
    (event: React.ChangeEvent) =>
      setComment((event.target as HTMLInputElement).value),
    []
  );

  // Validity Check
  const validityCheck = React.useCallback((): boolean => {
    // When name and email is empty, it is invalid
    if (participantName === '' || email === '') {
      setError({
        error: true,
        msg: "Participant's name and email cannot be empty",
      });
      return false;
    }

    // If nothing changed, it is invalid
    const original = {
      participantName: participantsDetail.participantName,
      email: participantsDetail.email,
      phoneNumber: participantsDetail.phoneNumber
        ? participantsDetail.phoneNumber
        : '',
      comment: participantsDetail.comment ? participantsDetail.comment : '',
    };
    const compare = [
      original.participantName !== participantName,
      original.email !== email,
      original.phoneNumber !== phoneNumber,
      original.comment !== comment,
    ];
    if (!compare.includes(true)) {
      setError({ error: true, msg: 'Need to modify at least one item!!' });
      return false;
    }

    return true;
  }, [comment, email, participantName, phoneNumber, participantsDetail]);

  // Submit Form
  const formSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    (event: React.SyntheticEvent) => {
      event.preventDefault();
      setDisabled(true);
      // Check validity of inputs
      if (!validityCheck()) {
        setDisabled(false);
        return;
      }

      // TODO: Submit API Request
      console.log(
        `Modify Event ${eventId} participant ${participantsDetail.id} Request`
      );
      console.log(participantName);
      console.log(email);
      console.log(phoneNumber);
      console.log(comment);
      setModifiedFlagFunc();
      handleClose();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [comment, email, participantName, phoneNumber, validityCheck]
  );

  // EventHandler to close alert
  const closeAlert = React.useCallback(() => {
    setError({ error: false, msg: '' });
  }, []);

  return (
    <>
      <Modal
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={isOpen}>
          <Box sx={modalStyle}>
            <Typography
              variant="h6"
              component="div"
              align="center"
              sx={{ margin: '3px 0', fontWeight: 500 }}
            >
              Modify Participant
            </Typography>
            <Divider />
            <Box sx={styles.FormWrapper}>
              <form onSubmit={formSubmit}>
                <TextField
                  disabled={disabled}
                  color="primary"
                  label="Participant's Name"
                  value={participantName}
                  margin="normal"
                  onKeyPress={onKeyPress}
                  onChange={onParticipantNameChange}
                  sx={styles.TextField}
                />
                <TextField
                  disabled={disabled}
                  color="primary"
                  label="Email"
                  value={email}
                  margin="normal"
                  onKeyPress={onKeyPress}
                  onChange={onEmailChange}
                  sx={styles.TextField}
                />
                <TextField
                  disabled={disabled}
                  color="primary"
                  label="Phone Number"
                  value={phoneNumber}
                  margin="normal"
                  onKeyPress={onKeyPress}
                  onChange={onPhoneNumberChange}
                  sx={styles.TextField}
                />
                <TextField
                  disabled={disabled}
                  color="primary"
                  label="Comment"
                  value={comment}
                  multiline
                  minRows={2}
                  margin="normal"
                  onChange={onCommentChange}
                  sx={styles.TextField}
                />
                <Box sx={{ ...styles.TextField, ...styles.ButtonWrapper }}>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={disabled}
                    sx={{ width: 'calc(50% - 5px)' }}
                  >
                    Update
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={handleClose}
                    disabled={disabled}
                    sx={{ width: 'calc(50% - 5px)' }}
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={5000}
        open={error.error}
        onClose={closeAlert}
      >
        <Alert onClose={closeAlert} severity="error">
          {error.msg}
        </Alert>
      </Snackbar>
    </>
  );
}

export default EditParticipantsModal;

/**
 * Modal which help admins to modify the event
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
import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
// Global Style
import modalStyle from '../../globalStyle/modalStyle';
import EventDetailData from '../../globalType/EventDetailData';

// Type for the component's props
type AdminModifyDetailModalProps = {
  isOpen: boolean;
  eventDetail: EventDetailData;
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
 *   event detail.
 *
 * @param {AdminModifyDetailModalProps} props Properties that passed from the
 *   parent Component.
 * @return {React.ReactElement} Renders AdminModifyDetailModal
 */
function AdminModifyDetailModal(
  props: AdminModifyDetailModalProps
): React.ReactElement {
  const { isOpen, eventDetail, eventId, handleClose, setModifiedFlagFunc } =
    props;
  // State
  const [date, setDate] = React.useState<Date>(
    new Date(eventDetail.year, eventDetail.month - 1, eventDetail.date)
  );
  const [name, setName] = React.useState<string>(eventDetail.name);
  const [category, setCategory] = React.useState<string>(
    eventDetail.category ? eventDetail.category : ''
  );
  const [detail, setDetail] = React.useState<string>(
    eventDetail.detail ? eventDetail.detail : ''
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
  const onDateChange = React.useCallback((newDate: Date | null) => {
    if (newDate) {
      setDate(newDate);
    }
  }, []);
  const onNameChange: React.ChangeEventHandler = React.useCallback(
    (event: React.ChangeEvent) =>
      setName((event.target as HTMLInputElement).value),
    []
  );
  const onCategoryChange: React.ChangeEventHandler = React.useCallback(
    (event: React.ChangeEvent) =>
      setCategory((event.target as HTMLInputElement).value),
    []
  );
  const onDetailChange: React.ChangeEventHandler = React.useCallback(
    (event: React.ChangeEvent) =>
      setDetail((event.target as HTMLInputElement).value),
    []
  );

  // Validity Check
  const validityCheck = React.useCallback((): boolean => {
    // When name is empty, it is invalid
    if (name === '') {
      setError({ error: true, msg: 'Event Name cannot be empty' });
      return false;
    }

    // If nothing changed, it is invalid
    const original = {
      date: new Date(eventDetail.year, eventDetail.month - 1, eventDetail.date),
      name: eventDetail.name,
      category: eventDetail.category ? eventDetail.category : '',
      detail: eventDetail.detail ? eventDetail.detail : '',
    };
    const compare = [
      original.date.toISOString() !== date.toISOString(),
      original.name !== name,
      original.category !== category,
      original.detail !== detail,
    ];
    if (!compare.includes(true)) {
      setError({ error: true, msg: 'Need to modify at least one item!!' });
      return false;
    }

    return true;
  }, [category, date, detail, name, eventDetail]);

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

      // TODO: Submit API request
      console.log(`Modify Event ${eventId} Request`);
      console.log(
        `${date.getFullYear()} ${date.getMonth() + 1} ${date.getDate()}`
      );
      console.log(name);
      console.log(category);
      console.log(detail);
      setModifiedFlagFunc();
      handleClose();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, date, detail, name, validityCheck]
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
              Modify Event
            </Typography>
            <Divider />
            <Box sx={styles.FormWrapper}>
              <form onSubmit={formSubmit}>
                <LocalizationProvider dateAdapter={DateAdapter}>
                  <MobileDatePicker
                    label="Event Date"
                    inputFormat="MMM. dd. yyyy"
                    value={date}
                    onChange={onDateChange}
                    renderInput={(params): React.ReactElement => (
                      <TextField
                        {...params}
                        color="primary"
                        disabled={disabled}
                        onKeyPress={onKeyPress}
                        sx={styles.TextField}
                      />
                    )}
                  />
                </LocalizationProvider>
                <TextField
                  disabled={disabled}
                  color="primary"
                  label="Event Name"
                  value={name}
                  margin="normal"
                  onKeyPress={onKeyPress}
                  onChange={onNameChange}
                  sx={styles.TextField}
                />
                <TextField
                  disabled={disabled}
                  color="primary"
                  label="Category"
                  value={category}
                  margin="normal"
                  onKeyPress={onKeyPress}
                  onChange={onCategoryChange}
                  sx={styles.TextField}
                />
                <TextField
                  disabled={disabled}
                  color="primary"
                  label="Detail"
                  value={detail}
                  multiline
                  minRows={2}
                  margin="normal"
                  onChange={onDetailChange}
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
                    Modify Event
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

export default AdminModifyDetailModal;

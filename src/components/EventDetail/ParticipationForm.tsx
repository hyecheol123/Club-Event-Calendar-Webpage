/**
 * Participation Form Component
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';
// Material UI
import { Box, Button, TextField, Typography, useTheme } from '@mui/material';

// Styles
const requiredTitleStyle = { color: 'red', marginLeft: '2px' };

/**
 * React Functional Component to generate Participation Form to get user's input
 *
 * @return {React.ReactElement} Renders ParticipationForm
 */
function ParticipationForm(): React.ReactElement {
  // States
  const [disabled, setDisabled] = React.useState(false);
  const [name, setName] = React.useState({
    value: '',
    error: false,
    helperText: '',
  });
  const [email, setEmail] = React.useState({
    value: '',
    error: false,
    helperText: '',
  });
  const [phoneNumber, setPhoneNumber] = React.useState({
    value: '',
    error: false,
    helperText: '',
  });
  const [comment, setComment] = React.useState('');

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
  const onNameChange: React.ChangeEventHandler = React.useCallback(
    (event: React.ChangeEvent) =>
      setName((prevName) => {
        return { ...prevName, value: (event.target as HTMLInputElement).value };
      }),
    []
  );
  const onEmailChange: React.ChangeEventHandler = React.useCallback(
    (event: React.ChangeEvent) =>
      setEmail((prevEmail) => {
        return {
          ...prevEmail,
          value: (event.target as HTMLInputElement).value,
        };
      }),
    []
  );
  const onPhoneNumberChange: React.ChangeEventHandler = React.useCallback(
    (event: React.ChangeEvent) =>
      setPhoneNumber((prevPN) => {
        return { ...prevPN, value: (event.target as HTMLInputElement).value };
      }),
    []
  );
  const onCommentChange: React.ChangeEventHandler = React.useCallback(
    (event: React.ChangeEvent) =>
      setComment((event.target as HTMLTextAreaElement).value),
    []
  );

  // Helper Function to check input
  const nameCheck = React.useCallback((): boolean => {
    // Name is not valid when it is empty
    if (name.value === '') {
      setName((prevName) => {
        return {
          ...prevName,
          error: true,
          helperText: 'Name is required field!',
        };
      });
      return false;
    } else if (name.error && name.value !== '') {
      // When user fix the error (enter name)
      setName((prevName) => {
        return { ...prevName, error: false, helperText: '' };
      });
      return true;
    }
    return true;
  }, [name]);
  const emailCheck = React.useCallback((): boolean => {
    // Email is not valid when it is empty
    if (email.value === '') {
      setEmail((prevEmail) => {
        return {
          ...prevEmail,
          error: true,
          helperText: 'Email is required field!',
        };
      });
      return false;
    } else if (
      !String(email.value)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      // Email is not valid when the format is wrong
      setEmail((prevEmail) => {
        return {
          ...prevEmail,
          error: true,
          helperText: 'Wrong Email Format',
        };
      });
      return false;
    } else if (email.error && email.value !== '') {
      // When user fix the error
      setEmail((prevEmail) => {
        return { ...prevEmail, error: false, helperText: '' };
      });
      return true;
    }
    return true;
  }, [email]);
  const phoneNumberCheck = React.useCallback((): boolean => {
    // Phone number is not valid when it does not match with the pattern
    // 010xxxxxxxx
    if (phoneNumber.value !== '') {
      if (!String(phoneNumber.value).match(/^(010[0-9]{8})$/)) {
        setPhoneNumber((prevPN) => {
          return {
            ...prevPN,
            error: true,
            helperText: 'Wrong Phone Number Format',
          };
        });
        return false;
      } else if (phoneNumber.error) {
        // When the value is valid but error flag is set
        // Unset the error flag
        setPhoneNumber((prevPN) => {
          return { ...prevPN, error: false, helperText: '' };
        });
        return true;
      }
    } else {
      // Empty phone number is valid
      setPhoneNumber((prevPN) => {
        return { ...prevPN, error: false, helperText: '' };
      });
      return true;
    }
    return true;
  }, [phoneNumber]);

  // Generate style of formBox
  const theme = useTheme();
  const formBoxStyleProvider = (error: boolean): React.CSSProperties => {
    return {
      margin: '10px',
      padding: '15px',
      backgroundColor: 'aliceblue',
      borderRadius: '10px',
      border: error ? `2px solid ${theme.palette.error.main}` : undefined,
    };
  };

  // Submit Form
  const formSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    (event: React.SyntheticEvent) => {
      event.preventDefault();
      setDisabled(true);
      // Check validity of inputs
      const validityCheck = [nameCheck(), emailCheck(), phoneNumberCheck()];
      if (validityCheck.includes(false)) {
        setDisabled(false);
        return;
      }

      // TODO: Submit API Request
      console.log('Sumitted');
      console.log(`Name: ${name.value}`);
      console.log(`Email: ${email.value}`);
      console.log(`Phone Number: ${phoneNumber.value}`);
      console.log(`Comment: ${comment}`);
    },
    [nameCheck, emailCheck, phoneNumberCheck, name, email, phoneNumber, comment]
  );
  const newForm: React.MouseEventHandler = React.useCallback(
    (event: React.SyntheticEvent) => {
      // Clear Form Contents
      setName({ value: '', error: false, helperText: '' });
      setEmail({ value: '', error: false, helperText: '' });
      setPhoneNumber({ value: '', error: false, helperText: '' });
      setComment('');

      // Create new form
      event.preventDefault();
      setDisabled(false);
    },
    []
  );

  return (
    <>
      <Box sx={{ margin: '15px 0' }}>
        <Typography variant="h5" sx={{ marginBottom: '10px' }}>
          Participation Form
        </Typography>
        <form onSubmit={formSubmit}>
          <Box sx={formBoxStyleProvider(name.error)}>
            <Box>
              <Typography variant="h6" component="span">
                Name
              </Typography>
              <Typography variant="h6" component="span" sx={requiredTitleStyle}>
                *
              </Typography>
            </Box>
            <TextField
              disabled={disabled}
              variant="standard"
              color="primary"
              placeholder="name"
              value={name.value}
              helperText={name.helperText}
              error={name.error}
              margin="normal"
              onChange={onNameChange}
              onKeyPress={onKeyPress}
              onBlur={nameCheck}
            />
          </Box>
          <Box sx={formBoxStyleProvider(email.error)}>
            <Box>
              <Typography variant="h6" component="span">
                Email
              </Typography>
              <Typography variant="h6" component="span" sx={requiredTitleStyle}>
                *
              </Typography>
            </Box>
            <TextField
              disabled={disabled}
              variant="standard"
              color="primary"
              placeholder="hello@email.com"
              value={email.value}
              helperText={email.helperText}
              error={email.error}
              margin="normal"
              onChange={onEmailChange}
              onKeyPress={onKeyPress}
              onBlur={emailCheck}
            />
          </Box>
          <Box sx={formBoxStyleProvider(phoneNumber.error)}>
            <Typography variant="h6">Phone Number</Typography>
            <TextField
              disabled={disabled}
              variant="standard"
              color="primary"
              placeholder="01012345678"
              value={phoneNumber.value}
              helperText={phoneNumber.helperText}
              error={phoneNumber.error}
              margin="normal"
              onChange={onPhoneNumberChange}
              onKeyPress={onKeyPress}
              onBlur={phoneNumberCheck}
            />
          </Box>
          <Box sx={formBoxStyleProvider(false)}>
            <Typography variant="h6">Comment</Typography>
            <TextField
              disabled={disabled}
              variant="standard"
              color="primary"
              placeholder="Write any additional information/comment here"
              value={comment}
              margin="normal"
              multiline
              fullWidth
              onChange={onCommentChange}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {!disabled ? (
              <Button type="submit" color="primary" variant="contained">
                Submit
              </Button>
            ) : (
              <Button color="secondary" variant="contained" onClick={newForm}>
                Create New Form
              </Button>
            )}
          </Box>
        </form>
      </Box>
    </>
  );
}

export default ParticipationForm;

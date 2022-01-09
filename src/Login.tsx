/**
 * Admin Login Page
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Material UI
import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
// Custom Hook to load LoginContext
import { useLoginContext } from './LoginData';
// API
import postLogin from './api/auth/postLogin';
// Styles
import styles from './globalStyle/accountStyle';

/**
 * React Functional Component to generate login view
 *
 * @return {React.ReactElement} Renders Login view
 */
function Login(): React.ReactElement {
  const { state } = useLocation();
  const navigate = useNavigate();
  // State
  const loginContext = useLoginContext();
  const [disabled, setDisabled] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState({ error: false, msg: '' });

  // Function to direct user to previous location
  const goBack = React.useCallback((): void => {
    if ((state as { prevLocation: string })?.prevLocation) {
      navigate((state as { prevLocation: string }).prevLocation);
    } else {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // EventHandlers to modify form input
  const onUsernameChange: React.ChangeEventHandler = React.useCallback(
    (event: React.ChangeEvent) => {
      setUsername((event.target as HTMLInputElement).value);
    },
    []
  );
  const onPasswordChange: React.ChangeEventHandler = React.useCallback(
    (event: React.ChangeEvent) => {
      setPassword((event.target as HTMLInputElement).value);
    },
    []
  );

  // Helper function to check input
  const inputCheck = React.useCallback((): boolean => {
    // Username is not valid when it is empty
    if (username === '' || password === '') {
      setError({
        error: true,
        msg: 'Both username and password are required field!',
      });
      return false;
    }
    return true;
  }, [username, password]);

  // Submit Event Handler
  const formSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    async (event: React.SyntheticEvent) => {
      event.preventDefault();
      setDisabled(true);
      // Check validity of inputs
      if (!inputCheck()) {
        setDisabled(false);
        return;
      }

      // Submit API request
      const response = await postLogin(username, password);
      if (response.status >= 200 && response.status < 300) {
        localStorage.setItem('ADMIN_LOGIN', 'yes');
        loginContext.dispatch({ type: 'LOGIN' });
        goBack();
      } else if (response.status === 400) {
        setDisabled(false);
        setError({ error: true, msg: '400 BAD REQUEST: Check your input' });
      } else if (response.status === 401) {
        setDisabled(false);
        setError({
          error: true,
          msg: 'Cannot find matching account with given credentials',
        });
      } else {
        setDisabled(false);
        setError({ error: true, msg: 'UNKNOWN ERROR' });
      }
    },
    [inputCheck, loginContext, password, username, goBack]
  );

  // EventHandler to close alert
  const closeAlert = React.useCallback(() => {
    setError({ error: false, msg: '' });
  }, []);

  // Check for whether user already logged in or not
  React.useEffect(() => {
    if (loginContext.login) {
      goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!loginContext.login && (
        <>
          <Box sx={styles.Wrapper}>
            <Typography variant="h5" sx={{ mb: '10px' }}>
              Admin Login
            </Typography>
            <form onSubmit={formSubmit} style={styles.FormWrapper}>
              <TextField
                disabled={disabled}
                size="small"
                variant="outlined"
                color="primary"
                label="username"
                margin="normal"
                value={username}
                onChange={onUsernameChange}
                sx={{ margin: '5px 0', width: '100%' }}
              />
              <TextField
                disabled={disabled}
                size="small"
                variant="outlined"
                color="primary"
                label="password"
                type="password"
                margin="normal"
                value={password}
                onChange={onPasswordChange}
                sx={{ margin: '5px 0', width: '100%' }}
              />
              <Box sx={styles.ButtonWrapper}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={disabled}
                  sx={{ width: 'calc(50% - 10px)' }}
                >
                  Login
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  disabled={disabled}
                  sx={{ width: 'calc(50% - 10px)' }}
                  onClick={goBack}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
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
      )}
    </>
  );
}

export default Login;

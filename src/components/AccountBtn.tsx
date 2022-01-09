/**
 * Component to render account button
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Material UI
import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
// Material UI Icon
import { AccountCircle } from '@mui/icons-material';
// Custom Hook to load LoginContext
import { useLoginContext } from '../LoginData';
// Components
const AddEventModal = React.lazy(() => import('./AddEventModal'));

// Type for the account button
type AccountBtnProps = {
  setModifiedFlagFunc?: () => void;
};

/**
 * React Functional Component to generate account button
 *
 * @param {AccountBtnProps} props Properties that passed from the parent
 *   Component.
 * @return {React.ReactElement} Renders account button
 */
function AccountBtn(props: AccountBtnProps): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  // State
  const loginContext = useLoginContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [addEventModalOpen, setAddEventModalOpen] = React.useState(false);

  // EventHandler for open/close admin menu
  const handleOpenAdminMenu = React.useCallback(
    (event: React.MouseEvent<HTMLElement>): void => {
      if (loginContext.login) {
        // When admin logged in, open admin menu
        setAnchorEl(event.currentTarget);
      } else {
        navigate('/login', { state: { prevLocation: location.pathname } });
      }
    },
    [loginContext.login, navigate, location.pathname]
  );
  const handleCloseAdminMenu = React.useCallback((): void => {
    setAnchorEl(null);
  }, []);

  // function to logout from session
  const logout = React.useCallback((): void => {
    // TODO: API Call to logout
    localStorage.removeItem('ADMIN_LOGIN');
    loginContext.dispatch({ type: 'LOGOUT' });

    // Close Admin Menu
    handleCloseAdminMenu();
  }, [loginContext, handleCloseAdminMenu]);

  // function to move to the changePW screen
  const changePW = React.useCallback((): void => {
    navigate('/changePW', { state: { prevLocation: location.pathname } });
  }, [location.pathname, navigate]);

  // Function to open/close addEvent Modal
  const openAddEventModal = React.useCallback((): void => {
    setAddEventModalOpen(true);
    handleCloseAdminMenu();
  }, [handleCloseAdminMenu]);
  const closeAddEventModal = React.useCallback(
    (): void => setAddEventModalOpen(false),
    []
  );

  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton onClick={handleOpenAdminMenu} sx={{ padding: '4px' }}>
        <AccountCircle sx={{ height: '32px', width: '32px', color: 'white' }} />
      </IconButton>
      <Menu
        sx={{ mt: '35px' }}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorEl)}
        onClose={handleCloseAdminMenu}
      >
        <MenuItem>
          <Typography textAlign="center" onClick={openAddEventModal}>
            New Event
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={changePW}>
          <Typography textAlign="center">Change PW</Typography>
        </MenuItem>
        <MenuItem onClick={logout}>
          <Typography textAlign="center" sx={{ color: 'red', fontWeight: 500 }}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>
      {addEventModalOpen && (
        <AddEventModal
          isOpen={addEventModalOpen}
          handleClose={closeAddEventModal}
          setModifiedFlagFunc={props.setModifiedFlagFunc}
        />
      )}
    </Box>
  );
}

export default React.memo(AccountBtn);

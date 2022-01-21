/**
 * Event Detail Page
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
// Material UI
import { Box, Divider, Grid, IconButton, Typography } from '@mui/material';
// Material UI Icon
import { ArrowCircleLeftOutlined } from '@mui/icons-material';
// API
import getEventDetail from './api/event/getEventDetail';
// Global Style, Type, and Data
import styles from './globalStyle/detailPageStyle';
import EventDetailData from './globalType/EventDetailData';
// Custom Hook to load LoginContext
import { useLoginContext } from './LoginData';
// Components
import AccountBtn from './components/AccountBtn';
import ParticipationForm from './components/EventDetail/ParticipationForm';
const AdminBtn = React.lazy(() => import('./components/EventDetail/AdminBtn'));

/**
 * React Functional Component to generate event detail screen
 *
 * @return {React.ReactElement} Renders event detail screen
 */
function EventDetail(): React.ReactElement {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  // State
  const [eventDetail, setEventDetail] = React.useState<EventDetailData | null>(
    null
  );
  const [dateString, setDateString] = React.useState('');
  const [eventModified, setEventModified] = React.useState(true);
  const loginContext = useLoginContext();

  // Function to load event detail
  const loadDetail = React.useCallback(async () => {
    // If id is not set, redirect to main page with error message
    if (!id) {
      // Redirect to main page
      navigate('/', { state: { errorMsg: 'Page Not Found' } });
      return;
    }

    // API Call
    const response = await getEventDetail(id as string);
    if (response.status >= 200 && response.status < 300) {
      const data = await response.json();
      const eventDate = new Date(data.year, data.month - 1, data.date);
      setEventDetail(data);
      setDateString(
        `${eventDate.toLocaleDateString('en-US', {
          month: 'short',
        })}. ${String(data.date).padStart(2, '0')}. ${data.year}`
      );
    } else {
      // Event Not Found
      // Redirect to main page
      navigate('/', { state: { errorMsg: 'Page Not Found' } });
    }
  }, [id, navigate]);

  // Load Detail on first load and when eventModified flag set
  React.useEffect(() => {
    if (eventModified) {
      loadDetail();
      setEventModified(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventModified]);

  // Function to set the eventDetailModify flag
  const setModifiedFlag = React.useCallback(() => setEventModified(true), []);

  /**
   * Function to direct user to previous location
   */
  const goBack = React.useCallback((): void => {
    if ((state as { prevLocation: string })?.prevLocation) {
      navigate((state as { prevLocation: string }).prevLocation);
    } else {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container direction="column" wrap="nowrap" sx={styles.gridWrapper}>
      <Grid item>
        <Box sx={styles.headerWrapper}>
          <IconButton sx={{ padding: '4px' }} onClick={goBack}>
            <ArrowCircleLeftOutlined sx={styles.backBtn} />
          </IconButton>
          <Box sx={{ ...styles.headerTitleWrapper, display: 'inline-flex' }}>
            <Typography variant="h6" component="div" sx={{ color: 'white' }}>
              Event Detail
            </Typography>
          </Box>
          <AccountBtn />
        </Box>
      </Grid>
      {eventDetail && (
        <Grid item sx={styles.detailWrapper}>
          <Box sx={{ width: '100%', maxWidth: '800px', padding: '20px 7px' }}>
            <Typography variant="h4">{eventDetail.name}</Typography>
            {eventDetail.category ? (
              <Typography variant="caption">{eventDetail.category}</Typography>
            ) : (
              <Typography variant="caption">No Category</Typography>
            )}
            <Divider sx={{ margin: '10px 0' }} />
            <Typography variant="eventDetailBody">
              Event Date: {dateString}
            </Typography>
            {eventDetail.detail && (
              <Box sx={{ margin: '15px 0' }}>
                <Typography variant="h6">Detail</Typography>
                <Typography variant="eventDetailBody">
                  {eventDetail.detail}
                </Typography>
              </Box>
            )}
            {loginContext.login && (
              <AdminBtn
                eventId={id as string}
                eventDetail={eventDetail as EventDetailData}
                goBackFunc={goBack}
                setModifiedFlagFunc={setModifiedFlag}
              />
            )}
            <Divider sx={{ margin: '10px 0' }} />
            <ParticipationForm />
          </Box>
        </Grid>
      )}
    </Grid>
  );
}

export default EventDetail;

/**
 * Event Participants List screen - Admin only
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
import getParticipantsList from './api/participate/getParticipantsList';
// Global Style, Type, and Data
import detailPageStyle from './globalStyle/detailPageStyle';
import EventDetailData from './globalType/EventDetailData';
import ParticipantInfo from './globalType/ParticipantInfo';
// Custom Hook to load LoginContext
import { useLoginContext } from './LoginData';
// Components
import AccountBtn from './components/AccountBtn';
const ParticipantsTable = React.lazy(
  () => import('./components/EventParticipants/ParticipantsTable')
);

type ParticipantsDetailData = {
  numParticipants: number;
  participantsList?: ParticipantInfo[];
};

const styles = {
  eventInfoWrapper: {
    width: '100%',
    padding: '20px 7px',
    display: 'flex',
    flexDirection: 'column',
  },
  eventInfo: { width: '100%', maxWidth: '800px', alignSelf: 'center' },
  noParticipants: {
    width: '100%',
    height: '100%',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontStyle: 'italic',
    color: 'gray',
  },
  ...detailPageStyle,
};

/**
 * React Functional Component to generate event participant list screen
 *   Admin only.
 *
 * @return {React.ReactElement} Renders event participants screen
 */
function EventParticipants(): React.ReactElement {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  // State
  const loginContext = useLoginContext();
  const [eventDetail, setEventDetail] = React.useState<EventDetailData | null>(
    null
  );
  const [dateString, setDateString] = React.useState('');
  const [participantsDetail, setParticipantsDetail] =
    React.useState<ParticipantsDetailData | null>(null);
  const [participantsModified, setParticipantsModified] = React.useState(true);

  // Function to load Event Detail and Participants Detail
  const loadData = React.useCallback(async () => {
    // If id is not set, redirect to main page with error message
    if (!id) {
      // Redirect to main page
      navigate('/', { state: { errorMsg: 'Page Not Found' } });
      return;
    }

    // Event Detail API Call
    const eventResponse = await getEventDetail(id as string);
    if (eventResponse.status >= 200 && eventResponse.status < 300) {
      const data = await eventResponse.json();
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
      return;
    }

    // Participant List API Call
    const participationResponse = await getParticipantsList(id as string);
    if (
      participationResponse.status >= 200 &&
      participationResponse.status < 300
    ) {
      const data = await participationResponse.json();
      setParticipantsDetail(data);
    } else if (participationResponse.status === 401) {
      // Authentication Fail
      // TODO: Retry after refresh the access token
      // If fail
      // Redirect to main page
      navigate('/', { state: { errorMsg: 'Authentication Fail' } });
    } else if (participationResponse.status === 404) {
      // Page Not Found
      // Redirect to main page
      navigate('/', { state: { errorMsg: 'Page Not Found' } });
    }
  }, [id, navigate]);

  // Load Data on first load and when participantsModified flag set
  React.useEffect(() => {
    if (participantsModified) {
      loadData();
      setParticipantsModified(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantsModified]);

  // Function to set the participantsModified flag
  const setModifiedFlag = React.useCallback(
    () => setParticipantsModified(true),
    []
  );

  // Function to direct user to previous location
  const goBack = React.useCallback((): void => {
    if ((state as { prevLocation: string })?.prevLocation) {
      navigate((state as { prevLocation: string }).prevLocation);
    } else {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for whether admin logged in or not
  React.useEffect(() => {
    if (!loginContext.login) {
      goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loginContext.login && (
        <Grid
          container
          direction="column"
          wrap="nowrap"
          sx={styles.gridWrapper}
        >
          <Grid item>
            <Box sx={styles.headerWrapper}>
              <IconButton sx={{ padding: '4px' }} onClick={goBack}>
                <ArrowCircleLeftOutlined sx={styles.backBtn} />
              </IconButton>
              <Box
                sx={{ ...styles.headerTitleWrapper, display: 'inline-flex' }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ color: 'white' }}
                >
                  Participants List
                </Typography>
              </Box>
              <AccountBtn />
            </Box>
          </Grid>
          {eventDetail && participantsDetail && (
            <Grid item sx={styles.detailWrapper}>
              <Box sx={styles.eventInfoWrapper}>
                <Box sx={styles.eventInfo}>
                  <Typography variant="h4">{eventDetail.name}</Typography>
                  {eventDetail.category ? (
                    <Typography variant="caption" component="div">
                      {eventDetail.category}
                    </Typography>
                  ) : (
                    <Typography variant="caption" component="div">
                      No Category
                    </Typography>
                  )}
                  <Typography variant="eventDetailBody" component="div">
                    Event Date: {dateString}
                  </Typography>
                </Box>
                <Divider sx={{ margin: '10px 0' }} />
                {participantsDetail.numParticipants === 0 ? (
                  <Box sx={{ height: '100%' }}>
                    <Typography variant="h5" sx={styles.noParticipants}>
                      No Participants
                    </Typography>
                  </Box>
                ) : (
                  <ParticipantsTable
                    eventId={id as string}
                    participantsList={
                      participantsDetail.participantsList as ParticipantInfo[]
                    }
                    setModifiedFlagFunc={setModifiedFlag}
                  />
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
}

export default EventParticipants;

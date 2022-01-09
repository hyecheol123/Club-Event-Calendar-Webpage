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
// Global Style, Type, and Data
import detailPageStyle from './globalStyle/detailPageStyle';
import EventDetailData from './globalType/EventDetailData';
import ParticipantInfo from './globalType/ParticipantInfo';
import eventData from './globalData/eventDetail';
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

const participantsData: { [index: string]: ParticipantsDetailData } = {
  1: {
    numParticipants: 1,
    participantsList: [
      {
        id: 1,
        participantName: '홍길동',
        email: 'gildong.hong@gmail.com',
        comment:
          '디스코드 신규 가입 관련 이메일을 보냈습니다. 확인 부탁드립니다.',
      },
    ],
  },
  2: {
    numParticipants: 3,
    participantsList: [
      {
        id: 2,
        participantName: '김철수',
        email: 'cskim12@naver.com',
        phoneNumber: '01012345678',
      },
      {
        id: 4,
        participantName: '최영희',
        email: 'yhchoi@hanmail.net',
        comment: '도착예정시간은 12시 입니다.',
      },
      {
        id: 5,
        participantName: 'James Lee',
        email: 'superjames@gmail.com',
        phoneNumber: '01056781234',
        comment: '11시 30분쯤 도착할 것 같습니다. 자차 들고갑니다.',
      },
    ],
  },
  3: {
    numParticipants: 6,
    participantsList: [
      {
        id: 3,
        participantName: '김철수',
        email: 'cskim12@naver.com',
        comment: '음 아이디는 cskim12입니다.',
      },
      {
        id: 6,
        participantName: 'James Lee',
        email: 'superjames@gmail.com',
        comment: 'mm 아이디: superjames',
      },
      {
        id: 7,
        participantName: '최영희',
        email: 'yhchoi@hanmail.net',
        comment: 'mm 계정은 yhchoi입니다.',
      },
      {
        id: 8,
        participantName: '홍길동',
        email: 'gildong.hong@gmail.com',
        comment: 'mm: @gildongHong',
      },
      {
        id: 9,
        participantName: '정현우',
        email: 'gusdn@gmail.com',
        comment: 'mm: @gusdn123',
      },
      {
        id: 10,
        participantName: '박지영',
        email: 'jsp8392@naver.com',
        phoneNumber: '01012348392',
        comment: 'mm을 아직 가입하지 않았습니다.',
      },
    ],
  },
  4: {
    numParticipants: 0,
  },
};

/**
 * React Functional Component to generate event participant list screen
 *   Admin only.
 *
 * @return {React.ReactElement} Renders event participants screen
 */
function EventParticipants(): React.ReactElement {
  const { state } = useLocation();
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

  // Retrieve eventId from the path
  const { id } = useParams();
  if (!id) {
    // TODO Redirect to 404 page
  }

  // Function to load Event Detail and Participants Detail
  const loadData = React.useCallback(() => {
    // TODO: API Call
    const eventResponse = eventData[id as string];
    const participationResponse = participantsData[id as string];
    const eventDate = new Date(
      eventResponse.year,
      eventResponse.month - 1,
      eventResponse.date
    );
    setEventDetail(eventResponse);
    setDateString(
      String.prototype.concat(
        `${eventDate.toLocaleDateString('en-US', { month: 'short' })}. `,
        `${String(eventResponse.date).padStart(2, '0')}. `,
        eventResponse.year.toString()
      )
    );
    setParticipantsDetail(participationResponse);
  }, [id]);

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

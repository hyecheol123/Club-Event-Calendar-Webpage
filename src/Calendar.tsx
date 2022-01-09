/**
 * Calendar (Main) Page
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Material UI
import { Box, Grid, IconButton, Stack, Typography } from '@mui/material';
// Material UI Icons
import {
  ArrowBackIosRounded,
  ArrowForwardIosRounded,
} from '@mui/icons-material';
// API
import getEventList from './api/calendar/getEventList';
// Components
import CalendarBox from './components/Calendar/CalendarBox';
import DaysOfWeek from './components/Calendar/DaysOfWeek';
import AccountBtn from './components/AccountBtn';
// Global Style
import headerStyle from './globalStyle/headerStyle';

// Styles
const styles = { ...headerStyle };

// Types
type EventSummary = {
  id: string;
  name: string;
  date: number;
  category?: string;
};

/**
 * Function to generate style for the calendar
 *
 * @param {number} nRow number of rows in the calendar
 * @return {object} object containing sx styles
 */
function getCalendarGridColumnStyle(nRow: number): object {
  return {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gridTemplateRows: `repeat(${nRow}, ${100 / nRow}%)`,
    gridGap: '1px',
  };
}

/**
 * Function to retrieve current year and month
 *
 * @return {{year: number, month: number}} return year (fullYear)
 *   and month (monthIndex)
 */
function getCurrentYearMonth(): { year: number; month: number } {
  const currDate = new Date();
  return { year: currDate.getFullYear(), month: currDate.getMonth() };
}

/**
 * React Functional Component to generate calendar screen
 *
 * @return {React.ReactElement} Renders Calendar screen
 */
function Calendar(): React.ReactElement {
  // States
  const [calendarData, setCalendarData] = React.useState([
    { date: -1, eventList: [] },
  ]);
  const [modifyFlag, setModifyFlag] = React.useState(true);

  const navigate = useNavigate();
  // Retrieve year and month from path
  const params = useParams();
  let { year, month } = getCurrentYearMonth(); // Default: current year/month
  if (params.year && params.month) {
    year = parseInt(params.year);
    month = parseInt(params.month) - 1;
    // If either year or month is NaN, redirect to 404 page
    if (isNaN(year) || isNaN(month)) {
      // TODO redirect to 404 page
    }
  }

  // Variables that used to draw calendar
  const currentMonthDate = new Date(year, month, 1);
  const startDayIdx = currentMonthDate.getDay();
  const numDates = new Date(year, month + 1, 0).getDate();
  const nRow = Math.ceil((startDayIdx + numDates) / 7);

  // Retrieve EventList to draw event
  const retrieveEventList = React.useCallback(async () => {
    if (modifyFlag) {
      // Draw Layout
      const tempData = new Array(nRow * 7).fill({
        date: undefined,
        eventList: [],
      });
      for (let i = startDayIdx; i < startDayIdx + numDates; ++i) {
        tempData[i] = { date: i + 1 - startDayIdx, eventList: [] };
      }
      setCalendarData(tempData);

      // API Call
      const completeData = [...tempData];
      const response = await getEventList(year, month + 1);
      if (!response) {
        // Error: year and month invalid
        // TODO: Display Error Message
      } else if (response.status >= 200 && response.status < 300) {
        const data = await response.json();
        if (data.numEvent > 0) {
          data.eventList.forEach((event: EventSummary) => {
            const idx = startDayIdx - 1 + event.date;
            completeData[idx].eventList = [
              ...completeData[idx].eventList,
              event,
            ];
          });
        }
        setCalendarData(completeData);
        setModifyFlag(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modifyFlag, year, month]);
  React.useEffect(() => {
    retrieveEventList();
  }, [retrieveEventList]);

  /**
   * Helper method to change month
   *
   * @param {number} move 1 for forward, -1 for backward
   */
  const moveMonth = React.useCallback(
    (move: number): void => {
      const moveTargetMonthDate = new Date(year, month + move);
      const newYear = moveTargetMonthDate.getFullYear();
      const newMonth = moveTargetMonthDate.getMonth() + 1;
      setModifyFlag(true);
      navigate(`../${newYear}-${newMonth}`);
    },
    [year, month, navigate]
  );

  // Function used to notify calendar screen to be refreshed
  const notifyAddEvent = React.useCallback((): void => setModifyFlag(true), []);

  return (
    <Grid
      container
      direction="column"
      wrap="nowrap"
      sx={{ height: '100%', overflow: 'hidden' }}
    >
      <Grid item>
        <Box sx={styles.headerWrapper}>
          <Stack direction="row" sx={styles.headerTitleWrapper}>
            <IconButton
              onClick={(): void => moveMonth(-1)}
              sx={{ color: 'lightgray' }}
            >
              <ArrowBackIosRounded />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ color: 'white' }}>
              {currentMonthDate.toLocaleDateString('en-US', { month: 'short' })}
              . {year}
            </Typography>
            <IconButton
              onClick={(): void => moveMonth(1)}
              sx={{ color: 'lightgray' }}
            >
              <ArrowForwardIosRounded />
            </IconButton>
          </Stack>
          <AccountBtn setModifiedFlagFunc={notifyAddEvent} />
        </Box>
      </Grid>
      <Grid item sx={{ backgroundColor: 'gray' }}>
        <DaysOfWeek />
      </Grid>
      <Grid item sx={{ flexGrow: 1, backgroundColor: 'gray', minHeight: 0 }}>
        <Box style={{ ...getCalendarGridColumnStyle(nRow), height: '100%' }}>
          {calendarData.map((value, index) => {
            return (
              <CalendarBox
                date={value.date}
                dateString={`${currentMonthDate.toLocaleDateString('en-US', {
                  month: 'short',
                })}. ${String(value.date).padStart(2, '0')}. ${year}`}
                eventList={value.eventList}
                key={`${year}-${month}-${index}`}
              />
            );
          })}
        </Box>
      </Grid>
    </Grid>
  );
}

export default Calendar;

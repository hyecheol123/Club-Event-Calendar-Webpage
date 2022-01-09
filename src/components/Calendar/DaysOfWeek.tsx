/**
 * DaysOfWeek Component
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';
import { Box, Typography } from '@mui/material';

// Styles
const style = {
  fontWeight: 700,
  backgroundColor: 'aliceblue',
};
const WrapperStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gridGap: '1px',
  borderBottom: '1px solid gray',
};

/**
 * React Functional Component to generate calendar header with days of week
 *
 * @return {React.ReactElement} Renders DaysOfWeek
 */
function DaysOfWeek(): React.ReactElement {
  return (
    <Box sx={WrapperStyle}>
      <Typography
        variant="calendarDaysOfWeek"
        align="center"
        sx={{ color: 'red', ...style }}
      >
        Sun
      </Typography>
      <Typography variant="calendarDaysOfWeek" align="center" sx={style}>
        Mon
      </Typography>
      <Typography variant="calendarDaysOfWeek" align="center" sx={style}>
        Tue
      </Typography>
      <Typography variant="calendarDaysOfWeek" align="center" sx={style}>
        Wed
      </Typography>
      <Typography variant="calendarDaysOfWeek" align="center" sx={style}>
        Thu
      </Typography>
      <Typography variant="calendarDaysOfWeek" align="center" sx={style}>
        Fri
      </Typography>
      <Typography
        variant="calendarDaysOfWeek"
        align="center"
        sx={{ color: 'blue', ...style }}
      >
        Sat
      </Typography>
    </Box>
  );
}

export default React.memo(DaysOfWeek);

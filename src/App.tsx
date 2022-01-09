/**
 * Entry point of the application
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
import { render } from 'react-dom';
// Material UI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { green } from '@mui/material/colors';
// Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Font
import '@fontsource/ibm-plex-sans-kr/300.css';
import '@fontsource/ibm-plex-sans-kr/400.css';
import '@fontsource/ibm-plex-sans-kr/500.css';
// API
import getRenew from './api/auth/getRenew';
// Elements
import Loading from './components/Loading/Loading';
import { LoginContextProvider, useLoginContext } from './LoginData';
const Calendar = React.lazy(() => import('./Calendar'));
const EventDetail = React.lazy(() => import('./EventDetail'));
const EventParticipants = React.lazy(() => import('./EventParticipants'));
const Login = React.lazy(() => import('./Login'));
const ChangePW = React.lazy(() => import('./ChangePW'));

// MUI Theme (Setup Font family and Palette Color)
declare module '@mui/material/styles' {
  interface TypographyVariantsOptions {
    calendarDaysOfWeek?: React.CSSProperties;
    calendarBody?: React.CSSProperties;
    calendarEvent?: React.CSSProperties;
    eventDetailBody?: React.CSSProperties;
  }
  interface Palette {
    tertiary: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    calendarDaysOfWeek: true;
    calendarBody: true;
    calendarEvent: true;
    eventDetailBody: true;
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    tertiary: true;
  }
}
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};
const theme = createTheme({
  breakpoints,
  typography: {
    fontFamily: '"IBM Plex Sans KR", sans-serif',
    h4: {
      fontWeight: 500,
      [`@media screen and (max-width: ${breakpoints.values.md}px)`]: {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontWeight: 500,
    },
    calendarEvent: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
      [`@media screen and (max-width: ${breakpoints.values.md}px)`]: {
        fontSize: '0.6rem',
      },
    },
    eventDetailBody: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
      [`@media screen and (max-width: ${breakpoints.values.md}px)`]: {
        fontSize: '0.9rem',
      },
    },
    calendarDaysOfWeek: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.75,
      letterSpacing: '0.00938em',
      [`@media screen and (max-width: ${breakpoints.values.md}px)`]: {
        fontSize: '0.8rem',
      },
    },
    calendarBody: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
      [`@media screen and (max-width: ${breakpoints.values.md}px)`]: {
        fontSize: '0.7rem',
      },
    },
    caption: {
      fontSize: '0.8rem',
    },
  },
  palette: {
    tertiary: {
      light: green[300],
      main: green[600],
      dark: green[800],
      contrastText: '#fff',
    },
  },
});

/**
 * React functional component to render the application's content
 *
 * @return {React.ReactElement} The content of the application
 */
function App(): React.ReactElement {
  // State
  const loginContext = useLoginContext();

  // Initialize App.ication
  const init = React.useCallback(async () => {
    // When application not initialized
    if (!loginContext.initialized) {
      // check whether admin token alive or not
      if (localStorage.getItem('ADMIN_LOGIN') === 'yes') {
        // API Call to Renew Token
        const response = await getRenew();
        if (response) {
          loginContext.dispatch({ type: 'INITIALIZE', login: true });
        } else {
          loginContext.dispatch({ type: 'INITIALIZE', login: false });
        }
      } else {
        localStorage.removeItem('ADMIN_LOGIN');
        loginContext.dispatch({ type: 'INITIALIZE', login: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={loginContext.initialized ? <Calendar /> : <Loading />}
          />
          <Route
            path="/:year-:month"
            element={loginContext.initialized ? <Calendar /> : <Loading />}
          />
          <Route
            path="/event/:id"
            element={loginContext.initialized ? <EventDetail /> : <Loading />}
          />
          <Route
            path="/event/:id/participants"
            element={
              loginContext.initialized ? <EventParticipants /> : <Loading />
            }
          />
          <Route
            path="/login"
            element={loginContext.initialized ? <Login /> : <Loading />}
          />
          <Route
            path="/changePW"
            element={loginContext.initialized ? <ChangePW /> : <Loading />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

/**
 * React functional component to render the application's entry point
 *
 * @return {React.ReactElement} The entry point of the application
 */
function AppWrapper(): React.ReactElement {
  return (
    <React.StrictMode>
      <React.Suspense fallback={<Loading />}>
        <LoginContextProvider>
          <App />
        </LoginContextProvider>
      </React.Suspense>
    </React.StrictMode>
  );
}

render(<AppWrapper />, document.getElementById('root'));

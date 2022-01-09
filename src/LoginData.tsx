/**
 * React Context to store login information globally
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';

// Type definition for props of LoginContextProvider
type LoginContextProviderProps = {
  children: React.ReactNode;
};

// Type for all actions
type Action =
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'INITIALIZE'; login: boolean };

// Type definition for state
type State = {
  login: boolean;
  initialized: boolean;
  dispatch: React.Dispatch<Action>;
};

// Initial Data of reducer
const initialData: State = {
  login: false,
  initialized: false,
  dispatch: () => {},
};

/**
 * Reducer to modify the state
 *
 * @param {State} state Current State
 * @param {Action} action Action to modify the State
 * @return {State} New State
 */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, login: true };
    case 'LOGOUT':
      return { ...state, login: false };
    case 'INITIALIZE':
      return { ...state, login: action.login, initialized: true };
    default:
      return state;
  }
}

// Context for admin login
const LoginContext = React.createContext<State>(initialData);

/**
 * React Functional Component for LoginContext
 *
 * @param {LoginContextProviderProps} props Properties that passed from the
 *   parent Component.
 * @return {React.ReactElement} Renders LoginContextProvider
 */
export function LoginContextProvider(
  props: LoginContextProviderProps
): React.ReactElement {
  // State
  const [state, dispatch] = React.useReducer(reducer, initialData);

  // Context Value
  const value = { ...state, dispatch };

  return (
    <LoginContext.Provider value={value}>
      {props.children}
    </LoginContext.Provider>
  );
}

/**
 * React Custom Hooks to use the Login Context
 *
 * @return {State} current global state (Login Context)
 */
export function useLoginContext(): State {
  const state = React.useContext(LoginContext);
  if (!state) throw new Error('CAnnot Find LoginContext');
  return state;
}

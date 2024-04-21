import React, { createContext, useReducer, useCallback, useEffect } from 'react';

const initialState = {
  isLoggedIn: false,
  userId: null,
  token: null,
  username:null,
  role: null,
  tokenExpiration: null,
  image:null
};

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      const { token } = action.payload;

      // For login, decode the token and extract user information
      const decodedToken = decodeToken(token);
      if (!decodedToken) {
        // Handle decoding error
        return state;
      }

      const { userId, role,username, exp,image } = decodedToken;

      const newAuthState = {
        isLoggedIn: true,
        userId,
        username,
        token,
        role,
        image,
        tokenExpiration: exp * 1000, // Convert seconds to milliseconds
      };

      localStorage.setItem('authState', JSON.stringify(newAuthState));
      return newAuthState;

    case 'LOGOUT':
      localStorage.removeItem('authState');
      return initialState;

    default:
      return state;
  }
};

const decodeToken = (token) => {
  try {
    // Decode the token and return the payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const storedAuthState = localStorage.getItem('authState');
  const parsedAuthState = isValidAuthState(storedAuthState) ? JSON.parse(storedAuthState) : initialState;

  const [state, dispatch] = useReducer(authReducer, parsedAuthState);

  const login = useCallback((userData) => {
    dispatch({ type: 'LOGIN', payload: userData });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (state.tokenExpiration && new Date(state.tokenExpiration) < new Date()) {
        // Token has expired, perform logout
        dispatch({ type: 'LOGOUT' });
      }
    };

    checkTokenExpiration();

    const expirationTimer = setInterval(checkTokenExpiration, 60000);

    return () => {
      clearInterval(expirationTimer);
    };
  }, [state]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('authState'));

    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
    }
  }, []); // Empty dependency array to run once on mount

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const isValidAuthState = (authState) =>
  authState &&
  authState.isLoggedIn !== undefined &&
  authState.userId !== undefined &&
  authState.username !== undefined &&
  authState.token !== undefined &&
  authState.tokenExpiration !== undefined &&
authState.image !==undefined;
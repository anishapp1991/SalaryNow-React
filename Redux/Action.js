const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const SET_LOCATION = 'SET_LOCATION';

export const loginSuccess = (token) => ({
  type: LOGIN_SUCCESS,
  payload: { token },
});

export const registerSuccess = () => ({
  type: REGISTER_SUCCESS
});

export const setLocation = (latitude, longitude) => ({
  type: 'SET_LOCATION',
  payload: { latitude, longitude },
});
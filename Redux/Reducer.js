import { LOGIN_SUCCESS,REGISTER_SUCCESS } from "./Action";

const initialState = {
  token: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
   
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
      };
      case 'SET_LOCATION': // Handle location updates
      return {
        ...state,
        location: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;

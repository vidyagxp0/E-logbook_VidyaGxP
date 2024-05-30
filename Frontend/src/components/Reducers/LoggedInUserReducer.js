const initialState = {
    loggedInUser: JSON.parse(localStorage.getItem('user-details')) || {},
    };
    
    const LoggedInUserReducer = (state = initialState, action) => {
      switch (action.type) {
        case 'LOGGED-IN-USER':
          return {
            ...state,
            loggedInUser: action.payload,
          };
        default:
          return state;
      }
    };
    export default LoggedInUserReducer;

const initialState = {
  signatureData: {},
};

const signatureReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_SIGNATURE':
      return {
        ...state,
        signatureData: action.payload,
      };
    default:
      return state;
  }
};

export default signatureReducer;
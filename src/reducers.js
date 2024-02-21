// // reducers.js
// const initialState = {
//   objects: [],
//   signatureData: {},
// };

// const rootReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "ADD_OBJECT":
//       return {
//         ...state,
//         objects: [...state.objects, action.payload],
//       };
//       case 'SAVE_SIGNATURE':
//         return {
//           ...state,
//           signatureData: action.payload,
//         };
//     default:
//       return state;
//   }
// };

// export default rootReducer;
// reducers.js
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

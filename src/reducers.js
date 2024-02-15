// reducers.js
const initialState = {
  objects: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_OBJECT":
      return {
        ...state,
        objects: [...state.objects, action.payload],
      };
    default:
      return state;
  }
};

export default rootReducer;

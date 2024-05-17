



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
      case 'EDIT-OBJECT':
        const { id, editedData } = action.payload;
        const updatedData = state.objects.map(item => {
          if (item.eLogId === id) { 
            return {
              ...item,
              ...editedData,
            };
          }
          return item;
        });
        return {
          ...state,
          objects: updatedData,
        };
    default:
      return state;
  }
};

export default rootReducer;
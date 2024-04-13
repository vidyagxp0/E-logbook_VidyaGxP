const initialState = {
  selectedRow: null,
  };
  
  const DPRpanelReducers = (state = initialState, action) => {
    switch (action.type) {
      case 'SELECT_ROW':
        return {
          ...state,
          selectedRow: action.payload,
        };
      default:
        return state;
    }
  };
  export default DPRpanelReducers;
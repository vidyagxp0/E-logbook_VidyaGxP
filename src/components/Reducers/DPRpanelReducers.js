const initialState = {
    selectedELogId: null,
  };
  
  const DPRpanelReducers = (state = initialState, action) => {
    switch (action.type) {
      case "SET_SELECTED_ELOG_ID":
        return {
          ...state,
          selectedELogId: action.payload,
        };
      default:
        return state;
    }
  };
  export default DPRpanelReducers;
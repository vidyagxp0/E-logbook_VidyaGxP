// Reducer

const initialState = {
  temperatureRecordData: [],
  };
  

const TemperatureRecordReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD-TEMPERATURETDATA':
      return {
        ...state,
        temperatureRecordData: [...state.temperatureRecordData, action.payload],
      };
    case 'EDIT-TEMPERATURETDATA':
      const { id, editedData } = action.payload;
      const updatedData = state.temperatureRecordData.map(item => {
        if (item.eLogId === id) { // Ensure to use eLogId instead of id
          return {
            ...item,
            ...editedData,
          };
        }
        return item;
      });
      return {
        ...state,
        temperatureRecordData: updatedData,
      };
    default:
      return state;
  }
};
    
    export default TemperatureRecordReducers;
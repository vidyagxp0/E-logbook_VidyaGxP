
const initialState = {
    temperatureRecordData: [],
    };
    
    const TemperatureRecordReducers = (state = initialState, action) => {
      switch (action.type) {
        case 'TEMPERATURE_RECORD_DATA':
          return {
            ...state,
            temperatureRecordData: [...state.temperatureRecordData, action.payload],
          };
        default:
          return state;
      }
    };
    
    export default TemperatureRecordReducers;
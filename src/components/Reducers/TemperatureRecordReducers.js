
const initialState = {
    tempratureRecordData: [],
    };
    
    const TemperatureRecordReducers = (state = initialState, action) => {
      switch (action.type) {
        case 'TEMPRATURE_RECORD_DATA':
          return {
            ...state,
            tempratureRecordData: [...state.tempratureRecordData, action.payload],
          };
        default:
          return state;
      }
    };
    
    export default TemperatureRecordReducers;
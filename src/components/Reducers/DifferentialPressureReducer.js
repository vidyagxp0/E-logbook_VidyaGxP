const initialState = {
    differentialTableData: [],
    };
    
    const DifferentialPressureReducers = (state = initialState, action) => {
      switch (action.type) {
        case 'DIFERENTIALTABLE_DATA':
          return {
            ...state,
            differentialTableData: [...state.differentialTableData, action.payload],
          };
        default:
          return state;
      }
    };
    
    export default DifferentialPressureReducers;
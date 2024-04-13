const initialState = {
    areaAndEquipmentData: [],
    };
    
    const areaAndEquipmentReducers = (state = initialState, action) => {
      switch (action.type) {
        case 'AREAANDEQUIPMENT_DATA':
          return {
            ...state,
            areaAndEquipmentData: [...state.areaAndEquipmentData, action.payload],
          };
        default:
          return state;
      }
    };
    
    export default areaAndEquipmentReducers;
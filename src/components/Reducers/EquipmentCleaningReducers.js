

const initialState = {
    EquipmentCleaningData: [],
    };
    
    const EquipmentCleaningReducers = (state = initialState, action) => {
      switch (action.type) {
        case 'ADD-EQUIPMENTDATA':
          return {
            ...state,
            EquipmentCleaningData: [...state.EquipmentCleaningData, action.payload],
          };
        default:
          return state;
      }
    };
    
    export default EquipmentCleaningReducers;
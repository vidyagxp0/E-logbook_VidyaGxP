// Reducer
const initialState = {
  areaAndEquipmentData: [],
  };

const areaAndEquipmentReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD-AREAANDEQUIPMENTDATA':
      return {
        ...state,
        areaAndEquipmentData: [...state.areaAndEquipmentData, action.payload],
      };
    case 'EDIT-AREAANDEQUIPMENTDATA':
      const { id, editedData } = action.payload;
      const updatedData = state.areaAndEquipmentData.map(item => {
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
        areaAndEquipmentData: updatedData,
      };
    default:
      return state;
  }
};

    
    export default areaAndEquipmentReducers;
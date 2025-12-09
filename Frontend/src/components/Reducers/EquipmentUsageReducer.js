// Reducer

const initialState = {
  equipmentUsageData: [],
  };
  

const EquipmentUsageReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD-EQUIPMENTUSAGEDATA':
      return {
        ...state,
        equipmentUsageData: [...state.equipmentUsageData, action.payload],
      };
    case 'EDIT-EQUIPMENTUSAGEDATA':
      const { id, editedData } = action.payload;
      const updatedData = state.equipmentUsageData.map(item => {
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
        equipmentUsageData: updatedData,
      };
    default:
      return state;
  }
};
    
    export default EquipmentUsageReducers;
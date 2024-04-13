// Reducer
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
    case 'EDIT-EQUIPMENTDATA':
      const { id, editedData } = action.payload;
      const updatedData = state.EquipmentCleaningData.map(item => {
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
        EquipmentCleaningData: updatedData,
      };
    default:
      return state;
  }
};

export default EquipmentCleaningReducers;

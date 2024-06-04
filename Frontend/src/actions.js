// export const saveSignature = (signatureData) => ({
//     type: 'SAVE_SIGNATURE',
//     payload: signatureData
//   });

export const saveEquipmentData = (equipmentData) => ({
    type: 'ADD-EQUIPMENTDATA',
    payload: equipmentData
  })

export const saveDifferentialPressureData=(newObject)=>({
  type:"ADD_OBJECT",
   payload: newObject,
})

export const saveSignature=(saveSignature)=>({
  type:"SAVE_SIGNATURE",
  payload:saveSignature
})
export const saveAreaAndEquipmentData=(areaData)=>({
  type:"AREAANDEQUIPMENT_DATA",
  payload:areaData
})

export const differentialTable=(tabledata)=>({
  type:"DIFERENTIALTABLE_DATA",
  payload:tabledata
})

export const selectRow = (row) => ({
  type: 'SELECT_ROW',
  payload: row,
});

export const temperatureRecord=(temperature)=>({
type:"TEMPERATURE_RECORD_DATA",
payload:temperature
})

export const loggedInUser=(user)=>({
type:"LOGGED-IN-USER",
payload:user
})
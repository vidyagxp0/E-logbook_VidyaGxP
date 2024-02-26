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
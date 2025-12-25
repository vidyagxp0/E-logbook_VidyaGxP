export const MASTER_CONFIG = {
  "Site Master": {
    nestedPath: "siteMasterData",
    fields: [
      { name: "siteName", label: "Site Name" },
      { name: "siteCode", label: "Site Code" },
      
      // {
      //   name: "generalInstructions",
      //   label: "General Instructions",
      //   type: "textarea",
      // },
      // { name: "bmrVersion", label: "BMR Version" },
      // { name: "remarks", label: "Remarks" },
      // { name: "preparedBy", label: "Prepared By" },
      // { name: "checkedBy", label: "Checked By (QA)" },
      // { name: "approvedBy", label: "Approved By (QA Head)" },
      // { name: "totalPages", label: "Total Pages Issued" },
      // { name: "pagesVerified", label: "Page Nos Verified" },
      // { name: "reissueReason", label: "Re-issue Reason" },
    ],
  },

  "API Identification Master": {
    nestedPath: "apiIdentificationData",
    fields: [
      { name: "materialName", label: "Material Name" },
      { name: "sapCode", label: "SAP / Item Code" },
      { name: "arNo", label: "AR No" },
      { name: "lotNo", label: "Lot / Batch No" },
      { name: "retestDate", label: "Retest Date", type: "date" },
      { name: "expiryDate", label: "Expiry Date", type: "date" },
      { name: "containerCount", label: "Container Count" },
      { name: "assayAnhydrous", label: "Assay % (anhydrous)" },
      { name: "waterContent", label: "Water Content %" },
      { name: "residualContent", label: "Residual Content %" },
      { name: "assayAsIs", label: "Assay as-is %" },
      { name: "targetQty", label: "Target Qty (as-is)" },
    ],
  },

  "Excipients Dispensing (Grid) Master": {
    nestedPath: "excipientsDispensingData",
    fields: [
      { name: "materialName", label: "Material Name" },
      { name: "lotNo", label: "Lot / Batch No" },
      { name: "netQty", label: "Net (g)" },
    ],
  },

  "Persons Involved": {
    nestedPath: "personInvolvedData",
    fields: [
      { name: "name", label: "Name" },
      { name: "employeeCode", label: "Employee Code" },
      { name: "department", label: "Department" },
      { name: "roleInBatch", label: "Role in Batch" },
      { name: "consentSignature", label: "Consent Signature" },
    ],
  },

  "Equipment/Instrument Master": {
    nestedPath: "equipmentInstrumentData",
    fields: [
       {
      name: "productCode",
      label: "Product Code",
      type: "select",
      api: {
        url: "http://localhost:1000/Pm-Meter/meter/get-all",          // API endpoint
        valueKey: "pmMeterMasterData.productCode",
    labelKey: "pmMeterMasterData.productCode",     // text shown in dropdown
      },
    },
      { name: "equipmentName", label: "Equipment Name" },
      { name: "equipmentId", label: "Equipment ID" },
      { name: "location", label: "Equipment Location" },
      { name: "site", label: "Equipment Site" },
      { name: "make", label: "Equipment Make" },
      { name: "model", label: "Equipment Model" },
      { name: "calibrationDoneOn", label: "Calibration Done On", type: "date" },
      { name: "calibrationDueOn", label: "Calibration Due On", type: "date" },
    {
  name: "validCalibration",
  label: "Under Valid Calibration?",
  type: "select",
  options: [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ],
},

    ],
  },

  "PM Master": {
  nestedPath: "pmMeterMasterData",
  fields: [
    {
      name: "siteName",
      label: "Site Name",
      type: "select",
      api: {
        url: "http://localhost:1000/site-master/site/get-all",          // API endpoint
        valueKey: "siteMasterData.siteName",
    labelKey: "siteMasterData.siteName",     // text shown in dropdown
      },
    },
{ name: "productName", label: "Product Name" },
      { name: "productCode", label: "Product Code" },
      { name: "strength", label: "Strength" },
      { name: "batchNo", label: "Batch No" },
      { name: "batchSize", label: "Batch Size" },
      { name: "market", label: "Market" },
      { name: "mfgDate", label: "Mfg Date", type: "date" },
      { name: "expiryDate", label: "Expiry Date", type: "date" },
   
  ],
},


  "Connected ElogBook": {
    nestedPath: "connectedElogbookData",
    fields: [
      { name: "areaCleaning", label: "Area Cleaning" },
      { name: "equipmentCleaning", label: "Equipment Cleaning" },
      { name: "equipmentOperations", label: "Equipment Operations" },
      { name: "temperatureRecord", label: "Temperature Record" },
      { name: "pressureRecord", label: "Pressure Differential Record" },
    ],
  },
};

// frontend label -> backend key
export const MASTER_KEY_MAP = {
  "Site Master": "site",
  "API Identification Master": "apiIdentificationData",
  "Excipients Dispensing (Grid) Master": "excipientsDispensingData",
  "Persons Involved": "persons",
  "Equipment/Instrument Master": "equipment",
  "PM Master": "pm",
  "Connected ElogBook": "elogbook",
};

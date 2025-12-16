export const MASTER_CONFIG = {
  "Site Master": {
    fields: [
      { name: "siteName", label: "Site Name" },
      { name: "siteCode", label: "Site Code" },
      { name: "productName", label: "Product Name" },
      { name: "productCode", label: "Product Code" },
      { name: "strength", label: "Strength" },
      { name: "batchNo", label: "Batch No" },
      { name: "batchSize", label: "Batch Size" },
      { name: "market", label: "Market" },
      { name: "mfgDate", label: "Mfg Date", type: "date" },
      { name: "expiryDate", label: "Expiry Date", type: "date" },
      { name: "generalInstructions", label: "General Instructions", type: "textarea" },
      { name: "bmrVersion", label: "BMR Version" },
      { name: "remarks", label: "Remarks" },
      { name: "preparedBy", label: "Prepared By" },
      { name: "checkedBy", label: "Checked By (QA)" },
      { name: "approvedBy", label: "Approved By (QA Head)" },
      { name: "totalPages", label: "Total Pages Issued" },
      { name: "pagesVerified", label: "Page Nos Verified" },
      { name: "reissueReason", label: "Re-issue Reason" },
    ],
  },

  "API Identification Master": {
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
    fields: [
      { name: "materialName", label: "Material Name" },
      { name: "lotNo", label: "Lot / Batch No" },
      { name: "netQty", label: "Net (g)" },
    ],
  },

  "Persons Involved": {
    fields: [
      { name: "name", label: "Name" },
      { name: "employeeCode", label: "Employee Code" },
      { name: "department", label: "Department" },
      { name: "roleInBatch", label: "Role in Batch" },
      { name: "consentSignature", label: "Consent Signature" },
    ],
  },

  "Equipment/Instrument Master": {
    fields: [
      { name: "equipmentName", label: "Equipment Name" },
      { name: "equipmentId", label: "Equipment ID" },
      { name: "location", label: "Equipment Location" },
      { name: "site", label: "Equipment Site" },
      { name: "make", label: "Equipment Make" },
      { name: "model", label: "Equipment Model" },
      { name: "calibrationDoneOn", label: "Calibration Done On", type: "date" },
      { name: "calibrationDueOn", label: "Calibration Due On", type: "date" },
      { name: "validCalibration", label: "Under Valid Calibration?", type: "select" },
    ],
  },

  "PM Master": {
    fields: [
      { name: "pmDoneOn", label: "PM Done On", type: "date" },
      { name: "pmDueOn", label: "PM Due On", type: "date" },
      { name: "validPM", label: "Under Valid PM?", type: "select" },
    ],
  },

  "Connected ElogBook": {
    fields: [
      { name: "areaCleaning", label: "Area Cleaning" },
      { name: "equipmentCleaning", label: "Equipment Cleaning" },
      { name: "equipmentOperations", label: "Equipment Operations" },
      { name: "temperatureRecord", label: "Temperature Record" },
      { name: "pressureRecord", label: "Pressure Differential Record" },
    ],
  },
};

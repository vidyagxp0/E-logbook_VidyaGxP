import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExcelSelectWithTwoDropdowns = () => {
  const defaultProducts = [
    "Default Product 1",
    "Default Product 2",
    "Default Product 3",
  ];
  const defaultBatches = ["B001", "B002", "B003"];
  const defaultlotNo = ["Lot No 1", "Lot No 2", "Lot No 3"];
  const defaultcontrolNo = ["Control No.1", "Control No.2", "Control No.3"];
  const defaultdispensedQuantityKg = [
    "Dispensed Quantity (Kg)	1",
    "Dispensed Quantity (Kg)	2",
    "Dispensed Quantity (Kg)	3",
  ];

  const [products, setProducts] = useState(defaultProducts);
  const [batches, setBatches] = useState(defaultBatches);
  const [lotNo, setLotNo] = useState(defaultlotNo);
  const [controlNo, setControlNo] = useState(defaultcontrolNo);
  const [dispensedQuantityKg, setDispensedQuantityKg] = useState(
    defaultdispensedQuantityKg
  );

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Extract Product Names and Batch Numbers
        const importedProducts = jsonData.map((item) => item["Product Name"]);
        const importedBatches = jsonData.map((item) => item["Batch No"]);
        const importedLotNo = jsonData.map((item) => item["Lot No."]);
        const importedControlNo = jsonData.map((item) => item["Control No."]);
        const importedDispensedQuantityKg = jsonData.map(
          (item) => item["Dispensed Quantity"]
        );

        // Update state with imported data
        setProducts(importedProducts);
        setBatches(importedBatches);
        setLotNo(importedLotNo);
        setControlNo(importedControlNo);
        setDispensedQuantityKg(importedDispensedQuantityKg);
      };

      fileReader.readAsBinaryString(file);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Select Product</h2>
      <select className="border border-gray-300 rounded p-2 mb-4 w-full">
        {products.map((product, index) => (
          <option key={index} value={product}>
            {product}
          </option>
        ))}
      </select>

      <h2 className="text-lg font-semibold mb-2">Select Batch</h2>
      <select className="border border-gray-300 rounded p-2 mb-4 w-full">
        {batches.map((batch, index) => (
          <option key={index} value={batch}>
            {batch}
          </option>
        ))}
      </select>
      <h2 className="text-lg font-semibold mb-2">Select Lot No</h2>
      <select className="border border-gray-300 rounded p-2 mb-4 w-full">
        {lotNo.map((lotno, index) => (
          <option key={index} value={lotno}>
            {lotno}
          </option>
        ))}
      </select>
      <h2 className="text-lg font-semibold mb-2">Select Control No </h2>
      <select className="border border-gray-300 rounded p-2 mb-4 w-full">
        {controlNo.map((controlno, index) => (
          <option key={index} value={controlno}>
            {controlno}
          </option>
        ))}
      </select>
      <h2 className="text-lg font-semibold mb-2">
        Select Dispensed Quantity (Kg){" "}
      </h2>
      <select className="border border-gray-300 rounded p-2 mb-4 w-full">
        {dispensedQuantityKg.map((dispensedQuantitykg, index) => (
          <option key={index} value={dispensedQuantitykg}>
            {dispensedQuantitykg}
          </option>
        ))}
      </select>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mt-2 ml-2"
      />
    </div>
  );
};

export default ExcelSelectWithTwoDropdowns;

import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExcelSelectWithTwoDropdowns = () => {
  const defaultProducts = [
    "Default Product 1",
    "Default Product 2",
    "Default Product 3",
  ];
  const defaultBatches = ["B001", "B002", "B003"];
  const [products, setProducts] = useState(defaultProducts);
  const [batches, setBatches] = useState(defaultBatches);

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

        // Update state with imported data
        setProducts(importedProducts);
        setBatches(importedBatches);
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

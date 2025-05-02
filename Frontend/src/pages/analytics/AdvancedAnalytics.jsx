import React, { useState, useEffect } from "react";
// import BottomHeader from "../Component/BottomHeader";
// import Header from "../Component/Header";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DynamicLineChart from "./DynamicLineChart";
// import {
//   paracetamolAnnotations,
//   ParacetamolAssayPlotLines,
//   paracetamolAssayZones,
//   ParacetamolpHPlotLines,
//   paracetamolpHZones,
//   YieldTrendS1PlotLines,
//   granulationS1,
//   granulationS1_2,
//   granulationS1_3,
//   granulationS1_4,
//   granulationS1_5,
//   granulationS2_1,
//   granulationS2_2,
//   granulationS2_3,
//   granulationS2_4,
//   granulationS2_5,
//   granulationS2_6,
//   granulationS2_7,
//   granulationS3_1,
//   granulationS3_2,
//   granulationS3_3,
//   granulationS3_4,
//   granulationS3_5,
//   granulationS3_6,
//   granulationS3_7,
//   granulationS3_8,
//   granulationS3_9,
//   granulationS3_10,
//   granulationS4_1,
//   granulationS4_2,
//   granulationS4_3,
//   granulationS5_1,
//   granulationS5_2,
//   granulationS5_3,
//   granulationS5_4,
//   granulationS5_5,
//   granulationS6_1,
//   granulationS6_2,
//   granulationS6_3,
//   granulationS6_4,
//   granulationS6_5,
// } from "../Component/Analytics/ChartJsFunction";
// import HighchartsChart from "../Component/Analytics/HighchartsLine";
// import HighchartsLine2 from "../Component/Analytics/HighchartsLine2";
// import HighchartsLine from "../Component/Analytics/HighchartsLine";

// import HighchartsHistogram from "../Component/Analytics/HighchartsHistogram";
// import HighchartsPareto from "../Component/Analytics/HighchartsPareto";
// import HighchartsScatterPlot from "../Component/Analytics/HighchartsScatterPlot";
// import AnalyticsTable from "../Component/Table/AnalyticsTable";
// import ScrollToTop from "../Component/ScrollToTop";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import RangeDatePicker from "./RangeDatePicker";
import { Cascader, Select } from "antd";
// import AdvancedAnalyticsSc from "../Component/AdvancedAnalyticsSc";
import AdvancedAnalyticsTb from "./AdvancedAnalyticsTb";
// import AdvancedAnalyticsDs from "../Component/AdvancedAnalyticsDs";
const { Option } = Select;

function AdvancedAnalytics() {
  document.title = "APQR - Analytics";
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  console.log(filteredData,"filteredData")
  const [statusFilter, setStatusFilter] = useState("");
  const [pqrIdFilter, setPqrIdFilter] = useState({
    dossageForm: "",
    pqrId: "",
  });
  const { dossageForm, pqrId } = pqrIdFilter;
  console.log(pqrIdFilter, "pqrIdFilter");
  const location = useLocation();
  const [tableData, setTableData] = useState([]);
  const [tableDataLoading, setTableDataLoading] = useState(false);
  const [selectedPqrData, setSelectedPqrData] = useState(null); // For data from the id API
  const [gridDatas, setGridDatas] = useState({});
  const [viewLoading, setviewLoading] = useState({});
  const [options, setOptions] = useState([]);
  // console.log(options,"options")
  const pqrIdOptions = filteredData.map((item) => ({
    value: item.pqrId,
    label: item.productName,
  }));
  // console.log(filteredData,"filteredData");

  // Fetch all data initially
  //  function handleSelectedDate(startDate, endDate){
  //     console.log("Start Date:", startDate);
  //     setStartDate(startDate);
  //     setEndDate(endDate);
  //     console.log("End Date:", endDate);
  //   }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      setTableDataLoading(true);
      try {
        const response = await axios.get("https://apqrmedicef-api.mydemosoftware.com/get-all-apqr", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Combine all responses into a single array --->
        const combinedResponse = [
          ...response.data.aPQRData.map((item) => ({
            ...item,
            processName: item.process?.name,
          })),
          ...response.data.aPQRData1.map((item) => ({
            ...item,
            processName: item.processes?.name,
          })),
          ...response.data.aPQRData2.map((item) => ({
            ...item,
            processName: item.processes?.name,
          })),
        ];
    
        setTableData(combinedResponse); // Store all data initially
        setFilteredData(combinedResponse); // Initially set filtered data to all
  
      } catch (error) {
        console.error("There was a problem with the API call:", error);
      } finally {
        setTableDataLoading(false);
      }
    };
  
    fetchData();
  }, [location]);

  // Filter data whenever the startDate or endDate changes
  useEffect(() => {
    if (startDate && endDate) {
      const filtered = tableData.filter((item) => {
        const itemYear = parseInt(item.year, 10);
        const startYear = parseInt(startDate, 10);
        const endYear = parseInt(endDate, 10);
        return itemYear >= startYear && itemYear <= endYear;
      });
    
      setFilteredData(filtered); // Update filtered data state
  
      // Dynamically generate options based on unique process names
      const uniqueProcessNames = [...new Set(filtered.map((item) => item.processName))];
  
      const formattedData = uniqueProcessNames.map((processName) => ({
        value: processName.toLowerCase().replace(/\s+/g, "-"), // Create a safe value
        label: processName,
        children: filtered
          .filter((item) => item.processName === processName)
          .map((item) => ({
            value: item.pqrId,
            label: item.productName,
          })),
      }));
  
      setOptions(formattedData);
    } else {
      setFilteredData(tableData);
  
      // Reset Cascader options to original data
      const uniqueProcessNames = [...new Set(tableData.map((item) => item.processName))];
  
      const formattedData = uniqueProcessNames.map((processName) => ({
        value: processName.toLowerCase().replace(/\s+/g, "-"),
        label: processName,
        children: tableData
          .filter((item) => item.processName === processName)
          .map((item) => ({
            value: item.pqrId,
            label: item.productName,
          })),
      }));
  
      setOptions(formattedData);
    }
  }, [startDate, endDate, tableData]);
  

  // Handle date range selection from RangeDatePicker
  const handleSelectedDate = (start, end) => {
    // setStartDate(start ? new Date(start) : null);
    setStartDate(start ? start : null);
    // setEndDate(end ? new Date(end) : null);
    setEndDate(end ? end : null);
  };

  // Fetch data on pqrIdFilter change
  useEffect(() => {
    const fetchFilteredData = async () => {
      if (!pqrIdFilter?.pqrId) {
        setSelectedPqrData(null);
        return;
      }

      try {
        const apiUrl =
          dossageForm === "dry-syrup"
            ? `https://apqrmedicef-api.mydemosoftware.com/ds/get-apqr/${pqrId}`
            : dossageForm === "sachet"
            ? `https://apqrmedicef-api.mydemosoftware.com/sc/get-apqr/${pqrId}`
            : `https://apqrmedicef-api.mydemosoftware.com/get-apqr/${pqrId}`;

        const response = await axios.get(apiUrl);
        setSelectedPqrData(response.data);
      } catch (error) {
        console.error("There was a problem with the API call:", error);
      }
    };

    fetchFilteredData();
  }, [pqrIdFilter]);

  useEffect(() => {
    // console.log(selectedPqrData, "selectedPqrData");
    if (selectedPqrData) {
      setGridDatas(selectedPqrData.gridDatas);
    }
  }, [selectedPqrData]);
  useEffect(() => {
    // console.log(gridDatas, "gridDatas");
  }, [gridDatas]);

  const handlePqrIdChange = (dossageForm, pqrId) => {
    console.log(dossageForm, pqrId, "ddd", "iddd");
    setPqrIdFilter({ dossageForm, pqrId });
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const filteredTableData = tableData.filter((item) =>
    statusFilter ? item.status === statusFilter : true
  );

  const yieldTrendS1Data = gridDatas?.yieldTOS1?.data?.map((item) => {
    return {
      "Batch No.": item?.batchNo,
      "Observed Value": Number(item?.actualOutput),
    };
  });

  const [cppBatchNo, setCppBatchNo] = useState([]);
  // console.log(cppBatchNo, "cppBatchNo111");
  useEffect(() => {
    setCppBatchNo(gridDatas?.manufacturingPartStageI?.data);
  }, [gridDatas]);

  // console.log(gridDatas?.manufacturingPartStageI?.data, "hell");

  const granulationS1Data = gridDatas?.manufacturingPartStageI?.data?.map(
    (item) => {
      return {
        "Batch No.": item.batchNo,
        "Observed Value": Number(item.amoxicillin) || Number(item.ERH),
      };
    }
  );
  const granulationS1Data5 = gridDatas?.manufacturingPartStageI?.data?.map(
    (item) => {
      return {
        "Batch No.": item.batchNo,
        "Observed Value": Number(item.oscillatingGrabulatorMachineSpeed),
      };
    }
  );

  const granulationS1Data2a = gridDatas?.manufacturingPartStageI?.data?.map(
    (item) => {
      return {
        "Batch No.": item.batchNo,
        "Observed Value": Number(item.averageMinimum),
      };
    }
  );
  const granulationS1Data2b = gridDatas?.manufacturingPartStageI?.data?.map(
    (item) => {
      return {
        "Batch No.": item.batchNo,
        "Observed Value": Number(item.averageMaximum),
        // "avgs Avg Weight": Number(item.averageMaximum),
      };
    }
  );

  const granulationS1Data3a = gridDatas?.manufacturingPartStageI?.data?.map(
    (item) => {
      return {
        "Batch No.": item.batchNo,
        "Observed Value": Number(item.hardnessMinimum),
      };
    }
  );
  const granulationS1Data3b = gridDatas?.manufacturingPartStageI?.data?.map(
    (item) => {
      return {
        "Batch No.": item.batchNo,
        "Observed Value": Number(item.hardnessMaximum),
      };
    }
  );

  const granulationS1Data2 = gridDatas?.manufacturingPartStageI?.data?.map(
    (item) => {
      return {
        "Batch No.": item.batchNo,
        "Max Avg Weight": Number(item.averageMaximum),
        "Min Avg Weight": Number(item.averageMinimum),
        // "avgs Avg Weight": Number(item.averageMaximum),
      };
    }
  );
  const granulationS1Data3 = gridDatas?.manufacturingPartStageI?.data?.map(
    (item) => {
      return {
        "Batch No.": item.batchNo,
        "Max Hardness": Number(item.hardnessMaximum),
        "Min Hardness": Number(item.hardnessMinimum),
      };
    }
  );
  const granulationS2Data = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Wt LHS": Number(item.innerLHS),
        "Wt RHS": Number(item.innerRHS),
      };
    }
  );
  const granulationS2Data2 = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Wt LHS": Number(item.innerLHS1),
        "Wt RHS": Number(item.innerRHS1),
      };
    }
  );
  const granulationS2Data3 = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Min LHS Hardness": Number(item.innerMin2),
        "Max LHS Hardness": Number(item.innerMax2),
        "Min RHS Hardness": Number(item.innerMin3),
        "Max RHS Hardness": Number(item.innerMax3),
      };
    }
  );
  const granulationS2Data4 = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Min LHS Hardness": Number(item.innerMin4),
        "Max LHS Hardness": Number(item.innerMax4),
        "Min RHS Hardness": Number(item.innerMin5),
        "Max RHS Hardness": Number(item.innerMax5),
      };
    }
  );
  const granulationS2Data5 = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Min LHS Hardness": Number(item.innerMin6),
        "Min LHS Hardness": Number(item.innerMax6),
        "Min RHS Hardness": Number(item.innerMin7),
        "Min RHS Hardness": Number(item.innerMax7),
      };
    }
  );
  const granulationS2Data6 = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Min LHS Hardness": Number(item.innerMin8),
        "Min LHS Hardness": Number(item.innerMin8),
        "Min RHS Hardness": Number(item.innerMin9),
        "Min RHS Hardness": Number(item.innerMin9),
      };
    }
  );
  const granulationS2Data7 = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Min LHS Hardness": Number(item.innerMin),
        "Max LHS Hardness": Number(item.innerMax),
        "Min RHS Hardness": Number(item.innerMin1),
        "Max RHS Hardness": Number(item.innerMax1),
      };
    }
  );

  const granulationS2Dataa = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerLHS),
        // "Wt RHS": Number(item.innerRHS),
      };
    }
  );
  const granulationS2Datab = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Wt LHS": Number(item.innerLHS),
        "Observed Value": Number(item.innerRHS),
      };
    }
  );

  const granulationS2Data2a = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerLHS1),
        // "Wt RHS": Number(item.innerRHS1),
      };
    }
  );
  const granulationS2Data2b = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Wt LHS": Number(item.innerLHS1),
        "Observed Value": Number(item.innerRHS1),
      };
    }
  );

  const granulationS2Data3a = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin2),
        // "Max LHS Hardness": Number(item.innerMax2),
        // "Min RHS Hardness": Number(item.innerMin3),
        // "Max RHS Hardness": Number(item.innerMax3),
      };
    }
  );
  const granulationS2Data3b = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Hardness": Number(item.innerMin2),
        "Observed Value": Number(item.innerMax2),
        // "Min RHS Hardness": Number(item.innerMin3),
        // "Max RHS Hardness": Number(item.innerMax3),
      };
    }
  );
  const granulationS2Data3c = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Hardness": Number(item.innerMin2),
        // "Max LHS Hardness": Number(item.innerMax2),
        "Observed Value": Number(item.innerMin3),
        // "Max RHS Hardness": Number(item.innerMax3),
      };
    }
  );
  const granulationS2Data3d = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Hardness": Number(item.innerMin2),
        // "Max LHS Hardness": Number(item.innerMax2),
        // "Min RHS Hardness": Number(item.innerMin3),
        "Observed Value": Number(item.innerMax3),
      };
    }
  );

  const granulationS2Data4a = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin4),
        //   "Max LHS Thickness": Number(item.innerMax4),
        //   "Min RHS Thickness": Number(item.innerMin5),
        //   "Max RHS Thickness": Number(item.innerMax5),
      };
    }
  );
  const granulationS2Data4b = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Thickness": Number(item.innerMin4),
        "Observed Value": Number(item.innerMax4),
        // "Min RHS Thickness": Number(item.innerMin5),
        // "Max RHS Thickness": Number(item.innerMax5),
      };
    }
  );

  const granulationS2Data4c = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Thickness": Number(item.innerMin4),
        // "Max LHS Thickness": Number(item.innerMax4),
        "Observed Value": Number(item.innerMin5),
        // "Max RHS Thickness": Number(item.innerMax5),
      };
    }
  );
  const granulationS2Data4d = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Thickness": Number(item.innerMin4),
        // "Max LHS Thickness": Number(item.innerMax4),
        // "Min RHS Thickness": Number(item.innerMin5),
        "Observed Value": Number(item.innerMax5),
      };
    }
  );
  const granulationS2Data5a = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin6),
        // "Max LHS Friability": Number(item.innerMax6),
        // "Min RHS Friability": Number(item.innerMin7),
        // "Max RHS Friability": Number(item.innerMax7),
      };
    }
  );
  const granulationS2Data5b = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Friability": Number(item.innerMin6),
        "Observed Value": Number(item.innerMax6),
        // "Min RHS Friability": Number(item.innerMin7),
        // "Max RHS Friability": Number(item.innerMax7),
      };
    }
  );
  const granulationS2Data5c = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Friability": Number(item.innerMin6),
        // "Max LHS Friability": Number(item.innerMax6),
        "Observed Value": Number(item.innerMin7),
        // "Max RHS Friability": Number(item.innerMax7),
      };
    }
  );
  const granulationS2Data5d = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Friability": Number(item.innerMin6),
        // "Max LHS Friability": Number(item.innerMax6),
        // "Min RHS Friability": Number(item.innerMin7),
        "Observed Value": Number(item.innerMax7),
      };
    }
  );
  const granulationS2Data6a = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin8),
        // "Max LHS DT": Number(item.innerMax8),
        // "Min RHS DT": Number(item.innerMin9),
        // "Max RHS DT": Number(item.innerMax9),
      };
    }
  );
  const granulationS2Data6b = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS DT": Number(item.innerMin8),
        "Observed Value": Number(item.innerMax8),
        // "Min RHS DT": Number(item.innerMin9),
        // "Max RHS DT": Number(item.innerMax9),
      };
    }
  );
  const granulationS2Data6c = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS DT": Number(item.innerMin8),
        // "Max LHS DT": Number(item.innerMax8),
        "Observed Value": Number(item.innerMin9),
        // "Max RHS DT": Number(item.innerMax9),
      };
    }
  );
  const granulationS2Data6d = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS DT": Number(item.innerMin8),
        // "Max LHS DT": Number(item.innerMax8),
        // "Min RHS DT": Number(item.innerMin9),
        "Observed Value": Number(item.innerMax9),
      };
    }
  );
  const granulationS2Data7a = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin),
        // "Max LHS Uniformity": Number(item.innerMax),
        // "Min RHS Uniformity": Number(item.innerMin1),
        // "Max RHS Uniformity": Number(item.innerMax1),
      };
    }
  );
  const granulationS2Data7b = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Uniformity": Number(item.innerMin),
        "Observed Value": Number(item.innerMax),
        // "Min RHS Uniformity": Number(item.innerMin1),
        // "Max RHS Uniformity": Number(item.innerMax1),
      };
    }
  );
  const granulationS2Data7c = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Uniformity": Number(item.innerMin),
        // "Max LHS Uniformity": Number(item.innerMax),
        "Observed Value": Number(item.innerMin1),
        // "Max RHS Uniformity": Number(item.innerMax1),
      };
    }
  );
  const granulationS2Data7d = gridDatas?.manufacturingPartStageII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Uniformity": Number(item.innerMin),
        // "Max LHS Uniformity": Number(item.innerMax),
        // "Min RHS Uniformity": Number(item.innerMin1),
        "Observed Value": Number(item.innerMax1),
      };
    }
  );

  const granulationS3Data1a = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMinR1),
        // "Max Inlet Temp": Number(item.innerMaxR1),
      };
    }
  );
  const granulationS3Data1b = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min Inlet Temp": Number(item.innerMinR1),
        "Observed Value": Number(item.innerMaxR1),
      };
    }
  );
  const granulationS3Data2a = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMinR2),
        // "Max Outlet Temp": Number(item.innerMaxR2),
      };
    }
  );
  const granulationS3Data2b = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min Outlet Temp": Number(item.innerMinR2),
        "Observed Value": Number(item.innerMaxR2),
      };
    }
  );
  const granulationS3Data3 = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.atomizationAirPressure),
      };
    }
  );
  const granulationS3Data4a = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMinR4),
        // "Max Uniformity": Number(item.innerMaxR4),
      };
    }
  );
  const granulationS3Data4b = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min Uniformity": Number(item.innerMinR4),
        "Observed Value": Number(item.innerMaxR4),
      };
    }
  );
  const granulationS3Data5a = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMinR5),
        // "Observed Value": Number(item.innerMaxR5),
      };
    }
  );
  const granulationS3Data5b = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMinR5),
        "Observed Value": Number(item.innerMaxR5),
      };
    }
  );
  const granulationS3Data6a = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMinR6),
        // "Observed Value": Number(item.innerMaxR6),
      };
    }
  );
  const granulationS3Data6b = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMinR6),
        "Observed Value": Number(item.innerMaxR6),
      };
    }
  );
  const granulationS3Data7a = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMinR7),
        // "Observed Value": Number(item.innerMaxR7),
      };
    }
  );
  const granulationS3Data7b = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMinR7),
        "Observed Value": Number(item.innerMaxR7),
      };
    }
  );
  const granulationS3Data8a = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMinR8),
        // "Observed Value": Number(item.innerMaxR8),
      };
    }
  );
  const granulationS3Data8b = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMinR8),
        "Observed Value": Number(item.innerMaxR8),
      };
    }
  );
  const granulationS3Data9a = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMinR9),
        // "Observed Value": Number(item.innerMaxR9),
      };
    }
  );
  const granulationS3Data9b = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMinR9),
        "Observed Value": Number(item.innerMaxR9),
      };
    }
  );
  const granulationS3Data10 = gridDatas?.manufacturingPartStageIII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.ERHNMT),
      };
    }
  );
  const granulationS4Data1a = gridDatas?.manufacturingPartStageIV?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin10),
        // "Observed Value": Number(item.innerMax10),
      };
    }
  );
  const granulationS4Data1b = gridDatas?.manufacturingPartStageIV?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMin10),
        "Observed Value": Number(item.innerMax10),
      };
    }
  );
  const granulationS4Data2a = gridDatas?.manufacturingPartStageIV?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin11),
        // "Observed Value": Number(item.innerMax11),
      };
    }
  );
  const granulationS4Data2b = gridDatas?.manufacturingPartStageIV?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMin11),
        "Observed Value": Number(item.innerMax11),
      };
    }
  );
  const granulationS4Data3 = gridDatas?.manufacturingPartStageIV?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.vacuum710),
      };
    }
  );
  const granulationS5Data1a = gridDatas?.packingPartCriticalStageVII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin17),
        // "Observed Value": Number(item.innerMax17),
      };
    }
  );
  const granulationS5Data1b = gridDatas?.packingPartCriticalStageVII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMin17),
        "Observed Value": Number(item.innerMax17),
      };
    }
  );
  const granulationS5Data2a = gridDatas?.packingPartCriticalStageVII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin18),
        // "Observed Value": Number(item.innerMax18),
      };
    }
  );
  const granulationS5Data2b = gridDatas?.packingPartCriticalStageVII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMin18),
        "Observed Value": Number(item.innerMax18),
      };
    }
  );
  const granulationS5Data3a = gridDatas?.packingPartCriticalStageVII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin19),
        // "Observed Value": Number(item.innerMax19),
      };
    }
  );
  const granulationS5Data3b = gridDatas?.packingPartCriticalStageVII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMin19),
        "Observed Value": Number(item.innerMax19),
      };
    }
  );
  const granulationS5Data4a = gridDatas?.packingPartCriticalStageVII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin20),
        // "Observed Value": Number(item.innerMax20),
      };
    }
  );
  const granulationS5Data4b = gridDatas?.packingPartCriticalStageVII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMin20),
        "Observed Value": Number(item.innerMax20),
      };
    }
  );
  const granulationS5Data5a = gridDatas?.packingPartCriticalStageVII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin21),
        // "Observed Value": Number(item.innerMax21),
      };
    }
  );
  const granulationS5Data5b = gridDatas?.packingPartCriticalStageVII?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMin21),
        "Observed Value": Number(item.innerMax21),
      };
    }
  );
  const granulationS6Data1 = gridDatas?.manufacturingPartStageV?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        Value: Number(item.granulationYield),
      };
    }
  );
  const granulationS6Data2 = gridDatas?.manufacturingPartStageV?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        Value: Number(item.compressionYield),
      };
    }
  );
  const granulationS6Data3 = gridDatas?.manufacturingPartStageV?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        Value: Number(item.coatingYield),
      };
    }
  );

  const granulationS6Data4 = gridDatas?.manufacturingPartStageV?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        Value: Number(item.insepectionYield),
      };
    }
  );
  const granulationS6Data5 = gridDatas?.manufacturingPartStageV?.data?.map(
    (item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        Value: Number(item.packingYield),
      };
    }
  );

  const phChartsConfig = {
    data: [
      1.65, 2.7, 3.4, 4.1, 2.2, 2.8, 3.3, 4.0, 1.75, 2.9, 3.5, 4.05, 2.1, 2.85,
      3.2, 4.15, 1.8, 2.75, 3.45, 4.0, 2.25, 2.95, 3.35, 4.1, 1.9, 2.8, 3.5,
      4.05, 2.0, 2.9, 3.3, 4.0, 1.7, 2.85, 3.45, 4.1, 2.15, 2.9, 3.25, 4.0,
      1.85, 2.8, 3.4, 4.05, 2.3, 2.95, 3.5, 4.1, 1.75, 2.85, 3.4, 3.9, 3.4,
    ],
    lsl: 2,
    usl: 4,
    histoHeading: "Histogram Analysis",
    paretoHeading: "Pareto Analysis",
    scatterHeading: "Scatter Analysis",
    yAxisTitle: "Number of Batches",
    xAxisTitle: "pH Range",
    xAxisTitleScatter: "Batch Number",
    bins: { "1-2": 0, "2-3": 0, "3-4": 0, "4-5": 0 },
    plotLines: [
      { position: 0.5, label: "LSL", align: "right" },
      { position: 2.5, label: "USL", align: "left" },
    ],
  };
  const paracetamolpHData = gridDatas?.reviewODSTR?.data?.map((item) => {
    return { "Batch No.": item.batchNo, "Observed Value": item.observedValue };
  });
  const getGraphData = (inputData) => {
    const outputData = {
      batchNumbers: [],
      observedValues: [],
    };

    inputData?.forEach((item) => {
      outputData.batchNumbers.push(item.batchNo);
      outputData.observedValues.push(parseFloat(item.observedValue));
    });

    return outputData;
  };
  const paracetamolpHDataH = getGraphData(gridDatas.reviewODSTR?.data);
  const granulationS1Dataa = getGraphData(
    gridDatas.manufacturingPartStageI?.data
  );
  // const granulationS2Dataa = getGraphData(
  //   gridDatas.manufacturingPartStageII?.data
  // );
  // console.log(granulationS1Dataa, "granulationS1Dataa");

  const assayChartsConfig = {
    data: [
      1.65, 2.7, 3.4, 4.1, 2.2, 2.8, 3.3, 4.0, 1.75, 2.9, 3.5, 4.05, 2.1, 2.85,
      3.2, 4.15, 1.8, 2.75, 3.45, 4.0, 2.25, 2.95, 3.35, 4.1, 1.9, 2.8, 3.5,
      4.05, 2.0, 2.9, 3.3, 4.0, 1.7, 2.85, 3.45, 4.1, 2.15, 2.9, 3.25, 4.0,
      1.85, 2.8, 3.4, 4.05, 2.3, 2.95, 3.5, 4.1, 1.75, 2.85, 3.4, 3.9, 3.4,
    ],
    lsl: 95,
    usl: 105,
    histoHeading: "Histogram Analysis",
    paretoHeading: "Pareto Analysis",
    scatterHeading: "Scatter Analysis",
    yAxisTitle: "Number of Batches",
    xAxisTitle: "pH Range",
    xAxisTitleScatter: "Batch Number",
    bins: {
      "80-95": 0,
      "95-100": 0,
      "100-105": 0,
      "105-120": 0,
    },
    plotLines: [
      { position: 0.5, label: "LSL", align: "right" },
      { position: 2.5, label: "USL", align: "left" },
    ],
    max: 120,
  };
  const paracetamolpHData2 = gridDatas?.reviewODSTR2?.data?.map((item) => {
    return { "Batch No.": item.batchNo, "Observed Value": item.observedValue };
  });
  const paracetamolAssayData = getGraphData(gridDatas.reviewODSTR2?.data);
  const user = JSON.parse(localStorage.getItem("user"));
  const openChatPdf = async (pqrIdFilter) => {
    // console.log(dossageForm,pqrId,"pqrid","dossage")
    setviewLoading((prevLoading) => ({
      ...prevLoading,
      [`${pqrId}_${dossageForm}`]: true,
    }));
    try {
      const Url =
        dossageForm === "dry-syrup"
          ? `https://apqrmedicef-api.mydemosoftware.com/report-ds/graph-pdf/${pqrId}/${user.name}`
          : dossageForm === "sachet"
          ? `https://apqrmedicef-api.mydemosoftware.com/report-sc/graph-pdf/${pqrId}/${user.name}`
          : `https://apqrmedicef-api.mydemosoftware.com/report/graph-pdf/${pqrId}/${user.name}`;

      const response = await axios.get(Url);
      const { filename } = await response.data;
      const reportUrl = `/view-report?pqrId=${pqrId}&filename=${filename}`;
      // console.log(reportUrl, "reportUrl");
      window.open(reportUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening chat pdf PDF:", error);
    }
    setviewLoading((prevLoading) => ({
      ...prevLoading,
      [`${pqrId}_${dossageForm}`]: false,
    }));
  };

  return (
    <>
      {/* <Header /> */}
      {/* <ScrollToTop position={false} /> */}
      {/* <BottomHeader /> */}
      <div
        className="container mt-5 mb-10 w-auto mx-auto min-h-[75vh] scrollbar-custom overflow-y-auto"
        style={{ width: "100%", maxWidth: "98%" }}
      >
        <div className="mb-4">
          <div className="text-center text-gray-500 mt-10">
            <div className="flex justify-evenly gap-4">
              {/* <Select
                value={pqrIdFilter || undefined}
                onChange={handlePqrIdChange}
                placeholder="Select Product Name"
                style={{
                  width: "500px",
                  boxShadow: "0 2px 4px rgb(37, 99, 234, 0.5)",
                  border: "2px solid #2563EA",
                  borderRadius: "8px",
                  height: "35px",
                  fontWeight: "600",
                }}
                showSearch
                optionFilterProp="children"
                dropdownStyle={{
                  maxHeight: 263,
                  overflowY: "auto",
                }}
              >
                {pqrIdOptions.map((option) => (
                  <Option font key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select> */}
              <Cascader
                options={options}
                placeholder="Select Dosage Form & Product Name"
                style={{
                  width: "500px",
                  boxShadow: "0 2px 4px rgb(37, 99, 234, 0.5)",
                  border: "2px solid #2563EA",
                  borderRadius: "8px",
                  height: "35px",
                  fontWeight: "600",
                }}
                dropdownStyle={{
                  maxWidth: "auto",
                  minWidth: "500px",
                  textAlign: "left",
                  overflowX: "hidden", // Enables horizontal scrolling
                  overflowY: "auto", // Ensures vertical scrolling if needed
                  whiteSpace: "wrap", // Prevents text wrapping inside options
                  maxHeight: "300px", // Ensures dropdown does not get too tall
                }}
                dropdownMatchSelectWidth={false}
                onChange={(value) => {
                  if (value?.length === 2) {
                    const [dossageForm, productId] = value;
                    handlePqrIdChange(dossageForm, productId);
                  } else {
                    handlePqrIdChange(null, null);
                  }
                }}
              />

              <div className="relative z-0">
                <RangeDatePicker handleSelectedDate={handleSelectedDate} />
              </div>
            </div>
          </div>
        </div>

        {selectedPqrData && (
          <div className="mt-5">
            {/* <h2 className="text-lg font-semibold">Selected PQR Details</h2> */}
            <div className="flex justify-end text-end mt-0 mb-3">
              <button
                className="p-[6px] border border-gray-800 rounded flex gap-2 items-center bg-slate-200"
                onClick={() => openChatPdf(pqrIdFilter)}
                disabled={viewLoading[`${pqrId}_${dossageForm}`]}
              >
                View Report
                {viewLoading[`${pqrId}_${dossageForm}`] ? (
                  <svg
                    className="animate-spin h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                    ></path>
                  </svg>
                ) : (
                  <BsFillFileEarmarkPdfFill />
                )}
              </button>
            </div>
            {selectedPqrData ? (
              pqrIdFilter.dossageForm === "tablet" ? (
                <AdvancedAnalyticsTb data={selectedPqrData} />
              ) 
            //   : pqrIdFilter.dossageForm === "sachet" ? (
            //     <AdvancedAnalyticsSc data={selectedPqrData} />
            //   ) : pqrIdFilter.dossageForm === "dry-syrup" ? (
            //     <AdvancedAnalyticsDs data={selectedPqrData} />
            //   ) 
              : null
            ) : (
              <div className="text-center mt-28">
                <h2 className="font-sans text-2xl font-semibold text-blue-600">
                  Select Dosage Form & Product Name
                </h2>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default AdvancedAnalytics;

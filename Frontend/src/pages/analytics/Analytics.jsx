import { useEffect, useState } from "react";
import HeaderTop from "../../components/Header/HeaderTop";
import HeaderBottom from "../../components/Header/HeaderBottom";
import { Select } from "antd";
import RangeDatePicker from "./RangeDatePicker";
import DynamicLineChart from "./DynamicLineChart";

export default function Analytics() {
  const [selectedChartType, setSelectedChartType] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState([new Date(), new Date()]); // Set today's date as default
  const [graphData, setGraphData] = useState([]);
  const [plotLines, setPlotLines] = useState({});

  const dummyData = {
    differential_pressure: [
      { "Batch No.": "DPR001", "Observed Value": 40 },
      { "Batch No.": "DPR002", "Observed Value": 50 },
      { "Batch No.": "DPR003", "Observed Value": 30 },
      { "Batch No.": "DPR004", "Observed Value": 20 },
      { "Batch No.": "DPR005", "Observed Value": 50 },
    ],
    temperature_pressure: [
      { "Batch No.": "TP001", "Observed Value": 25 },
      { "Batch No.": "TP002", "Observed Value": 28 },
      { "Batch No.": "TP003", "Observed Value": 22 },
      { "Batch No.": "TP004", "Observed Value": 26 },
      { "Batch No.": "TP005", "Observed Value": 29 },
    ],
  };

  const plotLineMeta = {
    differential_pressure: {
      lsl: "6",
      usl: "8",
      minY: "2",
      maxY: "10",
      tickInterval: "2",
    },
    temperature_pressure: {
      lsl: "3",
      usl: "6",
      minY: "2",
      maxY: "7",
      tickInterval: "1",
    },
  };

  const dataGraphS1DG = {
    amoxicillin: { lsl: "25", usl: "40", minY: "10", maxY: "60", tickInterval: "5" },
  };

  const dataGraphS1DG1 = {
    amoxicillin: { lsl: "23", usl: "27", minY: "15", maxY: "35", tickInterval: "3" },
  };

  const handleSelectedDate = ([startDate, endDate]) => {
    setSelectedDateRange([startDate, endDate]);
  };

  const fetchGraphDataByDateRange = async (chartType, startDate, endDate) => {
    return dummyData[chartType] || [];
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedChartType && selectedDateRange.length === 2 && selectedDateRange[0] && selectedDateRange[1]) {
        const [startDate, endDate] = selectedDateRange;
        const data = await fetchGraphDataByDateRange(selectedChartType, startDate, endDate);
        setGraphData(data);
        setPlotLines(plotLineMeta[selectedChartType] || {});
      }
    };

    fetchData();
  }, [selectedChartType, selectedDateRange]);

  return (
    <div>
      <HeaderTop />
      <HeaderBottom />

      {/* <div style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "1rem" }}>
        <Select
          placeholder="Select Chart Type"
          style={{
            width: "300px",
            boxShadow: "0 2px 4px rgb(37, 99, 234, 0.5)",
            border: "2px solid #2563EA",
            borderRadius: "8px",
            height: "35px",
            fontWeight: "600",
          }}
          onChange={(value) => setSelectedChartType(value)}
          options={[
            { label: "Differential Pressure", value: "differential_pressure" },
            { label: "Temperature Pressure", value: "temperature_pressure" },
          ]}
        />

        <RangeDatePicker handleSelectedDate={handleSelectedDate} />
      </div> */}

      {/* Only render the chart when both chart type and date range are selected */}
      {/* {selectedChartType && selectedDateRange[0] && selectedDateRange[1] && graphData.length > 0 && (
        <DynamicLineChart
          heading={
            selectedChartType === "differential_pressure"
              ? "Differential Pressure"
              : "Temperature Pressure"
          }
          xHeading="Batch No."
          yHeading="Assay"
          uslName="Upper Limit"
          lslName="Lower Limt"
          fieldName={"amoxicillin"}
          plotLines={selectedChartType === "differential_pressure" ? dataGraphS1DG : dataGraphS1DG1}
          highchartData={graphData}
          fromCPP={true}
        />
      )} */}
      <div className="flex items-center justify-center h-screen animate-fadeIn">
  <h1 className="text-4xl font-bold text-center text-blue-700">
    Will be available in the final version
  </h1>
</div>
    </div>
  );
}

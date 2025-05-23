import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_more from "highcharts/highcharts-more";
import HC_exporting from "highcharts/modules/exporting";
import HC_exportData from "highcharts/modules/export-data";
import zIndex from "@mui/material/styles/zIndex";

HC_more(Highcharts);
HC_exporting(Highcharts);
HC_exportData(Highcharts);

const calculateStandardDeviation = (values) => {
  const mean = values.reduce((acc, val) => acc + parseFloat(val), 0) / values.length;
  const variance =
    values.reduce((acc, val) => acc + Math.pow(parseFloat(val) - mean, 2), 0) /
    values.length;
  return Math.sqrt(variance);
};
const DynamicLineChart = ({
  heading,
  xHeading,
  yHeading,
  uslName,
  lslName,
  yTickInterval,
  plotLines,
  annotations,
  zones,
  highchartData,
  fromCPP = false,
  extraLines = false,
  fieldName,
}) => {
  const [selectedOption, setSelectedOption] = useState("hourly");
  const [loading, setLoading] = useState(true);
  const [sigmaLimits, setSigmaLimits] = useState({ sigmaPlus3: null, sigmaMinus3: null });
  // console.log(highchartData,"highchartData");
  const filteredPlotlines =
    plotLines.length > 0 ? JSON.parse(plotLines) : plotLines;
  // console.log(filteredPlotlines, "plotLines");
  // console.log(fieldName, "fieldName");
  const yMIN = Number(filteredPlotlines?.[fieldName]?.minY);
  const yMAX = Number(filteredPlotlines?.[fieldName]?.maxY);
  const tickInterval = Number(filteredPlotlines?.[fieldName]?.tickInterval);
  // console.log(yMIN, yMAX, "yMIN,yMAX");

  const processData = () => {
    return highchartData
      ?.map((record) => {
        const batchNo = record["Batch No."];
        let batchNumber;

        if (fromCPP) {
          batchNumber = batchNo;
        } else if (typeof batchNo === "string") {
          batchNumber = batchNo.replace(/\D+/g, ""); // Keep only numeric parts
        } else {
          batchNumber = null; // Fallback if batchNo is not a string
        }

        if (batchNumber) {
          return {
            originalBatchNo: batchNo, // Keep full batch number with alphabets
            x: parseInt(batchNumber, 10), // x-axis uses numeric part for plotting
            y: parseFloat(record["Observed Value"]), // Use float to handle decimals
          };
        }
        return null;
      })
      .filter(Boolean); // Remove any null entries
  };

  const data = processData() || [];
  // console.log(data,"data")
  const calculateSigmaLimits = (data) => {
    // console.log(data,"dataatOFSigma")
    if (!data || data.length === 0) return { sigmaPlus3: null, sigmaMinus3: null };
    const values = data
    .map((d) => d.y)
    .filter((y) => y !== null && y !== undefined && !isNaN(y));
    // console.log(values,"values");
    // If after filtering, no valid values exist, return null for both limits
  if (values.length === 0) return { sigmaPlus3: null, sigmaMinus3: null };
    const avg = values.reduce((acc, val) => acc + parseFloat(val), 0) / values.length;
    const stdDev = calculateStandardDeviation(values);
    return {
      sigmaPlus3: avg + 3 * stdDev,
      sigmaMinus3: avg - 3 * stdDev,
    };
  };
  
  // const calculateSigmaLimits = (data, fields) => {
  //   // Step 1: Combine all relevant values
  //   console.log(data,"Rupesh");
    
  //   const combinedValues = data.flatMap((record) =>
  //     fields.map((field) => parseFloat(record[field])).filter((val) => !isNaN(val))
  //   );
  //   console.log(combinedValues,"combinedValues")
  //   // Step 2: Calculate Average
  //   if (combinedValues.length === 0) return { sigmaPlus3: null, sigmaMinus3: null };
  //   const average = combinedValues.reduce((acc, val) => acc + val, 0) / combinedValues.length;
  //   console.log(average,"average");
  
  //   // Step 3: Calculate Standard Deviation
  //   const stdDev = Math.sqrt(
  //     combinedValues.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) /
  //       combinedValues.length
  //   );
  //   // console.log(stdDev,"stdDev");

  //   // Step 4: Calculate Sigma Limits
  //   return {
  //     sigmaPlus3: average + 3 * stdDev,
  //     sigmaMinus3: average - 3 * stdDev,
  //   };
  // };
  // const fields = Object.keys(highchartData[0]).filter((key) => key !== "Batch No.");
  
  // console.log(fields,"Fields");
  
  useEffect(() => {
    const limits = calculateSigmaLimits(data);
    // console.log(limits,"limits");
    setSigmaLimits(limits);
  }, [highchartData]);

// console.log(sigmaLimits.sigmaMinus3,"sigmaLimits.sigmaMinus3")
// console.log(sigmaLimits.sigmaPlus3,"sigmaLimits.sigmaPlus3")

  const getPlotLines = [
    {
      value: filteredPlotlines?.[fieldName]?.usl,
      color: "red",
      width: 2,
      dashStyle: "Line",
      label: {
        text: uslName + " " + filteredPlotlines?.[fieldName]?.usl,
        style: { color: "black", fontWeight: "bold" },
      },
    },
    {
      value: (sigmaLimits.sigmaPlus3)?.toFixed(2),
      color: "orange",
      width: 2,
      dashStyle: "Line",
      label: {
        text: "+ 3 Sigma" + " " + "(" + (sigmaLimits.sigmaPlus3)?.toFixed(2) + ")",
        style: { color: "orange", fontWeight: "bold", marginLeft: "10px" },
        x: 150,
      },
    },
    {
      value: (sigmaLimits.sigmaMinus3)?.toFixed(2),
      color: "orange",
      width: 2,
      dashStyle: "Line",
      label: {
        text: "-3 Sigma" + " " + "(" + (sigmaLimits.sigmaMinus3)?.toFixed(2) + ")",
        style: { color: "orange", fontWeight: "bold", marginLeft: "10px" },
        x: 150,
        y:12,
      },
    },
    {
      value: filteredPlotlines?.[fieldName]?.lsl,
      color: "red",
      width: 2,
      dashStyle: "Line",
      label: {
        text: lslName + " " + filteredPlotlines?.[fieldName]?.lsl,
        style: { color: "black", fontWeight: "bold" },
        y: 13,
      },
    },

    {
      value: 0,
      color: "black",
      width: 1,
      label: { text: "0", style: { color: "black", fontWeight: "bold" } },
    },
  ];

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  
  const processExtraSeries = () => {
    const keys = highchartData?.[0]
      ? Object.keys(highchartData[0]).filter(
          (key) => key !== "Batch No." && key !== "Observed Value"
        )
      : [];

    return keys.map((key) => ({
      name: key,
      data: highchartData.map((record) => ({
        name: record["Batch No."], // Batch No for tooltip
        y: parseFloat(record[key]), // Use numeric value for Y
      })),
      type: "line",
      lineWidth: 2,
      marker: {
        enabled: true,
      },
    }));
  };

  const extraSeries = processExtraSeries();

  const options = {
    chart: {
      type: "line",
      zoomType: "x",
      height: fromCPP ? 500 : 355,
      panning: true,
      panKey: "ctrl",
      // scrollablePlotArea: {
      //   minWidth: 3000,
      //   scrollPositionX: 0,
      // },
    },
    title: {
      text: heading,
      style: {
        fontSize: "28px",
        fontWeight: "bold",
        color: "#3c7dbd",
      },
    },
    xAxis: {
      title: {
        text: xHeading,
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
      categories: data.map((point) => point.originalBatchNo), // Map batch numbers
      tickInterval: 1, // Adjust spacing between batch numbers
      labels: {
        formatter: function () {
          return this.value; // Display batch numbers
        },
      },
    },
    yAxis: {
      title: {
        text: yHeading,
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
      min: yMIN,
      max: yMAX,
      tickInterval: tickInterval,
      allowDecimals: true,
      plotLines: getPlotLines,
      labels: {
        step: 1,
        style: {
          color: "black",
          fontWeight: "bold",
        },
      },
      tickAmount: "auto",
      gridLineColor: "rgba(0, 0, 0, 0.05)",
      startOnTick: false,
      endOnTick: false,
    },
    series: extraSeries.length > 0
      ? extraSeries
      : [
          {
            name: yHeading,
            data: data.map((point) => ({
              name: point.originalBatchNo,
              y: point.y,
            })),
            lineWidth: 2,
            zones: zones,
            marker: {
              enabled: true,
              radius: 4, // Adjust marker size for clarity
            },
          },
        ],
    plotOptions: {
      series: {
        pointPadding: 0.3, // Add space between points
        groupPadding: 0.5, // Add group padding for more separation
        marker: {
          enabled: true,
        },
      },
    },
    tooltip: {
      formatter: function () {
        return `<b>${this.x}</b><br/>${this.series.name}: ${this.y.toFixed(2)}`;
      },
    },
    annotations: annotations?.map((e, index) => ({
      point: {
        xAxis: 0,
        yAxis: 0,
        x: data[Math.floor(data.length / 2)],
        y: e.y,
      },
      text: e.text,
    })),
  };
  

  useEffect(() => {
    if (highchartData) {
      setLoading(false);
    }
  }, [highchartData]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); // Simulate loading time or adjust as needed

    return () => clearTimeout(timeout); // Clear the timeout when the component unmounts or highchartData changes
  }, [highchartData]);

  return (
    <div className=" bg-white shadow-lg p-4 overflow-auto divWithScrollbar">
      <div
        className="graph-2"
        style={{ display: "", justifyContent: "space-between" }}
      >
        <div className="chart-analytics chart-container">

        {loading ? (
            <div className="skeleton-loader">
              <div className="skeleton-title bg-gray-300 w-1/3 h-6 mb-4"></div>
              <div className="skeleton-axis bg-gray-200 w-full h-3 mb-2"></div>
              <div className="skeleton-graph bg-gray-100 w-full h-80 mb-4 animate-pulse"></div>
            </div>
          ) : (
            <HighchartsReact highcharts={Highcharts} options={options} />
          )}        </div>
      </div>
    </div>
  );
};

export default DynamicLineChart;

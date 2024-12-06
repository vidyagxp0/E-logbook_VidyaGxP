import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_more from "highcharts/highcharts-more";
import HC_exporting from "highcharts/modules/exporting";
import HC_exportData from "highcharts/modules/export-data";
// import { records } from "./ChartJsFunction";
// import exportingModule from "highcharts/modules/exporting";

// exportingModule(Highcharts);

// Initialize Highcharts modules
HC_more(Highcharts);
HC_exporting(Highcharts);
HC_exportData(Highcharts);

const LineChart = ({
  heading,
  xHeading,
  yHeading,
  yMin,
  yMax,
  yTickInterval,
  plotLines,
  annotations,
  zones,
  highchartData,
}) => {
  const [selectedOption, setSelectedOption] = useState("hourly");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
 
  const processData = () => {
    return highchartData?.map((record) => {
      console.log(record, "Current Record");
  
      const batchNo = record["Batch No."];
      console.log(batchNo, "Batch No.");
  
      const observedValue = record["Observed Value"];
      console.log(observedValue, "Observed Value");
  
      // Ensure batchNo and observedValue are valid
      if (batchNo && observedValue) {
        return {
          originalBatchNo: batchNo, // Keep the full batch number as-is
          y: parseFloat(observedValue), // Parse the observed value as a float
        };
      }
  
      return null; // Skip records with missing data
    }).filter(Boolean); // Remove null or invalid entries
  };
  
  
  
  
console.log(highchartData,"highchartData    ")
  const data = processData() || [];
  console.log(data,"PROCESSDATA");
  
  const options = {
    chart: {
      type: "line",
      zoomType: "x",
      height: 355,
      // width: 2000,
      panning: true, // Enable panning
      panKey: "ctrl", // Set the key for panning (optional)
    },
    title: {
      text: heading,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
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
      categories: data.map((point) => point.originalBatchNo), // Map batch numbers for x-axis labels
      tickInterval: 1,
      labels: {
        formatter: function () {
          return this.value; // Display the batch number with alphabets
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
      min: yMin,
      max: yMax,
      tickInterval: yTickInterval,
      allowDecimals: true, // Allow decimals on y-axis
      plotLines: plotLines,
      labels: {
        step: 1,
        style: {
          color: "black",
          fontWeight: "bold",
        },
      },
      tickAmount: "auto",
      gridLineColor: "rgba(0, 0, 0, 0.05)",
    },
    
    series: [
      {
        name: yHeading,
        data: data.map((point) => [point.x, point.y]), // Map x and y values correctly
        lineWidth: 2,
        zones: zones,
      },
    ],
    plotOptions: {
      // pointStart:0,

      series: {
        marker: {
          enabled: true,
        },
        states: {
          hover: {
            enabled: false,
          },
        },
      },
    },

    tooltip: {
      formatter: function () {
        return `<b>${this.x}</b><br/>${yHeading}: ${this.y.toFixed(2)}`; // Show y value up to 2 decimal places
      },
    },

    annotations: annotations?.map((e, index) => {
      return {
        point: {
          xAxis: 0,
          yAxis: 0,
          x: data[Math.floor(data.length / 2)],
          y: e.y,
        },
        text: e.text,
      };
    }),
  };

  return (
    <div className=" bg-white shadow-lg p-4 overflow-auto divWithScrollbar">
      <div
        className="graph-2 "
        style={{ display: "", justifyContent: "space-between" }}
      >
        <div className="chart-analytics chart-container ">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </div>
    </div>
  );
};

export default LineChart;

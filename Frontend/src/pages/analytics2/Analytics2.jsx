import React from "react";
import Highcharts from "highcharts";
import Highcharts3D from "highcharts/highcharts-3d";
import HighchartsReact from "highcharts-react-official";
import HeaderTop from "../../components/Header/HeaderTop";
import HeaderBottom from "../../components/Header/HeaderBottom";
import HighchartsMore from "highcharts/highcharts-more"; // For Bubble and Gauge Charts
import Heatmap from "highcharts/modules/heatmap"; // For Heatmap Charts
import Treemap from "highcharts/modules/treemap"; // For Treemap Charts

// Initialize Highcharts Modules
Highcharts3D(Highcharts);
HighchartsMore(Highcharts);
Heatmap(Highcharts);
Treemap(Highcharts);

const Analytics2 = () => {
  // Line Chart Options
  const lineChartOptions = {
    title: { text: "Line Chart Example" },
    series: [
      {
        name: "Sample Data",
        data: [1, 3, 2, 4, 5],
      },
    ],
  };

  // Bar Chart Options
  const barChartOptions = {
    chart: { type: "bar" },
    title: { text: "Bar Chart Example" },
    series: [
      {
        name: "Sample Data",
        data: [5, 3, 4, 7, 2],
      },
    ],
  };

  // Pie Chart Options
  const pieChartOptions = {
    chart: { type: "pie" },
    title: { text: "Pie Chart Example" },
    series: [
      {
        name: "Share",
        data: [
          { name: "Apples", y: 30 },
          { name: "Bananas", y: 20 },
          { name: "Oranges", y: 50 },
        ],
      },
    ],
  };

  // Column Chart Options
  const columnChartOptions = {
    chart: { type: "column" },
    title: { text: "Column Chart Example" },
    series: [
      {
        name: "Sample Data",
        data: [2, 3, 5, 7, 6],
      },
    ],
  };

  // Area Chart Options
  const areaChartOptions = {
    chart: { type: "area" },
    title: { text: "Area Chart Example" },
    series: [
      {
        name: "Sample Data",
        data: [3, 5, 6, 8, 4, 7, 22, 55, 28, 55, 66, 44, 5, 52],
      },
    ],
  };
  // Scatter Chart Options
  const scatterChartOptions = {
    chart: { type: "scatter" },
    title: { text: "Scatter Chart Example" },
    xAxis: { title: { text: "X-Axis" } },
    yAxis: { title: { text: "Y-Axis" } },
    series: [
      {
        name: "Group A",
        data: [
          [1, 2],
          [3, 4],
          [1, 2],
          [5, 6],
          [3, 4],
          [5, 6],
        ],
      },
      {
        name: "Group B",
        data: [
          [2, 3],
          [2, 3],
          [6, 7],
          [4, 5],
          [6, 7],
          [4, 5],
        ],
      },
    ],
  };

  // Bubble Chart Options
  const bubbleChartOptions = {
    chart: { type: "bubble" },
    title: { text: "Bubble Chart Example" },
    series: [
      {
        data: [
          [9, 81, 63],
          [98, 5, 89],
          [51, 50, 73],
        ],
      },
    ],
  };

  // Gauge Chart Options
  //   const gaugeChartOptions = {
  //     chart: { type: "gauge" },
  //     title: { text: "Gauge Chart Example" },
  //     pane: { startAngle: -150, endAngle: 150 },
  //     yAxis: { min: 0, max: 100 },
  //     series: [{ name: "Speed", data: [80] }],
  //   };

  // Waterfall Chart Options
  //   const waterfallChartOptions = {
  //     chart: { type: "waterfall" },
  //     title: { text: "Waterfall Chart Example" },
  //     series: [
  //       {
  //         name: "Net Change",
  //         data: [
  //           { name: "Start", y: 120 },
  //           { name: "Increase", y: 200 },
  //           { name: "Decrease", y: -100 },
  //           { name: "End", isSum: true },
  //         ],
  //       },
  //     ],
  //   };

  // Heatmap Chart Options
  const heatmapChartOptions = {
    chart: { type: "heatmap" },
    title: { text: "Heatmap Example" },
    xAxis: { categories: ["Monday", "Tuesday", "Wednesday"] },
    yAxis: { categories: ["Morning", "Afternoon", "Evening"] },
    colorAxis: { min: 0, minColor: "#FFFFFF", maxColor: "#FF0000" },
    series: [
      {
        name: "Sales per Day",
        data: [
          [0, 0, 10],
          [0, 1, 19],
          [1, 0, 8],
          [2, 2, 24],
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <HeaderTop />
      <HeaderBottom />
      <div className="p-8 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Analytics Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <HighchartsReact
              highcharts={Highcharts}
              options={lineChartOptions}
            />
          </div>
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <HighchartsReact
              highcharts={Highcharts}
              options={barChartOptions}
            />
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <HighchartsReact
              highcharts={Highcharts}
              options={bubbleChartOptions}
            />
          </div>
          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <HighchartsReact
              highcharts={Highcharts}
              options={pieChartOptions}
            />
          </div>
          {/* Column Chart */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <HighchartsReact
              highcharts={Highcharts}
              options={columnChartOptions}
            />
          </div>
          {/* Area Chart */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <HighchartsReact
              highcharts={Highcharts}
              options={areaChartOptions}
            />
          </div>
          {/* Scatter Chart */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <HighchartsReact
              highcharts={Highcharts}
              options={scatterChartOptions}
            />
          </div>
          {/* Bubble Chart */}
         
          {/* Gauge Chart */}
          {/* <div className="bg-white rounded-lg shadow-md p-4">
            <HighchartsReact
              highcharts={Highcharts}
              options={gaugeChartOptions}
            />
          </div> */}
          {/* Waterfall Chart */}
          {/* <div className="bg-white rounded-lg shadow-md p-4">
            <HighchartsReact
              highcharts={Highcharts}
              options={waterfallChartOptions}
            />
          </div> */}
          {/* Heatmap Chart */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <HighchartsReact
              highcharts={Highcharts}
              options={heatmapChartOptions}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics2;

import React, { useState } from "react";
import HeaderTop from "../../components/Header/HeaderTop";
import HeaderBottom from "../../components/Header/HeaderBottom";
import Chart from "react-apexcharts";

export default function Analytics() {
  const initialChart = {
    options: {
      colors: [
        "#8ed1fc",
        "#00FFFF",
        "#00FA9A",
        "#F08080",
        "#008000",
        "#123456",
        "#FF7F50",
        "#43C6DB",
        "#FFFF00",
        "#FFE87C",
      ],
      chart: {
        id: "bar-chart",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "March",
          "April",
          "May",
          "June",
          "July",
          "Aug",
          "Sept",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      yaxis: {
        max: 100,
      },
      plotOptions: {
        line: {
          horizontal: true, // Horizontal line
        },
      },
      annotations: {
        yaxis: [
          {
            y: 80, // Value where the line will be placed
            borderColor: "#FF0000", // Red color
            label: {
              borderColor: "#FF0000", // Red color
              style: {
                color: "#fff", // White text color
                background: "#FF0000", // Red background color
              },
              text: "80%", // Text displayed at the level
              offsetX: -30,
              offsetY: -5,
            },
          },
        ],
      },
    },
    series: [
      {
        name: "CAPA",
        data: [30, 40, 45, 50, 49, 60, 70, 91, 30, 40, 45],
      },
      // {
      //   name: "changecontrol",
      //   data: [24, 60, 35, 80, 29, 70, 50, 51, 34, 50, 45],
      // },
      // {
      //   name: "actionitems",
      //   data: [34, 50, 45, 50, 19, 85, 21, 87, 24, 60, 35],
      // },
      // {
      //   name: "internalaudit",
      //   data: [44, 65, 45, 30, 29, 95, 31, 97, 34, 50, 45],
      // },
      // {
      //   name: "externalaudit",
      //   data: [34, 85, 55, 50, 79, 71, 21, 87, 44, 65, 45],
      // },
      // {
      //   name: "labincident",
      //   data: [55, 65, 75, 85, 95, 85, 75, 65, 34, 85, 55],
      // },
      // {
      //   name: "riskassessment",
      //   data: [34, 65, 45, 50, 29, 75, 21, 87, 55, 65, 75],
      // },
      // {
      //   name: "rootcauseanalysis",
      //   data: [20, 30, 40, 50, 60, 70, 80, 90, 34, 65, 100],
      // },
      // {
      //   name: "managementreview",
      //   data: [10, 15, 45, 50, 29, 75, 21, 100, 20, 30, 40],
      // },
    ],
  };

  const [barChart, setBarChart] = useState(initialChart);

  return (
    <>
      <HeaderTop />
      <HeaderBottom />
      <div className="graph-2">
        <div className="chart-analytics">
          <Chart
            options={barChart.options}
            series={barChart.series}
            type="line"
            width="1200"
          />
        </div>
      </div>
    </>
  );
}

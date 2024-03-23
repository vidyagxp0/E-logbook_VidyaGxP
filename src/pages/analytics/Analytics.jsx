import { useEffect, useState } from "react";
import HeaderTop from "../../components/Header/HeaderTop";
import HeaderBottom from "../../components/Header/HeaderBottom";
import Chart from "react-apexcharts";
import "./Analytics.css";

export default function Analytics() {
  const [selectedOption, setSelectedOption] = useState("hourly");
  const [chartData, setChartData] = useState([]);
  const [chartCategories, setChartCategories] = useState([
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
  ]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    // Fetch data for chart based on selected option
    if (selectedOption === "hourly") {
      setChartData([
        {
          name: "differential pressure",
          data: [0.25, 0.5, 0.75, 1, 1.5, 2,2.5,3,3.5,3.75,],
        },
      ]);
      setChartCategories([
        "00:00  PM",
        "01:00  PM",
        "02:00  PM",
        "03:00  PM",
        "04:00  PM",
        "05:00  PM",
        "06:00  PM",
        "07:00  PM",
        "08:00  PM",
      ]);
    } else if (selectedOption === "day") {
      setChartData([
        {
          name: "differential pressure",
          data: [0.25, 2.65, 0.75, 1,2.75,2,2.75],
        },
      ]);
      setChartCategories([
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ]);
    } else if (selectedOption === "month") {
      setChartData([
        {
          name: "differential pressure",
          data: [0,0.25, 2.65, 0.75,3.5, 1,2.75,2,2.75,3,3.25,2.2,3.75,],
        },
      ]);
      setChartCategories([
        "Month",
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
      ]);
    }
  }, [selectedOption]);

  return (
    <div>
      <HeaderTop />
      <HeaderBottom />
      <h2 className="heading">Differential Pressure Record</h2>
      <div className="graph-2" style={{ display: "flex" }}>
        <div className="chart-analytics">
          <Chart
            options={{
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
                categories: chartCategories,
              },
              yaxis: {
                max: 5, // Change the maximum value according to your data
              },
              plotOptions: {
                line: {
                  horizontal: true,
                },
              },
              annotations: {
                yaxis: [
                  {
                    y: 2.6,
                    borderColor: "#FF0000",
                    label: {
                      borderColor: "#FF0000",
                      style: {
                        color: "#fff",
                        background: "#FF0000",
                      },
                      text: "2.6",
                      offsetX: -30,
                      offsetY: -5,
                    },
                  },
                  {
                    y: 0.6,
                    borderColor: "#FF0000",
                    label: {
                      borderColor: "#FF0000",
                      style: {
                        color: "#fff",
                        background: "#FF0000",
                      },
                      text: "0.6",
                      offsetX: -30,
                      offsetY: -5,
                    },
                  },
                ],
              },
            }}
            series={chartData} // Use chartData here
            type="line"
            width="1500"
            height={600}
          />
        </div>
        <div className="chart-data" style={{ width: "200px" }}>
          <div className="group-input">
            <label className="color-label">Filter By</label>
            <div className="instruction">&nbsp;</div>
            <select
              className="form-control"
              name="assign_to"
              onChange={handleOptionChange}
              value={selectedOption}
            >
              <option value="Select a value">Select a value</option>
              <option value="hourly">Hour</option>
              <option value="day">Day</option>
              <option value="month">Month</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

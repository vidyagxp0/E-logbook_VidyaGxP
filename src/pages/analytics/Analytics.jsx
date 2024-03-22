import { useEffect, useState } from "react";
import HeaderTop from "../../components/Header/HeaderTop";
import HeaderBottom from "../../components/Header/HeaderBottom";
import Chart from "react-apexcharts";
import './Analytics.css';

export default function Analytics() {
  const [selectedOption, setSelectedOption] = useState("hourly");
  const [chartData, setChartData] = useState([]);
  const [chartCategories, setChartCategories] = useState([
    "Jan", "Feb", "March", "April", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
  ]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };


  useEffect(() => {
    // Fetch data for chart based on selected option
    if (selectedOption === "hourly") {
      setChartData([
        {
          name: "CAPA",
          data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
      ]);
      setChartCategories([
        "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
        "06:00", "07:00"
      ]);
    } else if (selectedOption === "day") {
      setChartData([
        {
          name: "CAPA",
          data: [50, 60, 65, 70, 69, 80, 90],
        },
      ]);
      setChartCategories([
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
      ]);
    } else if (selectedOption === "month") {
      setChartData([
        {
          name: "CAPA",
          data: [70, 80, 85, 90, 89, 100, 90, 95, 70, 80, 85,90],
        },
      ]);
      setChartCategories([
        "Jan", "Feb", "March", "April", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
      ]);
    }
  }, [selectedOption]);

  return (
    <div>
      <HeaderTop />
      <HeaderBottom />
      <div className="graph-2" style={{display:"flex"}}>
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
                max: 100, // Change the maximum value according to your data
              },
              plotOptions: {
                line: {
                  horizontal: true,
                },
              },
              annotations: {
                yaxis: [
                  {
                    y: 80,
                    borderColor: "#FF0000",
                    label: {
                      borderColor: "#FF0000",
                      style: {
                        color: "#fff",
                        background: "#FF0000",
                      },
                      text: "80%",
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
        <div className="chart-data" style={{width:"200px"}}>
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

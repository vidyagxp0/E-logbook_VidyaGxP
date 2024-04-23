import { useEffect, useState } from "react";
import HeaderTop from "../../components/Header/HeaderTop";
import HeaderBottom from "../../components/Header/HeaderBottom";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart  } from "react-chartjs-2";
import "./Analytics.css";

export default function Analytics() {
  const [selectedOption, setSelectedOption] = useState("hourly");
  const [chartData, setChartData] = useState([]);
  const [chartCategories, setChartCategories] = useState([]);
  const [chartType, setChartType] = useState("bar");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  useEffect(() => {
    if (selectedOption === "hourly") {
      setChartData([0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5]);
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
      setChartData([0.25, 2.65, 0.75, 1, 2.75, 2, 2.75]);
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
      setChartData([0.25, 2.65, 0.75, 3.5, 1, 2.75, 2, 2.75, 3, 3.25, 2.2, 3.75]);
      setChartCategories([
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

  const gridLineLabels = [
    { value: 2.6, label: 'Danger Zone[2.6] ▴' },
    { value: 0.6, label: 'Danger Zone[0.6] ▾' },
  ];

  const customTicks = (value, index, values) => {
    const labelObj = gridLineLabels.find((obj) => obj.value === value);
    if (labelObj) {
      return labelObj.label;
    }
    return value;
  };

  return (
    <div>
      <HeaderTop />
      <HeaderBottom />
      <div className="graph-2" style={{ display: "flex", justifyContent: 'space-between' }}>
        <div className="chart-analytics" style={{ width:"100%" }}>
          <Chart
            data={{
              labels: chartCategories,
              datasets: [
                {
                  type: chartType,
                  pointRadius: 8,
                  tension: 0.5,
                  label: "Differential Pressure Record",
                  data: chartData,
                  backgroundColor: chartData.map((data) => data > 0.6 & data < 2.6 ? 'rgba(0, 200, 0, 1)' : 'rgba(200, 0, 0, 1)'),
                },
              ],
            }}
            height={600}
            width={1500}
            options={{
              indexAxis: 'x',
              barThickness: 5,
              plugins: {
                legend: {
                  labels: {
                    font: {
                      size: 22,
                      weight:'bold',
                    }
                  }
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: {
                    color: 'orange',
                    font: {
                      size: 12,
                      weight: 'bold'
                    }
                  },
                  grid: {
                    color: '#ffffff',
                  },
                  title: {
                    display: true,
                    text: `---------------  ${selectedOption[0].toUpperCase()+selectedOption.slice(1)} Basis  ---------------`, 
                    font: {
                      size: 22,
                      weight: 'bold',
                    }
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: 'orange',
                    font: {
                      size: 12,
                      weight: 'bold'
                    },
                    stepSize: 0.2,
                    callback: customTicks,
                  },
                  grid: {
                    color: (context) => {
                      let i = context.tick.value
                      if (i === 0.6 || i === 2.6) {
                        return 'red';
                      } else {
                        return 'rgba(0, 0, 0, 0.04)';
                      }
                    }
                  },
                  title: {
                    display: true,
                    text: '------------  Differential Pressure  ------------',
                    font: {
                      size: 22,
                      weight: 'bold',
                    }
                  },
                  max: 4,         
                },
              },
            }}
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
              <option value="select" disabled>Select a value</option>
              <option value="hourly">Hour</option>
              <option value="day">Day</option>
              <option value="month">Month</option>
            </select>
          </div>
          <div className="group-input">
            <label className="color-label">Chart Type</label>
            <div className="instruction">&nbsp;</div>
            <select
              className="form-control"
              name="assign_to"
              onChange={handleChartTypeChange}
              value={chartType}
            >
              <option value="select" disabled>Select type</option>
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="pie">Pie</option>
              <option value="doughnut">Doughnut</option>
              <option value="polarArea">Polar Area</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useReducer, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";
const Chart = () => {
  const [selectedOption, setSelectedOption] = useState("hour");
  const [displayData, setDisplayData] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const fetchData = () => {
    // Yahaan static seed data hai, aap ise apne actual data se replace karein
    if (selectedOption === "hour") {
      setDisplayData(
        "Hourly data: Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      );
    } else if (selectedOption === "day") {
      setDisplayData(
        "Daily data: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      );
    } else if (selectedOption === "month") {
      setDisplayData(
        "Monthly data: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      );
    }
  };
  const data = [
    { name: "17 Feb 24", uv: 3.5, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "18 Feb 24", uv: 3.5, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "19 Feb 24", uv: 3.0, pv: 400, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "20 Feb 24", uv: 0.7, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "21 Feb 24", uv: 2.6, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "22 Feb 24", uv: 2.8, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "23 Feb 24", uv: 6.0, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "24 Feb 24", uv: 9.0, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "25 Feb 24", uv: 2.5, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "26 Feb 24", uv: 3.5, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "27 Feb 24", uv: 6.5, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "28 Feb 24", uv: 5.6, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "29 Feb 24", uv: 7.8, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "01 Mar 24", uv: 9.0, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "02 Mar 24", uv: 0.5, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "03 Mar 24", uv: 3.0, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "04 Mar 24", uv: 2.0, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
    { name: "06 Mar 24", uv: 4.0, pv: 0.1, amt: 0.1, UCL: 5.6, LCL: 2.0 },
  ];

  const [chartsRecord, setChartsRecord] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
      data: [],
    }
  );

  // const differentialPressure = useSelector((state) => state..objects);

  return (
 <>
    <div style={{ display: "flex" }} className="chart-css">
      <LineChart
        width={1500}
        height={600}
        data={data}
        margin={{ top: 5, right: 20, bottom: 60, left: 0 }}
      >
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <Line type="monotone" dataKey="UCL" stroke="red" label="UCL" />
        <Line type="monotone" dataKey="LCL" stroke="red" />
        <CartesianGrid stroke="#cc" strokeDasharray="" />
        <XAxis dataKey="name" angle={-90} textAnchor="end" allowDataOverflow />
        <YAxis domain={[0.0, 5.1]} allowDecimals tickCount={21} />
        <Tooltip />
      </LineChart>
      <div className="chart-data" style={{ border: "1px solid red" }}>
        <div className="group-input">
          <label className="color-label">Data According to You</label>

          <div className="instruction">&nbsp;</div>
          <select
            className="form-control"
            name="assign_to"
            //   value={chartsRecord.data}
            //   onChange={(e) =>
            //     setChartsRecord({
            //       data: e.target.value,
            //     })
            //   }
            onClick={fetchData}
            onChange={handleOptionChange}
            value={selectedOption}
          >
            <option value="Select a value">Select a value</option>
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="month">Month</option>
          </select>
        </div>
      </div>
      
    </div>
    <div>{displayData}</div>
    </>
  );
};

export default Chart;

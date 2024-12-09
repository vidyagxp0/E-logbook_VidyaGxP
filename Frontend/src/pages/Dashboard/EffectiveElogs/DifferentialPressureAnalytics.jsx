import React, { useEffect, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import { useLocation } from "react-router-dom";
import LineChart from "../../analytics/LineChart";

const DifferentialPressureAnalytics = () => {
  const [dataFiltered, setDataFiltered] = useState("select"); // Default filter
  const [filteredData, setFilteredData] = useState([]);
  const location = useLocation();
  console.log(filteredData, "filteredData");
  const filterValueArray = [
    { label: "Checked By", value: "checked_by" },
    { label: "Time", value: "time" },
  ];

  // Function to split time into date and time
  const splitDateTime = (datetime) => {
    const [date, time] = datetime.split(" ");
    return { date, time };
  };

  // Function to filter data based on selected filter and time period
  const getFilteredData = (records, filterBy) => {
    return records
      ?.map((item) => {
        const { date, time: itemTime } = splitDateTime(item.time); // Split time into date and time

        if (filterBy === "time") {
          return {
            "Batch No.": item.time,
            "Observed Value": item.differential_pressure,
            Date: date, // Date part
            Time: itemTime, // Time part
          };
        } else {
          return {
            "Batch No.": item.checked_by,
            "Observed Value": item.differential_pressure,
          };
        }
        return null; // Return null for invalid filters
      })
      .filter(Boolean); // Remove null or undefined values
  };

  useEffect(() => {
    // Update filtered data whenever `dataFiltered`, `startDate`, `endDate`, `startTime`, or `endTime` changes
    const updatedFilteredData = getFilteredData(
      location.state.DifferentialPressureRecords,
      dataFiltered
    );
    setFilteredData(updatedFilteredData);
  }, [dataFiltered, location.state]);

  const dPPlotLines = [
    {
      value: location?.state?.limit,
      color: "red",
      width: 2,
      dashStyle: "Line",
      label: {
        text: "Upper Limit",
        style: { color: "black", fontWeight: "bold" },
      },
    },
  ];

  return (
    <div>
      <HeaderTop />
      <div className=" flex justify-end p-3">
        <label className="mt-2">Filter : &nbsp;</label>
        <select
          className="border  border-gray-400 focus:outline-none focus:ring-2  appearance-none py-2 px-3 rounded bg-white text-gray-700 shadow-sm w-full"
          value={dataFiltered}
          onChange={(e) => setDataFiltered(e.target.value)}
          style={{ height: "40px", width: "150px", padding: "10px" }} /* Set a fixed height */
        >
          <option value={"select"}>--Select--</option>
          {filterValueArray.map((itm) => (
            <option key={itm.value} value={itm.value}>
              {itm.label}
            </option>
          ))}
        </select>

        {/* Show time period pickers if 'Time Period' filter is selected */}

        {/* <div className="flex space-x-3 mt-3">
            <div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
            </div>
          </div> */}
      </div>

      <div className=" p-4 shadow-lg">
        <LineChart
          heading={"Differential Pressure Analysis"}
          xHeading={dataFiltered === "checked_by" ? "Checked By" : "Time"}
          yHeading={"DP"}
          yMin={10}
          yMax={location?.state?.limit + 2 / 10}
          yTickInterval={5}
          plotLines={dPPlotLines}
          zones={""}
          highchartData={filteredData}
        />
      </div>
    </div>
  );
};

export default DifferentialPressureAnalytics;

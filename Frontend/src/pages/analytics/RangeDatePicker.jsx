import React from "react";
import { DatePicker, Space } from "antd";

const { RangePicker } = DatePicker;

const RangeDatePicker = ({ handleSelectedDate }) => {
  const handleRangeChange = (dates, dateStrings) => {
    if (dates) {
      const [startDate, endDate] = dates;
      handleSelectedDate(dateStrings[0], dateStrings[1]);
    } else {
      handleSelectedDate(null, null);
    }
  };

  return (
    <Space direction="vertical" size={12}>
      <RangePicker
        onChange={handleRangeChange}
        style={{
          width: "500px",
          border: "2px solid #2563EA",
          borderRadius: "8px",
          padding: "6px 13px",
          boxShadow: "0 2px 4px rgb(37, 99, 234, 0.5)",
          fontWeight: "600",
        }}
        className="hover:ring-blue-500 ring-1 shadow-lg"
      />
    </Space>
  );
};

export default RangeDatePicker;

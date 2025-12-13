import { useEffect, useMemo, useState } from "react";
import { Select, Switch, Card, Row, Col, Divider } from "antd";
import RangeDatePicker from "./RangeDatePicker";
import {
  LineChart, Line,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  ResponsiveContainer, BarChart,
  Bar, Legend, PieChart,
  Pie, Cell, ComposedChart,
} from "recharts";
import HeaderTop from "../../components/Header/HeaderTop";
import HeaderBottom from "../../components/Header/HeaderBottom";

const { Option } = Select;

/* -------------------------
   SAMPLE STATIC DATA BUCKET
---------------------------*/
const dataBuckets = [
  {
    ts: "2025-11-01 10:00",
    hour: 10,
    instrument: "Analytical Balance",
    department: "QC",
    personType: "Initiator",
    entries: 4,
  },
  {
    ts: "2025-11-01 11:00",
    hour: 11,
    instrument: "HPLC",
    department: "QA",
    personType: "Reviewer",
    entries: 6,
  },
  {
    ts: "2025-11-01 12:00",
    hour: 12,
    instrument: "Karl Fischer",
    department: "AR&D",
    personType: "Approver",
    entries: 3,
  },
  {
    ts: "2025-11-01 12:00",
    hour: 12,
    instrument: "pH Meter",
    department: "Biologics",
    personType: "Initiator",
    entries: 5,
  },
];

const INSTRUMENTS = ["Analytical Balance", "HPLC", "Karl Fischer", "pH Meter"];
const DEPARTMENTS = ["QA", "QC", "AR&D", "Biologics"];
const PERSON_TYPES = ["Initiator", "Reviewer", "Approver"];

const COLORS = ["#ff4e50", "#ffb75e", "#7b61ff", "#00c6ff", "#10b981"];

export default function Analytics() {
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedMode, setSelectedMode] = useState("hourly");
  const [includeHits, setIncludeHits] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

  /* -------------------------
      FILTERED DATA
  ---------------------------*/
  const filteredData = useMemo(() => {
    let data = [...dataBuckets];

    if (selectedDept) data = data.filter((d) => d.department === selectedDept);
    if (selectedInstrument) data = data.filter((d) => d.instrument === selectedInstrument);
    if (selectedPerson) data = data.filter((d) => d.personType === selectedPerson);

    if (selectedDateRange[0] && selectedDateRange[1]) {
      const start = new Date(selectedDateRange[0]).getTime();
      const end = new Date(selectedDateRange[1]).getTime();
      data = data.filter((d) => {
        const t = new Date(d.ts).getTime();
        return t >= start && t <= end;
      });
    }

    return data;
  }, [selectedDept, selectedInstrument, selectedPerson, selectedDateRange]);

  /* -------------------------
      SUMMARY CARDS
  ---------------------------*/
  const summary = useMemo(() => {
    if (!filteredData.length) return { total: 0, min: 0, max: 0, avg: 0 };
    const vals = filteredData.map((d) => d.entries);
    return {
      total: vals.reduce((a, b) => a + b, 0),
      min: Math.min(...vals),
      max: Math.max(...vals),
      avg: (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2),
    };
  }, [filteredData]);

  /* -------------------------
      HOURLY HEATMAP
  ---------------------------*/
  const hourlyHeatmap = useMemo(() => {
    return INSTRUMENTS.map((ins) => ({
      instrument: ins,
      entries: filteredData
        .filter((d) => d.instrument === ins)
        .reduce((a, c) => a + c.entries, 0),
    }));
  }, [filteredData]);

  /* -------------------------
      DEPARTMENT BAR CHART
  ---------------------------*/
  const deptBar = useMemo(() => {
    return DEPARTMENTS.map((dep) => ({
      department: dep,
      entries: filteredData
        .filter((d) => d.department === dep)
        .reduce((a, c) => a + c.entries, 0),
    }));
  }, [filteredData]);

  /* -------------------------
      PERSON PIE CHART
  ---------------------------*/
  const personPie = useMemo(() => {
    return PERSON_TYPES.map((p, i) => ({
      name: p,
      value: filteredData
        .filter((d) => d.personType === p)
        .reduce((a, c) => a + c.entries, 0),
      color: COLORS[i % COLORS.length],
    }));
  }, [filteredData]);

  /* -------------------------
      OCCUPANCY CHART
  ---------------------------*/
  const usedHours = Math.min(
    Math.round(summary.total * 0.25),
    18
  );

  /* -------------------------
      MODE BASED AGGREGATION
  ---------------------------*/
const aggregated = useMemo(() => {
  if (!filteredData.length) return [];

  const map = {};

  filteredData.forEach((d) => {
    const date = new Date(d.ts);
    let key = "";

    switch (selectedMode) {
      case "hourly":
        key = `${d.hour}:00`;
        break;

      case "weekly": {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDays = Math.floor((date - firstDayOfYear) / 86400000);
        const weekNo = Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
        key = `Week ${weekNo}`;
        break;
      }

      case "quarterly": {
        const q = Math.ceil((date.getMonth() + 1) / 3);
        key = `Q${q} ${date.getFullYear()}`;
        break;
      }

      case "annual":
        key = `${date.getFullYear()}`;
        break;

      default:
        key = "NA";
    }

    map[key] = (map[key] || 0) + d.entries;
  });

  return Object.keys(map)
    .sort((a, b) => {
      if (selectedMode === "annual") return a.localeCompare(b);
      if (selectedMode === "quarterly") return a.localeCompare(b);
      if (selectedMode === "weekly") return parseInt(a.replace(/\D/g, "")) - parseInt(b.replace(/\D/g, ""));
      return parseInt(a) - parseInt(b);
    })
    .map((k) => ({
      label: k,
      entries: map[k],
    }));
}, [filteredData, selectedMode]);


  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      <HeaderTop />
            <HeaderBottom />
<div className="sticky top-0 z-50 bg-slate-50 pb-2">
      {/* ------------------ FILTERS ------------------ */}
      <Card className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div>
            <label>Department</label>
            <Select
              allowClear
              style={{ width: "100%" }}
              onChange={setSelectedDept}
            >
              {DEPARTMENTS.map((d) => (
                <Option key={d}>{d}</Option>
              ))}
            </Select>
          </div>

          <div>
            <label>Instrument</label>
            <Select
              allowClear
              style={{ width: "100%" }}
              onChange={setSelectedInstrument}
            >
              {INSTRUMENTS.map((d) => (
                <Option key={d}>{d}</Option>
              ))}
            </Select>
          </div>

          <div>
            <label>Person Type</label>
            <Select
              allowClear
              style={{ width: "100%" }}
              onChange={setSelectedPerson}
            >
              {PERSON_TYPES.map((d) => (
                <Option key={d}>{d}</Option>
              ))}
            </Select>
          </div>

         <div>
  <label className="font-semibold">Analytics Mode</label>
  <Select
    value={selectedMode}
    onChange={setSelectedMode}
    style={{ width: "100%" }}
  >
    <Option value="hourly">Hourly (0–18 hrs)</Option>
    <Option value="weekly">Weekly</Option>
    <Option value="quarterly">Quarterly</Option>
    <Option value="annual">Annual</Option>
  </Select>
</div>


          <div className="col-span-2">
            <label>Date Range</label>
            <RangeDatePicker onChange={setSelectedDateRange} />
          </div>

          <div className="flex items-center gap-2">
            Include Hits <Switch checked={includeHits} onChange={setIncludeHits} />
          </div>

        </div>
      </Card>

      {/* ------------------ SUMMARY CARDS ------------------ */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col span={6}><Card> <b>Total Entries:</b> {summary.total}</Card></Col>
        <Col span={6}><Card> <b>Min:</b> {summary.min}</Card></Col>
        <Col span={6}><Card> <b>Max:</b> {summary.max}</Card></Col>
        <Col span={6}><Card> <b>Avg:</b> {summary.avg}</Card></Col>
      </Row>

      <Divider />
</div>
<div className="overflow-y-auto max-h-[70vh] pr-2">
      {/* ------------------ CHARTS GRID ------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Gradient Line Chart */}
        <Card title="Aggregated Trend" className="lg:col-span-2">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aggregated}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="entries" stroke="#7b61ff" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Bar */}
        <Card title="Department Distribution">
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={deptBar}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="entries" fill="#00c6ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Person Pie */}
        <Card title="Person Contribution">
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={personPie} outerRadius={90} dataKey="value">
                  {personPie.map((p, i) => (
                    <Cell key={i} fill={p.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Occupancy Pie */}
        <Card title="Instrument Occupancy (Max 18 hrs)">
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={[
                    { name: "Used", value: usedHours },
                    { name: "Free", value: 18 - usedHours }
                  ]}
                  innerRadius={40}
                  outerRadius={90}
                >
                  <Cell fill="#ff4e50" />
                  <Cell fill="#d1d5db" />
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center text-sm mt-1">
              Target = <b>12 hours</b>
            </div>
          </div>
        </Card>

        {/* Hourly Heatmap */}
        <Card title="Hourly Heatmap (Instrument)">
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart layout="vertical" data={hourlyHeatmap}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="instrument" type="category" width={110} />
                <Tooltip />
                <Bar dataKey="entries" fill="#ffb75e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      <Divider />

      {/* Raw Table */}
      <Card title="Raw Data">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Timestamp</th>
              <th className="p-2">Hour</th>
              <th className="p-2">Instrument</th>
              <th className="p-2">Department</th>
              <th className="p-2">Person</th>
              <th className="p-2">Entries</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((d, idx) => (
              <tr key={idx}>
                <td className="p-2">{d.ts}</td>
                <td className="p-2">{d.hour}</td>
                <td className="p-2">{d.instrument}</td>
                <td className="p-2">{d.department}</td>
                <td className="p-2">{d.personType}</td>
                <td className="p-2">{d.entries}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
</div>
    </div>
  );
}

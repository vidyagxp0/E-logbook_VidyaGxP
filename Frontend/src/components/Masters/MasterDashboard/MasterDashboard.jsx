import React, { useState, useMemo } from "react";
import { Button, Table, Input, Card } from "antd";
import { useNavigate } from "react-router-dom";
import HeaderTop from "../../Header/HeaderTop";
import MasterSidebar from "./MasterSidebar";
import MasterModal from "./MasterModal";
import { MASTER_CONFIG } from "./masterConfig";

const { Search } = Input;

const MasterDashboard = () => {
  const navigate = useNavigate();

  const [activeMaster, setActiveMaster] = useState("Site Master");
  const [collapsed, setCollapsed] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [masterData, setMasterData] = useState({
    "Site Master": [],
    "API Identification Master": [],
    "Excipients Dispensing (Grid) Master": [],
    "Persons Involved": [],
    "Equipment/Instrument Master": [],
    "PM Master": [],
    "Connected ElogBook": [],
  });

  /* ---------- SAVE HANDLER ---------- */
  const handleSave = (values) => {
    setMasterData((prev) => ({
      ...prev,
      [activeMaster]: editRow
        ? prev[activeMaster].map((r) =>
            r.key === editRow.key ? { ...values, key: r.key } : r
          )
        : [...prev[activeMaster], { ...values, key: Date.now() }],
    }));
    setOpenModal(false);
    setEditRow(null);
  };

  /* ---------- FILTERED DATA (GLOBAL SEARCH) ---------- */
  const filteredData = useMemo(() => {
    if (!searchText) return masterData[activeMaster];

    return masterData[activeMaster].filter((row) =>
      Object.values(row).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, masterData, activeMaster]);

  /* ---------- DYNAMIC COLUMNS ---------- */
  const columns = [
  {
    title: "Sr No.",
    key: "srNo",
    width: 70,
    fixed: "left",
    render: (_, __, index) => index + 1,
  },
  ...MASTER_CONFIG[activeMaster].fields.map((field) => ({
    title: field.label,
    dataIndex: field.name,
    key: field.name,
    ellipsis: true,
  })),
  {
    title: "Action",
    fixed: "right",
    width: 80,
    render: (_, record) => (
      <Button
        type="link"
        onClick={() => {
          setEditRow(record);
          setOpenModal(true);
        }}
      >
        Edit
      </Button>
    ),
  },
];



  return (
    <>
      <HeaderTop />

      <div className="flex h-[calc(100vh-64px)] bg-gray-100">
        <MasterSidebar
          activeMaster={activeMaster}
          setActiveMaster={setActiveMaster}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-auto">
          {/* TOP BAR */}
          <div className="flex justify-between items-center mb-4">
            <Button onClick={() => navigate("/dashboard")}>⬅ Back</Button>
            <Button type="primary" onClick={() => setOpenModal(true)}>
              Add {activeMaster}
            </Button>
          </div>

          {/* TITLE + SEARCH */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {activeMaster} Entries
            </h2>

            <Search
              placeholder="Search in all fields..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              className="w-72"
            />
          </div>

          {/* TABLE CARD */}
         
            <Table
  columns={columns}
  dataSource={filteredData}
  rowKey="key"
  scroll={{ x: "max-content" }}
  pagination={{
    pageSize: 5,
    showSizeChanger: false,
  }}
  locale={{ emptyText: "No records found" }}
  className="master-no-extra-border"
/>

        

          {/* MODAL */}
          {openModal && (
            <MasterModal
              open={openModal}
              activeMaster={activeMaster}
              editData={editRow}
              onSave={handleSave}
              onClose={() => {
                setOpenModal(false);
                setEditRow(null);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MasterDashboard;

import React, { useState, useMemo, useEffect } from "react";
import { Button, Table, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import HeaderTop from "../../Header/HeaderTop";
import MasterSidebar from "./MasterSidebar";
import MasterModal from "./MasterModal";
import { MASTER_CONFIG } from "./masterConfig";
import { getMasterList } from "../MasterServices";
import { extractMasterData } from "../MasterMapper";

const { Search } = Input;

const MasterDashboard = () => {
  const navigate = useNavigate();

  const [activeMaster, setActiveMaster] = useState("Site Master");
  const [collapsed, setCollapsed] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  // API table data
  const [tableData, setTableData] = useState([]);

  /* ================= FETCH MASTER DATA ================= */
const fetchMasterData = async () => {
  setLoading(true);

  try {
    const res = await getMasterList(activeMaster);
    const apiData = res?.data?.data;

    if (!Array.isArray(apiData)) {
      setTableData([]);
      return;
    }

    const config = MASTER_CONFIG?.[activeMaster];
    if (!config) {
      setTableData([]);
      return;
    }

    const { fields, nestedPath } = config;

    const mappedData = apiData.map((item, index) => ({
      key: item?.id ?? index,
      id: item?.id,
      ...(() => {
        try {
          return extractMasterData(item, fields, nestedPath);
        } catch {
          return {};
        }
      })(),
      __original: item,
    }));

    setTableData(mappedData);
  } catch (e) {
    console.error("ACTUAL ERROR:", e);
  } finally {
    setLoading(false);
  }
};




  /* ================= LOAD ON MASTER CHANGE ================= */
  useEffect(() => {
    fetchMasterData();
  }, [activeMaster]);

  /* ================= SEARCH ================= */
  const filteredData = useMemo(() => {
    if (!searchText) return tableData;

    return tableData.filter((row) =>
      Object.values(row).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, tableData]);

  /* ================= COLUMNS ================= */
  const columns = [
    {
      title: "Sr No.",
      width: 70,
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

        <div className="flex-1 p-6 overflow-auto">
          {/* TOP BAR */}
          <div className="flex justify-between items-center mb-4">
            <Button onClick={() => navigate("/dashboard")}>⬅ Back</Button>
            <Button
              type="primary"
              onClick={() => {
                setEditRow(null);
                setOpenModal(true);
              }}
            >
              Add {activeMaster}
            </Button>
          </div>

          {/* TITLE + SEARCH */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{activeMaster} Entries</h2>

            <Search
              placeholder="Search..."
              allowClear
              className="w-72"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey="key"
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
            locale={{ emptyText: "No records found" }}
          />

          {/* MODAL */}
          {openModal && (
            <MasterModal
              open={openModal}
              activeMaster={activeMaster}
              editData={editRow}
              onClose={(shouldRefresh) => {
                setOpenModal(false);
                setEditRow(null);

                if (shouldRefresh) {
                  fetchMasterData(); // 🔥 reload after add/edit
                }
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MasterDashboard;

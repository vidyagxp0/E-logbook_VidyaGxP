import React from "react";
import {
  ApartmentOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  TeamOutlined,
  ToolOutlined,
  ScheduleOutlined,
  BookOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const masters = [
  { label: "Site Master", icon: <ApartmentOutlined /> },
  { label: "API Identification Master", icon: <DatabaseOutlined /> },
  { label: "Excipients Dispensing (Grid) Master", icon: <DeploymentUnitOutlined /> },
  { label: "Persons Involved", icon: <TeamOutlined /> },
  { label: "Equipment/Instrument Master", icon: <ToolOutlined /> },
  { label: "PM Master", icon: <ScheduleOutlined /> },
  { label: "Connected ElogBook", icon: <BookOutlined /> },
];

const MasterSidebar = ({
  activeMaster,
  setActiveMaster,
  collapsed,
  setCollapsed,
}) => {
  return (
    <div
      className={`h-full transition-all duration-300 flex flex-col
        ${collapsed ? "w-20" : "w-72"}
        bg-gradient-to-b from-blue-700 via-blue-600 to-indigo-700
        rounded-tr-2xl rounded-br-2xl shadow-xl`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
        {!collapsed && (
          <div className="text-white font-bold text-lg tracking-wide">
            Master Panel
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white text-lg"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      {/* TREE MENU */}
      <div className="flex-1 px-3 py-4 space-y-2 overflow-auto">
        {masters.map((item) => {
          const isActive = activeMaster === item.label;

          return (
            <div
              key={item.label}
              onClick={() => setActiveMaster(item.label)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                transition-all duration-200
                ${
                  isActive
                    ? "bg-white text-blue-700 shadow-md scale-[1.02]"
                    : "text-white hover:bg-white/20"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>

              {!collapsed && (
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      {!collapsed && (
        <div className="text-center text-xs text-white/70 pb-3">
          © Master Management
        </div>
      )}
    </div>
  );
};

export default MasterSidebar;

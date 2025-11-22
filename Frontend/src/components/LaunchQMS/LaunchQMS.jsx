import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LaunchQMS({ onClick, onExit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
      {" "}
      <div className="fixed top-[65%] right-0 z-10 flex flex-col">
        <div>
          <div className="flex flex-col right-0 justify-end items-end">
            <button
              onClick={onClick}
              className="
            px-4
            py-2
            bg-teal-600
            opacity-70
            text-white
            font-semibold
            rounded-l-full
            shadow-md
            hover:bg-teal-700
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-teal-500
            mb-3
            flex items-end justify-end
            text-sm
          "
            >
              Save
            </button>
            <button
              onClick={onExit}
              className="
            px-4
            py-2
            bg-teal-600
            opacity-70
            text-white
            font-semibold
            rounded-l-full
            shadow-md
            hover:bg-teal-700
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-teal-500
            mb-3
            flex items-center justify-center
            text-sm
          "
            >
              Main Page
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="
            px-4
            py-2
            bg-teal-600
            opacity-70
            text-white
            font-semibold
            rounded-l-full
            shadow-md
            hover:bg-teal-700
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-teal-500
            mb-5
            flex items-center justify-center
            text-sm
          "
            >
              Launch LIMS
            </button>
          </div>
          {/* Modal */}
          {isModalOpen && (
            <>
              <div className="fixed inset-0 flex items-center justify-end z-50">
                <div className="bg-white p-2 rounded-lg shadow-lg mt-[70px] w-[250px] z-50 flex flex-col items-center justify-end   ">
                  <a>
                    <button
                      className="mt-4 px-4 py-2 bg-[#0c5fc6] text-white font-semibold rounded hover:bg-blue-400 min-w-[200px]"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(
                          "https://ipc.mydemosoftware.com/",
                          "_blank"
                        );
                      }}
                    >
                      Deviation
                    </button>
                  </a>
                  <a>
                    <button
                      className="mt-4 px-4 py-2 bg-[#0c5fc6] text-white font-semibold rounded hover:bg-blue-400 min-w-[200px]"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(
                          "https://ipc.mydemosoftware.com/",
                          "_blank"
                        );
                      }}
                    >
                      Root Cause Analysis
                    </button>
                  </a>
                  <a>
                    <button
                      className="mt-4 px-4 py-2 bg-[#0c5fc6] text-white font-semibold rounded hover:bg-blue-400 min-w-[200px]"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(
                          "https://ipc.mydemosoftware.com/",
                          "_blank"
                        );
                      }}
                    >
                      Action Items
                    </button>
                  </a>
                  <a>
                    <button
                      className="mt-4 px-4 py-2 bg-[#0c5fc6] text-white font-semibold rounded hover:bg-blue-400 min-w-[200px]"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(
                          "https://ipc.mydemosoftware.com/",
                          "_blank"
                        );
                      }}
                    >
                      Lab Incident
                    </button>
                  </a>
                  <a>
                    <button
                      className="mt-4 px-4 py-2 bg-[#0c5fc6] text-white font-semibold rounded hover:bg-blue-400 min-w-[200px]"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(
                          "https://ipc.mydemosoftware.com/",
                          "_blank"
                        );
                      }}
                    >
                      Risk Assissment
                    </button>
                  </a>
                  <a>
                    <button
                      className="mt-4 px-4 py-2 bg-[#0c5fc6] text-white font-semibold rounded hover:bg-blue-400 min-w-[200px]"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(
                          "https://ipc.mydemosoftware.com/",
                          "_blank"
                        );
                      }}
                    >
                      OOS
                    </button>
                  </a>
                  <a>
                    <button
                      className="mt-4 px-4 py-2 bg-[#0c5fc6] text-white font-semibold rounded hover:bg-blue-400 min-w-[200px]"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(
                          "https://ipc.mydemosoftware.com/",
                          "_blank"
                        );
                      }}
                    >
                      OOT
                    </button>
                  </a>

                  <button
                    className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
                    onClick={() => setIsModalOpen(false)} // Close modal on button click
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Overlay */}
              <div
                className="fixed inset-0 bg-white opacity-60 z-40"
                onClick={() => setIsModalOpen(false)} // Close modal when clicking on overlay
              ></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LaunchQMS;

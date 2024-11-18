import React, { useState } from "react";

function LaunchQMS() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {" "}
      <div className="fixed top-[65%] right-0 z-10 flex flex-col">
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="
            px-4
            py-2
            bg-teal-600
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
          "
          >
            Launch QMS
          </button>

          {/* Modal */}
          {isModalOpen && (
            <>
              <div className="fixed inset-0 flex items-center justify-end z-50">
                <div className="bg-white p-2 rounded-lg shadow-lg mt-[70px] w-[250px] z-50 flex flex-col items-center justify-end   ">
                  <a href="https://ipc.mydemosoftware.com">
                    <button className="mt-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 min-w-[200px]">
                      Deviation
                    </button>
                  </a>
                  <a href="https://ipc.mydemosoftware.com">
                    <button
                      className="mt-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 min-w-[200px]"
                      onClick={() => navigate("ipc.mydemosoftware.com")}
                    >
                      Root Cause Analysis
                    </button>
                  </a>
                  <a href="https://ipc.mydemosoftware.com">
                    <button
                      className="mt-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 min-w-[200px]"
                      onClick={() => navigate("ipc.mydemosoftware.com")}
                    >
                      Action Items
                    </button>
                  </a>
                  <a href="https://ipc.mydemosoftware.com">
                    <button
                      className="mt-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 min-w-[200px]"
                      onClick={() => navigate("ipc.mydemosoftware.com")}
                    >
                      Lab Incident
                    </button>
                  </a>
                  <a href="https://ipc.mydemosoftware.com">
                    <button
                      className="mt-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 min-w-[200px]"
                      onClick={() => navigate("ipc.mydemosoftware.com")}
                    >
                      Risk Assissment
                    </button>
                  </a>
                  <a href="https://ipc.mydemosoftware.com">
                    <button
                      className="mt-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 min-w-[200px]"
                      onClick={() => navigate("ipc.mydemosoftware.com")}
                    >
                      OOS
                    </button>
                  </a>
                  <a href="https://ipc.mydemosoftware.com">
                    <button
                      className="mt-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 min-w-[200px]"
                      onClick={() => navigate("ipc.mydemosoftware.com")}
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

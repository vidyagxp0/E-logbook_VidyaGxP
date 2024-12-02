import React from "react";

const AboutModal = ({ open, onClose, logo, details, footerText }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white w-[500px] rounded-lg shadow-lg p-6 relative">
        <h2 className="text-black text-[24px] mb-2">About</h2>

        <hr className="mb-4" />
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-24" />
        </div>

        <div className="space-y-2">
          {details.map((detail, index) => (
            <p key={index} className="text-black">
              <strong className="text-black">{detail.label}:</strong>&nbsp;{" "}
              {detail.value}
            </p>
          ))}
        </div>

        <hr className="my-4" />

        <p className="text-center text-sm text-gray-100 bg-blue-500">
          {footerText}
        </p>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;

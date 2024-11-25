import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaComments, FaTimes } from "react-icons/fa"; // Icon for chat button and close button
import { useLocation } from "react-router-dom";

const ViewReport = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [srcId, setSrcId] = useState("");

  // const { pqrId, filename } = useLocation().state || {};
  // useEffect(() => {
  //   console.log("pqrId", pqrId || 1, "filename", filename || "APQR_Report.pdf");
  // }, [pqrId || filename]);
  const url = new URL(window.location.href);

  const elogIdValue = url.searchParams.get("formId") || NA;

  // console.log(elogIdValue, "elogvalue");

  const pdfUrl = `https://elog-backend.mydemosoftware.com//public/Elog_Report_${elogIdValue}.pdf`;

  const initializeChatModal = async (data) => {
    try {
      const addPdfUrl = "https://api.chatpdf.com/v1/sources/add-url";

      const res = await axios.post(addPdfUrl, data, chatPdfConfig);

      setSrcId(res?.data?.sourceId);
    } catch (err) {
      // console.log("Error in initializeChatModal fn", err.message);
    }
  };

  useEffect(() => {
    initializeChatModal({
      // url: "https://pdfobject.com/pdf/sample.pdf",
      url: pdfUrl,
    });
  }, []);

  const handleSendMessage = async () => {
    if (!awaitingResponse) {
      setAwaitingResponse(true);
      if (newMessage.trim() !== "") {
        setMessages([...messages, { text: newMessage, sender: "user" }]);
        setNewMessage("");

        let chatData = {
          sourceId: srcId,
          messages: [
            {
              role: "user",
              content: newMessage,
            },
          ],
        };

        try {
          const pdfRes = await axios.post(
            "https://api.chatpdf.com/v1/chats/message",
            chatData,
            chatPdfConfig
          );

          setMessages((prevMessages) => [
            ...prevMessages,
            { text: pdfRes.data.content, sender: "bot" },
          ]);
        } catch (error) {
          console.error("Error sending message:", error);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: "Failed to send message. Please try again.",
              sender: "bot",
            },
          ]);
        } finally {
          setAwaitingResponse(false);
        }
      }
    }
  };

  return (
    <div className="relative h-screen">
      {/* PDF iframe */}
      <iframe
        // src="https://pdfobject.com/pdf/sample.pdf"
        src={pdfUrl}
        width="100%"
        height="100%"
        title="Example PDF"
        className="w-full h-full"
      >
        Your browser does not support iframes.
      </iframe>

      {!isChatOpen && (
        <div
          className="absolute bottom-5 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg cursor-pointer z-50"
          onClick={() => setIsChatOpen(true)}
        >
          <FaComments size={34} /> {/* Chat icon */}
        </div>
      )}

      {/* Chatbox */}
      {isChatOpen && (
        <div className="absolute bottom-5 right-5 w-[450px] bg-white border border-gray-300 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-y-0">
          <div className="bg-blue-500 text-white flex justify-between items-center p-2 rounded-t-lg">
            <span>Chat with PDF</span>
            <FaTimes
              size={20}
              className="cursor-pointer"
              onClick={() => setIsChatOpen(false)}
            />
          </div>
          <div className="h-[500px] overflow-y-auto p-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 my-1 rounded-lg mt-5 ${
                  message.sender === "user"
                    ? "bg-blue-300 ml-10 text-white text-right"
                    : "bg-gray-300 mr-10 text-black text-left pl-4"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="flex border-t border-gray-300">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 h-12 border-none focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={awaitingResponse}
              className="bg-blue-500 text-white px-4 py-2 h-12 hover:bg-blue-600 -ml-3 flex min-w-24 space-x-4 items-center"
            >
              <p>Send</p>
              {awaitingResponse && (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReport;

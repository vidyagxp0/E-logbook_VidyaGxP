import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaComments, FaTimes } from "react-icons/fa"; // Icon for chat button and close button
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";


const ViewReport = () => {
  const [data, setData] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [srcId, setSrcId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [emailData, setEmailData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    message: "",
    attachment: "",
  });
  const [loading, setLoading] = useState(false);

  const url = new URL(window.location.href);

  const elogIdValue = url.searchParams.get("filename") || NA;

  // console.log(elogIdValue, "elogvalue");

  const pdfUrl = `http://localhost:1000/public/${elogIdValue}`;

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

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  const handleSelectChange = (selectedOptions, field) => {
    if (selectedOptions.some((option) => option.value === "select-all")) {
      setEmailData((prev) => ({
        ...prev,
        [field]: data.map((option) => option.value).join(","),
      }));
    } else {
      setEmailData((prev) => ({
        ...prev,
        [field]: selectedOptions.map((option) => option.value).join(","),
      }));
    }
  };
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:1000/user/get-all-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const emailOptions = response.data.response.map((user) => ({
        value: user.email,
        label: user.email,
      }));
      setData(emailOptions);
    } catch (error) {
      console.error("There was a problem with the API call:", error);
    }
  };
 
  useEffect(() => {
    fetchData();
  }, []);

   const handleSendEmail = async () => {
    setLoading(true);

    const emailPayload = {
      to: emailData.to,
      cc: emailData.cc,
      bcc: emailData.bcc,
      subject: emailData.subject,
      message: emailData.message,
      attachment: emailData.attachment,
    };
    console.log(emailPayload, "emailPayload");
    

    if (!emailPayload.message || !emailPayload.subject || !emailPayload.to) {
      toast.error("Required fields can't be empty!");
      setLoading(false);
      return;
    }

    const emailPromise = axios.post(
      `http://localhost:1000/differential-pressure/send-report-on-mail/${elogIdValue}`,
      emailPayload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.promise(emailPromise, {
      pending: "Sending email...",
      success: "Email sent successfully!",
      error: "Failed to send email. Please try again.",
    });

    try {
      const response = await emailPromise;
      if (response.status === 200) {
        setShowModal(false);
        setEmailData({ to: "", cc: "", bcc: "", subject: "", message: "" });
      }
    } catch (err) {
      console.error("Error sending email:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <div className="h-12 bg-zinc-800 w-full">
        <button
          className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
          onClick={() => setShowModal(true)}
        >
          Send as Email
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center !bg-black !bg-opacity-50 overflow-auto">
          <div className="scrollbar-custom bg-white w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[35%] max-h-[calc(100vh-40px)] overflow-y-auto rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Send as Email
            </h2>

            <label htmlFor="to" className="block mb-2 font-medium">
              To: <span className="text-red-500 font-bold">*</span>
            </label>
            <Select
              isMulti
              options={data}
              value={
                emailData.to
                  ? emailData.to
                      .split(",")
                      .filter(Boolean)
                      .map((value) => ({
                        value,
                        label: value,
                      }))
                  : []
              }
              onChange={(selectedOptions) =>
                handleSelectChange(selectedOptions, "to")
              }
              className="w-full mb-4 rounded"
              placeholder="Select To email addresses"
            />

            <label htmlFor="cc" className="block mb-2 font-medium">
              CC: (optional)
            </label>
            <Select
              isMulti
              options={data}
              value={
                emailData.cc
                  ? emailData.cc
                      .split(",")
                      .filter(Boolean)
                      .map((value) => ({
                        value,
                        label: value,
                      }))
                  : []
              }
              onChange={(selectedOptions) =>
                handleSelectChange(selectedOptions, "cc")
              }
              className="mb-4"
              placeholder="Select CC email addresses"
            />

            <label htmlFor="bcc" className="block mb-2 font-medium">
              BCC: (optional)
            </label>
            <Select
              isMulti
              options={data}
              value={
                emailData.bcc
                  ? emailData.bcc
                      .split(",")
                      .filter(Boolean)
                      .map((value) => ({
                        value,
                        label: value,
                      }))
                  : []
              }
              onChange={(selectedOptions) =>
                handleSelectChange(selectedOptions, "bcc")
              }
              className="mb-4"
              placeholder="Select BCC email addresses"
            />

            <label htmlFor="subject" className="block mb-2 font-medium">
              Subject: <span className="text-red-500 font-bold">*</span>
            </label>  
            <input
              type="text"
              id="subject"
              value={emailData.subject}
              onChange={(e) =>
                setEmailData((prev) => ({ ...prev, subject: e.target.value }))
              }
              className="w-full p-2 mb-4 border-2 border-gray-300 rounded"
              placeholder="Subject"
            />

            <label htmlFor="message" className="block mb-2 font-medium">
              Message: <span className="text-red-500 font-bold">*</span>
            </label>
            <textarea
              id="message"
              value={emailData.message}
              onChange={(e) =>
                setEmailData((prev) => ({ ...prev, message: e.target.value }))
              }
              className="w-full p-2 mb-4 border-2 border-gray-300 rounded"
              style={{border:"1px solid black"}}
              placeholder="Write your message..."
              rows={4}
            />
            <label htmlFor="attachment" className="block mb-2 font-medium">
            Attachment: (optional)
            </label>
            <input
              type="file"
              id="attachment"
              onChange={(e) =>
                setEmailData((prev) => ({
                  ...prev,
                  attachment: e.target.files[0],
                }))
              }
              className="w-full p-2 mb-4 border-2 border-gray-300 rounded"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
};

export default ViewReport;

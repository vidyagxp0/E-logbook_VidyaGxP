import { Link, useNavigate } from "react-router-dom";
// import "./Header.css";
import "./HeaderTop.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import AboutModal from "../AboutModal/AboutModal";

function HeaderTop() {
  const navigate = useNavigate();
  const [User, setUser] = useState(null);
  localStorage.setItem("Username", JSON.stringify(User));
  const [modalOpen, setModalOpen] = useState(false);
  const [isAboutModel, setIsAboutModel] = useState(false);
  const loggedInUser = useSelector((state) => state.loggedInUser.loggedInUser);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      url: `https://elog-backend.mydemosoftware.com/user/get-a-user/${loggedInUser?.userId}`, // Ensure you use the correct URL format including 'http://'
      headers: {}, // You can add any necessary headers here
    };

    axios(requestOptions)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("admin-token");
    localStorage.removeItem("Username");
    localStorage.removeItem("user-details");
    navigate("/");
  };
  const handleOpen = () => setIsAboutModel(true);
  const handleClose = () => setIsAboutModel(false);
  const helpData = [
    {srNo: 1 , 
     hd:"Yes",
     person:"Amit Guru",
     division:"Tech Support",
     phone:9179099211,
     email:"amit.g@gmail.com"
    },
    {srNo: 2 , 
     hd:"Yes",
     person:"Shaleen Mishra ",
     division:"Tech Support",
     phone:8770691509,
     email:"madhur.m@gmail.com"
    },
    {srNo: 3 , 
     hd:"Yes",
     person:"Gaurav Meena",
     division:"Tech Support",
     phone:7879678742,
     email:"gaurav.meena@vidyagxp.com"
    },
    {srNo: 4 , 
     hd:"Yes",
     person:"Mayank Rathore",
     division:"Tech Support",
     phone:8871568001,
     email:"rathoremayank019@gmail.com"
    },
    {srNo: 5 , 
     hd:"Yes",
     person:"Pankaj Jat",
     division:"Tech Support",
     phone:8435507087,
     email:"amit.g@gmail.com"
    },

  ]
  const modalData = {
    logo: "/gxplogo.png", // Replace with your logo
    title: "VidyaGxP",
    details: [
      { label: "Version", value: "2.1.1" },
      { label: "Build #", value: "2" },
      { label: "Date", value: "April 23, 2023" },
      { label: "Licensed to", value: "SYMBIOTEC" },
      { label: "Environment", value: "Master Development" },
      { label: "Server", value: "SCRRREVE3 (100.23.34.0)" },
    ],
    footerText: "© 2023 VidyaGxP Private Limited",
  };

  return (
    <>
      <div id="Header_Top" className="Header_Top">
        <div className="header_inner">
          <div className="left">
            <div className="logo">
              {/* <img src="/logo1.png" alt="..." /> */}
              <img
                onClick={() => navigate("/dashboard")}
                style={{ cursor: "pointer" }}
                src="/vidyalogo2.png"
                alt="..."
              />
            </div>
          </div>
          <div className="center">
            {/* <div className="inputContainer">
              <div className="inputInnerLeft">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#0c5fc6"
                  width={"25"}
                  height={"25"}
                >
                  <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                </svg>
              </div>
              <div className="inputInnerRight flex flex-row">
                <input type="search" />
                <button
                  className=""
                  style={{
                    width: "30%",
                    marginLeft: "20%",
                    padding: "3%",
                    background: "#0c5fc6",
                  }}
                >
                  Search
                </button>
              </div>
            </div> */}
            <h1 className="text-4xl font-bold font-serif">elog-Book</h1>
          </div>
          <div className="right">
            <div className="bellLeft">
              <i className="ri-notification-3-fill"></i>
            </div>

            <div className="drop-container">
              <div className="drop-btn">
                <div className="">
                  {/* <img src={User?.profile_pic} alt="Profile Picture" /> */}
                  <FaUserCircle size={36} className="text-[#0c5fc6]" />
                </div>
              </div>
              <div className="drop-list">
                <div className="image">
                  {/* <img src={User?.profile_pic} alt="..." /> */}
                  <div className="manager-name">{User?.name}</div>
                </div>
                <Link to="#" className="drop-item"  onClick={() => setIsAboutModel(true)}>
                  <i className="ri-global-line"></i>About
                </Link>
                <Link to="#" className="drop-item" onClick={() => setModalOpen(true)}>
                  <i className="ri-hand-heart-line"></i>Helpdesk Personnel
                </Link>
                <Link to="/" className="drop-item" onClick={handleLogout}>
                  <i className="ri-logout-circle-line"></i>Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
        {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] max-w-7xl">
            <h2 className="text-2xl  bg-[#0c5fc6] font-semibold text-white py-2 px-2 mb-4">Help Desk</h2>
            <table className="table-auto w-full border-collapse border border-gray-300 ">
              <thead className="bg-slate-500 sticky top-0 text-white">
                <tr>
                  <th className="border border-gray-300 w-[5%] py-2">S. No.</th>
                  <th className="border border-gray-300 px-4 py-2">HD</th>
                  <th className="border border-gray-300 px-4 py-2">Person</th>
                  <th className="border border-gray-300 px-4 py-2">Division</th>
                  <th className="border border-gray-300 px-4 py-2">Phone</th>
                  <th className="border border-gray-300 px-4 py-2">E-mail</th>
                </tr>
              </thead>
              <tbody>

               
                  {helpData?.map((item)=>{
                    return(
                      <>
                       <tr>
                      <td className="border border-gray-300 px-4 py-2 text-black"> {item.srNo}</td>
                      <td className="border border-gray-300 px-4 py-2 text-black">{item.hd}</td>
                      <td className="border border-gray-300 px-4 py-2 text-black">{item.person}</td>
                      <td className="border border-gray-300 px-4 py-2 text-black">{item.division}</td>
                      <td className="border border-gray-300 px-4 py-2 text-black">{item.phone}</td>
                      <td className="border border-gray-300 px-4 py-2 text-black">{item.email}</td>
                      </tr>
                      </>
                    )

                  })}
                
              </tbody>
            </table>
           <div className="flex justify-end">
           <button
              onClick={() => setModalOpen(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
           </div>
          </div>
        </div>)}
        {isAboutModel && (
        <AboutModal
          logo={modalData.logo}
          title={modalData.title}
          details={modalData.details}
          footerText={modalData.footerText}
          open={handleOpen}
          onClose={handleClose}
        />
      )}
      </div>
    </>
  );
}

export default HeaderTop;

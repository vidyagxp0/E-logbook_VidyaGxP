export const site = localStorage.getItem("site");
export const currentDate = new Date();
export const currentYear = currentDate.getFullYear();

const object = getCurrentDateTime();
let time = object.currentTime;
let date = object.currentDate;


function getCurrentDateTime() {
  // Get current date and time
  const now = new Date();

  // Format time to 10:30 AM format
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 12-hour clock, so 0 becomes 12
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const currentTime = `${hours}:${minutes} ${ampm}`;

  // Format date to 12/12/12 format
  const year = now.getFullYear().toString().slice(-2); // Get last two digits of year
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const day = now.getDate().toString().padStart(2, "0");
  const currentDate = `${month}/${day}/${year}`;

  // Return object containing current time and date
  return {
    currentTime: currentTime,
    currentDate: currentDate,
  };
}

function generateRandomNumber(digits) {
  let randomNumber = "";
  for (let i = 0; i < digits; i++) {
    randomNumber += Math.floor(Math.random() * 10); // Append a random digit (0-9)
  }
  return randomNumber;
}

let numberOfDigits = 12; // Change this to the desired number of digits
const uniqueID = generateRandomNumber(numberOfDigits);
// console.log(uniqueNumber);
// let uniqueID = generateUUID();
console.log(uniqueID);

export const docFormFile = [
  {
    label: "Attach Draft Document",
    instruction: "Please Attach all relevant or supporting documents",
    required: true,
    columnList: [
      {
        id: "2.1.1.3",
        name: "Differential Pressure",
        content: "12/12/2",
        value: "Default Value",
        type: "Number",
        isEditable: true,
      },
      { id: "2.1.1.0", name: "uniqueId", value: "12/12/2", content:uniqueID, type: "text", isEditable: true },
      { id: "2.1.1.1", name: "Title of Document", type: "text" },
      { id: "2.1.1.2", name: "Attached File", type: "File" },
      { id: "2.1.1.3", name: "Remark", type: "text" },
    ],
  },
  {
    label: "Attach Effective Document",
    instruction: "Please Attach all relevant or supporting documents",
    required: true,
    columnList: [
      { id: "2.1.1.1", name: "Title of Document", type: "text" },
      { id: "2.1.1.2", name: "Attached File", type: "File" },
      { id: "2.1.1.3", name: "Remark", type: "text" },
    ],
  },
  {
    label: "",
    instruction: "Add Differential Pressure and Remarks by clicking here ",
    coloredLabel: true,
    required: false,
    columnList: [
      { id: "2.1.1.0", name: "uniqueId", value:"", content:uniqueID,  type: "text", isEditable: false },
      { id: "2.1.1.1", name: "Date", value: "12/12/2", content: date, type: "date", isEditable: false },
      { id: "2.1.1.2", name: "Time", value: "10:00 AM", content: time, type: "text", isEditable: false },
      {
        id: "2.1.1.3",
        name: "Differential Pressure",
        content: "12/12/2",
        value: "Default Value",
        type: "Number",
        isEditable: true,
        
      },
      { id: "2.1.1.4", name: "Remark", value: "Default Value", content: "12/12/2", type: "text", isEditable: true },
      {
        id: "2.1.1.5",
        name: "Checked By",
        value: "Default Value",
        content: "Amit Guru",
        type: "text",
        isEditable: false,
      },
    ],
  },
];

// this data is old project data start

// export const formList = [
//   "Document Information",
//   "Chemistry SOP",
//   "Instrument SOP",
//   "Instrumental Chemistry SOP",
//   "Microbiology SOP",
//   "Good Laboratory Practices",
//   "Wet Chemistry",
//   "If Others",
//   "Training Information",
//   "Distribution & Retrieval",
//   "Print & Download Control",
//   "Activity Log",
// ];

// export const workFlow = [
//   "Opened",
//   "HOD Review",
//   "Pending QA Review",
//   "CFT/SME Review",
//   "Pending Change Implementation",
//   "Closed-Done",
// ];

// export const NotifyTo = [
//   { label: "Amit Guru (Originator)", value: "1" },
//   { label: "Shaleen Mishra (HOD)", value: "mango" },
//   { label: "Vikas Prajapati (Approver)", value: "2" },
//   { label: "Amit Patel (Reviewer)", value: "3" },
//   { label: "Anshul Patel (CFT) ", value: "4" },
// ];
// export const interpretationOfResult = {
//   label: "8.0 Interpretation of Result",
//   instruction: "",
//   required: false,
//   coloredLabel: true,
//   columnList: [
//     { id: "1", name: "Result", type: "text" },
//     { id: "2", name: "Interpretation", type: "text" },
//     { id: "3", name: "Time Restriction (Date)", type: "date" },
//     { id: "4", name: "Time Restriction (Time)", type: "time" },
//     { id: "5", name: "Precaution/Notes (If any)", type: "text" },
//   ],
// };
// export const criticalSteps = {
//   label: "8.0 Critical Steps",
//   instruction: "",
//   required: false,
//   coloredLabel: true,
//   columnList: [
//     { id: "1", name: "Step", type: "text" },
//     { id: "2", name: "Reasons", type: "text" },
//     { id: "3", name: "Expected Tests Outcomes", type: "text" },
//     { id: "4", name: "Acceptable values, if any", type: "text" },
//     { id: "5", name: "Attachment, if any", type: "file" },
//     { id: "6", name: "Remarks", type: "text" },
//   ],
// };
// export const referenceProcedures = {
//   label: "9.0 Reference Procedures/Forms",
//   instruction: "Related SOP's, QPS Forms etc.",
//   required: false,
//   coloredLabel: true,
//   columnList: [
//     { id: "2.1.1.1", name: "Title of Document", type: "text" },
//     { id: "2.1.1.2", name: "Attached File", type: "File" },
//     { id: "2.1.1.3", name: "Remark", type: "text" },
//   ],
// };
// export const approvers = [{ label: "Amit", value: "" }];
// export const responsibilities = [
//   { label: "Amit", value: "Amit" },
//   { label: "Manish", value: "Manish" },
//   { label: "Piyush", value: "piyush" },
// ];
// export const reviewers = [{ label: "Vikash", value: "" }];
// export const testData = {
//   label: "Test(0)",
//   instruction: <div></div>,
//   required: true,
//   columnList: [
//     { id: "2.1.1", name: "Question", type: "text" },
//     { id: "2.1.2", name: "Answer", type: "text" },
//     { id: "2.1.3", name: "Result", type: "text" },
//     { id: "2.1.4", name: "Comment", type: "text" },
//     { id: "2.1.5", name: "Remarks", type: "text" },
//   ],
// };

// export const Survey = {
//   label: "Survey(0)",
//   instruction: <div></div>,
//   required: true,
//   columnList: [
//     { id: "2.1.1", name: "Subject", type: "text" },
//     { id: "2.1.2", name: "Topic", type: "text" },
//     { id: "2.1.3", name: "Rating", type: "text" },
//     { id: "2.1.4", name: "Comment", type: "text" },
//     { id: "2.1.5", name: "Remarks", type: "text" },
//   ],
// };



// export const docDetails = {
//   label: "Distribution & Retrieval",
//   instruction: <div></div>,
//   required: true,
//   columnList: [
//     { id: "1", name: "Document Title", type: "text" },
//     { id: "2", name: "Document Number", type: "text" },
//     { id: "3", name: "Document Printed By", type: "text" },
//     { id: "4", name: "Document Printed on", type: "text" },
//     { id: "5", name: "Number of Print Copies", type: "text" },
//     { id: "6", name: "Issuance Date", type: "date" },
//     { id: "7", name: "Department/Location", type: "text" },
//     { id: "8", name: "Number of Issued Copies	", type: "text" },
//     { id: "9", name: "Reason for Issuance", type: "text" },
//     { id: "10", name: "Retrieval Date", type: "date" },
//     { id: "11", name: "Retrieved By", type: "text" },
//     { id: "12", name: "Retrieved Person Department", type: "text" },
//     { id: "13", name: "Number of Retrieved Copies", type: "number" },
//     { id: "14", name: "Reason for Retrieval", type: "text" },
//     { id: "15", name: "Remarks", type: "text" },
//   ],
// };

// export const PersonPrintPermission = [
//   { label: "Anshul Patel", value: "1" },
//   { label: "Shaleen", value: "shaleen" },
//   { label: "Amit", value: "2" },
//   { label: "Piyush", value: "Piyush" },
// ];
// export const PersonDownloadPermission = [
//   { label: "Anshul Patel", value: "1" },
//   { label: "Shaleen", value: "shaleen" },
//   { label: "Amit", value: "2" },
//   { label: "Piyush", value: "Piyush" },
// ];




// this data is old project data end
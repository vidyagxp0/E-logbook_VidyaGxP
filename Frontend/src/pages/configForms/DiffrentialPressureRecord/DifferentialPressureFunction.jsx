export const site = localStorage.getItem("site");
export const currentDate = new Date();
export const currentYear = currentDate.getFullYear();

const object = getCurrentDateTime();
export let time = object.currentTime;
export let date = object.currentDate;

function getCurrentDateTime() {
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; 
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const currentTime = `${hours}:${minutes} ${ampm}`;

  const year = now.getFullYear().toString().slice(-2); 
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const currentDate = `${month}/${day}/${year}`;

  return {
    currentTime: currentTime,
    currentDate: currentDate,
  };
}

let counter = 0;

function generateUniqueID() {
  if (counter === 9999) {
    counter = 0; 
  }
  counter++;
  return "UID" + counter.toString().padStart(4, "0");
}

const uniqueID = generateUniqueID();

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
      {
        id: "2.1.1.0",
        name: "Unique Id",
        value: "12/12/2",
        content: uniqueID,
        type: "text",
        isEditable: true,
      },
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
      {
        id: "2.1.1.0",
        name: "Unique Id",
        value: "",
        content: uniqueID,
        type: "text",
        isEditable: false,
      },
      {
        id: "2.1.1.1",
        name: "Date",
        value: "12/12/2",
        content: date,
        type: "date",
        isEditable: false,
      },
      {
        id: "2.1.1.2",
        name: "Time",
        value: "10:00 AM",
        content: time,
        type: "text",
        isEditable: false,
      },
      {
        id: "2.1.1.3",
        name: "Differential Pressure",
        content: "12/12/2",
        value: "Default Value",
        type: "Number",
        isEditable: true,
      },
      {
        id: "2.1.1.4",
        name: "Remark",
        value: "Default Value",
        content: "12/12/2",
        type: "text",
        isEditable: true,
      },
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

export const tableData = [
  {
    sNo: "1",
    description: "	Machine is switched OFF",
    observation: "",
    comments: "",
    doneBy: "",
  },
  {
    sNo: "2",
    description: "Hopper and constant amount feeder Cleaned",
    observation: "",
    comments: "",
    doneBy: "",
  },
  {
    sNo: "3",
    description:
      "	Scrapper assembly, ejection chute and powder scraper cleaned.	",
    observation: "",
    comments: "",
    doneBy: "",
  },
  {
    sNo: "4",
    description: "Powder conveying system, hosepipes and filter cleaned. 	",
    observation: "",
    comments: "",
    doneBy: "",
  },
  {
    sNo: "5",
    description: "Turret clean	",
    observation: "",
    comments: "",
    doneBy: "",
  },
  {
    sNo: "6",
    description: "Punches and dies cleaned.	",
    observation: "",
    comments: "",
    doneBy: "",
  },
  {
    sNo: "7",
    description: "Main compression and pre-compression rollers cleaned.	",
    observation: "",
    comments: "",
    doneBy: "",
  },
  {
    sNo: "8",
    description: "Turret clean	",
    observation: "",
    comments: "",
    doneBy: "",
  },
  {
    sNo: "9",
    description: "Machine platform cleaned.	",
    observation: "",
    comments: "",
    doneBy: "",
  },
  {
    sNo: "10",
    description: "Top and bottom side of the machine cleaned.",
    observation: "",
    comments: "",
    doneBy: "",
  },
  {
    sNo: "11",
    description: "All the screws, bolts and sensors cleaned.	",
    observation: "",
    comments: "",
    doneBy: "",
  },
];

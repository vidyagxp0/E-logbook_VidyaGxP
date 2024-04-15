export const site = localStorage.getItem("site");
export const currentDate = new Date();
export const currentYear = currentDate.getFullYear();

export const docFormFile = [
  {
    label: "File Attachment",
    instruction: "Add relevant attachments, if any.",
    coloredLabel: true,
    required: false,
    columnList: [
      { id: "2.1.1.0", name: "Description", type: "text" },
      { id: "2.1.1.1", name: "Observation", type: "radio" },
      { id: "2.1.1.2", name: "Comments", type: "text" },
      { id: "2.1.1.2", name: "Done By", type: "text" },
    ],
  },
];

export const responsibilities = [
  { label: "Amit", value: "Amit" },
  { label: "Manish", value: "Manish" },
  { label: "Piyush", value: "piyush" },
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

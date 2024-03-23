import React from "react";
import { Page, Text, Document, StyleSheet, Image, View } from "@react-pdf/renderer";
import { Font } from '@react-pdf/renderer';

// Import your font
import MyCustomFont from './Anton-Regular.ttf';

// Register the font
Font.register({
  family: 'Anton',
  src: MyCustomFont
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    border: "1px solid black", // Add border style here
  },
  maindiv: {
    border: "1px solid black",
    width: '100%',
    height:'99%'
  },
  watermark: {
 marginTop:'50%',
 marginLeft:'30%',
    textAlign:'center',
    position: 'absolute',
    opacity: 0.1,
    transform: 'rotate(-45deg)',
    fontSize: 40,
    color: 'gray',
    zIndex: 9999,
  },
  title: {
    margin: 20,
    fontSize: 16,
    textAlign: "justify",
    color: "blue",
    marginTop: 30,
    paddingBottom: '5px',
    borderBottom: '1.5px solid #efa035',
    fontWeight: 'bold', // Make the title bold
  },
  title2:{
    marginTop:'-30px',
    marginBottom:'25px',
    marginLeft: 20,
    marginRight: 20,
    fontSize: 14,
    textAlign: "justify",
    color: "blue",
    paddingBottom: '5px',
    borderBottom: '1.5px solid blue',
    fontWeight: 'bold', // Make the title bold
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    color: "blue",
  },
  header: {
    fontSize: 12,
    textAlign: "center",
    color: "black",
    width: '100%',
    height: "60px",
    borderCollapse: "collapse",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableRow: {
    flexDirection: "row",
  },

  tableCell: {
    flex: 1,
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderRight: "1px solid black",
    paddingRight: '1px'
  },
  tableCell5:{
    flex: 1,
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderLeft: "1px solid black",
    paddingRight: '1px'
  },
  tableCell4: {
    flex: 1,
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderLeft: "1px solid black",
    paddingRight: '1px'
  },
  tableCell6: {
    flex: 1,
    borderBottom: "1px solid black",
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderLeft: "1px solid black",
    paddingRight: '1px'
  },
  tableCellA: {
    flex: 1,
    borderBottom: "1px solid black",
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingRight: '1px'
  },
  tableCell1A: {
    flex: 1,
    borderBottom: "1px solid black",
    borderTop: "1px solid black",
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingRight: '1px'
  },
  tableCell3: {
    flex: 1,
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderRight: "none",
    paddingRight: '1px'
  },
  tableRow1: {
    flexDirection: "row",
    textAlign: 'center',
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
  },
 
  tableCell1: {
    borderRight: "1px solid black",
    flex: 1,
    padding: 18,
    paddingLeft: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 14,
  },
  tableCell2: {
    border: "1px solid black",
    width: '184px',
    height: '60px',
    border: "1px solid black",
  },
  pageNumber: {
 marginTop:'5px',
textAlign: "center",
fontSize:'10px',
    
  },
  leftdiv: {
    marginTop:'8px',
    width: '95%',
    display: 'flex',
    fontSize: '10px',
    paddingBottom:'25px',
    marginLeft:'25px',
    // marginBottom:'20px',
  },
 
leftAlignedText:{
    marginLeft:'5%',
   marginBottom:'30px',
   fontSize:'14px'
}


});

const Watermark = ({ text }) => (
    <View style={styles.watermark}>
      <Text>{text}</Text>
    </View>
  );
  

const Report = () => {
  const pages = [
    {
      title: 'Details',
      backgroundColor: 'white',
      leftAlignedText:'Department',   
      leftAlignedText1:'Compression Area with respect to Corridor',   
      leftAlignedText2:'Limt',   
      leftAlignedText3:'Month',   
      leftAlignedText4:'Review By :-',   
      leftAlignedText5:'Review Comments',   



 
},
  //  {
  //   title: 'Investigation Details',
  //   text: 'This is the second page.',
  //   backgroundColor: 'white',
  //   title2: 'Attachments',
  //   leftAlignedText:'Investigation Details ',   
  //   leftAlignedText1:'Action Taken',   
  //   leftAlignedText2:'Currective Action',   
  //   leftAlignedText3:'QA Review Comments',   
  //   leftAlignedText4:'Effectiveness Check required? ',   
  //   leftAlignedText5:'Conclusion',   
  //   leftAlignedTextB:'Root Cause',
  //   leftAlignedTextC:'Preventive Action ',
  //   leftAlignedTextD:'QA Head/Designee Comments',
  //   leftAlignedTextE:'Incident Types',

  //   leftAlignedText8:'Initial Attachment ',  
  //   leftAlignedText9:'Attachment',   
  //   leftAlignedText10:'Inv Attachment',   
  //   leftAlignedText11:'CAPA Attachment',   
  //   },
  
  ];

  return (
    <Document>
      {pages.map((page, index) => (
        <Page key={index} style={{ ...styles.page, backgroundColor: page.backgroundColor }}>
          <Watermark
            fit="scale"
            opacity={0.1}
            content="VidyaGxP"
            fontSize={40}
            color="gray"
            angle={45}
            x={200}
            y={300}
            
          />
          <input type="text"/>
          <View style={styles.maindiv}>
             <Watermark text="VidyaGxp" />
            <View style={styles.header}>
              <View style={styles.tableRow1}>
                <Text style={styles.tableCell1}><Text style={{ margin: '20px', fontSize: '20px', textAlign: 'center' }}>Differential Pressure Record</Text> </Text>
                <Image style={{ width: 200, height: 200 }} src='/reportfilelogo.png' />
              </View>
            </View>
            <View style={styles.table}>
           
              <View style={styles.tableRow}>
                <View style={styles.tableCell}><Text style={{ fontSize: '12px' }}>Record Name:</Text></View>
                <View style={styles.tableCell}><Text style={{ fontSize: '12px' }}>Site:</Text></View>  
                <View style={styles.tableCell3}><Text style={{ fontSize: '12px' }}>Current Status:</Text></View>
                <View style={styles.tableCell5}><Text style={{ fontSize: '12px' }}>Initiated By:</Text></View>
              </View>
            </View>
            <Text style={styles.title}>{page.title}</Text>
            <View style={styles.leftdiv}>
                <Text  style={styles.leftAlignedText} >{page.leftAlignedText}</Text>
                <Text  style={styles.leftAlignedText} >{page.leftAlignedText1}</Text>
                <Text  style={styles.leftAlignedText} >{page.leftAlignedText2}</Text>
                <Text  style={styles.leftAlignedText} >{page.leftAlignedText3}</Text>
                </View> 
               
            <View style={styles.table}>
             <View style={styles.tableRow}>						
             <View style={styles.tableCell1A}><Text style={{ fontSize: '8px' }}>S no.</Text></View>
             <View style={styles.tableCell4}><Text style={{ fontSize: '8px' }}>Unique Id</Text></View> 
             <View style={styles.tableCell4}><Text style={{ fontSize: '8px' }}>Differential Pressure</Text></View>
             <View style={styles.tableCell4}><Text style={{ fontSize: '8px' }}>Remark</Text></View>
             <View style={styles.tableCell4}><Text style={{ fontSize: '8px' }}>Date</Text></View>
             <View style={styles.tableCell4}><Text style={{ fontSize: '8px' }}>Time</Text></View>
             <View style={styles.tableCell4}><Text style={{ fontSize: '8px' }}>Checked By</Text></View>
             <View style={styles.tableCell4}><Text style={{ fontSize: '8px' }}>Supporting Documents	</Text></View>
             <View style={styles.tableCell4}><Text style={{ fontSize: '8px' }}>Actions</Text></View>
      </View>
         </View>
         <View style={styles.table}>
             <View style={styles.tableRow}>						
             <View style={styles.tableCellA}><Text style={{ fontSize: '8px' }}>  </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>  </Text></View> 
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>  </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>  </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>   </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>   </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>   </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>   </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>   </Text></View>
      </View>
         </View>
         <View style={styles.table}>
             <View style={styles.tableRow}>						
             <View style={styles.tableCellA}><Text style={{ fontSize: '8px' }}>  </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>  </Text></View> 
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>  </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>  </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>   </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>   </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>   </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>   </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>   </Text></View>
      </View>
         </View>
         <View style={styles.table}>
             <View style={styles.tableRow}>						
             <View style={styles.tableCellA}><Text style={{ fontSize: '8px' }}>  </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>  </Text></View> 
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>  </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>  </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>   </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>   </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>   </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>   </Text></View>
             <View style={styles.tableCell6}><Text style={{ fontSize: '8px' }}>   </Text></View>
      </View>
       </View>
        
           <View style={styles.leftdiv}>
                <Text  style={styles.leftAlignedText} >{page.leftAlignedText4}</Text>
                <Text  style={styles.leftAlignedText} >{page.leftAlignedText5}</Text>
                </View>      
          </View>
          
          <Text
            style={styles.pageNumber}

            render={({ pageNumber, totalPages }) =>
             `Page ${pageNumber} of ${totalPages}`
            }
          />
        </Page>
      ))}
    </Document>
  );
};

export default Report;






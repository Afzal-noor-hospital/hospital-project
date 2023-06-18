const { app, BrowserWindow, screen, ipcMain, Menu, powerMonitor, shell, dialog } = require('electron')
const {initializeApp} = require("firebase/app");
const {getDatabase, ref, set, get, remove, onValue} = require("firebase/database");
const package_json = require("./package.json")
const writer = require("exceljs");
const fs = require("fs");

const firebaseConfig = {
  apiKey: "AIzaSyD7avof426AbkWj3vPJV7pED7IRIAylg9g",
  authDomain: "afzal-noor-trust.firebaseapp.com",
  projectId: "afzal-noor-trust",
  storageBucket: "afzal-noor-trust.appspot.com",
  messagingSenderId: "988039714855",
  appId: "1:988039714855:web:80170b7d44fb7976d3d602",
  measurementId: "G-FJCK67WRXE"
};

let main=null,
loginProfile=null;
let months_array = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


const indexWindow = () => {
  let { width, height } = screen.getPrimaryDisplay().workAreaSize
  main = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    height: height,
    width: width,
    icon: process.cwd() + '/public/res/icon.png',
  })
  main.maximize()
  // Menu.setApplicationMenu(null);
  main.loadFile(process.cwd() + '/public/html/login.html')
  main.on('close', () => {
    if(loginProfile)
      set(ref(database, `staff/${loginProfile.id}/status`), "offline");
    if(is_update_downloaded && update_file_name!==""){
      console.log("running installer...");
      shell.openPath(update_file_name).then((val) => {});
      update_file_name="";
    }
    app.quit();
  })
}

app.on('ready', indexWindow)

let firebaseApp=initializeApp(firebaseConfig);
let database=getDatabase(firebaseApp);

ipcMain.on("get-version", (event, reply_id) => {
  event.reply(reply_id, package_json.version);
})

ipcMain.on("reset-middleware", (event, password) => {
  if(password){
    set(ref(database, `staff/${loginProfile.id}/password`), password).then((val) => {
      loginProfile.password=password
      laod_portal();
    }).catch((e) => {
      event.reply("reset-middleware-result", "Please check your connection and try again.");
    })
  }
})

ipcMain.on("login", (event, data) => {
  get(ref(database, `/staff/${data.username}`)).then((snapshot) => {
    let value=snapshot.val();
    if(value){
      if(value.password===data.password){
        set(ref(database, `staff/${data.username}/status`), "online").then((res) => {
          loginProfile=value;
          laod_portal();
        }).catch((e) => {
          event.reply("login-result", "Internet Connection Error")
        })
      }else{
        event.reply("login-result", "Incorrect Password");
      }
    }else{
      event.reply("login-result", "Such username not exists");
    }
  }).catch((e) => {
    event.reply("login-result", "Internet Connection Error");
  })
});

ipcMain.on("logout", (event, data) => {
  if(main){
    set(ref(database, `staff/${data}/status`), "offline").then((val) => {
      event.reply("logout-result", false, "");
      if(loginProfile.id===data)  
        main.loadFile(process.cwd()+"/public/html/login.html");
    }).catch((e) => {
      event.reply("logout-result", true, "Cannot logout. Please check your internet and try again");
    })
  }
})

ipcMain.on("staff-deleted", (event, data) => {
  main.loadFile(process.cwd()+"/public/html/login.html");
})


ipcMain.on("insert", (event, path, data, reply_id) => {
  set(ref(database, path), data).then((val) => {
    event.reply(reply_id, true);
  }).catch((e) => {
    event.reply(reply_id, false);
  })
})
ipcMain.on("update", (event, path, data, reply_id) => {
  set(ref(database, path), data).then((val) => {
    event.reply(reply_id, true);
  }).catch((e) => {
    event.reply(reply_id, false);
  })
})
ipcMain.on("delete", (event, path, reply_id) => {
  remove(ref(database, path)).then((val) => {
    event.reply(reply_id, true);
  }).catch((e) => {
    event.reply(reply_id, false);
  })
})
ipcMain.on("fetch", (event, path, reply_id) => {
  get(ref(database, path)).then((snapshot) => {
    event.reply(reply_id, false, loginProfile, snapshot.val());
  }).catch((e) => {
    console.log(e);
    event.reply(reply_id, true, null, "Internet Connection Error");
  })
})






ipcMain.on("write-excel-file", (event, staff, patients, appointments, original_patients_list, reply_id) => {
  write_excel_file(event, staff, patients, appointments, original_patients_list, reply_id);
});



const write_excel_file = async (event, staff=[], patients=[], appointments=[], patients_list=[], reply_id) => {
  if(appointments.length!=0){
      for(let i=0; i<appointments.length; i++){
          for(let j=i+1; j<appointments.length; j++){
              if(appointments[i].app_time<appointments[j].app_time){
                  let temp = appointments[i];
                  appointments[i]=appointments[j];
                  appointments[j]=temp;
              }
          }
      }
  }


  if(staff.length+patients.length+appointments.length===0){
      hide_loader();
      show_notification("There is no data to write in a file", true);
      setTimeout(() => {
          hide_notification();
      }, 5500);
      return;
  }

  let row=1;
  let wbook = new writer.Workbook();
  let sheet = wbook.addWorksheet("Sheet 1");

  // writting heading for total records...
  sheet.getCell(`A${row}`).value="Total Records";
  sheet.getCell(`A${row}`).font={size: 25, bold: true};
  sheet.getCell(`A${row}`).alignment={vertical: "middle", horizontal: "center"};
  sheet.mergeCells(`A${row}:H${row+2}`);
  sheet.getCell(`I${row}`).value=staff.length+patients.length+appointments.length;
  sheet.getCell(`I${row}`).font={size: 25, bold: true}
  sheet.getCell(`I${row}`).alignment={vertical: "middle", horizontal: "center"};
  sheet.mergeCells(`I${row}:K${row+2}`);
  row+=3;


  // writting staff size there...
  if(staff.length!=0){
      sheet.getCell(`A${row}`).value="Total Staff";
      sheet.getCell(`A${row}`).font={size: 20, bold: true}
      sheet.getCell(`A${row}`).alignment={vertical: "middle", horizontal: "center"} 
      sheet.mergeCells(`A${row}:D${row+3}`);

      let total_admins=0;
      let total_doctors=0;
      let total_receptionists=0;
      let total_pharmacists=0;
      for(i of staff){
        if(i.role==="Admin")
          total_admins++;
        else if(i.role==="Doctor")
          total_doctors++;
        else if(i.role==="Receptionist")
          total_receptionists++;
        else if(i.role==="Pharmacist")
          total_pharmacists++;
      }

      sheet.getCell(`E${row}`).value="Total Admins";
      sheet.getCell(`E${row}`).font={size: 15, bold: false}
      sheet.getCell(`E${row}`).alignment={vertical: "middle", horizontal: "left"} 
      sheet.mergeCells(`E${row}:H${row}`)
      sheet.getCell(`I${row}`).value=total_admins;
      sheet.getCell(`I${row}`).font={size: 15, bold: false}
      sheet.getCell(`I${row}`).alignment={vertical: "middle", horizontal: "center"} 


      sheet.getCell(`E${row+1}`).value="Total Doctors";
      sheet.getCell(`E${row+1}`).font={size: 15, bold: false}
      sheet.getCell(`E${row+1}`).alignment={vertical: "middle", horizontal: "left"} 
      sheet.mergeCells(`E${row+1}:H${row+1}`)
      sheet.getCell(`I${row+1}`).value=total_doctors;
      sheet.getCell(`I${row+1}`).font={size: 15, bold: false}
      sheet.getCell(`I${row+1}`).alignment={vertical: "middle", horizontal: "center"} 


      sheet.getCell(`E${row+2}`).value="Total Receptionists";
      sheet.getCell(`E${row+2}`).font={size: 15, bold: false}
      sheet.getCell(`E${row+2}`).alignment={vertical: "middle", horizontal: "left"} 
      sheet.mergeCells(`E${row+2}:H${row+2}`)
      sheet.getCell(`I${row+2}`).value=total_receptionists;
      sheet.getCell(`I${row+2}`).font={size: 15, bold: false}
      sheet.getCell(`I${row+2}`).alignment={vertical: "middle", horizontal: "center"} 


      sheet.getCell(`E${row+3}`).value="Total Pharmacists";
      sheet.getCell(`E${row+3}`).font={size: 15, bold: false}
      sheet.getCell(`E${row+3}`).alignment={vertical: "middle", horizontal: "left"} 
      sheet.mergeCells(`E${row+3}:H${row+3}`)
      sheet.getCell(`I${row+3}`).value=total_pharmacists;
      sheet.getCell(`I${row+3}`).font={size: 15, bold: false}
      sheet.getCell(`I${row+3}`).alignment={vertical: "middle", horizontal: "center"} 


      sheet.getCell(`J${row}`).value=total_admins+total_doctors+total_receptionists+total_pharmacists;
      sheet.getCell(`J${row}`).font={size: 20, bold: true}
      sheet.getCell(`J${row}`).alignment={vertical: "middle", horizontal: "center"}
      sheet.mergeCells(`J${row}:K${row+3}`);
      row+=4;
  }

  // writting appointments size there ...
  if(appointments.length!=0){
      sheet.getCell(`A${row}`).value="Total Appointments";
      sheet.getCell(`A${row}`).font={size: 20, bold: true}
      sheet.getCell(`A${row}`).alignment={vertical: "middle", horizontal: "center"} 
      sheet.mergeCells(`A${row}:H${row+2}`);

      sheet.getCell(`I${row}`).value=appointments.length;
      sheet.getCell(`I${row}`).font={size: 20, bold: true}
      sheet.getCell(`I${row}`).alignment={vertical: "middle", horizontal: "center"} 
      sheet.mergeCells(`I${row}:K${row+2}`);
      row+=3;
  }

  // writting patients size there ...
  if(patients.length!=0){
      sheet.getCell(`A${row}`).value="Total Patients";
      sheet.getCell(`A${row}`).font={size: 20, bold: true}
      sheet.getCell(`A${row}`).alignment={vertical: "middle", horizontal: "center"} 
      sheet.mergeCells(`A${row}:H${row+2}`);

      sheet.getCell(`I${row}`).value=patients.length;
      sheet.getCell(`I${row}`).font={size: 20, bold: true}
      sheet.getCell(`I${row}`).alignment={vertical: "middle", horizontal: "center"} 
      sheet.mergeCells(`I${row}:K${row+2}`);
      row+=3;
  }


  row+=2;
  // writting all staffs row by row...
  if(staff.length!=0){
      sheet.getCell(`A${row}`).value="Staff List";
      sheet.getCell(`A${row}`).font={bold: true, size: 35}
      sheet.getCell(`A${row}`).alignment={vertical: "middle", horizontal: "center"};
      sheet.mergeCells(`A${row}:X${row+3}`);

      row+=4;

      // generating heading row for data...
      sheet.getCell(`A${row}`).value="ID";
      sheet.getCell(`C${row}`).value="First Name";
      sheet.getCell(`E${row}`).value="Last Name";
      sheet.getCell(`G${row}`).value="Father Name";
      sheet.getCell(`I${row}`).value="Gender";
      sheet.getCell(`K${row}`).value="DOB";
      sheet.getCell(`M${row}`).value="Contact";
      sheet.getCell(`O${row}`).value="CNIC";
      sheet.getCell(`Q${row}`).value="Appointment Date";
      sheet.getCell(`S${row}`).value="Role";
      sheet.getCell(`U${row}`).value="Address";
      sheet.getCell(`U${row}`).font={size: 16, bold: true};
      sheet.getCell(`U${row}`).alignment={vertical: "middle", horizontal: "center", wrapText: true};
      sheet.mergeCells(`U${row}:X${row+2}`);
      for(let i=0; i<20; i+=2){
          let col = String.fromCharCode("A".charCodeAt(0)+i);
          sheet.getCell(`${col}${row}`).font={size: 16, bold: true};
          sheet.getCell(`${col}${row}`).alignment={vertical: "middle", horizontal: "center", wrapText: true};
          let next_col = String.fromCharCode(col.charCodeAt(0)+1);
          sheet.mergeCells(`${col}${row}:${next_col}${row+2}`);
      }


      row+=3;
      // writting original data here...
      let keys=['id', 'first_name', 'last_name', 'father_name', 'gender', 'dob', 'contact', 'cnic', 'app_date', 'role', 'address'];
      for(i of staff){
          let col='A';
          for(j of keys){
              if(j==="app_date"){
                  let app_d = new Date(i[j]);
                  let date=`${app_d.getDate()} ${months_array[app_d.getMonth()]} ${app_d.getFullYear()}`;
                  sheet.getCell(`${col}${row}`).value=date;
              }else if(j==="dob"){
                  let [y, m, d] = i[j].split("-");
                  let date = `${d} ${months_array[parseInt(m)-1]} ${y}`;
                  sheet.getCell(`${col}${row}`).value=date;
              }else{
                  sheet.getCell(`${col}${row}`).value=i[j];
              }
              sheet.getCell(`${col}${row}`).font={size: 15, bold: false};
              sheet.getCell(`${col}${row}`).alignment={vertical:"middle", horizontal: "left", wrapText: true};
              let prev_col=col;
              let extension=1;
              if(j==='address')
                  extension=3;
              col = String.fromCharCode(col.charCodeAt(0)+extension);
              sheet.mergeCells(`${prev_col}${row}:${col}${row}`);
              col = String.fromCharCode(col.charCodeAt(0)+1);
          }
          row++;
      }
      row+=2;
  } 

  // writting all appointments row by row...
  if(appointments.length!=0){
      sheet.getCell(`A${row}`).value="Appointments List";
      sheet.getCell(`A${row}`).font={bold: true, size: 35}
      sheet.getCell(`A${row}`).alignment={vertical: "middle", horizontal: "center"};
      sheet.mergeCells(`A${row}:AP${row+3}`);

      row+=4;

      // writting heading line for data...
      sheet.getCell(`A${row}`).value="Appointment ID";
      sheet.getCell(`C${row}`).value="Patient ID";
      sheet.getCell(`E${row}`).value="First Name";
      sheet.getCell(`G${row}`).value="Last Name";
      sheet.getCell(`I${row}`).value="Father Name";
      sheet.getCell(`K${row}`).value="Blood Group";
      sheet.getCell(`M${row}`).value="Gender";
      sheet.getCell(`O${row}`).value="Marital Status";
      sheet.getCell(`Q${row}`).value="Contact";
      sheet.getCell(`S${row}`).value="CNIC";
      sheet.getCell(`U${row}`).value="Appointment Time";
      sheet.getCell(`W${row}`).value="Doctor ID";
      sheet.getCell(`Y${row}`).value="Diagnosis";
      sheet.getCell(`AA${row}`).value="Precautions";
      sheet.getCell(`AE${row}`).value="Tests";
      sheet.getCell(`AI${row}`).value="Prescriptions";
      sheet.getCell(`AM${row}`).value="Address";
      for(let i=0; i<26; i+=2){
          let col = String.fromCharCode("A".charCodeAt(0)+i)
          sheet.getCell(`${col}${row}`).font={size: 16, bold: true};
          sheet.getCell(`${col}${row}`).alignment={vertical:"middle", horizontal:"center", wrapText:true};
          let next_col = String.fromCharCode(col.charCodeAt(0)+1);
          sheet.mergeCells(`${col}${row}:${next_col}${row+2}`);
      }
      for(let i=0; i<16; i+=4){
          let col = "A"+String.fromCharCode("A".charCodeAt(0)+i)
          sheet.getCell(`${col}${row}`).font={size: 16, bold: true};
          sheet.getCell(`${col}${row}`).alignment={vertical:"middle", horizontal:"center", wrapText:true};
          let next_col = "A"+String.fromCharCode(col.charCodeAt(1)+3);
          sheet.mergeCells(`${col}${row}:${next_col}${row+2}`);
      }

      row+=3;

      let keys = ["app_id","id","first_name","last_name","father_name","blood_group","gender","marital_status","contact","cnic","app_time","doctor_id","diagnosis","precautions","tests","prescriptions","address"];

      for(i of appointments){
          let patient=null;
          for(j of patients_list){
              if(j.id===i.id){
                  patient=j;
                  break;
              }
          }
          if(patient){
              let tests = JSON.parse(i[keys[14]]);
              let prescriptions = JSON.parse(i[keys[15]]);
              let extenstion=0
              if(tests.length<prescriptions.length)
                  extenstion=prescriptions.length-1;
              else if(prescriptions.length<tests.length)
                  extenstion=tests.length-1;

              sheet.getCell(`A${row}`).value=i[keys[0]];
              sheet.getCell(`C${row}`).value=i[keys[1]];
              sheet.getCell(`E${row}`).value=i[keys[2]];
              sheet.getCell(`G${row}`).value=i[keys[3]];
              sheet.getCell(`I${row}`).value=patient[keys[4]];
              sheet.getCell(`K${row}`).value=patient[keys[5]];
              sheet.getCell(`M${row}`).value=patient[keys[6]];
              sheet.getCell(`O${row}`).value=patient[keys[7]];
              sheet.getCell(`Q${row}`).value=patient[keys[8]];
              sheet.getCell(`S${row}`).value=patient[keys[9]];
              let app_time = new Date(i[keys[10]]);
              let time = `${app_time.getDate()} ${months_array[app_time.getMonth()]} ${app_time.getFullYear()}, ${app_time.getHours()}:${app_time.getMinutes()}:${app_time.getSeconds()}`;
              sheet.getCell(`U${row}`).value=time;
              sheet.getCell(`W${row}`).value=i[keys[11]];
              sheet.getCell(`Y${row}`).value=i[keys[12]];
              sheet.getCell(`AA${row}`).value=i[keys[13]];
              for(let j=0; j<tests.length; j++){
                  let test = tests[j];
                  if(typeof(test[Object.keys(test)[0]])===typeof([]))
                      sheet.getCell(`AE${row+j}`).value=`${Object.keys(test)[0]}: [REPORT]`;
                  else
                      sheet.getCell(`AE${row+j}`).value=`${Object.keys(test)[0]}: ${test[Object.keys(test)[0]]}`;
              }
              for(let j=0; j<prescriptions.length; j++){
                  let prescription = prescriptions[j];
                  sheet.getCell(`AI${row+j}`).value=`Name: ${prescription['name']}, Quantity: ${prescription['quantity']}, timmings: ${prescription['timmings']}`;
              }
              sheet.getCell(`AM${row}`).value=patient[keys[16]];
              for(let i=0; i<26; i+=2){
                  let col = String.fromCharCode("A".charCodeAt(0)+i)
                  if(col==='U'){
                      sheet.getCell(`${col}${row}`).font={size: 12, bold: false};
                  }else{
                      sheet.getCell(`${col}${row}`).font={size: 15, bold: false};
                  }
                  sheet.getCell(`${col}${row}`).border={bottom:{style: "thick", color: {argb: "00000000"}}}
                  sheet.getCell(`${col}${row}`).alignment={vertical:"middle", horizontal:"center", wrapText:true};
                  let next_col = String.fromCharCode(col.charCodeAt(0)+1);
                  sheet.mergeCells(`${col}${row}:${next_col}${row+extenstion}`);
              }
              for(let i=0; i<16; i+=4){
                  let col = "A"+String.fromCharCode("A".charCodeAt(0)+i)
                  let next_col = "A"+String.fromCharCode(col.charCodeAt(1)+3);
                  if(i===4 || i===8){
                      sheet.getCell(`${col}${row+extenstion}`).border={bottom:{style: "thick"}}
                      for(let i=0; i<=extenstion; i++){
                          sheet.getCell(`${col}${row+i}`).font={size: 12, bold: false};
                          sheet.mergeCells(`${col}${row+i}:${next_col}${row+i}`);
                      }
                  continue
                  }
                  sheet.getCell(`${col}${row}`).font={size: 15, bold: false};
                  sheet.getCell(`${col}${row}`).alignment={vertical:"middle", horizontal:"center", wrapText:true};
                  sheet.getCell(`${col}${row}`).border={bottom:{style: "thick"}}
                  sheet.mergeCells(`${col}${row}:${next_col}${row+extenstion}`);
              }
              row+=(extenstion+1);
          }
      }
  }

  // writting all patients row by row...
  if(patients.length!=0){
      row+=2;
      sheet.getCell(`A${row}`).value="Patients List";
      sheet.getCell(`A${row}`).font={bold: true, size: 35}
      sheet.getCell(`A${row}`).alignment={vertical: "middle", horizontal: "center"};
      sheet.mergeCells(`A${row}:X${row+3}`);

      row+=4;

      // writting heading line for data...
      sheet.getCell(`A${row}`).value="Patient ID";
      sheet.getCell(`C${row}`).value="First Name";
      sheet.getCell(`E${row}`).value="Last Name";
      sheet.getCell(`G${row}`).value="Father Name";
      sheet.getCell(`I${row}`).value="DOB";
      sheet.getCell(`K${row}`).value="Blood Group";
      sheet.getCell(`M${row}`).value="Gender";
      sheet.getCell(`O${row}`).value="Marital Status";
      sheet.getCell(`Q${row}`).value="Contact";
      sheet.getCell(`S${row}`).value="CNIC";
      sheet.getCell(`U${row}`).value="Address";
      for(let i=0; i<=20; i+=2){
          let col = String.fromCharCode("A".charCodeAt(0)+i);
          sheet.getCell(`${col}${row}`).font={size: 16, bold: true};
          sheet.getCell(`${col}${row}`).alignment={vertical:"middle", horizontal:"center", wrapText:true};
          let next_col;
          if(i===20){
              next_col = String.fromCharCode(col.charCodeAt(0)+3);
          }else{
              next_col = String.fromCharCode(col.charCodeAt(0)+1);
          }
          sheet.mergeCells(`${col}${row}:${next_col}${row+2}`);
      }

      row+=3;

      // writting original data...
      let keys=['id','first_name','last_name','father_name','dob','blood_group','gender','marital_status','contact','cnic','address'];
      for(i of patients){
          let col='A';
          for(j of keys){
              if(j==="dob"){
                  let [y,m,d]=i[j].split("-");
                  let dob = `${d} ${months_array[parseInt(m)-1]} ${y}`;
                  sheet.getCell(`${col}${row}`).value=dob;
              }else{
                  sheet.getCell(`${col}${row}`).value=i[j];
              }
              sheet.getCell(`${col}${row}`).font={size: 15, bold: false};
              sheet.getCell(`${col}${row}`).alignment={vertical:"middle", horizontal:"left", wrapText:true};
              let next_col;
              if(j==="address"){
                  next_col = String.fromCharCode(col.charCodeAt(0)+3);
              }else{
                  next_col = String.fromCharCode(col.charCodeAt(0)+1);
              }
              sheet.mergeCells(`${col}${row}:${next_col}${row}`);
              col = String.fromCharCode(col.charCodeAt(0)+2);
          }
          row++;
      }
  }


  dialog.showSaveDialog(main).then((path) => {
    path = path.filePath;
    if(path){
      if(path.split(".").pop()!=="xlsx"){
        path+=".xlsx";
      }
      wbook.xlsx.writeFile(path).then((val) => {
        event.reply(reply_id, "ok");
      }).catch((e) => {
        event.reply(reply_id, "File Cannot written on the specified path");        
      });
    }else{
      event.reply(reply_id, "Path cannot be choosen by the user. Please try again");      
    }
  }).catch((e) => {
    event.reply(reply_id, "Path cannot be choosen by the system. Please try again")
  });
}





onValue(ref(database, "/"), (snapshot) => {
  if(main)
    main.webContents.send("live-value-update-captured", snapshot.val());
})



const laod_portal = () => {
  if(loginProfile.password==="0000000")
    main.loadFile(process.cwd()+"/public/html/reset-middleware.html");
  else if(loginProfile.role==="Admin")
    main.loadFile(process.cwd()+"/public/html/admin-portal.html");
  else if(loginProfile.role==="Receptionist") 
    main.loadFile(process.cwd()+"/public/html/receptionist-portal.html"); 
  else if(loginProfile.role==="Pharmacist") 
    main.loadFile(process.cwd()+"/public/html/pharmacist-portal.html"); 
  else if(loginProfile.role==="Doctor") 
    main.loadFile(process.cwd()+"/public/html/doctor-portal.html"); 
}




powerMonitor.on("lock-screen", (e) => {
  if(main && loginProfile){
    set(ref(database, `staff/${loginProfile.id}/status`), "offline").then((val) => {
      main.loadFile(process.cwd()+"/public/html/login.html");
    });
  }
});




let request_count=0;
let is_update_downloaded=false;
let update_file_name="";

const get_updates = async () => {
  // latest.yml file format:
  // version: 1.0.0
  // name: "filename.exe"
  // description: "this is a release"
  // url: "https://afzalnoortrust.000webhostapp.com/latest.yml"

  fetch("https://afzalnoortrust.000webhostapp.com/latest.yml").then((res) => {
    if(res.ok){
      return res.text();
    }else{
      request_count++;
      if(request_count!=3){
        get_updates();
      }
    }
  }).then((val) => {
    if(check_version(val)){
      console.log("Update avaiable");
      let file_name = val.split("\r\n")[1].split(":")[1].trim();
      file_name = file_name.substring(1, file_name.length-1);
      update_file_name=file_name;
      let fileURL = val.split("\r\n")[3];
      fileURL = fileURL.substring(4, fileURL.length).trim();
      fileURL = fileURL.substring(1, fileURL.length-1);
      
      fetch(fileURL).then((res) => {
        if(res.ok){
          return res.arrayBuffer();
        }else{
          request_count++;
          if(request_count!=3){
            get_updates();
          }
        }
      }).then((val) => {
        console.log("download conplete");
        fs.writeFile(file_name, Buffer.from(val), (e) => {
          if(!e) {
            console.log("file written successfully");
            is_update_downloaded=true;
          }
        });
      }).catch((e) => {
        request_count++;
        console.log("Error Caught");
        if(request_count!=3)
          get_updates();
      })
    }else{
      console.log("no update available")
    }
    request_count=0;

  }).catch((e) => {
    request_count++;
    console.log("Error Caught");
    if(request_count!=3)
      get_updates();
  });
}

const check_version = (data) => {
  data = data.split("\r\n");
  let current_version = version_to_int(package_json.version);
  let latest_version = version_to_int(data[0].split(":")[1]);

  if(latest_version > current_version)
    return true;
  return false;
}

const version_to_int = (version) => {
  let version_int = 0;
  for(i of version){
    if(i>='0' && i<='9')
      version_int = (version_int*10) + (i-'0');
  }
  return version_int;
}

get_updates();

const { app, BrowserWindow, screen, ipcMain, Menu, powerMonitor, shell, dialog } = require('electron')
const {initializeApp} = require("firebase/app");
const {getDatabase, ref, set, get, remove, onValue} = require("firebase/database");
const package_json = require("./package.json")
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



ipcMain.on("get-path", (event, reply_id) => {
  dialog.showSaveDialog(main).then((val) => {
    event.reply(reply_id, val.filePath);
  }).catch((e) => {
    event.reply(reply_id, false);
  })
})




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

const writer = require("exceljs");


let profile=null,
admins_list=[],
doctors_list=[],
pharmacists_list=[],
receptionists_list=[],
patients_list=[],
appointments_list=[],
tests_list=[],
notifications=[];
let updateableProfile=null;
let active_card_tab="admin";

let appointment_filtered_id="",
appointment_filtered_name="",
appointment_filtered_range_from="",
appointment_filtered_range_to="",
appointment_filtered_status="",
appointment_filtered_order="";

let months_array = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];







let help_DOM = `<p class="bold" style="color: var(--neon-blue); text-align: center;">If any error occured which is unspecified, then please check your network connection and refersh your page</p>
    <h2>Shortcuts</h2>
    <p>
        <span class="bold">CTRL + L: </span>
        <span>Logout User</span>
    </p>
    <p>
        <span class="bold">CTRL + P: </span>
        <span>View your Profile</span>
    </p>
    <p>
        <span class="bold">ALT + CTRL + P: </span>
        <span>Change your Password</span>
    </p>
    <p>
        <span class="bold">CTRL + H: </span>
        <span>View Help</span>
    </p>
    <p>
        <span class="bold">N: </span>
        <span>Register New Staff</span>
    </p>
    <p>
        <span class="bold">F: </span>
        <span>Search any staff</span>
    </p>
    <p>
        <span class="bold">F5: </span>
        <span>Refresh Whole App</span>
    </p>
    <p>
        <span class="bold">Esc: </span>
        <span>Hide Active Dialog</span>
    </p>
    <h2>Procedures</h2>
    <p class="bold">How to Register New Staff:</p>
    <ul>
        <li>First of all open <b>Register New Staff</b> form by using + icon placed at top-right cornor or press N (ensure that focus is not at any other input).</li>
        <li>Fill all the fields in this form. No field(s) can be negligible.</li>
        <li>Assign unique ID to staff. Its best way is to use part of email before @ symbol.</li>
        <li>At last, click on the <b>Register</b> button which is located at bottom-right corner of dialog.</li>
    </ul>
    <p class="bold">How to View Profile:</p>
    <ul>
        <li>Open <b>Profile</b> dialog by using <i class="fa-solid fa-user"></i> icon placed at top-right cornor or press <b>CTRL + P</b>.</li>
        <li>Your profile is shown in readable mode.</li>
    </ul>
    <p class="bold">How to Change Password:</p>
    <ul>
        <li>Open <b>Change Password</b> dialog by using <i class="fa-solid fa-key"></i> icon placed at top-right cornor or press <b>ALT + CTRL + P</b>.</li>
        <li>Fill all the fields given there. (Ensure that new password cannot be in the form of Zero's)</li>
        <li>At last, click on <b>change</b> button to change password.</li>
    </ul>
    <p class="bold">How to Logout:</p>
    <ul>
        <li>Click on <i class="fa-solid fa-power-off"></i> icon placed at top-right cornor or press <b>CTRL + L</b>. If you use shortcut key then you will logout instantly.</li>
        <li><b>Logout confirmation</b> dialog appears.</li>
        <li>Click on <b>Logout</b> button to logout. (Its best practice to logout always and then close application)</li>
    </ul>
    <p class="bold">How to Search:</p>
    <ul>
        <li>Click on <b>Search Here</b> placed at top of page.</li>
        <li>Now search will occur from the active panel. If Doctor Panel active, then search will done in Admins, either he/she is online or offline.</li>
        <li>You can search by using ID or his/her name also.</li>
    </ul>
    <p class="bold">How to Reset Password:</p>
    <ul>
        <li>Click on the profile for which you want to reset password.</li>
        <li>A <b>Profile</b> dialog will appears with whole information. In this dialog, After role of user there is a link with name <b>Reset Password</b></li>
        <li>Click on <b>Reset Password</b>. Password will be reset to "0000000" (7 Zeros).</li>
    </ul>
    <p class="bold">How to Edit Profile:</p>
    <ul>
        <li>Click on the profile's <i class="fa-solid fa-edit"></i> button for whom you want to edit.</li>
        <li>An <b>Update Staff</b> dialog will appears with whole information. In this dialog, change required data</li>
        <li>Finally, click on <b>update</b> button.</li>
    </ul>
    <h3 style="color: var(--neon-blue);">In any severe issue, you can contact me on: 0349-9019007 (Whatsapp also)</h3>`;










/* getting all data from database */
if(check_network()){
    ipcRenderer.send("fetch", "/", "get-all-data");
    show_loader();
    ipcRenderer.on("get-all-data", (event, isError, prof, data) => {
        if(!isError){
            ipcRenderer.send("delete", `settings/password-requests/${prof.id}`, "deleting-request-for-forgot");
            separate_profiles(prof, data);
            populate_admin(false);
            update_cards();
        }else{
            show_notification(data, true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
        hide_loader();  
    })
}










/* supporting functions */
const edit_profile = (id) => {
    let currentProfile=null;
    if(active_card_tab==="admin"){
        for(i of admins_list){
            if(i.id===id && !currentProfile){
                currentProfile=i;
                break;
            }
        }
    }
    else if(active_card_tab==="doctor"){
        for(i of doctors_list){
            if(i.id===id && !currentProfile){
                currentProfile=i;
                break;
            }
        }
    }
    else if(active_card_tab==="receptionist"){
        for(i of receptionists_list){
            if(i.id===id && !currentProfile){
                currentProfile=i;
                break;
            }
        }
    }
    else if(active_card_tab==="pharmacist"){
        for(i of pharmacists_list){
            if(i.id===id && !currentProfile){
                currentProfile=i;
                break;
            }
        }
    }
    if(!currentProfile)
        return;
    
    updateableProfile=currentProfile

    let first_name_inp=document.querySelector(".update-staff-dialog .container input[name='first-name']"),
    last_name_inp=document.querySelector(".update-staff-dialog .container input[name='last-name']"),
    father_name_inp=document.querySelector(".update-staff-dialog .container input[name='father-name']"),
    username_lbl=document.querySelector(".update-staff-dialog .container label[name='username']"),
    number_inp=document.querySelector(".update-staff-dialog .container input[name='number']"),
    cnic_inp=document.querySelector(".update-staff-dialog .container input[name='cnic']"),
    dob_inp=document.querySelector(".update-staff-dialog .container input[name='dob']"),
    gender_inp=document.querySelector(".update-staff-dialog .container select[name='gender']"),
    role_inp=document.querySelector(".update-staff-dialog .container select[name='role']"),
    address_inp=document.querySelector(".update-staff-dialog .container textarea[name='address']"),
    update_btn = document.querySelector(".update-staff-dialog .controls button:last-child");

    first_name_inp.value=currentProfile.first_name;
    last_name_inp.value=currentProfile.last_name;
    father_name_inp.value=currentProfile.father_name;
    username_lbl.innerHTML=currentProfile.id;
    username_lbl.title=currentProfile.id;
    number_inp.value=currentProfile.contact;
    cnic_inp.value=currentProfile.cnic;
    dob_inp.value=currentProfile.dob;
    gender_inp.value=currentProfile.gender;
    role_inp.value=currentProfile.role;
    address_inp.value=currentProfile.address;
    show_dialog("update-staff-dialog")

    update_btn.addEventListener("click", (e) => {
        show_loader();
        let staffObj={
            first_name: first_name_inp.value,
            last_name: last_name_inp.value,
            father_name: father_name_inp.value,
            id: currentProfile.id,
            password: currentProfile.password,
            cnic: cnic_inp.value,
            contact: number_inp.value,
            dob: dob_inp.value,
            gender: gender_inp.value,
            role: role_inp.value,
            status: currentProfile.status,
            address: address_inp.value,
            app_date: currentProfile.app_date
        };
        ipcRenderer.send("insert", `staff/${updateableProfile.id}`, staffObj, "edit-profile-result");
        ipcRenderer.once("edit-profile-result", (event, res) => {
            hide_loader();
            if(res){
                hide_dialog(document.querySelector(".update-staff-dialog .cancel"));
                show_notification("Data updated Successfully");
                setTimeout(() => {
                    hide_notification();
                }, 5500);
            }else{
                show_notification("Data cannot updated. Please check your connection and try again", true);
                setTimeout(() => {
                    hide_notification();
                }, 5500);
            }
            updateableProfile=null;
        })
    })
}

const separate_profiles=(prof, data) => {
    profile=prof;
    admins_list=[],
    doctors_list=[],
    pharmacists_list=[],
    receptionists_list=[],
    patients_list=[],
    appointments_list=[];

    if(!data)
        return;

    if(data['staff']){
        let staff_data=data['staff'];
        for(i of Object.keys(staff_data)){
            let staffObj=staff_data[i];
            if(staffObj.role==="Admin")
                admins_list.push(staffObj);
            else if(staffObj.role==="Doctor")
                doctors_list.push(staffObj);
            else if(staffObj.role==="Receptionist")
                receptionists_list.push(staffObj);
            else if(staffObj.role==="Pharmacist")
                pharmacists_list.push(staffObj);
        }
    }

    if(data['patients']){
        let patients=data['patients'];
        for(i of Object.keys(patients)){
            patients_list.push(patients[i]);
        }
    }

    if(data['appointments']){
        let appointments=data['appointments'];
        for(i of Object.keys(appointments)){
            appointments_list.push(appointments[i]);
        }
    }

    // separating tests from data...
    tests_list=[];
    if(data['settings'] && data['settings']['prices']){
        let tests=data['settings']['prices'];
        for(i of Object.keys(tests)){
            tests_list.push(tests[i])
        }
    }


    // separating notifications from data...
    notifications=[];
    if(data['settings'] && data['settings']['password-requests']){
        let reset_notifications=data['settings']['password-requests'];
        for(i of Object.keys(reset_notifications)){
            notifications.push(reset_notifications[i]);
        }
    }

    populate_notifications();
    populate_tests();
    populate_patients();
    populate_appointments();
}

const reset_password = (username) => {
    show_loader();
    ipcRenderer.send("insert", `staff/${username}/password`, "0000000", "password-reset-request-result");
    ipcRenderer.on("password-reset-request-result", (event, res) => {
        if(res){
            ipcRenderer.send("delete", `settings/password-requests/${username}`, "deleteing-resolved-request");
            ipcRenderer.on("deleteing-resolved-request", (event, res) => {
                if(res){
                    hide_loader();
                    show_notification("Password Reset successfully");
                    setTimeout(() => {
                        hide_notification();
                    }, 5500);
                }else{
                    hide_loader();
                    show_notification("Password cannot Reset", true);
                    setTimeout(() => {
                        hide_notification();
                    }, 5500);
                }
            });
        }else{
            hide_loader();
            show_notification("Password cannot Reset", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    })
};

const populate_tests = () => {
    let test_elem=document.querySelector(".expanded-tests");
    test_elem.innerHTML=`<button class="add-new" onclick="show_dialog('add_new_test_dialog');">Add New Test</button>`;
    for(i of tests_list){
        let test_name="";
        for(j of i.name){
            if(j==='-')
                test_name+=" ";
            else
                test_name+=j;
        }

        test_elem.innerHTML+=`<div class="${i.type==='Basic'?'basic': ''}">
            <span class='bold'>${test_name}</span>
            <span>${i.price} Rs/-</span>
            <div class='controls'>
                <button style='--clr: var(--neon-blue);' onclick="update_test_dialog('${i.name}');"><i class='fa-solid fa-edit'></i></button>
                <button style='--clr: red;' onclick="delete_test('${i.name}');"><i class='fa-solid fa-trash'></i></button>
            </div>
        </div>`;
    }        
}

const save_test = (hidding_elem) => {
    let test_name_inp=document.querySelector(".add_new_test_dialog .input input[name='test-name']"),
    test_price_inp=document.querySelector(".add_new_test_dialog .input input[name='test-price']"),
    test_type_inp=document.querySelector(".add_new_test_dialog .input select[name='test-type']");

    if(!test_price_inp.value)
        test_price_inp.value=0;
    if(!test_name_inp.value){
        show_notification("Fill empty field first", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        if(!test_name_inp.value)
            test_name_inp.focus();
        else if(!test_price_inp.value)
            test_price_inp.focus();
        return;
    }

    let oldVal=test_name_inp.value;
    let error=false;
    for(i of oldVal){
        if(!((i>='A' && i<='Z') || (i>='a' && i<='z') || (i>='0' && i<='9') || i===' ')){
            error=true;
            break;
        }
    }
    if(error){
        show_notification("Invalid test name. Special characters except Space not allowed.", true); 
        test_name_inp.focus();
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }


    for(i of tests_list){
        if(i.name.toLowerCase()===test_name_inp.value.toLowerCase()){
            show_notification("Test already exists", true);
            test_name_inp.focus();
            setTimeout(() => {
                hide_notification();
            }, 5500);
            return;
        }
    }

    for(i of test_price_inp.value){
        if(!(i>='0' && i<='9')){
            show_notification("Enter valid price in test price input", true);
            test_price_inp.focus();
            setTimeout(() => {
                hide_notification();
            }, 5500);
            return;
        }
    }

    show_loader();

    let test_name_minified="";
    for(i of test_name_inp.value){
        if(i===' ')
            test_name_minified+='-';
        else
            test_name_minified+=i;
    }

    let test_obj={
        name: test_name_minified,
        type: test_type_inp.value,
        price: test_price_inp.value
    };

    ipcRenderer.send("insert", `settings/prices/${test_obj.name}`, test_obj, "test-insertion-result");
    ipcRenderer.on("test-insertion-result", (event, res) => {
        hide_loader();
        if(res){
            show_notification("Test added successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
            hide_dialog(hidding_elem);
        }else{
            show_notification("Test could not add. Please try again.", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const update_test = (hidding_elem) => {
    let test_name=document.querySelector(".update_test_dialog .test-name").innerHTML,
    test_price=document.querySelector(".update_test_dialog input[name='test-price']"),
    test_type=document.querySelector(".update_test_dialog select[name='test-type']").value;

    if(!test_price.value){
        show_notification("Please fill empty fields first", true);
        test_price.focus();
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }

    let test_name_minified='';
    for(i of test_name){
        if(i===" ")
            test_name_minified+='-';
        else
            test_name_minified+=i;
    }

    let test_obj={
        name: test_name_minified,
        type: test_type,
        price: test_price.value
    };

    show_loader();
    ipcRenderer.send("insert", `settings/prices/${test_name_minified}`, test_obj, "prices-updated-result");
    ipcRenderer.on("prices-updated-result", (event, res) => {
        hide_loader();
        if(res){
            hide_dialog(hidding_elem);
            show_notification("Price updated successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            show_notification("Price cannot updated", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const delete_test = (test_name) => {
    ipcRenderer.send("delete", `settings/prices/${test_name}`, 'test-deletion-result');
    ipcRenderer.on("test-deletion-result", (event, res) => {
        if(res){
            show_notification("Test deleted successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            show_notification("Test cannot deleted. Please try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const show_patient_profile = (id) => {
    console.log(id);
}

const update_test_dialog = (test_name) => {
    let test_price_inp=document.querySelector(".update_test_dialog .input input[name='test-price']"),
    test_type_inp=document.querySelector(".update_test_dialog .input select[name='test-type']"),
    test_name_elem=document.querySelector(".update_test_dialog .test-name");

    let test_obj=null;
    for(i of tests_list){
        if(i.name===test_name){
            test_obj=i;
            break;
        }
    }
    
    let original_test_name="";
    for(j of test_obj.name){
        if(j==='-')
            original_test_name+=" ";
        else
            original_test_name+=j;
    }

    test_name_elem.innerHTML=original_test_name;
    test_name_elem.title=original_test_name;
    test_price_inp.value=test_obj.price;
    test_type_inp.value=test_obj.type;

    show_dialog('update_test_dialog');
}

const populate_patients = (search="") => {
    document.querySelector(".patient_info_container .patients .special-card p").innerHTML=patients_list.length;
    let patient_container=document.querySelector(".patient_info_container .patients .info-cards");
    let patient_container_DOM="";
    for(i of patients_list){
        if(search && !(i.id.includes(search) || (i.first_name+" "+i.last_name).toLowerCase().includes(search.toLowerCase())))
            continue;
        let app_count=0;
        for(j of appointments_list){
            if(j.id===i.id && (j.status==="done" || j.status==="dismiss"))
                app_count++;
        }
        patient_container_DOM+=`<div class="info-elem" onclick="show_patient_profile('${i.id}');">
            <div>
                <h3>${i.id}</h3>
                <p>${i.first_name+" "+i.last_name}</p>
            </div>`
            if(app_count>0)
                patient_container_DOM+=`<span title="Total Appointments: ${app_count}">${(app_count<1000)?app_count:"999+"}</span>`;
        patient_container_DOM+=`</div>`;
    }
    patient_container.innerHTML=patient_container_DOM;
}

const populate_appointments = (filtered_list=null) => {
    if(!filtered_list){
        for(let i=0; i<appointments_list.length; i++){
            for(let j=i+1; j<appointments_list.length; j++){
                if(appointments_list[i].app_time<appointments_list[j].app_time){
                    let temp=appointments_list[i];
                    appointments_list[i]=appointments_list[j];
                    appointments_list[j]=temp;
                }
            }
        }
    }
    
    let appointment_card=document.querySelector(".patient_info_container .appointments .special-card p");
    let appointment_container=document.querySelector(".patient_info_container .appointments .info-cards");
    appointment_container.innerHTML="";

    let under_process_count=0;
    for(i of appointments_list){
        if(i.status==="at receptionist" || i.status==="at doctor" || i.status==="at pharmacist")
            under_process_count++;
    }
    if(under_process_count>0){
        appointment_card.parentElement.classList.add("online");
        appointment_card.parentElement.setAttribute("data-count", (under_process_count<10)?under_process_count:"9+");
    }else{
        appointment_card.parentElement.classList.remove("online");
    }
    appointment_card.innerHTML=appointments_list.length;

    if(!filtered_list)
        filtered_list=appointments_list;        
    for(i of filtered_list){
        appointment_container.innerHTML+=`<div class="info-elem">
            <div>
                <h3>${i.app_id}</h3>
                <p>${i.first_name+" "+i.last_name} (${i.id})</p>
                <p>Status: ${i.status}</p>
            </div>
        </div>`
    }
}

const populate_notifications = () => {
    let notification_elem=document.querySelector(".expanded-notifications");
    let notification_button=document.querySelector(".admin-notifications");
    notification_elem.innerHTML="";
    for(i of notifications){
        notification_elem.innerHTML+=`<div>
            <p>Password reset request from ${i.id}</p>
            <a href="#" style="--clr: var(--neon-pink);" onclick="reset_password('${i.id}');">reset</a>
        </div>`;
    }
    let count=notifications.length;
    notification_button.setAttribute("data-count", (count>=10)?count+"+":count);
    if(count>0)
        notification_button.classList.add("active-dot");
    else
        notification_button.classList.remove("active-dot");
}

const isFocus_anyInput = () => {
    let inputs = document.querySelectorAll("input, textarea, select");
    if(inputs){
        for(i of inputs){
            if(i===document.activeElement)
                return true;
        }
    }
    return false;
}

const show_filter_dialog = (dialog_class) => {
    let dialog_id_inp=document.querySelector(".appointment-filter-dialog input[name='patient-id']"),
    dialog_name_inp=document.querySelector(".appointment-filter-dialog input[name='patient-name']"),
    dialog_range_from_inp=document.querySelector(".appointment-filter-dialog input[name='range-from']"),
    dialog_range_to_inp=document.querySelector(".appointment-filter-dialog input[name='range-to']"),
    dialog_order_inp=document.querySelector(".appointment-filter-dialog select[name='order']"),
    dialog_status_inp=document.querySelector(".appointment-filter-dialog select[name='status']");

    if(appointment_filtered_id)
        dialog_id_inp.value=appointment_filtered_id;
    if(appointment_filtered_name)
        dialog_name_inp.value=appointment_filtered_name;
    if(appointment_filtered_range_from)
        dialog_range_from_inp.value=appointment_filtered_range_from;
    if(appointment_filtered_range_to)
        dialog_range_to_inp.value=appointment_filtered_range_to;
    if(appointment_filtered_order)
        dialog_order_inp.value=appointment_filtered_order;
    if(appointment_filtered_status)
        dialog_status_inp.value=appointment_filtered_status;

    show_dialog(dialog_class);
}

const reset_filter_fields = (dialog_elem) => {
    reset_fields(dialog_elem);

    appointment_filtered_id=null;
    appointment_filtered_name=null;
    appointment_filtered_range_from=null;
    appointment_filtered_range_to=null;
    appointment_filtered_status=null;
    appointment_filtered_order=null;
}

const calc_Age = (dob) => {
    let month_days=[31,28,31,30,31,30,31,31,30,31,30,31];
    let given_year=dob.split("-")[0];
    let given_month=dob.split("-")[1];
    let given_day=dob.split("-")[2];
    given_y=parseInt(given_year);
    given_m=parseInt(given_month);
    given_d=parseInt(given_day);
    let given_total_days=0;

    let new_year = (given_y-1)
    let leap_year=Math.floor(new_year/4)
    given_total_days=(leap_year*366)+((new_year-leap_year)*365);
    for(let i=0; i<given_m-1; i++){
        if(i==1 && given_y%4==0)
            given_total_days+=month_days[i]+1;
        else
            given_total_days+=month_days[i];
    }
    given_total_days+=given_d;

    let date=new Date(Date.now())
    let current_y=date.getFullYear();
    let current_m=date.getMonth();
    let current_d=date.getDate();
    let current_total_days=0;

    new_year = (current_y-1)
    leap_year=Math.floor(new_year/4)
    current_total_days=(leap_year*366)+((new_year-leap_year)*365);
    for(let i=0; i<current_m; i++){
        if(i==1 && current_y%4==0)
            current_total_days+=month_days[i]+1;
        else
            current_total_days+=month_days[i];
    }
    current_total_days+=current_d;

    let difference=current_total_days-given_total_days;

    let calc_year=Math.floor(difference/365);
    let calc_month=0;
    let calc_days=difference%365;
    calc_days+=Math.floor(calc_year/4);
    for(i of month_days){
        if(calc_days>i){
            calc_month++;
            calc_days-=i;
        }else{
            break;
        }
    }

    return `${calc_year?(calc_year)+"Y":""} ${calc_month?(calc_month)+"M":""} ${calc_days?(calc_days)+"D":""}`.trim();
}

const write_excel_file = (type) => {
    let staff=[], patients=[], appointments=[];

    if(type==="All"){
        staff=[...admins_list, ...doctors_list, ...receptionists_list, ...pharmacists_list];
        patients=[...patients_list];
        appointments=[...appointments_list];
    }else if(type==="Staff"){
        staff=[...admins_list, ...doctors_list, ...receptionists_list, ...pharmacists_list];
        appointments=[];
        patients=[];
    }else if(type==="Patients"){
        staff=[];
        appointments=[];
        patients=[...patients_list];
    }else if(type==="Appointments"){
        staff=[];
        patients=[];
        appointments=[...appointments_list];
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


        sheet.getCell(`E${row}`).value="Total Admins";
        sheet.getCell(`E${row}`).font={size: 15, bold: false}
        sheet.getCell(`E${row}`).alignment={vertical: "middle", horizontal: "left"} 
        sheet.mergeCells(`E${row}:H${row}`)
        sheet.getCell(`I${row}`).value=admins_list.length;
        sheet.getCell(`I${row}`).font={size: 15, bold: false}
        sheet.getCell(`I${row}`).alignment={vertical: "middle", horizontal: "center"} 


        sheet.getCell(`E${row+1}`).value="Total Doctors";
        sheet.getCell(`E${row+1}`).font={size: 15, bold: false}
        sheet.getCell(`E${row+1}`).alignment={vertical: "middle", horizontal: "left"} 
        sheet.mergeCells(`E${row+1}:H${row+1}`)
        sheet.getCell(`I${row+1}`).value=doctors_list.length;
        sheet.getCell(`I${row+1}`).font={size: 15, bold: false}
        sheet.getCell(`I${row+1}`).alignment={vertical: "middle", horizontal: "center"} 


        sheet.getCell(`E${row+2}`).value="Total Receptionists";
        sheet.getCell(`E${row+2}`).font={size: 15, bold: false}
        sheet.getCell(`E${row+2}`).alignment={vertical: "middle", horizontal: "left"} 
        sheet.mergeCells(`E${row+2}:H${row+2}`)
        sheet.getCell(`I${row+2}`).value=receptionists_list.length;
        sheet.getCell(`I${row+2}`).font={size: 15, bold: false}
        sheet.getCell(`I${row+2}`).alignment={vertical: "middle", horizontal: "center"} 


        sheet.getCell(`E${row+3}`).value="Total Pharmacists";
        sheet.getCell(`E${row+3}`).font={size: 15, bold: false}
        sheet.getCell(`E${row+3}`).alignment={vertical: "middle", horizontal: "left"} 
        sheet.mergeCells(`E${row+3}:H${row+3}`)
        sheet.getCell(`I${row+3}`).value=pharmacists_list.length;
        sheet.getCell(`I${row+3}`).font={size: 15, bold: false}
        sheet.getCell(`I${row+3}`).alignment={vertical: "middle", horizontal: "center"} 


        sheet.getCell(`J${row}`).value=admins_list.length+doctors_list.length+pharmacists_list.length+receptionists_list.length;
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
            console.log(i);
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

    ipcRenderer.send("get-path", "get-path-result");
    ipcRenderer.on("get-path-result", (event, data) => {
        if(typeof(data) === typeof(false)){
            hide_loader();
            show_notification("Path could not be choosen. Please try again");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else if(!data){
            hide_loader();            
            show_notification("You cannot choose the path of file. Please try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            if(data.split(".").pop()!=="xlsx"){
                data+=".xlsx";
            }
            wbook.xlsx.writeFile(data).then((val) => {
                hide_loader();
                show_notification("file written successfully");
                setTimeout(() => {
                    hide_notification();
                }, 5500);
            }).catch((e) => {
                hide_loader();
                show_notification("file could not be written on specified path", true);
                setTimeout(() => {
                    hide_notification();
                }, 5500);
            });
        }
    });
}

const download_report = (report_elem) => {
    show_loader();
    let record_type=report_elem.querySelector("select[name='record-type']");

    write_excel_file(record_type.value);
}

create_navigation(true); // generating menus located at blue layer...   
let old_DOM=document.body.innerHTML;
let new_DOM=`<span class="admin-test-info" title="Add New Test and Price" onclick="this.classList.toggle('show');document.querySelector('.admin-notifications').classList.remove('show');"><i class="fa-solid fa-vial-virus"></i></span>
    <div class="expanded-tests"></div>
    <span class="admin-notifications" data-count="" title="Notifications" onclick="this.classList.toggle('show');document.querySelector('.admin-test-info').classList.remove('show');"><i class="fa-solid fa-bell"></i></span>
    <div class="expanded-notifications"></div>`+old_DOM;
document.body.innerHTML=new_DOM;







// menu navigation code...
let all_menus=document.querySelectorAll(".cards .card"),
all_users_heading=document.querySelector(".main-container .offline-users h2"),
all_users_container=document.querySelector(".main-container .offline-users .users"),
online_users_heading=document.querySelector(".main-container .online-users h2"),
online_users_container=document.querySelector(".main-container .online-users .users");

const update_cards = () => {
    let online_admins=0,
    online_doctors=0,
    online_receptionists=0,
    online_pharmacists=0;

    for(i of admins_list){
        if(i.status==="online")
            online_admins++;
    }
    for(i of doctors_list){
        if(i.status==="online")
            online_doctors++;
    }
    for(i of receptionists_list){
        if(i.status==="online")
            online_receptionists++;
    }
    for(i of pharmacists_list){
        if(i.status==="online")
            online_pharmacists++;
    }
 
    all_menus[0].querySelector("p:nth-child(2)").innerHTML=admins_list.length;
    all_menus[1].querySelector("p:nth-child(2)").innerHTML=doctors_list.length;
    all_menus[2].querySelector("p:nth-child(2)").innerHTML=receptionists_list.length;
    all_menus[3].querySelector("p:nth-child(2)").innerHTML=pharmacists_list.length;

    if(online_admins>0){
        all_menus[0].classList.add("online");
        all_menus[0].setAttribute("data-online", (online_admins>9)?"9+":online_admins);
    }else{
        all_menus[0].classList.remove("online");
    }
    if(online_doctors>0){
        all_menus[1].classList.add("online");
        all_menus[1].setAttribute("data-online", (online_doctors>9)?"9+":online_doctors);
    }else{
        all_menus[1].classList.remove("online");
    }
    if(online_receptionists>0){
        all_menus[2].classList.add("online");
        all_menus[2].setAttribute("data-online", (online_receptionists>9)?"9+":online_receptionists);
    }else{
        all_menus[2].classList.remove("online");
    }
    if(online_pharmacists>0){
        all_menus[3].classList.add("online");
        all_menus[3].setAttribute("data-online", (online_pharmacists>9)?"9+":online_pharmacists);
    }else{
        all_menus[3].classList.remove("online");
    }
}

const populate_admin = (isNavigate, filter="") => {
    show_loader();
    active_card_tab="admin";
    // setting up card...
    for(i of all_menus) {
        i.classList.remove("active")
    }
    all_menus[0].classList.add("active")

    // setting up data...
    all_users_heading.innerHTML="All Admins"
    online_users_heading.innerHTML="Online Admins"
    all_users_container.innerHTML="";
    online_users_container.innerHTML="";
    for(i of admins_list){
        if(i.status==="offline" && (i.id.includes(filter) || (i.first_name+" "+i.last_name).includes(filter))){
            all_users_container.innerHTML+=`<div class="user">
                <div onclick="show_profile_dialog('${i.id}');">
                    <h3>${i.first_name+" "+i.last_name}</h3>
                    <p>${i.id}</p>
                </div>
                <div>
                    <span onclick="edit_profile('${i.id}')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></span>
                </div>
            </div>`;
        }else if(i.status==="online" && (i.id.includes(filter) || (i.first_name+" "+i.last_name).includes(filter))){
            online_users_container.innerHTML+=`<div class="user">
                <div onclick="show_profile_dialog('${i.id}');">
                    <h3>${i.first_name+" "+i.last_name}</h3>
                    <p>${i.id}</p>
                </div>
                <div>
                    <span onclick="edit_profile('${i.id}')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></span>
                    <span onclick="logout_user('${i.id}')" title="Logout"><i class="fa-solid fa-power-off"></i></span>
                </div>
            </div>`;
        }
    }
    hide_loader();
    if(isNavigate)
        document.querySelector(".offline-users").scrollIntoView({behavior: "smooth"})
}
const populate_doctor = (isNavigate, filter="") => {
    show_loader();
    active_card_tab="doctor";
    // setting up card...
    for(i of all_menus) {
        i.classList.remove("active")
    }
    all_menus[1].classList.add("active")

    // setting up data...
    all_users_heading.innerHTML="All Doctors"
    online_users_heading.innerHTML="Online Doctors"
    all_users_container.innerHTML="";
    online_users_container.innerHTML="";
    for(i of doctors_list){
        if(i.status==="offline" && (i.id.includes(filter) || (i.first_name+" "+i.last_name).includes(filter))){
            all_users_container.innerHTML+=`<div class="user">
                <div onclick="show_profile_dialog('${i.id}');">
                    <h3>${i.first_name+" "+i.last_name}</h3>
                    <p>${i.id}</p>
                </div>
                <div>
                    <span onclick="edit_profile('${i.id}')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></span>
                </div>
            </div>`;
        }else if(i.status==="online" && (i.id.includes(filter) || (i.first_name+" "+i.last_name).includes(filter))){
            online_users_container.innerHTML+=`<div class="user">
                <div onclick="show_profile_dialog('${i.id}');">
                    <h3>${i.first_name+" "+i.last_name}</h3>
                    <p>${i.id}</p>
                </div>
                <div>
                    <span onclick="edit_profile('${i.id}')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></span>
                    <span onclick="logout_user('${i.id}')" title="Logout"><i class="fa-solid fa-power-off"></i></span>
                </div>
            </div>`;
        }
    }
    hide_loader();
    if(isNavigate)
        document.querySelector(".offline-users").scrollIntoView({behavior: "smooth"})

}
const populate_receptionist = (isNavigate, filter="") => {
    show_loader();
    active_card_tab="receptionist";
    // setting up card...
    for(i of all_menus) {
        i.classList.remove("active")
    }
    all_menus[2].classList.add("active")

    // setting up data...
    all_users_heading.innerHTML="All Receptionists"
    online_users_heading.innerHTML="Online Receptionists"
    all_users_container.innerHTML="";
    online_users_container.innerHTML="";
    for(i of receptionists_list){
        if(i.status==="offline" && (i.id.includes(filter) || (i.first_name+" "+i.last_name).includes(filter))){
            all_users_container.innerHTML+=`<div class="user">
                <div onclick="show_profile_dialog('${i.id}');">
                    <h3>${i.first_name+" "+i.last_name}</h3>
                    <p>${i.id}</p>
                </div>
                <div>
                    <span onclick="edit_profile('${i.id}')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></span>
                </div>
            </div>`;
        }else if(i.status==="online" && (i.id.includes(filter) || (i.first_name+" "+i.last_name).includes(filter))){
            online_users_container.innerHTML+=`<div class="user">
                <div onclick="show_profile_dialog('${i.id}');">
                    <h3>${i.first_name+" "+i.last_name}</h3>
                    <p>${i.id}</p>
                </div>
                <div>
                    <span onclick="edit_profile('${i.id}')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></span>
                    <span onclick="logout_user('${i.id}')" title="Logout"><i class="fa-solid fa-power-off"></i></span>
                </div>
            </div>`;
        }
    }
    hide_loader();
    if(isNavigate)
        document.querySelector(".offline-users").scrollIntoView({behavior: "smooth"})
}
const populate_pharmacist = (isNavigate, filter="") => {
    show_loader();
    active_card_tab="pharmacist";
    // setting up card...
    for(i of all_menus) {
        i.classList.remove("active")
    }
    all_menus[3].classList.add("active")

    // setting up data...
    all_users_heading.innerHTML="All Pharmacist"
    online_users_heading.innerHTML="Online Pharmacist"
    all_users_container.innerHTML="";
    online_users_container.innerHTML="";
    for(i of pharmacists_list){
        if(i.status==="offline" && (i.id.includes(filter) || (i.first_name+" "+i.last_name).includes(filter))){
            all_users_container.innerHTML+=`<div class="user">
                <div onclick="show_profile_dialog('${i.id}');">
                    <h3>${i.first_name+" "+i.last_name}</h3>
                    <p>${i.id}</p>
                </div>
                <div>
                    <span onclick="edit_profile('${i.id}')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></span>
                </div>
            </div>`;
        }else if(i.status==="online" && (i.id.includes(filter) || (i.first_name+" "+i.last_name).includes(filter))){
            online_users_container.innerHTML+=`<div class="user">
                <div onclick="show_profile_dialog('${i.id}');">
                    <h3>${i.first_name+" "+i.last_name}</h3>
                    <p>${i.id}</p>
                </div>
                <div>
                    <span onclick="edit_profile('${i.id}')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></span>
                    <span onclick="logout_user('${i.id}')" title="Logout"><i class="fa-solid fa-power-off"></i></span>
                </div>
            </div>`;
        }
    }
    hide_loader();
    if(isNavigate)
        document.querySelector(".offline-users").scrollIntoView({behavior: "smooth"})
}

populate_admin(false);










/* search functionality */

// for staff...
document.querySelector(".personal-navigation input[name='search']").addEventListener("input", (e) => {
    if(active_card_tab==="admin")
        populate_admin(false, e.target.value);
    else if(active_card_tab==="doctor")
        populate_doctor(false, e.target.value);
    else if(active_card_tab==="pharmacist")
        populate_pharmacist(false, e.target.value);
    else if(active_card_tab==="receptionist")
        populate_receptionist(false, e.target.value);
})

// for patients...
document.querySelector(".patient_info_container .patients .search input").addEventListener("input", (e) => {
    populate_patients(e.target.value);
});

// for appointment...
const apply_filters = (hidding_elem) => {
    let dialog_id_inp=document.querySelector(".appointment-filter-dialog input[name='patient-id']"),
    dialog_name_inp=document.querySelector(".appointment-filter-dialog input[name='patient-name']"),
    dialog_range_from_inp=document.querySelector(".appointment-filter-dialog input[name='range-from']"),
    dialog_range_to_inp=document.querySelector(".appointment-filter-dialog input[name='range-to']"),
    dialog_order_inp=document.querySelector(".appointment-filter-dialog select[name='order']"),
    dialog_status_inp=document.querySelector(".appointment-filter-dialog select[name='status']"),

    button = document.querySelector(".patient_info_container .appointments .expanded-info .filter");

    // validation ...
    if(dialog_id_inp.value){
        for(i of dialog_id_inp.value){
            if(!(i>='0' && i<='9')){
                show_notification("ID does not contain characters other then numbers", true);
                setTimeout(() => {
                    hide_notification();
                }, 5500);
                return;
            }
        }
    }

    if(dialog_name_inp.value){
        for(i of dialog_name_inp.value){
            if(!((i>='A' && i<='Z') || (i>='a' && i<='z') || i===" ")){
                show_notification("Invalid name. Please correct and try again", true);
                setTimeout(() => {
                    hide_notification();
                }, 5500);
                return;
            }
        }
    }



    // main filtering starts from here...
    appointment_filtered_id=dialog_id_inp.value;
    appointment_filtered_name=dialog_name_inp.value.toLowerCase();
    appointment_filtered_range_from=dialog_range_from_inp.value;
    appointment_filtered_range_to=dialog_range_to_inp.value;
    appointment_filtered_status=dialog_status_inp.value;
    appointment_filtered_order=dialog_order_inp.value;

    if(!appointment_filtered_id && !appointment_filtered_name && !appointment_filtered_range_from && !appointment_filtered_range_to && appointment_filtered_status==="all"){
        button.classList.remove("active");
        populate_appointments(appointments_list);
        hide_dialog(hidding_elem);
        return;
    }


    button.classList.add("active");
    let filtered_list;

    let copy_filtered_list=appointments_list;
    filtered_list=[];
    // id filter done here...
    if(appointment_filtered_id){
        for(i of copy_filtered_list){
            if(i.id.includes(appointment_filtered_id))
                filtered_list.push(i);
        }
    }

    // name filter done here...
    if(appointment_filtered_name){
        for(i of copy_filtered_list){
            let name = (i.first_name+" "+i.last_name).toLowerCase();
            if(name.includes(appointment_filtered_name)){
                let found=false;
                for(j of filtered_list){
                    if(j.app_id===i.app_id){
                        found=true;
                        break;                        
                    }
                }
                if(!found){
                    filtered_list.push(i);
                }
            }else{
                let index=-1;
                for(j in filtered_list){
                    if(filtered_list[j].app_id===i.app_id){
                        index=j;
                        break;                        
                    }
                }
                if(index!==-1){
                    filtered_list.splice(index, 1);
                }
            }
        }
    }

    // range from filter done here ...
    if(appointment_filtered_range_from && !appointment_filtered_range_to){
        let [y,m,d]=appointment_filtered_range_from.split("-");
        [y, m, d] = [parseInt(y), parseInt(m), parseInt(d)];
        for(i of copy_filtered_list){
            let date=new Date(i.app_time);
            if(date.getFullYear()>=y && date.getMonth()>=m && date.getDate()>=d){
                let found=false;
                for(j of filtered_list){
                    if(j.app_id===i.app_id){
                        found=true;
                        break;                        
                    }
                }
                if(!found){
                    filtered_list.push(i);
                }
            }else{
                let index=-1;
                for(j in filtered_list){
                    if(filtered_list[j].app_id===i.app_id){
                        index=j;
                        break;                        
                    }
                }
                if(index!==-1){
                    filtered_list.splice(index,1);  
                }
            }
        }
    }

    // range to filter done here...
    if(appointment_filtered_range_to && !appointment_filtered_range_from){
        let [y,m,d]=appointment_filtered_range_from.split("-");
        [y, m, d] = [parseInt(y), parseInt(m), parseInt(d)];
        for(i of copy_filtered_list){
            let date=new Date(i.app_time);
            if(date.getFullYear()<=y && date.getMonth()<=m && date.getDate()<=d){
                let found=false;
                for(j of filtered_list){
                    if(j.app_id===i.app_id){
                        found=true;
                        break;                        
                    }
                }
                if(!found){
                    filtered_list.push(i);
                }
            }else{
                let index=-1;
                for(j in filtered_list){
                    if(filtered_list[j].app_id===i.app_id){
                        index=j;
                        break;                        
                    }
                }
                if(index!==-1){
                    filtered_list.splice(index,1);  
                }
            }
        }
    }

    // combined range from and to filter done here ...
    if(appointment_filtered_range_to && appointment_filtered_range_from){
        let [y1,m1,d1]=appointment_filtered_range_from.split("-");
        let [y2,m2,d2]=appointment_filtered_range_to.split("-");
        [y1, m1, d1] = [parseInt(y1), parseInt(m1), parseInt(d1)];
        [y2, m2, d2] = [parseInt(y2), parseInt(m2), parseInt(d2)];
        for(i of copy_filtered_list){
            let date=new Date(i.app_time);
            if((date.getFullYear()>=y1 && date.getFullYear()<=y2) && (date.getMonth()>=m && date.getMonth()<=m) && (date.getDate()>=d && date.getDate()<=d)){
                let found=false;
                for(j of filtered_list){
                    if(j.app_id===i.app_id){
                        found=true;
                        break;                        
                    }
                }
                if(!found){
                    filtered_list.push(i);
                }
            }else{
                let index=-1;
                for(j in filtered_list){
                    if(filtered_list[j].app_id===i.app_id){
                        index=j;
                        break;                        
                    }
                }
                if(index!==-1){
                    filtered_list.splice(index,1);  
                }
            }
        }
    }

    // status filteration done here...
    if(appointment_filtered_status!=="All"){
        for(i of copy_filtered_list){
            if(i.status===appointment_filtered_status){
                let found=false;
                for(j of filtered_list){
                    if(j.app_id===i.app_id){
                        found=true;
                        break;                        
                    }
                }
                if(!found){
                    filtered_list.push(i);
                }
            }else{
                let index=-1;
                for(j in filtered_list){
                    if(filtered_list[j].app_id===i.app_id){
                        index=j;
                        break;                        
                    }
                }
                if(index!==-1){
                    filtered_list.splice(index, 1);
                }
            }
        }
    }
    
    // order filteration done here...
    if(appointment_filtered_order==="Descending"){
        for(let i=0; i<filtered_list.length; i++){
            for(let j=i+1; j<filtered_list.length; j++){
                if(filtered_list[i].app_time<filtered_list[j].app_time){
                    let temp=filtered_list[i];
                    filtered_list[i]=filtered_list[j];
                    filtered_list[j]=temp;
                }
            }        
        }
    }
    else if(appointment_filtered_order==="Ascending"){
        for(let i=0; i<filtered_list.length; i++){
            for(let j=i+1; j<filtered_list.length; j++){
                if(filtered_list[i].app_time>filtered_list[j].app_time){
                    let temp=filtered_list[i];
                    filtered_list[i]=filtered_list[j];
                    filtered_list[j]=temp;
                }
            }        
        }
    }

    populate_appointments(filtered_list);
    hide_dialog(hidding_elem);
}










/* validating and managing add new staff dialog */
let first_name_inp=document.querySelector(".add-new-dialog .container input[name='first-name']"),
last_name_inp=document.querySelector(".add-new-dialog .container input[name='last-name']"),
father_name_inp=document.querySelector(".add-new-dialog .container input[name='father-name']"),
username_inp=document.querySelector(".add-new-dialog .container input[name='username']"),
number_inp=document.querySelector(".add-new-dialog .container input[name='number']"),
cnic_inp=document.querySelector(".add-new-dialog .container input[name='cnic']");

[first_name_inp, last_name_inp, father_name_inp].forEach((elem) => {
    elem.addEventListener("input", (e) => {
        let data = e.target.value;
        let new_data="";
        for(i of data){
            if((i>='A' && i<='Z') || (i>='a' && i<='z') || i===' ')
                new_data+=i;
        }
        e.target.value=new_data;
    })
})

username_inp.addEventListener("input", (e) => {
    let data=e.target.value;
    let new_data="";
    for(i of data){
        if((i>='A' && i<='Z') || (i>='a' && i<='z') ||(i>='0' && i<='9'))
            new_data+=i;
    }
    e.target.value=new_data;
})

number_inp.addEventListener("input", (e) => {validate_CNIC_Number(e);});
cnic_inp.addEventListener("input", (e) => {validate_CNIC_Number(e);});
const validate_CNIC_Number = (e) => {
    let old_val=e.target.value
    let new_val=""
    for(i of old_val){
        if((i>='0' && i<='9') || i=='+')
            new_val+=i
    }
    e.target.value=new_val
}

const register_staff = (hiding_elem) => {
    let dob_inp=document.querySelector(".add-new-dialog .container input[name='dob']"),
    gender_inp=document.querySelector(".add-new-dialog .container select[name='gender']"),
    role_inp=document.querySelector(".add-new-dialog .container select[name='role']"),
    address_inp=document.querySelector(".add-new-dialog .container textarea[name='address']");

    if(!first_name_inp.value || !last_name_inp.value || !father_name_inp.value || !dob_inp.value || !cnic_inp.value || !number_inp.value || !username_inp.value || !address_inp.value){
        show_notification("Fill Empty Fields First", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);

        if(!first_name_inp.value)
            first_name_inp.focus();
        else if(!last_name_inp.value)
            last_name_inp.focus();
        else if(!father_name_inp.value)
            father_name_inp.focus();
        else if(!dob_inp.value)
            dob_inp.focus();
        else if(!cnic_inp.value)
            cnic_inp.focus();
        else if(!number_inp.value)
            number_inp.focus();
        else if(!username_inp.value)
            username_inp.focus();
        else if(!address_inp.value)
            address_inp.focus();
        return;
    }

    show_loader();
        
    let staffObj={
        first_name: first_name_inp.value,
        last_name: last_name_inp.value,
        father_name: father_name_inp.value,
        id: username_inp.value,
        password: "0000000",
        cnic: cnic_inp.value,
        contact: number_inp.value,
        dob: dob_inp.value,
        gender: gender_inp.value,
        role: role_inp.value,
        status: "offline",
        address: address_inp.value,
        app_date: Date.now()
    };

    ipcRenderer.send("fetch", `staff/${staffObj.id}`, "get-existing-staff-against-id");
    ipcRenderer.once("get-existing-staff-against-id", (event, isError, profile, data) => {
        if(isError){
            hide_loader();
            show_notification(data, true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
        else if(data){
            hide_loader();
            show_notification(`User against ID ${staffObj.id}, already exists`, true);
            username_inp.focus();
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
        else{
            ipcRenderer.send("insert", `staff/${staffObj.id}`, staffObj, "register-new-staff-result");
            ipcRenderer.once("register-new-staff-result", (event, data) => {
                if(data){
                    hide_dialog(hiding_elem);
                    hide_loader();
                    show_notification("Data Inserted successfully");
                    setTimeout(() => {
                        hide_notification();
                    }, 5500);
                }else{
                    hide_loader();
                    show_notification("Data Not Inserted successfully", true);
                    setTimeout(() => {
                        hide_notification();
                    }, 5500);
                }
            })  
        }
    });    
}






/* listening live update for values from database */
ipcRenderer.on("live-value-update-captured", (event, data) => {
    let prof=data['staff'][profile.id];
    if(prof && prof.role==="Admin" && prof.status==="online"){
        separate_profiles(prof, data);
        update_cards();
        if(active_card_tab==="admin")
            populate_admin();
        else if(active_card_tab==="doctor")
            populate_doctor();
        else if(active_card_tab==="receptionist")
            populate_receptionist();
        else if(active_card_tab==="pharmacist")
            populate_pharmacist();
    }else{
        if(!prof)
            ipcRenderer.send("staff-deleted", "");
        else
            logout_user(prof.id);
    }
})




/* adding shortcut commands */
window.addEventListener("keyup", (e) => {
    if((e.key==="F" || e.key==='f') && !isFocus_anyInput()){
        document.querySelector(".personal-navigation input[name='search']").focus();
    }else if(e.key==="N" ||  e.key==="n" && !isFocus_anyInput()){
        show_dialog("add-new-dialog");
    }
});
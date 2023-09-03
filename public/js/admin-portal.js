let profile=null,
admins_list=[],
doctors_list=[],
pharmacists_list=[],
receptionists_list=[],
LHVs_list=[],
nurses_list=[],
suspended_staff=[],
patients_list=[],
appointments_list=[],
medicine_list=[],
tests_list=[],
medicines_types_list=[],
notifications=[];
let updateableProfile=null;
let active_card_tab="admin",
object_to_be_edit=null,
temp_new_staff_object=null;

let month_array = ['Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let filtered_appointments_list=[];







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
    show_loader();
    ipcRenderer.send("fetch", "/", "get-all-data");
    ipcRenderer.on("get-all-data", (event, isError, prof, data) => {
        if(!isError){
            ipcRenderer.send("delete", `settings/password-requests/${prof.id}`, "deleting-request-for-forgot");
            separate_profiles(prof, data);
            populate_admin(false);
            update_cards();
            hide_loader();  
        }else{
            hide_loader();  
            show_notification(data, true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
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
    else if(active_card_tab==="LHV"){
        for(i of LHVs_list){
            if(i.id===id && !currentProfile){
                currentProfile=i;
                break;
            }
        }
    }
    else if(active_card_tab==="Nurse"){
        for(i of nurses_list){
            if(i.id===id && !currentProfile){
                currentProfile=i;
                break;
            }
        }
    }
    if(!currentProfile){
        for(i of suspended_staff){
            if(i.id===id && !currentProfile){
                currentProfile=i
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
    email_inp=document.querySelector(".update-staff-dialog .container input[name='email']"),
    number_inp=document.querySelector(".update-staff-dialog .container input[name='number']"),
    cnic_inp=document.querySelector(".update-staff-dialog .container input[name='cnic']"),
    dob_inp=document.querySelector(".update-staff-dialog .container input[name='dob']"),
    gender_inp=document.querySelector(".update-staff-dialog .container select[name='gender']"),
    role_inp=document.querySelector(".update-staff-dialog .container select[name='role']"),
    address_inp=document.querySelector(".update-staff-dialog .container textarea[name='address']"),
    suspend_btn = document.querySelector(".update-staff-dialog .controls button:nth-child(2)");
    update_btn = document.querySelector(".update-staff-dialog .controls button:last-child");

    first_name_inp.value=currentProfile.first_name;
    last_name_inp.value=currentProfile.last_name;
    father_name_inp.value=currentProfile.father_name;
    username_lbl.innerHTML=currentProfile.id;
    username_lbl.title=currentProfile.id;
    email_inp.value=(currentProfile.email)?currentProfile.email:"";
    number_inp.value=currentProfile.contact;
    cnic_inp.value=currentProfile.cnic;
    dob_inp.value=currentProfile.dob;
    gender_inp.value=currentProfile.gender;
    role_inp.value=currentProfile.role;
    address_inp.value=currentProfile.address;
    suspend_btn.innerHTML="Suspend";
    if(updateableProfile.status==="suspend"){
        suspend_btn.innerHTML="Restore";
    }
    show_dialog("update-staff-dialog")

    suspend_btn.addEventListener("click", (e) => {
        if(e.target.innerHTML==="Restore"){
            document.querySelector(".suspend-confirmation-dialog p").innerHTML="Are you sure you want to restore this staff?";
            document.querySelector(".suspend-confirmation-dialog .controls button:last-child").innerHTML="Restore";
        }
        hide_dialog(document.querySelector(".update-staff-dialog .cancel"));
        show_dialog("suspend-confirmation-dialog");
    });

    update_btn.addEventListener("click", (e) => {
        show_loader();

        if(!first_name_inp.value || !last_name_inp.value || !father_name_inp.value || !dob_inp.value || !cnic_inp.value || !number_inp.value || !email_inp.value || !address_inp.value){
            hide_loader();
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
            else if(!email_inp.value)
                email_inp.focus();
            else if(!address_inp.value)
                address_inp.focus();
            return;
        }
    
        if(!email_inp.checkValidity()){
            hide_loader();
            show_notification("Email is not correct. Please check your email and try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
            return;
        }

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
            email: email_inp.value,
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

const suspend_staff = (hidding_elem) => {
    if(!updateableProfile){
        show_notification("No records found. Refresh and try again", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }
    show_loader();
    let message="", err_message="";
    if(hidding_elem.querySelector("button:last-child").innerHTML==="Restore"){
        updateableProfile.password="0000000";
        updateableProfile.status="offline";
        message="Staff Restored Successfully"
        err_message="Staff cannot Restored. Please try again";
    }else{
        updateableProfile.status="suspend";
        message="Staff Suspended Successfully"
        err_message="Staff cannot Suspended. Please try again"
    }
    ipcRenderer.send("insert", `staff/${updateableProfile.id}/`, updateableProfile, "suspend-staff-result");
    ipcRenderer.on("suspend-staff-result", (event, res) => {
        hide_loader();
        if(res){
            hide_dialog(hidding_elem);
            document.querySelector(".suspend-confirmation-dialog .controls button:last-child").innerHTML="Suspend";
            show_notification(message);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            show_notification(err_message, true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const separate_profiles=(prof, data) => {
    profile=prof;
    admins_list=[],
    doctors_list=[],
    pharmacists_list=[],
    receptionists_list=[],
    LHVs_list=[],
    nurses_list=[],
    suspended_staff=[],
    patients_list=[],
    appointments_list=[],
    medicine_list=[];

    if(!data)
        return;

    if(data['staff']){
        let staff_data=data['staff'];
        for(i of Object.keys(staff_data)){
            let staffObj=staff_data[i];
            if(staffObj.status==="suspend")
                suspended_staff.push(staffObj);
            else if(staffObj.role==="Admin")
                admins_list.push(staffObj);
            else if(staffObj.role==="Doctor")
                doctors_list.push(staffObj);
            else if(staffObj.role==="Receptionist")
                receptionists_list.push(staffObj);
            else if(staffObj.role==="Pharmacist")
                pharmacists_list.push(staffObj);
            else if(staffObj.role==="LHV")
                LHVs_list.push(staffObj);
            else if(staffObj.role==="Nurse")
                nurses_list.push(staffObj);
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
    if(data['medicines']){
        let medicines = data['medicines'];
        for(i of Object.keys(medicines)){
            medicine_list.push(medicines[i]);
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

    // seperating medicine type from data...
    medicines_types_list=[];
    if(data['settings'] && data['settings']['medicine_types']){
        let medicine_type=data['settings']['medicine_types'];
        for(i of Object.keys(medicine_type)){
            medicines_types_list.push(medicine_type[i]);
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
    populate_useable_medicines();
    populate_expired_medicines();
    populate_suspended_staff();
    populate_medicine_types();
    populate_medicine_type_dropdown();
    check_birthday_and_wish();
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

const populate_tests = (search="") => {
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
        if(test_name.toLowerCase().includes(search.toLowerCase())){
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

const show_appointment_dialog = (app_id) => {
    let appointment = null;
    for(i of appointments_list){
        if(i.app_id===app_id){
            appointment=i;
            break;
        }
    }

    if(!appointment){
        show_notification("No appointment selected. Please refresh and try again", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }

    let data_container = document.querySelector(".show-appointment-dialog .data");
    let app_time = new Date(appointment.app_time);
    let data_container_DOM=`<div class="datum">
        <span class="bold">Appointment Time: </span>
        <span>${app_time.getHours()}:${app_time.getMinutes()}, ${app_time.getDate()} ${month_array[app_time.getMonth()]} ${app_time.getFullYear()}</span>
    </div>
    <div class="datum">
        <span class="bold">Patient ID: </span>
        <span>${appointment.id}</span>
    </div>
    <div class="datum">
        <span class="bold">Patient Name: </span>
        <span>${appointment.first_name} ${appointment.last_name}</span>
    </div>
    <div class="datum">
        <span class="bold">Presenting Complaints: </span>
        <span>${(appointment.presenting_complaints)?appointment.presenting_complaints:""}</span>
    </div>
    <div class="datum">
        <span class="bold">Diagnosis: </span>
        <span>${(appointment.diagnosis)?appointment.diagnosis:""}</span>
    </div>
    <div class="datum">
        <span class="bold">Precautions: </span>
        <span>${(appointment.precautions)?appointment.precautions:""}</span>
    </div>
    <div class="datum">
        <span class="bold">Doctor ID: </span>
        <span>${appointment.doctor_id}</span>
    </div>`;
    if(appointment.duration){
        data_container_DOM+=`<div class="datum">
            <span class="bold">Duration: </span>
            <span>${appointment.duration}</span>
        </div>`;
    }
    if(appointment.t_amount){
        data_container_DOM+=`<div class="datum">
            <span class="bold">Total Amount: </span>
            <span>${appointment.t_amount} Rs/-</span>
        </div>`;
    }
    if(appointment.received_amount){
        data_container_DOM+=`<div class="datum">
            <span class="bold">Recieved Amount: </span>
            <span>${appointment.received_amount} Rs/-</span>
        </div>`;
    }
    data_container_DOM+=`<div class="datum">
        <span class="bold">Status: </span>
        <span>${appointment.status}</span>
    </div>`;

    let test = JSON.parse(appointment.tests);
    if(test.length>0){
        data_container_DOM+=`<div class="datum">
            <h3>Tests</h3>
            <div class="tests">`
            for(i of test){
                let price=null;
                for(j of tests_list){
                    if(Object.keys(i)[0]===j.name){
                        price=j.price;
                        break;
                    }
                }
                data_container_DOM+=`<div class="test">
                    <span class="bold">${Object.keys(i)}: </span>
                    <span>${Object.values(i)} (${price})</span>
                </div>`;
            }
        data_container_DOM+=`</div>
        </div>`;
    }

    let prescription = JSON.parse(appointment.prescriptions);
    if(prescription.length>0){
        data_container_DOM+=`<div class="datum">
            <h3>Prescriptions</h3>
            <div class="prescriptions">`
            for(i of prescription){
                data_container_DOM+=`<div class="prescription">
                    <p>
                        <span class="bold">Name: </span>
                        <span>${i.name} ${(i.med_id)?"<span class='highlight'>Indoor</span>":""}</span>
                    </p>
                    <p>
                        <span class="bold">Quantity: </span>
                        <span>${i.quantity}</span>
                    </p>`;
                    if(i.given_quantity){
                        data_container_DOM+=`<p>
                            <span class="bold">Given Quantity: </span>
                            <span>${i.given_quantity}</span>
                        </p>`
                    }
                    data_container_DOM+=`<p>
                        <span class="bold">Timmings: </span>
                        <span>${i.timmings}</span>
                    </p>
                    <hr>
                </div>`;
            }
            data_container_DOM+=`</div>
        </div>`;
    }

    let controls_section = document.querySelector(".show-appointment-dialog .controls");
    controls_section.innerHTML=`<button onclick="hide_dialog(this.parentElement);" style="--clr: var(--disabled-clr);">Cancel</button>`
    if(appointment.status!=="dismiss" && appointment.status!=="done")
        controls_section.innerHTML+=`<button style="--clr: var(--neon-blue);" onclick="dismiss_appointment('${app_id}');">Dismiss</button>`;

    data_container.innerHTML=data_container_DOM;
    show_dialog("show-appointment-dialog");
}   

const dismiss_appointment = (appId) => {
    ipcRenderer.send("insert", `appointments/${appId}/status`, "dismiss", "appointment-dismiss-result");
    ipcRenderer.on("appointment-dismiss-result", (event, res) => {
        hide_loader();
        if(res){
            show_notification("Appointment dismissed Successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            show_notification("Appointment Cannot dismiss. Try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
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
        let id=i.app_id;
        let splitted_id = id.split("-");
        let month = parseInt(splitted_id[1])+1
        id=splitted_id[0]+"-"+month+"-"+splitted_id[2]+"-"+splitted_id[3];
        appointment_container.innerHTML+=`<div class="info-elem" onclick="show_appointment_dialog('${i.app_id}');">
            <div>
                <h3>${id}</h3>
                <p>${i.first_name+" "+i.last_name} (${i.id})</p>
                <p>Status: ${i.status}</p>
            </div>
        </div>`
    }
    filtered_appointments_list=filtered_list;
}

const populate_medicine_types = () => {
    let medicine_type_container = document.querySelector(".expanded-medicine-types .types");
    medicine_type_container.innerHTML=`<span onclick="show_dialog('add_new_medicine_type_dialog');" style="--clr: var(--neon-pink);"><i class="fa-solid fa-plus"></i></span>`;
    for(i of medicines_types_list){
        medicine_type_container.innerHTML+=`<span onclick=""><label>${i.name}</label><i class="fa-solid ${(i.scale==="syrup")?"fa-prescription-bottle-medical":(i.scale==="tablet")?"fa-capsules":""}"></i></span>`
    }
}

const populate_medicine_type_dropdown = () => {
    let dropdown = document.querySelector(".add-new-medicine-dialog .form select[name='type']");
    dropdown.innerHTML="";
    let count=0;
    for(i of medicines_types_list){
        dropdown.innerHTML+=`<option value="${i.name}" ${(count===0)?"selected":""}>${i.name}</option>`;
        count++;
    }
}

const save_medicine_type = (hidding_elem) => {
    show_loader();
    let type_name = document.querySelector(".add_new_medicine_type_dialog input[name='medicine-type']");
    let type_scale = document.querySelector(".add_new_medicine_type_dialog select[name='medicine-scale']");
    let medicine_type_obj = {
        name: type_name.value, 
        scale: type_scale.value
    };

    for(i of medicines_types_list){
        if(i.name.toLowerCase()===medicine_type_obj.name.toLowerCase()){
            hide_loader();
            show_notification("This medicine type already exists", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
            type_name.focus();
            return;
        }
    }

    ipcRenderer.send("insert", `settings/medicine_types/${medicines_types_list.length}`, medicine_type_obj, "medicine-type-saving-result");
    ipcRenderer.on("medicine-type-saving-result", (event, res) => {
        hide_loader();
        if(res){
            hide_dialog(hidding_elem);
            show_notification("Medicine type has been inserted successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            show_notification("Please check your internet connection and try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const populate_notifications = () => {
    let notification_elem=document.querySelector(".expanded-notifications");
    let notification_button=document.querySelector(".admin-notifications");
    notification_elem.innerHTML="";
    for(i of notifications){
        notification_elem.innerHTML+=`<div>
            <p>Password reset request from ${i.username}</p>
            <a href="#" style="--clr: var(--neon-pink);" onclick="reset_password('${i.username}');">reset</a>
        </div>`;
    }
    let count=notifications.length;
    notification_button.setAttribute("data-count", (count>=10)?count+"+":count);
    if(count>0)
        notification_button.classList.add("active-dot");
    else
        notification_button.classList.remove("active-dot");
}

const populate_useable_medicines = (search="") => {
    let useable_medicine_card = document.querySelector(".medicine_info_container .useable .special-card p");
    let useable_medicine_container=document.querySelector(".medicine_info_container .useable .info-cards");

    let useable_medicine_list=[];

    for(i of medicine_list){
        if(!isExpired(i.exp_date))
            useable_medicine_list.push(i);
    }

    useable_medicine_card.innerHTML=useable_medicine_list.length;

    let useable_medicine_container_DOM="";

    for(i of useable_medicine_list){
        if(i.name.toLowerCase().includes(search.toLowerCase()) || i.salt.toLowerCase().includes(search.toLowerCase())){
            useable_medicine_container_DOM+=`<div class="info-elem" onclick="edit_medicine_dialog('${i.id}');">
                <div>
                    <h3>${i.name} (${i.salt})</h3>
                    <p>Quantity: ${i.quantity}</p>
                    <p>Price: ${i.price}</p>
                    <p>Valid from ${i.mfg_date} till ${i.exp_date}</p>
                </div>
            </div>`;
        }
    }

    useable_medicine_container.innerHTML=useable_medicine_container_DOM;
}

const populate_expired_medicines = (search="") => {
    let expired_medicine_card = document.querySelector(".medicine_info_container .expired .special-card p");
    let expired_medicine_container=document.querySelector(".medicine_info_container .expired .info-cards");

    let expired_medicine_list=[];

    for(i of medicine_list){
        if(isExpired(i.exp_date))
            expired_medicine_list.push(i);
    }

    expired_medicine_card.innerHTML=expired_medicine_list.length;

    let expired_medicine_container_DOM="";

    for(i of expired_medicine_list){
        if(i.name.toLowerCase().includes(search.toLowerCase()) || i.salt.toLowerCase().include(search.toLowerCase())){
            expired_medicine_container_DOM+=`<div class="info-elem" onclick="edit_medicine_dialog('${i.id}');">
                <div>
                    <h3>${i.name} (${i.salt})</h3>
                    <p>Quantity: ${i.quantity}</p>
                    <p>Price: ${i.price}</p>
                </div>
            </div>`;
        }
    }

    expired_medicine_container.innerHTML=expired_medicine_container_DOM;
}

const populate_suspended_staff = () => {
    let suspended_container = document.querySelector(".suspended-staff-container .expanded-info .users");
    let suspended_staff_count = document.querySelector(".suspended-staff-container .special-card p");

    suspended_staff_count.innerHTML=suspended_staff.length;

    let staff_DOM=""
    for(i of suspended_staff){
        staff_DOM+=`<div class="user">
                <div onclick="show_profile_dialog('${i.id}');">
                    <h3>${i.first_name+" "+i.last_name}</h3>
                    <p>${i.id}</p>
                </div>
                <div>
                    <span onclick="edit_profile('${i.id}')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></span>
                </div>
            </div>`;
    }
    suspended_container.innerHTML=staff_DOM;
}

const is_valid_mfg_exp = (mfg, exp) => {
    let given_mfg_month=mfg.split(" ")[0];
    let given_mfg_year=mfg.split(" ")[1];
    let given_exp_month=exp.split(" ")[0];
    let given_exp_year=exp.split(" ")[1];

    let mfg_month_index=-1;
    let exp_month_index=-1;

    for(let i=0; i<month_array.length; i++){
        if(month_array[i]===given_mfg_month){
            mfg_month_index=i;
            break;
        }
    }
    for(let i=0; i<month_array.length; i++){
        if(month_array[i]===given_exp_month){
            exp_month_index=i;
            break;
        }
    }

    if(parseInt(given_mfg_year) < parseInt(given_exp_year)){
        return true;
    }else if(parseInt(given_mfg_year)===parseInt(given_exp_year) && mfg_month_index<=exp_month_index){
        return true;
    }
    return false;
}

const validate_medicine_form = (dialog) => {
    let med_name_input=dialog.querySelector("input[name='name']");
    let med_quantity_input=dialog.querySelector("input[name='quantity']");
    let med_price_input=dialog.querySelector("input[name='price']");
    let discount_input=dialog.querySelector("input[name='discount']");
    let med_mfg_month_input=dialog.querySelector("input[name='mfg-month']");
    let med_mfg_year_input=dialog.querySelector("input[name='mfg-year']");
    let med_exp_month_input=dialog.querySelector("input[name='exp-month']");
    let med_exp_year_input=dialog.querySelector("input[name='exp-year']");
    
    if((med_name_input && !med_name_input.value) || !med_quantity_input.value || !med_price_input.value || !discount_input.value || !med_mfg_month_input.value || !med_mfg_year_input.value || !med_exp_month_input.value || !med_exp_year_input.value){
        show_notification("Fill Empty Fields First", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        if(med_name_input && !med_name_input.value)
            med_name_input.focus()
        else if(!med_quantity_input.value)
            med_quantity_input.focus()
        else if(!med_price_input.value)
            med_price_input.focus()
        else if(!discount_input.value)
            discount_input.focus()
        else if(!med_mfg_month_input.value)
            med_mfg_month_input.focus()
        else if(!med_mfg_year_input.value)
            med_mfg_year_input.focus()
        else if(!med_exp_month_input.value)
            med_exp_month_input.focus()
        else if(!med_exp_year_input.value)
            med_exp_year_input.focus()
        return false;
    }
    
    let errors="Invalid Inputs:";

    if(med_quantity_input.value<med_quantity_input.min){
        errors+=" Quantity,";
        med_quantity_input.focus()
    }
    if(med_price_input.value<0){
        errors+=" Price,";
        med_price_input.focus()
    }
    if(discount_input.value<0 || discount_input.value>100){
        errors+=" Discount,";
        med_price_input.focus()
    }
    if(med_mfg_month_input.value<1 || med_mfg_month_input.value>12){
        errors+=" Mfg Month,";
        med_mfg_month_input.focus()
    }
    if(med_mfg_year_input.value<med_mfg_year_input.min){
        errors+=" Mfg Year,";
        med_mfg_year_input.focus()
    }
    if(med_exp_month_input.value<1 || med_exp_month_input.value>12){
        errors+=" Exp Month,";
        med_exp_month_input.focus()
    }
    if(med_exp_year_input.value<med_exp_year_input.min){
        errors+=" Exp Year,";
        med_exp_year_input.focus()
    }

    let mfg_date=`${month_array[parseInt(med_mfg_month_input.value)-1]} ${med_mfg_year_input.value}`;
    let exp_date=`${month_array[parseInt(med_exp_month_input.value)-1]} ${med_exp_year_input.value}`;

    if(errors.split(" ").length<=2 && !is_valid_mfg_exp(mfg_date, exp_date)){
            errors="Exp Date must be greater then Mfg Date ";
    }

    if(errors.split(" ").length>2){
        errors=errors.substring(0, errors.length-1);
        show_notification(errors, true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return false;
    }
    return true;
}

const read_medicines_and_upload = (element) => {
    let file_path = element.files[0].path;
    if(file_path.split(".").pop().toLowerCase()==="xlsx"){
        show_loader();
        ipcRenderer.send("read_medicines_and_upload", file_path, JSON.stringify(medicines_types_list), JSON.stringify(medicine_list), "read_medicines_and_upload_result");
        ipcRenderer.on("read_medicines_and_upload_result", (event, isError, msg) => {
            hide_loader();
            show_notification(msg, isError);
            setTimeout(() => {
                hide_notification();
            }, 5500);
            if(!isError){
                hide_dialog(element.parentElement);
            }
        });
    }else{
        show_notification("Only excel file will be considered here", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
    }
}

const save_medicine = (dialog) => {
    if(!validate_medicine_form(dialog))
        return;

    show_loader();
    let med_name_input=dialog.querySelector("input[name='name']");
    let med_salt_input=dialog.querySelector("input[name='salt']");
    let med_quantity_input=dialog.querySelector("input[name='quantity']");
    let med_type_input=dialog.querySelector("select[name='type']");
    let med_price_input=dialog.querySelector("input[name='price']");
    let discount_input=dialog.querySelector("input[name='discount']");
    let med_mfg_month_input=dialog.querySelector("input[name='mfg-month']");
    let med_mfg_year_input=dialog.querySelector("input[name='mfg-year']");
    let med_exp_month_input=dialog.querySelector("input[name='exp-month']");
    let med_exp_year_input=dialog.querySelector("input[name='exp-year']");

    let mfg_date=`${month_array[parseInt(med_mfg_month_input.value)-1]} ${med_mfg_year_input.value}`;
    let exp_date=`${month_array[parseInt(med_exp_month_input.value)-1]} ${med_exp_year_input.value}`;

    let medicine_obj={
        id:`${Date.now()}`,
        salt: med_salt_input.value,
        name:med_name_input.value,
        quantity:med_quantity_input.value,
        type:med_type_input.value,
        price:med_price_input.value,
        discount: discount_input.value,
        mfg_date:mfg_date,
        exp_date:exp_date
    };
    
    ipcRenderer.send("insert", `medicines/${medicine_obj.id}`, medicine_obj, "save-new-medicine-result");
    ipcRenderer.on("save-new-medicine-result", (event, res) => {
        hide_loader();
        if(res){
            show_notification("Medicine added successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
            hide_dialog(dialog.querySelector(".cancel"))
        }
        else{
            show_notification("Medicine not inserted. Check your network connection and try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const edit_medicine_dialog = (id) => {
    let name_label=document.querySelector(".edit-medicine-dialog .data p:nth-child(1) span:last-child");
    let type_label=document.querySelector(".edit-medicine-dialog .data p:nth-child(2) span:last-child");
    let quantity_input=document.querySelector(".edit-medicine-dialog input[name='quantity']");
    let price_input=document.querySelector(".edit-medicine-dialog input[name='price']");
    let discount_input=document.querySelector(".edit-medicine-dialog input[name='discount']");
    let mfg_month_input=document.querySelector(".edit-medicine-dialog input[name='mfg-month']");
    let mfg_year_input=document.querySelector(".edit-medicine-dialog input[name='mfg-year']");
    let exp_month_input=document.querySelector(".edit-medicine-dialog input[name='exp-month']");
    let exp_year_input=document.querySelector(".edit-medicine-dialog input[name='exp-year']");

    for(i of medicine_list){
        if(parseInt(id)===parseInt(i.id)){
            object_to_be_edit=i;
            break;
        }
    }

    if(!object_to_be_edit){
        show_notification("Data not Found. Refresh and try again", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }
    name_label.innerHTML=`${object_to_be_edit.name} (${object_to_be_edit.salt})`;
    type_label.innerHTML=object_to_be_edit.type
    quantity_input.value=object_to_be_edit.quantity
    price_input.value=object_to_be_edit.price
    discount_input.value=object_to_be_edit.discount
    
    let mfg_month=object_to_be_edit.mfg_date.split(" ")[0];
    for(i in month_array){
        if(month_array[i]===mfg_month){
            mfg_month=++i;
            break;
        }
    }
    mfg_month_input.value=mfg_month;
    mfg_year_input.value=object_to_be_edit.mfg_date.split(" ")[1];
    let exp_month=object_to_be_edit.exp_date.split(" ")[0];
    for(i in month_array){
        if(month_array[i]===exp_month){
            exp_month=++i;
            break;
        }
    }
    exp_month_input.value=exp_month;
    exp_year_input.value=object_to_be_edit.exp_date.split(" ")[1];
    
    show_dialog("edit-medicine-dialog");
}

const update_medicine = (dialog) => {
    if(!validate_medicine_form(dialog) || !object_to_be_edit)
        return;

    show_loader();
    let quantity_input=dialog.querySelector("input[name='quantity']"),
    price_input=dialog.querySelector("input[name='price']"),
    discount_input=dialog.querySelector("input[name='discount']"),
    mfg_month_input=dialog.querySelector("input[name='mfg-month']"),
    mfg_year_input=dialog.querySelector("input[name='mfg-year']"),
    exp_month_input=dialog.querySelector("input[name='exp-month']"),
    exp_year_input=dialog.querySelector("input[name='exp-year']");

    object_to_be_edit.quantity=quantity_input.value
    object_to_be_edit.price=price_input.value
    object_to_be_edit.discount=discount_input.value
    let mfg_date=`${month_array[parseInt(mfg_month_input.value)-1]} ${mfg_year_input.value}`;
    let exp_date=`${month_array[parseInt(exp_month_input.value)-1]} ${exp_year_input.value}`;
    object_to_be_edit.mfg_date=mfg_date;
    object_to_be_edit.exp_date=exp_date;

    ipcRenderer.send("insert", `medicines/${object_to_be_edit.id}/`, object_to_be_edit, "update-medicine-result");
    ipcRenderer.on("update-medicine-result", (event, res) => {
        hide_loader();
        if(res){
            show_notification("Medicine updated successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
            object_to_be_edit=null;
            hide_dialog(dialog.querySelector(".cancel"));
        }else{
            show_notification("Medicine not updated. Check your network connection and try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const isExpired = (date) =>{ 
    let current_Date=new Date(Date.now());
    let given_Month=date.split(" ")[0];
    let given_Year=date.split(" ")[1];
    let index=-1;
    for(j in month_array){
        if(month_array[j]===given_Month){
            index=j;
            break;
        }
    }

    if(current_Date.getFullYear() < parseInt(given_Year)){
        return false;
    }else if(current_Date.getFullYear() === parseInt(given_Year) && current_Date.getMonth() <= index){
        return false;
    }
    return true;
}

const has_numbers = (string_Data) => {
    for(i of string_Data){
        if(i>='0' && i<='9'){
            return true;
        }
    }
    return false;
}

const has_alphabet = (string_Data) => {
    for(i of string_Data){
        if((i>='A' && i<='Z') || (i>='a' && i<='z')){
            return true;
        }
    }
    return false;
}

const sort_appointments = (elem) => {
    show_loader();
    let svg = elem.querySelector(".svg-inline--fa");
    let asc_order=true;
    if(svg.classList[1].includes("fa-arrow-up-9-1")){ // sort in descending order...
        svg.classList.remove("fa-arrow-up-9-1");
        svg.classList.add("fa-arrow-down-9-1");
        asc_order=false;
    }else if(svg.classList[1].includes("fa-arrow-down-9-1")){ // sort in ascending order...
        svg.classList.remove("fa-arrow-down-9-1");
        svg.classList.add("fa-arrow-up-9-1");
        asc_order=true;
    }

    // main login of sorting here...
    for(let i=0; i<filtered_appointments_list.length; i++){
        for(let j=i+1; j<filtered_appointments_list.length; j++){
            if((asc_order && filtered_appointments_list[i].app_time<filtered_appointments_list[j].app_time) || (!asc_order && filtered_appointments_list[i].app_time>filtered_appointments_list[j].app_time)){
                    let temp = filtered_appointments_list[i];
                    filtered_appointments_list[i]=filtered_appointments_list[j];
                    filtered_appointments_list[j]=temp;
            }
        }
    }
    populate_appointments(filtered_appointments_list);
    hide_loader();
}

const download_report = (report_elem) => {
    show_loader();
    let record_type=report_elem.querySelector("select[name='record-type']").value;

    let staff=[], appointments=[], patients=[], medicines=[];

    if(record_type==="All"){
        staff=[...admins_list, ...doctors_list, ...receptionists_list, ...pharmacists_list];
        appointments=[...appointments_list];
        patients=[...patients_list];
        medicines=medicine_list;
    }else if(record_type==="Staff"){
        staff=[...admins_list, ...doctors_list, ...receptionists_list, ...pharmacists_list];
        appointments=[];
        patients=[];
        medicines=[];
    }else if(record_type==="Appointments"){
        staff=[];
        appointments=[...appointments_list];
        patients=[];
        medicines=[];
    }else if(record_type==="Patients"){
        staff=[];
        appointments=[];
        patients=[...patients_list];
        medicines=[];
    }else if(record_type==="Medicines"){
        staff=[];
        appointments=[];
        patients=[];
        medicines=[...medicine_list];
    }

    ipcRenderer.send("write-excel-file", staff, patients, appointments, medicines, "write-excel-file-res");
    ipcRenderer.on("write-excel-file-res", (event, res) => {
        hide_loader();
        if(res!=="ok"){
            show_notification(res, true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            show_notification("File Written successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const download_excel_template = () => {
    show_loader();
    ipcRenderer.send("download-medicine-template", "download-medicine-template-result");
    ipcRenderer.on("download-medicine-template-result", (event, isError, res) => {
        hide_loader();
        show_notification(res, isError);
        setTimeout(() => {
            hide_notification();
        }, 5500);
    });
}

create_navigation(true); // generating menus located at blue layer...   
let old_DOM=document.body.innerHTML;
let new_DOM=`<span class="medicine-types-info" title="Add Medicine Types" onclick="this.classList.toggle('show');document.querySelector('.admin-notifications').classList.remove('show');document.querySelector('.admin-test-info').classList.remove('show');"><i class="fa-solid fa-pills"></i></span>
    <div class="expanded-medicine-types">
        <div class="types"></div>
    </div>

    <span class="admin-test-info" title="Add New Test and Price" onclick="this.classList.toggle('show');document.querySelector('.admin-notifications').classList.remove('show');document.querySelector('.medicine-types-info').classList.remove('show');"><i class="fa-solid fa-vial-virus"></i></span>
    <div class="expanded-tests"></div>

    <span class="admin-notifications" data-count="" title="Notifications" onclick="this.classList.toggle('show');document.querySelector('.admin-test-info').classList.remove('show');document.querySelector('.medicine-types-info').classList.remove('show');"><i class="fa-solid fa-bell"></i></span>
    <div class="expanded-notifications"></div>
    
    <span class="medicine-template" title="Download empty Excel file for medicines as a template" onclick="download_excel_template();"><i class="fa-solid fa-file-arrow-down"></i></span>`+old_DOM;
document.body.innerHTML=new_DOM;
setup_show_password();





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
    online_pharmacists=0,
    online_LHVs=0,
    online_nurses=0;

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
    for(i of LHVs_list){
        if(i.status==="online")
            online_LHVs++;
    }
    for(i of nurses_list){
        if(i.status==="online")
            online_nurses++;
    }
 
    all_menus[0].querySelector("p:nth-child(2)").innerHTML=admins_list.length;
    all_menus[1].querySelector("p:nth-child(2)").innerHTML=doctors_list.length;
    all_menus[2].querySelector("p:nth-child(2)").innerHTML=receptionists_list.length;
    all_menus[3].querySelector("p:nth-child(2)").innerHTML=pharmacists_list.length;
    all_menus[4].querySelector("p:nth-child(2)").innerHTML=LHVs_list.length;
    all_menus[5].querySelector("p:nth-child(2)").innerHTML=nurses_list.length;

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
    if(online_LHVs>0){
        all_menus[4].classList.add("online");
        all_menus[4].setAttribute("data-online", (online_LHVs>9)?"9+":online_LHVs);
    }else{
        all_menus[4].classList.remove("online");
    }
    if(online_nurses>0){
        all_menus[5].classList.add("online");
        all_menus[5].setAttribute("data-online", (online_nurses>9)?"9+":online_nurses);
    }else{
        all_menus[5].classList.remove("online");
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
const populate_LHV = (isNavigate, filter="") => {
    show_loader();
    active_card_tab="LHV";
    // setting up card...
    for(i of all_menus) {
        i.classList.remove("active")
    }
    all_menus[4].classList.add("active")

    // setting up data...
    all_users_heading.innerHTML="All LHVs"
    online_users_heading.innerHTML="Online LHVs"
    all_users_container.innerHTML="";
    online_users_container.innerHTML="";
    for(i of LHVs_list){
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
const populate_nurse = (isNavigate, filter="") => {
    show_loader();
    active_card_tab="Nurse";
    // setting up card...
    for(i of all_menus) {
        i.classList.remove("active")
    }
    all_menus[5].classList.add("active")

    // setting up data...
    all_users_heading.innerHTML="All Nurses"
    online_users_heading.innerHTML="Online Nurses"
    all_users_container.innerHTML="";
    online_users_container.innerHTML="";
    for(i of nurses_list){
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
    let test_info_button = document.querySelector(".admin-test-info");

    if(test_info_button.classList[1]==="show")
        populate_tests(e.target.value.trim());
    else if(active_card_tab==="admin")
        populate_admin(false, e.target.value);
    else if(active_card_tab==="doctor")
        populate_doctor(false, e.target.value);
    else if(active_card_tab==="pharmacist")
        populate_pharmacist(false, e.target.value);
    else if(active_card_tab==="receptionist")
        populate_receptionist(false, e.target.value);
    else if(active_card_tab==="LHV")
        populate_LHV(false, e.target.value);
    else if(active_card_tab==="Nurse")
        populate_nurse(false, e.target.value);
})

// for patients...
document.querySelector(".patient_info_container .patients .search input").addEventListener("input", (e) => {
    populate_patients(e.target.value);
});

// for appointments...
document.querySelector(".patient_info_container .appointments .filters input").addEventListener("input", (e) => {
    let search_str = e.target.value.trim();
    let filtered_app_list=[];

    if(!has_alphabet(search_str)){ // ID based search...
        for(i of appointments_list){
            if(i.id.includes(search_str)){
                filtered_app_list.push(i);
            }
        }
    }else if(!has_numbers(search_str)){ // name based search...
        for(i of appointments_list){
            if((i.first_name+" "+i.last_name).toLowerCase().includes(search_str.toLowerCase())){
                filtered_app_list.push(i);
            }
        }
    }else{ // other searches ...

    }
    populate_appointments(filtered_app_list);
});

// for useable medicines search ...
document.querySelector(".medicine_info_container .useable .search input").addEventListener("input", (e) => {
    let search_str = e.target.value.trim();
    populate_useable_medicines(search_str);
});

// for expired medicines search ...
document.querySelector(".medicine_info_container .expired .search input").addEventListener("input", (e) => {
    let search_str = e.target.value.trim();
    populate_expired_medicines(search_str);
});










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
        if((i>='A' && i<='Z') || (i>='a' && i<='z') || (i>='0' && i<='9'))
            new_data+=i;
    }
    e.target.value=new_data;
});

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
    email_inp=document.querySelector(".add-new-dialog .container input[name='email']"),
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
    };

    if(email_inp.value && !email_inp.checkValidity()){
        show_notification("Email is not correct. Please check your email and try again", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }

    temp_new_staff_object={
        first_name: first_name_inp.value,
        last_name: last_name_inp.value,
        father_name: father_name_inp.value,
        id: username_inp.value,
        email: (email_inp.value)?email_inp.value:"",
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

    show_loader();

    ipcRenderer.send("fetch", `staff/${temp_new_staff_object.id}`, "get-existing-staff-against-id");
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
            show_notification(`User against ID ${temp_new_staff_object.id}, already exists`, true);
            username_inp.focus();
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
        else{
            let newobj = Object.assign({},temp_new_staff_object);
            newobj.email="";
            ipcRenderer.send("insert", `staff/${newobj.id}`, newobj, "register-new-staff-result");
            ipcRenderer.once("register-new-staff-result", (event, data) => {
                if(data){
                    hide_dialog(hiding_elem);

                    if(temp_new_staff_object.email && temp_new_staff_object.email!==""){
                        document.querySelector(".verify-email-dialog p span").innerHTML=`Is the email (${temp_new_staff_object.email}) right?`;
                        show_dialog("verify-email-dialog");
                    }else{
                        hide_loader();
                        temp_new_staff_object=null;
                        show_notification("Data Inserted successfully");
                        setTimeout(() => {
                            hide_notification();
                        }, 5500);
                    }

                }else{
                    hide_loader();
                    show_notification("Unexpected Error. Please try again", true);
                    setTimeout(() => {
                        hide_notification();
                    }, 5500);
                }
            });
        }
    });

    
}

const change_email = (dialog) => {
    show_loader();
    dialog.querySelector(".input").style.display="block";
    dialog.querySelector("input[name='email']").value=temp_new_staff_object.email;
    dialog.querySelector("p").style.display="none";
    dialog.querySelector("a").style.display="none";
    hide_loader();
}

const continue_without_email = (hidding_elem) => {
    show_loader();
    ipcRenderer.send("insert", `staff/${temp_new_staff_object.id}/email/`, "", "continue_without_email_res");
    ipcRenderer.on("continue_without_email_res", (event, res) => {
        if(res){
            hide_dialog(hidding_elem);
            temp_new_staff_object=null;
            show_notification("Staff Registered Successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            show_notification("Staff cannot registered. Please try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const send_code = (hidding_elem) => {
    let email_container = document.querySelector(".verify-email-dialog .input");
    let email_inp_from_dialog = document.querySelector(".verify-email-dialog .input input[name='email']");
    if(email_container.style.display==="block"){
        if(!email_inp_from_dialog.value){
            show_notification("E-mail field is empty", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
            email_inp_from_dialog.focus();
            return;
        }
        if(!email_inp_from_dialog.checkValidity()){
            show_notification("Email is not correct. Please check your email and try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
            return;
        }
        temp_new_staff_object.email=email_inp_from_dialog.value;
    }

    show_loader();
    let code=Date.now()%1000000;
    let time = Date.now();
    ipcRenderer.send("send-code-to-mail", `staff/${temp_new_staff_object.id}/password_reset/`, {code: code, generate_time:time}, temp_new_staff_object.email, "send-code-to-mail-result");
    ipcRenderer.on("send-code-to-mail-result", (event, res) => {
        hide_loader();
        if(res){
            hide_dialog(hidding_elem);
            show_dialog("password-reset-code-dialog");
            show_notification("Code sent successfully to your mail. If not found, then check your spam folder as well");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            show_notification("Code cannot sent to you mail. Please try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const cancel_verification_code_dialog = (hidding_elem) => {
    show_loader();
    ipcRenderer.send("delete", `staff/${temp_new_staff_object.id}/`, "deleted_temp_staff_res");
    ipcRenderer.on("deleted_temp_staff_res", (event, res) => {
        hide_loader();
        if(res){
            hide_dialog(hidding_elem);
            show_notification("Staff registering cancelled");
            temp_new_staff_object=null;
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            show_notification("Unexpected Error. Please Try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const verify_code = (hidding_elem) => {
    let code_inp = document.querySelector(".password-reset-code-dialog input[name='code']");
    if(!code_inp.value){
        show_notification("Fill empty field first", true)
        setTimeout(() => {
            hide_notification();
        }, 5500);
        code_inp.focus();
    }
    show_loader();
    ipcRenderer.send("fetch", `staff/${temp_new_staff_object.id}/password_reset/`, "fetch-result");
    ipcRenderer.on("fetch-result", (event, isError, profile, data) => {
        if(isError){
            hide_loader();
            show_notification(data, true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            if(parseInt(data.code)===parseInt(code_inp.value)){
                let exp_time = 60;
                if(data.generate_time+(exp_time*60*1000)>=Date.now()){
                    ipcRenderer.send("insert", `staff/${temp_new_staff_object.id}/email`, temp_new_staff_object.email, "email-verification-res");
                    ipcRenderer.on("email-verification-res", (event, res) => {
                        if(res){
                            ipcRenderer.send("insert", `staff/${temp_new_staff_object.id}/password_reset/`, null, "deleting-reset-code-res");
                            ipcRenderer.on("deleting-reset-code-res", (event, res) => {
                                hide_dialog(hidding_elem);
                                hide_loader();
                                show_notification("Record inserted with verified email");
                                temp_new_staff_object=null;
                                setTimeout(() => {
                                    hide_notification();
                                }, 5500);
                            });
                        }else{
                            hide_loader();
                            show_notification("Email cannot be verified. Please try again", true);
                            setTimeout(() => {
                                hide_notification();
                            }, 5500);
                        }
                    })
                }else{
                    hide_loader();
                    show_notification("Code expired. Please Try again", true);
                    setTimeout(() => {
                        hide_notification();
                    }, 5500);
                }
            }else{
                hide_loader();
                show_notification("Code not matched", true);
                setTimeout(() => {
                    hide_notification();
                }, 5500);
            }
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
        else if(active_card_tab==="LHV")
            populate_LHV();
        else if(active_card_tab==="Nurse")
            populate_nurse();
    }else{
        if(!prof)
            ipcRenderer.send("staff-deleted", "");
        else
            logout_user(prof.id);
    }
})




/* adding shortcut commands */
window.addEventListener("keyup", (e) => {
    if((e.key==="N" ||  e.key==="n") && !is_active_any_input()){
        show_dialog("add-new-dialog");
    }
});
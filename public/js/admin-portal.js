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
                if(appointments_list[i].app_time>appointments_list[j].app_time){
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
    filtered_appointments_list=filtered_list;
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

    let staff=[], appointments=[], patients=[];

    if(record_type==="All"){
        staff=[...admins_list, ...doctors_list, ...receptionists_list, ...pharmacists_list];
        appointments=[...appointments_list];
        patients=[...patients_list];
    }else if(record_type==="Staff"){
        staff=[...admins_list, ...doctors_list, ...receptionists_list, ...pharmacists_list];
        appointments=[];
        patients=[];
    }else if(record_type==="Appointments"){
        staff=[];
        appointments=[...appointments_list];
        patients=[];
    }else if(record_type==="Patients"){
        staff=[];
        appointments=[];
        patients=[...patients_list];
    }

    ipcRenderer.send("write-excel-file", staff, patients, appointments, patients_list, "write-excel-file-res");
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
    })
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
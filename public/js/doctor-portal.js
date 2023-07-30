let profile=null,
appointment_list=[],
doctors_list = [],
medicine_list=[],
medicine_types_list=[],
registered_tests=[];

let selected_appointment=null;
let editable_prescription_index=-1,
selected_prescription_id=-1,
month_array=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov', 'Dec'];









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
        <span class="bold">F: </span>
        <span>Activate search for appointments</span>
    </p>
    <p>
        <span class="bold">N: </span>
        <span>Add new prescription</span>
    </p>
    <p>
        <span class="bold">CTRL + N: </span>
        <span>Reffer new test</span>
    </p>
    <p>
        <span class="bold">C: </span>
        <span>Add presenting complaints</span>
    </p>
    <p>
        <span class="bold">D: </span>
        <span>Add diagnosis</span>
    </p>
    <p>
        <span class="bold">P: </span>
        <span>Add precautions</span>
    </p>
    <p>
        <span class="bold">A: </span>
        <span>Jump to whole appointment search</span>
    </p>
    <p>
        <span class="bold">R: </span>
        <span>View previous Records of patient</span>
    </p>
    <p>
        <span class="bold">CTRL + RightArrow: </span>
        <span>Send appointment to another doctor</span>
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
        <li>Click on <b>Search Here</b> placed at top of page or press <b>F</b>.</li>
        <li>Now you can search your appointments by using his/her ID.</li>
    </ul>
    <p class="bold">How to select appointment:</p>
    <ul>
        <li>Click on the appointment you want to select. A dialog will appear wants diagnosis of patient.</li>
        <li>After entering diagnosis of patient, click on <b>Proceed</b> button. Selected appointment located at top of all the appointments and its color will like a yellow.</li>
        <li>Now, you will be able to add presenting complaints, diagnosis, precautions, prescriptions or tests against that patient.</li>
    </ul>
    <p class="bold">How to add Prescription(s):</p>
    <ul>
        <li>Click on the + icon located at bottom-right corner of gray color bordered container or press <b>N</b>. A dialog will appears</li>
        <li>In this dialog, put all the details like medicine name, type, quantity and timmings. When you will enter medicine name, medicines available in store automatically offered in dropdown. You can select appropriate from there.</li>
        <li>After enetering all the records, click on <b>Save</b> button to save prescription</li>
    </ul>
    <p class="bold">How to Update or Delete Prescription:</p>
    <ul>
        <li>To edit, click on the <i class="fa-solid fa-edit"></i> icon on the prescription.</li>
        <li>A dialog with previous entered detail appears. Change required data.</li>
        <li>Click on the <b>Update</b> button. Prescription then updated.</li>
        <li>To Delete, click on the <i class="fa-solid fa-trash"></i> icon. Confirmation dialog will appears. Click on <b>Delete</b> button to delete prescription.</li>
    </ul>
    <p class="bold">How to Refer Test:</p>
    <ul>
        <li>If you want to refer test which is taken already, then click on that test which is to be reffered. A dialog will appears.</li>
        <li>Click on <b>confirm</b> button to rereffer test.</li>
        <li>If you want to create new test, then click on the <b>New Test</b> button located at the top of tests container in pink color or press <b>CTRL + N</b>. A dialog will appears.</li>
        <li>Select test from dropdown you want to reffer. Click on the <b>Confirm</b> button to reffer test. If you not find the appropriate test then contact to admin.</li>
        <li>If test is reffered, unless the value for test is not uploaded, color of test is gray.</li>
    </ul>
    <p class="bold">How to see previous record:</p>
    <ul>
        <li>Click on <b>Previous Record</b> button located at bottom-left corner in gray bordered container or press <b>R</b>. A dialog will appear.</li>
        <li>If patient already visited, then records will shown, otherwise no records displayed</li>
        <li>List of records appears date-wise. Open record from arrow given at end of every record heading.</li>
    </ul>
    <p class="bold">How to Submit Appointment:</p>
    <ul>
        <li>After selecting appointment and entering all data, Click on <b>Submit</b> button located in gray bordered container. A dialog will appear.</li>
        <li>Enter the duration of medicine such that how much days, weeks or months patient will have to take these medicines.</li>
        <li>After entering data, click on <b>proceed</b> button. Appointment then submitted.</li>
    </ul>
    <h3 style="color: var(--neon-blue);">In any severe issue, you can contact me on: 0349-9019007 (Whatsapp also)</h3>`;











/* getting data from database on first load */
if(check_network()){
    show_loader();
    ipcRenderer.send("fetch", "/", "get-all-data");
    ipcRenderer.on("get-all-data", (event, isError, prof, data) => {
        if(isError){
            hide_loader();
            show_notification(data, true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{  
            if(prof)
                profile=prof;
            ipcRenderer.send("delete", `settings/password-requests/${prof.id}`, "deleting-request-for-forgot");
            separate_data(data);
            hide_loader();
        }
    })
}







/* supporting functions */
const separate_data = (data) => {
    let staff=data["staff"],
    appointments=data["appointments"],
    medicines=data["medicines"];

    doctors_list=[];
    if(staff){
        for(i of Object.keys(staff)){
            if(staff[i].role==="Doctor"){
                doctors_list.push(staff[i]);
            }
        }
    }
    appointment_list=[];
    if(appointments){
        for(i of Object.keys(appointments)){
            if(selected_appointment && selected_appointment.app_id===appointments[i].app_id)
                selected_appointment=appointments[i];
            else if((appointments[i].status==="at receptionist" || appointments[i].status==="at doctor") && appointments[i].doctor_id===profile.id)
                appointment_list.push(appointments[i]);
            if(appointments[i].status==="done" || appointments[i].status==="dismiss")
                appointment_list.push(appointments[i]);
        }
    }
    medicine_list=[];
    if(medicines){
        for(i of Object.keys(medicines)){
            medicine_list.push(medicines[i]);
        }
    }
    registered_tests=[];
    if(data['settings']['prices']){
        let tests=data['settings']['prices'];
        for(i of Object.keys(tests)){
            registered_tests.push(tests[i]);
        }
    }
    medicine_types_list=[];
    if(data['settings'] && data['settings']['medicine_types']){
        let medicine_types = data['settings']['medicine_types'];
        for(i of Object.keys(medicine_types)){
            medicine_types_list.push(medicine_types[i]);
        }
    }
    populate_dropdown();
    populate_doctor_dropdown();
    if(selected_appointment){
        populate_tests();
        populate_prescriptions();
    }
    populate_appointments();
    populate_all_appointments();
    populate_medicine_type_dropdown();
    check_birthday_and_wish();
}

const populate_dropdown = (search_txt="") => {
    let prescription_dropdown=document.querySelector(".create-prescription-dialog .prescription-name .suggestion-dropdown .suggestion");
    prescription_dropdown.innerHTML="";
    for(i of medicine_list){
        let name=i.name,
        quantity=i.quantity,
        type=i.type,
        salt=i.salt;
        if((name.toLowerCase().includes(search_txt.toLowerCase()) || salt.toLowerCase().includes(search_txt.toLowerCase())) && quantity>0){
            prescription_dropdown.innerHTML+=
                `<p onclick="select_medicine('${name} (${salt} - ${type})', ${i.id}, '${i.type}');" class="${isExpired(i.exp_date)?'expired':''}">${name} (${salt} - ${quantity} ${type})</p>`
        }
    }
}

const populate_medicine_type_dropdown = () => {
    let dropdown = document.querySelector(".create-prescription-dialog select[name='med-type']");
    dropdown.innerHTML="";
    let count=0;
    for(i of medicine_types_list){
        dropdown.innerHTML+=`<option value="${i.name}" ${(count===0)?"selected":""}>${i.name}</option>`;
        count++;
    }
}

const populate_doctor_dropdown = () => {
    let dropdown = document.querySelector(".doctor-list-dialog select[name='doctor-list']");
    dropdown.innerHTML="";
    let count=0;
    let list = doctors_list;
    let online_list=[];
    for(i in list){
        if(list[i].status==="online"){
            online_list.push(list[i]);
            list.splice(i, 1);
        }
    }
    for(i of online_list){
        if(i.id===profile.id) continue;
        dropdown.innerHTML+=`<option value="${i.id}" ${(count===0)?"selected":""}>${i.first_name} ${i.last_name} (Online)</option>`;
    }
    for(i of list){
        if(i.id===profile.id) continue;
        dropdown.innerHTML+=`<option value="${i.id}" ${(count===0)?"selected":""}>${i.first_name} ${i.last_name}</option>`;
    }
}

const show_doctor_selection_dialog = (dialog_class) => {
    if(doctors_list.length===0){
        show_notification("There is no doctor available except you", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }
    show_dialog(dialog_class);
}

const send_appointment = (hidding_elem) => {
    show_loader();
    let doctor_id = document.querySelector(".doctor-list-dialog select[name='doctor-list']").value;
    ipcRenderer.send("insert", `appointments/${selected_appointment.app_id}/doctor_id`, doctor_id, "updating-doctor-id-result");
    ipcRenderer.on("updating-doctor-id-result", (event, res) => {
        if(res){
            selected_appointment=null;
            editable_prescription_index=-1;
            document.querySelector(".prescription h2").classList.add("show");
            document.querySelector(".prescription .main .prescriptions").innerHTML="";
            document.querySelector(".main-container .tests .all-test").innerHTML="";
            populate_appointments();
            hide_dialog(hidding_elem);
            hide_loader();
            show_notification("Appointment sent successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            hide_loader();
            show_notification("Cannot send appointment. Check you connection and try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const isExpired = (date) =>{ 
    let month_array=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let current_Date=new Date(Date.now());
    let given_Month=date.split(" ")[0];
    let given_Year=date.split(" ")[1];
    let index=-1;
    for(i in month_array){
        if(month_array[i]===given_Month){
            index=i;
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

const select_medicine = (name, id, type) => {
    document.querySelector(".create-prescription-dialog textarea[name='med-name']").value=name;
    document.querySelector(".create-prescription-dialog select[name='med-type']").value=type;
    let prescription_dropdown=document.querySelector(".create-prescription-dialog .prescription-name .suggestion-dropdown");
    prescription_dropdown.style.display="none";
    document.querySelector(".create-prescription-dialog .form input[name='med-quantity']").focus();
    selected_prescription_id = id;
}

const populate_tests = () => {
    let tests=JSON.parse(selected_appointment.tests);
    let test_container=document.querySelector(".main-container .tests .all-test");
    let test_DOM="";
    for(i of tests){
        let test_name="";
        for(j of Object.keys(i)[0]){
            if(j==="-")
                test_name+=" ";
            else
                test_name+=j;
        }
        test_DOM+=`<button class="test ${Object.values(i)[0]?"":"disabled"}" style="--clr: var(--neon-blue);" ${Object.values(i)[0]?"onclick='refer_test_dialog(this)'":""}>
            <p>${test_name}</p>`;
        if(typeof(Object.values(i)[0])==="object")
            test_DOM+=`<a style="--clr: var(--neon-pink);" onclick="show_report('${Object.keys(i)[0]}')">Open Report</a>`
        else
            test_DOM+=`<p>${Object.values(i)[0]}</p>`
        test_DOM+=`</button>`
    }
    test_container.innerHTML=test_DOM
}

const populate_prescriptions = () => {
    let container=document.querySelector(".prescription .main .prescriptions");
    let prescriptions=JSON.parse(selected_appointment.prescriptions);
    let prescription_DOM="";
    
    prescriptions.forEach((elem, i) => {
        prescription_DOM+=`<div class="data" style="--clr: rgba(0,0,0,0.4);">
            <p>Name: ${elem.name}</p>
            <p>Quantity: ${elem.quantity} spoons/tablets</p>
            <p>Timings: ${elem.timmings}</p>
            <div>
                <button onclick="edit_prescription_dialog(${i})" style="--clr: var(--neon-blue);"><i class="fa-solid fa-edit"></i></button>
                <button onclick="delete_prescription_dialog(${i});" style="--clr: red;"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>`;
    })
    container.innerHTML=prescription_DOM;
}

const populate_appointments = (search="") => {
    let container=document.querySelector(".appointments .all-app");
    let appointments_DOM="";

    if(selected_appointment){
        appointments_DOM+=`<button class="selected" style="--clr: var(--neon-pink);">
            <p>Sr No: ${selected_appointment.app_id.split("-")[3]}</p>
            <p>${selected_appointment.id}</p>
            <p>${selected_appointment.first_name+" "+selected_appointment.last_name}</p>
        </button>`;
    }

    for(i of appointment_list){
        if((selected_appointment && i.app_id===selected_appointment.app_id) || i.status==="done" || i.status==="dismiss"){
            continue;
        }else if(i.id.includes(search)){
            appointments_DOM+=`<button style="--clr: var(--neon-pink);" onclick="proceed_appointment('${i.app_id}')">
                <p>Sr No: ${i.app_id.split("-")[3]}</p>
                <p>${i.id}</p>
                <p>${i.first_name+" "+i.last_name}</p>
            </button>`;
        }
    }
    container.innerHTML=appointments_DOM;
}

const show_appointment_dialog = (app_id) => {
    let appointment = null;
    for(i of appointment_list){
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
                for(j of registered_tests){
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
    data_container.innerHTML=data_container_DOM;
    show_dialog("show-appointment-dialog");
}

const populate_all_appointments = (filtered_list=null) => {
    if(!filtered_list)
        filtered_list=appointment_list;        
    for(let i=0; i<filtered_list.length; i++){
        for(let j=i+1; j<filtered_list.length; j++){
            if(filtered_list[i].app_time<filtered_list[j].app_time){
                let temp=filtered_list[i];
                filtered_list[i]=filtered_list[j];
                filtered_list[j]=temp;
            }
        }
    }


    let container = document.querySelector(".appointment-search .appointments");
    let container_DOM="";
    for(i of filtered_list){
        if(i.status==="done" || i.status==="dismiss"){
            container_DOM+=`<div class="btn appointment" onclick="show_appointment_dialog('${i.app_id}');">
                <h3>${i.app_id}</h3>
                <p>${i.first_name+" "+i.last_name} (${i.id})</p>
                <p>Status: ${i.status}</p>
            </div>`;
        }
    }
    container.innerHTML=container_DOM;
}

const populate_new_test_dialog = (dialog_class) => {
    if(!selected_appointment)
        return;
    if(!registered_tests.length){
        show_notification("None of tests loaded from database. Refresh the page and try again", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }
    show_loader();
    let test_name_inp=document.querySelector(".reffer-test-dialog .input select[name='test-name']");
    test_name_inp.innerHTML="";
    let taken_tests=JSON.parse(selected_appointment.tests);
    for(i of registered_tests){
        let isTaken=false;
        for(j of taken_tests){
            if(Object.keys(j)[0]===i.name){
                isTaken=true;
                break;
            }
        }
        if(!isTaken){
            let test_name="";
            for(j of i.name){
                if(j==="-")
                    test_name+=" ";
                else
                    test_name+=j;
            }
            test_name_inp.innerHTML+=`<option value="${i.name}">${test_name}</option>`;
        }
    }
    hide_loader();
    show_dialog(dialog_class);  
}

const populate_prev_record = () => {
    show_loader();
    let prev_record_list=[];
    for(i of appointment_list){
        if(i.id===selected_appointment.id && (i.status==="done" || i.status==="dismiss")){
            prev_record_list.push(i);
        }
    }

    for(i in prev_record_list){
        for(j in i+1){
            if(prev_record_list[i].app_time>prev_record_list[(j)%prev_record_list.length].app_time){
                let temp=prev_record_list[i];
                prev_record_list[i]=prev_record_list[j]
                prev_record_list[j]=temp;
            }
        }
    }

    let container=document.querySelector(".dialog .prev-record-dialog .data");
    let no_records_label=document.querySelector(".dialog .prev-record-dialog .no-records");

    if(prev_record_list.length>0){
        no_records_label.style.display="none";
        let prev_record_DOM="";

        for(i of prev_record_list){
            let doctor_name="";
            for(j of doctors_list){
                if(j.id===i.doctor_id){
                    doctor_name=`${j.first_name} ${j.last_name}`;
                    break;
                }
            }

            let date=new Date(i.app_time);
            let months=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

            prev_record_DOM+=`<div class="record">
            <h3 onclick="this.parentElement.classList.toggle('show');">
                <span>${date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear()}</span>
                <span><i class="fa-solid fa-angle-down"></i></span>
            </h3>
            <div class="datum">
                <p>
                    <span class="bold">Sr. No: </span>
                    <span>${i.app_id.split("-")[3]}</span>
                </p>
                <p>
                    <span class="bold">Diagnosis: </span>
                    <span>${i.diagnosis}</span>
                </p>
                <p>
                    <span class="bold">Precautions: </span>
                    <span>${i.precautions}</span>
                </p>
                <p>
                    <span class="bold">Appointment Time: </span>
                    <span>${((date.getHours()>10)?date.getHours():"0"+date.getHours())+":"+((date.getMinutes()>10)?date.getMinutes():"0"+date.getMinutes())}</span>
                </p>
                <p>
                    <span class="bold">Doctor Name: </span>
                    <span>${doctor_name}</span>
                </p>
                <p>
                    <span class="bold">Status: </span>
                    <span>${i.status}</span>
                </p>
                <p>
                    <span class="bold">Duration: </span>
                    <span>${i.duration?i.duration:""}</span>
                </p>
                <div class="tests">
                    <h3>Tests</h3>`;

                for(j of JSON.parse(i.tests)){
                    if(typeof(j[Object.keys(j)[0]])==="object"){
                        prev_record_DOM+=`<p>
                        <span class="bold">${Object.keys(j)}: </span>
                        <span><i>[REPORT]</i></span>
                    </p>`
                    }else{
                        prev_record_DOM+=`<p>
                            <span class="bold">${Object.keys(j)}: </span>
                            <span>${j[Object.keys(j)[0]]}</span>
                        </p>`
                    }
                }
                
                prev_record_DOM+=`</div>
                <div class="prescriptions">
                    <h3>Prescriptions</h3>
                    <div class="prescription">`

                    JSON.parse(i.prescriptions).forEach((elem, i) => {
                        prev_record_DOM+=`<p class="bold heading">Prescription ${i+1}</p>
                            <p>
                                <span class="bold">Name: </span>
                                <span>${elem.name}</span>
                            </p>
                            <p>
                                <span class="bold">Quantity: </span>
                                <span>${elem.quantity}</span>
                            </p>
                            <p>
                                <span class="bold">Given Quantity: </span>
                                <span>${elem.given_quantity}</span>
                            </p>
                            <p>
                                <span class="bold">Timmings: </span>
                                <span>${elem.timmings}</span>
                            </p>`
                    })
                    
                    prev_record_DOM+=`</div>
                </div>
            </div>
        </div>`
        }
        container.innerHTML=prev_record_DOM;
    }else{
        no_records_label.style.display="block"
    }


    hide_loader();
    show_dialog("prev-record-dialog");
}

const populate_cbc_report = (test) => {

    let report=document.querySelector(".reports .report.cbc");
    report.classList.add("show")
    let report_header=document.querySelector(".reports .report.cbc .header");
    let table=document.querySelector(".reports .report.cbc .table table tbody");

    report_header.querySelector("p span.id").innerHTML=selected_appointment.id;
    report_header.querySelector("p span.name").innerHTML=selected_appointment.first_name+" "+selected_appointment.last_name;
    report_header.querySelector("p span.s-id").innerHTML=test.sample_id;
    report_header.querySelector("p span.op-id").innerHTML=test.operator_id;
    let today=new Date(test.reg_date);
    let [h, m, s]=[today.getHours(), today.getMinutes(), today.getSeconds()];
    let date=today.getDate()+" "+month_array[today.getMonth()]+" "+today.getFullYear()+", ";
    date+=((h<10)? "0"+h:h)+":"+((m<10)? "0"+m:m)+":"+((s<10)? "0"+s:s);
    report_header.querySelector("p span.reg-date").innerHTML=date;
    report.querySelector(".comment p").innerHTML=test.comment;


    table.innerHTML="";
    for(i of test.result){
        table.innerHTML+=`<tr>
            <td>${i.name}</td>
            <td>${i.result}</td>
            <td>${i.flags}</td>
            <td>${i.unit}</td>
            <td>${i.limit}</td>
            </tr>`;
    }
    document.querySelector(".reports").scrollIntoView({behavior:"smooth"});
}

create_navigation()
setup_show_password();




// search functionality...
let search_inp = document.querySelector(".personal-navigation .search input[name='search']");
search_inp.addEventListener("input", (e) => {
    populate_appointments(search_inp.value)
})

// prescription quantity input filter functionality...
let prescription_quantity_inp=document.querySelector(".create-prescription-dialog .input input[name='med-quantity']");
prescription_quantity_inp.addEventListener("input", (e) => {
    let val=e.target.value
    let final_val="";
    for(i of val){
        if(i>='0' && i<='9'){
            final_val+=i;
        }
    }
    prescription_quantity_inp.value=final_val;
})

// prescription name with its search functionality...
let prescription_name=document.querySelector(".create-prescription-dialog .form textarea[name='med-name']");
prescription_name.addEventListener("input", (e) => {
    let prescription_dropdown=document.querySelector(".create-prescription-dialog .prescription-name .suggestion-dropdown");
    if(e.target.value.length>0)
        prescription_dropdown.style.display="flex";
    else
        prescription_dropdown.style.display="none";
    populate_dropdown(e.target.value);
    selected_prescription_id=0;
});

// all appointments search functionality...
let all_app_search = document.querySelector(".appointment-search .search input");
all_app_search.addEventListener("input", (e) => {
    let search_txt = e.target.value;
    
    let search_type="app_id";
    let is_int=false;
    let isString=false;
    for(i of search_txt){
        if(i>='0' && i<='9'){
            is_int=true;
        }else{
            is_int=false;
            break;
        }
    }
    if(is_int){
        search_type="id";
    }else{
        for(i of search_txt){
            if(i>='0' && i<='9'){
                isString=false;
                break;
            }else{
                isString=true;
            }
        }
        if(isString){
            search_type="first_name";
        }
    }

    let filtered_list=[];
    for(i of appointment_list){
        if((search_type==="app_id" && i.app_id.includes(search_txt)) || (search_type==="id" && i.id.includes(search_txt)) || (search_type==="first_name" && (i.first_name+" "+i.last_name).toLowerCase().includes(search_txt.toLowerCase()))){
            filtered_list.push(i);
        }
    }
    
    populate_all_appointments(filtered_list);
});






/* prescription side coding */

const refer_test_dialog = (old_test_elem) => {
    let report=old_test_elem.querySelector("a");
    if(report && window.event.target===report)
        return;
    let test_name=old_test_elem.querySelector("p:first-child").innerHTML
    let test_name_elem=document.querySelector(".dialog .reffer-test-dialog p");
    test_name_elem.classList.add("show");
    test_name_elem.querySelector("b").innerHTML=test_name;
    show_dialog("reffer-test-dialog");
}
const reffer_test = () => {
    show_loader();
    let test_name=""
    let test_obj={};
    let tests=JSON.parse(selected_appointment.tests);

    let dialog=document.querySelector(".reffer-test-dialog");
    let test_name_elem=dialog.querySelector("p");
    let test_name_inp=dialog.querySelector(".input select[name='test-name']");
    if(test_name_elem.className.includes("show")){
        test_name=test_name_elem.querySelector("b").innerHTML;
        test_obj[`${test_name}`]=""
        for(i in tests){
            if(Object.keys(tests[i])[0]===test_name){
                tests[i]=test_obj;
                break;
            }
        }
    }else{
        if(test_name_inp.value){
            test_name=test_name_inp.value
            test_obj[`${test_name}`]=""
            tests.push(test_obj)
        }
        else{
            hide_loader();
            show_notification("Fill empty field first", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
            test_name_inp.focus()
            return;
        }
    }

    selected_appointment.tests=JSON.stringify(tests);
    ipcRenderer.send("insert", `appointments/${selected_appointment.app_id}/`, selected_appointment, "reffer-test-result");
    ipcRenderer.on("reffer-test-result", (event, res) => {
        hide_loader();
        if(res){
            show_notification("Test reffered successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
            hide_dialog(dialog.querySelector(".cancel"));
            test_name_elem.classList.remove("show");
        }else{
            show_notification("Cannot reffer. Please try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const presenting_complaints_dialog = () => {
    if(!selected_appointment)
        return;
    let complain="";
    if(selected_appointment.presenting_complaints)
        complain=selected_appointment.presenting_complaints;
    document.querySelector(".presenting-complaints-dialog textarea[name='complain']").value=complain;
    show_dialog("presenting-complaints-dialog");
}
const save_presenting_complaints = (hidding_elem) => {
    let complain=hidding_elem.parentElement.querySelector("textarea").value;
    if(!complain){
        hide_dialog(hidding_elem);
        return;
    }
    selected_appointment.presenting_complaints=complain;
    ipcRenderer.send("insert", `appointments/${selected_appointment.app_id}/presenting_complaints`, complain, "complain-saving-result");
    hide_dialog(hidding_elem);
    ipcRenderer.on("complain-saving-result", (event, res) => {
        if(res){
            show_notification("Complain Saved successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const diagnosis_dialog = () => {
    if(!selected_appointment)
        return;

    show_loader()
    let diagnosis="";
    if(selected_appointment && selected_appointment.diagnosis)
        diagnosis = selected_appointment.diagnosis;

    document.querySelector(".diagnosis-dialog .input textarea").value=diagnosis;
    show_dialog("diagnosis-dialog");
    hide_loader()
}
const save_diagnosis = (hidding_elem) => {
    let diagnosis = hidding_elem.parentElement.querySelector("textarea").value;
    if(!diagnosis){
        hide_dialog(hidding_elem);
        return;
    }
    selected_appointment.diagnosis=diagnosis;

    ipcRenderer.send("insert", `appointments/${selected_appointment.app_id}/diagnosis`, diagnosis, "diagnosis-result");
    hide_dialog(hidding_elem);
    ipcRenderer.on("diagnosis-result", (event, res) => {
        if(res){
            show_notification("Diagnosis Saved Successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });

}

const precautions_dialog = () => {
    document.querySelector(".precaution-dialog textarea[name='precaution']").value=selected_appointment.precautions;
    show_dialog("precaution-dialog")
}
const save_precautions = () => {
    let precaution_inp=document.querySelector(".precaution-dialog textarea[name='precaution']");
    if(!precaution_inp.value){  
        show_notification("Fill empty field first", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        precaution_inp.focus()
        return;
    }
    selected_appointment.precautions=precaution_inp.value;
    ipcRenderer.send("insert", `appointments/${selected_appointment.app_id}/`, selected_appointment, "save-precautions-result");
    ipcRenderer.on("save-precautions-result", (event, res) => {
        if(res){
            show_notification("Precautions updated successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            show_notification("Precautions cannot updated", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    })
    hide_dialog(document.querySelector(".dialog .precaution-dialog .cancel"));
    document.querySelector(".prescription .precautions").scrollIntoView({behavior: "smooth"})
}


const proceed_appointment = (app_id) => {
    show_loader();
    selected_appointment=null;
    for(i of appointment_list){
        if(i.app_id===app_id){
            selected_appointment=i;
            break;
        }
    }

    if(!selected_appointment){
        hide_loader();
        show_notification("Cannot find appointment. Please Refresh the page and try again");
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }

    ipcRenderer.send("insert", `appointments/${selected_appointment.app_id}/status`, "at doctor", "select-appointment-result");
    ipcRenderer.on("select-appointment-result", (event, res) => {
        if(res){
            populate_tests();
            populate_prescriptions();
            populate_appointments();
            document.querySelector(".prescription h2").classList.remove("show");
            document.querySelector(".prescription .top-controls").scrollIntoView({behavior: "smooth"})
            hide_loader();
        }else{
            hide_loader();
            show_notification("Please check your network connection and try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const show_report = (test_name) => {
    let test=null;
    let all_tests=JSON.parse(selected_appointment.tests);
    for(i of all_tests){
        if(Object.keys(i)[0]===test_name){
            test=i[Object.keys(i)[0]];
            break;
        }
    }

    if(!test){
        show_notification("Report not found. Try by refering again", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return
    }

    if(test.template_type==="cbc"){
        populate_cbc_report(test);
    }    

}








/* code for managing prescriptions */
const save_prescription = (elem) => {
    if(elem.innerHTML==="Update"){
        update_prescription()
        return;
    }

    let dialog=document.querySelector(".dialog .create-prescription-dialog"),
    name_inp=dialog.querySelector(".input textarea[name='med-name']"),
    type_inp=dialog.querySelector(".input select[name='med-type']"),
    timmings1=dialog.querySelectorAll(".timings input[name='time']"),
    timmings2=dialog.querySelectorAll(".timings input[name='meal']");

    let errors=false;
    let error_text="";
    if(!name_inp.value){
        name_inp.focus();
        error_text="Fill Empty Fields First...";
        errors=true;
    }else if(!prescription_quantity_inp.value){
        quantity_inp.focus();
        error_text="Fill Empty Fields First...";
        errors=true;
    }else{
        errors=true;
        for(i of timmings1){
            if(i.checked){
                errors=false;
                break;
            }
        }
        if(!errors){
            errors=true;
            for(i of timmings2){
                if(i.checked){
                    errors=false;
                    break;
                }
            }
        }
        if(errors)
            error_text="Please select proper timmings for medicine.";
    }
    if(errors){
        show_notification(error_text, true)
        setTimeout(() => {
            hide_notification()
        }, 5500);
        return;
    }

    
    let prescription_obj={
        name: name_inp.value,
        quantity: prescription_quantity_inp.value
    };
    if(selected_prescription_id!==-1){
        prescription_obj.med_id = selected_prescription_id;
    }
    prescription_obj.type=type_inp.value;
    let times="(";
    for(i of timmings2){
        if(i.checked)
            times+=i.value+","
    }
    times = times.substr(0, times.length-1)+")/(";
    for(i of timmings1){
        if(i.checked)
            times+=i.value+",";
    }
    times=times.substr(0, times.length-1)+")";
    prescription_obj.timmings=times;
    let prescriptions=JSON.parse(selected_appointment.prescriptions);
    prescriptions.push(prescription_obj);
    selected_appointment.prescriptions=JSON.stringify(prescriptions);
    ipcRenderer.send("insert", `appointments/${selected_appointment.app_id}/`, selected_appointment, "save-prescriptions-result");
    ipcRenderer.on("save-prescriptions-result", (event, res) => {
        if(res){
            show_notification("Prescription added successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            show_notification("Prescription cannot added", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    })
    populate_prescriptions();
    hide_dialog(dialog.querySelector(".cancel"));
    selected_prescription_id=0;
}
const edit_prescription_dialog = (index) => {
    editable_prescription_index=index;
    if(editable_prescription_index===-1)
        return;

    let prescription=selected_appointment.prescriptions[index],
    dialog=document.querySelector(".dialog .create-prescription-dialog"),
    med_name=dialog.querySelector("textarea[name='med-name']"),
    med_type=dialog.querySelector("select[name='med-type']"),
    med_quantity=dialog.querySelector("input[name='med-quantity']"),
    timmings1=dialog.querySelectorAll("input[name='time']"),
    timmings2=dialog.querySelectorAll("input[name='meal']");

    med_name.value=prescription.name;
    med_type.value=prescription.type;
    med_quantity.value=prescription.quantity;
    for(i of timmings1){
        if(prescription.timmings.includes(i.value))
            i.checked=true;
        else
            i.checked=false;
    }
    for(i of timmings2){
        if(prescription.timmings.includes(i.value))
            i.checked=true;
        else
            i.checked=false;
    }
    dialog.querySelector(".controls button:last-child").innerHTML="Update";
    selected_prescription_id=0;
    show_dialog('create-prescription-dialog');
}
const update_prescription = () => {
    let dialog=document.querySelector(".dialog .create-prescription-dialog"),
    name_inp=dialog.querySelector(".input textarea[name='med-name']"),
    type_inp=dialog.querySelector(".input select[name='med-type']"),
    timmings1=dialog.querySelectorAll(".timings input[name='time']"),
    timmings2=dialog.querySelectorAll(".timings input[name='meal']");

    let errors=false;
    let error_text="";
    if(!name_inp.value){
        name_inp.focus();
        error_text="Fill Empty Fields First...";
        errors=true;
    }else if(!prescription_quantity_inp.value){
        quantity_inp.focus();
        error_text="Fill Empty Fields First...";
        errors=true;
    }else{
        errors=true;
        for(i of timmings1){
            if(i.checked){
                errors=false;
                break;
            }
        }
        if(!errors){
            errors=true;
            for(i of timmings2){
                if(i.checked){
                    errors=false;
                    break;
                }
            }
        }
        if(errors)
            error_text="Please select proper timmings for medicine. Thanks";
    }
    if(errors){
        show_notification(error_text, true)
        setTimeout(() => {
            hide_notification()
        }, 5500);
        return;
    }
    
    let prescription_obj={
        name: name_inp.value,
        quantity: prescription_quantity_inp.value
    };
    if(selected_prescription_id!==0){
        prescription_obj.med_id = selected_prescription_id;
    }
    prescription_obj.type=type_inp.value;
    let times="(";
    for(i of timmings2){
        if(i.checked)
            times+=i.value+","
    }
    times = times.substr(0, times.length-1)+")/(";
    for(i of timmings1){
        if(i.checked)
            times+=i.value+",";
    }
    times=times.substr(0, times.length-1)+")";
    prescription_obj.timmings=times;
    let prescriptions=JSON.parse(selected_appointment.prescriptions)
    prescriptions[editable_prescription_index] = prescription_obj;
    selected_appointment.prescriptions=JSON.stringify(prescriptions);

    ipcRenderer.send("insert", `appointments/${selected_appointment.app_id}/`, selected_appointment, "update-prescription-result");
    ipcRenderer.on("update-prescription-result", (event, res) => {
        if(res){
            show_notification("Prescription updated successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            show_notification("Prescription cannot updated", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    })

    populate_prescriptions()
    let update_btn=dialog.querySelector(".controls button:last-child");
    update_btn.innerHTML="Save"
    editable_prescription_index=-1;
    selected_prescription_id=0;
    hide_dialog(dialog.querySelector(".cancel"));
}
const delete_prescription_dialog = (index) => {
    let dialog = document.querySelector(".dialog .delete-prescription-dialog")
    dialog.setAttribute("id", `${index}`);
    selected_prescription_id=0;
    show_dialog("delete-prescription-dialog");
}
const delete_prescription = () => {
    let dialog=document.querySelector(".dialog .delete-prescription-dialog");
    let index = parseInt(dialog.getAttribute("id"));
    let prescriptions=JSON.parse(selected_appointment.prescriptions)
    prescriptions.splice(index, 1);
    selected_appointment.prescriptions=JSON.stringify(prescriptions);

    ipcRenderer.send("insert", `appointments/${selected_appointment.app_id}/`, selected_appointment, "delete-prescription-result");
    ipcRenderer.on("delete-prescription-result", (event, res) => {
        if(res){
            show_notification("Prescription deleted successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            show_notification("Prescription cannot deleted", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    })

    populate_prescriptions();
    hide_dialog(dialog.querySelector(".cancel"));
}






/* appointment submission code */
const submit_appointment = () => {
    let duration_inp=document.querySelector(".prescription-days-dialog input[name='duration']"),
    duration_unit_inp=document.querySelector(".prescription-days-dialog select[name='duration-unit']");
    if(duration_inp.value){
        for(i of duration_inp.value){
            if(!(i>='0' && i<='9')){
                show_notification("Please enter data only depends on numbers", true);
                setTimeout(() => {
                    hide_notification();
                }, 5500);
                duration_inp.focus();
                return;
            }
        }
    }else{
        show_notification("Please fill empty field first", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        duration_inp.focus();
        return;
    }

    show_loader()
    selected_appointment.status="at pharmacist";
    selected_appointment.duration=duration_inp.value+" "+duration_unit_inp.value;

    let tests=JSON.parse(selected_appointment.tests);
    for(i in tests){
        if(!tests[i][Object.keys(tests[i])[0]]){
            tests.splice(i, 1);
        }
    }
    selected_appointment.tests=JSON.stringify(tests);
    
    ipcRenderer.send("insert", `appointments/${selected_appointment.app_id}/`, selected_appointment, "submit-appointment-result");
    ipcRenderer.on("submit-appointment-result", (event, res) => {
        if(res){
            selected_appointment=null
            editable_prescription_index=-1;

            document.querySelector(".prescription h2").classList.add("show");

            document.querySelector(".prescription .main .prescriptions").innerHTML="";
            document.querySelector(".main-container .tests .all-test").innerHTML="";
            hide_dialog(document.querySelector(".prescription-days-dialog .cancel"));
            populate_appointments();
            hide_loader();
            show_notification("Appointment submitted successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            hide_loader();
            show_notification("Appointment cannot submitted", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}







/* listening live data change */
ipcRenderer.on("live-value-update-captured", (event, data) => {
    let prof=data["staff"][profile.id];
    if(prof && prof.role==="Doctor" && prof.status==="online"){
        separate_data(data);
    }else{
        if(!prof)
            ipcRenderer.send("staff-deleted", "");
        else
            logout_user();
    }
});






/* adding shortcuts */
window.addEventListener("keyup", (e) => {
    if(e.ctrlKey && (e.key==="N" || e.key==="n") && !active_dialog && selected_appointment){
        populate_new_test_dialog('reffer-test-dialog');
    }
    else if(e.ctrlKey && e.key.toLowerCase()==="arrowright" && !active_dialog && selected_appointment){
        show_doctor_selection_dialog('doctor-list-dialog');
    }
    else if((e.key==="N" || e.key==="n") && !active_dialog && !is_active_any_input() && selected_appointment){
        show_dialog('create-prescription-dialog');
    }
    else if((e.key==="C" || e.key==="c") && !active_dialog && !is_active_any_input() && selected_appointment){
        presenting_complaints_dialog();
    }
    else if((e.key==="D" || e.key==="d") && !active_dialog && !is_active_any_input() && selected_appointment){
        diagnosis_dialog();
    }
    else if((e.key==="p" || e.key==="P") && !active_dialog && !is_active_any_input() && selected_appointment){
        precautions_dialog();
    }
    else if((e.key==="r" || e.key==="R") && !active_dialog && !is_active_any_input() && selected_appointment){
        populate_prev_record();
    }
    else if((e.key==="a" || e.key==="A") && !active_dialog && !is_active_any_input()){
        document.querySelector(".appointment-search .search input[name='appointment-search']").focus();
        document.querySelector(".appointment-search").scrollIntoView({behavior:"smooth"});
    }
});
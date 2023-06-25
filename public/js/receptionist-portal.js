let profile=null,
patient_list=[],
appointments_list=[],
doctor_list=[],
all_with_no_admin_list=[],
medicine_list=[],
registered_tests_list=[],
selected_patient=null,
selected_app=null,
latest_appointment=null;

let filtered_name="";
let filtered_fatherName="";
let filtered_gender="Male,Female,Other";
let filtered_number="";
let id_inp=document.querySelector(".main-container .id-sec .input input[name='id']");

let month_array=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov', 'Dec'];










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
        <span>Register New Patient</span>
    </p>
    <p>
        <span class="bold">F: </span>
        <span>Search Appointments</span>
    </p>
    <p>
        <span class="bold">?: </span>
        <span>Try Another Way for searching appointnment</span>
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
    <p class="bold">How to Register New Patient:</p>
    <ul>
        <li>First of all open <b>Add New Patient</b> form by using + icon placed at top-right or press N (ensure that focus is not at any other input).</li>
        <li>Fill all the fields in this form. <b>CNIC</b> and <b>Blood group</b> can be negligible.</li>
        <li>At last, click on the <b>Register</b> button which is located at bottom of dialog. System automatically generate ID for patient and another dialog will appear.</li>
        <li>If you want to print patient card then click on <b>Print Card</b> button otherwise cancel it.</li>
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
        <li>Click on <b>Search Here</b> placed at top of page or press <b>F</b>. (For shortcut, it will ensured that focus will not be on another input).</li>
        <li>Now, You can search appointments by using ID.</li>
    </ul>
    <p class="bold">How to Generate Appointment:</p>
    <ul>
        <li>Enter ID of patient in <b>New Appointment</b> section na dpress enter or press <i class="fa-solid fa-arrow-right"></i> button to proceed.</li>
        <li>At <b>Appointment Data</b> section, If appointment already generated, then tests which have thier results uploaded will be locked and other will opened for uplaoding thier results.</li>
        <li>Enter data for tests or generate report (Explained in "How to generate Report") for them and click on Generate Appointment or Update Appointment. A dialog will appears.</li>
        <li>Select doctor from dialog and click on <b>proceed</b> button to send appointment.</li>
    </ul>
    <p class="bold">How to generate Report:</p>
    <ul>
        <li>Click on the <i class="fa-solid fa-vial-circle-check"></i> button located at left side of Update Appointment or Generate Appointment. A dialog will appears.</li>
        <li>In this dialog, Enter sample ID, select operator from dropdown and select test from dropdown and click on <b>Generate</b> button to register report.</li>
        <li>After recieving report from LAB, after selecting appointment click on that report button and fill all the data and click <b>Finish</b> button to save it.</li>
    </ul>
    <p class="bold">How to use Try Another Way section:</p>
    <ul>
        <li>Click on the <b>try another way</b> button located in the New Appointment section or press <b>?</b> or scroll down at bottom of page. For shortcut key, ensure that focus is not at any other input.</li>
        <li>In this section, there are four filters: Name, Fathername, Gender or Contact Number. Which filter value is entered, the data against this search will displayed at under the filters.</li>
        <li>At the top-right corner of the try another way section, there is a button which is used for clear all filters</li>
    </ul>`;










/* getting data from database on first load */
if(check_network()){
    show_loader()
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
    });
}








/* supporting functions */

const separate_data = (data) => {
    let staff=data['staff'],
    medicines=data['medicines'],
    patients=data['patients'],
    appointments=data['appointments'];

    all_with_no_admin_list=[];
    if(staff){
        for(i of Object.keys(staff)){
            if(staff[i].role==="Receptionist")
                all_with_no_admin_list.push(staff[i]);
        }
        for(i of Object.keys(staff)){
            if(staff[i].role==="Pharmacist")
                all_with_no_admin_list.push(staff[i]);
        }
        for(i of Object.keys(staff)){
            if(staff[i].role==="Doctor")
                all_with_no_admin_list.push(staff[i]);
        }
    }
    doctor_list=[];
    if(staff){
        for(i of Object.keys(staff)){
            if(staff[i].role==="Doctor")
                doctor_list.push(staff[i]);
        }
    }
    medicine_list=[];
    if(medicines){
        for(i of Object.keys(medicines)){
            medicine_list.push(medicines[i]);
        }
    }
    patient_list=[];
    if(patients){
        for(i of Object.keys(patients)){
            patient_list.push(patients[i]);
        }
    }
    appointments_list=[];
    latest_appointment=null;
    if(appointments){
        for(i of Object.keys(appointments)){
            if(!latest_appointment)
                latest_appointment=appointments[i];
            else if(latest_appointment.app_time<appointments[i].app_time)
                latest_appointment=appointments[i];

            if(appointments[i].status==="at receptionist" || appointments[i].status==="at doctor")
                appointments_list.push(appointments[i]);
        }
    }

    registered_tests_list=[];
    if(data['settings'] && data['settings']['prices']){
        let tests=data['settings']['prices'];
        for(i of Object.keys(tests)){
            registered_tests_list.push(tests[i]);
        }
    }

    let doctor_inp = document.querySelector(".doctor-selection-dialog select[name='doctor-name']");
    doctor_inp.innerHTML="";
    for(i of doctor_list){
        if(i.status==="online")
        doctor_inp.innerHTML+=`<option value="${i.id}">${i.first_name+" "+i.last_name} (Online)</option>`;
    }
    for(i of doctor_list){
        if(i.status==="offline")
        doctor_inp.innerHTML+=`<option value="${i.id}">${i.first_name+" "+i.last_name}</option>`;
    }

    if(selected_patient)
        select_patient(selected_patient.id);
    populate_try_another();
}

const reset_appointment_container = () => {
    let empty_message = document.querySelector(".main-container .app-detail .not-selected");
    let patient_info=document.querySelector(".main-container .id-sec .patient-info");
    selected_app=null;
    selected_patient=null;
    empty_message.classList.add("show");
    id_inp.value=""
    patient_info.innerHTML=""
    document.querySelectorAll(".app-detail .tests").innerHTML=`<div class="side-by-side">
        <div class="input">
            <input type="text" name="BP" required>
            <span>BP</span>
            <i></i>
        </div>
        <div class="input">
            <input type="text" name="Pulse" required>
            <span>Pulse</span>
            <i></i>
        </div>
    </div>
    <div class="side-by-side">
        <div class="input">
            <input type="text" name="Temp" required>
            <span>Temp</span>
            <i></i>
        </div>
        <div class="input">
            <input type="text" name="Weight" required>
            <span>Weight</span>
            <i></i>
        </div>
    </div>`;
    let report_btn=document.querySelector(".app-detail .controls button:first-child");
    let generate_app_btn=document.querySelector(".app-detail .controls button:last-child");
    report_btn.style.display="block";
    generate_app_btn.style.display="block";
    generate_app_btn.innerHTML="Generate Appointment"
    generate_app_btn.style.backgroundColor="var(--neon-blue)";
}

const validate_patient_form = (dialog_class) => {
    let dialog=document.querySelector(`.dialog .${dialog_class}`);
    let first_name_inp=dialog.querySelector("input[name='first-name']");
    let last_name_inp=dialog.querySelector("input[name='last-name']");
    let father_name_inp=dialog.querySelector("input[name='father-name']");
    let dob_inp=dialog.querySelector("input[name='dob']");
    let contact_inp=dialog.querySelector("input[name='contact']");
    let cnic_inp=dialog.querySelector("input[name='cnic']");
    let address_inp=dialog.querySelector("textarea[name='address']");

    let errors="";
    if(!first_name_inp.value || !last_name_inp.value || !father_name_inp.value || !dob_inp.value || !contact_inp.value || !address_inp.value) {
        show_notification("Fill empty field(s) first", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);

        if(!first_name_inp.value)
            first_name_inp.focus()
        else if(!last_name_inp.value)
            last_name_inp.focus()
        else if(!father_name_inp.value)
            father_name_inp.focus()
        else if(!dob_inp.value)
            dob_inp.focus()
        else if(!contact_inp.value)
            contact_inp.focus()
        else if(!address_inp.value)
            address_inp.focus()

        return false;
    }

    [first_name_inp, last_name_inp, father_name_inp].forEach((elem) => {
        if(!errors){
            for(i of elem.value){
                if(!((i>='A' && i<='Z') || (i>='a' && i<='z') || i===' ')){
                    errors="Names does not contain any numeric or special characters...";
                    show_notification(errors, true);
                    elem.focus();
                    setTimeout(() => {
                        hide_notification();
                    }, 5500)
                }
            }
        }
    })
    if(errors){
        return false;
    }

    [contact_inp, cnic_inp].forEach((elem, index) => {
        if(!errors){
            for(i of elem.value){
                if(!((i>='0' && i<='9') || i==='+')){
                    if(index===0)
                        errors+="Contact Number ";
                    else if(index === 1)
                        errors+="CNIC ";
                    errors+="does not contain any special character";
                    show_notification(errors, true);
                    setTimeout(() => {
                        hide_notification();
                    }, 5500);
                    elem.focus();
                }
            }
        }
    })
    if(errors)
        return false;

    let [y,m,d]=dob_inp.value.split("-");
    let current_date=new Date(Date.now());
    if(parseInt(y)>current_date.getFullYear()){
        errors="Year cannot be greater then current date in birth date";
    }else if(parseInt(y)===current_date.getFullYear()){
        if(parseInt(m)>current_date.getMonth()+1){
            errors="Month cannot be greater then current date in birth date";
        }else if(parseInt(m)===current_date.getMonth()+1){
            if(parseInt(d)>current_date.getDate()){
                errors="Date cannot be greater then current date in birth date";
            }
        }
    }   
    if(errors){
        show_notification(errors, true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return false;
    }

    return true;
}

const calculate_age = (dob) => {
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

    return `${calc_year?(calc_year)+"Y":""} ${calc_month?(calc_month)+"M":""} ${calc_days?(calc_days)+"D":""}`;
}

const isFocusInputs = () => {
    let all_inps=document.querySelectorAll("input, textarea");
    let isOK=false;
    for(i of all_inps){
        if(i===document.activeElement){
            isOK=true;
            break;
        }
    }
    return isOK;
} 

const populate_cbc_report = (test_name) => {
    let CBC_DOM=[
        {name: "WBC", unit:"10<sup>3</sup>/&mu;l", limit:"4.0/12.0"},
        {name: "LYM", unit:"10<sup>3</sup>/&mu;l", limit:"1.0/5.0"},
        {name: "MON", unit:"10<sup>3</sup>/&mu;l", limit:"0.1/1.0"},
        {name: "GRA", unit:"10<sup>3</sup>/&mu;l", limit:"2.0/8.0"},
        {name: "LYM%", unit:"%", limit:"25.0/50.0"},
        {name: "MON%", unit:"%", limit:"2.0/10.0"},
        {name: "GRA%", unit:"%", limit:"50.0/80.0"},
        {name: "RBC", unit:"10<sup>6</sup>/&mu;l", limit:"4.0/6.20"},
        {name: "HGB", unit:"g/dl", limit:"11.0/17.0"},
        {name: "HCT", unit:"%", limit:"35.0/55.0"},
        {name: "MCV", unit:"&mu;m<sup>3</sup>", limit:"80.0/100.0"},
        {name: "MCH", unit:"pg", limit:"26.0/34.0"},
        {name: "MCHC", unit:"g/dl", limit:"31.0/35.5"},
        {name: "RDWC", unit:"%", limit:"10.0/16.0"},
        {name: "RDWS", unit:"&mu;m<sup>3</sup>", limit:"37.0/47.8"},
        {name: "PLT", unit:"10<sup>3</sup>/&mu;l", limit:"150/400"},
        {name: "MPV", unit:"&mu;m<sup>3</sup>", limit:"7.0/11.0"},
        {name: "PCT", unit:"%", limit:"0.200/0.500"},
        {name: "PDW", unit:"%", limit:"10.0/18.0"},
        {name: "PLCR", unit:"%", limit:"12.0/42.0"},
    ];

    let report=document.querySelector(".reports .report.cbc");
    report.classList.add("show")
    report.setAttribute("id", test_name);
    let report_header=document.querySelector(".reports .report.cbc .header");
    let table=document.querySelector(".reports .report.cbc .table table tbody");

    let test={};
    let all_tests=JSON.parse(selected_app.tests);
    for(i of all_tests){
        if(Object.keys(i)[0]===test_name){
            test=i[Object.keys(i)[0]];
            break;
        }
    }

    report_header.querySelector("p span.id").innerHTML=selected_app.id;
    report_header.querySelector("p span.name").innerHTML=selected_app.first_name+" "+selected_app.last_name;
    report_header.querySelector("p span.s-id").innerHTML=test.sample_id;
    report_header.querySelector("p span.op-id").innerHTML=test.operator_id;
    let today=new Date(test.reg_date);
    let [h, m, s]=[today.getHours(), today.getMinutes(), today.getSeconds()];
    let date=today.getDate()+" "+month_array[today.getMonth()]+" "+today.getFullYear()+", ";
    date+=((h<10)? "0"+h:h)+":"+((m<10)? "0"+m:m)+":"+((s<10)? "0"+s:s);
    report_header.querySelector("p span.reg-date").innerHTML=date;



    table.innerHTML="";
    for(i of CBC_DOM){
        table.innerHTML+=`<tr>
            <td>${i.name}</td>
            <td><input type="text" name="${i.name}"></td>
            <td><input type="text" name="${i.name}-flag"></td>
            <td>${i.unit}</td>
            <td>${i.limit}</td>
            </tr>`;
    }
    document.querySelector(".reports").scrollIntoView({behavior:"smooth"});
}

const populate_try_another = (list) => {
    if(!list)
        list=patient_list        
    let container=document.querySelector(".try-another-way-container .patients");
    let new_DOM="";
    for(i of list){
        new_DOM+=`<button style="--clr: var(--neon-blue);" onclick="select_patient('${i.id}');">
            <p>${i.id}</p>
            <p>${i.first_name+" "+i.last_name} <b class="bold">S/O</b> ${i.father_name}</p>
            <p>${i.address}</p>
        </button>`;
    }
    container.innerHTML=new_DOM;
}


create_navigation()
let personal_navigation=document.querySelector(".personal-navigation div:last-child");
let old_DOM=personal_navigation.innerHTML;
personal_navigation.innerHTML=`<span title="Add New Patient (N)" class="btn" onclick="show_dialog('add-new-patient-dialog');"><i class='fa-solid fa-plus'></i></span>`+old_DOM;








/* code for register new patient or update existing patient */
const register_new_patient = (dialog_class) => {
    if(!validate_patient_form(dialog_class)){
        return;
    }

    show_loader();
    let its_for_update=false;
    let button = document.querySelector(`.${dialog_class} .controls button:last-child`)
    if(button.innerHTML==="Update")
        its_for_update=true;

    let dialog=document.querySelector(`.dialog .${dialog_class}`);
    let first_name_inp=dialog.querySelector("input[name='first-name']");
    let last_name_inp=dialog.querySelector("input[name='last-name']");
    let father_name_inp=dialog.querySelector("input[name='father-name']");
    let gender_inp=dialog.querySelector("select[name='gender']");
    let marital_status_inp=dialog.querySelector("select[name='marital-status']");
    let dob_inp=dialog.querySelector("input[name='dob']");
    let blood_group_inp=dialog.querySelector("select[name='blood-group']");
    let contact_inp=dialog.querySelector("input[name='contact']");
    let cnic_inp=dialog.querySelector("input[name='cnic']");
    let address_inp=dialog.querySelector("textarea[name='address']");

    let patient_obj={
        first_name: first_name_inp.value,
        last_name: last_name_inp.value,
        father_name: father_name_inp.value,
        gender: gender_inp.value,
        marital_status: marital_status_inp.value,
        dob: dob_inp.value,
        contact: contact_inp.value,
        address: address_inp.value,
        blood_group: blood_group_inp.value,
        cnic: cnic_inp.value
    };

    if(!its_for_update){
        let year=new Date(Date.now()).getFullYear();
        let max_id="";
        for(i of patient_list){
            if(!max_id || parseInt(max_id) < parseInt(i.id))
                max_id=i.id;
        }
        let current_used_year=parseInt(max_id.substring(0, max_id.length-4));
        if(year===current_used_year)
            patient_obj.id=(parseInt(max_id)+1)+"";
        else
            patient_obj.id=`${year}0001`;
    }
    else{
        patient_obj.id=selected_patient.id;
    }

    ipcRenderer.send("insert", `patients/${patient_obj.id}/`, patient_obj, "insert-new-patient");
    ipcRenderer.on("insert-new-patient", (event, res) => {
        hide_loader();
        if(res){
            show_notification("Patient inserted successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
            populate_try_another()
            hide_dialog(document.querySelector(".add-new-patient-dialog .cancel"));
            document.querySelector(".add-new-patient-dialog .controls button:nth-child(3)").innerHTML="Register"
            if(its_for_update){
                select_patient(selected_patient.id);
            }else{
                document.querySelector(".print-card-dialog p").innerHTML=`ID of patient is: ${patient_obj.id}`;
                show_dialog("print-card-dialog");
            }
        }else{
            show_notification("Patient cannot inserted", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    })
}

const update_patient_dialog = () => {
    if(!selected_patient){
        show_notification("Unexpected error occured. Please try again", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }
    
    let dialog=document.querySelector(".add-new-patient-dialog");
    dialog.querySelector(".form input[name='first-name']").value=selected_patient.first_name
    dialog.querySelector(".form input[name='last-name']").value=selected_patient.last_name
    dialog.querySelector(".form input[name='father-name']").value=selected_patient.father_name
    dialog.querySelector(".form select[name='gender']").value=selected_patient.gender
    dialog.querySelector(".form select[name='marital-status']").value=selected_patient.marital_status
    dialog.querySelector(".form input[name='dob']").value=selected_patient.dob
    dialog.querySelector(".form select[name='blood-group']").value=selected_patient.blood_group
    dialog.querySelector(".form input[name='contact']").value=selected_patient.contact
    dialog.querySelector(".form input[name='cnic']").value=selected_patient.cnic
    dialog.querySelector(".form textarea[name='address']").value=selected_patient.address
    dialog.querySelector(".controls button:last-child").innerHTML="Update";

    show_dialog('add-new-patient-dialog');
}









/* code for new appointment section */
const select_patient = (id) => {
    let id_inp=document.querySelector(".main-container .id-sec .input input[name='id']");
    if(id==="-1")
        id=id_inp.value;

    if(!id){
        show_notification("Fill ID field first", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }    

    selected_patient=null,
    selected_app=null;
    reset_appointment_container();
    for(i of patient_list){
        if(i.id===id){
            selected_patient=i;
            break;
        }
    }
    for(i of appointments_list){
        if(i.id === id && (i.status==='at receptionist' || i.status==="at doctor")){
            selected_app=i;
            break;
        }
    }

    if(!selected_patient){
        show_notification(`Cannot find patient against given ID (${id_inp.value})`, true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }

    document.querySelector(".main-container .app-detail").scrollIntoView({behavior:"smooth"});

    let empty_message = document.querySelector(".main-container .app-detail .not-selected");
    let patient_info=document.querySelector(".main-container .id-sec .patient-info");

    empty_message.classList.remove("show");
    id_inp.value=selected_patient.id
    patient_info.innerHTML=`<div class="data">
        <p>
            <span class="bold">Name: </span>
            <span>${selected_patient.first_name+" "+selected_patient.last_name}</span>
        </p>
        <p>
            <span class="bold">Gender: </span>
            <span>${selected_patient.gender}</span>
        </p>
        <p>
            <span class="bold">Age: </span>
            <span>${calculate_age(selected_patient.dob)}</span>
        </p>
        <p>
            <span class="bold">Address: </span>
            <span>${selected_patient.address}</span>
        </p>
    </div>
    <div class="controls">
        <button title="Print Card Again" style="--clr: rgb(112,112,5);" onclick="print_card(${selected_patient.id})">
            <i class="fa-solid fa-print"></i>
        </button>
        <button title="Update Patient Record" style="--clr: var(--neon-pink);" onclick="update_patient_dialog();">
            <i class="fa-solid fa-edit"></i>
        </button>
    </div>`

    if(selected_app)
        set_appointment_data();
    else{
        let tests_container=document.querySelector(".app-detail .tests");
        let test_DOM="";
        let basic_tests=[];
        for(i of registered_tests_list){
            if(i.type==="Basic")
                basic_tests.push(i);
        }
        for(let i=0; i<basic_tests.length; i++){
            let test_name="";
            for(j of basic_tests[i].name){
                if(j==="-")
                    test_name+=' ';
                else
                    test_name+=j;
            }
            test_DOM+=`<div class="input">
                    <input type="text" name="${basic_tests[i].name}" required>
                    <span>${test_name}</span>
                    <i></i>
                </div>`;
        }
        tests_container.innerHTML=test_DOM
    }
}

const set_appointment_data = () => {
    let tests_container=document.querySelector(".app-detail .tests");
    let tests=JSON.parse(selected_app.tests);
    
    let test_DOM="";
    for(let i=0; i<tests.length; i++){
        let test_key=Object.keys(tests[i])[0];
        let test_name="";
        for(j of test_key){
            if(j==="-")
                test_name+=" ";
            else
                test_name+=j;
        }
        if(typeof(tests[i][test_key])==="object"){
            test_DOM+=`<button class="${(tests[i][test_key].template_type)?'finalized':''}" style="--clr: var(--neon-blue);" id="${test_key}" ${(tests[i][test_key].template_type)?'':"onclick='show_template_dialog(`template-selection-dialog`);'"}>${(tests[i][test_key].template_type)? test_name: 'Fill Report'}</button>`;
        }else{
            test_DOM+=`<div class="input">
                    <input type="text" class="${tests[i][test_key]?"disabled":""}" value="${tests[i][test_key]}" name="${test_key}" ${tests[i][test_key]?"readonly": ""} required>
                    <span>${test_name}</span>
                    <i></i>
                </div>`;
        }
    }
    tests_container.innerHTML=test_DOM;
    let report_btn=document.querySelector(".app-detail .controls button:first-child");
    let generate_app_btn=document.querySelector(".app-detail .controls button:last-child");
    generate_app_btn.innerHTML="Update Appointment"
    generate_app_btn.style.backgroundColor="#8b8d1d";
    let hasTest=false;
    for(i of tests){
        if(!i[Object.keys(i)[0]]){
            hasTest=true;
            break;
        }
    }
    if(!hasTest){
        report_btn.style.display="none";
        generate_app_btn.style.display="none";
    }else{
        report_btn.style.display="block";
        generate_app_btn.style.display="block";
    }
}

const print_card = (id) => {
    if(id=='-1'){
        id=document.querySelector(".print-card-dialog p").innerHTML.split(" ");
        id=id[id.length-1];
    }

    let patient=null;
    for(i of patient_list){
        if(i.id==id){
            patient=i;
            break;
        }
    }
    if(patient){

        document.querySelector(".patient-card .id").innerHTML=patient.id;
        document.querySelector(".patient-card .data .datum:nth-child(1) span:last-child").innerHTML=patient.first_name+" "+patient.last_name;
        document.querySelector(".patient-card .data .datum:nth-child(2) span:last-child").innerHTML=patient.father_name;
        document.querySelector(".patient-card .data .datum:nth-child(3) span:last-child").innerHTML=(patient.cnic)?patient.cnic:"Not Mentioned";
        document.querySelector(".patient-card .data .datum:nth-child(4) span:last-child").innerHTML=(patient.blood_group)?patient.blood_group:"Not Mentioned";
        document.getElementById("qrcode").innerHTML="";
        // generating qrcode and setting it...
        var qrcode = new QRCode("qrcode", {
            text: patient.id,
            width: 80,
            height: 80,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        window.print();

    }else{
        console.log(id);
        show_notification("Unexpected error. Please try again !!!", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }
}

const configure_appointment = () => {
    let all_inputs=document.querySelectorAll(".app-detail .tests .input");
    for(i of all_inputs){
        let input=i.querySelector("input");
        if(input && !input.value){
            show_notification("Fill empty field(s) first", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
            input.focus();
            return;
        }
    }
    let generate_app_btn=document.querySelector(".app-detail .controls button:last-child");
    if(generate_app_btn.innerHTML==="Update Appointment")
        generate_appointment(document.querySelector('.doctor-selection-dialog'));
    else
        show_dialog('doctor-selection-dialog');
}

const generate_appointment = (dialog) => {
    show_loader();

    let date=new Date(Date.now());
    let latest_app_date=new Date();
    if(latest_appointment)
        latest_app_date=new Date(latest_appointment.app_time);
    let appointment_id=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+"-";

    if(latest_appointment){
        if(date.getFullYear()===latest_app_date.getFullYear() && date.getMonth()===latest_app_date.getMonth() && date.getDate()===latest_app_date.getDate()){
            let newID = parseInt(latest_appointment.app_id.split("-")[3])+1
            appointment_id+=`${newID}`;
        }else{
            appointment_id+="1";
        }
    }else{
        appointment_id+="1";
    }
    let newApp={};

    if(selected_app){
        newApp.app_id=selected_app.app_id;
        newApp.id=selected_app.id;
        newApp.first_name=selected_app.first_name;
        newApp.last_name=selected_app.last_name;
        newApp.app_time=selected_app.app_time;
        newApp.status=selected_app.status;
        newApp.doctor_id=selected_app.doctor_id;
        newApp.tests=selected_app.tests;
        newApp.diagnosis=selected_app.diagnosis;
        newApp.prescriptions=selected_app.prescriptions;
        newApp.precautions=selected_app.precautions;
    }else{
        newApp.app_id=appointment_id;
        newApp.id=selected_patient.id;
        newApp.first_name=selected_patient.first_name;
        newApp.last_name=selected_patient.last_name;
        newApp.app_time=Date.now();
        newApp.status="at receptionist";
        newApp.doctor_id=document.querySelector(".doctor-selection-dialog select[name='doctor-name']").value;
        newApp.tests=JSON.stringify([]);
        newApp.diagnosis="";
        newApp.prescriptions=JSON.stringify([]);
        newApp.precautions="";
    }

    let tests=[];
    let all_tests_inp=document.querySelectorAll(".app-detail .tests .input");
    for(i of all_tests_inp){
        let input=i.querySelector("input");
        if(input){
            let testObj={};
            testObj[`${input.name}`]=input.value
            tests.push(testObj);
        }
    }
    newApp.tests=JSON.stringify(tests);

    ipcRenderer.send("insert", `appointments/${newApp.app_id}/`, newApp, "insert-new-appointment");
    ipcRenderer.on("insert-new-appointment", (event, res) => {
        hide_loader();
        if(res){
            show_notification("Appointment generated successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
            hide_dialog(dialog.querySelector(".cancel"));
            reset_appointment_container();
        }else{
            show_notification("Appointment cannot generated", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const open_qrcode_camera = (dialog_class) => {
    show_dialog(dialog_class)
}






/* codes for generating new reports and its relatives */
const generate_new_report_dialog = () => {
    if(!selected_app || !selected_app.tests){
        show_notification("No test refered yet", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }
    hide_dialog(document.querySelector(".print-card-dialog .cancel"));
    let dialog=document.querySelector(".dialog .generate-new-report-dialog");
    let operator_input=dialog.querySelector("select[name='operator']");
    let test_input=dialog.querySelector("select[name='test-name']");
    operator_input.innerHTML="";
    for(i of all_with_no_admin_list){
        operator_input.innerHTML+=`<option value="${i.id}">${i.first_name+" "+i.last_name} (${i.role})</option>`;
    }
    let test_input_DOM="";
    let tests=JSON.parse(selected_app.tests);
    for(i of tests){
        if(!i[Object.keys(i)[0]]){
            test_input_DOM+=`<option value="${Object.keys(i)[0]}">${Object.keys(i)[0]}</option>`
        }
    }
    test_input.innerHTML=test_input_DOM;
    show_dialog("generate-new-report-dialog")
}

const generate_new_report = (hidding_elem) => {
    let sample_id_inp=document.querySelector(".generate-new-report-dialog input[name='sample-id']"),
    operator_inp=document.querySelector(".generate-new-report-dialog select[name='operator']"),
    test_name_inp=document.querySelector(".generate-new-report-dialog select[name='test-name']");

    if(!sample_id_inp.value){
        show_notification("Please fill empty field first", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        sample_id_inp.focus();
        return;
    }

    show_loader();
    let report_obj={
        sample_id: sample_id_inp.value,
        operator_id: operator_inp.value,
        reg_date: Date.now(),
        template_type: ""
    }

    let tests=JSON.parse(selected_app.tests)
    for(i in tests){
        if(Object.keys(tests[i])[0] === test_name_inp.value){
            tests[i][Object.keys(tests[i])[0]]=report_obj;
        }
    }
    selected_app.tests=JSON.stringify(tests);

    ipcRenderer.send("insert", `appointments/${selected_app.app_id}/`, selected_app, "insert-new-report");
    ipcRenderer.on("insert-new-report", (event, res) => {
        hide_loader();
        if(res){
            show_notification("Report added successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
            hide_dialog(hidding_elem);
        }else{
            show_notification("Report cannot added", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const show_template_dialog = (dialog_class) => {
    hide_dialog(document.querySelector(".print-card-dialog .cancel"));
    document.querySelector(`.${dialog_class}`).id=window.event.target.id;
    show_dialog(dialog_class);
}

const show_report = (report_name) => {
    hide_dialog(document.querySelector(".print-card-dialog .cancel"));
    let template_dialog=document.querySelector(".template-selection-dialog");
    let test_name=template_dialog.id;
    template_dialog.removeAttribute("id");
    if(report_name==="cbc")
        populate_cbc_report(test_name);
    else if(report_name==="hematology"){}
    else if(report_name==="urine"){}
    hide_dialog(document.querySelector(".template-selection-dialog .cancel"));
}

const save_report = (report_elem) => {
    hide_dialog(document.querySelector(".print-card-dialog .cancel"));
    let test_name=report_elem.getAttribute("id");
    let test=null;
    let all_tests=JSON.parse(selected_app.tests);
    for(i of all_tests){
        if(Object.keys(i)[0]===test_name){
            test=i[Object.keys(i)[0]];
            break;
        }
    }

    if(!test)
        return;
    
    show_loader();

    let CBC_result=[
        {name: "WBC", unit:"10<sup>3</sup>/&mu;l", limit:"4.0/12.0"},
        {name: "LYM", unit:"10<sup>3</sup>/&mu;l", limit:"1.0/5.0"},
        {name: "MON", unit:"10<sup>3</sup>/&mu;l", limit:"0.1/1.0"},
        {name: "GRA", unit:"10<sup>3</sup>/&mu;l", limit:"2.0/8.0"},
        {name: "LYM%", unit:"%", limit:"25.0/50.0"},
        {name: "MON%", unit:"%", limit:"2.0/10.0"},
        {name: "GRA%", unit:"%", limit:"50.0/80.0"},
        {name: "RBC", unit:"10<sup>6</sup>/&mu;l", limit:"4.0/6.20"},
        {name: "HGB", unit:"g/dl", limit:"11.0/17.0"},
        {name: "HCT", unit:"%", limit:"35.0/55.0"},
        {name: "MCV", unit:"&mu;m<sup>3</sup>", limit:"80.0/100.0"},
        {name: "MCH", unit:"pg", limit:"26.0/34.0"},
        {name: "MCHC", unit:"g/dl", limit:"31.0/35.5"},
        {name: "RDWC", unit:"%", limit:"10.0/16.0"},
        {name: "RDWS", unit:"&mu;m<sup>3</sup>", limit:"37.0/47.8"},
        {name: "PLT", unit:"10<sup>3</sup>/&mu;l", limit:"150/400"},
        {name: "MPV", unit:"&mu;m<sup>3</sup>", limit:"7.0/11.0"},
        {name: "PCT", unit:"%", limit:"0.200/0.500"},
        {name: "PDW", unit:"%", limit:"10.0/18.0"},
        {name: "PLCR", unit:"%", limit:"12.0/42.0"},
    ];

    let all_result_inp=report_elem.querySelectorAll("table tbody tr td:nth-child(2) input");
    let all_flag_inp=report_elem.querySelectorAll("table tbody tr td:nth-child(3) input");

    for(i in CBC_result){
        CBC_result[i].result=all_result_inp[i].value;
        CBC_result[i].flags=all_flag_inp[i].value;
    }

    test.result=CBC_result;
    test.template_type="cbc";
    test.comment=report_elem.querySelector(".comment textarea[name='comments']").value;

    for(i in all_tests){
        if(Object.keys(all_tests[i])[0]===test_name){
            all_tests[i][Object.keys(all_tests[i])[0]]=test;
            break;
        }
    }
    selected_app.tests=JSON.stringify(all_tests);
    
    ipcRenderer.send("insert", `appointments/${selected_app.app_id}`, selected_app, "save-report");
    ipcRenderer.on("save-report", (event, res) => {
        if(res){
            report_elem.removeAttribute("id");
            report_elem.classList.remove("show");
            document.querySelector(".app-detail").scrollIntoView({behavior: "smooth"});
            document.querySelector(".app-detail .tests button#"+test_name).disabled=true;
            document.querySelector(".app-detail .tests button#"+test_name).classList.add("finalized");
            document.querySelector(".app-detail .tests button#"+test_name).innerHTML=test_name;
            hide_loader();
            show_notification("Report saved successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            hide_loader();
            show_notification("Report cannot saved", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}







/* code for filtering patients by name, father name, gender or number */
let filter_name_inp=document.querySelector(".search-filters input[name='by-name']");
let filter_fatherName_inp=document.querySelector(".search-filters input[name='by-father-name']");
let filter_gender_inp=document.querySelector(".search-filters select[name='gender']");
let filter_number_inp=document.querySelector(".search-filters input[name='by-number']");

[filter_name_inp, filter_fatherName_inp, filter_gender_inp, filter_number_inp].forEach((elem) => {
    elem.addEventListener("input", (e) => {
        if(e.target===filter_name_inp)
            filtered_name=e.target.value
        else if(e.target===filter_fatherName_inp)
            filtered_fatherName=e.target.value
        else if(e.target===filter_gender_inp)
            filtered_gender=e.target.value
        else if(e.target===filter_number_inp)
            filtered_number=e.target.value
        filter_patients();
    })
})

const reset_filters = () => {
    reset_fields(document.querySelector('.search-filters'));
    filtered_name="";
    filtered_fatherName="";
    filtered_gender="Male,Female,Other";
    filtered_number="";
    populate_try_another();
}

const filter_patients = () => {
    let list=[];
    for(i of patient_list){
        if((i.first_name+" "+i.last_name).toLowerCase().includes(filtered_name.toLowerCase()) && i.father_name.toLowerCase().includes(filtered_fatherName.toLowerCase()) && filtered_gender.includes(i.gender) && i.contact.includes(filtered_number)){
            list.push(i);
        }
    }
    populate_try_another(list);
}








/* ................. shortcut key listener ..................... */
document.addEventListener("keyup", (e) => {
    let id_inp=document.querySelector(".main-container .id-sec .input input[name='id']");
    if(!active_dialog && (e.key==="N" || e.key==="n") && !isFocusInputs()){
        show_dialog('add-new-patient-dialog');
    }else if(!active_dialog && (e.key==="S" || e.key==="s") && !isFocusInputs()){
        open_qrcode_camera('qrcode-camera-dialog');
    }else if(!active_dialog && e.key==="?"){
        document.querySelector('.try-another-way-container').scrollIntoView({behavior:'smooth'});
    }else if(!active_dialog && id_inp===document.activeElement && e.key==="Enter"){
        select_patient(id_inp.value);
    }else if(!active_dialog && (e.key==="F" || e.key==="f")){
        let all_inps=document.querySelectorAll("input:not([name='search']), textarea");
        let isOK=true;
        for(i of all_inps){
            if(i===document.activeElement){
                isOK=false;
                break;
            }
        }
        if(isOK){
            document.querySelector("input[name='search']").focus();
            document.querySelector("input[name='search']").value="";
        }
    }
})






/* listening live data change */
ipcRenderer.on("live-value-update-captured", (event, data) => {
    let prof=data["staff"][profile.id];
    if(prof && prof.status==="online" && profile.role==="Receptionist"){
        separate_data(data);
    }else{
        if(!prof)
            ipcRenderer.send("staff-deleted", "");
        else
            logout_user();
    }
})
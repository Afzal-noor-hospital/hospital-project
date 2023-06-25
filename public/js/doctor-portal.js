let profile=null,
appointment_list=[],
doctors_list = [],
medicine_list=[],
registered_tests=[];

let selected_appointment=null;
let editable_prescription_index=-1,
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
        <li>Click on <b>Search Here</b> placed at top of page.</li>
        <li>Now you can search your appointments by using his/her ID.</li>
    </ul>
    <p class="bold">How to select appointment:</p>
    <ul>
        <li>Click on the appointment you want to select. A dialog will appear wants diagnosis of patient.</li>
        <li>After entering diagnosis of patient, click on <b>Proceed</b> button. Selected appointment located at top of all the appointments and its color will like a yellow.</li>
        <li>If you want to edit diagnosis then click on the blue link provided at top of gray color bordered container and update your diagnosis</li>
        <li>Now, you will be able to add precautions, prescriptions or tests against that patient.</li>
    </ul>
    <p class="bold">How to add Prescription(s):</p>
    <ul>
        <li>Click on the + icon located at bottom-right corner of gray color bordered container. A dialog will appears</li>
        <li>In this dialog, put all the details like medicine name, quantity and timmings. When you will enter medicine name, medicines available in store automatically offered in dropdown. You can select appropriate from there.</li>
        <li>After enetering all the records, click on <b>Save</b> button to save prescription</li>
    </ul>
    <p class="bold">How to Update or Delete Prescription:</p>
    <ul>
        <li>To edit, click on the <i class="fa-solid fa-edit"></i> icon on the prescription.</li>
        <li>A dialog with previous entered detail appears. Change required data.</li>
        <li>Click on the <b>Update</b> button. Prescription then updated.</li>
        <li>To Delete, click on the <i class="fa-solid fa-trash"></i> icon. Confirmation dialog will appears. Cloick on <b>Delete</b> button to delete prescription.</li>
    </ul>
    <p class="bold">How to Refer Test:</p>
    <ul>
        <li>If you want to refer test which is taken already, then click on that test which is to be reffered. A dialog will appears.</li>
        <li>Click on <b>confirm</b> button to rereffer test.</li>
        <li>If you want to create new test, then click on the <b>New Test</b> button located at the top of tests container in pink color. A dialog will appears.</li>
        <li>Select test from dropdown you want to reffer. Click on the <b>Confirm</b> button to reffer test.</li>
        <li>If test is reffered, unless the value for test is not uploaded, color of test is gray.</li>
    </ul>
    <p class="bold">How to see previous record:</p>
    <ul>
        <li>Click on <b>Previous Record</b> button located at bottom-left corner in gray bordered container. A dialog will appear.</li>
        <li>If patient already visited, then records will shown, otherwise no records displayed</li>
        <li>List of records appears date-wise. Open record from </li>
        <li>Select test from dropdown you want to reffer. Click on the <b>Confirm</b> button to reffer test.</li>
        <li>If test is reffered, unless the value for test is not uploaded, color of test is gray.</li>
    </ul>
    <p class="bold">How to Submit Appointment:</p>
    <ul>
        <li>After selecting appointment and entering all data, Click on <b>Submit</b> button located in gray bordered container. A dialog will appear.</li>
        <li>Enter the duration of medicine such that how mush days patient take these medicines.</li>
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
    populate_dropdown();

    if(selected_appointment){
        populate_tests();
        populate_prescriptions();
    }
    populate_appointments();
}

const populate_dropdown = (search_txt="") => {
    let prescription_dropdown=document.querySelector(".create-prescription-dialog .prescription-name .suggestion-dropdown .suggestion");
    prescription_dropdown.innerHTML="";
    for(i of medicine_list){
        let name=i.name,
        quantity=i.quantity,
        type=i.type;
        if(name.toLowerCase().includes(search_txt.toLowerCase()) && quantity>0){
            prescription_dropdown.innerHTML+=
                `<p onclick="select_medicine('${name} (${type})');" class="${isExpired(i.exp_date)?'expired':''}">${name} (${quantity} ${type})</p>`
        }
    }
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

const select_medicine = (name) => {
    document.querySelector(".create-prescription-dialog .form textarea[name='med-name']").value=name;
    let prescription_dropdown=document.querySelector(".create-prescription-dialog .prescription-name .suggestion-dropdown");
    prescription_dropdown.style.display="none";
    document.querySelector(".create-prescription-dialog .form input[name='med-quantity']").focus();

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
            appointments_DOM+=`<button style="--clr: var(--neon-pink);" onclick="select_appointment_dialog('${i.app_id}')">
                <p>Sr No: ${i.app_id.split("-")[3]}</p>
                <p>${i.id}</p>
                <p>${i.first_name+" "+i.last_name}</p>
            </button>`;
        }
    }
    container.innerHTML=appointments_DOM;
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

// update diagnosis functionality...
let diagnosis_label=document.querySelector(".prescription .diagnosis");
diagnosis_label.addEventListener("click", (e) => {
    select_appointment_dialog(selected_appointment.app_id);
});

// prescroption name with its search functionality...
let prescription_name=document.querySelector(".create-prescription-dialog .form textarea[name='med-name']");
prescription_name.addEventListener("input", (e) => {
    let prescription_dropdown=document.querySelector(".create-prescription-dialog .prescription-name .suggestion-dropdown");
    if(e.target.value.length>0)
        prescription_dropdown.style.display="flex"
    else
        prescription_dropdown.style.display="none";
    populate_dropdown(e.target.value);
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

const select_appointment_dialog = (app_id) => {
    show_loader()
    for(i of appointment_list){
        if(i.app_id == app_id){
            selected_appointment=i;
            break;
        }
    }
    let diagnosis="";
    if(selected_appointment && selected_appointment.diagnosis)
        diagnosis = selected_appointment.diagnosis;

    document.querySelector(".select-appointment-dialog .input textarea").value=diagnosis;
    show_dialog("select-appointment-dialog");
    hide_loader()
}
const proceed_appointment = () => {
    let diagnosis_inp=document.querySelector(".select-appointment-dialog .input textarea");
    if(!diagnosis_inp.value){
        show_notification("Fill empty field first", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        diagnosis_inp.focus()
        return;
    }

    show_loader();
    selected_appointment.diagnosis=diagnosis_inp.value
    selected_appointment.status="at doctor";

    ipcRenderer.send("insert", `appointments/${selected_appointment.app_id}/`, selected_appointment, "select-appointment-result");
    ipcRenderer.on("select-appointment-result", (event, res) => {
        if(res){
            hide_dialog(document.querySelector(".dialog .select-appointment-dialog .cancel"));
            document.querySelector(".prescription .precautions").scrollIntoView({behavior: "smooth"})
            diagnosis_label.innerHTML=`${selected_appointment.first_name+" "+selected_appointment.last_name} has ${selected_appointment.diagnosis}`;
            diagnosis_label.classList.add("show")
            populate_tests();
            populate_prescriptions();
            populate_appointments();

            let new_test_btn=document.querySelector(".tests .new-test");
            let precaution_btn=document.querySelector(".prescription .precautions");
            let prev_record_btn=document.querySelector(".prescription .controls .prev-record");
            let submit_app_btn=document.querySelector(".prescription .controls .submit-app");
            let add_new_btn=document.querySelector(".prescription .controls .add-new");
            new_test_btn.style.visibility="visible"
            precaution_btn.style.visibility="visible"
            prev_record_btn.style.visibility="visible"
            submit_app_btn.style.visibility="visible"
            add_new_btn.style.visibility="visible"
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
    document.querySelector('.prescription .precautions').scrollIntoView({behavior: 'smooth'})
}
const edit_prescription_dialog = (index) => {
    editable_prescription_index=index;
    if(editable_prescription_index===-1)
        return;

    let prescription=selected_appointment.prescriptions[index],
    dialog=document.querySelector(".dialog .create-prescription-dialog"),
    med_name=dialog.querySelector("textarea[name='med-name']"),
    med_quantity=dialog.querySelector("input[name='med-quantity']"),
    timmings1=dialog.querySelectorAll("input[name='time']"),
    timmings2=dialog.querySelectorAll("input[name='meal']");

    med_name.value=prescription.name;
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
    show_dialog('create-prescription-dialog');
    document.querySelector(".top-of-page").scrollIntoView({behavior: "smooth"})
}
const update_prescription = () => {
    let dialog=document.querySelector(".dialog .create-prescription-dialog"),
    name_inp=dialog.querySelector(".input textarea[name='med-name']"),
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
    hide_dialog(dialog.querySelector(".cancel"));
}
const delete_prescription_dialog = (index) => {
    let dialog = document.querySelector(".dialog .delete-prescription-dialog")
    dialog.setAttribute("id", `${index}`);
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






/* appoitnment submission code */
const submit_appointment = () => {
    let duration_inp=document.querySelector(".prescription-days-dialog input[name='duration']");
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
    selected_appointment.duration=duration_inp.value;

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
            let new_test_btn=document.querySelector(".tests .new-test");
            let precaution_btn=document.querySelector(".prescription .precautions");
            let prev_record_btn=document.querySelector(".prescription .controls .prev-record");
            let submit_app_btn=document.querySelector(".prescription .controls .submit-app");
            let add_new_btn=document.querySelector(".prescription .controls .add-new");
            new_test_btn.style.visibility="hidden"
            precaution_btn.style.visibility="hidden"
            prev_record_btn.style.visibility="hidden"
            submit_app_btn.style.visibility="hidden"
            add_new_btn.style.visibility="hidden"
            diagnosis_label.classList.remove("show")
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
})
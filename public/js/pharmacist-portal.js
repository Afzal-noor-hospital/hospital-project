let profile=null,
appointment_list=[],
doctors_list = [],
medicine_list=[],
registered_tests_list=[],
selected_appointment,
object_to_be_edit=null;
let month_array=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];









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
        <span>Enter New Medicine</span>
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
    <p class="bold">How to Enter New Medicine:</p>
    <ul>
        <li>First of all click on + icon placed at top-right or press N (ensure that focus is not at any other input).</li>
        <li>Fill all the fields in this form. No field(s) can be negligible.</li>
        <li>Ensure that Medicine with same name and same type cannot be added again.</li>
        <li>At last, click on the <b>Save</b> button which is located at bottom-right corner of dialog. Medicine will saved.</li>
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
    <p class="bold">How to Search Appointments:</p>
    <ul>
        <li>Click on <b>Search Here</b> placed at top of page.</li>
        <li>Now, You can search patient by using his/her ID.</li>
    </ul>
    <p class="bold">How to Search Expired or Useable Medicines:</p>
    <ul>
        <li>Click on <b>Search Here</b> placed at top of Useable Medicines or Expired Medicines dialog.</li>
        <li>Now, You can search medicine by using its name.</li>
    </ul>
    <p class="bold">How to Edit Medicine:</p>
    <ul>
        <li>Click on Medicine which you want to edit. A dialog with while information appears.</li>
        <li>Change required data and click on <b>Update</b> button to update medicine.</li>
    </ul>
    <p class="bold">How to Send Back Appointment:</p>
    <ul>
        <li>After selecting appointment, Click on the <b>Send Back</b> button.</li>
        <li>That appointment automatically sent back to doctor again.</li>
    </ul>
    <p class="bold">How to Proceed Appointment:</p>
    <ul>
        <li>After selecting appointment, Click on the <b>Proceed</b> button. Please make sure that all the data in the appointment is entered correctly.</li>
        <li>After clicking, a confirmation dialog will appears. Click on <b>Confirm</b> button to confirm the appointment.</li>
    </ul>`;









if(check_network()){
    ipcRenderer.send("fetch", "/", "get-all-data");
    ipcRenderer.on("get-all-data", (event, isError, prof, data) => {
        if(isError){
            hide_loader();
            show_notification(data, true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
        else{
            profile=prof;
            ipcRenderer.send("delete", `settings/password-requests/${prof.id}`, "deleting-request-for-forgot");
            separte_data(data);
            hide_loader();
        }
    })
}









/* supporting functions */

const separte_data = (data) => {
    if(!data)
        return;
    let medicines=data['medicines'],
    appointments=data['appointments'],
    staff=data['staff'],
    settings=data['settings'];

    medicine_list=[];
    if(medicines){
        for(i of Object.keys(medicines)){
            medicine_list.push(medicines[i]);
        }
    }
    appointment_list=[];
    if(appointments){
        for(i of Object.keys(appointments)){
            if(appointments[i].status==="at pharmacist")
                appointment_list.push(appointments[i]);
        }
    }
    doctors_list=[];
    if(staff){
        for(i of Object.keys(staff)){
            if(staff[i].role==="Doctor")
                doctors_list.push(staff[i]);
        }
    }
    if(selected_appointment){
        let index=-1;
        for(i in appointment_list){
            if(appointment_list[i].app_id === selected_appointment.app_id){
                index=i;
                break;
            }
        }
        if(index!=-1)
            select_appointment(index);
    }
    registered_tests_list=[];
    if(settings && settings['prices']){
        let tests=settings['prices'];
        for(i of Object.keys(tests)){
            registered_tests_list.push(tests[i]);
        }
    }
    populate_appointments();
    populate_useable_medicines();
    populate_expired_medicines();
    check_birthday_and_wish();
}

const isExpired = (date) =>{ 
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

const isActiveInput = () => {
    let inputs=document.querySelectorAll("input, textarea");
    for(i of inputs){
        if(i===document.activeElement){
            return true;
        }
    }
    return false;
}

const is_valid_mfg_exp = (mfg, exp) => {
    let given_mfg_month=mfg.split(" ")[0];
    let given_mfg_year=mfg.split(" ")[1];
    let given_exp_month=exp.split(" ")[0];
    let given_exp_year=exp.split(" ")[1];

    let mfg_month_index=-1;
    let exp_month_index=-1;

    for(i in month_array){
        if(month_array[i]===given_mfg_month){
            mfg_month_index=i;
            break;
        }
    }
    for(i in month_array){
        if(month_array[i]===given_exp_month){
            exp_month_index=i;
            break;
        }
    }

    if(parseInt(given_mfg_year) < parseInt(given_exp_year)){
        return true;
    }
    else if(parseInt(given_mfg_year)===parseInt(given_exp_year) && mfg_month_index>=exp_month_index){
        return true;
    }
    return false;
}

const validate_medicine_form = (dialog) => {
    let med_name_input=dialog.querySelector("input[name='name']");
    let med_quantity_input=dialog.querySelector("input[name='quantity']");
    let med_price_input=dialog.querySelector("input[name='price']");
    let med_mfg_month_input=dialog.querySelector("input[name='mfg-month']");
    let med_mfg_year_input=dialog.querySelector("input[name='mfg-year']");
    let med_exp_month_input=dialog.querySelector("input[name='exp-month']");
    let med_exp_year_input=dialog.querySelector("input[name='exp-year']");
    
    if((med_name_input && !med_name_input.value) || !med_quantity_input.value || !med_price_input.value || !med_mfg_month_input.value || !med_mfg_year_input.value || !med_exp_month_input.value || !med_exp_year_input.value){
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
            errors="Exp Date must be greater then Mfg Date";
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

const reset_explained_app_container = () => {
    document.querySelector(".explained-app .data").innerHTML=""
    document.querySelector(".explained-app .controls").style.display="none"
}
reset_explained_app_container() // clearing explained appointment area 

const populate_appointments = (search_txt="") => {
    let app_container=document.querySelector(".app-container .all-app");
    let appointment_DOM="";

    if(selected_appointment){
        appointment_DOM+=`<button style="--clr: var(--neon-pink);" class="appointment selected">
            <span>Sr. No: ${selected_appointment.app_id.split("-")[3]}</span>
            <span>${selected_appointment.id}</span>
            <span>${selected_appointment.first_name+" "+selected_appointment.last_name}</span>
        </button>`
    }

    appointment_list.forEach((i, index) => {
        if(i.id.includes(search_txt) && i.id!==selected_appointment?.id){
            appointment_DOM+=`<button style="--clr: var(--neon-pink);" class="appointment" onclick="select_appointment(${index});">
                <span>Sr. No: ${i.app_id.split("-")[3]}</span>
                <span>${i.id}</span>
                <span>${i.first_name+" "+i.last_name}</span>
            </button>`
        }
    });
    app_container.innerHTML=appointment_DOM;
}

const populate_useable_medicines = (search_txt="") => {
    let container=document.querySelector(".medicine-detail.useable .data");
    let container_DOM="";
    let count=0;
    medicine_list.forEach((i, index) => {
        if(i.name.toLowerCase().includes(search_txt.toLowerCase()) && !isExpired(i.exp_date)){
            count++;
            container_DOM+=`<div class="medicine" onclick="edit_medicine_dialog(${index})">
                <span class="edit"><i class="fa-solid fa-edit"></i></span>
                <p>
                    <span class="bold">Name: </span>
                    <span>${i.name} (${i.salt})</span>
                </p>
                <p>
                    <span class="bold">Quantity: </span>
                    <span>${i.quantity} ${i.type}</span>
                </p>
                <p>
                    From <b class="bold">${i.mfg_date}</b> till <b class="bold">${i.exp_date}</b>
                </p>
            </div>`;
        }
    })
    container.innerHTML=container_DOM;
    document.querySelector(".cards .card.correct span").innerHTML=count;
}

const populate_expired_medicines = (search_txt="") => {
    let container=document.querySelector(".medicine-detail.expired .data");
    let container_DOM="";
    let count=0;
    medicine_list.forEach((i, index) => {
        if(i.name.toLowerCase().includes(search_txt.toLowerCase()) && isExpired(i.exp_date)){
            count++;
            container_DOM+=`<div class="medicine" onclick="edit_medicine_dialog(${index})">
                <span class="edit"><i class="fa-solid fa-edit"></i></span>
                <p>
                    <span class="bold">Name: </span>
                    <span>${i.name} (${i.salt})</span>
                </p>
                <p>
                    <span class="bold">Quantity: </span>
                    <span>${i.quantity} ${i.type}</span>
                </p>
                <p>Expired from <b class="bold">${i.exp_date}</b></p>
            </div>`;
        }
    })
    container.innerHTML=container_DOM;
    document.querySelector(".cards .card.Expired span").innerHTML=count;
}

create_navigation()
// adding add new button in top-nagivaton...
let personal_navigation=document.querySelector(".personal-navigation div:last-child");
let old_DOM=personal_navigation.innerHTML;
personal_navigation.innerHTML=`<span title="New Medicine (N)" class="btn" onclick="show_dialog('add-new-medicine-dialog');"><i class='fa-solid fa-plus'></i></span>`+old_DOM;
setup_show_password();











/* functionality for search of useable and expired medicines */
document.querySelector(".medicine-detail.useable input[name='search']").addEventListener("input", (e) => {
    populate_useable_medicines(e.target.value);
})
document.querySelector(".medicine-detail.expired input[name='search']").addEventListener("input", (e) => {
    populate_expired_medicines(e.target.value);
})










/* code for selecting appointment from appointments panel, send appointment back to doctor, print reciept for appointment, finalize the appointment and displaying payment dialog and proceeding it */

let inputs=document.querySelectorAll(".explained-app .data .prescriptions input");
inputs.forEach((elem, index) => {
    elem.addEventListener("input", (e) => {
        // setting up code for price if medicine quantity up or down...
    });
});

const select_appointment = (index) => {
    selected_appointment=appointment_list[index];

    let doctor_name="";
    for(i of doctors_list){
        if(i.id===selected_appointment.doctor_id){
            doctor_name=`${i.first_name} ${i.last_name}`;
        }
    }

    let t_price=0;
    JSON.parse(selected_appointment.tests).forEach((i) => {
        let test_name=Object.keys(i)[0];
        let price=0;
        for(j of registered_tests_list){
            if(j.name===test_name){
                price=parseInt(j.price);
                break;
            }
        }
        t_price+=price;
    });
    JSON.parse(selected_appointment.prescriptions).forEach((i, index) => {
        let duration=0;
        let raw_duration = selected_appointment.duration.split(" ")[0];
        let duration_unit = selected_appointment.duration.split(" ")[1];
        if(duration_unit==="Weeks"){
            duration=parseInt(raw_duration)*7;
        }else if(duration_unit==="Months"){
            duration=parseInt(raw_duration)*30;
        }else{
            duration=parseInt(raw_duration);
        }
        let quantity=parseInt(duration)*parseInt(parseInt(i.quantity))*i.timmings.split(",").length;
        if(i.name.toLowerCase().includes("(Syrup)".toLowerCase())||i.name.toLowerCase().includes("(Gel)".toLowerCase())||i.name.toLowerCase().includes("(Ointment)".toLowerCase())||i.name.toLowerCase().includes("(Drops)".toLowerCase())||i.name.toLowerCase().includes("(Cream)".toLowerCase()))
            quantity=1;
        for(j of medicine_list){
            if(i.med_id && parseInt(i.med_id)===parseInt(j.id)){
                t_price+=(parseInt(j.price)*quantity);
            }
        }
    });

    selected_appointment.t_amount=t_price;

    let opened_medicine_container=document.querySelector(".main-container .explained-app .data");
    let container_DOM="";
    container_DOM+=`<p>
        <span class="bold">Sr. No: </span>
        <span>${selected_appointment.app_id.split("-")[3]}</span>
    </p>
    <p>
        <span class="bold">ID: </span>
        <span>${selected_appointment.id}</span>
    </p>
    <p>
        <span class="bold">Name: </span>
        <span>${selected_appointment.first_name+" "+selected_appointment.last_name}</span>
    </p>
    <p>
        <span class="bold">Doctor Name: </span>
        <span>${doctor_name}</span>
    </p>
    <p>
        <span class="bold">Presenting Complaints: </span>
        <span>${selected_appointment.presenting_complaints}</span>
    </p>
    <p>
        <span class="bold">Diagnosis: </span>
        <span>${selected_appointment.diagnosis}</span>
    </p>
    <p>
        <span class="bold">Precautions: </span>
        <span>${selected_appointment.precautions}</span>
    </p>
    <p>
        <span class="bold">Duration: </span>
        <span>${selected_appointment.duration}</span>
    </p>
    <p>
        <span class="bold">Total Amount: </span>
        <span>${t_price} Rs/-</span>
    </p>
    <p>
        <span class="bold">Recieved Amount: </span>
        <span><input type="number" name="recieved-amt" value="${t_price}" min="0" max="${t_price}"></span>
    </p>
    <div class="tests">
        <h3>Tests</h3>
        <div class="test">`

            JSON.parse(selected_appointment.tests).forEach((i) => {
                let test_name=Object.keys(i)[0];
                let price=0;
                for(j of registered_tests_list){
                    if(j.name===test_name){
                        price=j.price;
                        break;
                    }
                }
                test_name="";
                for(j of Object.keys(i)[0]){
                    if(j==="-")
                        test_name+=" ";
                    else
                        test_name+=j;
                }
                container_DOM+=`<p>
                    <span class="bold">${test_name}:</span>
                    <span>${price} Rs/-</span>
                </p>`
            })

        container_DOM+=`</div>
    </div>
    <div class="prescriptions">
        <h3>Prescriptions</h3>`;

        JSON.parse(selected_appointment.prescriptions).forEach((i, index) => {
            let duration=0;
            let raw_duration = selected_appointment.duration.split(" ")[0];
            let duration_unit = selected_appointment.duration.split(" ")[1];
            if(duration_unit==="Weeks"){
                duration=parseInt(raw_duration)*7;
            }else if(duration_unit==="Months"){
                duration=parseInt(raw_duration)*30;
            }else{
                duration=parseInt(raw_duration);
            }
            let quantity=parseInt(duration)*parseInt(i.quantity)*i.timmings.split(",").length;
            if(i.name.toLowerCase().includes("(Syrup)".toLowerCase())||i.name.toLowerCase().includes("(Gel)".toLowerCase())||i.name.toLowerCase().includes("(Ointment)".toLowerCase())||i.name.toLowerCase().includes("(Drops)".toLowerCase())||i.name.toLowerCase().includes("(Cream)".toLowerCase()))
                quantity=1;
            container_DOM+=`<div class="prescription">
                <span class="bold">Prescription ${index+1}</span>
                <p>
                    <span class="bold">Name: </span>
                    <span>${i.name}</span>
                </p>
                <p>
                    <span class="bold">Quantity: </span>
                    <span>${quantity} ${i.name.includes("Syrup")?"Bottle":"Tablet/Spoon"}</span>
                </p>
                <p>
                    <span class="bold">Timmings: </span>
                    <span>${i.timmings}</span>
                </p>
                <p>
                    <span class="bold">Given Quantity: </span>
                    <span><input type="number" max="${quantity}" min="0" value="${quantity}"></span>
                </p>
                <hr>
            </div>`;
        })
        
    container_DOM+=`</div>`;
    opened_medicine_container.innerHTML=container_DOM;
    document.querySelector(".explained-app .controls").style.display="flex"

    populate_appointments();
}

const populate_print_dialog = () => {
    let recieved_amt=document.querySelector(".explained-app .data span input[name='recieved-amt']");
    let data_elem=document.querySelector(".print-dialog .info");

    let doctor_name="";
    for(i of doctors_list){
        if(i.id===selected_appointment.doctor_id){
            doctor_name=i.first_name+" "+i.last_name;
            break;
        }
    }

    let DOM=`<p>
            <span class="bold">Sr. No: </span>
            <span>${selected_appointment.app_id.split("-")[3]}</span>
        </p>
        <p>
            <span class="bold">ID: </span>
            <span>${selected_appointment.id}</span>
        </p>
        <p>
            <span class="bold">Name: </span>
            <span>${selected_appointment.first_name+" "+selected_appointment.last_name}</span>
        </p>
        <p>
            <span class="bold">Doctor Name: </span>
            <span>${doctor_name}</span>
        </p>
        <p>
            <span class="bold">Presenting Complaints: </span>
            <span>${selected_appointment.presenting_complaints}</span>
        </p>
        <p>
            <span class="bold">Diagnosis: </span>
            <span>${selected_appointment.diagnosis}</span>
        </p>
        <p>
            <span class="bold">Precautions: </span>
            <span>${selected_appointment.precautions}</span>
        </p>
        <p>
            <span class="bold">Duration: </span>
            <span>${selected_appointment.duration} Days</span>
        </p>
        <p>
            <span class="bold">Total Amount: </span>
            <span>${selected_appointment.t_amount} Rs/-</span>
        </p>
        <p>
            <span class="bold">Recieved Amount: </span>
            <span>${recieved_amt.value} Rs/-</span>
        </p>
        <div class="tests">
            <h3>Tests</h3>
            <div class="test">`

            for(i of JSON.parse(selected_appointment.tests)){
                let test_name=Object.keys(i)[0];
                let price=0;
                for(j of registered_tests_list){
                    if(j.name===test_name){
                        price=j.price;
                        break;
                    }
                }
                DOM+=`<p>
                    <span class="bold">${test_name}:</span>`
                    if(typeof(i[test_name])==="object")
                        DOM+=`<span><i>[REPORT]</i> (${price} Rs/-)</span>`
                    else
                        DOM+=`<span>${i[test_name]} (${price} Rs/-)</span>
                </p>`
            }

        DOM+=`</div>
        <div class="prescriptions">
            <h3>Prescriptions</h3>`;

            JSON.parse(selected_appointment.prescriptions).forEach((i,index) => {
                DOM+=`<div class="prescription">
                    <span class="bold">Prescription ${index+1}</span>
                    <p>
                        <span class="bold">Name: </span>
                        <span>${i.name}</span>
                    </p>
                    <p>
                        <span class="bold">Quantity: </span>
                        <span>${i.quantity} Tablet/Spoon</span>
                    </p>
                    <p>
                        <span class="bold">Timmings: </span>
                        <span>${i.timmings}</span>
                    </p>
                    <hr>
                </div>`;
            });

        DOM+=`</div>
    </div>`;
    data_elem.innerHTML=DOM;
} 

const send_back_app = () => {
    show_loader();
    ipcRenderer.send("insert", `appointments/${selected_appointment.app_id}/status`, "at doctor", "send-appointment-back-result");
    ipcRenderer.on("send-appointment-back-result", (event, res) => {
        if(res){
            selected_appointment=null
            reset_explained_app_container();
            populate_appointments();
            hide_loader();
            show_notification("appointment sent back to doctor successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            hide_loader();
            show_notification("appointment could not send back to doctor", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}
const print_reciept = () => {
    populate_print_dialog();
    window.print()
}
const complete_app = () => {
    // error handling...

    let t_amt_inp=document.querySelector(".explained-app .data span input[name='recieved-amt']");
    let inputs=document.querySelectorAll(".explained-app .data .prescriptions input");

    if(!t_amt_inp.value){
        show_notification("Recieved Amount input is empty", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        t_amt_inp.focus()
        return;
    }
    if(t_amt_inp.value<0){
        show_notification("Negative amount entered in received amount...", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        t_amt_inp.focus()
        return;
    }

    let errors="";
    inputs.forEach((elem, index) => {
        if(elem.value<0 || elem.value>elem.max){
            if(!errors)
                errors+="Invalid Quantity entered for ";
            errors+="prescription "+(index+1)+" ";
        }
    })

    if(errors){
        show_notification(errors, true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }

    
    // saving data...

    show_loader();
    selected_appointment.status="done";
    selected_appointment.received_amount=t_amt_inp.value;
    let prescriptions=JSON.parse(selected_appointment.prescriptions)
    let medicine_obj={};
    for(i in prescriptions){
        prescriptions[i].given_quantity=inputs[i].value;
        for(j in medicine_list){
            if(prescriptions[i].name.toLowerCase().includes(medicine_list[j].name.toLowerCase()) && prescriptions[i].name.toLowerCase().includes(medicine_list[j].type.toLowerCase())){
                medicine_list[j].quantity=parseInt(medicine_list[j].quantity)-parseInt(inputs[i].value)
            }
            medicine_obj[`${medicine_list[j].id}`]=medicine_list[j];
        }
    }

    selected_appointment.prescriptions=JSON.stringify(prescriptions);
    ipcRenderer.send("insert", `medicines/`, medicine_obj, "update-medicine-result");
    ipcRenderer.send("insert", `appointments/${selected_appointment.app_id}/`, selected_appointment, "complete-appointment-result");
    ipcRenderer.on("complete-appointment-result", (event, res) => {
        if(res){
            selected_appointment=null;
            populate_appointments();
            reset_explained_app_container();
            hide_dialog(document.querySelector(".appointment-confirmation-dialog .cancel"));
            hide_loader();
            show_notification("Appointment completed successfully");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            hide_loader();
            show_notification("Appointment cannot completed", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}











/* code for saving and updating medicines and thier dialogs  */

const save_medicine = (dialog) => {
    if(!validate_medicine_form(dialog))
        return;

    show_loader();
    let med_name_input=dialog.querySelector("input[name='name']");
    let med_salt_input=dialog.querySelector("input[name='salt']");
    let med_quantity_input=dialog.querySelector("input[name='quantity']");
    let med_type_input=dialog.querySelector("select[name='type']");
    let med_price_input=dialog.querySelector("input[name='price']");
    let med_mfg_month_input=dialog.querySelector("input[name='mfg-month']");
    let med_mfg_year_input=dialog.querySelector("input[name='mfg-year']");
    let med_exp_month_input=dialog.querySelector("input[name='exp-month']");
    let med_exp_year_input=dialog.querySelector("input[name='exp-year']");

    let mfg_date=`${month_array[parseInt(med_mfg_month_input.value)-1]} ${med_mfg_year_input.value}`;
    let exp_date=`${month_array[parseInt(med_exp_month_input.value)-1]} ${med_exp_year_input.value}`;

    let medicine_obj={
        id:`${medicine_list.length+1}`,
        salt: med_salt_input.value,
        name:med_name_input.value,
        quantity:med_quantity_input.value,
        type:med_type_input.value,
        price:med_price_input.value,
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
    })
}
const edit_medicine_dialog = (index) => {
    let name_label=document.querySelector(".edit-medicine-dialog .data p:nth-child(1) span:last-child");
    let type_label=document.querySelector(".edit-medicine-dialog .data p:nth-child(2) span:last-child");
    let quantity_input=document.querySelector(".edit-medicine-dialog input[name='quantity']");
    let price_input=document.querySelector(".edit-medicine-dialog input[name='price']");
    let mfg_month_input=document.querySelector(".edit-medicine-dialog input[name='mfg-month']");
    let mfg_year_input=document.querySelector(".edit-medicine-dialog input[name='mfg-year']");
    let exp_month_input=document.querySelector(".edit-medicine-dialog input[name='exp-month']");
    let exp_year_input=document.querySelector(".edit-medicine-dialog input[name='exp-year']");

    object_to_be_edit=medicine_list[index]
    name_label.innerHTML=`${object_to_be_edit.name} (${object_to_be_edit.salt})`;
    type_label.innerHTML=object_to_be_edit.type
    quantity_input.value=object_to_be_edit.quantity
    price_input.value=object_to_be_edit.price
    
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
    if(!validate_medicine_form(dialog) && !object_to_be_edit)
        return;

    show_loader();
    let quantity_input=dialog.querySelector("input[name='quantity']"),
    price_input=dialog.querySelector("input[name='price']"),
    mfg_month_input=dialog.querySelector("input[name='mfg-month']"),
    mfg_year_input=dialog.querySelector("input[name='mfg-year']"),
    exp_month_input=dialog.querySelector("input[name='exp-month']"),
    exp_year_input=dialog.querySelector("input[name='exp-year']");

    object_to_be_edit.quantity=quantity_input.value
    object_to_be_edit.price=price_input.value
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

populate_appointments();










/* listening live changes in data */
ipcRenderer.on("live-value-update-captured", (event, data) => {
    let prof=data["staff"][profile.id];
    if(prof && prof.status==="online" && prof.role==="Pharmacist"){
        separte_data(data);
    }else{
        if(!prof)
            ipcRenderer.send("staff-deleted", "");
        else
            logout_user();
    }
})









/* code for shortcut key listeners */
document.addEventListener("keyup", (e) => {
    if(e.key==="N" || e.key==="n" && !isActiveInput()){
        show_dialog("add-new-medicine-dialog");
    }else if(e.key==="?" && !isActiveInput()){
        document.querySelector(".top-navigation .personal-navigation input[name='search']").focus();
    }
})
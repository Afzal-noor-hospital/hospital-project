/* importing main modules used by every portal */
const {ipcRenderer} = require("electron")



/* setting version of app */
ipcRenderer.send("get-version", "getting-version-result");
ipcRenderer.on("getting-version-result", (event, version) => {
    document.title+=" "+version;
});


/* .............. Adding pre loader in DOM .............. */
let allElems=document.body.innerHTML;
let newDOM=`<span title="Refresh (F5)" class="refresh no-print" onclick="window.location.reload();">
                <i class="fa-solid fa-arrow-rotate-right"></i>
            </span>
            <div class="network-connection-error no-print"><p>You're offline</p></div>
            <div class="toast no-print">
                <p class="toast-msg"></p>
                <button onclick="this.parentElement.classList.toggle('show');" style="--clr: var(--neon-blue);"><i class="fa-solid fa-xmark"></i></button>
            </div>      
            <div class="loader no-print">
                <div>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>`+allElems;
document.body.innerHTML=newDOM;
const show_loader=()=>{
    document.body.style.overflow="hidden"
    let loader=document.querySelector(".loader");
    loader.style.display="flex";
}
const hide_loader=()=>{
    document.body.style.overflow="auto"
    let loader=document.querySelector(".loader");
    loader.style.display="none";
}
const show_notification = (text = "", error=false) => {
    if(text){
        let toast=document.querySelector(".toast");
        if(error)
            toast.style.backgroundColor="red";
        else
            toast.style.backgroundColor="var(--neon-pink)";
        toast.querySelector(".toast-msg").innerHTML=text
        toast.classList.remove("show")
        toast.classList.add("show")
    }
}
const hide_notification = () => {
    let toast=document.querySelector(".toast");
    toast.classList.remove("show")
}
hide_loader()




/* ............ setting up remember username input code ............. */

let remember_username_label=document.querySelector(".remember-username.input label"),
remember_username_input=document.querySelector(".remember-username.input input");
if(remember_username_label){
    remember_username_label.addEventListener("click", (e) => {
        let old_val=remember_username_input.checked
        remember_username_input.checked=!old_val
    })
}



/* checking birthday and wishing */
const check_birthday_and_wish = () => {
    let current_date = new Date(Date.now());
    let [_, month, date] = profile.dob.split("-");
    if(parseInt(month)-1===current_date.getMonth() && parseInt(date)===current_date.getDate()){
        if(localStorage.getItem("birthday_wished")!=="yes"){
            let dialog = document.querySelector(".dialog");
            dialog.innerHTML+=`<div class='birthday-wish-dialog'>
                <img src="../res/birthday-wishing.gif" alt="...">
                <p>Refresh the Page to cancel it</p>
            </div>`;
            show_dialog("birthday-wish-dialog");
            localStorage.setItem("birthday_wished", "yes");
        }
    }else{
        localStorage.setItem("birthday_wished", "");
    }
}



/* ............... setting up dialog codes .................. */
let active_dialog="";
const hide_dialog = (elem) => {
    active_dialog="";
    elem.parentElement.parentElement.style.display="none" // main dialog div hidding here...
    elem.parentElement.classList.remove("show"); // particular dialog which is opened, hidding here...
    reset_fields(elem.parentElement)
}
const show_dialog = (dialog_class) => {
    active_dialog=dialog_class
    let dialog=document.querySelector(`.dialog .${dialog_class}`)
    dialog.parentElement.style.display="flex"
    dialog.classList.add("show")
    let all_inp=dialog.querySelectorAll("input, select, textarea");
    if(all_inp.length>0)
        all_inp[0].focus()
}
const reset_fields = (dialog) => {
    let inputs=dialog.querySelectorAll("input:not(input[type='checkbox'], input[type='radio']), textarea");
    let select_tags=dialog.querySelectorAll("select");
    inputs.forEach((elem) => {
        elem.value=""
    })
    select_tags.forEach((elem) => {
        for(i of elem.querySelectorAll("option"))
            if(i.defaultSelected)
                elem.value=i.value
    })
}


/* .............. setting up internet connection code ................. */
const check_network = () => {
    let error_elem=document.querySelector("div.network-connection-error");
    if(navigator.onLine){
        error_elem.classList.remove("show");
        return true;
    }else {
        error_elem.classList.add("show");
        return false;
    }
}



/* .............. setting up navigation and dialog codes ................... */
const create_navigation = (admin=false) => {
    let top_navigation=document.querySelector(".top-navigation");
    let old_navigation_code=top_navigation.innerHTML
    let new_navigation_code=`<span title="Help (ctrl+h)" class="overall-help" onclick="show_help();"><i class="fa-solid fa-question"></i></span>
        <div class="personal-navigation">
            <div class="search" title="Search (F)">
                <input type="text" name="search" placeholder="Search Here">
                <span><i class="fa-solid fa-search"></i></span>
            </div>
        <div>`;
    if(admin)
        new_navigation_code+=`<span title="Add New (N)" class="btn" onclick="show_dialog('add-new-dialog');">
            <i class="fa-solid fa-plus"></i>
        </span>`;
    new_navigation_code+=`<span title="Profile (ctrl+p)" class="btn" onclick="show_profile_dialog();">
                <i class="fa-solid fa-user"></i>
            </span>
            <span title="Change Password (alt+ctrl+p)" class="btn" onclick="show_dialog('change-password-dialog');">
                <i class="fa-solid fa-key"></i>
            </span>
            <span title="Logout (ctrl+L)" class="btn" onclick="show_dialog('logout-dialog');">
                <i class="fa-solid fa-power-off"></i>
            </span>
        </div>
    </div>`+old_navigation_code;
    top_navigation.innerHTML=new_navigation_code;


    let dialog_codes=`<div class="dialog">`
    if(admin)
        dialog_codes+=`<div class="add-new-dialog">
        <span class="cancel" onclick="hide_dialog(this);"><i class="fa-solid fa-xmark"></i></span>
        <h2>Register New Staff</h2>
        
        <div class="container">
            <div class="side-by-side">
                <div class="input">
                    <input type="text" name="first-name" required>
                    <span>First Name</span>
                    <i></i>
                </div>
                <div class="input">
                    <input type="text" name="last-name" required>
                    <span>Last Name</span>
                    <i></i>
                </div>
            </div>

            <div class="side-by-side">
                <div class="input">
                    <input type="text" name="father-name" required>
                    <span>Father Name</span>
                    <i></i>
                </div>
                <div class="input">
                    <input type="date" name="dob" required>
                    <span>Birth Date</span>
                    <i></i>
                </div>
            </div>

            <div class="side-by-side">
                <div class="input">
                    <select name="gender" required>
                        <option value="Male" selected>Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <span>Gender</span>
                    <i></i>
                </div>
                <div class="input">
                    <select name="role" required>
                        <option value="Admin" selected>Admin</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Receptionist">Receptionist</option>
                        <option value="Pharmacist">Pharmacist</option>
                        <option value="LHV">LHV</option>
                        <option value="Nurse">Nurse</option>
                    </select>
                    <span>Role</span>
                    <i></i>
                </div>
            </div>

            <div class="side-by-side">
                <div class="input">
                    <input type="text" name="cnic" required>
                    <span>CNIC</span>
                    <i></i>
                </div>
                <div class="input">
                    <input type="text" name="number" required>
                    <span>Contact Number</span>
                    <i></i>
                </div>
            </div>

            <div class="input">
                <input type="email" name="email" required>
                <span>E-mail</span>
                <i></i>
            </div>

            <div class="input">
                <input type="text" name="username" required>
                <span>Username</span>
                <i></i>
            </div>
            
            <div class="input">
                <textarea name="address" rows="5" required></textarea>
                <span>Address</span>
                <i></i>
            </div>

        </div>

        <div class="controls">
            <button style="--clr: var(--disabled-clr);" onclick="hide_dialog(this.parentElement);">Cancel</button>
            <button style="--clr: rgb(115, 133, 15);" onclick="reset_fields(this.parentElement.parentElement);">Reset</button>
            <button style="--clr: var(--neon-blue);" onclick="register_staff(this.parentElement);">Register</button>
        </div>

    </div>`;
    dialog_codes+=`<div class="profile-dialog">
            <span class="cancel" onclick="hide_dialog(this)"><i class="fa-solid fa-xmark"></i></span>
            <h2>Profile</h2>
            <h3 class="role">Admin</h3>
            <a class="reset-link link" style="--clr: var(--neon-pink);">Reset password</a>

            <div class="side-by-side">
                <div class="left">
                    <div class="data">
                        <p>First Name:</p>
                        <span class="first-name">Muhammad Amir</span>
                    </div>
                    <div class="data">
                        <p>Last Name:</p>
                        <span class="last-name">Hamza</span>
                    </div>
                    <div class="data">
                        <p>Father Name</p>
                        <span class="father-name">Ali Sher</span>
                    </div>
                    <div class="data">
                        <p>DOB:</p>
                        <span class="dob">20 May 2002</span>
                    </div>
                    <div class="data">
                        <p>Gender:</p>
                        <span class="gender">Male</span>
                    </div>
                </div>
                
                <div class="right">
                    <div class="data">
                        <p>Enrollment Date:</p>
                        <span class="enrollment-date">3650294793017</span>
                    </div>
                    <div class="data">
                        <p>CNIC:</p>
                        <span class="cnic">3650294793017</span>
                    </div>
                    <div class="data">
                        <p>Contact #:</p>
                        <span class="contact-no">03499019007</span>
                    </div>
                </div>
            </div>

            <div class="data" style="width: 100%; align-items: center;">
                <p>Address</p>
                <span class="address">CB 125 Okara</span>
            </div>

            <div class="controls">
                <button style="--clr: var(--disabled-clr);" onclick="hide_dialog(this.parentElement);">Cancel</button>
            </div>
        </div>

        <div class="change-password-dialog">
            <span class="cancel" onclick="hide_dialog(this)"><i class="fa-solid fa-xmark"></i></span>
            <h1>Change Password</h1>
            <div class="input">
                <input type="password" name="old-password" class="password" required>
                <span>Old Password</span>
                <img src="../res/visible.png" alt="..." class="show-password">
                <i></i>
            </div>
            <div class="input">
                <input type="password" name="new-password" class="password" required>
                <span>New Password</span>
                <img src="../res/visible.png" alt="..." class="show-password">
                <i></i>
            </div>
            <div class="input">
                <input type="password" name="confirm-password" class="password" required>
                <span>Confirm Password</span>
                <img src="../res/visible.png" alt="..." class="show-password">
                <i></i>
            </div>
            <div class="controls">
                <button style="--clr: var(--disabled-clr);" onclick="hide_dialog(this.parentElement);">Cancel</button>
                <button style="--clr: var(--neon-blue);" onclick="change_user_password(this.parentElement);">Change</button>
            </div>
        </div>

        <div class="logout-dialog">
            <span class="cancel" onclick="hide_dialog(this)"><i class="fa-solid fa-xmark"></i></span>
            <h2>Confirmation Dialog</h2>
            <p>Are you Sure?</p>
            <div class="controls">
                <button style="--clr: var(--disabled-clr);" onclick="hide_dialog(this.parentElement)">Cancel</button>
                <button style="--clr: var(--neon-blue);" onclick="logout_user();">Confirm</button>
            </div>
        </div>

        <div class="help-dialog">
            <span class="cancel" onclick="hide_dialog(this)"><i class="fa-solid fa-xmark"></i></span>
            <h2>Help</h2>
            <div class="data"></div>
            <div class="controls">
                <button style="--clr: var(--disabled-clr);" onclick="hide_dialog(this.parentElement)">Cancel</button>
            </div>
        </div>

    </div>`
    document.body.innerHTML+=dialog_codes;
}

const show_help = () => {
    let data_elem=document.querySelector(".help-dialog .data");
    data_elem.innerHTML=help_DOM;
    show_dialog("help-dialog")
}





/* ............ setting up show password button code ............. */
const setup_show_password = () => {
    let show_password_eye=document.querySelectorAll(".input img.show-password");
    show_password_eye.forEach((elem) => {
        elem.addEventListener("click", (e) => {
            let pass_inp = e.target.parentElement.querySelector("input.password");
            let image=elem.src;
            console.log(image);
            if(image.includes("invisible.png")){
                elem.src="../res/visible.png";
                pass_inp.type="password"
            }else{
                elem.src="../res/invisible.png";
                pass_inp.type="text"
            }
            pass_inp.focus()
        });
    });
}
setup_show_password();





/* .................... dialog function .................... */
const show_profile_dialog = (id) => {
    let currentProfile=null;
    if(!id)
        currentProfile=profile;
    else{
        for(i of admins_list){
            if(i.id===id && !currentProfile){
                currentProfile=i
                break;
            }
        }
        for(i of doctors_list){
            if(i.id===id && !currentProfile){
                currentProfile=i
                break;
            }
        }
        for(i of receptionists_list){
            if(i.id===id && !currentProfile){
                currentProfile=i
                break;
            }
        }
        for(i of pharmacists_list){
            if(i.id===id && !currentProfile){
                currentProfile=i
                break;
            }
        }
        for(i of LHVs_list){
            if(i.id===id && !currentProfile){
                currentProfile=i
                break;
            }
        }
        for(i of nurses_list){
            if(i.id===id && !currentProfile){
                currentProfile=i
                break;
            }
        }
        if(profile.role==="Admin"){
            for(i of suspended_staff){
                if(i.id===id && !currentProfile){
                    currentProfile=i
                    break;
                }
            }
        }
    }
    if(!currentProfile)
        return;

    let month_array=['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec'];
    let [y,m,d]=currentProfile.dob.split("-");
    let dob=d+" ";
    dob+=month_array[parseInt(m)-1]+" ";
    dob+=y;
    let date=new Date(currentProfile.app_date);
    let app_date=date.getDate()+" ";
    app_date+=month_array[date.getMonth()]+" ";
    app_date+=date.getFullYear();

    let reset_pssword_link=document.querySelector(".profile-dialog .reset-link");
    reset_pssword_link.innerHTML="reset password";
    if(currentProfile.id===profile.id || currentProfile.status==="suspend")
        reset_pssword_link.style.display="none";
    else{
        reset_pssword_link.style.display="block";
        if(currentProfile.password!=="0000000"){
            reset_pssword_link.addEventListener("click", (e) => {
                show_loader();
                if(currentProfile.id!==profile.id){
                    ipcRenderer.send("insert", `staff/${currentProfile.id}/password`, "0000000", "password-reset-result");
                    ipcRenderer.on("password-reset-result", (event, res) => {
                        hide_loader();
                        if(res){
                            show_notification("Password Reset Successfully");
                            setTimeout(() => {
                                hide_notification();
                            }, 5500);
                        }else{
                            show_notification("Password Cannot reset", true);
                            setTimeout(() => {
                                hide_notification();
                            }, 5500);
                        }
                    });
                }
            });
        }else{
            reset_pssword_link.innerHTML="password already reset";
        }
    }
    
    document.querySelector(".profile-dialog .role").innerHTML=currentProfile.role;
    document.querySelector(".profile-dialog .left .first-name").innerHTML=currentProfile.first_name;
    document.querySelector(".profile-dialog .left .last-name").innerHTML=currentProfile.last_name;
    document.querySelector(".profile-dialog .left .father-name").innerHTML=currentProfile.father_name;
    document.querySelector(".profile-dialog .left .dob").innerHTML=dob;
    document.querySelector(".profile-dialog .left .gender").innerHTML=currentProfile.gender;
    document.querySelector(".profile-dialog .right .enrollment-date").innerHTML=app_date;
    document.querySelector(".profile-dialog .right .cnic").innerHTML=currentProfile.cnic;
    document.querySelector(".profile-dialog .right .contact-no").innerHTML=currentProfile.contact;
    document.querySelector(".profile-dialog .address").innerHTML=currentProfile.address;

    show_dialog('profile-dialog');
}
const change_user_password = (hidding_elem) => {
    if(!profile)
        return;
    let old_password_inp=document.querySelector(".change-password-dialog input[name='old-password']"),
    new_password_inp=document.querySelector(".change-password-dialog input[name='new-password']"),
    confirm_password_inp=document.querySelector(".change-password-dialog input[name='confirm-password']");
    if(!old_password_inp.value || !new_password_inp.value || !confirm_password_inp.value){
        show_notification("Fill empty fields first", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        if(!old_password_inp.value)
            old_password_inp.focus();
        else if(!new_password_inp.value)
            new_password_inp.focus();
        else if(!confirm_password_inp.value)
            confirm_password_inp.focus();
        return;
    }

    if(new_password_inp.value===confirm_password_inp.value){
        let isOK=false;
        for(i of new_password_inp.value){
            if(i!='0'){
                isOK=true;
                break;
            }
        }
        if(!isOK){
            hide_loader();
            show_notification(`New password cannot be \"${new_password_inp.value}\"`, true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
            return
        }
    }else{
        hide_loader();
        show_notification("New and confirm passwords not matched", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }


    show_loader();

    ipcRenderer.send("fetch", `staff/${profile.id}/password`, "fetch-old-password");
    ipcRenderer.on("fetch-old-password", (event, isError, prof, data) => {
        if(isError){
            hide_loader();
            show_notification(data, true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            if(old_password_inp.value===data){
                ipcRenderer.send("insert", `staff/${profile.id}/password`, new_password_inp.value, "insert-new-password-result");
                ipcRenderer.on("insert-new-password-result", (event, res) => {
                    if(data){
                        hide_dialog(hidding_elem);
                        hide_loader();
                        show_notification("Password updated successfully");
                        setTimeout(() => {
                            hide_notification();
                        }, 5500);
                    }else{
                        hide_loader();
                        show_notification("Password not changed. Check your internet connection and try again", true);
                        setTimeout(() => {
                            hide_notification();
                        }, 5500);
                    }
                })
            }else{
                hide_loader();
                show_notification("Incorrect old password", true);
                setTimeout(() => {
                    hide_notification();
                }, 5500);
            }
        }
    })
}
const logout_user = (id) => {
    if(!id)
        id=profile.id;
    if(!id)
        return;

    show_loader();
    ipcRenderer.send("logout", id);
    ipcRenderer.on("logout-result", (event, isError, data) => {
        if(isError){
            hide_loader();
            show_notification(data, true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const is_active_any_input = () => {
    let inputs = document.querySelectorAll("input, textarea, select");
    if(inputs){
        for(i of inputs){
            if(i===document.activeElement)
                return true;
        }
    }
    return false;
}




/* .................. shortcut keys ................... */
document.addEventListener("keyup", (e) => {
    if(e.key==="F5"){
        window.location.reload();
    }else if(e.ctrlKey && (e.key==="H" || e.key==="h")){
        show_help();
    }else if(e.key==="Escape" && active_dialog){
        if(!document.querySelector(`.${active_dialog}`).classList.contains("no-esc-cancel"))
            hide_dialog(document.querySelector(`.dialog .${active_dialog} .cancel`));
    }else if(e.ctrlKey && (e.key==="L" || e.key==="l")){
        logout_user()
    }else if(!active_dialog && e.ctrlKey && e.altKey && (e.key==="P" || e.key==="p")){
        show_dialog('change-password-dialog');
    }else if(!active_dialog && e.ctrlKey && (e.key==="P" || e.key==="p")){
        show_profile_dialog();
    }else if(!active_dialog && !is_active_any_input() && (e.key==="f" || e.key==="F")){
        document.querySelector(".personal-navigation input[name='search']").focus();
    }
});





/* listening network connection */
window.ononline=check_network
window.onoffline=check_network
let username_inp=document.querySelector("form .body input[name='email']");
let pasword_inp=document.querySelector("form .body input[name='password']");
let remember_username_inp=document.querySelector("form .body .remember-username input");
let forgot_username="";




/* checking if username is remembered */
username_inp.value=localStorage.getItem("username");

if(localStorage.getItem("username")){
    pasword_inp.focus();
    remember_username_inp.checked=true;
}







/* contraints for inputs used in the login and forgot password form */
const username_contraint = (target) => {
    let data=target.value;
    let new_data="";
    for(i of data){
        if((i>='A' && i<='Z') || (i>='a' && i<='z') || (i>='0' && i<='9'))
            new_data+=i;
    }
    target.value=new_data;
}

document.querySelector(".forgot-password-dialog input[name='cnic']").addEventListener("input", (e) => {
    let data=e.target.value;
    let new_data=""
    for(i of data){
        if(i>='0' && i<='9')
            new_data+=i;
    }
    e.target.value=new_data;
})

username_inp.addEventListener("input", (e) => {username_contraint(e.target);});

document.querySelector(".forgot-password-dialog input[name='username']").addEventListener("input", (e) =>{
    username_contraint(e.target);
})








/* if clicked on login button */
document.querySelector("button[type='submit']").addEventListener("click", (e) => {
    if(!username_inp.value || !pasword_inp.value || !check_network())
        return;

    show_loader()
    if(remember_username_inp.checked)
        localStorage.setItem("username", username_inp.value);
    else
        localStorage.setItem("username", "");

    ipcRenderer.send("login", {username:`${username_inp.value}`, password:`${pasword_inp.value}`})
    ipcRenderer.on("login-result", (event, reply) => {
        hide_loader()
        show_notification(reply, true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
    })
});










/* if from dialog send Request button is clicked */
const forgot_request = (hidding_elem) => {
    let username_inp=document.querySelector(".forgot-password-dialog input[name='username']"),
    cnic_inp=document.querySelector(".forgot-password-dialog input[name='cnic']");

    if(!username_inp.value || !cnic_inp.value){
        show_notification("Fill empty field(s) first", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        if(!username_inp.value)
            username_inp.focus();
        else if(!cnic_inp.value)
            cnic_inp.focus();
        return;
    }

    show_loader();
    ipcRenderer.send("fetch", `staff/${username_inp.value}/`, "forgot-password-getting-data");
    ipcRenderer.on("forgot-password-getting-data", (event, isError, profile, data) => {
        if(isError){
            show_notification(data, true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
        else if(data){
            if(data.cnic && data.cnic==cnic_inp.value){
                if(data.email){
                    forgot_username = username_inp.value;
                    let code=Date.now()%1000000
                    let time = Date.now();
                    let email = data.email;
                    ipcRenderer.send("send-code-to-mail", `staff/${data.id}/password_reset/`, {code: code, generate_time:time}, email, "send-code-to-mail-result");
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
                            show_notification("Code cannot sent. Please try again", true);
                            setTimeout(() => {
                                hide_notification();
                            }, 5500);
                        }
                    });
                }else{
                    hide_loader();
                    show_notification("Email not registered yet. Please contact to admin", true);
                    setTimeout(() => {
                        hide_notification();
                    }, 5500);
                }
            }else{  
                hide_loader();
                show_notification("CNIC not matched with the record", true);
                setTimeout(() => {
                    hide_notification();
                }, 5500);
            }
        }else{
            hide_loader();
            show_notification("Username not exists", true);
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
    ipcRenderer.send("fetch", `staff/${forgot_username}/password_reset/`, "fetch-result");
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
                    ipcRenderer.send("insert", `staff/${forgot_username}/password`, "0000000", "password-reset-res");
                    ipcRenderer.on("password-reset-res", (event, res) => {
                        if(res){
                            ipcRenderer.send("insert", `staff/${forgot_username}/password_reset/`, null, "deleting-reset-code-res");
                            ipcRenderer.on("deleting-reset-code-res", (event, res) => {
                                hide_dialog(hidding_elem);
                                hide_loader();
                                show_notification("Now, your password is 0000000 (7 Zeros)");
                                setTimeout(() => {
                                    hide_notification();
                                }, 5500);
                            });
                        }else{
                            hide_loader();
                            show_notification("Password cannot reset. Please try again", true);
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
    })
}
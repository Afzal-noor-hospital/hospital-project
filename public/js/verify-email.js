let profile=null;

show_loader();
ipcRenderer.send("get-profile", "getting-profile-result");
ipcRenderer.on("getting-profile-result", (event, prof) => {
    profile=prof;
    hide_loader();
});



const send_code = (e) => {
    e.preventDefault();
    if(!profile){
        show_notification("Unexpected Error. Please restart the application", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }
    let email_inp = document.querySelector("input[name='email']");
    if(!email_inp.value){
        email_inp.focus();
        show_notification("Enter E-mail first", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }
    if(!email_inp.checkValidity()){
        email_inp.focus();
        show_notification("Please enter valid E-mail", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }

    show_loader();
    let code=Date.now()%1000000;
    let time=Date.now();
    profile.email = email_inp.value;
    ipcRenderer.send("send-code-to-mail", `staff/${profile.id}/password_reset/`, {code: code, generate_time:time}, profile.email, "send-code-to-mail-result");
    ipcRenderer.on("send-code-to-mail-result", (event, res) => {
        if(res){
            document.querySelector("form.mail").style.display="none";
            document.querySelector("form.code").style.display="flex";
            document.querySelector("div.code p span").innerHTML=profile.email;
            hide_loader();
            show_notification("Code sent successfully to your mail. If not found, then check your spam folder as well");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            hide_loader();
            show_notification("Code cannot sent. Please try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const send_code_again = () => {
    if(!profile || !profile.email){
        show_notification("Unexpected Error. Please restart the application", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }
    show_loader();
    let code=Date.now()%1000000;
    let time=Date.now();
    ipcRenderer.send("send-code-to-mail", `staff/${profile.id}/password_reset/`, {code: code, generate_time:time}, profile.email, "send-code-to-mail-result");
    ipcRenderer.on("send-code-to-mail-result", (event, res) => {
        if(res){
            hide_loader();
            show_notification("Code sent successfully to your mail. If not found, then check your spam folder as well");
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }else{
            hide_loader();
            show_notification("Code cannot sent. Please try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}

const verify_code = (e) => {
    e.preventDefault();
    let code_inp = document.querySelector("input[name='code']");
    if(!code_inp.value){
        show_notification("Fill empty field first", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        code_inp.focus();
    }
    show_loader();
    ipcRenderer.send("fetch", `staff/${profile.id}/password_reset/`, "fetch-result");
    ipcRenderer.on("fetch-result", (event, isError, prof, data) => {
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
                    ipcRenderer.send("insert", `staff/${profile.id}/email`, profile.email, "email-registeration-res");
                    ipcRenderer.on("email-registeration-res", (event, res) => {
                        if(res){
                            ipcRenderer.send("insert", `staff/${profile.id}/password_reset/`, null, "deleting-reset-code-res");
                            ipcRenderer.on("deleting-reset-code-res", (event, res) => {
                                ipcRenderer.send("load_portal");
                            });
                        }else{
                            hide_loader();
                            show_notification("Email cannot register. Please try again", true);
                            setTimeout(() => {
                                hide_notification();
                            }, 5500);
                        }
                    });
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
const proceed_to_portal = () => {
    let new_password_inp=document.querySelector("input[name='new-password']"),
    confirm_password_inp=document.querySelector("input[name='confirm-password']");

    if(!new_password_inp.value || !confirm_password_inp.value){
        show_notification("Fill empty field(s) first", true);
        setTimeout(() => {
            hide_notification();            
        }, 5500);
        if(!new_password_inp.value)
            new_password_inp.focus();
        else if(!confirm_password_inp.value)
            confirm_password_inp.focus();
        return;
    }
    if(new_password_inp.value!==confirm_password_inp.value){
        show_notification("New and confirm password not matched", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }
    if(new_password_inp.value==="0000000"){
        show_notification(`New password cannot be "${new_password_inp.value}"`, true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        return;
    }

    show_loader();

    ipcRenderer.send("reset-middleware", new_password_inp.value);
    ipcRenderer.on("reset-middleware-result", (event, res) => {
        if(res){
            hide_loader();
            show_notification("Please check your connection and try again", true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
    });
}
let username_inp=document.querySelector("form .body input[name='email']");
let pasword_inp=document.querySelector("form .body input[name='password']");
let remember_username_inp=document.querySelector("form .body .remember-username input");





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

document.querySelector(".forgot-password-dialog input[name='id']").addEventListener("input", (e) =>{
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
const forgot_request = () => {
    let id_inp=document.querySelector(".forgot-password-dialog input[name='id']"),
    cnic_inp=document.querySelector(".forgot-password-dialog input[name='cnic']");

    if(!id_inp.value || !cnic_inp.value){
        show_notification("Fill empty field(s) first", true);
        setTimeout(() => {
            hide_notification();
        }, 5500);
        if(!id_inp.value)
            id_inp.focus();
        else if(!cnic_inp.value)
            cnic_inp.focus();
        return;
    }

    show_loader();
    ipcRenderer.send("fetch", `staff/${id_inp.value}/`, "forgot-password-getting-data");
    ipcRenderer.on("forgot-password-getting-data", (event, isError, profile, data) => {
        if(isError){
            show_notification(data, true);
            setTimeout(() => {
                hide_notification();
            }, 5500);
        }
        else if(data){
            if(data.cnic && data.cnic==cnic_inp.value){
                ipcRenderer.send("insert", `settings/password-requests/${id_inp.value}`, {username: id_inp.value}, "reset-password-result");
                ipcRenderer.on("reset-password-result", (event, res) => {
                    hide_loader();
                    if(res){
                        show_notification("Request sent to admin successfully");
                        setTimeout(() => {
                            hide_notification();
                        }, 5500);
                        hide_dialog(document.querySelector(".forgot-password-dialog .cancel"));
                    }else{
                        show_notification("Request cannot sent", true);
                        setTimeout(() => {
                            hide_notification();
                        }, 5500);
                    }
                });
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
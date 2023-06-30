function includeAppId(app_roles,appId){
    var res=false;
    app_roles.forEach(el => {
        if(el.app_id==appId){
            res=true;
        }
    });
    return res;
}


async function registerUser(data) {
    var username = document.getElementById("username").value;
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    var image = document.getElementById("image").files[0];
    var app_roles=[];
    app_roles_tmp=document.getElementsByClassName("app-roles");
    var last_id=-1;
    for(var i=0;i<app_roles_tmp.length;i++){
        if(app_roles_tmp[i].checked){
            app=app_roles_tmp[i].value.split("-")[1];
            role=app_roles_tmp[i].value.split("-")[3];
            if(!includeAppId(app_roles,app)){
                last_id=app_roles.push({"app_id":app,"roles":[]})-1;
            }
            app_roles[last_id]['roles'].push(role);
        }
    }
    if (username == "" || username == undefined || name == "" || name == undefined || password == "" || password == undefined || image == undefined || app_roles.length==0) {
        return
    }
    const formData = new FormData();
    formData.append('username', username);
    formData.append('name', name);
    formData.append('password', password);
    formData.append('image', image);
    formData.append('app_roles', JSON.stringify(app_roles));
    fetch('/user-register', {
        method: 'POST',
        body: formData
    }).then(res => {
        if (res.status == 200) {
            document.getElementById("registration-successfull").style.display = "block";
        }
    })

}
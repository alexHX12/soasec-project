function addScope(event){
    form_id=event.target.id.substring(11,24);
    var formGroup=document.getElementById(form_id);
    var input = document.createElement("input");
    input.className="form-control mt-2";
    input.type="text";
    input.placeholder="Scope *";
    formGroup.appendChild(input);
}

function createRoleInput(placeholder,id,form_id){
    var divCol = document.createElement("div");
    divCol.className="col-md-6";
    var divFormGroup = document.createElement("div");
    divFormGroup.className="form-group ";
    if(form_id){   
        divFormGroup.id=form_id;
    }
    var input = document.createElement("input");
    if(id){
        input.id=id;
    }
    input.className="form-control";
    input.type="text";
    input.placeholder=placeholder;
    divFormGroup.appendChild(input);
    divCol.appendChild(divFormGroup);
    if(form_id){
        var divAddButton=document.createElement("div");
        divAddButton.className="d-flex justify-content-center";
        var addButton=document.createElement("button");
        addButton.addEventListener("click",addScope);
        addButton.className="btn btn-info";
        addButton.id="add-button-"+form_id;
        addButton.type="button";
        addButton.innerText="+";
        divAddButton.appendChild(addButton);
        divCol.appendChild(divAddButton);
    }
    
    return divCol;
}

var role_counter=1;

function addRole(){
    /*
    <div class="col-md-6">
                        <div class="form-group">
                            <input type="text" class="form-control" id="name" placeholder="Nome *" />
                        </div>
                    </div>
    */
    var roles=document.getElementById("roles");
    var divRow=document.createElement("div");
    divRow.className="row";
    divRow.appendChild(createRoleInput("Ruolo *","role-"+role_counter));
    divRow.appendChild(createRoleInput("Scope *",undefined,"role-"+role_counter+"-scopes"));
    role_counter++;
	roles.appendChild(divRow);
}

function registerApp() {
    var roles=[];
    for(var i=1;i<role_counter;i++){
        var role_obj={};
        role_obj.role_name=document.getElementById("role-"+i).value;
        var role_scopes=[];
        var role_scopes_tmp=document.getElementById("role-"+i+"-scopes").children;
        for(var j=0;j<role_scopes_tmp.length;j++){
            role_scopes.push(role_scopes_tmp[j].value);
        }
        role_obj.scopes=role_scopes;
        roles.push(role_obj);
    }
    payload={
        "app_name" : document.getElementById("name").value,
        "redirect_url" : document.getElementById("redirect_url").value,
        "roles": roles
    }
    fetch('/app-register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then(res => {
            document.getElementById("client_id").innerText=res.client_id;
            document.getElementById("registration-successfull").style.display="block";
        });
}
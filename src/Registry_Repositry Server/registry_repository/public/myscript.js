function validate(e) {
    var wage = document.getElementById("protocol");
    if (e === 13) {  //checks whether the pressed key is "Enter"
	//var div = document.getElementById("inputFile");
	//div.hidden = "false";
       alert("SDSSD");
}
}

function checkfile()
    {
	var wage = document.getElementById("protocol").value;
	File file = new File("/home/prerna/Desktop/qq");
        alert("ADASD"+ file.exists());
    }


function myFunction() {
var username = document.getElementById("auth_user_email").value
var password = document.getElementById("auth_user_password").value
if(username == "" || password == "") 
{
    alert("Field left blank");
    return false;
}
else if (username != "username")
{
	alert("Incorrect username");
    	return false;
}
else if (username == "username")
{
	if(password != "password")
	{
		alert("Incorrect password");
    		return false;
	}
}
else
{
    document.frmMr.submit();
}
}


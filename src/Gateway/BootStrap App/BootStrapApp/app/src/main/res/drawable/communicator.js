var socketRS;

function initSocket ()
{
    //socketFS = io.connect("http://localhost:8000");
    socketRS = io.connect("http://10.42.0.1:11000");
    // var socket = io ();
    HybridNote.showToast("Welcome to the bootstrap app!!");    
}

function FSCommunicator()
{
    gId = document.getElementById ("gId").value
    socketRS.emit ('init message', gId,function (data)
    {
        connectedSensors = data;
        document.getElementById ("sensorNames").innerHTML = JSON.stringify (data);
        fileName = data.list_of_sensors[0].protocol + "handler" + ".apk";
        HybridNote.getApk (fileName);

    });
}

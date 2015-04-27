var filterServerSocket;
var repoServerSocket;

function initSocket ()
{
    //var filterServerHost = "http://localhost:3000";
    var filterServerHost = "http://10.42.0.33:8000";
    filterServerSocket = io.connect(filterServerHost);

    //var repoServerHost = "http://localhost:8000";
    //var repoServerHost = "http://10.42.0.33:8000";

    //repoServerSocket = io.connect(repoServerHost);
}

function filterServerCommunicator()
{
    var jStringSensorData = document.getElementById("jString").value;
    filterServerSocket.emit('sensorData', jStringSensorData);

    filterServerSocket.on('command', function(cmdJSON) {
        CommandAndAckHandler.sendToActuator(cmdJSON);
    });
}

function repoServerCommunicator()
{
    var jStringHealthPing = document.getElementById("jString").value;
    repoServerSocket.emit('healthPing', jStringHealthPing);
}

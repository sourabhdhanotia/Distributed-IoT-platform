var filterServerSocket;
var repoServerSocket;
var jsonRegEx;
var jStringSensorData;
var jObjSensorData;

function initSocket ()
{
    var filterServerHost = "http://10.42.0.36:8000";        // swapnya
    //var filterServerHost = "http://10.42.0.33:9000";      // atul
    //var filterServerHost = "http://192.168.211.137:8000";
    filterServerSocket = io.connect(filterServerHost);

    //var repoServerHost = "http://localhost:8000";
    var repoServerHost = "http://10.42.0.1:11000";          // abhinav
    repoServerSocket = io.connect(repoServerHost);

    //jsonRegEx = /\\{*\\}/;
    //jStringSensorData = jsonRegEx.exec(document.getElementById("jString").value);
    jStringSensorData = document.getElementById("jString").value;
    jObjSensorData = JSON.parse(jStringSensorData);
    //console.log("string: " + jStringSensorData);
    //console.log("object is: " + jObjSensorData);

    //var prettyJson = JSON.stringify(jObjSensorData, undefined, 2);
    //document.getElementById("prettyJson").innerHTML = prettyJson;
}

function filterServerCommunicator()
{
    var gatewayID = document.getElementById("gatewayID").value;


    console.log(JSON.stringify("String received is:" + jObjSensorData));
    var jObjTarget = {
        "gatewayIds": [parseInt(gatewayID)],
        "isDirect": true,
        "originGatewayId": parseInt(gatewayID),
        "timestamp": new Date(),
        "data": jObjSensorData.sensorDatas
    };

    //console.log("length of array is: ", jObjSensorData.sensorDatas.length);
    for(var i = 0; i < jObjSensorData.sensorDatas.length; i++) {
        var obj = jObjSensorData.sensorDatas[i];
        console.log("MY sensor:" + obj.sensorId);
    }
//    JSONArray arr = jObjSensorData.getJSONArray("sensorDatas");
//    for (int i = 0; i < arr.size(); i++) {
//        JSONObject objects = getArray.getJSONArray(i)
//    }

    console.log("Sending to filter server" + JSON.stringify(jObjTarget));
    filterServerSocket.emit('sensorData', jObjTarget, function (cmdJSON) {
        CommandHandler.sendToActuator(JSON.stringify(cmdJSON));
        console.log(cmdJSON);
    });

}

function repoServerCommunicator()
{

    var gatewayID = document.getElementById("gatewayID").value;
    var sensorTimestamp = document.getElementById("sensorTimestamp").value;

   var sensorData = [];
   for (var i = 0; i < jObjSensorData.sensorDatas.length; i++) {
        var sData = jObjSensorData.sensorDatas[i];
        var obj = {
            "sensor_id": sData.sensorId,
            "sensor_family_id": sData.sensorFamilyId,
            "lat": sData.lat,
            "lon": sData.lon,
            "sensor_timestamp": parseInt(sensorTimestamp)
        };
        sensorData.push(obj);
    }


    var d = new Date();
    var jObjTarget = {
        "gateway_id": parseInt(gatewayID),
        "gateway_timestamp": d.getTime(),
        "sensorData": sensorData
    };

    console.log("Sending to repo server" + JSON.stringify(jObjTarget));
    repoServerSocket.emit('healthPing', jObjTarget);
}

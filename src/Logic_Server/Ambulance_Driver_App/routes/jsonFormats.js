//JSON coming from user for authentication
{
	userName : 'User1',
	password : 'password',
	lat : 30.5,
	lon : 66.3

	//lat & long determine the location of the garden
}

//If lat/lon is not given, then the user is already registered else 
//he is new user.






//Insert user & his location in mongo

//Respond with some basic info
//Get the sensorId for each family for that location (take first if there are many)
//send that to show in the card

//2 calls ( get list of sensors : Aditi, get data per sensor-type : Filter server)
{
	isAuthenticated:true,
	Temperature : {
		value : 55.22,
		unit : 'Celsius'
	}
	Humidity : {
		value : 34.33
		unit : 'Percentage'
	}
	accessKey:''
}
	






//JSON coming from the user app with rules
//? It is web-form, but  will be a POST call. So we will get key-value pairs.
{  
	sensorType : ['Humidity', 'Temperature', 'Moisture' ],
	operator : [ '<', '>', '=' ],
	value : [ 30.4, 40.0, 50.6 ],
	msg : 'The temp has increased',
	accessKey : 123
	
}


>Insert in "rules" table - 
{ 	_id : <>, 
	userID : <Foreign key to user table>,
	/*rules : [
		{
			sensorType : 'temp',
			operator : '>',
			value : 50
		},
		{
			sensorType : 'motion',
			operator : '<',
			value : 5
		}


	],
	*/

	msg:"The temp has increased!",
	createdAt : <>,
	updatedAt : <>
}








//JSON to be sent to Logic Server
//Make query to get list of sensors wrt to location which will be needed in the callback function
//Exact JSON will be finalised later
{
	data : {
		sensorIds : [123,1234,12,65,345]
	},
	interval : 3000,
	callbackOnInterval : true,
	pushURL : {
		'host' : ''//IP
		'port' : 3000
		'path' : '/callback'
	},//Your post interval you want to register with filter server
	accessKey : '',
	callbackFunction : 'console.log(data)',
	requestId : 56
}









//Send notification from filter server to user
//Find Push notification
//The msg to be sent to the user will be given by user only & is entered in the "rules" collection.
{
	msg:'The temp has gone beyond 40 celsius'
}



//JSON sending command from user to sensor via logic server
{
	sensorId : 12345
	command : "Turn on the AC"
}
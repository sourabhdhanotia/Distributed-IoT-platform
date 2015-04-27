package com.ias.trafficsensor;

import android.app.AlertDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;
import java.util.UUID;


public class MainActivity extends ActionBarActivity implements View.OnClickListener {


    private BluetoothAdapter mBluetoothAdapter = null;
    private static final int REQUEST_ENABLE_BT = 3;
    private boolean isConnected = false;
    private final int MESSAGE_READ = 1;
    private String readMessage=null;
    private TextView serverTag , sensor_id , sensor_type;
    private String sensoridstr="2110" , sensorFamilystr="HeatMap" ;
    private float longitude , latitude;
    private int sensorFamilyNo=21;
    private boolean isInitialized=false , isHealthPing=false;        // To check whether user has entered the field values or not
    private int packetno=0;
    Handler myhandler;
    String cmd=null;
    Button A,B,C,D,E,F;


    private double subsensors[][]={ {20.5,30.33} , {40.12 , 30.9} , {60.2 , 30.3} , {20.5 , 50.6} , {40.3,50.4} , {60.6 , 50.5}};
    private int lowtraffic[]={0,0,0,0,0,0};

    private int datacount=0;
    final Context context = this;
    Thread thread1=null;
    boolean threadrunallowed=true;

    int packetseq=0;


    private static final int TEMPERATURE=11 , BLOODPRESSURE=12 , HEARTBEAT=13;

    private int sensorindex ,sensoridint;
    boolean isinc;

    public static int randInt(int min, int max) {

        // NOTE: Usually this should be a field rather than a method
        // variable so that it is not re-seeded every call.
        Random rand = new Random();

        // nextInt is normally exclusive of the top value,
        // so add 1 to make it inclusive
        int randomNum = rand.nextInt((max - min) + 1) + min;

        return randomNum;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mBluetoothAdapter=BluetoothAdapter.getDefaultAdapter();
        serverTag=(TextView)findViewById(R.id.tag);
        sensor_id=(TextView)findViewById(R.id.sid);
        sensor_type=(TextView)findViewById(R.id.stype);
        sensorindex=0;
        isinc=true;

        A=(Button)findViewById(R.id.A);
        B=(Button)findViewById(R.id.B);
        C=(Button)findViewById(R.id.C);
        D=(Button)findViewById(R.id.D);
        E=(Button)findViewById(R.id.E);
        F=(Button)findViewById(R.id.F);

        A.setOnClickListener(this);
        B.setOnClickListener(this);
        C.setOnClickListener(this);
        D.setOnClickListener(this);
        E.setOnClickListener(this);
        F.setOnClickListener(this);

        //latitude = randInt(10, 100) + (float)(randInt(1,100)/100.0);
        latitude=40f;
        longitude=20f;
        //longitude = randInt(10, 100) + (float)(randInt(1,100)/100.0);

        /*
        LayoutInflater li = LayoutInflater.from(context);
        View promptsView = li.inflate(R.layout.initprompt, null);
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(context);
        alertDialogBuilder.setView(promptsView);
        final EditText sensorid = (EditText) promptsView.findViewById(R.id.userInput);
        final EditText sensortype = (EditText) promptsView.findViewById(R.id.userInput1);
        final EditText latitudestr = (EditText) promptsView.findViewById(R.id.userInput2);
        final EditText longitudestr = (EditText) promptsView.findViewById(R.id.userInput3);


        alertDialogBuilder
                .setCancelable(false)
                .setPositiveButton("OK",
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog,int id) {
                                // get user input and set it to result
                                // edit text
                                sensor_id.setText("Id : "+sensorid.getText());

                                sensoridstr=sensorid.getText().toString();
                                sensoridint=Integer.parseInt(sensoridstr);
                                sensorFamilyNo=Integer.parseInt(sensortype.getText().toString());
                                latitude=Float.parseFloat(latitudestr.getText().toString());
                                longitude=Float.parseFloat(longitudestr.getText().toString());

                                Toast.makeText(MainActivity.this , latitude+" , "+longitude , Toast.LENGTH_LONG).show();
                                switch (sensorFamilyNo){
                                    case 11: sensorFamilystr="Body Temperature"; break;
                                    case 12: sensorFamilystr="Blood Pressure"; break;
                                    case 13: sensorFamilystr="HeartBeat"; break;
                                }
                                sensor_type.setText("Family : "+sensortype.getText()+" ("+sensorFamilystr+")");
                                isInitialized=true;
                                onStart();

                            }
                        });
                 .setNegativeButton("Cancel",
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog,int id) {
                                dialog.cancel();
                            }
                        });*/

        // create alert dialog
        //    AlertDialog alertDialog = alertDialogBuilder.create();

        // show it
        //   alertDialog.show();



        System.out.println("Got adapter");
        sensor_type.setText("Family : "+21+" ("+sensorFamilystr+")");
        isInitialized=true;
        onStart();

        //  Toast.makeText(this , "Got adapter", Toast.LENGTH_LONG).show();
        if (mBluetoothAdapter == null) {
            // Device does not support Bluetooth
            System.out.println("No bluetooth");
            Toast.makeText(this, "Bluetooth is not available", Toast.LENGTH_LONG).show();
            //   finish();
        }




    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }



    @Override
    public void onStart()
    {
        super.onStart();
        //  Toast.makeText(this,"Enabling bluetooth outer", Toast.LENGTH_LONG).show();
        myhandler=new Handler();

        if (!mBluetoothAdapter.isEnabled() && isInitialized) {
            System.out.println("enabling BT");
            Toast.makeText(this , "Enabling bluetooth", Toast.LENGTH_LONG).show();
            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
        }
        else if(isInitialized){
            Toast.makeText(this , "Sensor Activated", Toast.LENGTH_LONG).show();
            thread1 = new AcceptThread();
            thread1.start();
            Toast.makeText(getApplicationContext() , "Sensor is up and running", Toast.LENGTH_LONG).show();

            serverTag.setText("Sensor sensing Data");
        }

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if(isInitialized) {
            Toast.makeText(this, "Bluetooth Enable request done", Toast.LENGTH_LONG).show();

            if (resultCode == RESULT_CANCELED) {
                Toast.makeText(this, "Bluetooth Enable request Cancelled", Toast.LENGTH_LONG).show();
                finish();
            }

            Toast.makeText(this, "Sensor activated", Toast.LENGTH_LONG).show();
            thread1 = new AcceptThread();
            thread1.start();
            Toast.makeText(getApplicationContext(), "Sensor is up and running", Toast.LENGTH_LONG).show();
            serverTag.setText("Listening for connections");
        }
    }   // end of onactivityresult

    @Override
    protected void onDestroy() {
        super.onDestroy();
        threadrunallowed=false;
        Log.d("Destroyed" , "App");
    }

    private Runnable command = new Runnable() {
        public void run() {

            cmd=cmd.trim();
            Log.d("Coordinates Received:" ,""+ cmd);

            if(cmd.length() > 2) {
                serverTag.setText("GPS Coordinates: "+cmd);
                // Toast.makeText(MainActivity.this, "Coordinates :" + cmd, Toast.LENGTH_SHORT).show();
            }
        }
    };

    @Override
    public void onClick(View arg0) {
        if(arg0.getId() == R.id.A)lowtraffic[0]=4;
        if(arg0.getId() == R.id.B)lowtraffic[1]=4;
        if(arg0.getId() == R.id.C)lowtraffic[2]=4;
        if(arg0.getId() == R.id.D)lowtraffic[3]=4;
        if(arg0.getId() == R.id.E)lowtraffic[4]=4;
        if(arg0.getId() == R.id.F)lowtraffic[5]=4;

    }

    /*****************************************************************************************************************************/

    private class AcceptCommand extends Thread
    {
        BluetoothSocket bsoc;
        InputStream ips;
        public AcceptCommand(BluetoothSocket bsocket){
            bsoc=bsocket;
        }

        public void run(){

            byte buffer[]=new byte[8024];

            //if(datacount%5==0){
            try {
                ips=bsoc.getInputStream();

                if(ips.available()!=0){
                    ips.read(buffer);
                    cmd=new String(buffer);}
                myhandler.post(command);

            } catch (IOException e) {
                e.printStackTrace();
            }


            datacount++;
        }


    }

    /***************************************************************************************************************************/

    private class AcceptThread extends Thread {
        private final BluetoothServerSocket mmServerSocket;
        String NAME="Bluetooth Connection";
        UUID MY_UUID = UUID.fromString("446118f0-8b1e-11e2-9e96-0800200c9a66");


        public AcceptThread() {
            // Use a temporary object that is later assigned to mmServerSocket,
            // because mmServerSocket is final
            BluetoothServerSocket tmp = null;
            try {
                // MY_UUID is the app's UUID string, also used by the client code
                tmp = mBluetoothAdapter.listenUsingRfcommWithServiceRecord(NAME, MY_UUID);
            } catch (IOException e) { }
            mmServerSocket = tmp;
        }

        public void run() {
            BluetoothSocket socket = null;
            System.out.println("Listening now");
            // Toast.makeText(getApplicationContext() , "Listening now", Toast.LENGTH_LONG).show();
            //   Toast.makeText(getApplicationContext() , "Listening to requests on BT", Toast.LENGTH_LONG).show();
            // Keep listening until exception occurs or a socket is returned
            while (threadrunallowed) {
                try {
                    System.out.println("Socket open");
                    socket = mmServerSocket.accept();
                } catch (IOException e) {
                    break;
                }
                // If a connection was accepted
                if (socket != null) {

                    isHealthPing=false;
                    packetno=(packetno+1)%6;
                    if(packetno==2 || packetno==3)isHealthPing=true;

                    // Do work to manage the connection (in a separate thread)

                    /*Thread cmdreader=new AcceptCommand(socket);
                    cmdreader.start();
                    Thread.yield();
                    try {
                        Thread.sleep(600,0);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    if(cmdreader.isAlive()) cmdreader.interrupt();
                    */

                    byte buffer[]=new byte[1024];
                    try {
                        InputStream inps=socket.getInputStream();
                        inps.read(buffer);
                        cmd=new String(buffer);

                        if(!cmd.equals(" "))
                            myhandler.postDelayed(command , 50);

                        Thread.yield();



                    } catch (IOException e) {
                        e.printStackTrace();
                    }


                    manageConnectedSocket(socket);

                    try {
                        // mmServerSocket.close();
                        Thread.sleep(200,0);
                        socket.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }

                   /* try {
                        Thread.sleep(2000,0);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }*/
                    //break;
                }

                if(Thread.interrupted())break;
            }
        }


        private String getJSONData()
        {
            StringBuilder socjson = new StringBuilder();
            socjson.append("{");
            socjson.append("sensorId:"+sensoridstr+",");
            socjson.append("sensorFamilyId:" +sensorFamilyNo+",");

            float lat = randInt(10, 100) + (float)(randInt(1,100)/100.0);
            float lon = randInt(10, 100) + (float)(randInt(1,100)/100.0);

            lat=latitude; lon=longitude;   // Make lat lon static initially

            socjson.append("lat:" + lat + ",");
            socjson.append("lon:" + lon + ",");

            if(isHealthPing)socjson.append("isHealthPing:"+true+",");
            else socjson.append("isHealthPing:"+false+",");


            socjson.append("sensorDatas:");

            socjson.append("[");

            for(int i=packetseq;i<packetseq+3;i++)
            {
                socjson.append("{sensorId:"+(2001+i)+",");
                socjson.append("sensorFamilyId:" +sensorFamilyNo+",");
                socjson.append("lat:" + subsensors[i][0] + ",");
                socjson.append("lon:" + subsensors[i][1] + ",");
                socjson.append("sensorData:");

                if(isHealthPing)socjson.append("{}");
                else{
                    socjson.append("{");

                    if(lowtraffic[i]>0){
                        lowtraffic[i]--;
                        socjson.append("value:"+ 60+",");
                    }
                    else socjson.append("value:"+ randInt(150, 400)+",");

                    socjson.append("unit:"+"VPM");

                    socjson.append("}");
                }

                socjson.append("}");

                if(i<packetseq+2)socjson.append(",");

            }

            socjson.append("]");
            socjson.append("}");

            if(packetseq==0)packetseq=3;
            else packetseq=0;

            isHealthPing=false;
            return socjson.toString();
        }

        private void manageConnectedSocket(BluetoothSocket socket) {

            String socdata="socdata_"+mBluetoothAdapter.getName() +"_" +datacount;
            datacount++;
            System.out.println("");

            String socjson = getJSONData();
            try {
                JSONObject obj = new JSONObject(socjson);
                socjson=obj.toString(4);
              //  System.out.println(socjson);
            } catch (JSONException e) {
                e.printStackTrace();
            }


            Thread thread2 = new ThreadManage(socket,mHandler , socjson);
            thread2.start();
        }

        /** Will cancel the listening socket, and cause the thread to finish */
        public void cancel() {
            try {
                mmServerSocket.close();
            } catch (IOException e) { }
        }
    }

    private final Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case MESSAGE_READ:
                    byte[] readBuf = (byte[]) msg.obj;
                    // construct a string from the valid bytes in the buffer
                    readMessage = new String(readBuf, 0, msg.arg1);
                    isConnected=true;
                    Toast.makeText(getApplicationContext() , readMessage, Toast.LENGTH_LONG).show();
                    break;
            }
        }
    };
}






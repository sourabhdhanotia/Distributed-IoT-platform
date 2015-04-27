package com.ias.sensorbt;

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


public class MainActivity extends ActionBarActivity {


    private BluetoothAdapter mBluetoothAdapter = null;
    private static final int REQUEST_ENABLE_BT = 3;
    private boolean isConnected = false;
    private final int MESSAGE_READ = 1;
    private String readMessage=null;
    private TextView serverTag , sensor_id , sensor_type;
    private String sensoridstr , sensorFamilystr ;
    private float longitude , latitude;
    private int sensorFamilyNo;
    private boolean isInitialized=false , isHealthPing=false;        // To check whether user has entered the field values or not
    private int packet_no=0;
    Handler myhandler;
    String cmd=null;

    private int datacount=0;
    String socjson="";
    final Context context = this;
    Thread thread1=null;
    boolean threadrunallowed=true;

    private static final int TEMPERATURE=11 , BLOODPRESSURE=12 , HEARTBEAT=13;

    private double svalues[][]={ {95.0,96.1,96.6,97.5,98.4,99.2,99.9,100.8,101.5,102.8},{51.0,57.7,62.4,75.5,88.7,96.6,105.5,118.8,132.8,145.5},{53,60,65,73,78,80,89,93,97,104}};

    private double llvalues[][]={ {30.2,30.6,30.9,31.2,32.3,34.6,34.8,34.9,35.9,36.1,36.2,36.7,37.3,37.5,39.3},{60.1,60.25,60.32,60.9,61.1,61.3,61.48,61.9,62.1,62.3,62.34,62.8,62.91,64.8,65.4}};

    private int sensorindex ,sensoridint , packetno;
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
        packetno=0;

        //latitude = randInt(10, 100) + (float)(randInt(1,100)/100.0);
        latitude=2.2f;
        longitude=3.5f;
        //longitude = randInt(10, 100) + (float)(randInt(1,100)/100.0);

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
                /* .setNegativeButton("Cancel",
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog,int id) {
                                dialog.cancel();
                            }
                        });*/

        // create alert dialog
        AlertDialog alertDialog = alertDialogBuilder.create();

        // show it
        alertDialog.show();



        System.out.println("Got adapter");
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


                if(cmd.charAt(0)=='1')isinc=true;
                else if(cmd.charAt(0)=='0')isinc=false;

                Toast.makeText(MainActivity.this , socjson , Toast.LENGTH_SHORT).show();
                cmd=cmd.trim();
                Log.d("Command Received:" ,""+ cmd);
                serverTag.setText("Command Received :"+cmd);
              if(cmd.length() > 3)  Toast.makeText(MainActivity.this , "Command Received :"+cmd , Toast.LENGTH_SHORT).show();
                cmd=" ";
        }
    };

    /*****************************************************************************************************************************/

    private class AcceptCommand extends Thread
    {
        BluetoothSocket bsoc;
        InputStream ips;
        public AcceptCommand(BluetoothSocket bsocket){
            bsoc=bsocket;
        }

        public void run(){

            byte buffer[]=new byte[1024];

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
                    packetno=(packetno+1)%5;
                    if(packetno==4)isHealthPing=true;

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

            if(isHealthPing)socjson.append("isHealthPing:"+true+",");
            else socjson.append("isHealthPing:"+false+",");

            socjson.append("sensorDatas:[{");
            socjson.append("sensorId:"+sensoridstr+",");
            socjson.append("sensorFamilyId:" +sensorFamilyNo+",");

            float lat = randInt(10, 100) + (float)(randInt(1,100)/100.0);
            float lon = randInt(10, 100) + (float)(randInt(1,100)/100.0);

            if(sensorFamilyNo!=5){lat=latitude; lon=longitude;  }

            socjson.append("lat:" + llvalues[0][packet_no] + ",");
            socjson.append("lon:" + llvalues[1][packet_no] + ",");

            packet_no=(packet_no+1)%15;



            if(sensorindex==9 && isinc){isinc=false; }
            if(sensorindex==0 && !isinc){isinc=true; }

            if(isinc)sensorindex++;
            else sensorindex--;

            double sensorData = svalues[sensorFamilyNo-11][sensorindex];
            String unit = null;

            switch (sensorFamilyNo)
        {
            case TEMPERATURE    : unit = "^F" ; break;
            case BLOODPRESSURE  : unit ="mmHg"; break;
            case HEARTBEAT      : unit="BPM";break;
        }


            socjson.append("sensorData:");

            if(sensorFamilyNo==5 || isHealthPing)socjson.append("true");
            else  socjson.append("{" + "value:" + sensorData + "," + "unit:'" + unit + "'}");

            socjson.append("}");

            socjson.append("]}");

            isHealthPing=false;
            return socjson.toString();
        }

        private void manageConnectedSocket(BluetoothSocket socket) {

            String socdata="socdata_"+mBluetoothAdapter.getName() +"_" +datacount;
            datacount++;
            System.out.println("");

            socjson = getJSONData();
            try {
                JSONObject obj = new JSONObject(socjson);
                socjson=obj.toString(4);

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






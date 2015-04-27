package com.ias.sensorbtclient;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.content.Context;
import android.content.Intent;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.Buffer;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;


public class MainActivity extends ActionBarActivity {


    private BluetoothAdapter mBluetoothAdapter = null;
    private static final int REQUEST_ENABLE_BT = 3;
    private boolean isConnected = false;
    private final int MESSAGE_READ = 1;
    private Handler myhandler;
    private String readMessage=null;
    private TextView serverTag , head;
    public static Activity parentactivity;
    public static String sensorDataJStr="";
    public int packetcount=1;
    Set<BluetoothDevice> pairedDevices=null;
    Set<String> mArrayAdapter=null;
    int x=0 , cur_device_no , no_of_devices;
    int commandcount=0;
    public static String gatewayID;
    public static HashMap<String , String> sensorcommands;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mBluetoothAdapter=BluetoothAdapter.getDefaultAdapter();
        serverTag=(TextView)findViewById(R.id.tag);
        head=(TextView)findViewById(R.id.head);

        head.setText("Gateway");
        serverTag.setText("Receiving Data...");
        parentactivity=this;


        if (mBluetoothAdapter == null) {
            // Device does not support Bluetooth
            System.out.println("No bluetooth");
            Toast.makeText(this, "Bluetooth is not available", Toast.LENGTH_LONG).show();
            //   finish();
        }

        // Get the gateway ID
        try {
            String PATH =   Environment.getExternalStorageDirectory().toString();
            FileInputStream fis = new FileInputStream(new File(PATH, "gatewayID.txt"));
            InputStreamReader isr = new InputStreamReader(fis);
            BufferedReader bufferedReader = new BufferedReader(isr);
            String line = bufferedReader.readLine().trim();
            MainActivity.gatewayID = line;

            bufferedReader.close();


            // Initialize command map
            MainActivity.sensorcommands = new HashMap<String, String>();
        }
        catch (Exception e) {
            e.printStackTrace();
            Log.d("Exception: ", e.toString());
        }

   }


    private Runnable mUpdate = new Runnable() {
        public void run() {

            if(true) {
                BluetoothDevice btd = (BluetoothDevice) pairedDevices.toArray()[cur_device_no];
                Thread thread1 = new ConnectThread(btd , MainActivity.this);
                // myhandler.post(mUpdate);
                serverTag.setText("Waiting for data");
                //Toast.makeText(MainActivity.this , "Received Packet "+packetcount , Toast.LENGTH_SHORT);
                packetcount++;
                thread1.start();

                //serverTag.setText(MainActivity.sensorDataJStr);

                // This method takes care of sending the health pings and incoming data to registry server and the filter server simultaneously
                if (MainActivity.sensorDataJStr.length() > 1) {
                    Context context = getApplicationContext();
                    MainActivity.sendMessage(context);
                }

                cur_device_no=(cur_device_no+1)%no_of_devices;
                myhandler.postDelayed(mUpdate, 4000);

                x++;
            }


        }
    };


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

        if (true || !mBluetoothAdapter.isEnabled()) {
           // Toast.makeText(this , "Enabling bluetooth", Toast.LENGTH_LONG).show();
            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
        }



        pairedDevices = mBluetoothAdapter.getBondedDevices();
        no_of_devices=pairedDevices.size();

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

       // Toast.makeText(this, "Bluetooth Enable request done", Toast.LENGTH_LONG).show();

        if(resultCode == RESULT_CANCELED){
            Toast.makeText(this, "Bluetooth Enable request Cancelled", Toast.LENGTH_LONG).show();
            finish();
        }

        myhandler=new Handler();

        myhandler.post(mUpdate);

        x=1;



    }   // end of onactivityresult


    /***************************************************************************************************************************/

    /*************************************** Client connection **********************************************************/

    private class ConnectThread extends Thread {
        private final BluetoothSocket mmSocket;
        private final BluetoothDevice mmDevice;
        Activity parent;

        UUID MY_UUID = UUID.fromString("446118f0-8b1e-11e2-9e96-0800200c9a66");

        public ConnectThread(BluetoothDevice device , Activity aparent) {
            // Use a temporary object that is later assigned to mmSocket,
            // because mmSocket is final
            BluetoothSocket tmp = null;
            mmDevice = device;
            parent=aparent;

            // Get a BluetoothSocket to connect with the given BluetoothDevice
            try {
                // MY_UUID is the app's UUID string, also used by the server code
                tmp = device.createRfcommSocketToServiceRecord(MY_UUID);
            } catch (IOException e) { }
            mmSocket = tmp;
        }

        public void run() {
            // Cancel discovery because it will slow down the connection
            mBluetoothAdapter.cancelDiscovery();
            try {
                Thread.sleep(200,0);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            try {
                // Connect the device through the socket. This will block
                // until it succeeds or throws an exception
                mmSocket.connect();
            } catch (IOException connectException) {
                // Unable to connect; close the socket and get out
                connectException.printStackTrace();
                try {
                    mmSocket.close();
                } catch (IOException closeException) { }
                return;
            }

            byte buffer[]=new byte[8024];
            // Do work to manage the connection (in the same thread)
            try {
                InputStream socinp=mmSocket.getInputStream();
                OutputStream socout=mmSocket.getOutputStream();
                byte outbuf[]=" ".getBytes();


                //if(commandcount%5==0)outbuf=(commandcount+"_command to do").getBytes();


                if(sensorcommands.containsKey(mmDevice.getName())) {
                    outbuf=sensorcommands.get(mmDevice.getName()).getBytes();
                }

                sensorcommands.put(mmDevice.getName() , " ");

                socout.write(outbuf);
                commandcount++;



                int bytesread=socinp.read(buffer);
                MainActivity.sensorDataJStr = new String(buffer,0,bytesread);

//                System.out.println(bytesread);

                // /*********************************************
                Calendar c = Calendar.getInstance();
                int seconds = c.get(Calendar.SECOND);
                Looper.prepare();
                serverTag.clearComposingText();
                //System.out.println("received from: " + MainActivity.sensorDataJStr);

               // showToast(sensordata);

                runOnUiThread(new Runnable() {
                    public void run() {

                        //Toast.makeText(MainActivity.this, MainActivity.sensorDataJStr,Toast.LENGTH_LONG).show();
                    }
                });

                //Toast.makeText(getApplicationContext() , sensordata, Toast.LENGTH_LONG).show();

                // /*********************************************


            } catch (IOException e) {
                e.printStackTrace();
            }

            cancel();
        }

        /** Will cancel an in-progress connection, and close the socket */
        public void cancel() {
            try {
                mmSocket.close();
            } catch (IOException e) { }
        }

    }

    // This method takes care of sending the incoming data and health pings to registry server and the filter server simultaneously
    public static void sendMessage(Context c) {
        Intent intent = new Intent(c, CommunicatorActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra("jStr", MainActivity.sensorDataJStr);
        intent.putExtra("gatewayID", MainActivity.gatewayID);

        c.startActivity(intent);
    }


}







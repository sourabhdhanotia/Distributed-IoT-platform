package com.ias.sensorbt;

import android.bluetooth.BluetoothSocket;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class ThreadManage extends Thread {

    private final BluetoothSocket mmSocket;
    private final InputStream mmInStream;
    private final OutputStream mmOutStream;
    private final int MESSAGE_READ = 1;
    private Handler mHandler;
    private String sdata;

    public void run() {
        System.out.println("Hello from read thread!");



        byte[] buffer=sdata.getBytes();
        int bytes; // bytes returned from read()

        // Keep listening to the InputStream until an exception occurs
        //while (true) {
            try {
                // Read from the InputStream
                mmOutStream.write(buffer);

                mmOutStream.flush();
                // Send the obtained bytes to the UI activity
                //mHandler.obtainMessage(MESSAGE_READ, bytes, -1, buffer).sendToTarget();

            } catch (IOException e) {
                e.printStackTrace();
            }
        //}
    }

    public ThreadManage(BluetoothSocket bsoc , Handler handler , String data){
        mmSocket = bsoc;
        InputStream tmpIn = null;
        OutputStream tmpOut = null;
        mHandler=handler;
        sdata=data;
        try {
            tmpIn = bsoc.getInputStream();
            tmpOut = bsoc.getOutputStream();
        } catch (IOException e) { }

        mmInStream = tmpIn;
        mmOutStream = tmpOut;

    }

    public void write(byte[] bytes) {
        try {
            mmOutStream.write(bytes);
        } catch (IOException e) { }
    }

    /* Call this from the main activity to shutdown the connection */
    public void cancel() {
        try {
            mmSocket.close();
        } catch (IOException e) { }
    }


    // The Handler that gets information back from the BluetoothChatService

}
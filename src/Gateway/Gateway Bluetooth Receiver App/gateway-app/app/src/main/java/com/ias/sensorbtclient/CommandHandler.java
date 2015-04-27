package com.ias.sensorbtclient;

import android.content.Context;
import android.util.Log;
import android.webkit.JavascriptInterface;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Created by atul on 4/13/15.
 */
public class CommandHandler {
    Context mContext;

    /** Instantiate the interface and set the context */
    CommandHandler(Context c) {
        mContext = c;
    }

    @JavascriptInterface
    public void sendToActuator(String commandListStr) {
        try {
            JSONObject jObj = new JSONObject(commandListStr);
            System.out.println(commandListStr);
            JSONArray commandList = jObj.getJSONArray("commandList");

            int n = commandList.length();
            for (int i = 0; i < n; i++) {
                JSONObject commandItemJsonObj = commandList.getJSONObject(i);

                String sid = commandItemJsonObj.getInt("sensorId") + "";
                int gid = commandItemJsonObj.getInt("gatewayId");
                String cmd = commandItemJsonObj.getString("command");

                MainActivity.sensorcommands.put(sid, cmd);
                System.out.println("command is: " + cmd);
                Log.d("========####COMMAND#","====RECEIVED####");
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }


    }

    @JavascriptInterface
    public void closeActivity() {

    }
}
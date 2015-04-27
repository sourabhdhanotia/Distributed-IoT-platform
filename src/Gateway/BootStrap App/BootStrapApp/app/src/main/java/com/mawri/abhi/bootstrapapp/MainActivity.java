package com.mawri.abhi.bootstrapapp;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.os.Environment;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;


public class MainActivity extends ActionBarActivity {

    WebSettings wSettings;
    String gatewayId = "";

    @SuppressLint("SetJavaScriptEnabled")

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        WebView myWebView = (WebView) findViewById(R.id.webview);
        myWebView.setClickable(true);
        wSettings = myWebView.getSettings();
        wSettings.setJavaScriptEnabled(true);
        wSettings.setJavaScriptCanOpenWindowsAutomatically(false);
        wSettings.setDomStorageEnabled(true);

        String html = "<!DOCTYPE html>";
        html += "<head><title>Gateway Interface</title></head>";
        html += "<script src=\"socket.io.js\"></script>";
        html += "<script src=\"delivery.js\"></script>";
        html += "<script src=\"communicator.js\"></script>";
        html += "<body onload=\"initSocket();\">";

        myWebView.addJavascriptInterface(new WebAppInterface(this), "HybridNote");
        myWebView.setWebViewClient(new WebViewClient());

        try {

            String PATH =   Environment.getExternalStorageDirectory().getAbsolutePath();
//            File file = new File(PATH, "gatewayID.txt");

//            FileInputStream fis = openFileInput(Environment.getExternalStorageDirectory().getAbsolutePath() + "/gatewayID.txt");
            FileInputStream fis = new FileInputStream(new File(PATH, "gatewayID.txt"));
            InputStreamReader isr = new InputStreamReader(fis);
            BufferedReader bufferedReader = new BufferedReader(isr);
            String line = bufferedReader.readLine().trim();
            gatewayId = line;

            String jsonString = "{phonetype:\"N95\",cat:\"WP\"}";
            JSONObject jObj = new JSONObject(jsonString);

            html += "<input id=\"gId\" type=\"hidden\" value=\""+ gatewayId + "\"/>";

            if (jObj.getString("phonetype").equals("N95")) {
                html += "<input type=\"button\" value=\"Start Setup\" onClick=\"FSCommunicator();\" />";
            } else {
                html += "<input type=\"button\" value=\"Start Setup\" onClick=\"FSCommunicator();\" />";
            }

            html += "<div id = \"sensorNames\"></div>";
            html += "<div id = \"filePath\"></div>";
            html += "</body>";
            html += "</html>";
            // myWebView.loadData(html, "text/html", "UTF-8");
            myWebView.loadDataWithBaseURL("file:///android_res/drawable/", html, "text/html", "UTF-8", null);
        }
        catch (Exception e) {
            Log.d("", e.toString());
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
}

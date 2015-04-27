package com.ias.sensorbtclient;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;

import org.json.JSONObject;


public class CommunicatorActivity extends ActionBarActivity {

    public static final int GPS_FAMILY_ID = 5;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_communicator);

        String jStr = getIntent().getStringExtra("jStr");//.replace("\"", "\\\"");
        String gatewayID = getIntent().getStringExtra("gatewayID");
        //TextView t = (TextView) findViewById(R.id.this_is_id_name);
        //t.setText(jStr);


        WebView myWebView = (WebView) findViewById(R.id.webview);
        myWebView.setClickable(true);

        WebSettings wSettings;
        wSettings = myWebView.getSettings();
        wSettings.setJavaScriptEnabled(true);

        myWebView.addJavascriptInterface(new CommandHandler(this), "CommandHandler");
        myWebView.setWebViewClient(new WebViewClient());

        try {
            //jStr = "{sensorId: 144,sensorFamilyId: 2,lat: 17.04, lon: 44.13, isHealthPing: false, sensorData: { value: 99.64, unit: '%' } }";
            JSONObject jObj = new JSONObject(jStr);
            boolean healthPing = jObj.getBoolean("isHealthPing");
            System.out.println("JSON string is: " + jStr);
            System.out.println("Health ping si: " + healthPing);

            String html = "<!DOCTYPE html>";
            html += "<head><title>Gateway Interface</title></head>";
            html += "<body onload=\"initSocket();\">";

            html += "<script src=\"socket.io.js\"></script>";
            html += "<script src=\"communicator.js\"></script>";

            html += "<input id=\"jString\" type=\"hidden\" value='" + jStr + "' />";
            html += "<input id=\"gatewayID\" type=\"hidden\" value='" + gatewayID + "' />";
            html += "<input id=\"sensorTimestamp\" type=\"hidden\" value='" + System.currentTimeMillis() + "' />";
            html += "<div id=\"jsonContainer\" style=\"width: 100%;\">";
            html += "<pre id=\"prettyJson\">"+ jStr + "</pre>";
            html += "</div>";

            html += "<div style=\"width: 100%;\">";
            if (healthPing == false) {
                html += "<input style=\"width: 200px; text-align: center; display: block; margin: 15px auto; padding: 5px;\" type=\"button\" value=\"Sending Data to Filter Server\" onClick=\"filterServerCommunicator();\" />";
            } else {
                html += "<input style=\"width: 200px; text-align: center; display: block; margin: 15px auto; padding: 5px;\" type=\"button\" value=\"Sending Data to Repo Server\" onClick=\"repoServerCommunicator();\" />";
            }
            html += "</div>";

            html += "</body>";
            html += "</html>";

            myWebView.loadDataWithBaseURL("file:///android_res/drawable/", html, "text/html", "UTF-8", null);

        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_communicator, menu);
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

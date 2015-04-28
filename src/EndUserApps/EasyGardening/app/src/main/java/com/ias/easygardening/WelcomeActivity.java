package com.ias.easygardening;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.StrictMode;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.util.TypedValue;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsoluteLayout;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.util.Iterator;


public class WelcomeActivity extends ActionBarActivity {

    TableLayout sensortable;
    public static String sensordatas;
    Handler myhandler;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_welcome);

       // if (android.os.Build.VERSION.SDK_INT > 9) {
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();

        StrictMode.setThreadPolicy(policy);
        //}

        sensortable=(TableLayout)findViewById(R.id.sensortable);
        sensortable.setVerticalScrollBarEnabled(true);

        sensordatas=this.getIntent().getExtras().get("sensordata").toString();
  //      sensordatas="{isAuthenticated : true}";

        try {
            JSONObject jsonobj = new JSONObject(sensordatas);
            Iterator<String> keys = jsonobj.keys();

            while(keys.hasNext())
            {
                String key=keys.next();
                if(key.equalsIgnoreCase("isAuthenticated"))continue;
                if(key.equalsIgnoreCase("accessKey"))continue;

                JSONObject sdata = new JSONObject(jsonobj.get(key).toString());
                String val=sdata.getString("value");
                String unit=sdata.getString("unit");

                System.out.println(sdata.toString());
                System.out.println("========================================");

                LinearLayout.LayoutParams tlp=new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
                tlp.setMargins(0, 10, 0, 0);



                TableRow row= new TableRow(this);
                TableRow.LayoutParams lp = new TableRow.LayoutParams(TableRow.LayoutParams.WRAP_CONTENT);
                lp.setMargins(0,10,10,0);

                TextView sensor=new TextView(this);

                sensor.setText(key);
                sensor.setTextSize(TypedValue.COMPLEX_UNIT_DIP,20);

                sensor.setLayoutParams(lp);

                TextView value , valunit;
                value=new TextView(this);
                valunit=new TextView(this);

                value.setTextSize(TypedValue.COMPLEX_UNIT_DIP,20);
                valunit.setTextSize(TypedValue.COMPLEX_UNIT_DIP,20);

                value.setText(val);
                valunit.setText(unit);

                value.setLayoutParams(lp);
                valunit.setLayoutParams(lp);

                TextView blank=new TextView(this);
                blank.setText("    ");

                row.addView(sensor);
                row.addView(blank);
                row.addView(value);
                row.addView(valunit);

                row.setLayoutParams(lp);

                sensortable.addView(row);

            }
        } catch (JSONException e) {
            e.printStackTrace();
        }


        Button proceed= (Button) findViewById(R.id.proceed);
        proceed.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(WelcomeActivity.this, AlertActivity.class); // Make registeractivity to rule
                startActivity(intent);
            }
        });


        Button cmd1= (Button) findViewById(R.id.cmd1);
        final String filip="http://10.42.0.35";
        final HttpClient httpclient = new DefaultHttpClient();

        cmd1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    JSONObject jsonobj = new JSONObject();
                    jsonobj.put("command", "Start AC");

                    HttpPost httppostreq = new HttpPost(filip+":3000/commands/246");
                    StringEntity se = new StringEntity(jsonobj.toString());
                    se.setContentType("application/json;charset=UTF-8");
                    se.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE,"application/json;charset=UTF-8"));
                    httppostreq.setEntity(se);
                    Log.d("request is" , "being sent");
                    HttpResponse httpresponse=null ;
                    httpresponse= httpclient.execute(httppostreq);
                    Log.d("request is" , "sent");
                    String responseText = "";

                    responseText="{\n" +
                            "\tisAuthenticated:true,\n" +
                            "\tTemperature : {\n" +
                            "\t\tvalue : 44.45,\n" +
                            "\t\tunit : 'Celsius'\n" +
                            "\t},\n" +
                            "\tHumidity : {\n" +
                            "\t\tvalue : 70.22,\n" +
                            "\t\tunit : 'Percentage'\n" +
                            "\t}\n" +
                            "}";

                    //  responseText = EntityUtils.toString(httpresponse.getEntity());
                    Log.d("Response received:" , responseText);

                    JSONObject resjsonobj = new JSONObject(responseText);

                }
                catch(Exception e){
                    e.printStackTrace();
                }
                /*Toast.makeText(getApplicationContext(), "Command sent successfully" , Toast.LENGTH_LONG);*/
            }
        });



        Button cmd2= (Button) findViewById(R.id.cmd2);
        cmd2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    JSONObject jsonobj = new JSONObject();
                    jsonobj.put("command", "OPEN THE ROOF");

                    HttpPost httppostreq = new HttpPost(filip+":3000/commands/783");
                    StringEntity se = new StringEntity(jsonobj.toString());
                    se.setContentType("application/json;charset=UTF-8");
                    se.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE,"application/json;charset=UTF-8"));
                    httppostreq.setEntity(se);
                    Log.d("request is" , "being sent");
                    HttpResponse httpresponse=null ;
                    httpresponse= httpclient.execute(httppostreq);
                    Log.d("request is" , "sent");
                    String responseText = "";

                    responseText="{\n" +
                            "\tisAuthenticated:true,\n" +
                            "\tTemperature : {\n" +
                            "\t\tvalue : 44.45,\n" +
                            "\t\tunit : 'Celsius'\n" +
                            "\t},\n" +
                            "\tHumidity : {\n" +
                            "\t\tvalue : 70.22,\n" +
                            "\t\tunit : 'Percentage'\n" +
                            "\t}\n" +
                            "}";

                    //  responseText = EntityUtils.toString(httpresponse.getEntity());
                    Log.d("Response received:" , responseText);

                    JSONObject resjsonobj = new JSONObject(responseText);

                }
                catch(Exception e){
                    e.printStackTrace();
                }
                Log.d("Command sent" , " successfully");
                Toast.makeText(WelcomeActivity.this, "Command sent successfully" , Toast.LENGTH_LONG).show();
            }
        });

        Button cmd3= (Button) findViewById(R.id.cmd3);
        cmd3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    JSONObject jsonobj = new JSONObject();
                    jsonobj.put("command", "Turn Sprinklers On");

                    HttpPost httppostreq = new HttpPost(filip+":3000/commands/394");
                    StringEntity se = new StringEntity(jsonobj.toString());
                    se.setContentType("application/json;charset=UTF-8");
                    se.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE,"application/json;charset=UTF-8"));
                    httppostreq.setEntity(se);
                    Log.d("request is" , "being sent");
                    HttpResponse httpresponse=null ;
                    httpresponse= httpclient.execute(httppostreq);
                    Log.d("request is" , "sent");
                    String responseText = "";

                    responseText="{\n" +
                            "\tisAuthenticated:true,\n" +
                            "\tTemperature : {\n" +
                            "\t\tvalue : 44.45,\n" +
                            "\t\tunit : 'Celsius'\n" +
                            "\t},\n" +
                            "\tHumidity : {\n" +
                            "\t\tvalue : 70.22,\n" +
                            "\t\tunit : 'Percentage'\n" +
                            "\t}\n" +
                            "}";

                    //  responseText = EntityUtils.toString(httpresponse.getEntity());
                    Log.d("Response received:" , responseText);

                    JSONObject resjsonobj = new JSONObject(responseText);

                }
                catch(Exception e){
                    e.printStackTrace();
                }
                Toast.makeText(getApplicationContext(), "Command sent successfully" , Toast.LENGTH_LONG).show();
            }
        });


        myhandler=new Handler();
        myhandler.post(mNotify);

    }


    private Runnable mNotify = new Runnable() {
        public void run() {

            if(true) {

                String loginURL=StartActivity.IPaddr+"/status";
                String postParameters="";

                HttpClient httpclient = new DefaultHttpClient();

                try {
                    JSONObject jsonobj = new JSONObject();
                    jsonobj.put("accessKey",StartActivity.accesskey);
                    HttpPost httppostreq = new HttpPost(loginURL);
                    StringEntity se = new StringEntity(jsonobj.toString());
                    se.setContentType("application/json;charset=UTF-8");
                    se.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE,"application/json;charset=UTF-8"));
                    httppostreq.setEntity(se);
                    Log.d("request is" , "being sent");
                    HttpResponse httpresponse=null ;
                    httpresponse= httpclient.execute(httppostreq);
                    Log.d("notify request is" , "sent");
                    String responseText = "";
                    responseText="{\n" +
                            "notification : true\n" +
                            "}";

                    HttpEntity hte = httpresponse.getEntity();
                    responseText = EntityUtils.toString(httpresponse.getEntity());
                    Log.d("Response received:" , responseText);
                    JSONObject resjsonobj = new JSONObject(responseText);

                    Log.d(" About to "," Toast Notification");
                  //  Toast.makeText(getApplicationContext(), AddRuleActivity.notifymsg , Toast.LENGTH_LONG);




                    if(resjsonobj.get("notification").toString().equalsIgnoreCase("true"))
                    {
                       // Toast.makeText(getApplicationContext() , AddRuleActivity.notifymsg , Toast.LENGTH_LONG);
                        NotificationManager NM;
                        NM=(NotificationManager)getSystemService(Context.NOTIFICATION_SERVICE);
                        Notification notify=new Notification(android.R.drawable.stat_notify_more,AddRuleActivity.notifymsg,System.currentTimeMillis());
                        PendingIntent pending=PendingIntent.getActivity(getApplicationContext(), 0, new Intent(),0);
                        notify.setLatestEventInfo(getApplicationContext(), "EasyGardening", AddRuleActivity.notifymsg,pending);
                        NM.notify(0, notify);
                    }


                }
                catch(Exception e){

                }
                myhandler.postDelayed(mNotify, 15000);
                Log.d("Main thread", "Sleeping");
            }
        }
    };


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_welcome, menu);
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

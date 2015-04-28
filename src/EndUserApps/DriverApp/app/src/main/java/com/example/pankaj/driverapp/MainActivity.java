package com.example.pankaj.driverapp;

import android.content.Intent;
import android.os.StrictMode;
import android.support.v7.app.ActionBarActivity;
import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;


public class MainActivity extends Activity {
    ImageView image;
    Button next;
    int source,r_min,r_max,next_node,direction;
    double minimum;
    String loginURL;
    double latitudes[]={38,20.5,40.12,60.2,20.5,40.3,60.6,41.1};
    double longitude[]={10.1,30.33,30.9,30.3,50.6,50.4,50.5,71.1};
    final String filip="http://10.42.0.36";
    TextView latlon;
    //public static String accesskey="0bfce6722edfdb5a97fb9f770147c9e9affff98bc6a7339d6d2d2faa5c203966a2f4919d334406cc584ec130dfbf0e65";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        StartActivity.lat=""+latitudes[0];
        StartActivity.lon=""+longitude[0];


        setContentView(R.layout.activity_main);

        latlon=(TextView)findViewById(R.id.latlon1);
        direction=0;
        image = (ImageView) findViewById(R.id.iv);
        next = (Button) findViewById(R.id.next);
        image.setImageResource(R.drawable.i0);

        latlon.setText("("+StartActivity.lat+","+StartActivity.lon+")");

        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);

        source=0;
        View.OnClickListener clicked = new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                ArrayList<Double> traffic_values = new ArrayList(7);
//                ArrayList<Integer> sensor_ids=new ArrayList(7);
                double traffic_values[]=new double[7];
                double sensor_ids[]=new double[8];
                sensor_ids[0] = 1999;
                sensor_ids[1] = 2001;
                sensor_ids[2] = 2002;
                sensor_ids[3] = 2003;
                sensor_ids[4] = 2004;
                sensor_ids[5] = 2005;
                sensor_ids[6] = 2006;
                sensor_ids[7] = 2000;


                int i,j,node=0;
                // TODO Auto-generated method stub
                if (v.getId() == R.id.next) {
                    //image.setImageResource(R.drawable.a);
                    loginURL=StartActivity.IPaddr+"/sendSensorDataToUser";
                    HttpClient httpclient = new DefaultHttpClient();
                    try {
                        JSONObject jsonobj = new JSONObject();
                        jsonobj.put("accessKey", StartActivity.accesskey);
                        jsonobj.put("lat",StartActivity.lat);
                        jsonobj.put("lon",StartActivity.lon);
                        //jsonobj.put("ids",sensor_ids);
                        HttpPost httppostreq = new HttpPost(loginURL);
                        StringEntity se = new StringEntity(jsonobj.toString());
                        se.setContentType("application/json;charset=UTF-8");
                        se.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE,"application/json;charset=UTF-8"));
                        httppostreq.setEntity(se);
                        Log.d("request is", "being sent");
                        HttpResponse httpresponse=null ;
                        httpresponse= httpclient.execute(httppostreq);
                        Log.d("request is" , "sent");
                        String responseText = "";

                    /*responseText="{\n" +
                            "\"version\": \"1.0\",\n" +
                            "\"timestamp\": \"2015-04-17T21:30:48.551Z\",\n" +
                            "\"comments\": \"Data of all the sensors requested.\",\n" +
                            "\"request\": {\n" +
                            "\"ids\": [\n" +
                            "2001,\n" +
                            "2002,\n" +
                            "2003,\n" +
                            "2004,\n" +
                            "2005,\n" +
                            "2006\n" +
                            "]\n" +
                            "},\n" +
                            "\"data\": [\n" +
                            "{\n" +
                            "\"sensorData\": {\n" +
                            "\"unit\": \"VPM\",\n" +
                            "\"value\": 25\n" +
                            "},\n" +
                            "\"lon\": 20.5,\n" +
                            "\"lat\": 30.33,\n" +
                            "\"sensorFamilyId\": 21,\n" +
                            "\"sensorId\": 2001\n" +
                            "},\n" +
                            "{\n" +
                            "\"sensorData\": {\n" +
                            "\"unit\": \"VPM\",\n" +
                            "\"value\": 30\n" +
                            "},\n" +
                            "\"lon\": 40.12,\n" +
                            "\"lat\": 30.9,\n" +
                            "\"sensorFamilyId\": 21,\n" +
                            "\"sensorId\": 2002\n" +
                            "},\n" +
                            "{\n" +
                            "\"sensorData\": {\n" +
                            "\"unit\": \"VPM\",\n" +
                            "\"value\": 10\n" +
                            "},\n" +
                            "\"lon\": 60.2,\n" +
                            "\"lat\": 30.3,\n" +
                            "\"sensorFamilyId\": 21,\n" +
                            "\"sensorId\": 2003\n" +
                            "},\n" +
                            "{\n" +
                            "\"sensorData\": {\n" +
                            "\"unit\": \"VPM\",\n" +
                            "\"value\": 10\n" +
                            "},\n" +
                            "\"lon\": 20.5,\n" +
                            "\"lat\": 50.6,\n" +
                            "\"sensorFamilyId\": 21,\n" +
                            "\"sensorId\": 2004\n" +
                            "},\n" +
                            "{\n" +
                            "\"sensorData\": {\n" +
                            "\"unit\": \"VPM\",\n" +
                            "\"value\": 30\n" +
                            "},\n" +
                            "\"lon\": 40.3,\n" +
                            "\"lat\": 50.4,\n" +
                            "\"sensorFamilyId\": 21,\n" +
                            "\"sensorId\": 2005\n" +
                            "},\n" +
                            "{\n" +
                            "\"sensorData\": {\n" +
                            "\"unit\": \"VPM\",\n" +
                            "\"value\": 50\n" +
                            "},\n" +
                            "\"lon\": 60.6,\n" +
                            "\"lat\": 50.5,\n" +
                            "\"sensorFamilyId\": 21,\n" +
                            "\"sensorId\": 2006\n" +
                            "}\n" +
                            "]\n" +
                            "}";*/

                        responseText = EntityUtils.toString(httpresponse.getEntity());
                        Log.d("Response received:" , responseText);

                        JSONObject mainobj = new JSONObject(responseText);
                        JSONArray jsonArray = new JSONArray(mainobj.get("data").toString());
                        Log.d("Array is:", jsonArray.toString());


                        for (i=0; i < jsonArray.length(); i++) {
                            jsonobj = jsonArray.getJSONObject(i);
                            double lon,lat;
                            lon= jsonobj.getDouble("lon");
                            lat= jsonobj.getDouble("lat");
                            j=find_id(lat,lon);
                            System.out.println(lat+"___"+lon);
                            System.out.println("J:"+j);
                           // traffic_values.add(j,((JSONObject) jsonobj.get("sensorData")).getDouble("value"));
                            sensor_ids[j]= jsonobj.getDouble("sensorId");
                            traffic_values[j]= ((JSONObject)jsonobj.get("sensorData")).getDouble("value");
//                                Log.d("sonsorId: ",sensor_ids.get(j).toString());
//                                Log.d("sonsorData: ",traffic_values.get(j).toString());

                        }

                        for(int jj=0;jj<6;jj++)
                            System.out.println(traffic_values[jj+1]);



                        int adj[][]={
                            {0,1,1,1,0,0,0,0},
                            {1,0,0,1,1,0,0,0},
                            {1,0,0,1,0,1,0,0},
                            {1,1,1,0,1,1,1,1},
                            {0,1,0,1,0,0,1,0},
                            {0,0,1,1,0,0,1,0},
                            {0,0,0,1,1,1,0,0},
                            {0,0,0,0,0,0,0,0}
                        };


                        if(direction==0) {
                            minimum=9999;
                            for(j=source+1 ; j<=6 ; j++)
                            {
                                if(adj[source][j]==1 && traffic_values[j]<minimum){ next_node=j; minimum=traffic_values[j];}
                            }

                            source=next_node;
                            if(source==6)
                                direction=1;
                        }
                        else
                        {
                            minimum=9999;

                            if(source>=1 && source<=3){ next_node=0; source=next_node; direction=0;}
                            else {
                                for (j = source - 1; j >= 1; j--) {
                                    if (adj[source][j] == 1 && traffic_values[j] < minimum) {
                                        next_node = j;
                                        minimum = traffic_values[j];
                                    }
                                }

                                source = next_node;
                                if (source == 0)
                                    direction = 0;
                            }
                        }




                        StartActivity.lat=""+latitudes[next_node];
                        StartActivity.lon=""+longitude[next_node];

                        latlon.setText("("+StartActivity.lat+","+StartActivity.lon+")");

                        if(source==0) {
                            image.setImageResource(R.drawable.i0);
                        }else if(source==1) {
                            image.setImageResource((R.drawable.i1));
                        }else if(source==2) {
                            image.setImageResource(R.drawable.i2);
                        }else if(source==3) {
                            image.setImageResource(R.drawable.i3);
                        }else if(source==4) {
                            image.setImageResource(R.drawable.i4);
                        }else if(source==5) {
                            image.setImageResource(R.drawable.i5);
                        }else if(source==6) {
                            image.setImageResource(R.drawable.i6);
                        }

                        jsonobj = new JSONObject();
                        jsonobj.put("command", latitudes[source]+"_"+longitude[source]);

                        httppostreq = new HttpPost(filip+":3000/commands/"+sensor_ids[source]);
//                        String jst="";
//                        for(i=0;i<=7;i++)
                           // Log.d("sonsorData: ",""+sensor_ids[i]+"");

                        se = new StringEntity(jsonobj.toString());
                        se.setContentType("application/json;charset=UTF-8");
                        se.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE,"application/json;charset=UTF-8"));
                        httppostreq.setEntity(se);
                        Log.d("request is" , "being sent");
                    //    httpresponse= httpclient.execute(httppostreq);
                        Log.d("request is" , "sent");
                        responseText = "";
                     //   responseText = EntityUtils.toString(httpresponse.getEntity());
                        Log.d("Response received:" , responseText);

                    }
                    catch(Exception e){
                        e.printStackTrace();
                    }
                }
            }
        };
        findViewById(R.id.next).setOnClickListener(clicked);
    }
    public int find_id(double latitude,double longitude)
    {
        int i=1;
        System.out.println(latitude+" "+longitude);
        if(latitude==20.5 && longitude==30.33)
            i=1;
        else if(latitude==40.12 && longitude==30.9)
            i=2;
        else if(latitude==60.2 && longitude==30.3)
            i=3;
        else if(latitude==20.5 && longitude==50.6)
            i=4;
        else if(latitude==40.3 && longitude==50.4)
            i=5;
        else
            i=6;
        return i;
    }
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

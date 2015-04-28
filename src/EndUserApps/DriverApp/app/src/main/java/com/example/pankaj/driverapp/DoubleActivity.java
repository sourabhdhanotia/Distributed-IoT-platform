package com.example.pankaj.driverapp;

import android.os.StrictMode;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

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


public class DoubleActivity extends ActionBarActivity implements View.OnClickListener {

    Button a1, a2;
    ImageView image;
    TextView latlon;
    Button next;
    int source[],r_min,r_max,next_node[],direction[]={0,0};
    double minimum;
    String loginURL;
    double latt[],lonn[];
    double latitudes[]={38,20.5,40.12,60.2,20.5,40.3,60.6,41.1};
    double longitude[]={10.1,30.33,30.9,30.3,50.6,50.4,50.5,71.1};
    final String filip="http://10.42.0.36";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_double);

        a1 = (Button) findViewById(R.id.next1);
        a2 = (Button) findViewById(R.id.next2);
        latlon=(TextView)findViewById(R.id.latlon_d);

        a1.setOnClickListener(this);
        a2.setOnClickListener(this);
        image = (ImageView) findViewById(R.id.iv);
        image.setImageResource(R.drawable.i00);
        next_node=new int[2];
        source=new int[2];
        latt=new double[2];
        lonn=new double[2];
        latt[0]=latt[1]=latitudes[0];
        lonn[0]=lonn[1]=longitude[1];

        latlon.setText("("+latt[0]+","+lonn[0]+"),"+"("+latt[1]+","+lonn[1]+")");

        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);

    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_double, menu);
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
    public void onClick(View arg0) {

        int vehicle=0;

        if (arg0.getId() == R.id.next1) vehicle = 0;
        if (arg0.getId() == R.id.next2) vehicle = 1;

        double traffic_values[] = new double[7];
        double sensor_ids[] = new double[8];
        sensor_ids[0] = 1999;
        sensor_ids[1] = 2001;
        sensor_ids[2] = 2002;
        sensor_ids[3] = 2003;
        sensor_ids[4] = 2004;
        sensor_ids[5] = 2005;
        sensor_ids[6] = 2006;
        sensor_ids[7] = 2000;


        int i, j, node = 0;

        String loginURL = StartActivity.IPaddr + "/sendSensorDataToUser";
        HttpClient httpclient = new DefaultHttpClient();
        try {
            JSONObject jsonobj = new JSONObject();
            jsonobj.put("accessKey", StartActivity.accesskey);
            jsonobj.put("lat", latt[vehicle]);
            jsonobj.put("lon", lonn[vehicle]);
            //jsonobj.put("ids",sensor_ids);
            HttpPost httppostreq = new HttpPost(loginURL);
            StringEntity se = new StringEntity(jsonobj.toString());
            se.setContentType("application/json;charset=UTF-8");
            se.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE, "application/json;charset=UTF-8"));
            httppostreq.setEntity(se);
            Log.d("request is", "being sent");
            HttpResponse httpresponse = null;
            httpresponse = httpclient.execute(httppostreq);
            Log.d("request is", "sent");
            String responseText = "";

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
                    {1,0,0,0,1,1,1,0},
                    {1,0,0,0,1,1,1,0},
                    {1,0,0,0,1,1,1,0},
                    {0,1,1,1,0,0,0,1},
                    {0,1,1,1,0,0,0,1},
                    {0,1,1,1,0,0,0,1},
                    {0,0,0,0,1,1,1,0}
            };


            if(direction[vehicle]==0) {

                if(source[vehicle]>=4 && source[vehicle]<=6)next_node[vehicle]=7;
                else {
                    minimum = 9999;
                    for (j = source[vehicle] + 1; j <= 7; j++) {
                        if (adj[source[vehicle]][j] == 1 && traffic_values[j] < minimum) {
                            next_node[vehicle] = j;
                            minimum = traffic_values[j];
                        }
                    }
                }
                source[vehicle]=next_node[vehicle];
                if(source[vehicle]==7)
                    direction[vehicle]=1;
            }
            else if(direction[vehicle]==1)
            {
                minimum=9999;

                if(source[vehicle]>=1 && source[vehicle]<=3){ next_node[vehicle]=0; source[vehicle]=next_node[vehicle]; direction[vehicle]=0;}
                else {
                    for (j = source[vehicle] - 1; j >= 1; j--) {
                        if (adj[source[vehicle]][j] == 1 && traffic_values[j] < minimum) {
                            next_node[vehicle] = j;
                            minimum = traffic_values[j];
                        }
                    }

                    source[vehicle] = next_node[vehicle];
                    if (source[vehicle] == 0)
                        direction[vehicle] = 0;
                }
            }


            latt[vehicle]=latitudes[next_node[vehicle]];
            lonn[vehicle]=longitude[next_node[vehicle]];

            latlon.setText("("+latt[0]+","+lonn[0]+"),"+"("+latt[1]+","+lonn[1]+")");

            /*image.setImageResource(R.drawable.i0);

            if(source[vehicle]==0) {
                image.setImageResource(R.drawable.i0);
            }else if(source[vehicle]==1) {
                image.setImageResource((R.drawable.i1));
            }else if(source[vehicle]==2) {
                image.setImageResource(R.drawable.i2);
            }else if(source[vehicle]==3) {
                image.setImageResource(R.drawable.i3);
            }else if(source[vehicle]==4) {
                image.setImageResource(R.drawable.i4);
            }else if(source[vehicle]==5) {
                image.setImageResource(R.drawable.i5);
            }else if(source[vehicle]==6) {
                image.setImageResource(R.drawable.i6);
            }
            */

            String image_name="i"+source[0]+""+source[1];
            int resID = getResources().getIdentifier(image_name ,"drawable",getApplicationContext().getPackageName());
            // System.out.println(in+"hi there "+R.drawable.i10+" "+resID);
            image.setImageResource(resID );




        } catch (Exception e) {

        }

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
}

package com.ias.easygardening;

import android.app.Activity;
import android.content.Intent;
import android.os.StrictMode;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.HTTP;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Random;


public class AddRuleActivity extends Activity {
    Spinner spinnerOsversions1,spinnerOsversions2,spinnerOsversions3;
    ArrayList<Integer> type = new ArrayList<Integer>(3);
    ArrayList<String> opr = new ArrayList<String>(3);
    ArrayList<String> value = new ArrayList<String>(3);

    private String[] oprSet= {"<",">","<=",">=","=="};
    JSONArray sType = new JSONArray();
    JSONArray oprtr = new JSONArray();
    JSONArray valarr;
    public static String notifymsg="This is a notification";

    int check1,check2,check3;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_rule);
        Button createRule = (Button) findViewById(R.id.create);
        check1=check2=check3=0;
        sType = new JSONArray();
        oprtr = new JSONArray();
        valarr = new JSONArray();
        spinnerOsversions1 = (Spinner) findViewById(R.id.tempOp);
        spinnerOsversions2 = (Spinner) findViewById(R.id.humOp);
        spinnerOsversions3 = (Spinner) findViewById(R.id.moistOp);


        if (android.os.Build.VERSION.SDK_INT > 9) {
            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
            StrictMode.setThreadPolicy(policy);
        }

        createRule.setOnClickListener(new Button.OnClickListener() {
            public void onClick(View v) {
                /*Intent intent = new Intent(AddRuleActivity.this, AlertActivity.class);
                startActivity(intent);*/
                if (((CheckBox) findViewById(R.id.tempCheck)).isChecked()) {
                    type.add(1);
                    value.add(((EditText) findViewById(R.id.tempValue)).getText().toString());
                    opr.add(spinnerOsversions1.getSelectedItem().toString()); //spinnerOsversions.getSelectedItem().toString()
                    Toast.makeText(getBaseContext(), "Temp: "+value.get(0),
                            Toast.LENGTH_SHORT).show();
                    sType.put("Temperature");
                    //oprtr.put(opr.get(0));
                    valarr.put(((EditText) findViewById(R.id.tempValue)).getText().toString());
                    oprtr.put(spinnerOsversions1.getSelectedItem().toString());
                }
                if (((CheckBox) findViewById(R.id.humidityCheck)).isChecked()) {
                    type.add(2);
                    value.add(((EditText)findViewById(R.id.humidityValue)).getText().toString());
                    opr.add(spinnerOsversions2.getSelectedItem().toString());
                    sType.put("Humidity");
                    valarr.put(((EditText) findViewById(R.id.humidityValue)).getText().toString());
                    oprtr.put(spinnerOsversions2.getSelectedItem().toString());
                 //   Toast.makeText(getBaseContext(), "Humidity: "+value.get(1),Toast.LENGTH_SHORT).show();
                }
                if (((CheckBox) findViewById(R.id.moistCheck)).isChecked()) {
                    type.add(1);
                    value.add(((EditText)findViewById(R.id.moistValue)).getText().toString());
                    opr.add(spinnerOsversions3.getSelectedItem().toString());
                    sType.put("Moisture");
                    oprtr.put(spinnerOsversions3.getSelectedItem().toString());
                    valarr.put(((EditText)findViewById(R.id.moistValue)).getText().toString());
                    //Toast.makeText(getBaseContext(), "Moisture: "+value.get(2),Toast.LENGTH_SHORT).show();
                }

                notifymsg = ((EditText) findViewById(R.id.notificationMsg)).getText().toString();


                String loginURL=StartActivity.IPaddr+"/getRulesFromUser";

                HttpClient httpclient = new DefaultHttpClient();

                try {
                    JSONObject jsonobj = new JSONObject();
                    jsonobj.put("sensorType", sType);
                    jsonobj.put("operators", oprtr);
                    jsonobj.put("values", valarr);

                    HttpPost httppostreq = new HttpPost(loginURL);
                    StringEntity se = new StringEntity(jsonobj.toString());
                    se.setContentType("application/json;charset=UTF-8");
                    se.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE,"application/json;charset=UTF-8"));
                    httppostreq.setEntity(se);
                    Log.d("Adding a ", "Rule");
                    HttpResponse httpresponse=null ;
                    httpresponse= httpclient.execute(httppostreq);
                    Log.d("Rule is " , "Added");
                    String responseText = "";
                    int v1,v2,v3;
                    v1=randInt(10,100);
                    v2=randInt(10,100);
                    v3=randInt(10,100);

                 /*   responseText="{  \n" +
                            "\tsensorType : ['Humidity', 'Temperature', 'Moisture' ]\n" +
                            "\toperator : [ '<', '>', '=' ]\n" +
                            "\tvalue : [ "+v1+", "+v2+", "+v3+" ]\n" +
                            "\t\n" +
                            "\t\n" +
                            "}";*/

                    responseText="Condition Successfully Registered";
                    Toast.makeText(AddRuleActivity.this , responseText , Toast.LENGTH_SHORT);

                    //  responseText = EntityUtils.toString(httpresponse.getEntity());
                    Log.d("Response received:" , responseText);

        //            JSONObject resjsonobj = new JSONObject(responseText);

                }
                catch(Exception e){
                    e.printStackTrace();
                }

                Toast.makeText(getApplicationContext(),WelcomeActivity.sensordatas , Toast.LENGTH_LONG).show();
                Intent intent = new Intent(AddRuleActivity.this, WelcomeActivity.class);
                intent.putExtra("sensordata",WelcomeActivity.sensordatas);
                startActivity(intent);
            }
        });


/*
        spinnerOsversions1.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            public void onItemSelected(AdapterView<?> arg0, View arg1, int arg2, long arg3) {

                if(check1>0) {
                    Toast.makeText(getApplicationContext(),spinnerOsversions1.getSelectedItem().toString() , Toast.LENGTH_SHORT).show();
                    opr.add(0, spinnerOsversions1.getSelectedItem().toString());//spinnerOsversions.getSelectedItem().toString()
                }
                check1++;
            }

            public void onNothingSelected(AdapterView<?> arg0) {}
        });*/
/*
        spinnerOsversions2 = (Spinner) findViewById(R.id.humOp);
        spinnerOsversions2.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            public void onItemSelected(AdapterView<?> arg0, View arg1, int arg2, long arg3) {

                //if(check2>0)
                //opr.add(1, spinnerOsversions2.getSelectedItem().toString()); //spinnerOsversions.getSelectedItem().toString()
                check2++;
            }

            public void onNothingSelected(AdapterView<?> arg0) {}
        });*/

        /* spinnerOsversions3 = (Spinner) findViewById(R.id.moistOp);
        spinnerOsversions3.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            public void onItemSelected(AdapterView<?> arg0, View arg1, int arg2, long arg3) {

                if(check3>0)
                opr.add(2, spinnerOsversions3.getSelectedItem().toString());//

                check3++;
            }

            public void onNothingSelected(AdapterView<?> arg0) {}
        });*/

    }
        /*spinnerOsversions = (Spinner) f
        indViewById(R.id.tempCheck);
        ArrayAdapter<String> adapter_state = new ArrayAdapter<String>(this,
                android.R.layout.activity_list_item, oprSet);
        adapter_state.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerOsversions.setAdapter(adapter_state);
        spinnerOsversions.setOnItemSelectedListener(this);*/


    /*public void onItemSelected(AdapterView<?> parent, View view, int position,
                               long id) {
        spinnerOsversions.setSelection(position);
        String opr = (String) spinnerOsversions.getSelectedItem();
        rule.append(opr+" ");
    }*/


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
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_add_rule, menu);
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

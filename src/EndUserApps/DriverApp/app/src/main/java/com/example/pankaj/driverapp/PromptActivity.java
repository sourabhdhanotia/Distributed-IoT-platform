package com.example.pankaj.driverapp;

import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;


public class PromptActivity extends ActionBarActivity implements View.OnClickListener {

    Button single,two;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_prompt);

        single = (Button)findViewById(R.id.single);
        two = (Button)findViewById(R.id.two);

        single.setOnClickListener(this);
        two.setOnClickListener(this);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_prompt, menu);
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
        Intent intent=null;
        if (arg0.getId() == R.id.single) intent = new Intent(this, MainActivity.class);
        if (arg0.getId() == R.id.two) intent = new Intent(this, DoubleActivity.class);

        startActivity(intent);

    }

 }

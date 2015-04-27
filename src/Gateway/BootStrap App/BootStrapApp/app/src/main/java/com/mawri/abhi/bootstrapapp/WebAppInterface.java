package com.mawri.abhi.bootstrapapp;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.CharsetDecoder;
import java.nio.charset.CharsetEncoder;

/**
 * Created by abhi on 9/4/15.
 */
public class WebAppInterface {
    Context mContext;

    /** Instantiate the interface and set the context */
    WebAppInterface(Context c) {
        mContext = c;
    }


    public static Charset charset = Charset.forName("UTF-8");
    public static CharsetEncoder encoder = charset.newEncoder();
    public static CharsetDecoder decoder = charset.newDecoder();
    /** Show a toast from the web page */
    @JavascriptInterface
    public void showToast(String toast)
    {
        Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
    }

    @JavascriptInterface
    public void getApk (String fileName)
    {
        try
        {
            String PATH =   Environment.getExternalStorageDirectory().toString();
//            File root = Environment.getExternalStorageDirectory() + "/download";
            URL u = new URL("http://10.42.0.1:3000");
            HttpURLConnection c = (HttpURLConnection) u.openConnection();
            c.connect();

            int lengthOfFile = c.getContentLength();

            File file = new File(PATH);
            file.mkdirs();
            File outputFile = new File(file, fileName);

            FileOutputStream fos = new FileOutputStream(outputFile);
            InputStream is = c.getInputStream();
//            Log.d("", "line 80");

            byte[] buffer = new byte[1024];
            int len1 = 0;
            while ((len1 = is.read(buffer)) > 0) {
                fos.write(buffer, 0, len1);
            }
            fos.close();
            is.close();

            Intent intent = new Intent(Intent.ACTION_VIEW);
            Uri uri = Uri.fromFile(new File(PATH + "/" + fileName));
            intent.setDataAndType(uri, "application/vnd.android.package-archive");
            mContext.startActivity(intent);

        }
        catch (Exception e)
        {
            Log.d("In exception Downloader", e.getMessage());
            Log.d ("Download exception", e.toString());
        }
    }

}

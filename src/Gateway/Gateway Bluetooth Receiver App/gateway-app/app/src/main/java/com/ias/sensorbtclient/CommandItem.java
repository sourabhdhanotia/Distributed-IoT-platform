package com.ias.sensorbtclient;

/**
 * Created by atul on 4/14/15.
 */
public class CommandItem {
    private int sensorID;
    private int gatewayID;
    private String command;

    public CommandItem(int sid, int gid, String c) {
        this.sensorID = sid;
        this.gatewayID = gid;
        this.command = c;
    }

    public int getSensorID() {
        return this.sensorID;
    }

    public int getGatewayID() {
        return this.gatewayID;
    }

    public String getCommand() {
        return this.command;
    }
}

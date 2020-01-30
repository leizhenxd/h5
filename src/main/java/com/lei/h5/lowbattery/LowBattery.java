package com.lei.h5.lowbattery;
import com.sun.jna.Library;
import com.sun.jna.Native;


public interface LowBattery extends Library {
	String getBasePath();
	void setBasePath(String path);
	float processScreenShot(String inpath, String outpath, int num);
	LowBattery instance = (LowBattery) Native.loadLibrary("LowBattery", LowBattery.class);
}

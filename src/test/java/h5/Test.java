package h5;

import com.sun.jna.Library;
import com.sun.jna.Native;

public class Test {

	public static void main(String[] args) {
		System.out.println(LowBattery.instance.getBasePath());
	}
	
	public interface LowBattery extends Library {
		String getBasePath();
		LowBattery instance = (LowBattery) Native.loadLibrary("LowBattery", LowBattery.class);
	}
}

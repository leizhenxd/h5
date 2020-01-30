package com.lei.h5.listener;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

/**
 * Application Lifecycle Listener implementation class SessionListener
 *
 */
public class SessionListener implements HttpSessionListener {
	
	public static Map<String, Long> sessions = new HashMap<String, Long>();

    /**
     * Default constructor. 
     */
    public SessionListener() {
        // TODO Auto-generated constructor stub
    }

	/**
     * @see HttpSessionListener#sessionCreated(HttpSessionEvent)
     */
    public void sessionCreated(HttpSessionEvent arg0)  { 
         String sessionId = arg0.getSession().getId();
         sessions.put(sessionId, System.currentTimeMillis());
         System.out.println("session in:" + sessionId);
    }

	/**
     * @see HttpSessionListener#sessionDestroyed(HttpSessionEvent)
     */
    public void sessionDestroyed(HttpSessionEvent arg0)  { 
    	String sessionId = arg0.getSession().getId();
    	sessions.remove(sessionId);
    	System.out.println("session out:" + sessionId);
    }
	
    
}

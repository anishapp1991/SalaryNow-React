package com.kksv.salarynow

import android.os.Process
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AppExitModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AppExit"
    }

    @ReactMethod
    fun exitApp() {
    val activity = currentActivity
    if (activity != null && !activity.isFinishing) {
        activity.finishAffinity()
    } else {
        // DO NOTHING if app is in background or activity is null
        android.util.Log.w("AppExit", "Cannot exit: activity is null or not in foreground")
    }
    }
}
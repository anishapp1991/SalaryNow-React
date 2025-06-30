package com.kksv.salarynow

import android.provider.Settings
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class DeveloperOptionsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "DeveloperOptions"
    }

    @ReactMethod
    fun isDeveloperOptionsEnabled(promise: Promise) {
        try {
            // Check if Developer Options are enabled
            val developerOptionsEnabled = Settings.Global.getInt(
                reactApplicationContext.contentResolver,
                Settings.Global.DEVELOPMENT_SETTINGS_ENABLED,
                0
            )
            promise.resolve(developerOptionsEnabled == 1) // Return true if Developer Options is enabled
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to check Developer Options", e)
        }
    }
}

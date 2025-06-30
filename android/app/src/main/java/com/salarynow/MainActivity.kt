package com.kksv.salarynow

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
// Import Flipper dependencies if they're included
// import com.facebook.flipper.ReactNativeFlipper

class MainActivity : ReactActivity() {

    override fun getMainComponentName(): String = "SalaryNow"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    // Uncomment the following if you need to enable Flipper for debugging
    /*
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        initializeFlipper(this, getReactNativeHost().getReactInstanceManager())
    }
    */
}

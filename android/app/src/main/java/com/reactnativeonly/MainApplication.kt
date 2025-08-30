package com.reactnativeonly

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost

class MainApplication : Application(), ReactApplication {

    // Defines the React Native host for the app
    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {
            // Returns the list of React Native packages used by the app
            override fun getPackages(): List<ReactPackage> {
                val packages = PackageList(this@MainApplication).packages
                packages.add(MyMathPackage()) // Adds your custom native module package
                return packages
            }

            // Specifies the main JS module name (entry point)
            override fun getJSMainModuleName(): String = "index"

            // Enables developer support (e.g., debug menu) if in debug build
            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

            // Indicates if the new architecture is enabled (for advanced RN features)
            override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED

            // Indicates if Hermes JS engine is enabled
            override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
        }

    // Provides the ReactHost instance for the app
    override val reactHost: ReactHost
        get() = getDefaultReactHost(applicationContext, reactNativeHost)

    // Called when the application is created
    override fun onCreate() {
        super.onCreate()
        loadReactNative(this)
    }
}

package com.reactnativeonly

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Callback
import com.facebook.react.modules.core.DeviceEventManagerModule

class MyMathModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val reactContext: ReactApplicationContext = reactContext

    override fun getName(): String {
        return "MyMath" // This is the name used in JS
    }

    // Exposed method using Promise
    @ReactMethod
    fun add(a: Int, b: Int, promise: Promise) {
        val result = a + b
        promise.resolve(result) // Send back result to JS
    }

    // Exposed method using Callback
    @ReactMethod
    fun addCallback(a: Int, b: Int, callback: Callback) {
        val result = a + b
        callback.invoke(result) // Send back result to JS via callback
    }

    // Exposed method using Event
    @ReactMethod
    fun addEvents(a: Int, b: Int) {
        val result = a + b
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("AddResultEvent", result) // Emit event with result
    }
}
package com.craftlanee.admin.core.security

import android.content.Context
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricManager.Authenticators.BIOMETRIC_STRONG
import androidx.biometric.BiometricManager.Authenticators.DEVICE_CREDENTIAL
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class BiometricLockManager(
    private val context: Context,
    private val sessionManager: SessionManager
) {

    private val _promptState = MutableStateFlow<BiometricResult>(BiometricResult.Idle)
    val promptState: StateFlow<BiometricResult> = _promptState.asStateFlow()

    fun canAuthenticate(): Boolean {
        val biometricManager = BiometricManager.from(context)
        val authenticators = BIOMETRIC_STRONG or DEVICE_CREDENTIAL
        return biometricManager.canAuthenticate(authenticators) == BiometricManager.BIOMETRIC_SUCCESS
    }

    fun promptBiometric(
        activity: FragmentActivity,
        title: String = "Admin Biometric Authentication",
        subtitle: String = "Unlock CraftLanee Control Room",
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        if (!canAuthenticate()) {
            _promptState.value = BiometricResult.Error("Biometrics unavailable or not enrolled")
            onError("Biometrics unavailable or not enrolled on this device")
            return
        }

        val executor = ContextCompat.getMainExecutor(activity)

        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle(title)
            .setSubtitle(subtitle)
            .setAllowedAuthenticators(BIOMETRIC_STRONG or DEVICE_CREDENTIAL)
            .build()

        val biometricPrompt = BiometricPrompt(
            activity,
            executor,
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    super.onAuthenticationSucceeded(result)
                    sessionManager.unlockApp()
                    _promptState.value = BiometricResult.Success
                    onSuccess()
                }

                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    super.onAuthenticationError(errorCode, errString)
                    _promptState.value = BiometricResult.Error(errString.toString())
                    onError(errString.toString())
                }

                override fun onAuthenticationFailed() {
                    super.onAuthenticationFailed()
                    _promptState.value = BiometricResult.Failed
                }
            }
        )

        biometricPrompt.authenticate(promptInfo)
    }

    sealed interface BiometricResult {
        object Idle : BiometricResult
        object Success : BiometricResult
        object Failed : BiometricResult
        data class Error(val message: String) : BiometricResult
    }
}

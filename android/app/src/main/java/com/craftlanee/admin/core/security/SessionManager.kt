package com.craftlanee.admin.core.security

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.craftlanee.admin.BuildConfig
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.io.File

class SessionManager(context: Context) {

    private fun createEncryptedPrefs(ctx: Context): SharedPreferences {
        val masterKey = MasterKey.Builder(ctx)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()

        return EncryptedSharedPreferences.create(
            ctx,
            PREFS_FILE_NAME,
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )
    }

    private val prefs: SharedPreferences = try {
        createEncryptedPrefs(context)
    } catch (e: Exception) {
        // Handle KeyStore corruption or Android 12+ Cloud Backup key mismatch
        try {
            val prefsFile = File(context.filesDir.parent, "shared_prefs/$PREFS_FILE_NAME.xml")
            if (prefsFile.exists()) {
                prefsFile.delete()
            }
            createEncryptedPrefs(context)
        } catch (_: Exception) {
            context.getSharedPreferences(PREFS_FILE_NAME, Context.MODE_PRIVATE)
        }
    }

    private val _isAuthenticated = MutableStateFlow(hasValidSession())
    val isAuthenticated: StateFlow<Boolean> = _isAuthenticated.asStateFlow()

    private val _isBiometricLocked = MutableStateFlow(false)
    val isBiometricLocked: StateFlow<Boolean> = _isBiometricLocked.asStateFlow()

    fun getAuthToken(): String? {
        val token = prefs.getString(KEY_AUTH_TOKEN, null) ?: return null
        val expiresAt = prefs.getLong(KEY_EXPIRES_AT, 0L)
        val nowSeconds = System.currentTimeMillis() / 1000L
        if (expiresAt in 1 until nowSeconds) {
            clearSession()
            return null
        }
        return token
    }

    fun hasValidSession(): Boolean {
        return getAuthToken() != null
    }

    fun saveSession(token: String, expiresAt: Long) {
        prefs.edit()
            .putString(KEY_AUTH_TOKEN, token)
            .putLong(KEY_EXPIRES_AT, expiresAt)
            .commit()
        _isAuthenticated.value = true
    }

    fun clearSession() {
        prefs.edit()
            .remove(KEY_AUTH_TOKEN)
            .remove(KEY_EXPIRES_AT)
            .commit()
        _isAuthenticated.value = false
        _isBiometricLocked.value = false
    }

    fun getBaseUrl(): String {
        return prefs.getString(KEY_BASE_URL, BuildConfig.DEFAULT_BASE_URL)
            ?: BuildConfig.DEFAULT_BASE_URL
    }

    fun setBaseUrl(url: String) {
        var formatted = url.trim()
        if (formatted.isNotBlank()) {
            if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
                formatted = "https://$formatted"
            }
            if (!formatted.endsWith("/")) {
                formatted = "$formatted/"
            }
            prefs.edit().putString(KEY_BASE_URL, formatted).apply()
        }
    }

    fun isBiometricEnabled(): Boolean {
        return prefs.getBoolean(KEY_BIOMETRIC_ENABLED, true)
    }

    fun setBiometricEnabled(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_BIOMETRIC_ENABLED, enabled).apply()
    }

    fun lockApp() {
        if (hasValidSession() && isBiometricEnabled()) {
            _isBiometricLocked.value = true
        }
    }

    fun unlockApp() {
        _isBiometricLocked.value = false
    }

    companion object {
        private const val PREFS_FILE_NAME = "craftlanee_secure_prefs"
        private const val KEY_AUTH_TOKEN = "key_auth_token"
        private const val KEY_EXPIRES_AT = "key_expires_at"
        private const val KEY_BASE_URL = "key_base_url"
        private const val KEY_BIOMETRIC_ENABLED = "key_biometric_enabled"

        @Volatile
        private var instance: SessionManager? = null

        fun getInstance(context: Context): SessionManager {
            return instance ?: synchronized(this) {
                instance ?: SessionManager(context.applicationContext).also { instance = it }
            }
        }
    }
}

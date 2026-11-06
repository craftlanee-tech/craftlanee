package com.craftlanee.admin.data.repository

import com.craftlanee.admin.core.network.AdminApiService
import com.craftlanee.admin.core.security.SessionManager
import com.craftlanee.admin.data.model.LoginRequest
import com.craftlanee.admin.data.model.LoginResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class AuthRepository(
    private val apiService: AdminApiService,
    private val sessionManager: SessionManager
) {

    suspend fun login(password: String): Result<LoginResponse> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.login(LoginRequest(password))
            if (response.isSuccessful && response.body() != null) {
                val body = response.body()!!
                if (body.success && body.token != null) {
                    sessionManager.saveSession(body.token, body.expiresAt)
                    sessionManager.unlockApp()
                    Result.success(body)
                } else {
                    Result.failure(Exception(body.error ?: "Authentication failed"))
                }
            } else {
                val errorMsg = if (response.code() == 401) {
                    "That password didn’t match. Try again."
                } else {
                    "Server error (${response.code()})"
                }
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun logout(): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            apiService.logout()
        } catch (_: Exception) {
            // Ignore network failures on logout
        } finally {
            sessionManager.clearSession()
        }
        Result.success(Unit)
    }

    fun hasValidSession(): Boolean = sessionManager.hasValidSession()
}

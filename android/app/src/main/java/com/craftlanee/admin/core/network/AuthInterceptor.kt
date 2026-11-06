package com.craftlanee.admin.core.network

import com.craftlanee.admin.core.security.SessionManager
import okhttp3.Interceptor
import okhttp3.Response

class AuthInterceptor(private val sessionManager: SessionManager) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()
        val requestBuilder = originalRequest.newBuilder()
            .header("Accept", "application/json")
            .header("User-Agent", "CraftLanee-Android-Admin/1.0")

        val token = sessionManager.getAuthToken()
        if (!token.isNullOrBlank()) {
            // Supply both Cookie (checked by proxy.ts) and Authorization Bearer header
            requestBuilder.header("Cookie", "craftlanee_admin=$token")
            requestBuilder.header("Authorization", "Bearer $token")
        }

        val response = chain.proceed(requestBuilder.build())
        if (response.code in listOf(302, 303, 307, 308)) {
            val location = response.header("Location").orEmpty()
            if (location.contains("login")) {
                sessionManager.clearSession()
            }
        } else if (response.code == 401) {
            sessionManager.clearSession()
        }

        return response
    }
}

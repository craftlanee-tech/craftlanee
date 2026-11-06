package com.craftlanee.admin.core.network

import com.craftlanee.admin.core.security.SessionManager
import okhttp3.Authenticator
import okhttp3.Request
import okhttp3.Response
import okhttp3.Route

class TokenAuthenticator(
    private val sessionManager: SessionManager
) : Authenticator {

    override fun authenticate(route: Route?, response: Response): Request? {
        // If 401 Unauthorized occurs and session is active, token is invalid or expired
        if (response.code == 401) {
            sessionManager.clearSession()
        }
        return null // No automatic retry without re-authenticating
    }
}

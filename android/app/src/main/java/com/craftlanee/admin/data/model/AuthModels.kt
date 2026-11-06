package com.craftlanee.admin.data.model

import kotlinx.serialization.Serializable

@Serializable
data class LoginRequest(
    val password: String
)

@Serializable
data class LoginResponse(
    val success: Boolean = false,
    val token: String? = null,
    val expiresAt: Long = 0,
    val ttlSeconds: Long = 0,
    val error: String? = null
)

@Serializable
data class GenericResponse(
    val success: Boolean = false,
    val message: String? = null,
    val error: String? = null
)

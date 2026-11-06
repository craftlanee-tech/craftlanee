package com.craftlanee.admin.ui.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.craftlanee.admin.core.security.SessionManager
import com.craftlanee.admin.data.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class LoginUiState(
    val password: String = "",
    val isLoading: Boolean = false,
    val error: String? = null,
    val isSuccess: Boolean = false,
    val serverUrl: String = "",
    val isSettingsDialogOpen: Boolean = false
)

class LoginViewModel(
    private val authRepository: AuthRepository,
    private val sessionManager: SessionManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(
        LoginUiState(serverUrl = sessionManager.getBaseUrl())
    )
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    fun onPasswordChanged(password: String) {
        _uiState.update { it.copy(password = password, error = null) }
    }

    fun openSettingsDialog() {
        _uiState.update { it.copy(isSettingsDialogOpen = true, serverUrl = sessionManager.getBaseUrl()) }
    }

    fun closeSettingsDialog() {
        _uiState.update { it.copy(isSettingsDialogOpen = false) }
    }

    fun onServerUrlChanged(url: String) {
        _uiState.update { it.copy(serverUrl = url) }
    }

    fun saveServerUrl() {
        val url = _uiState.value.serverUrl.trim()
        if (url.isNotBlank()) {
            sessionManager.setBaseUrl(url)
            closeSettingsDialog()
        }
    }

    fun login() {
        val password = _uiState.value.password.trim()
        if (password.isEmpty()) {
            _uiState.update { it.copy(error = "Please enter the admin password") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val result = authRepository.login(password)
            result.fold(
                onSuccess = {
                    _uiState.update { it.copy(isLoading = false, isSuccess = true) }
                },
                onFailure = { error ->
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            error = error.localizedMessage ?: "Sign in failed. Check password and network."
                        )
                    }
                }
            )
        }
    }
}

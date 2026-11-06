package com.craftlanee.admin.ui.overview

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.craftlanee.admin.data.model.OverviewResponse
import com.craftlanee.admin.data.repository.OverviewRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class OverviewUiState(
    val overview: OverviewResponse? = null,
    val isRefreshing: Boolean = false,
    val error: String? = null
)

class OverviewViewModel(
    private val overviewRepository: OverviewRepository
) : ViewModel() {

    private val _isRefreshing = MutableStateFlow(false)
    private val _error = MutableStateFlow<String?>(null)

    val uiState: StateFlow<OverviewUiState> = combine(
        overviewRepository.cachedOverviewFlow,
        _isRefreshing,
        _error
    ) { cached, refreshing, err ->
        OverviewUiState(
            overview = cached,
            isRefreshing = refreshing,
            error = err
        )
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        OverviewUiState(isRefreshing = true)
    )

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            _isRefreshing.value = true
            _error.value = null
            overviewRepository.refreshOverview().fold(
                onSuccess = {
                    _isRefreshing.value = false
                },
                onFailure = { ex ->
                    _isRefreshing.value = false
                    _error.value = ex.localizedMessage ?: "Failed to refresh dashboard data"
                }
            )
        }
    }

    fun clearError() {
        _error.value = null
    }
}

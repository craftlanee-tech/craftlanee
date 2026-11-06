package com.craftlanee.admin.ui.submissions

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.craftlanee.admin.core.export.ExportManager
import com.craftlanee.admin.data.model.Submission
import com.craftlanee.admin.data.model.SubmissionCounts
import com.craftlanee.admin.data.model.SubmissionPatch
import com.craftlanee.admin.data.repository.SubmissionRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class SubmissionsUiState(
    val kind: String = "contact", // "contact" | "internship"
    val viewMode: String = "list", // "list" | "board"
    val filter: String = "active", // "active" | "new" | "progress" | "done" | "starred" | "archived"
    val query: String = "",
    val facet: String = "",
    val facets: List<String> = emptyList(),
    val counts: SubmissionCounts = SubmissionCounts(),
    val items: List<Submission> = emptyList(),
    val selectedSubmission: Submission? = null,
    val isRefreshing: Boolean = false,
    val error: String? = null,
    val toastMessage: String? = null,
    val notesSaveState: String = "idle" // "idle" | "saving" | "saved"
)

class SubmissionsViewModel(
    private val submissionRepository: SubmissionRepository,
    private val exportManager: ExportManager,
    private val defaultKind: String = "contact"
) : ViewModel() {

    private val _kind = MutableStateFlow(defaultKind)
    private val _viewMode = MutableStateFlow("list")
    private val _filter = MutableStateFlow("active")
    private val _query = MutableStateFlow("")
    private val _facet = MutableStateFlow("")
    private val _selectedSubmission = MutableStateFlow<Submission?>(null)
    private val _isRefreshing = MutableStateFlow(false)
    private val _error = MutableStateFlow<String?>(null)
    private val _toastMessage = MutableStateFlow<String?>(null)
    private val _notesSaveState = MutableStateFlow("idle")
    private val _remoteCounts = MutableStateFlow(SubmissionCounts())
    private val _remoteFacets = MutableStateFlow<List<String>>(emptyList())

    private var notesDebounceJob: Job? = null

    val uiState: StateFlow<SubmissionsUiState> = combine(
        submissionRepository.getCachedSubmissionsFlow(_kind.value),
        _kind,
        _viewMode,
        _filter,
        _query,
        _facet,
        _selectedSubmission,
        _isRefreshing,
        _error,
        _toastMessage,
        _notesSaveState,
        _remoteCounts,
        _remoteFacets
    ) { args ->
        @Suppress("UNCHECKED_CAST")
        val cached = args[0] as List<Submission>
        val kind = args[1] as String
        val viewMode = args[2] as String
        val filter = args[3] as String
        val query = args[4] as String
        val facet = args[5] as String
        val selected = args[6] as Submission?
        val refreshing = args[7] as Boolean
        val error = args[8] as String?
        val toast = args[9] as String?
        val notesState = args[10] as String
        val counts = args[11] as SubmissionCounts
        val facets = args[12] as List<String>

        val needle = query.trim().lowercase()
        val filtered = cached.filter { item ->
            val matchesFacet = if (facet.isNotBlank()) item.tags.contains(facet) else true
            val matchesQuery = if (needle.isNotBlank()) {
                val fullText = listOf(
                    item.displayName,
                    item.subtitle,
                    item.displayEmail,
                    item.displayMobile,
                    item.displayMessage,
                    item.notes
                ).joinToString(" ").lowercase()
                fullText.contains(needle)
            } else true

            val matchesFilter = when (filter) {
                "active" -> item.status != "archived"
                "starred" -> item.starred
                else -> item.status == filter
            }

            matchesFacet && matchesQuery && matchesFilter
        }

        SubmissionsUiState(
            kind = kind,
            viewMode = viewMode,
            filter = filter,
            query = query,
            facet = facet,
            facets = facets,
            counts = counts,
            items = filtered,
            selectedSubmission = selected,
            isRefreshing = refreshing,
            error = error,
            toastMessage = toast,
            notesSaveState = notesState
        )
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        SubmissionsUiState(kind = defaultKind, isRefreshing = true)
    )

    init {
        refresh()
    }

    fun setKind(kind: String) {
        if (_kind.value != kind) {
            _kind.value = kind
            _facet.value = ""
            _selectedSubmission.value = null
            refresh()
        }
    }

    fun setViewMode(mode: String) {
        _viewMode.value = mode
    }

    fun setFilter(filter: String) {
        _filter.value = filter
    }

    fun setQuery(query: String) {
        _query.value = query
    }

    fun setFacet(facet: String) {
        _facet.value = facet
    }

    fun selectSubmission(submission: Submission?) {
        _selectedSubmission.value = submission
        _notesSaveState.value = "idle"
    }

    fun refresh() {
        viewModelScope.launch {
            _isRefreshing.value = true
            _error.value = null
            submissionRepository.fetchSubmissions(
                kind = _kind.value,
                filter = _filter.value,
                query = _query.value,
                facet = _facet.value
            ).fold(
                onSuccess = { res ->
                    _remoteCounts.value = res.counts
                    _remoteFacets.value = res.facets
                    _isRefreshing.value = false
                },
                onFailure = { ex ->
                    _isRefreshing.value = false
                    _error.value = ex.localizedMessage ?: "Failed to sync submissions"
                }
            )
        }
    }

    fun updateStatus(id: String, newStatus: String) {
        viewModelScope.launch {
            val label = when (newStatus) {
                "new" -> "New"
                "progress" -> if (_kind.value == "contact") "In talks" else "Shortlisted"
                "done" -> if (_kind.value == "contact") "Closed" else "Onboarded"
                "archived" -> "Archived"
                else -> newStatus
            }
            _toastMessage.value = "Moved to $label"

            val result = submissionRepository.patchSubmission(id, SubmissionPatch(status = newStatus))
            result.onSuccess { updated ->
                if (_selectedSubmission.value?.id == id) {
                    _selectedSubmission.value = updated
                }
            }
        }
    }

    fun toggleStarred(id: String, currentStarred: Boolean) {
        viewModelScope.launch {
            val nextStarred = !currentStarred
            _toastMessage.value = if (nextStarred) "Starred" else "Unstarred"

            val result = submissionRepository.patchSubmission(id, SubmissionPatch(starred = nextStarred))
            result.onSuccess { updated ->
                if (_selectedSubmission.value?.id == id) {
                    _selectedSubmission.value = updated
                }
            }
        }
    }

    fun onNotesChanged(id: String, newNotes: String) {
        notesDebounceJob?.cancel()
        _notesSaveState.value = "saving"

        notesDebounceJob = viewModelScope.launch {
            delay(900) // 900ms debounce matching web admin SubmissionInbox.tsx
            val result = submissionRepository.patchSubmission(id, SubmissionPatch(notes = newNotes))
            result.fold(
                onSuccess = { updated ->
                    _notesSaveState.value = "saved"
                    if (_selectedSubmission.value?.id == id) {
                        _selectedSubmission.value = updated
                    }
                },
                onFailure = {
                    _notesSaveState.value = "idle"
                    _toastMessage.value = "Couldn't save notes"
                }
            )
        }
    }

    fun deleteSubmission(id: String) {
        viewModelScope.launch {
            val result = submissionRepository.deleteSubmission(id)
            result.fold(
                onSuccess = {
                    _selectedSubmission.value = null
                    _toastMessage.value = "Deleted permanently"
                },
                onFailure = {
                    _toastMessage.value = "Couldn't delete. Please retry."
                }
            )
        }
    }

    fun exportCsv() {
        viewModelScope.launch {
            _toastMessage.value = "Preparing CSV export…"
            exportManager.downloadAndShareCsv(_kind.value).fold(
                onSuccess = {
                    _toastMessage.value = "CSV ready to share"
                },
                onFailure = { ex ->
                    _error.value = "Export failed: ${ex.localizedMessage}"
                }
            )
        }
    }

    fun clearToast() {
        _toastMessage.value = null
    }

    fun clearError() {
        _error.value = null
    }
}

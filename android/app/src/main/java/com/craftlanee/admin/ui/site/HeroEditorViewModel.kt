package com.craftlanee.admin.ui.site

import android.content.Context
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.craftlanee.admin.data.model.HeroButton
import com.craftlanee.admin.data.model.HeroButtons
import com.craftlanee.admin.data.model.HeroSettings
import com.craftlanee.admin.data.model.SecondaryHeroButton
import com.craftlanee.admin.data.model.SiteSettingsResponse
import com.craftlanee.admin.data.repository.SiteSettingsRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream

data class HeroEditorUiState(
    val settings: HeroSettings = HeroSettings(),
    val savedSettings: HeroSettings = HeroSettings(),
    val selectedLocalUri: Uri? = null,
    val selectedLocalFile: File? = null,
    val isSaving: Boolean = false,
    val isFetching: Boolean = false,
    val error: String? = null,
    val successMessage: String? = null,
    val missingStorage: List<String> = emptyList(),
    val diagnostics: String = ""
) {
    val isDirty: Boolean
        get() = selectedLocalFile != null || settings != savedSettings
}

class HeroEditorViewModel(
    private val repository: SiteSettingsRepository,
    private val context: Context
) : ViewModel() {

    private val _uiState = MutableStateFlow(HeroEditorUiState(isFetching = true))
    val uiState: StateFlow<HeroEditorUiState> = _uiState.asStateFlow()

    init {
        loadSettings()
    }

    fun loadSettings() {
        viewModelScope.launch {
            _uiState.update { it.copy(isFetching = true, error = null) }
            repository.getSettings().fold(
                onSuccess = { res ->
                    _uiState.update {
                        it.copy(
                            isFetching = false,
                            settings = res.hero,
                            savedSettings = res.hero,
                            missingStorage = res.missingStorage,
                            diagnostics = res.diagnostics
                        )
                    }
                },
                onFailure = { ex ->
                    _uiState.update {
                        it.copy(
                            isFetching = false,
                            error = ex.localizedMessage ?: "Failed to load hero settings"
                        )
                    }
                }
            )
        }
    }

    fun setMode(mode: String) {
        _uiState.update { it.copy(settings = it.settings.copy(mode = mode)) }
    }

    fun setFit(fit: String) {
        _uiState.update { it.copy(settings = it.settings.copy(fit = fit)) }
    }

    fun setAltText(alt: String) {
        _uiState.update {
            val currentPhoto = it.settings.photo
            val updatedPhoto = currentPhoto?.copy(alt = alt)
            it.copy(settings = it.settings.copy(photo = updatedPhoto))
        }
    }

    fun setPrimaryButton(label: String, href: String) {
        _uiState.update {
            val updated = it.settings.buttons.copy(primary = HeroButton(label, href))
            it.copy(settings = it.settings.copy(buttons = updated))
        }
    }

    fun setSecondaryButton(label: String, href: String, visible: Boolean) {
        _uiState.update {
            val updated = it.settings.buttons.copy(secondary = SecondaryHeroButton(label, href, visible))
            it.copy(settings = it.settings.copy(buttons = updated))
        }
    }

    fun onImageSelected(uri: Uri?) {
        if (uri == null) return
        try {
            val mimeType = context.contentResolver.getType(uri) ?: "image/jpeg"
            val extension = when (mimeType) {
                "image/png" -> "png"
                "image/webp" -> "webp"
                "image/avif" -> "avif"
                else -> "jpg"
            }
            val inputStream = context.contentResolver.openInputStream(uri) ?: return
            val tempFile = File(context.cacheDir, "hero_upload_${System.currentTimeMillis()}.$extension")
            FileOutputStream(tempFile).use { output ->
                inputStream.copyTo(output)
            }
            _uiState.update {
                it.copy(
                    selectedLocalUri = uri,
                    selectedLocalFile = tempFile,
                    settings = it.settings.copy(mode = "photo")
                )
            }
        } catch (e: Exception) {
            _uiState.update { it.copy(error = "Failed to read selected image: ${e.localizedMessage}") }
        }
    }

    fun discardChanges() {
        _uiState.update {
            it.copy(
                settings = it.savedSettings,
                selectedLocalUri = null,
                selectedLocalFile = null
            )
        }
    }

    fun publish(removePhoto: Boolean = false) {
        viewModelScope.launch {
            _uiState.update { it.copy(isSaving = true, error = null, successMessage = null) }
            val state = _uiState.value
            val targetSettings = if (removePhoto) {
                state.settings.copy(photo = null, mode = "illustration")
            } else {
                state.settings
            }

            repository.updateHero(
                settings = targetSettings,
                photoFile = if (!removePhoto) state.selectedLocalFile else null,
                removePhoto = removePhoto
            ).fold(
                onSuccess = { updated ->
                    _uiState.update {
                        it.copy(
                            isSaving = false,
                            settings = updated,
                            savedSettings = updated,
                            selectedLocalFile = null,
                            selectedLocalUri = null,
                            successMessage = if (removePhoto) "Photo removed. The illustration is back on the homepage." else "Published. The homepage is updated."
                        )
                    }
                },
                onFailure = { ex ->
                    _uiState.update {
                        it.copy(
                            isSaving = false,
                            error = ex.localizedMessage ?: "Failed to save hero settings"
                        )
                    }
                }
            )
        }
    }

    fun clearMessages() {
        _uiState.update { it.copy(error = null, successMessage = null) }
    }
}

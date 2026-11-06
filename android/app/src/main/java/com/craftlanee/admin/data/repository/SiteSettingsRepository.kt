package com.craftlanee.admin.data.repository

import com.craftlanee.admin.core.network.AdminApiService
import com.craftlanee.admin.data.model.HeroSettings
import com.craftlanee.admin.data.model.SiteSettingsResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File

class SiteSettingsRepository(
    private val apiService: AdminApiService
) {

    suspend fun getSettings(): Result<SiteSettingsResponse> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.getSiteSettings()
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch settings: HTTP ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateHero(
        settings: HeroSettings,
        photoFile: File? = null,
        removePhoto: Boolean = false
    ): Result<HeroSettings> = withContext(Dispatchers.IO) {
        try {
            val textPlain = "text/plain".toMediaTypeOrNull()

            val modePart = settings.mode.toRequestBody(textPlain)
            val fitPart = settings.fit.toRequestBody(textPlain)
            val altPart = (settings.photo?.alt ?: "CraftLanee").toRequestBody(textPlain)
            val primaryLabelPart = settings.buttons.primary.label.toRequestBody(textPlain)
            val primaryHrefPart = settings.buttons.primary.href.toRequestBody(textPlain)
            val secondaryLabelPart = settings.buttons.secondary.label.toRequestBody(textPlain)
            val secondaryHrefPart = settings.buttons.secondary.href.toRequestBody(textPlain)
            val secondaryVisiblePart = (if (settings.buttons.secondary.visible) "1" else "0").toRequestBody(textPlain)

            val photoPart = photoFile?.let { file ->
                val mimeType = when (file.extension.lowercase()) {
                    "jpg", "jpeg" -> "image/jpeg"
                    "png" -> "image/png"
                    "webp" -> "image/webp"
                    "avif" -> "image/avif"
                    else -> "image/jpeg"
                }
                val reqBody = file.asRequestBody(mimeType.toMediaTypeOrNull())
                MultipartBody.Part.createFormData("photo", file.name, reqBody)
            }

            val removePart = if (removePhoto) "1".toRequestBody(textPlain) else null

            val response = apiService.updateHero(
                mode = modePart,
                fit = fitPart,
                alt = altPart,
                primaryLabel = primaryLabelPart,
                primaryHref = primaryHrefPart,
                secondaryLabel = secondaryLabelPart,
                secondaryHref = secondaryHrefPart,
                secondaryVisible = secondaryVisiblePart,
                photo = photoPart,
                remove = removePart
            )

            if (response.isSuccessful && response.body()?.hero != null) {
                Result.success(response.body()!!.hero!!)
            } else {
                Result.failure(Exception(response.body()?.error ?: "Failed to update hero"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

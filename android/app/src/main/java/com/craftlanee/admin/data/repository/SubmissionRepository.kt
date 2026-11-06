package com.craftlanee.admin.data.repository

import com.craftlanee.admin.core.database.AppDatabase
import com.craftlanee.admin.core.database.entities.SubmissionEntity
import com.craftlanee.admin.core.network.AdminApiService
import com.craftlanee.admin.data.model.Submission
import com.craftlanee.admin.data.model.SubmissionListResponse
import com.craftlanee.admin.data.model.SubmissionPatch
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject

class SubmissionRepository(
    private val apiService: AdminApiService,
    private val database: AppDatabase
) {

    private val json = Json {
        ignoreUnknownKeys = true
        coerceInputValues = true
    }

    fun getCachedSubmissionsFlow(kind: String?): Flow<List<Submission>> {
        val flow = if (kind.isNullOrBlank()) {
            database.submissionDao().getAllFlow()
        } else {
            database.submissionDao().getByKindFlow(kind)
        }
        return flow.map { entities ->
            entities.mapNotNull { entity ->
                try {
                    val data = json.decodeFromString<JsonObject>(entity.rawJsonData)
                    Submission(
                        id = entity.id,
                        kind = entity.kind,
                        createdAt = entity.createdAt,
                        updatedAt = entity.updatedAt,
                        status = entity.status,
                        starred = entity.starred,
                        notes = entity.notes,
                        data = data
                    )
                } catch (e: Exception) {
                    null
                }
            }
        }.flowOn(Dispatchers.IO)
    }

    suspend fun fetchSubmissions(
        kind: String? = null,
        filter: String? = null,
        query: String? = null,
        facet: String? = null
    ): Result<SubmissionListResponse> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.getSubmissions(kind, filter, query, facet)
            if (response.isSuccessful && response.body() != null) {
                val list = response.body()!!
                val entities = list.items.map { sub ->
                    SubmissionEntity(
                        id = sub.id,
                        kind = sub.kind,
                        createdAt = sub.createdAt,
                        updatedAt = sub.updatedAt,
                        status = sub.status,
                        starred = sub.starred,
                        notes = sub.notes,
                        rawJsonData = json.encodeToString(sub.data)
                    )
                }
                database.submissionDao().insertAll(entities)
                Result.success(list)
            } else {
                Result.failure(Exception("Failed to fetch submissions: HTTP ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun patchSubmission(
        id: String,
        patch: SubmissionPatch
    ): Result<Submission> = withContext(Dispatchers.IO) {
        try {
            // Optimistically update local Room database if record exists
            val existing = database.submissionDao().getById(id)
            if (existing != null) {
                val updated = existing.copy(
                    status = patch.status ?: existing.status,
                    starred = patch.starred ?: existing.starred,
                    notes = patch.notes ?: existing.notes
                )
                database.submissionDao().update(updated)
            }

            val response = apiService.patchSubmission(id, patch)
            if (response.isSuccessful && response.body()?.submission != null) {
                val sub = response.body()!!.submission!!
                database.submissionDao().insert(
                    SubmissionEntity(
                        id = sub.id,
                        kind = sub.kind,
                        createdAt = sub.createdAt,
                        updatedAt = sub.updatedAt,
                        status = sub.status,
                        starred = sub.starred,
                        notes = sub.notes,
                        rawJsonData = json.encodeToString(sub.data)
                    )
                )
                Result.success(sub)
            } else {
                // Revert if remote failed
                if (existing != null) database.submissionDao().update(existing)
                Result.failure(Exception(response.body()?.error ?: "Failed to save update"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteSubmission(id: String): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.deleteSubmission(id)
            if (response.isSuccessful) {
                database.submissionDao().deleteById(id)
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to delete submission: HTTP ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

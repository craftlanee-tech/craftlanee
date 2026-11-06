package com.craftlanee.admin.data.repository

import com.craftlanee.admin.core.database.AppDatabase
import com.craftlanee.admin.core.database.entities.OverviewEntity
import com.craftlanee.admin.core.network.AdminApiService
import com.craftlanee.admin.data.model.OverviewResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class OverviewRepository(
    private val apiService: AdminApiService,
    private val database: AppDatabase
) {

    private val json = Json {
        ignoreUnknownKeys = true
        coerceInputValues = true
    }

    val cachedOverviewFlow: Flow<OverviewResponse?> = database.overviewDao().getOverviewFlow()
        .map { entity ->
            entity?.let {
                try {
                    json.decodeFromString<OverviewResponse>(it.rawJson)
                } catch (e: Exception) {
                    null
                }
            }
        }.flowOn(Dispatchers.IO)

    suspend fun refreshOverview(): Result<OverviewResponse> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.getOverview()
            if (response.isSuccessful && response.body() != null) {
                val data = response.body()!!
                database.overviewDao().saveOverview(
                    OverviewEntity(
                        timestamp = data.timestamp,
                        rawJson = json.encodeToString(data)
                    )
                )
                Result.success(data)
            } else {
                Result.failure(Exception("Failed to fetch overview: HTTP ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

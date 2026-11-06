package com.craftlanee.admin.core.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.craftlanee.admin.core.database.entities.OverviewEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface OverviewDao {

    @Query("SELECT * FROM overview_cache WHERE id = 1 LIMIT 1")
    fun getOverviewFlow(): Flow<OverviewEntity?>

    @Query("SELECT * FROM overview_cache WHERE id = 1 LIMIT 1")
    suspend fun getOverview(): OverviewEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveOverview(entity: OverviewEntity)

    @Query("DELETE FROM overview_cache")
    suspend fun clear()
}

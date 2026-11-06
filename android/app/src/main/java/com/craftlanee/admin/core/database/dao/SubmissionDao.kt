package com.craftlanee.admin.core.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.craftlanee.admin.core.database.entities.SubmissionEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface SubmissionDao {

    @Query("SELECT * FROM submissions ORDER BY createdAt DESC")
    fun getAllFlow(): Flow<List<SubmissionEntity>>

    @Query("SELECT * FROM submissions WHERE kind = :kind ORDER BY createdAt DESC")
    fun getByKindFlow(kind: String): Flow<List<SubmissionEntity>>

    @Query("SELECT * FROM submissions WHERE id = :id LIMIT 1")
    suspend fun getById(id: String): SubmissionEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(items: List<SubmissionEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(item: SubmissionEntity)

    @Update
    suspend fun update(item: SubmissionEntity)

    @Query("DELETE FROM submissions WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("DELETE FROM submissions")
    suspend fun clearAll()
}

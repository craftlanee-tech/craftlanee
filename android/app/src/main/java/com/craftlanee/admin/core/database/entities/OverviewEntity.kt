package com.craftlanee.admin.core.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "overview_cache")
data class OverviewEntity(
    @PrimaryKey val id: Int = 1,
    val timestamp: Long,
    val rawJson: String
)

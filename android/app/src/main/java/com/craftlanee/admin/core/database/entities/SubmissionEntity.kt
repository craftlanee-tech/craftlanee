package com.craftlanee.admin.core.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "submissions")
data class SubmissionEntity(
    @PrimaryKey val id: String,
    val kind: String,
    val createdAt: String,
    val updatedAt: String,
    val status: String,
    val starred: Boolean,
    val notes: String,
    val rawJsonData: String
)

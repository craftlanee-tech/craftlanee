package com.craftlanee.admin.core.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.craftlanee.admin.core.database.dao.OverviewDao
import com.craftlanee.admin.core.database.dao.SubmissionDao
import com.craftlanee.admin.core.database.entities.OverviewEntity
import com.craftlanee.admin.core.database.entities.SubmissionEntity

@Database(
    entities = [SubmissionEntity::class, OverviewEntity::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun submissionDao(): SubmissionDao
    abstract fun overviewDao(): OverviewDao

    companion object {
        @Volatile
        private var instance: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase {
            return instance ?: synchronized(this) {
                instance ?: Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "craftlanee_admin.db"
                ).fallbackToDestructiveMigration().build().also { instance = it }
            }
        }
    }
}

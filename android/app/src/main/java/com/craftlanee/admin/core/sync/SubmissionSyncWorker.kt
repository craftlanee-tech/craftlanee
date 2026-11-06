package com.craftlanee.admin.core.sync

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.craftlanee.admin.MainActivity
import com.craftlanee.admin.core.database.AppDatabase
import com.craftlanee.admin.core.database.entities.SubmissionEntity
import com.craftlanee.admin.core.network.RetrofitClient
import com.craftlanee.admin.core.security.SessionManager
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.util.concurrent.TimeUnit

class SubmissionSyncWorker(
    private val context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val sessionManager = SessionManager.getInstance(context)
        if (!sessionManager.hasValidSession()) {
            return Result.success()
        }

        val apiService = RetrofitClient.getInstance(sessionManager).createService()
        val database = AppDatabase.getInstance(context)

        return try {
            val response = apiService.getSubmissions(filter = "new")
            if (response.isSuccessful && response.body() != null) {
                val items = response.body()!!.items
                if (items.isNotEmpty()) {
                    val entities = items.map { sub ->
                        SubmissionEntity(
                            id = sub.id,
                            kind = sub.kind,
                            createdAt = sub.createdAt,
                            updatedAt = sub.updatedAt,
                            status = sub.status,
                            starred = sub.starred,
                            notes = sub.notes,
                            rawJsonData = Json.encodeToString(sub.data)
                        )
                    }
                    database.submissionDao().insertAll(entities)

                    val newCount = items.size
                    val title = "New CraftLanee Enquiries"
                    val message = "$newCount new enquiry awaiting reply in Control Room."
                    showNotification(title, message)
                }
            }
            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }

    private fun showNotification(title: String, message: String) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (androidx.core.content.ContextCompat.checkSelfPermission(
                    context,
                    android.Manifest.permission.POST_NOTIFICATIONS
                ) != android.content.pm.PackageManager.PERMISSION_GRANTED
            ) {
                return
            }
        }

        val channelId = "craftlanee_admin_alerts"
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Admin Alerts",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Alerts for new incoming submissions and leads"
            }
            notificationManager.createNotificationChannel(channel)
        }

        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.stat_notify_chat)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        try {
            NotificationManagerCompat.from(context).notify(101, notification)
        } catch (_: SecurityException) {
            // Android 13 POST_NOTIFICATIONS permission not granted
        }
    }

    companion object {
        private const val WORK_NAME = "craftlanee_submission_sync"

        fun schedule(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            val request = PeriodicWorkRequestBuilder<SubmissionSyncWorker>(15, TimeUnit.MINUTES)
                .setConstraints(constraints)
                .build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                WORK_NAME,
                ExistingPeriodicWorkPolicy.KEEP,
                request
            )
        }
    }
}

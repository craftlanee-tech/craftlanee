package com.craftlanee.admin.core.export

import android.content.Context
import android.content.Intent
import androidx.core.content.FileProvider
import com.craftlanee.admin.core.network.AdminApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ExportManager(
    private val context: Context,
    private val apiService: AdminApiService
) {

    suspend fun downloadAndShareCsv(type: String): Result<File> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.exportCsv(type)
            if (!response.isSuccessful || response.body() == null) {
                return@withContext Result.failure(Exception("Failed to download CSV: HTTP ${response.code()}"))
            }

            val exportDir = File(context.cacheDir, "exports").apply { mkdirs() }
            val timeStamp = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
            val file = File(exportDir, "craftlanee-${type}s-$timeStamp.csv")

            response.body()!!.byteStream().use { input ->
                FileOutputStream(file).use { output ->
                    input.copyTo(output)
                }
            }

            shareCsvFile(file, type)
            Result.success(file)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private fun shareCsvFile(file: File, type: String) {
        val authority = "${context.packageName}.fileprovider"
        val contentUri = FileProvider.getUriForFile(context, authority, file)

        val intent = Intent(Intent.ACTION_SEND).apply {
            this.type = "text/csv"
            putExtra(Intent.EXTRA_STREAM, contentUri)
            putExtra(Intent.EXTRA_SUBJECT, "CraftLanee ${type.replaceFirstChar { it.uppercase() }}s Export")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }

        val chooser = Intent.createChooser(intent, "Export $type CSV to:").apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(chooser)
    }
}

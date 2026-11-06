package com.craftlanee.admin

import android.app.Application
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ProcessLifecycleOwner
import com.craftlanee.admin.core.database.AppDatabase
import com.craftlanee.admin.core.export.ExportManager
import com.craftlanee.admin.core.network.RetrofitClient
import com.craftlanee.admin.core.security.BiometricLockManager
import com.craftlanee.admin.core.security.SessionManager
import com.craftlanee.admin.core.sync.SubmissionSyncWorker
import com.craftlanee.admin.data.repository.AuthRepository
import com.craftlanee.admin.data.repository.OverviewRepository
import com.craftlanee.admin.data.repository.SiteSettingsRepository
import com.craftlanee.admin.data.repository.SubmissionRepository

class CraftLaneeAdminApp : Application() {

    lateinit var sessionManager: SessionManager private set
    lateinit var biometricLockManager: BiometricLockManager private set
    lateinit var appDatabase: AppDatabase private set

    lateinit var authRepository: AuthRepository private set
    lateinit var overviewRepository: OverviewRepository private set
    lateinit var submissionRepository: SubmissionRepository private set
    lateinit var siteSettingsRepository: SiteSettingsRepository private set
    lateinit var exportManager: ExportManager private set

    override fun onCreate() {
        super.onCreate()

        sessionManager = SessionManager.getInstance(this)
        biometricLockManager = BiometricLockManager(this, sessionManager)
        appDatabase = AppDatabase.getInstance(this)

        val apiService = RetrofitClient.getInstance(sessionManager).createService()

        authRepository = AuthRepository(apiService, sessionManager)
        overviewRepository = OverviewRepository(apiService, appDatabase)
        submissionRepository = SubmissionRepository(apiService, appDatabase)
        siteSettingsRepository = SiteSettingsRepository(apiService)
        exportManager = ExportManager(this, apiService)

        // Schedule periodic background sync for new submissions
        SubmissionSyncWorker.schedule(this)

        // Observe app lifecycle to lock screen when returning from background
        ProcessLifecycleOwner.get().lifecycle.addObserver(object : DefaultLifecycleObserver {
            override fun onResume(owner: LifecycleOwner) {
                if (sessionManager.hasValidSession() && sessionManager.isBiometricEnabled()) {
                    sessionManager.lockApp()
                }
            }
        })
    }
}

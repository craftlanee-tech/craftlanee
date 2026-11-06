package com.craftlanee.admin

import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.compose.runtime.CompositionLocalProvider
import androidx.fragment.app.FragmentActivity
import com.craftlanee.admin.ui.navigation.AdminNavigation
import com.craftlanee.admin.ui.theme.CraftlaneeAdminTheme
import com.craftlanee.admin.ui.theme.LocalWindowSizeInfo
import com.craftlanee.admin.ui.theme.rememberWindowSizeInfo

class MainActivity : FragmentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val app = application as CraftLaneeAdminApp

        setContent {
            val windowSizeInfo = rememberWindowSizeInfo()
            CompositionLocalProvider(LocalWindowSizeInfo provides windowSizeInfo) {
                CraftlaneeAdminTheme {
                    AdminNavigation(
                        sessionManager = app.sessionManager,
                        biometricLockManager = app.biometricLockManager,
                        authRepository = app.authRepository,
                        overviewRepository = app.overviewRepository,
                        submissionRepository = app.submissionRepository,
                        siteSettingsRepository = app.siteSettingsRepository,
                        exportManager = app.exportManager,
                        context = this
                    )
                }
            }
        }
    }
}

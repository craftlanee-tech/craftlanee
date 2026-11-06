package com.craftlanee.admin.ui.navigation

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.displayCutoutPadding
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.NavigationRail
import androidx.compose.material3.NavigationRailItem
import androidx.compose.material3.NavigationRailItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.craftlanee.admin.R
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.craftlanee.admin.core.export.ExportManager
import com.craftlanee.admin.core.security.BiometricLockManager
import com.craftlanee.admin.core.security.SessionManager
import com.craftlanee.admin.data.repository.AuthRepository
import com.craftlanee.admin.data.repository.OverviewRepository
import com.craftlanee.admin.data.repository.SiteSettingsRepository
import com.craftlanee.admin.data.repository.SubmissionRepository
import com.craftlanee.admin.ui.auth.LoginScreen
import com.craftlanee.admin.ui.auth.LoginViewModel
import com.craftlanee.admin.ui.biometric.BiometricGateScreen
import com.craftlanee.admin.ui.overview.OverviewScreen
import com.craftlanee.admin.ui.overview.OverviewViewModel
import com.craftlanee.admin.ui.site.HeroEditorScreen
import com.craftlanee.admin.ui.site.HeroEditorViewModel
import com.craftlanee.admin.ui.submissions.SubmissionsScreen
import com.craftlanee.admin.ui.submissions.SubmissionsViewModel
import com.craftlanee.admin.ui.theme.AdminInk
import com.craftlanee.admin.ui.theme.BrandAccent
import com.craftlanee.admin.ui.theme.BrandPrimary
import com.craftlanee.admin.ui.theme.LocalWindowSizeInfo
import com.craftlanee.admin.ui.theme.SurfaceBorder
import com.craftlanee.admin.ui.theme.SurfaceDark
import com.craftlanee.admin.ui.theme.TextMutedDark
import com.craftlanee.admin.ui.theme.TextPrimaryDark

@Composable
fun AdminNavigation(
    sessionManager: SessionManager,
    biometricLockManager: BiometricLockManager,
    authRepository: AuthRepository,
    overviewRepository: OverviewRepository,
    submissionRepository: SubmissionRepository,
    siteSettingsRepository: SiteSettingsRepository,
    exportManager: ExportManager,
    context: android.content.Context,
    navController: NavHostController = rememberNavController()
) {
    val windowSizeInfo = LocalWindowSizeInfo.current
    val isAuthenticated by sessionManager.isAuthenticated.collectAsState()
    val isBiometricLocked by sessionManager.isBiometricLocked.collectAsState()

    val startDestination = when {
        !isAuthenticated -> Screen.Login.route
        isBiometricLocked -> Screen.BiometricLock.route
        else -> Screen.Overview.route
    }

    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    val showNav = currentRoute in Screen.bottomNavScreens.map { it.route }
    val isWide = windowSizeInfo.isWide

    // Reusable viewmodels
    val loginViewModel = remember { LoginViewModel(authRepository, sessionManager) }
    val overviewViewModel = remember { OverviewViewModel(overviewRepository, sessionManager) }
    val contactsViewModel = remember { SubmissionsViewModel(submissionRepository, exportManager, sessionManager, "contact") }
    val internshipsViewModel = remember { SubmissionsViewModel(submissionRepository, exportManager, sessionManager, "internship") }
    val heroEditorViewModel = remember { HeroEditorViewModel(siteSettingsRepository, sessionManager, context) }

    Scaffold(
        containerColor = AdminInk,
        bottomBar = {
            if (showNav && !isWide) {
                NavigationBar(
                    containerColor = SurfaceDark,
                    contentColor = TextPrimaryDark,
                    tonalElevation = 8.dp,
                    modifier = Modifier.border(1.dp, SurfaceBorder)
                ) {
                    Screen.bottomNavScreens.forEach { screen ->
                        val selected = currentRoute == screen.route
                        NavigationBarItem(
                            selected = selected,
                            onClick = {
                                navController.navigate(screen.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            icon = {
                                screen.icon?.let {
                                    Icon(
                                        imageVector = it,
                                        contentDescription = screen.title,
                                        tint = if (selected) BrandPrimary else TextMutedDark
                                    )
                                }
                            },
                            label = {
                                Text(
                                    text = screen.title,
                                    fontSize = 11.sp,
                                    color = if (selected) BrandPrimary else TextMutedDark
                                )
                            },
                            colors = NavigationBarItemDefaults.colors(
                                indicatorColor = BrandPrimary.copy(alpha = 0.15f)
                            )
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = if (!isWide) innerPadding.calculateBottomPadding() else 0.dp)
        ) {
            // Adaptive Navigation Rail on Medium / Expanded screens
            if (showNav && isWide) {
                NavigationRail(
                    containerColor = SurfaceDark,
                    contentColor = TextPrimaryDark,
                    modifier = Modifier
                        .fillMaxHeight()
                        .border(1.dp, SurfaceBorder)
                        .statusBarsPadding()
                        .displayCutoutPadding()
                        .navigationBarsPadding(),
                    header = {
                        Box(
                            modifier = Modifier
                                .padding(top = 16.dp, bottom = 24.dp)
                                .size(44.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(SurfaceDark)
                                .border(1.dp, SurfaceBorder, RoundedCornerShape(12.dp))
                                .padding(6.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Image(
                                painter = painterResource(id = R.drawable.ic_craftlanee_logo),
                                contentDescription = "CraftLanee",
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Fit
                            )
                        }
                    }
                ) {
                    Screen.bottomNavScreens.forEach { screen ->
                        val selected = currentRoute == screen.route
                        NavigationRailItem(
                            selected = selected,
                            onClick = {
                                navController.navigate(screen.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            icon = {
                                screen.icon?.let {
                                    Icon(
                                        imageVector = it,
                                        contentDescription = screen.title,
                                        tint = if (selected) BrandPrimary else TextMutedDark
                                    )
                                }
                            },
                            label = {
                                Text(
                                    text = screen.title,
                                    fontSize = 11.sp,
                                    color = if (selected) BrandPrimary else TextMutedDark
                                )
                            },
                            colors = NavigationRailItemDefaults.colors(
                                indicatorColor = BrandPrimary.copy(alpha = 0.15f)
                            )
                        )
                    }
                }
            }

            NavHost(
                navController = navController,
                startDestination = startDestination,
                modifier = Modifier
                    .fillMaxSize()
                    .weight(1f)
            ) {
                composable(Screen.Login.route) {
                    LoginScreen(
                        viewModel = loginViewModel,
                        onLoginSuccess = {
                            overviewViewModel.refresh()
                            contactsViewModel.refresh()
                            internshipsViewModel.refresh()
                            heroEditorViewModel.loadSettings()
                            navController.navigate(Screen.Overview.route) {
                                popUpTo(Screen.Login.route) { inclusive = true }
                            }
                        }
                    )
                }

                composable(Screen.BiometricLock.route) {
                    BiometricGateScreen(
                        biometricLockManager = biometricLockManager,
                        onUnlocked = {
                            overviewViewModel.refresh()
                            contactsViewModel.refresh()
                            internshipsViewModel.refresh()
                            heroEditorViewModel.loadSettings()
                            navController.navigate(Screen.Overview.route) {
                                popUpTo(Screen.BiometricLock.route) { inclusive = true }
                            }
                        },
                        onFallbackToPassword = {
                            sessionManager.clearSession()
                            navController.navigate(Screen.Login.route) {
                                popUpTo(Screen.BiometricLock.route) { inclusive = true }
                            }
                        }
                    )
                }

                composable(Screen.Overview.route) {
                    OverviewScreen(
                        viewModel = overviewViewModel,
                        onNavigateToContacts = { navController.navigate(Screen.Contacts.route) },
                        onNavigateToInternships = { navController.navigate(Screen.Internships.route) },
                        onNavigateToHero = { navController.navigate(Screen.HeroEditor.route) },
                        onSelectSubmission = { submission ->
                            if (submission.isContact) {
                                contactsViewModel.selectSubmission(submission)
                                navController.navigate(Screen.Contacts.route)
                            } else {
                                internshipsViewModel.selectSubmission(submission)
                                navController.navigate(Screen.Internships.route)
                            }
                        }
                    )
                }

                composable(Screen.Contacts.route) {
                    SubmissionsScreen(viewModel = contactsViewModel)
                }

                composable(Screen.Internships.route) {
                    SubmissionsScreen(viewModel = internshipsViewModel)
                }

                composable(Screen.HeroEditor.route) {
                    HeroEditorScreen(viewModel = heroEditorViewModel)
                }
            }
        }
    }
}

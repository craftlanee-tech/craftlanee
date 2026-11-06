package com.craftlanee.admin.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Mail
import androidx.compose.material.icons.filled.School
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(
    val route: String,
    val title: String,
    val icon: ImageVector? = null
) {
    object Login : Screen("login", "Sign In")
    object BiometricLock : Screen("biometric_lock", "Biometric Unlock")
    object Overview : Screen("overview", "Overview", Icons.Default.GridView)
    object Contacts : Screen("contacts", "Contact Leads", Icons.Default.Mail)
    object Internships : Screen("internships", "Internships", Icons.Default.School)
    object HeroEditor : Screen("hero_editor", "Hero Visual", Icons.Default.Image)

    companion object {
        val bottomNavScreens = listOf(Overview, Contacts, Internships, HeroEditor)
    }
}

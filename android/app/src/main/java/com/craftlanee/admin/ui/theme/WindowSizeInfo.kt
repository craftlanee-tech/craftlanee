package com.craftlanee.admin.ui.theme

import androidx.compose.runtime.Composable
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

enum class WindowWidthSizeClass {
    Compact,   // < 600dp (standard portrait phones)
    Medium,    // 600dp - 839dp (foldables, small tablets, phones in landscape)
    Expanded   // >= 840dp (tablets, desktop/DeX, large landscape displays)
}

enum class WindowHeightSizeClass {
    Compact,   // < 480dp (phones in landscape)
    Medium,    // 480dp - 899dp
    Expanded   // >= 900dp
}

data class WindowSizeInfo(
    val widthSizeClass: WindowWidthSizeClass,
    val heightSizeClass: WindowHeightSizeClass,
    val screenWidthDp: Dp,
    val screenHeightDp: Dp,
    val fontScale: Float,
    val isLandscape: Boolean
) {
    val isUltraNarrow: Boolean get() = screenWidthDp < 340.dp || fontScale > 1.35f
    val isWide: Boolean get() = widthSizeClass != WindowWidthSizeClass.Compact
}

val LocalWindowSizeInfo = compositionLocalOf {
    WindowSizeInfo(
        widthSizeClass = WindowWidthSizeClass.Compact,
        heightSizeClass = WindowHeightSizeClass.Medium,
        screenWidthDp = 360.dp,
        screenHeightDp = 640.dp,
        fontScale = 1.0f,
        isLandscape = false
    )
}

@Composable
fun rememberWindowSizeInfo(): WindowSizeInfo {
    val configuration = LocalConfiguration.current
    val density = LocalDensity.current
    val screenWidth = configuration.screenWidthDp.dp
    val screenHeight = configuration.screenHeightDp.dp
    val fontScale = density.fontScale

    val widthClass = when {
        screenWidth < 600.dp -> WindowWidthSizeClass.Compact
        screenWidth < 840.dp -> WindowWidthSizeClass.Medium
        else -> WindowWidthSizeClass.Expanded
    }

    val heightClass = when {
        screenHeight < 480.dp -> WindowHeightSizeClass.Compact
        screenHeight < 900.dp -> WindowHeightSizeClass.Medium
        else -> WindowHeightSizeClass.Expanded
    }

    return WindowSizeInfo(
        widthSizeClass = widthClass,
        heightSizeClass = heightClass,
        screenWidthDp = screenWidth,
        screenHeightDp = screenHeight,
        fontScale = fontScale,
        isLandscape = screenWidth > screenHeight
    )
}

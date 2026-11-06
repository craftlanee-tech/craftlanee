package com.craftlanee.admin.data.model

import kotlinx.serialization.Serializable

@Serializable
data class HeroButton(
    val label: String = "",
    val href: String = ""
)

@Serializable
data class SecondaryHeroButton(
    val label: String = "",
    val href: String = "",
    val visible: Boolean = true
)

@Serializable
data class HeroButtons(
    val primary: HeroButton = HeroButton("Start a project", "/contact"),
    val secondary: SecondaryHeroButton = SecondaryHeroButton("Explore services", "/services", true)
)

@Serializable
data class HeroPhoto(
    val src: String = "",
    val alt: String = "",
    val uploadedAt: String = ""
)

@Serializable
data class HeroSettings(
    val mode: String = "illustration", // "illustration" | "photo"
    val fit: String = "cover",         // "cover" | "contain"
    val photo: HeroPhoto? = null,
    val buttons: HeroButtons = HeroButtons()
)

@Serializable
data class SiteSettingsResponse(
    val hero: HeroSettings = HeroSettings(),
    val useBlob: Boolean = false,
    val missingStorage: List<String> = emptyList(),
    val diagnostics: String = ""
)

@Serializable
data class HeroUpdateResponse(
    val hero: HeroSettings? = null,
    val error: String? = null
)

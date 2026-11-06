package com.craftlanee.admin.ui.site

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddPhotoAlternate
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.craftlanee.admin.ui.theme.AdminInk
import com.craftlanee.admin.ui.theme.AmberWarning
import com.craftlanee.admin.ui.theme.BrandAccent
import com.craftlanee.admin.ui.theme.BrandPrimary
import com.craftlanee.admin.ui.theme.EmeraldSuccess
import com.craftlanee.admin.ui.theme.LocalWindowSizeInfo
import com.craftlanee.admin.ui.theme.RoseError
import com.craftlanee.admin.ui.theme.SurfaceAlt
import com.craftlanee.admin.ui.theme.SurfaceBorder
import com.craftlanee.admin.ui.theme.SurfaceDark
import com.craftlanee.admin.ui.theme.TextMutedDark
import com.craftlanee.admin.ui.theme.TextPrimaryDark
import com.craftlanee.admin.ui.theme.TextSecondaryDark

@Composable
fun HeroEditorScreen(
    viewModel: HeroEditorViewModel,
    modifier: Modifier = Modifier
) {
    val windowSizeInfo = LocalWindowSizeInfo.current
    val uiState by viewModel.uiState.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }
    var confirmRemovePhoto by remember { mutableStateOf(false) }

    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia()
    ) { uri ->
        viewModel.onImageSelected(uri)
    }

    LaunchedEffect(uiState.successMessage) {
        uiState.successMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.clearMessages()
        }
    }

    LaunchedEffect(uiState.error) {
        uiState.error?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.clearMessages()
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        containerColor = AdminInk,
        modifier = modifier
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Spacer(modifier = Modifier.height(14.dp))

            // Title
            Text(
                text = "WEBSITE",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.5.sp,
                color = TextMutedDark
            )
            Text(
                text = "Homepage hero",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimaryDark
            )
            Text(
                text = "Choose what visitors see beside your headline: the animated orbit illustration, or your uploaded photo.",
                fontSize = 13.sp,
                color = TextSecondaryDark
            )

            // Storage Diagnostic Warning (if on Vercel read-only host)
            if (uiState.missingStorage.isNotEmpty()) {
                Spacer(modifier = Modifier.height(14.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(AmberWarning.copy(alpha = 0.12f))
                        .border(1.dp, AmberWarning.copy(alpha = 0.3f), RoundedCornerShape(16.dp))
                        .padding(14.dp)
                ) {
                    Row(verticalAlignment = Alignment.Top) {
                        Icon(imageVector = Icons.Default.Warning, contentDescription = null, tint = AmberWarning, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(text = "Connect storage to publish photos", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = TextPrimaryDark)
                            Text(text = "Missing: ${uiState.missingStorage.joinToString(" and ")}", fontSize = 12.sp, color = TextSecondaryDark)
                            if (uiState.diagnostics.isNotBlank()) {
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(text = uiState.diagnostics, fontSize = 10.sp, color = TextMutedDark)
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Live Preview Card Composable
            val previewCard = @Composable {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(22.dp))
                        .background(SurfaceDark)
                        .border(1.dp, SurfaceBorder, RoundedCornerShape(22.dp))
                        .padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "craftlanee.com", fontSize = 12.sp, color = TextMutedDark)
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(100.dp))
                                .background(if (uiState.isDirty) AmberWarning.copy(alpha = 0.15f) else EmeraldSuccess.copy(alpha = 0.15f))
                                .padding(horizontal = 8.dp, vertical = 3.dp)
                        ) {
                            Text(
                                text = if (uiState.isDirty) "Preview · Unsaved" else "Live",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (uiState.isDirty) AmberWarning else EmeraldSuccess
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Simulated Hero Container
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .aspectRatio(16f / 9f)
                            .heightIn(max = 240.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(
                                Brush.linearGradient(
                                    colors = listOf(Color(0xFF0F172A), Color(0xFF1E293B))
                                )
                            )
                            .padding(14.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxSize(),
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Simulated typography
                            Column(modifier = Modifier.weight(1.2f)) {
                                Box(modifier = Modifier.size(width = 50.dp, height = 5.dp).clip(RoundedCornerShape(3.dp)).background(BrandPrimary))
                                Spacer(modifier = Modifier.height(8.dp))
                                Box(modifier = Modifier.fillMaxWidth(0.9f).height(10.dp).clip(RoundedCornerShape(4.dp)).background(Color.White.copy(alpha = 0.8f)))
                                Spacer(modifier = Modifier.height(4.dp))
                                Box(modifier = Modifier.fillMaxWidth(0.6f).height(10.dp).clip(RoundedCornerShape(4.dp)).background(BrandPrimary))
                                Spacer(modifier = Modifier.height(10.dp))

                                // Action buttons preview
                                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(100.dp))
                                            .background(BrandPrimary)
                                            .padding(horizontal = 8.dp, vertical = 4.dp)
                                    ) {
                                        Text(
                                            text = uiState.settings.buttons.primary.label.ifBlank { "Button" },
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Color.White
                                        )
                                    }

                                    if (uiState.settings.buttons.secondary.visible) {
                                        Box(
                                            modifier = Modifier
                                                .clip(RoundedCornerShape(100.dp))
                                                .border(1.dp, BrandPrimary.copy(alpha = 0.6f), RoundedCornerShape(100.dp))
                                                .padding(horizontal = 8.dp, vertical = 4.dp)
                                        ) {
                                            Text(
                                                text = uiState.settings.buttons.secondary.label.ifBlank { "Button" },
                                                fontSize = 9.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = TextSecondaryDark
                                            )
                                        }
                                    }
                                }
                            }

                            // Visual Preview (Photo vs Orbit)
                            Box(
                                modifier = Modifier
                                    .weight(0.8f)
                                    .aspectRatio(1f)
                                    .clip(RoundedCornerShape(14.dp))
                                    .background(SurfaceAlt),
                                contentAlignment = Alignment.Center
                            ) {
                                if (uiState.settings.mode == "photo" && (uiState.selectedLocalUri != null || uiState.settings.photo != null)) {
                                    val imageModel = uiState.selectedLocalUri ?: uiState.settings.photo?.src
                                    AsyncImage(
                                        model = imageModel,
                                        contentDescription = uiState.settings.photo?.alt,
                                        contentScale = if (uiState.settings.fit == "contain") ContentScale.Fit else ContentScale.Crop,
                                        modifier = Modifier.fillMaxSize()
                                    )
                                } else {
                                    // Mini Orbit representation
                                    Box(
                                        modifier = Modifier
                                            .size(54.dp)
                                            .border(1.dp, BrandPrimary.copy(alpha = 0.4f), CircleShape),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(20.dp)
                                                .clip(RoundedCornerShape(6.dp))
                                                .background(
                                                    Brush.linearGradient(
                                                        listOf(BrandPrimary, BrandAccent)
                                                    )
                                                )
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Form Controls Composable
            val formControls = @Composable {
                Column {
                    // Section 1: Visual Mode Radio Group
                    Text(
                        text = "1 · CHOOSE VISUAL",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = TextMutedDark
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        // Orbit Illustration Card
                        val isOrbit = uiState.settings.mode == "illustration"
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(16.dp))
                                .background(if (isOrbit) BrandPrimary.copy(alpha = 0.12f) else SurfaceDark)
                                .border(1.dp, if (isOrbit) BrandPrimary else SurfaceBorder, RoundedCornerShape(16.dp))
                                .clickable { viewModel.setMode("illustration") }
                                .padding(14.dp)
                        ) {
                            Column {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(text = "Orbit", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = TextPrimaryDark)
                                    if (isOrbit) {
                                        Icon(imageVector = Icons.Default.Check, contentDescription = null, tint = BrandPrimary, modifier = Modifier.size(16.dp))
                                    }
                                }
                                Text(text = "Animated visual", fontSize = 11.sp, color = TextMutedDark)
                            }
                        }

                        // Custom Photo Card
                        val isPhoto = uiState.settings.mode == "photo"
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(16.dp))
                                .background(if (isPhoto) BrandPrimary.copy(alpha = 0.12f) else SurfaceDark)
                                .border(1.dp, if (isPhoto) BrandPrimary else SurfaceBorder, RoundedCornerShape(16.dp))
                                .clickable {
                                    if (uiState.settings.photo != null || uiState.selectedLocalUri != null) {
                                        viewModel.setMode("photo")
                                    } else {
                                        photoPickerLauncher.launch(
                                            PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                                        )
                                    }
                                }
                                .padding(14.dp)
                        ) {
                            Column {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(text = "Custom Photo", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = TextPrimaryDark)
                                    if (isPhoto) {
                                        Icon(imageVector = Icons.Default.Check, contentDescription = null, tint = BrandPrimary, modifier = Modifier.size(16.dp))
                                    }
                                }
                                Text(
                                    text = if (uiState.settings.photo != null) "Uploaded image" else "Tap to upload",
                                    fontSize = 11.sp,
                                    color = TextMutedDark
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    // Section 2: Photo Upload & Framing
                    Text(
                        text = "2 · PHOTO MEDIA",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = TextMutedDark
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(SurfaceDark)
                            .border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
                            .clickable {
                                photoPickerLauncher.launch(
                                    PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                                )
                            }
                            .padding(20.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Box(
                                modifier = Modifier
                                    .size(44.dp)
                                    .clip(CircleShape)
                                    .background(BrandPrimary.copy(alpha = 0.15f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(imageVector = Icons.Default.AddPhotoAlternate, contentDescription = null, tint = BrandPrimary, modifier = Modifier.size(24.dp))
                            }
                            Spacer(modifier = Modifier.height(10.dp))
                            Text(
                                text = if (uiState.selectedLocalFile != null) uiState.selectedLocalFile!!.name
                                       else if (uiState.settings.photo != null) "Replace Photo"
                                       else "Select Image from Device",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = TextPrimaryDark
                            )
                            Text(
                                text = "JPG, PNG, WebP or AVIF · Up to 5 MB",
                                fontSize = 11.sp,
                                color = TextMutedDark
                            )
                        }
                    }

                    if (uiState.settings.photo != null || uiState.selectedLocalUri != null) {
                        Spacer(modifier = Modifier.height(12.dp))

                        // Framing Options: Fill vs Fit
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            val isCover = uiState.settings.fit == "cover"
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (isCover) SurfaceAlt else SurfaceDark)
                                    .border(1.dp, if (isCover) BrandPrimary else SurfaceBorder, RoundedCornerShape(12.dp))
                                    .clickable { viewModel.setFit("cover") }
                                    .padding(vertical = 10.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = "Fill (Cover)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = if (isCover) BrandPrimary else TextSecondaryDark)
                            }

                            val isContain = uiState.settings.fit == "contain"
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (isContain) SurfaceAlt else SurfaceDark)
                                    .border(1.dp, if (isContain) BrandPrimary else SurfaceBorder, RoundedCornerShape(12.dp))
                                    .clickable { viewModel.setFit("contain") }
                                    .padding(vertical = 10.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = "Fit (Contain)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = if (isContain) BrandPrimary else TextSecondaryDark)
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Alt text field
                        OutlinedTextField(
                            value = uiState.settings.photo?.alt.orEmpty(),
                            onValueChange = { viewModel.setAltText(it) },
                            label = { Text("Alt description (for accessibility)", fontSize = 12.sp) },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(14.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedContainerColor = SurfaceDark,
                                unfocusedContainerColor = SurfaceDark,
                                focusedBorderColor = BrandPrimary,
                                unfocusedBorderColor = SurfaceBorder,
                                focusedTextColor = TextPrimaryDark,
                                unfocusedTextColor = TextPrimaryDark
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    // Section 3: Call To Action Buttons
                    Text(
                        text = "3 · CALL TO ACTION BUTTONS",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = TextMutedDark
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    // Primary Button
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(SurfaceDark)
                            .border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
                            .padding(14.dp)
                    ) {
                        Text(text = "Main Button", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = BrandPrimary)
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = uiState.settings.buttons.primary.label,
                            onValueChange = { viewModel.setPrimaryButton(it, uiState.settings.buttons.primary.href) },
                            label = { Text("Button Text", fontSize = 11.sp) },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = uiState.settings.buttons.primary.href,
                            onValueChange = { viewModel.setPrimaryButton(uiState.settings.buttons.primary.label, it) },
                            label = { Text("Link Destination (/contact or https://…)", fontSize = 11.sp) },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Secondary Button
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(SurfaceDark)
                            .border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
                            .padding(14.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = "Second Button", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = TextPrimaryDark)
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(text = "Show", fontSize = 12.sp, color = TextMutedDark)
                                Checkbox(
                                    checked = uiState.settings.buttons.secondary.visible,
                                    onCheckedChange = {
                                        viewModel.setSecondaryButton(
                                            uiState.settings.buttons.secondary.label,
                                            uiState.settings.buttons.secondary.href,
                                            it
                                        )
                                    },
                                    colors = CheckboxDefaults.colors(checkedColor = BrandPrimary)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = uiState.settings.buttons.secondary.label,
                            onValueChange = {
                                viewModel.setSecondaryButton(
                                    it,
                                    uiState.settings.buttons.secondary.href,
                                    uiState.settings.buttons.secondary.visible
                                )
                            },
                            label = { Text("Button Text", fontSize = 11.sp) },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = uiState.settings.buttons.secondary.href,
                            onValueChange = {
                                viewModel.setSecondaryButton(
                                    uiState.settings.buttons.secondary.label,
                                    it,
                                    uiState.settings.buttons.secondary.visible
                                )
                            },
                            label = { Text("Link Destination (/services or https://…)", fontSize = 11.sp) },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(26.dp))

                    // Action Buttons: Publish, Discard, Delete Photo
                    Button(
                        onClick = { viewModel.publish() },
                        enabled = uiState.isDirty && !uiState.isSaving,
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(min = 50.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary)
                    ) {
                        if (uiState.isSaving) {
                            CircularProgressIndicator(color = Color.White, modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Publishing changes…", fontWeight = FontWeight.Bold)
                        } else {
                            Icon(imageVector = Icons.Default.Check, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Publish to Homepage", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    if (uiState.isDirty && !uiState.isSaving) {
                        Spacer(modifier = Modifier.height(10.dp))
                        OutlinedButton(
                            onClick = { viewModel.discardChanges() },
                            modifier = Modifier
                                .fillMaxWidth()
                                .heightIn(min = 46.dp),
                            shape = RoundedCornerShape(14.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, SurfaceBorder)
                        ) {
                            Text(text = "Discard Changes", color = TextMutedDark, fontSize = 13.sp)
                        }
                    }

                    if (uiState.settings.photo != null) {
                        Spacer(modifier = Modifier.height(12.dp))
                        OutlinedButton(
                            onClick = {
                                if (confirmRemovePhoto) {
                                    viewModel.publish(removePhoto = true)
                                } else {
                                    confirmRemovePhoto = true
                                }
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .heightIn(min = 46.dp),
                            shape = RoundedCornerShape(14.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, if (confirmRemovePhoto) RoseError else SurfaceBorder)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Delete,
                                contentDescription = null,
                                modifier = Modifier.size(16.dp),
                                tint = if (confirmRemovePhoto) RoseError else TextMutedDark
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (confirmRemovePhoto) "Click again to delete photo" else "Delete Photo",
                                color = if (confirmRemovePhoto) RoseError else TextMutedDark,
                                fontSize = 13.sp,
                                fontWeight = if (confirmRemovePhoto) FontWeight.Bold else FontWeight.Normal
                            )
                        }
                    }
                }
            }

            // Adaptive: 2-pane layout on Wide screens, single column stack on Compact screens
            if (windowSizeInfo.isWide) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(20.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Box(modifier = Modifier.weight(1f)) {
                        previewCard()
                    }
                    Box(modifier = Modifier.weight(1.2f)) {
                        formControls()
                    }
                }
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(20.dp)) {
                    previewCard()
                    formControls()
                }
            }

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

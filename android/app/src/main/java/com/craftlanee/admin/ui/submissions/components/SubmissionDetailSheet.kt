package com.craftlanee.admin.ui.submissions.components

import android.content.ActivityNotFoundException
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Archive
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Mail
import androidx.compose.material.icons.filled.Message
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.StarBorder
import androidx.compose.material.icons.filled.Unarchive
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.SheetState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.craftlanee.admin.data.model.Submission
import com.craftlanee.admin.ui.components.InitialAvatar
import com.craftlanee.admin.ui.theme.BrandPrimary
import com.craftlanee.admin.ui.theme.GoldStar
import com.craftlanee.admin.ui.theme.RoseError
import com.craftlanee.admin.ui.theme.SurfaceAlt
import com.craftlanee.admin.ui.theme.SurfaceBorder
import com.craftlanee.admin.ui.theme.SurfaceDark
import com.craftlanee.admin.ui.theme.TextMutedDark
import com.craftlanee.admin.ui.theme.TextPrimaryDark
import com.craftlanee.admin.ui.theme.TextSecondaryDark

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun SubmissionDetailSheet(
    submission: Submission,
    sheetState: SheetState,
    notesSaveState: String,
    onDismiss: () -> Unit,
    onToggleStar: (String, Boolean) -> Unit,
    onUpdateStatus: (String, String) -> Unit,
    onNotesChanged: (String, String) -> Unit,
    onDelete: (String) -> Unit
) {
    val context = LocalContext.current
    var notesText by remember(submission.id) { mutableStateOf(submission.notes) }
    var confirmDelete by remember { mutableStateOf(false) }

    // Flush any pending note changes when dismissing sheet
    DisposableEffect(submission.id) {
        onDispose {
            if (notesText != submission.notes) {
                onNotesChanged(submission.id, notesText)
            }
        }
    }

    val rawMobile = submission.displayMobile.filter { it.isDigit() }
    val formattedWhatsApp = if (rawMobile.length == 10) "91$rawMobile" else rawMobile

    ModalBottomSheet(
        onDismissRequest = {
            if (notesText != submission.notes) {
                onNotesChanged(submission.id, notesText)
            }
            onDismiss()
        },
        sheetState = sheetState,
        containerColor = SurfaceDark,
        sheetMaxWidth = 640.dp,
        dragHandle = null
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .imePadding()
                .padding(20.dp)
                .verticalScroll(rememberScrollState())
        ) {
            // Top Bar: Dismiss & Star
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = {
                        if (notesText != submission.notes) {
                            onNotesChanged(submission.id, notesText)
                        }
                        onDismiss()
                    },
                    modifier = Modifier.size(48.dp)
                ) {
                    Icon(imageVector = Icons.Default.Close, contentDescription = "Close", tint = TextMutedDark)
                }

                IconButton(
                    onClick = { onToggleStar(submission.id, submission.starred) },
                    modifier = Modifier.size(48.dp)
                ) {
                    Icon(
                        imageVector = if (submission.starred) Icons.Default.Star else Icons.Default.StarBorder,
                        contentDescription = "Star",
                        tint = if (submission.starred) GoldStar else TextMutedDark,
                        modifier = Modifier.size(24.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Profile Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                InitialAvatar(name = submission.displayName, kind = submission.kind, size = 52.dp)
                Spacer(modifier = Modifier.width(14.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = submission.displayName,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimaryDark
                    )
                    Text(
                        text = "Submitted ${submission.createdAt.take(10)}",
                        fontSize = 12.sp,
                        color = TextMutedDark
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Quick Actions (FlowRow for adaptive responsiveness)
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                if (submission.displayEmail.isNotBlank()) {
                    Button(
                        onClick = {
                            try {
                                val subject = if (submission.isContact) "Re: your enquiry with CraftLanee" else "Your CraftLanee internship application"
                                val intent = Intent(Intent.ACTION_SENDTO).apply {
                                    data = Uri.parse("mailto:${submission.displayEmail}?subject=${Uri.encode(subject)}")
                                }
                                context.startActivity(Intent.createChooser(intent, "Send Email"))
                            } catch (e: ActivityNotFoundException) {
                                Toast.makeText(context, "No email app found on device", Toast.LENGTH_SHORT).show()
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.heightIn(min = 42.dp)
                    ) {
                        Icon(imageVector = Icons.Default.Mail, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "Email", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                }

                if (submission.displayMobile.isNotBlank()) {
                    Button(
                        onClick = {
                            try {
                                val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:$rawMobile"))
                                context.startActivity(intent)
                            } catch (e: ActivityNotFoundException) {
                                Toast.makeText(context, "No dialer app found on device", Toast.LENGTH_SHORT).show()
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = SurfaceAlt),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.heightIn(min = 42.dp)
                    ) {
                        Icon(imageVector = Icons.Default.Call, contentDescription = null, modifier = Modifier.size(16.dp), tint = TextSecondaryDark)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "Call", fontSize = 13.sp, color = TextPrimaryDark, fontWeight = FontWeight.Bold)
                    }

                    Button(
                        onClick = {
                            try {
                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://wa.me/$formattedWhatsApp"))
                                context.startActivity(intent)
                            } catch (e: ActivityNotFoundException) {
                                Toast.makeText(context, "No browser or WhatsApp app found", Toast.LENGTH_SHORT).show()
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF25D366)),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.heightIn(min = 42.dp)
                    ) {
                        Icon(imageVector = Icons.Default.Message, contentDescription = null, modifier = Modifier.size(16.dp), tint = Color.White)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "WhatsApp", fontSize = 13.sp, color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(22.dp))

            // Stage Pipeline Stepper
            Text(
                text = "PIPELINE STAGE",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                color = TextMutedDark
            )
            Spacer(modifier = Modifier.height(10.dp))

            val stages = listOf(
                "new" to "New",
                "progress" to if (submission.isContact) "In talks" else "Shortlisted",
                "done" to if (submission.isContact) "Closed" else "Onboarded"
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                stages.forEach { (key, label) ->
                    val isCurrent = submission.status == key
                    val currentStepIndex = stages.indexOfFirst { it.first == submission.status }
                    val thisStepIndex = stages.indexOfFirst { it.first == key }
                    val isPassed = thisStepIndex <= currentStepIndex

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isCurrent) BrandPrimary.copy(alpha = 0.15f) else SurfaceAlt)
                            .border(1.dp, if (isCurrent) BrandPrimary else SurfaceBorder, RoundedCornerShape(12.dp))
                            .clickable { onUpdateStatus(submission.id, key) }
                            .padding(vertical = 10.dp, horizontal = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            if (isPassed) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = null,
                                    tint = if (isCurrent) BrandPrimary else TextMutedDark,
                                    modifier = Modifier.size(12.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                            }
                            Text(
                                text = label,
                                fontSize = 11.sp,
                                fontWeight = if (isCurrent) FontWeight.Bold else FontWeight.Medium,
                                color = if (isCurrent) BrandPrimary else TextSecondaryDark
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Submission Details Field Table
            Text(
                text = "DETAILS",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                color = TextMutedDark
            )
            Spacer(modifier = Modifier.height(10.dp))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(SurfaceAlt)
                    .border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
                    .padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                if (submission.isContact) {
                    val contact = submission.contactData
                    DetailRow(label = "Business", value = contact?.businessName ?: "—")
                    DetailRow(label = "Email", value = contact?.email ?: "—")
                    DetailRow(label = "Mobile", value = contact?.mobile ?: "—")
                    DetailRow(label = "Services", value = contact?.serviceNeeded?.joinToString(", ") ?: "—")
                    if (contact != null && contact.serviceTypes.isNotEmpty()) {
                        DetailRow(label = "Service Types", value = contact.serviceTypes.joinToString(", "))
                    }
                } else {
                    val intern = submission.internshipData
                    DetailRow(label = "Domain", value = intern?.domain ?: "—")
                    DetailRow(label = "College", value = intern?.college ?: "—")
                    DetailRow(label = "Course & Year", value = "${intern?.course} · ${intern?.yearOfStudy}")
                    DetailRow(label = "Email", value = intern?.email ?: "—")
                    DetailRow(label = "Mobile", value = intern?.mobile ?: "—")
                    DetailRow(label = "Mode & Duration", value = "${intern?.mode} · ${intern?.duration}")
                }
            }

            // Message Block
            if (submission.displayMessage.isNotBlank()) {
                Spacer(modifier = Modifier.height(20.dp))
                Text(
                    text = "MESSAGE",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp,
                    color = TextMutedDark
                )
                Spacer(modifier = Modifier.height(8.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(SurfaceAlt)
                        .border(1.dp, SurfaceBorder, RoundedCornerShape(12.dp))
                        .padding(14.dp)
                ) {
                    Text(
                        text = submission.displayMessage,
                        fontSize = 14.sp,
                        color = TextPrimaryDark,
                        lineHeight = 20.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Private Notes Autosave Box
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "PRIVATE ADMIN NOTES",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp,
                    color = TextMutedDark
                )
                Text(
                    text = if (notesSaveState == "saving") "Saving…" else if (notesSaveState == "saved") "Saved" else "",
                    fontSize = 11.sp,
                    color = BrandPrimary,
                    fontWeight = FontWeight.Medium
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = notesText,
                onValueChange = {
                    notesText = it
                    onNotesChanged(submission.id, it)
                },
                placeholder = { Text("Call summary, follow-up date, quotation…", color = TextMutedDark, fontSize = 13.sp) },
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = 110.dp),
                shape = RoundedCornerShape(14.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = SurfaceAlt,
                    unfocusedContainerColor = SurfaceAlt,
                    focusedBorderColor = BrandPrimary,
                    unfocusedBorderColor = SurfaceBorder,
                    focusedTextColor = TextPrimaryDark,
                    unfocusedTextColor = TextPrimaryDark
                )
            )

            Spacer(modifier = Modifier.height(26.dp))

            // Archive & Delete Actions
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                val isArchived = submission.status == "archived"
                Button(
                    onClick = {
                        val nextStatus = if (isArchived) "new" else "archived"
                        onUpdateStatus(submission.id, nextStatus)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = SurfaceAlt),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.heightIn(min = 44.dp)
                ) {
                    Icon(
                        imageVector = if (isArchived) Icons.Default.Unarchive else Icons.Default.Archive,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = TextSecondaryDark
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = if (isArchived) "Restore" else "Archive", color = TextPrimaryDark, fontSize = 13.sp)
                }

                Button(
                    onClick = {
                        if (confirmDelete) {
                            onDelete(submission.id)
                        } else {
                            confirmDelete = true
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = if (confirmDelete) RoseError else SurfaceAlt),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.heightIn(min = 44.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = if (confirmDelete) Color.White else RoseError
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (confirmDelete) "Tap again to confirm" else "Delete",
                        color = if (confirmDelete) Color.White else RoseError,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}

@Composable
fun DetailRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Top
    ) {
        Text(text = label, fontSize = 12.sp, color = TextMutedDark, fontWeight = FontWeight.Medium)
        Text(
            text = value,
            fontSize = 13.sp,
            color = TextPrimaryDark,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(start = 16.dp)
        )
    }
}

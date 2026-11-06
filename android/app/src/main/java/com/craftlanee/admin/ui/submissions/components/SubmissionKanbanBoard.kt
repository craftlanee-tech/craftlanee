package com.craftlanee.admin.ui.submissions.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.craftlanee.admin.data.model.Submission
import com.craftlanee.admin.ui.components.InitialAvatar
import com.craftlanee.admin.ui.theme.GoldStar
import com.craftlanee.admin.ui.theme.LocalWindowSizeInfo
import com.craftlanee.admin.ui.theme.SurfaceAlt
import com.craftlanee.admin.ui.theme.SurfaceBorder
import com.craftlanee.admin.ui.theme.SurfaceDark
import com.craftlanee.admin.ui.theme.TextMutedDark
import com.craftlanee.admin.ui.theme.TextPrimaryDark
import com.craftlanee.admin.ui.theme.TextSecondaryDark
import com.craftlanee.admin.ui.theme.VizContact
import com.craftlanee.admin.ui.theme.VizInternship

@Composable
fun SubmissionKanbanBoard(
    kind: String,
    items: List<Submission>,
    onSelectSubmission: (Submission) -> Unit,
    onMoveStatus: (id: String, nextStatus: String) -> Unit,
    modifier: Modifier = Modifier
) {
    val windowSizeInfo = LocalWindowSizeInfo.current
    val isWide = windowSizeInfo.isWide

    val columns = listOf(
        Triple("new", "New", "progress"),
        Triple("progress", if (kind == "contact") "In talks" else "Shortlisted", "done"),
        Triple("done", if (kind == "contact") "Closed" else "Onboarded", null)
    )

    val compactColumnWidth = (windowSizeInfo.screenWidthDp * 0.82f).coerceIn(260.dp, 340.dp)

    Row(
        modifier = if (isWide) {
            modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp)
        } else {
            modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(vertical = 8.dp)
        },
        horizontalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        columns.forEach { (statusKey, label, nextKey) ->
            val columnCards = items.filter { it.status == statusKey }

            Column(
                modifier = if (isWide) {
                    Modifier
                        .weight(1f)
                        .fillMaxHeight()
                        .clip(RoundedCornerShape(20.dp))
                        .background(SurfaceDark)
                        .border(1.dp, SurfaceBorder, RoundedCornerShape(20.dp))
                        .padding(14.dp)
                } else {
                    Modifier
                        .width(compactColumnWidth)
                        .fillMaxHeight()
                        .clip(RoundedCornerShape(20.dp))
                        .background(SurfaceDark)
                        .border(1.dp, SurfaceBorder, RoundedCornerShape(20.dp))
                        .padding(14.dp)
                }
            ) {
                // Column Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(CircleShape)
                                .background(if (kind == "contact") VizContact else VizInternship)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = label,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimaryDark
                        )
                    }

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(100.dp))
                            .background(SurfaceAlt)
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = columnCards.size.toString(),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextSecondaryDark
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                if (columnCards.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f)
                            .clip(RoundedCornerShape(12.dp))
                            .border(1.dp, SurfaceBorder, RoundedCornerShape(12.dp))
                            .padding(16.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "No cards in this stage",
                            fontSize = 12.sp,
                            color = TextMutedDark
                        )
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier.weight(1f),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(columnCards, key = { it.id }) { item ->
                            KanbanCard(
                                item = item,
                                nextKey = nextKey,
                                nextLabel = if (nextKey == "progress") (if (kind == "contact") "In talks" else "Shortlist")
                                            else if (nextKey == "done") (if (kind == "contact") "Close" else "Onboard")
                                            else "",
                                kicker = if (kind == "contact") item.contactData?.businessName else item.internshipData?.domain,
                                onCardClick = { onSelectSubmission(item) },
                                onAdvance = { nextKey?.let { onMoveStatus(item.id, it) } }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun KanbanCard(
    item: Submission,
    nextKey: String?,
    nextLabel: String,
    kicker: String?,
    onCardClick: () -> Unit,
    onAdvance: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(SurfaceAlt)
            .border(1.dp, SurfaceBorder, RoundedCornerShape(14.dp))
            .clickable(onClick = onCardClick)
            .padding(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            InitialAvatar(name = item.displayName, kind = item.kind, size = 32.dp)
            Spacer(modifier = Modifier.width(10.dp))
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = item.displayName,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimaryDark,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.weight(1f)
                    )
                    if (item.starred) {
                        Spacer(modifier = Modifier.width(4.dp))
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = "Starred",
                            tint = GoldStar,
                            modifier = Modifier.size(14.dp)
                        )
                    }
                }
                Text(
                    text = item.subtitle,
                    fontSize = 11.sp,
                    color = TextMutedDark,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }

        if (item.displayMessage.isNotBlank()) {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = item.displayMessage,
                fontSize = 12.sp,
                color = TextSecondaryDark,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
        }

        if (!kicker.isNullOrBlank()) {
            Spacer(modifier = Modifier.height(6.dp))
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(Color.White.copy(alpha = 0.05f))
                    .padding(horizontal = 6.dp, vertical = 2.dp)
            ) {
                Text(
                    text = kicker,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Medium,
                    color = TextSecondaryDark,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }

        if (nextKey != null) {
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                TextButton(
                    onClick = onAdvance,
                    colors = ButtonDefaults.textButtonColors(contentColor = if (item.kind == "contact") VizContact else VizInternship)
                ) {
                    Text(text = "$nextLabel ", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Icon(imageVector = Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(12.dp))
                }
            }
        }
    }
}

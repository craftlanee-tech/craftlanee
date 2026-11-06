package com.craftlanee.admin.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.craftlanee.admin.data.model.ActivityDay
import com.craftlanee.admin.ui.theme.SurfaceAlt
import com.craftlanee.admin.ui.theme.SurfaceBorder
import com.craftlanee.admin.ui.theme.SurfaceDark
import com.craftlanee.admin.ui.theme.TextMutedDark
import com.craftlanee.admin.ui.theme.TextPrimaryDark
import com.craftlanee.admin.ui.theme.TextSecondaryDark
import com.craftlanee.admin.ui.theme.VizContact
import com.craftlanee.admin.ui.theme.VizInternship

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun BarChart30Days(
    days: List<ActivityDay>,
    modifier: Modifier = Modifier
) {
    if (days.isEmpty()) return

    val totalContacts = days.sumOf { it.contact }
    val totalInternships = days.sumOf { it.internship }
    val peak = maxOf(1, days.maxOfOrNull { it.contact + it.internship } ?: 1)
    val maxScale = if (peak <= 4) peak else ((peak + 1) / 2) * 2

    var selectedDay by remember { mutableStateOf<ActivityDay?>(null) }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .background(SurfaceDark)
            .border(1.dp, SurfaceBorder, RoundedCornerShape(24.dp))
            .padding(18.dp)
    ) {
        // Legend & Totals Header with FlowRow for small screens & large font scale
        FlowRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Column {
                Text(
                    text = "Activity",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimaryDark
                )
                Text(
                    text = "Submissions per day, last 30 days",
                    fontSize = 12.sp,
                    color = TextMutedDark
                )
            }

            Row(
                horizontalArrangement = Arrangement.spacedBy(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(VizContact))
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(text = "Leads $totalContacts", fontSize = 11.sp, color = TextSecondaryDark)
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(VizInternship))
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(text = "Interns $totalInternships", fontSize = 11.sp, color = TextSecondaryDark)
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Tooltip Popup (clamped across container bounds)
        AnimatedVisibility(
            visible = selectedDay != null,
            enter = fadeIn(),
            exit = fadeOut()
        ) {
            selectedDay?.let { day ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(SurfaceAlt)
                        .border(1.dp, SurfaceBorder, RoundedCornerShape(12.dp))
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = day.label, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = TextPrimaryDark)
                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text(text = "Leads: ${day.contact}", fontSize = 12.sp, color = VizContact, fontWeight = FontWeight.Bold)
                        Text(text = "Interns: ${day.internship}", fontSize = 12.sp, color = VizInternship, fontWeight = FontWeight.Bold)
                        Text(text = "Total: ${day.contact + day.internship}", fontSize = 12.sp, color = TextPrimaryDark, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // 30 Days Canvas
        Canvas(
            modifier = Modifier
                .fillMaxWidth()
                .height(150.dp)
                .pointerInput(days) {
                    detectTapGestures { offset ->
                        if (days.isNotEmpty() && size.width > 0) {
                            val barSlotWidth = size.width.toFloat() / days.size
                            val index = (offset.x / barSlotWidth).toInt().coerceIn(0, days.size - 1)
                            selectedDay = days[index]
                        }
                    }
                }
        ) {
            val chartWidth = size.width
            val chartHeight = size.height
            if (chartWidth <= 0f || chartHeight <= 0f || days.isEmpty()) return@Canvas

            val barCount = days.size
            val slotWidth = chartWidth / barCount
            val barWidth = (slotWidth * 0.65f).coerceIn(2.dp.toPx(), 18.dp.toPx())

            // Draw horizontal guide lines
            val steps = 3
            for (step in 0..steps) {
                val y = chartHeight - (step.toFloat() / steps) * chartHeight
                drawLine(
                    color = SurfaceBorder,
                    start = Offset(0f, y),
                    end = Offset(chartWidth, y),
                    strokeWidth = 1.dp.toPx()
                )
            }

            // Draw stacked bars
            days.forEachIndexed { index, day ->
                val x = index * slotWidth + (slotWidth - barWidth) / 2
                val contactHeight = ((day.contact.toFloat() / maxScale) * chartHeight).coerceIn(0f, chartHeight)
                val internshipHeight = ((day.internship.toFloat() / maxScale) * chartHeight).coerceIn(0f, chartHeight - contactHeight)

                val isSelected = selectedDay?.key == day.key
                if (isSelected) {
                    drawRoundRect(
                        color = Color.White.copy(alpha = 0.08f),
                        topLeft = Offset(index * slotWidth, 0f),
                        size = Size(slotWidth, chartHeight),
                        cornerRadius = CornerRadius(4.dp.toPx())
                    )
                }

                // Base contact bar
                if (day.contact > 0 && contactHeight > 0f) {
                    val yTop = chartHeight - contactHeight
                    drawRoundRect(
                        color = VizContact,
                        topLeft = Offset(x, yTop),
                        size = Size(barWidth, contactHeight),
                        cornerRadius = CornerRadius(2.dp.toPx())
                    )
                }

                // Stacked internship bar on top
                if (day.internship > 0 && internshipHeight > 0f) {
                    val yTop = chartHeight - contactHeight - internshipHeight
                    drawRoundRect(
                        color = VizInternship,
                        topLeft = Offset(x, yTop),
                        size = Size(barWidth, internshipHeight),
                        cornerRadius = CornerRadius(2.dp.toPx())
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Dates footer
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = days.firstOrNull()?.label ?: "", fontSize = 10.sp, color = TextMutedDark)
            Text(text = "Tap any bar for details", fontSize = 10.sp, color = TextMutedDark)
            Text(text = "Today", fontSize = 10.sp, color = TextMutedDark)
        }
    }
}

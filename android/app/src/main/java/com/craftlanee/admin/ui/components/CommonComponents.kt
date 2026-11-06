package com.craftlanee.admin.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Archive
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.craftlanee.admin.ui.theme.BrandPrimary
import com.craftlanee.admin.ui.theme.EmeraldSuccess
import com.craftlanee.admin.ui.theme.RoseError
import com.craftlanee.admin.ui.theme.SurfaceAlt
import com.craftlanee.admin.ui.theme.SurfaceBorder
import com.craftlanee.admin.ui.theme.SurfaceDark
import com.craftlanee.admin.ui.theme.TextMutedDark
import com.craftlanee.admin.ui.theme.TextPrimaryDark
import com.craftlanee.admin.ui.theme.TextSecondaryDark
import com.craftlanee.admin.ui.theme.VizContact
import com.craftlanee.admin.ui.theme.VizInternship

@Composable
fun InitialAvatar(
    name: String,
    kind: String,
    modifier: Modifier = Modifier,
    size: Dp = 42.dp
) {
    val color = if (kind == "contact") VizContact else VizInternship
    val initials = name.trim().split("\\s+".toRegex())
        .filter { it.isNotBlank() }
        .take(2)
        .mapNotNull { it.firstOrNull()?.uppercaseChar() }
        .joinToString("")
        .ifEmpty { "?" }

    Box(
        modifier = modifier
            .size(size)
            .clip(RoundedCornerShape(12.dp))
            .background(color.copy(alpha = 0.15f)),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = initials,
            color = color,
            fontWeight = FontWeight.Bold,
            fontSize = (size.value * 0.38f).sp
        )
    }
}

@Composable
fun StageBadge(
    kind: String,
    status: String,
    modifier: Modifier = Modifier
) {
    val stages = listOf("new", "progress", "done")
    val stageLabels = if (kind == "contact") {
        mapOf("new" to "New", "progress" to "In talks", "done" to "Closed", "archived" to "Archived")
    } else {
        mapOf("new" to "New", "progress" to "Shortlisted", "done" to "Onboarded", "archived" to "Archived")
    }

    val label = stageLabels[status] ?: status
    val currentStep = stages.indexOf(status)

    Row(
        modifier = modifier
            .clip(RoundedCornerShape(100.dp))
            .border(1.dp, SurfaceBorder, RoundedCornerShape(100.dp))
            .padding(horizontal = 8.dp, vertical = 3.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        if (status == "archived") {
            Icon(
                imageVector = Icons.Default.Archive,
                contentDescription = null,
                modifier = Modifier.size(10.dp),
                tint = TextMutedDark
            )
        } else {
            Row(horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                stages.forEachIndexed { index, _ ->
                    val active = index <= currentStep
                    Box(
                        modifier = Modifier
                            .size(6.dp)
                            .clip(CircleShape)
                            .background(if (active) BrandPrimary else SurfaceBorder)
                    )
                }
            }
        }
        Text(
            text = label,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            color = TextSecondaryDark
        )
    }
}

@Composable
fun SparklineChart(
    values: List<Int>,
    color: Color,
    modifier: Modifier = Modifier
) {
    if (values.size < 2) return

    val animatedProgress by animateFloatAsState(
        targetValue = 1f,
        animationSpec = tween(durationMillis = 800),
        label = "sparklineProgress"
    )

    Canvas(modifier = modifier) {
        val width = size.width
        val height = size.height
        if (width <= 0f || height <= 0f) return@Canvas

        val maxVal = maxOf(1, values.maxOrNull() ?: 1).toFloat()

        val points = values.mapIndexed { index, value ->
            val x = (index.toFloat() / (values.size - 1)) * width
            val y = (height - 4f - (value.toFloat() / maxVal) * (height - 8f)).coerceIn(4f, height - 4f)
            Offset(x, y)
        }

        val strokePath = Path().apply {
            moveTo(points.first().x, points.first().y)
            for (i in 1 until points.size) {
                val p0 = points[i - 1]
                val p1 = points[i]
                val midX = (p0.x + p1.x) / 2
                cubicTo(midX, p0.y, midX, p1.y, p1.x, p1.y)
            }
        }

        val fillPath = Path().apply {
            addPath(strokePath)
            lineTo(width, height)
            lineTo(0f, height)
            close()
        }

        drawPath(
            path = fillPath,
            brush = Brush.verticalGradient(
                colors = listOf(color.copy(alpha = 0.25f * animatedProgress), Color.Transparent),
                startY = 0f,
                endY = height
            )
        )

        drawPath(
            path = strokePath,
            color = color,
            style = Stroke(width = 2.dp.toPx(), cap = StrokeCap.Round)
        )

        val lastPoint = points.last()
        drawCircle(
            color = color,
            radius = 3.dp.toPx(),
            center = lastPoint
        )
    }
}

@Composable
fun CircularProgressRing(
    percentage: Int,
    color: Color,
    modifier: Modifier = Modifier,
    size: Dp = 38.dp,
    strokeWidth: Dp = 4.dp
) {
    val sweepAngle by animateFloatAsState(
        targetValue = (percentage.coerceIn(0, 100) / 100f) * 360f,
        animationSpec = tween(durationMillis = 900),
        label = "ringProgress"
    )

    Box(modifier = modifier.size(size), contentAlignment = Alignment.Center) {
        Canvas(modifier = Modifier.size(size)) {
            val strokePx = strokeWidth.toPx()
            val minDim = minOf(this.size.width, this.size.height)
            if (minDim <= strokePx) return@Canvas

            val arcSize = Size(minDim - strokePx, minDim - strokePx)
            val topLeft = Offset((this.size.width - arcSize.width) / 2, (this.size.height - arcSize.height) / 2)

            // Background track
            drawArc(
                color = SurfaceBorder,
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokePx)
            )

            // Progress arc
            drawArc(
                color = color,
                startAngle = -90f,
                sweepAngle = sweepAngle,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokePx, cap = StrokeCap.Round)
            )
        }
    }
}

@Composable
fun StatTile(
    label: String,
    value: String,
    modifier: Modifier = Modifier,
    delta: Int? = null,
    note: String? = null,
    isWarning: Boolean = false,
    sparklineValues: List<Int>? = null,
    sparklineColor: Color? = null,
    ringPercentage: Int? = null
) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(20.dp))
            .background(SurfaceDark)
            .border(1.dp, SurfaceBorder, RoundedCornerShape(20.dp))
            .padding(16.dp)
            .heightIn(min = 120.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Text(
                text = label,
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                color = TextMutedDark,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = value,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimaryDark,
                    lineHeight = 28.sp,
                    modifier = Modifier.weight(1f, fill = false)
                )

                Spacer(modifier = Modifier.width(8.dp))

                if (sparklineValues != null && sparklineColor != null) {
                    SparklineChart(
                        values = sparklineValues,
                        color = sparklineColor,
                        modifier = Modifier
                            .width(80.dp)
                            .height(30.dp)
                    )
                } else if (ringPercentage != null) {
                    CircularProgressRing(
                        percentage = ringPercentage,
                        color = BrandPrimary,
                        size = 36.dp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        if (delta != null) {
            val deltaText = if (delta > 0) "▲ $delta" else if (delta < 0) "▼ ${-delta}" else "— 0"
            val deltaColor = if (delta > 0) EmeraldSuccess else if (delta < 0) RoseError else TextMutedDark
            Text(
                text = "$deltaText vs prev 30 days",
                fontSize = 11.sp,
                color = deltaColor,
                fontWeight = FontWeight.SemiBold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        } else if (note != null) {
            Text(
                text = note,
                fontSize = 11.sp,
                color = if (isWarning) RoseError else TextMutedDark,
                fontWeight = if (isWarning) FontWeight.Bold else FontWeight.Normal,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
fun BarList(
    items: List<Pair<String, Int>>,
    color: Color,
    emptyMessage: String,
    modifier: Modifier = Modifier
) {
    if (items.isEmpty()) {
        Box(
            modifier = modifier
                .fillMaxWidth()
                .padding(vertical = 24.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = emptyMessage,
                fontSize = 13.sp,
                color = TextMutedDark
            )
        }
        return
    }

    val maxCount = maxOf(1, items.maxOfOrNull { it.second } ?: 1)

    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items.forEach { (label, count) ->
            val fraction = (count.toFloat() / maxCount).coerceIn(0.05f, 1f)
            Column(modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = label,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        color = TextSecondaryDark,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.weight(1f)
                    )
                    Text(
                        text = count.toString(),
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimaryDark
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(6.dp)
                        .clip(RoundedCornerShape(100.dp))
                        .background(SurfaceAlt)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(fraction)
                            .fillMaxHeight()
                            .clip(RoundedCornerShape(100.dp))
                            .background(color)
                    )
                }
            }
        }
    }
}

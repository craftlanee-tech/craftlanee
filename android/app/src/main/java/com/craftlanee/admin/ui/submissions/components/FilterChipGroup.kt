package com.craftlanee.admin.ui.submissions.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.craftlanee.admin.data.model.SubmissionCounts
import com.craftlanee.admin.ui.theme.BrandPrimary
import com.craftlanee.admin.ui.theme.SurfaceAlt
import com.craftlanee.admin.ui.theme.SurfaceBorder
import com.craftlanee.admin.ui.theme.TextMutedDark
import com.craftlanee.admin.ui.theme.TextPrimaryDark

data class FilterItem(
    val id: String,
    val label: String,
    val count: Int
)

@Composable
fun FilterChipGroup(
    kind: String,
    currentFilter: String,
    counts: SubmissionCounts,
    onFilterSelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val filters = listOf(
        FilterItem("active", "All", counts.active),
        FilterItem("new", "New", counts.new),
        FilterItem("progress", if (kind == "contact") "In talks" else "Shortlisted", counts.progress),
        FilterItem("done", if (kind == "contact") "Closed" else "Onboarded", counts.done),
        FilterItem("starred", "Starred", counts.starred),
        FilterItem("archived", "Archived", counts.archived)
    )

    Row(
        modifier = modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        filters.forEach { item ->
            val isSelected = currentFilter == item.id
            val bgColor = if (isSelected) BrandPrimary else SurfaceAlt
            val textColor = if (isSelected) TextPrimaryDark else TextMutedDark
            val countBg = if (isSelected) BrandPrimary.copy(alpha = 0.8f) else SurfaceBorder

            Row(
                modifier = Modifier
                    .heightIn(min = 40.dp)
                    .clip(RoundedCornerShape(100.dp))
                    .background(bgColor)
                    .border(1.dp, if (isSelected) BrandPrimary else SurfaceBorder, RoundedCornerShape(100.dp))
                    .clickable { onFilterSelected(item.id) }
                    .padding(horizontal = 14.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Text(
                    text = item.label,
                    fontSize = 13.sp,
                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                    color = textColor
                )
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(100.dp))
                        .background(countBg)
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = item.count.toString(),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = textColor
                    )
                }
            }
        }
    }
}

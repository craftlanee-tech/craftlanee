package com.craftlanee.admin.ui.overview

import androidx.compose.foundation.Image
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
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Mail
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshContainer
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.craftlanee.admin.R
import com.craftlanee.admin.data.model.OverviewResponse
import com.craftlanee.admin.data.model.PipelineSummary
import com.craftlanee.admin.data.model.Submission
import com.craftlanee.admin.ui.components.BarChart30Days
import com.craftlanee.admin.ui.components.BarList
import com.craftlanee.admin.ui.components.InitialAvatar
import com.craftlanee.admin.ui.components.SkeletonOverview
import com.craftlanee.admin.ui.components.StatTile
import com.craftlanee.admin.ui.theme.AdminInk
import com.craftlanee.admin.ui.theme.AmberWarning
import com.craftlanee.admin.ui.theme.BrandPrimary
import com.craftlanee.admin.ui.theme.LocalWindowSizeInfo
import com.craftlanee.admin.ui.theme.SurfaceAlt
import com.craftlanee.admin.ui.theme.SurfaceBorder
import com.craftlanee.admin.ui.theme.SurfaceDark
import com.craftlanee.admin.ui.theme.TextMutedDark
import com.craftlanee.admin.ui.theme.TextPrimaryDark
import com.craftlanee.admin.ui.theme.TextSecondaryDark
import com.craftlanee.admin.ui.theme.VizContact
import com.craftlanee.admin.ui.theme.VizInternship

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OverviewScreen(
    viewModel: OverviewViewModel,
    onNavigateToContacts: () -> Unit,
    onNavigateToInternships: () -> Unit,
    onNavigateToHero: () -> Unit,
    onSelectSubmission: (Submission) -> Unit,
    modifier: Modifier = Modifier
) {
    val windowSizeInfo = LocalWindowSizeInfo.current
    val uiState by viewModel.uiState.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }
    val pullRefreshState = rememberPullToRefreshState()

    LaunchedEffect(Unit) {
        if (uiState.overview == null) {
            viewModel.refresh()
        }
    }

    if (pullRefreshState.isRefreshing) {
        LaunchedEffect(true) {
            viewModel.refresh()
        }
    }

    LaunchedEffect(uiState.isRefreshing) {
        if (!uiState.isRefreshing) {
            pullRefreshState.endRefresh()
        }
    }

    LaunchedEffect(uiState.error) {
        uiState.error?.let { err ->
            snackbarHostState.showSnackbar(err)
            viewModel.clearError()
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        containerColor = AdminInk,
        modifier = modifier
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .nestedScroll(pullRefreshState.nestedScrollConnection)
        ) {
            if (uiState.overview == null && uiState.isRefreshing) {
                SkeletonOverview()
            } else {
                val data = uiState.overview ?: OverviewResponse()

                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    item {
                        Spacer(modifier = Modifier.height(8.dp))
                        // Header
                        OverviewHeader(
                            greeting = data.greeting.ifBlank { "Good day" },
                            stamp = data.stamp.ifBlank { "IST" },
                            awaitingCount = data.kpi.awaitingCount,
                            oldestAwaiting = data.oldestAwaiting.firstOrNull(),
                            onNavigateToContacts = onNavigateToContacts,
                            onNavigateToHero = onNavigateToHero
                        )
                    }

                    // Signature Ink Pipeline Card
                    item {
                        PipelineSignatureCard(
                            pipeline = data.pipeline,
                            totalRecords = data.kpi.totalCount,
                            onNavigateToContacts = onNavigateToContacts,
                            onNavigateToInternships = onNavigateToInternships
                        )
                    }

                    // Adaptive KPI Tiles
                    item {
                        val tile1 = @Composable {
                            StatTile(
                                label = "Awaiting reply",
                                value = data.kpi.awaitingCount.toString(),
                                note = if (data.kpi.overdueCount > 0) "${data.kpi.overdueCount} older than 3 days"
                                       else if (data.kpi.awaitingCount > 0) "All within 3 days"
                                       else "Nothing pending",
                                isWarning = data.kpi.overdueCount > 0,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                        val tile2 = @Composable {
                            StatTile(
                                label = "Lead close rate",
                                value = "${data.kpi.closeRate}%",
                                note = "${data.kpi.closedCount} of ${data.kpi.decidedCount} closed",
                                ringPercentage = data.kpi.closeRate,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                        val tile3 = @Composable {
                            StatTile(
                                label = "Leads · 30 days",
                                value = data.kpi.leads30.toString(),
                                delta = data.kpi.leadsDelta,
                                sparklineValues = data.sparklines.contacts,
                                sparklineColor = VizContact,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                        val tile4 = @Composable {
                            StatTile(
                                label = "Apps · 30 days",
                                value = data.kpi.apps30.toString(),
                                delta = data.kpi.appsDelta,
                                sparklineValues = data.sparklines.internships,
                                sparklineColor = VizInternship,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        when {
                            // Ultra-narrow screens or font scale > 1.35f: 1-column vertical stack
                            windowSizeInfo.isUltraNarrow -> {
                                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                                    tile1()
                                    tile2()
                                    tile3()
                                    tile4()
                                }
                            }
                            // Wide screens (>= 600dp Medium & Expanded): 4-column single row
                            windowSizeInfo.isWide -> {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                                ) {
                                    Box(modifier = Modifier.weight(1f)) { tile1() }
                                    Box(modifier = Modifier.weight(1f)) { tile2() }
                                    Box(modifier = Modifier.weight(1f)) { tile3() }
                                    Box(modifier = Modifier.weight(1f)) { tile4() }
                                }
                            }
                            // Standard Compact portrait phones: 2x2 grid
                            else -> {
                                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                                    ) {
                                        Box(modifier = Modifier.weight(1f)) { tile1() }
                                        Box(modifier = Modifier.weight(1f)) { tile2() }
                                    }
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                                    ) {
                                        Box(modifier = Modifier.weight(1f)) { tile3() }
                                        Box(modifier = Modifier.weight(1f)) { tile4() }
                                    }
                                }
                            }
                        }
                    }

                    // 30 Days Interactive Stacked Bar Chart
                    item {
                        BarChart30Days(days = data.activityDays)
                    }

                    // Waiting Longest Panel
                    if (data.oldestAwaiting.isNotEmpty()) {
                        item {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(24.dp))
                                    .background(SurfaceDark)
                                    .border(1.dp, SurfaceBorder, RoundedCornerShape(24.dp))
                                    .padding(18.dp)
                            ) {
                                Text(
                                    text = "Waiting longest",
                                    fontSize = 17.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimaryDark
                                )
                                Text(
                                    text = "Oldest unanswered enquiries first",
                                    fontSize = 12.sp,
                                    color = TextMutedDark
                                )

                                Spacer(modifier = Modifier.height(14.dp))

                                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                    data.oldestAwaiting.forEach { sub ->
                                        Row(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .clip(RoundedCornerShape(14.dp))
                                                .clickable { onSelectSubmission(sub) }
                                                .padding(8.dp),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            InitialAvatar(name = sub.displayName, kind = sub.kind, size = 38.dp)
                                            Spacer(modifier = Modifier.width(12.dp))
                                            Column(modifier = Modifier.weight(1f)) {
                                                Text(
                                                    text = sub.displayName,
                                                    fontSize = 14.sp,
                                                    fontWeight = FontWeight.SemiBold,
                                                    color = TextPrimaryDark,
                                                    maxLines = 1,
                                                    overflow = TextOverflow.Ellipsis
                                                )
                                                Text(
                                                    text = sub.subtitle,
                                                    fontSize = 12.sp,
                                                    color = TextMutedDark,
                                                    maxLines = 1,
                                                    overflow = TextOverflow.Ellipsis
                                                )
                                            }
                                            Box(
                                                modifier = Modifier
                                                    .clip(RoundedCornerShape(100.dp))
                                                    .background(AmberWarning.copy(alpha = 0.12f))
                                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                                            ) {
                                                Text(
                                                    text = "Waiting",
                                                    fontSize = 11.sp,
                                                    color = AmberWarning,
                                                    fontWeight = FontWeight.SemiBold
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Services & Domains In Demand (Responsive 2-column on Wide screens)
                    item {
                        val servicesCard = @Composable {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(24.dp))
                                    .background(SurfaceDark)
                                    .border(1.dp, SurfaceBorder, RoundedCornerShape(24.dp))
                                    .padding(18.dp)
                            ) {
                                Text(
                                    text = "Services in demand",
                                    fontSize = 17.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimaryDark
                                )
                                Text(
                                    text = "What contact leads ask for",
                                    fontSize = 12.sp,
                                    color = TextMutedDark
                                )
                                Spacer(modifier = Modifier.height(14.dp))
                                BarList(
                                    items = data.servicesInDemand.map { it.label to it.count },
                                    color = VizContact,
                                    emptyMessage = "No service requests recorded yet"
                                )
                            }
                        }

                        val internshipCard = @Composable {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(24.dp))
                                    .background(SurfaceDark)
                                    .border(1.dp, SurfaceBorder, RoundedCornerShape(24.dp))
                                    .padding(18.dp)
                            ) {
                                Text(
                                    text = "Internship domains",
                                    fontSize = 17.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimaryDark
                                )
                                Text(
                                    text = "Where students want to grow",
                                    fontSize = 12.sp,
                                    color = TextMutedDark
                                )
                                Spacer(modifier = Modifier.height(14.dp))
                                BarList(
                                    items = data.internshipDomains.map { it.label to it.count },
                                    color = VizInternship,
                                    emptyMessage = "No student applications recorded yet"
                                )
                            }
                        }

                        if (windowSizeInfo.isWide) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(16.dp)
                            ) {
                                Box(modifier = Modifier.weight(1f)) { servicesCard() }
                                Box(modifier = Modifier.weight(1f)) { internshipCard() }
                            }
                        } else {
                            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                                servicesCard()
                                internshipCard()
                            }
                        }
                    }

                    item {
                        Spacer(modifier = Modifier.height(24.dp))
                    }
                }
            }

            PullToRefreshContainer(
                state = pullRefreshState,
                modifier = Modifier.align(Alignment.TopCenter),
                containerColor = SurfaceDark,
                contentColor = BrandPrimary
            )
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun OverviewHeader(
    greeting: String,
    stamp: String,
    awaitingCount: Int,
    oldestAwaiting: Submission?,
    onNavigateToContacts: () -> Unit,
    onNavigateToHero: () -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Image(
                painter = painterResource(id = R.drawable.craftlanee_logo_white),
                contentDescription = "CraftLanee",
                modifier = Modifier.height(28.dp),
                contentScale = ContentScale.Fit
            )

            Text(
                text = stamp.uppercase(),
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                letterSpacing = 1.5.sp,
                color = TextMutedDark
            )
        }

        Spacer(modifier = Modifier.height(10.dp))

        Text(
            text = "$greeting.",
            fontSize = 30.sp,
            fontWeight = FontWeight.Bold,
            color = TextPrimaryDark
        )

        Spacer(modifier = Modifier.height(6.dp))

        if (awaitingCount == 0) {
            Text(
                text = "Inbox zero. Every enquiry has been picked up.",
                fontSize = 14.sp,
                color = TextSecondaryDark
            )
        } else {
            Text(
                text = "$awaitingCount enquiries waiting for review." +
                        if (oldestAwaiting != null) " Oldest: ${oldestAwaiting.displayName}" else "",
                fontSize = 14.sp,
                color = TextSecondaryDark
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(
                onClick = onNavigateToContacts,
                colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.heightIn(min = 42.dp)
            ) {
                Icon(imageVector = Icons.Default.Mail, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("Open Inbox", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
            }

            Button(
                onClick = onNavigateToHero,
                colors = ButtonDefaults.buttonColors(containerColor = SurfaceAlt),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.heightIn(min = 42.dp)
            ) {
                Icon(imageVector = Icons.Default.Image, contentDescription = null, modifier = Modifier.size(16.dp), tint = TextSecondaryDark)
                Spacer(modifier = Modifier.width(6.dp))
                Text("Homepage Hero", fontSize = 13.sp, color = TextPrimaryDark, fontWeight = FontWeight.SemiBold)
            }
        }
    }
}

@Composable
fun PipelineSignatureCard(
    pipeline: com.craftlanee.admin.data.model.PipelineContainer,
    totalRecords: Int,
    onNavigateToContacts: () -> Unit,
    onNavigateToInternships: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .background(
                Brush.linearGradient(
                    colors = listOf(Color(0xFF0D1226), Color(0xFF07091A))
                )
            )
            .border(1.dp, SurfaceBorder, RoundedCornerShape(24.dp))
            .padding(20.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "PIPELINE",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 2.sp,
                    color = Color.White.copy(alpha = 0.5f)
                )
                Text(
                    text = "Where every enquiry stands",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }
            Text(
                text = "$totalRecords records all-time",
                fontSize = 12.sp,
                color = Color.White.copy(alpha = 0.5f)
            )
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Contact Leads Row
        PipelineTrackItem(
            title = "Contact leads",
            summary = pipeline.contacts,
            color = VizContact,
            onClick = onNavigateToContacts
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Internship Applications Row
        PipelineTrackItem(
            title = "Internships",
            summary = pipeline.internships,
            color = VizInternship,
            onClick = onNavigateToInternships
        )
    }
}

@Composable
fun PipelineTrackItem(
    title: String,
    summary: PipelineSummary,
    color: Color,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(Color.White.copy(alpha = 0.04f))
            .border(1.dp, Color.White.copy(alpha = 0.08f), RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(14.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(28.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(color.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(color))
                }
                Spacer(modifier = Modifier.width(10.dp))
                Text(text = title, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
            }
            Text(
                text = "${summary.conversion}% converted →",
                fontSize = 12.sp,
                color = Color.White.copy(alpha = 0.6f)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            summary.stages.forEach { stage ->
                Column(
                    modifier = Modifier.weight(1f),
                    horizontalAlignment = Alignment.Start
                ) {
                    Text(
                        text = stage.label.uppercase(),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium,
                        letterSpacing = 1.sp,
                        color = Color.White.copy(alpha = 0.45f),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = stage.count.toString(),
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Segmented ramp bar
        val total = maxOf(1, summary.total)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(5.dp)
                .clip(RoundedCornerShape(100.dp))
                .background(Color.White.copy(alpha = 0.08f)),
            horizontalArrangement = Arrangement.spacedBy(2.dp)
        ) {
            val alphas = listOf(0.35f, 0.65f, 1f)
            summary.stages.forEachIndexed { index, stage ->
                if (stage.count > 0) {
                    val weight = (stage.count.toFloat() / total).coerceAtLeast(0.01f)
                    Box(
                        modifier = Modifier
                            .weight(weight)
                            .fillMaxHeight()
                            .background(color.copy(alpha = alphas.getOrElse(index) { 1f }))
                    )
                }
            }
        }
    }
}

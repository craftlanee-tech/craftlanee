package com.craftlanee.admin.ui.submissions

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Inbox
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.ViewKanban
import androidx.compose.material.icons.filled.ViewList
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshContainer
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.material3.rememberModalBottomSheetState
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.craftlanee.admin.data.model.Submission
import com.craftlanee.admin.ui.components.InitialAvatar
import com.craftlanee.admin.ui.components.SkeletonSubmissionItem
import com.craftlanee.admin.ui.components.StageBadge
import com.craftlanee.admin.ui.submissions.components.FilterChipGroup
import com.craftlanee.admin.ui.submissions.components.SubmissionDetailSheet
import com.craftlanee.admin.ui.submissions.components.SubmissionKanbanBoard
import com.craftlanee.admin.ui.theme.AdminInk
import com.craftlanee.admin.ui.theme.BrandPrimary
import com.craftlanee.admin.ui.theme.GoldStar
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
fun SubmissionsScreen(
    viewModel: SubmissionsViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }
    val pullRefreshState = rememberPullToRefreshState()
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var facetDropdownExpanded by remember { mutableStateOf(false) }

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

    LaunchedEffect(uiState.toastMessage) {
        uiState.toastMessage?.let { msg ->
            snackbarHostState.showSnackbar(msg)
            viewModel.clearToast()
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
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp)
            ) {
                Spacer(modifier = Modifier.height(12.dp))

                // Title & Top Tool Bar
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (uiState.kind == "contact") "BUSINESS ENQUIRIES" else "STUDENT REGISTRATIONS",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.5.sp,
                            color = TextMutedDark
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = if (uiState.kind == "contact") "Contact leads" else "Internship applications",
                                fontSize = 22.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimaryDark,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = uiState.items.size.toString(),
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextMutedDark
                            )
                        }
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        // Switch between List and Board (min touch target 48dp)
                        IconButton(
                            onClick = {
                                viewModel.setViewMode(if (uiState.viewMode == "list") "board" else "list")
                            },
                            modifier = Modifier
                                .size(48.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(SurfaceAlt)
                        ) {
                            Icon(
                                imageVector = if (uiState.viewMode == "list") Icons.Default.ViewKanban else Icons.Default.ViewList,
                                contentDescription = "Toggle View",
                                tint = TextSecondaryDark,
                                modifier = Modifier.size(22.dp)
                            )
                        }

                        // Export CSV (min touch target 48dp)
                        IconButton(
                            onClick = { viewModel.exportCsv() },
                            modifier = Modifier
                                .size(48.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(SurfaceAlt)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Download,
                                contentDescription = "Export CSV",
                                tint = TextSecondaryDark,
                                modifier = Modifier.size(22.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Search Bar & Facet Filter
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedTextField(
                        value = uiState.query,
                        onValueChange = { viewModel.setQuery(it) },
                        placeholder = { Text("Search name, email, notes…", fontSize = 13.sp, color = TextMutedDark) },
                        modifier = Modifier
                            .weight(1f)
                            .heightIn(min = 50.dp),
                        shape = RoundedCornerShape(14.dp),
                        leadingIcon = {
                            Icon(imageVector = Icons.Default.Search, contentDescription = null, tint = TextMutedDark, modifier = Modifier.size(18.dp))
                        },
                        trailingIcon = {
                            if (uiState.query.isNotBlank()) {
                                IconButton(
                                    onClick = { viewModel.setQuery("") },
                                    modifier = Modifier.size(48.dp)
                                ) {
                                    Icon(imageVector = Icons.Default.Clear, contentDescription = "Clear", tint = TextMutedDark, modifier = Modifier.size(16.dp))
                                }
                            }
                        },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = SurfaceDark,
                            unfocusedContainerColor = SurfaceDark,
                            focusedBorderColor = BrandPrimary,
                            unfocusedBorderColor = SurfaceBorder,
                            focusedTextColor = TextPrimaryDark,
                            unfocusedTextColor = TextPrimaryDark
                        )
                    )

                    // Facet dropdown
                    if (uiState.facets.isNotEmpty()) {
                        Box {
                            IconButton(
                                onClick = { facetDropdownExpanded = true },
                                modifier = Modifier
                                    .size(50.dp)
                                    .clip(RoundedCornerShape(14.dp))
                                    .background(if (uiState.facet.isNotBlank()) BrandPrimary.copy(alpha = 0.2f) else SurfaceDark)
                                    .border(1.dp, if (uiState.facet.isNotBlank()) BrandPrimary else SurfaceBorder, RoundedCornerShape(14.dp))
                            ) {
                                Icon(
                                    imageVector = Icons.Default.FilterList,
                                    contentDescription = "Filter by Facet",
                                    tint = if (uiState.facet.isNotBlank()) BrandPrimary else TextMutedDark
                                )
                            }

                            DropdownMenu(
                                expanded = facetDropdownExpanded,
                                onDismissRequest = { facetDropdownExpanded = false },
                                modifier = Modifier.background(SurfaceDark)
                            ) {
                                DropdownMenuItem(
                                    text = { Text("All Categories", color = TextPrimaryDark) },
                                    onClick = {
                                        viewModel.setFacet("")
                                        facetDropdownExpanded = false
                                    }
                                )
                                uiState.facets.forEach { facetOption ->
                                    DropdownMenuItem(
                                        text = { Text(facetOption, color = TextPrimaryDark) },
                                        onClick = {
                                            viewModel.setFacet(facetOption)
                                            facetDropdownExpanded = false
                                        }
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Filter Chip Tabs
                FilterChipGroup(
                    kind = uiState.kind,
                    currentFilter = uiState.filter,
                    counts = uiState.counts,
                    onFilterSelected = { viewModel.setFilter(it) }
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Content: List View or Kanban Board View
                if (uiState.isRefreshing && uiState.items.isEmpty()) {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        repeat(5) { SkeletonSubmissionItem() }
                    }
                } else if (uiState.viewMode == "board") {
                    SubmissionKanbanBoard(
                        kind = uiState.kind,
                        items = uiState.items,
                        onSelectSubmission = { viewModel.selectSubmission(it) },
                        onMoveStatus = { id, nextStatus -> viewModel.updateStatus(id, nextStatus) },
                        modifier = Modifier.weight(1f)
                    )
                } else {
                    if (uiState.items.isEmpty()) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .weight(1f),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Box(
                                    modifier = Modifier
                                        .size(60.dp)
                                        .clip(RoundedCornerShape(18.dp))
                                        .background(SurfaceAlt),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(imageVector = Icons.Default.Inbox, contentDescription = null, tint = TextMutedDark, modifier = Modifier.size(28.dp))
                                }
                                Spacer(modifier = Modifier.height(14.dp))
                                Text(
                                    text = "No enquiries found",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimaryDark
                                )
                                Text(
                                    text = "Nothing matches your selected filter or query.",
                                    fontSize = 13.sp,
                                    color = TextMutedDark
                                )
                            }
                        }
                    } else {
                        LazyColumn(
                            modifier = Modifier.weight(1f),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            items(uiState.items, key = { it.id }) { item ->
                                SubmissionListItem(
                                    item = item,
                                    onClick = { viewModel.selectSubmission(item) }
                                )
                            }
                            item {
                                Spacer(modifier = Modifier.height(16.dp))
                            }
                        }
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

        // Detail Bottom Sheet
        uiState.selectedSubmission?.let { submission ->
            SubmissionDetailSheet(
                submission = submission,
                sheetState = sheetState,
                notesSaveState = uiState.notesSaveState,
                onDismiss = { viewModel.selectSubmission(null) },
                onToggleStar = { id, currentStarred -> viewModel.toggleStarred(id, currentStarred) },
                onUpdateStatus = { id, nextStatus -> viewModel.updateStatus(id, nextStatus) },
                onNotesChanged = { id, notes -> viewModel.onNotesChanged(id, notes) },
                onDelete = { id -> viewModel.deleteSubmission(id) }
            )
        }
    }
}

@Composable
fun SubmissionListItem(
    item: Submission,
    onClick: () -> Unit
) {
    val isUnread = item.status == "new"

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(SurfaceDark)
            .border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(14.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.Top
    ) {
        InitialAvatar(name = item.displayName, kind = item.kind, size = 44.dp)

        Column(modifier = Modifier.weight(1f)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                    if (isUnread) {
                        Box(
                            modifier = Modifier
                                .size(7.dp)
                                .clip(CircleShape)
                                .background(if (item.kind == "contact") VizContact else VizInternship)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                    }
                    Text(
                        text = item.displayName,
                        fontSize = 14.sp,
                        fontWeight = if (isUnread) FontWeight.Bold else FontWeight.SemiBold,
                        color = TextPrimaryDark,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                Text(
                    text = item.createdAt.take(10),
                    fontSize = 11.sp,
                    color = TextMutedDark
                )
            }

            Spacer(modifier = Modifier.height(2.dp))

            Text(
                text = item.subtitle,
                fontSize = 12.sp,
                color = TextSecondaryDark,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            if (item.displayMessage.isNotBlank()) {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = item.displayMessage,
                    fontSize = 12.sp,
                    color = TextMutedDark,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                StageBadge(kind = item.kind, status = item.status)

                if (item.starred) {
                    Icon(
                        imageVector = Icons.Default.Star,
                        contentDescription = "Starred",
                        tint = GoldStar,
                        modifier = Modifier.size(13.dp)
                    )
                }

                if (item.notes.isNotBlank()) {
                    Text(
                        text = "· has notes",
                        fontSize = 11.sp,
                        color = TextMutedDark
                    )
                }
            }
        }
    }
}

package com.craftlanee.admin.data.model

import kotlinx.serialization.Serializable

@Serializable
data class KpiData(
    val awaitingCount: Int = 0,
    val overdueCount: Int = 0,
    val leads30: Int = 0,
    val leadsDelta: Int = 0,
    val apps30: Int = 0,
    val appsDelta: Int = 0,
    val closeRate: Int = 0,
    val closedCount: Int = 0,
    val decidedCount: Int = 0,
    val totalCount: Int = 0
)

@Serializable
data class SparklineData(
    val contacts: List<Int> = emptyList(),
    val internships: List<Int> = emptyList()
)

@Serializable
data class StageCount(
    val stage: String,
    val label: String,
    val count: Int
)

@Serializable
data class PipelineSummary(
    val total: Int = 0,
    val conversion: Int = 0,
    val stages: List<StageCount> = emptyList()
)

@Serializable
data class PipelineContainer(
    val contacts: PipelineSummary = PipelineSummary(),
    val internships: PipelineSummary = PipelineSummary()
)

@Serializable
data class ActivityDay(
    val key: String,
    val label: String,
    val contact: Int = 0,
    val internship: Int = 0
)

@Serializable
data class CountItem(
    val label: String,
    val count: Int
)

@Serializable
data class OverviewResponse(
    val timestamp: Long = 0,
    val stamp: String = "",
    val greeting: String = "",
    val kpi: KpiData = KpiData(),
    val sparklines: SparklineData = SparklineData(),
    val pipeline: PipelineContainer = PipelineContainer(),
    val activityDays: List<ActivityDay> = emptyList(),
    val oldestAwaiting: List<Submission> = emptyList(),
    val servicesInDemand: List<CountItem> = emptyList(),
    val internshipDomains: List<CountItem> = emptyList()
)

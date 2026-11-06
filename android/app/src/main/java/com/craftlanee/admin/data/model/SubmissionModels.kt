package com.craftlanee.admin.data.model

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonPrimitive

@Serializable
data class ContactData(
    val name: String = "",
    val businessName: String = "",
    val mobile: String = "",
    val email: String = "",
    val serviceNeeded: List<String> = emptyList(),
    val serviceTypes: List<String> = emptyList(),
    val message: String = ""
)

@Serializable
data class InternshipData(
    val name: String = "",
    val email: String = "",
    val mobile: String = "",
    val college: String = "",
    val course: String = "",
    val yearOfStudy: String = "",
    val domain: String = "",
    val mode: String = "",
    val duration: String = "",
    val message: String = ""
)

@Serializable
data class Submission(
    val id: String,
    val kind: String, // "contact" | "internship"
    val createdAt: String,
    val updatedAt: String = "",
    val status: String = "new", // "new" | "progress" | "done" | "archived"
    val starred: Boolean = false,
    val notes: String = "",
    val data: JsonObject
) {
    val isContact: Boolean get() = kind == "contact"
    val isInternship: Boolean get() = kind == "internship"

    val contactData: ContactData?
        get() = if (isContact) {
            ContactData(
                name = data["name"]?.jsonPrimitive?.content.orEmpty(),
                businessName = data["businessName"]?.jsonPrimitive?.content.orEmpty(),
                mobile = data["mobile"]?.jsonPrimitive?.content.orEmpty(),
                email = data["email"]?.jsonPrimitive?.content.orEmpty(),
                serviceNeeded = data["serviceNeeded"]?.jsonArray?.map { it.jsonPrimitive.content } ?: emptyList(),
                serviceTypes = data["serviceTypes"]?.jsonArray?.map { it.jsonPrimitive.content } ?: emptyList(),
                message = data["message"]?.jsonPrimitive?.content.orEmpty()
            )
        } else null

    val internshipData: InternshipData?
        get() = if (isInternship) {
            InternshipData(
                name = data["name"]?.jsonPrimitive?.content.orEmpty(),
                email = data["email"]?.jsonPrimitive?.content.orEmpty(),
                mobile = data["mobile"]?.jsonPrimitive?.content.orEmpty(),
                college = data["college"]?.jsonPrimitive?.content.orEmpty(),
                course = data["course"]?.jsonPrimitive?.content.orEmpty(),
                yearOfStudy = data["yearOfStudy"]?.jsonPrimitive?.content.orEmpty(),
                domain = data["domain"]?.jsonPrimitive?.content.orEmpty(),
                mode = data["mode"]?.jsonPrimitive?.content.orEmpty(),
                duration = data["duration"]?.jsonPrimitive?.content.orEmpty(),
                message = data["message"]?.jsonPrimitive?.content.orEmpty()
            )
        } else null

    val displayName: String
        get() = data["name"]?.jsonPrimitive?.content.orEmpty().ifBlank { "Anonymous" }

    val subtitle: String
        get() = if (isContact) {
            data["businessName"]?.jsonPrimitive?.content.orEmpty().ifBlank { "Contact Lead" }
        } else {
            val domain = data["domain"]?.jsonPrimitive?.content.orEmpty()
            val college = data["college"]?.jsonPrimitive?.content.orEmpty()
            listOf(domain, college).filter { it.isNotBlank() }.joinToString(" · ")
        }

    val displayMobile: String
        get() = data["mobile"]?.jsonPrimitive?.content.orEmpty()

    val displayEmail: String
        get() = data["email"]?.jsonPrimitive?.content.orEmpty()

    val displayMessage: String
        get() = data["message"]?.jsonPrimitive?.content.orEmpty()

    val tags: List<String>
        get() = if (isContact) {
            contactData?.serviceNeeded ?: emptyList()
        } else {
            listOfNotNull(internshipData?.domain).filter { it.isNotBlank() }
        }
}

@Serializable
data class SubmissionCounts(
    val active: Int = 0,
    val new: Int = 0,
    val progress: Int = 0,
    val done: Int = 0,
    val starred: Int = 0,
    val archived: Int = 0
)

@Serializable
data class SubmissionListResponse(
    val items: List<Submission> = emptyList(),
    val total: Int = 0,
    val counts: SubmissionCounts = SubmissionCounts(),
    val facets: List<String> = emptyList()
)

@Serializable
data class SubmissionPatch(
    val status: String? = null,
    val starred: Boolean? = null,
    val notes: String? = null
)

@Serializable
data class SubmissionPatchResponse(
    val success: Boolean = false,
    val submission: Submission? = null,
    val error: String? = null
)

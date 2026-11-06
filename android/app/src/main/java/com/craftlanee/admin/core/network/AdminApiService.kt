package com.craftlanee.admin.core.network

import com.craftlanee.admin.data.model.GenericResponse
import com.craftlanee.admin.data.model.HeroUpdateResponse
import com.craftlanee.admin.data.model.LoginRequest
import com.craftlanee.admin.data.model.LoginResponse
import com.craftlanee.admin.data.model.OverviewResponse
import com.craftlanee.admin.data.model.SiteSettingsResponse
import com.craftlanee.admin.data.model.SubmissionListResponse
import com.craftlanee.admin.data.model.SubmissionPatch
import com.craftlanee.admin.data.model.SubmissionPatchResponse
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Multipart
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Path
import retrofit2.http.Query
import retrofit2.http.Streaming

interface AdminApiService {

    @POST("api/auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): Response<LoginResponse>

    @POST("api/auth/logout")
    suspend fun logout(): Response<GenericResponse>

    @GET("api/admin/overview")
    suspend fun getOverview(): Response<OverviewResponse>

    @GET("api/admin/submissions")
    suspend fun getSubmissions(
        @Query("kind") kind: String? = null,
        @Query("filter") filter: String? = null,
        @Query("query") query: String? = null,
        @Query("facet") facet: String? = null
    ): Response<SubmissionListResponse>

    @PATCH("api/admin/submissions/{id}")
    suspend fun patchSubmission(
        @Path("id") id: String,
        @Body patch: SubmissionPatch
    ): Response<SubmissionPatchResponse>

    @DELETE("api/admin/submissions/{id}")
    suspend fun deleteSubmission(
        @Path("id") id: String
    ): Response<GenericResponse>

    @GET("api/admin/site-settings")
    suspend fun getSiteSettings(): Response<SiteSettingsResponse>

    @Multipart
    @POST("api/admin/hero")
    suspend fun updateHero(
        @Part("mode") mode: RequestBody,
        @Part("fit") fit: RequestBody,
        @Part("alt") alt: RequestBody,
        @Part("primaryLabel") primaryLabel: RequestBody,
        @Part("primaryHref") primaryHref: RequestBody,
        @Part("secondaryLabel") secondaryLabel: RequestBody,
        @Part("secondaryHref") secondaryHref: RequestBody,
        @Part("secondaryVisible") secondaryVisible: RequestBody,
        @Part photo: MultipartBody.Part? = null,
        @Part("remove") remove: RequestBody? = null
    ): Response<HeroUpdateResponse>

    @Streaming
    @GET("api/admin/export")
    suspend fun exportCsv(
        @Query("type") type: String
    ): Response<ResponseBody>
}

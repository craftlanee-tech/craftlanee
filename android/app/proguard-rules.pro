# -----------------------------------------------------------------------------
# CraftLanee Admin Production ProGuard & R8 Optimization Rules
# -----------------------------------------------------------------------------

# General Attributes
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod,SourceFile,LineNumberTable

# -----------------------------------------------------------------------------
# Kotlinx Serialization Rules
# -----------------------------------------------------------------------------
-keepattributes *Annotation*,InnerClasses
-dontnote kotlinx.serialization.SerializationKt

# Keep serializable model classes & their companions and generated serializers
-keep class com.craftlanee.admin.data.model.** { *; }
-keepclassmembers class com.craftlanee.admin.data.model.** {
    *** Companion;
    *** $$serializer;
}
-keepclasseswithmembers class com.craftlanee.admin.data.model.** {
    kotlinx.serialization.KSerializer serializer(...);
}
-keep @kotlinx.serialization.Serializable class * { *; }
-keepclassmembers @kotlinx.serialization.Serializable class * {
    *** Companion;
    *** $$serializer;
}

# -----------------------------------------------------------------------------
# Retrofit 2 & OkHttp 3 Rules
# -----------------------------------------------------------------------------
-dontwarn okhttp3.**
-dontwarn retrofit2.**
-dontwarn okio.**

-keep class retrofit2.** { *; }
-keepclasseswithmembers interface com.craftlanee.admin.core.network.** { *; }
-keepattributes EnclosingMethod,InnerClasses,Signature
-keepclassmembers,allowshrinking,allowobfuscation interface * {
    @retrofit2.http.* <methods>;
}

# -----------------------------------------------------------------------------
# Room Database Rules
# -----------------------------------------------------------------------------
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class * { *; }
-keep @androidx.room.Dao interface * { *; }
-dontwarn androidx.room.paging.**

# -----------------------------------------------------------------------------
# AndroidX Security Crypto & Google Tink (EncryptedSharedPreferences)
# -----------------------------------------------------------------------------
-keep class androidx.security.crypto.** { *; }
-keep class com.google.crypto.tink.** { *; }
-dontwarn com.google.crypto.tink.**
-dontwarn androidx.security.crypto.**

# -----------------------------------------------------------------------------
# Kotlin Coroutines & WorkManager
# -----------------------------------------------------------------------------
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}
-keep class androidx.work.** { *; }
-keep class * extends androidx.work.Worker { *; }
-keep class * extends androidx.work.ListenableWorker { *; }

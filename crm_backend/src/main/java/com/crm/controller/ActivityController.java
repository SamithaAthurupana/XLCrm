package com.crm.controller;

import com.crm.dto.activity.ActivityResponse;
import com.crm.dto.activity.CreateActivityRequest;
import com.crm.dto.activity.UpdateActivityRequest;
import com.crm.dto.common.ApiResponse;
import com.crm.enums.ActivityType;
import com.crm.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/activities")
@RequiredArgsConstructor
@Tag(name = "Activities", description = "Activity / interaction tracking")
@SecurityRequirement(name = "bearerAuth")
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping
    @Operation(summary = "List activities with optional customer/deal/type filter")
    public ResponseEntity<ApiResponse<Page<ActivityResponse>>> getAllActivities(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long dealId,
            @RequestParam(required = false) ActivityType type,
            @PageableDefault(size = 20, sort = "occurredAt") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                activityService.getAllActivities(customerId, dealId, type, pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get activity by ID")
    public ResponseEntity<ApiResponse<ActivityResponse>> getActivityById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(activityService.getActivityById(id)));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Log a new activity")
    public ResponseEntity<ApiResponse<ActivityResponse>> createActivity(
            @Valid @RequestBody CreateActivityRequest request) {
        ActivityResponse response = activityService.createActivity(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Activity logged", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an activity")
    public ResponseEntity<ApiResponse<ActivityResponse>> updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody UpdateActivityRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Activity updated", activityService.updateActivity(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft-delete an activity")
    public ResponseEntity<ApiResponse<Void>> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
        return ResponseEntity.ok(ApiResponse.success("Activity deleted", null));
    }
}

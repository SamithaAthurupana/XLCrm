package com.crm.controller;

import com.crm.dto.common.ApiResponse;
import com.crm.dto.deal.CreateDealRequest;
import com.crm.dto.deal.DealResponse;
import com.crm.dto.deal.UpdateDealRequest;
import com.crm.enums.DealStage;
import com.crm.service.DealService;
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
@RequestMapping("/api/v1/deals")
@RequiredArgsConstructor
@Tag(name = "Deals", description = "Deal / Opportunity management")
@SecurityRequirement(name = "bearerAuth")
public class DealController {

    private final DealService dealService;

    @GetMapping
    @Operation(summary = "List deals with optional customer/stage filter")
    public ResponseEntity<ApiResponse<Page<DealResponse>>> getAllDeals(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) DealStage stage,
            @PageableDefault(size = 20, sort = "title") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(dealService.getAllDeals(customerId, stage, pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get deal by ID")
    public ResponseEntity<ApiResponse<DealResponse>> getDealById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(dealService.getDealById(id)));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new deal")
    public ResponseEntity<ApiResponse<DealResponse>> createDeal(@Valid @RequestBody CreateDealRequest request) {
        DealResponse response = dealService.createDeal(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Deal created", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update deal details")
    public ResponseEntity<ApiResponse<DealResponse>> updateDeal(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDealRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Deal updated", dealService.updateDeal(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft-delete a deal")
    public ResponseEntity<ApiResponse<Void>> deleteDeal(@PathVariable Long id) {
        dealService.deleteDeal(id);
        return ResponseEntity.ok(ApiResponse.success("Deal deleted", null));
    }
}

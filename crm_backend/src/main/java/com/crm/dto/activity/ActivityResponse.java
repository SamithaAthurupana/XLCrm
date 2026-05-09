package com.crm.dto.activity;

import com.crm.enums.ActivityType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ActivityResponse {
    private Long id;
    private ActivityType type;
    private String subject;
    private String notes;
    private LocalDateTime occurredAt;
    private Long customerId;
    private String customerName;
    private Long dealId;
    private String dealTitle;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

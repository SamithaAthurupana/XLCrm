package com.crm.dto.deal;

import com.crm.enums.DealStage;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class DealResponse {
    private Long id;
    private String title;
    private BigDecimal value;
    private DealStage stage;
    private LocalDate expectedCloseDate;
    private String notes;
    private Long customerId;
    private String customerName;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

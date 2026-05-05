package com.crm.dto.activity;

import com.crm.enums.ActivityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateActivityRequest {

    @NotNull(message = "Activity type is required")
    private ActivityType type;

    @NotBlank(message = "Subject is required")
    @Size(max = 200)
    private String subject;

    private String notes;

    @NotNull(message = "Occurred at timestamp is required")
    private LocalDateTime occurredAt;

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    private Long dealId;
}

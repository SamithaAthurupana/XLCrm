package com.crm.dto.activity;

import com.crm.enums.ActivityType;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateActivityRequest {

    private ActivityType type;

    @Size(max = 200)
    private String subject;

    private String notes;

    private LocalDateTime occurredAt;

    private Long dealId;
}

package com.crm.dto.deal;

import com.crm.enums.DealStage;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateDealRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    @NotNull(message = "Value is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Value must be non-negative")
    @Digits(integer = 13, fraction = 2)
    private BigDecimal value;

    private DealStage stage = DealStage.PROSPECTING;

    private LocalDate expectedCloseDate;

    private String notes;

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    private Long ownerId;
}

package com.crm.dto.deal;

import com.crm.enums.DealStage;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateDealRequest {

    @Size(max = 200)
    private String title;

    @DecimalMin(value = "0.0", inclusive = true)
    @Digits(integer = 13, fraction = 2)
    private BigDecimal value;

    private DealStage stage;

    private LocalDate expectedCloseDate;

    private String notes;

    private Long ownerId;
}

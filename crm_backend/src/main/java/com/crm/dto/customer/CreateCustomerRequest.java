package com.crm.dto.customer;

import com.crm.enums.CustomerStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateCustomerRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @Size(max = 30)
    private String phone;

    @Size(max = 150)
    private String company;

    private CustomerStatus status = CustomerStatus.NEW;

    private Long assignedToUserId;
}

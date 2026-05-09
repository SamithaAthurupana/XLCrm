package com.crm.dto.customer;

import com.crm.enums.CustomerStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateCustomerRequest {

    @Size(max = 100)
    private String name;

    @Email(message = "Email must be valid")
    private String email;

    @Size(max = 30)
    private String phone;

    @Size(max = 150)
    private String company;

    private CustomerStatus status;

    private Long assignedToUserId;
}

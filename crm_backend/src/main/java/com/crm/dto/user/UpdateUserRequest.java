package com.crm.dto.user;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @Size(max = 100)
    private String name;

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private Boolean enabled;
}

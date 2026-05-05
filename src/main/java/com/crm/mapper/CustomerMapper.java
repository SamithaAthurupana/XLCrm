package com.crm.mapper;

import com.crm.dto.customer.CustomerResponse;
import com.crm.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface CustomerMapper {

    @Mapping(source = "assignedTo.id",   target = "assignedToUserId")
    @Mapping(source = "assignedTo.name", target = "assignedToUserName")
    CustomerResponse toResponse(Customer customer);
}

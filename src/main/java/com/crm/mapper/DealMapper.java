package com.crm.mapper;

import com.crm.dto.deal.DealResponse;
import com.crm.entity.Deal;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface DealMapper {

    @Mapping(source = "customer.id",   target = "customerId")
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "owner.id",      target = "ownerId")
    @Mapping(source = "owner.name",    target = "ownerName")
    DealResponse toResponse(Deal deal);
}

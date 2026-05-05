package com.crm.mapper;

import com.crm.dto.activity.ActivityResponse;
import com.crm.entity.Activity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface ActivityMapper {

    @Mapping(source = "customer.id",    target = "customerId")
    @Mapping(source = "customer.name",  target = "customerName")
    @Mapping(source = "deal.id",        target = "dealId")
    @Mapping(source = "deal.title",     target = "dealTitle")
    @Mapping(source = "createdBy.id",   target = "createdById")
    @Mapping(source = "createdBy.name", target = "createdByName")
    ActivityResponse toResponse(Activity activity);
}

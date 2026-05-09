package com.crm.mapper;

import com.crm.dto.activity.ActivityResponse;
import com.crm.entity.Activity;
import com.crm.entity.Customer;
import com.crm.entity.Deal;
import com.crm.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-06T04:54:03+0530",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class ActivityMapperImpl implements ActivityMapper {

    @Override
    public ActivityResponse toResponse(Activity activity) {
        if ( activity == null ) {
            return null;
        }

        ActivityResponse.ActivityResponseBuilder activityResponse = ActivityResponse.builder();

        activityResponse.customerId( activityCustomerId( activity ) );
        activityResponse.customerName( activityCustomerName( activity ) );
        activityResponse.dealId( activityDealId( activity ) );
        activityResponse.dealTitle( activityDealTitle( activity ) );
        activityResponse.createdById( activityCreatedById( activity ) );
        activityResponse.createdByName( activityCreatedByName( activity ) );
        activityResponse.id( activity.getId() );
        activityResponse.type( activity.getType() );
        activityResponse.subject( activity.getSubject() );
        activityResponse.notes( activity.getNotes() );
        activityResponse.occurredAt( activity.getOccurredAt() );
        activityResponse.createdAt( activity.getCreatedAt() );
        activityResponse.updatedAt( activity.getUpdatedAt() );

        return activityResponse.build();
    }

    private Long activityCustomerId(Activity activity) {
        Customer customer = activity.getCustomer();
        if ( customer == null ) {
            return null;
        }
        return customer.getId();
    }

    private String activityCustomerName(Activity activity) {
        Customer customer = activity.getCustomer();
        if ( customer == null ) {
            return null;
        }
        return customer.getName();
    }

    private Long activityDealId(Activity activity) {
        Deal deal = activity.getDeal();
        if ( deal == null ) {
            return null;
        }
        return deal.getId();
    }

    private String activityDealTitle(Activity activity) {
        Deal deal = activity.getDeal();
        if ( deal == null ) {
            return null;
        }
        return deal.getTitle();
    }

    private Long activityCreatedById(Activity activity) {
        User createdBy = activity.getCreatedBy();
        if ( createdBy == null ) {
            return null;
        }
        return createdBy.getId();
    }

    private String activityCreatedByName(Activity activity) {
        User createdBy = activity.getCreatedBy();
        if ( createdBy == null ) {
            return null;
        }
        return createdBy.getName();
    }
}

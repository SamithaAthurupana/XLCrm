package com.crm.mapper;

import com.crm.dto.deal.DealResponse;
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
public class DealMapperImpl implements DealMapper {

    @Override
    public DealResponse toResponse(Deal deal) {
        if ( deal == null ) {
            return null;
        }

        DealResponse.DealResponseBuilder dealResponse = DealResponse.builder();

        dealResponse.customerId( dealCustomerId( deal ) );
        dealResponse.customerName( dealCustomerName( deal ) );
        dealResponse.ownerId( dealOwnerId( deal ) );
        dealResponse.ownerName( dealOwnerName( deal ) );
        dealResponse.id( deal.getId() );
        dealResponse.title( deal.getTitle() );
        dealResponse.value( deal.getValue() );
        dealResponse.stage( deal.getStage() );
        dealResponse.expectedCloseDate( deal.getExpectedCloseDate() );
        dealResponse.notes( deal.getNotes() );
        dealResponse.createdAt( deal.getCreatedAt() );
        dealResponse.updatedAt( deal.getUpdatedAt() );

        return dealResponse.build();
    }

    private Long dealCustomerId(Deal deal) {
        Customer customer = deal.getCustomer();
        if ( customer == null ) {
            return null;
        }
        return customer.getId();
    }

    private String dealCustomerName(Deal deal) {
        Customer customer = deal.getCustomer();
        if ( customer == null ) {
            return null;
        }
        return customer.getName();
    }

    private Long dealOwnerId(Deal deal) {
        User owner = deal.getOwner();
        if ( owner == null ) {
            return null;
        }
        return owner.getId();
    }

    private String dealOwnerName(Deal deal) {
        User owner = deal.getOwner();
        if ( owner == null ) {
            return null;
        }
        return owner.getName();
    }
}

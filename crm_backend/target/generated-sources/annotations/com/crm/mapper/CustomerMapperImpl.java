package com.crm.mapper;

import com.crm.dto.customer.CustomerResponse;
import com.crm.entity.Customer;
import com.crm.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-06T04:54:03+0530",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class CustomerMapperImpl implements CustomerMapper {

    @Override
    public CustomerResponse toResponse(Customer customer) {
        if ( customer == null ) {
            return null;
        }

        CustomerResponse.CustomerResponseBuilder customerResponse = CustomerResponse.builder();

        customerResponse.assignedToUserId( customerAssignedToId( customer ) );
        customerResponse.assignedToUserName( customerAssignedToName( customer ) );
        customerResponse.id( customer.getId() );
        customerResponse.name( customer.getName() );
        customerResponse.email( customer.getEmail() );
        customerResponse.phone( customer.getPhone() );
        customerResponse.company( customer.getCompany() );
        customerResponse.status( customer.getStatus() );
        customerResponse.createdAt( customer.getCreatedAt() );
        customerResponse.updatedAt( customer.getUpdatedAt() );

        return customerResponse.build();
    }

    private Long customerAssignedToId(Customer customer) {
        User assignedTo = customer.getAssignedTo();
        if ( assignedTo == null ) {
            return null;
        }
        return assignedTo.getId();
    }

    private String customerAssignedToName(Customer customer) {
        User assignedTo = customer.getAssignedTo();
        if ( assignedTo == null ) {
            return null;
        }
        return assignedTo.getName();
    }
}

package com.crm.service;

import com.crm.dto.customer.CreateCustomerRequest;
import com.crm.dto.customer.CustomerResponse;
import com.crm.dto.customer.UpdateCustomerRequest;
import com.crm.entity.Customer;
import com.crm.entity.User;
import com.crm.enums.CustomerStatus;
import com.crm.exception.DuplicateResourceException;
import com.crm.exception.ResourceNotFoundException;
import com.crm.mapper.CustomerMapper;
import com.crm.repository.CustomerRepository;
import com.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final CustomerMapper customerMapper;

    @Transactional(readOnly = true)
    public Page<CustomerResponse> getAllCustomers(String search, CustomerStatus status, Pageable pageable) {
        if (search != null && !search.isBlank()) {
            return customerRepository.search(search, pageable).map(customerMapper::toResponse);
        }
        if (status != null) {
            return customerRepository.findAllActiveByStatus(status, pageable).map(customerMapper::toResponse);
        }
        return customerRepository.findAllActive(pageable).map(customerMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long id) {
        return customerMapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public CustomerResponse createCustomer(CreateCustomerRequest request) {
        if (customerRepository.existsByEmailAndDeletedFalse(request.getEmail())) {
            throw new DuplicateResourceException("Customer email already exists: " + request.getEmail());
        }

        Customer customer = Customer.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .company(request.getCompany())
                .status(request.getStatus() != null ? request.getStatus() : CustomerStatus.NEW)
                .assignedTo(resolveUser(request.getAssignedToUserId()))
                .build();

        return customerMapper.toResponse(customerRepository.save(customer));
    }

    @Transactional
    public CustomerResponse updateCustomer(Long id, UpdateCustomerRequest request) {
        Customer customer = findOrThrow(id);

        if (request.getName() != null)    customer.setName(request.getName());
        if (request.getPhone() != null)   customer.setPhone(request.getPhone());
        if (request.getCompany() != null) customer.setCompany(request.getCompany());
        if (request.getStatus() != null)  customer.setStatus(request.getStatus());

        if (request.getEmail() != null && !request.getEmail().equalsIgnoreCase(customer.getEmail())) {
            if (customerRepository.existsByEmailAndDeletedFalse(request.getEmail())) {
                throw new DuplicateResourceException("Customer email already exists: " + request.getEmail());
            }
            customer.setEmail(request.getEmail());
        }

        if (request.getAssignedToUserId() != null) {
            customer.setAssignedTo(resolveUser(request.getAssignedToUserId()));
        }

        return customerMapper.toResponse(customerRepository.save(customer));
    }

    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = findOrThrow(id);
        customer.setDeleted(true);
        customerRepository.save(customer);
    }

    private Customer findOrThrow(Long id) {
        return customerRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", id));
    }

    private User resolveUser(Long userId) {
        if (userId == null) return null;
        return userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }
}

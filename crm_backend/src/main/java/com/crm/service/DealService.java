package com.crm.service;

import com.crm.dto.deal.CreateDealRequest;
import com.crm.dto.deal.DealResponse;
import com.crm.dto.deal.UpdateDealRequest;
import com.crm.entity.Customer;
import com.crm.entity.Deal;
import com.crm.entity.User;
import com.crm.enums.DealStage;
import com.crm.exception.ResourceNotFoundException;
import com.crm.mapper.DealMapper;
import com.crm.repository.CustomerRepository;
import com.crm.repository.DealRepository;
import com.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DealService {

    private final DealRepository dealRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final DealMapper dealMapper;

    @Transactional(readOnly = true)
    public Page<DealResponse> getAllDeals(Long customerId, DealStage stage, Pageable pageable) {
        if (customerId != null) {
            return dealRepository.findByCustomerId(customerId, pageable).map(dealMapper::toResponse);
        }
        if (stage != null) {
            return dealRepository.findByStage(stage, pageable).map(dealMapper::toResponse);
        }
        return dealRepository.findAllActive(pageable).map(dealMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public DealResponse getDealById(Long id) {
        return dealMapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public DealResponse createDeal(CreateDealRequest request) {
        Customer customer = customerRepository.findByIdAndDeletedFalse(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", request.getCustomerId()));

        Deal deal = Deal.builder()
                .title(request.getTitle())
                .value(request.getValue())
                .stage(request.getStage() != null ? request.getStage() : DealStage.PROSPECTING)
                .expectedCloseDate(request.getExpectedCloseDate())
                .notes(request.getNotes())
                .customer(customer)
                .owner(resolveUser(request.getOwnerId()))
                .build();

        return dealMapper.toResponse(dealRepository.save(deal));
    }

    @Transactional
    public DealResponse updateDeal(Long id, UpdateDealRequest request) {
        Deal deal = findOrThrow(id);

        if (request.getTitle() != null)             deal.setTitle(request.getTitle());
        if (request.getValue() != null)             deal.setValue(request.getValue());
        if (request.getStage() != null)             deal.setStage(request.getStage());
        if (request.getExpectedCloseDate() != null) deal.setExpectedCloseDate(request.getExpectedCloseDate());
        if (request.getNotes() != null)             deal.setNotes(request.getNotes());
        if (request.getOwnerId() != null)           deal.setOwner(resolveUser(request.getOwnerId()));

        return dealMapper.toResponse(dealRepository.save(deal));
    }

    @Transactional
    public void deleteDeal(Long id) {
        Deal deal = findOrThrow(id);
        deal.setDeleted(true);
        dealRepository.save(deal);
    }

    private Deal findOrThrow(Long id) {
        return dealRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deal", id));
    }

    private User resolveUser(Long userId) {
        if (userId == null) return null;
        return userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }
}

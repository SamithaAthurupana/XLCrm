package com.crm.service;

import com.crm.dto.activity.ActivityResponse;
import com.crm.dto.activity.CreateActivityRequest;
import com.crm.dto.activity.UpdateActivityRequest;
import com.crm.entity.Activity;
import com.crm.entity.Customer;
import com.crm.entity.Deal;
import com.crm.entity.User;
import com.crm.enums.ActivityType;
import com.crm.exception.ResourceNotFoundException;
import com.crm.mapper.ActivityMapper;
import com.crm.repository.ActivityRepository;
import com.crm.repository.CustomerRepository;
import com.crm.repository.DealRepository;
import com.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final CustomerRepository customerRepository;
    private final DealRepository dealRepository;
    private final UserRepository userRepository;
    private final ActivityMapper activityMapper;

    @Transactional(readOnly = true)
    public Page<ActivityResponse> getAllActivities(Long customerId, Long dealId, ActivityType type, Pageable pageable) {
        if (customerId != null) return activityRepository.findByCustomerId(customerId, pageable).map(activityMapper::toResponse);
        if (dealId     != null) return activityRepository.findByDealId(dealId, pageable).map(activityMapper::toResponse);
        if (type       != null) return activityRepository.findByType(type, pageable).map(activityMapper::toResponse);
        return activityRepository.findAllActive(pageable).map(activityMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ActivityResponse getActivityById(Long id) {
        return activityMapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public ActivityResponse createActivity(CreateActivityRequest request) {
        Customer customer = customerRepository.findByIdAndDeletedFalse(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", request.getCustomerId()));

        Deal deal = null;
        if (request.getDealId() != null) {
            deal = dealRepository.findByIdAndDeletedFalse(request.getDealId())
                    .orElseThrow(() -> new ResourceNotFoundException("Deal", request.getDealId()));
        }

        User currentUser = resolveCurrentUser();

        Activity activity = Activity.builder()
                .type(request.getType())
                .subject(request.getSubject())
                .notes(request.getNotes())
                .occurredAt(request.getOccurredAt())
                .customer(customer)
                .deal(deal)
                .createdBy(currentUser)
                .build();

        return activityMapper.toResponse(activityRepository.save(activity));
    }

    @Transactional
    public ActivityResponse updateActivity(Long id, UpdateActivityRequest request) {
        Activity activity = findOrThrow(id);

        if (request.getType() != null)        activity.setType(request.getType());
        if (request.getSubject() != null)     activity.setSubject(request.getSubject());
        if (request.getNotes() != null)       activity.setNotes(request.getNotes());
        if (request.getOccurredAt() != null)  activity.setOccurredAt(request.getOccurredAt());

        if (request.getDealId() != null) {
            Deal deal = dealRepository.findByIdAndDeletedFalse(request.getDealId())
                    .orElseThrow(() -> new ResourceNotFoundException("Deal", request.getDealId()));
            activity.setDeal(deal);
        }

        return activityMapper.toResponse(activityRepository.save(activity));
    }

    @Transactional
    public void deleteActivity(Long id) {
        Activity activity = findOrThrow(id);
        activity.setDeleted(true);
        activityRepository.save(activity);
    }

    private Activity findOrThrow(Long id) {
        return activityRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", id));
    }

    private User resolveCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found: " + email));
    }
}

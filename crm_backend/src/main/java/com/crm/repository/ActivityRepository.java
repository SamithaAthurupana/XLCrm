package com.crm.repository;

import com.crm.entity.Activity;
import com.crm.enums.ActivityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    Optional<Activity> findByIdAndDeletedFalse(Long id);

    @Query("SELECT a FROM Activity a WHERE a.deleted = false")
    Page<Activity> findAllActive(Pageable pageable);

    @Query("SELECT a FROM Activity a WHERE a.customer.id = :customerId AND a.deleted = false")
    Page<Activity> findByCustomerId(@Param("customerId") Long customerId, Pageable pageable);

    @Query("SELECT a FROM Activity a WHERE a.deal.id = :dealId AND a.deleted = false")
    Page<Activity> findByDealId(@Param("dealId") Long dealId, Pageable pageable);

    @Query("SELECT a FROM Activity a WHERE a.type = :type AND a.deleted = false")
    Page<Activity> findByType(@Param("type") ActivityType type, Pageable pageable);
}

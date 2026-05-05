package com.crm.repository;

import com.crm.entity.Deal;
import com.crm.enums.DealStage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {

    Optional<Deal> findByIdAndDeletedFalse(Long id);

    @Query("SELECT d FROM Deal d WHERE d.deleted = false")
    Page<Deal> findAllActive(Pageable pageable);

    @Query("SELECT d FROM Deal d WHERE d.customer.id = :customerId AND d.deleted = false")
    Page<Deal> findByCustomerId(@Param("customerId") Long customerId, Pageable pageable);

    @Query("SELECT d FROM Deal d WHERE d.stage = :stage AND d.deleted = false")
    Page<Deal> findByStage(@Param("stage") DealStage stage, Pageable pageable);
}

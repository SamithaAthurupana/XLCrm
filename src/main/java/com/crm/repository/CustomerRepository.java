package com.crm.repository;

import com.crm.entity.Customer;
import com.crm.enums.CustomerStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByIdAndDeletedFalse(Long id);

    boolean existsByEmailAndDeletedFalse(String email);

    @Query("SELECT c FROM Customer c WHERE c.deleted = false")
    Page<Customer> findAllActive(Pageable pageable);

    @Query("SELECT c FROM Customer c WHERE c.deleted = false AND c.status = :status")
    Page<Customer> findAllActiveByStatus(@Param("status") CustomerStatus status, Pageable pageable);

    @Query("""
            SELECT c FROM Customer c
            WHERE c.deleted = false
              AND (:search IS NULL
                   OR LOWER(c.name)    LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(c.email)   LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(c.company) LIKE LOWER(CONCAT('%', :search, '%')))
            """)
    Page<Customer> search(@Param("search") String search, Pageable pageable);
}

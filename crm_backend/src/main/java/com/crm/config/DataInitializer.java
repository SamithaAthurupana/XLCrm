package com.crm.config;

import com.crm.entity.*;
import com.crm.enums.*;
import com.crm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Runs on every startup.
 * - Always verifies seed-user passwords are correct (fixes wrong BCrypt hashes).
 * - Creates customers/deals/activities only when the table is empty.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository     userRepository;
    private final CustomerRepository customerRepository;
    private final DealRepository     dealRepository;
    private final ActivityRepository activityRepository;
    private final PasswordEncoder    passwordEncoder;

    private static final String SEED_PASSWORD = "password123";

    @Override
    @Transactional
    public void run(ApplicationArguments args) {

        // ── 1. Always ensure seed users exist with the CORRECT password ────────
        // If a user already exists with a wrong hash (e.g. from data.sql), we
        // detect the mismatch and re-encode the correct hash.
        User admin = ensureUser("Admin User",  "admin@crm.com", Role.ADMIN);
        User alice = ensureUser("Sales Alice", "alice@crm.com", Role.SALES);
        User bob   = ensureUser("Sales Bob",   "bob@crm.com",   Role.SALES);

        // ── 2. Create demo customers / deals / activities (first run only) ─────
        if (customerRepository.count() > 0) {
            log.info("Demo data already present — skipping customer/deal/activity seed.");
            return;
        }

        log.info("Creating demo customers, deals, and activities…");

        Customer acme     = saveCustomer("Acme Corp",     "contact@acme.com",  "+1-555-0101", "Acme Corporation",   CustomerStatus.NEW,       alice);
        Customer globex   = saveCustomer("Globex Inc",    "info@globex.com",   "+1-555-0202", "Globex Inc",         CustomerStatus.CONTACTED, alice);
        Customer initech  = saveCustomer("Initech Ltd",   "sales@initech.com", "+1-555-0303", "Initech Ltd",        CustomerStatus.QUALIFIED, bob);
        Customer umbrella = saveCustomer("Umbrella Corp", "biz@umbrella.com",  "+1-555-0404", "Umbrella Corp",      CustomerStatus.WON,       bob);
        Customer hooli    = saveCustomer("Hooli Tech",    "hello@hooli.com",   "+1-555-0505", "Hooli Technologies", CustomerStatus.LOST,      alice);

        Deal d1 = saveDeal("Acme Enterprise Deal",   new BigDecimal("50000"), DealStage.PROSPECTING,   LocalDate.of(2026, 7, 1),  acme,     alice);
        Deal d2 = saveDeal("Globex SaaS Upgrade",    new BigDecimal("25000"), DealStage.QUALIFICATION, LocalDate.of(2026, 6, 15), globex,   alice);
        Deal d3 = saveDeal("Initech Annual License", new BigDecimal("75000"), DealStage.PROPOSAL,      LocalDate.of(2026, 5, 30), initech,  bob);
        Deal d4 = saveDeal("Umbrella Renewal",       new BigDecimal("90000"), DealStage.CLOSED_WON,    LocalDate.of(2026, 4, 1),  umbrella, bob);
        Deal d5 = saveDeal("Hooli Pilot",            new BigDecimal("10000"), DealStage.CLOSED_LOST,   LocalDate.of(2026, 3, 15), hooli,    alice);

        saveActivity(ActivityType.CALL,    "Initial discovery call",  "Discussed pain points",     acme,     d1, alice);
        saveActivity(ActivityType.MEETING, "Product demo",            "Showed core features",      globex,   d2, alice);
        saveActivity(ActivityType.NOTE,    "Sent follow-up email",    "Attached product brochure", initech,  d3, bob);
        saveActivity(ActivityType.MEETING, "Contract negotiation",    "Final terms agreed",        umbrella, d4, bob);
        saveActivity(ActivityType.CALL,    "Cancellation call",       "Budget constraints cited",  hooli,    d5, alice);

        log.info("Demo data ready: 5 customers · 5 deals · 5 activities");
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Find-or-create a seed user and guarantee the password is correct.
     * Fixes wrong BCrypt hashes inserted by data.sql on earlier runs.
     */
    private User ensureUser(String name, String email, Role role) {
        return userRepository.findByEmailAndDeletedFalse(email)
                .map(existing -> {
                    if (!passwordEncoder.matches(SEED_PASSWORD, existing.getPassword())) {
                        log.warn("Fixing incorrect password hash for seed user: {}", email);
                        existing.setPassword(passwordEncoder.encode(SEED_PASSWORD));
                        return userRepository.save(existing);
                    }
                    return existing;
                })
                .orElseGet(() -> {
                    log.info("Creating seed user: {}", email);
                    return userRepository.save(User.builder()
                            .name(name).email(email)
                            .password(passwordEncoder.encode(SEED_PASSWORD))
                            .role(role).enabled(true)
                            .build());
                });
    }

    private Customer saveCustomer(String name, String email, String phone,
                                  String company, CustomerStatus status, User assignedTo) {
        return customerRepository.save(Customer.builder()
                .name(name).email(email).phone(phone)
                .company(company).status(status).assignedTo(assignedTo)
                .build());
    }

    private Deal saveDeal(String title, BigDecimal value, DealStage stage,
                          LocalDate closeDate, Customer customer, User owner) {
        return dealRepository.save(Deal.builder()
                .title(title).value(value).stage(stage)
                .expectedCloseDate(closeDate).customer(customer).owner(owner)
                .build());
    }

    private void saveActivity(ActivityType type, String subject, String notes,
                              Customer customer, Deal deal, User createdBy) {
        activityRepository.save(Activity.builder()
                .type(type).subject(subject).notes(notes)
                .occurredAt(LocalDateTime.now())
                .customer(customer).deal(deal).createdBy(createdBy)
                .build());
    }
}

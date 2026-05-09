-- =============================================================
-- Mini CRM Schema
-- =============================================================

CREATE TABLE IF NOT EXISTS users (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100)    NOT NULL,
    email       VARCHAR(150)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    role        VARCHAR(20)     NOT NULL DEFAULT 'SALES',
    enabled     BOOLEAN         NOT NULL DEFAULT TRUE,
    deleted     BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at  DATETIME(6)     NOT NULL,
    updated_at  DATETIME(6),
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS customers (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100)    NOT NULL,
    email       VARCHAR(150)    NOT NULL UNIQUE,
    phone       VARCHAR(30),
    company     VARCHAR(150),
    status      VARCHAR(30)     NOT NULL DEFAULT 'NEW',
    deleted     BOOLEAN         NOT NULL DEFAULT FALSE,
    assigned_to BIGINT,
    created_at  DATETIME(6)     NOT NULL,
    updated_at  DATETIME(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_customer_user FOREIGN KEY (assigned_to) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS deals (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    title               VARCHAR(200)    NOT NULL,
    value               DECIMAL(15,2)   NOT NULL DEFAULT 0.00,
    stage               VARCHAR(30)     NOT NULL DEFAULT 'PROSPECTING',
    expected_close_date DATE,
    notes               TEXT,
    deleted             BOOLEAN         NOT NULL DEFAULT FALSE,
    customer_id         BIGINT          NOT NULL,
    owner_id            BIGINT,
    created_at          DATETIME(6)     NOT NULL,
    updated_at          DATETIME(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_deal_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_deal_owner    FOREIGN KEY (owner_id)    REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS activities (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    type        VARCHAR(30)     NOT NULL,
    subject     VARCHAR(200)    NOT NULL,
    notes       TEXT,
    occurred_at DATETIME(6)     NOT NULL,
    deleted     BOOLEAN         NOT NULL DEFAULT FALSE,
    customer_id BIGINT          NOT NULL,
    deal_id     BIGINT,
    created_by  BIGINT          NOT NULL,
    created_at  DATETIME(6)     NOT NULL,
    updated_at  DATETIME(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_activity_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_activity_deal     FOREIGN KEY (deal_id)     REFERENCES deals(id),
    CONSTRAINT fk_activity_user     FOREIGN KEY (created_by)  REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

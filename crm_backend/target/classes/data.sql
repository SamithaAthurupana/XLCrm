-- =============================================================
-- Sample seed data  (passwords are BCrypt of "password123")
-- =============================================================

INSERT IGNORE INTO users (name, email, password, role, enabled, deleted, created_at, updated_at) VALUES
  ('Admin User',  'admin@crm.com', '$2a$12$4gkNB4p5bQPzS8CuuFdBHu2B4L8D9JJLqbzYGWk3L4g1vIJfzFqSG', 'ADMIN', TRUE, FALSE, NOW(6), NOW(6)),
  ('Sales Alice', 'alice@crm.com', '$2a$12$4gkNB4p5bQPzS8CuuFdBHu2B4L8D9JJLqbzYGWk3L4g1vIJfzFqSG', 'SALES', TRUE, FALSE, NOW(6), NOW(6)),
  ('Sales Bob',   'bob@crm.com',   '$2a$12$4gkNB4p5bQPzS8CuuFdBHu2B4L8D9JJLqbzYGWk3L4g1vIJfzFqSG', 'SALES', TRUE, FALSE, NOW(6), NOW(6));

INSERT IGNORE INTO customers (name, email, phone, company, status, deleted, assigned_to, created_at, updated_at) VALUES
  ('Acme Corp',      'contact@acme.com',    '+1-555-0101', 'Acme Corporation',   'NEW',       FALSE, 2, NOW(6), NOW(6)),
  ('Globex Inc',     'info@globex.com',     '+1-555-0202', 'Globex Inc',         'CONTACTED', FALSE, 2, NOW(6), NOW(6)),
  ('Initech Ltd',    'sales@initech.com',   '+1-555-0303', 'Initech Ltd',        'QUALIFIED', FALSE, 3, NOW(6), NOW(6)),
  ('Umbrella Corp',  'biz@umbrella.com',    '+1-555-0404', 'Umbrella Corp',      'WON',       FALSE, 3, NOW(6), NOW(6)),
  ('Hooli Tech',     'hello@hooli.com',     '+1-555-0505', 'Hooli Technologies', 'LOST',      FALSE, 2, NOW(6), NOW(6));

INSERT IGNORE INTO deals (title, value, stage, expected_close_date, notes, deleted, customer_id, owner_id, created_at, updated_at) VALUES
  ('Acme Enterprise Deal',   50000.00, 'PROSPECTING',   '2026-07-01', 'Initial outreach done',     FALSE, 1, 2, NOW(6), NOW(6)),
  ('Globex SaaS Upgrade',    25000.00, 'QUALIFICATION', '2026-06-15', 'Demo scheduled',            FALSE, 2, 2, NOW(6), NOW(6)),
  ('Initech Annual License', 75000.00, 'PROPOSAL',      '2026-05-30', 'Proposal sent',             FALSE, 3, 3, NOW(6), NOW(6)),
  ('Umbrella Renewal',       90000.00, 'CLOSED_WON',    '2026-04-01', 'Contract signed',           FALSE, 4, 3, NOW(6), NOW(6)),
  ('Hooli Pilot',            10000.00, 'CLOSED_LOST',   '2026-03-15', 'Lost to competitor price',  FALSE, 5, 2, NOW(6), NOW(6));

INSERT IGNORE INTO activities (type, subject, notes, occurred_at, deleted, customer_id, deal_id, created_by, created_at, updated_at) VALUES
  ('CALL',    'Initial discovery call',     'Discussed pain points',           NOW(6), FALSE, 1, 1, 2, NOW(6), NOW(6)),
  ('MEETING', 'Product demo',               'Showed core features',            NOW(6), FALSE, 2, 2, 2, NOW(6), NOW(6)),
  ('NOTE',    'Sent follow-up email',       'Attached brochure',               NOW(6), FALSE, 3, 3, 3, NOW(6), NOW(6)),
  ('MEETING', 'Contract negotiation',       'Final terms agreed',              NOW(6), FALSE, 4, 4, 3, NOW(6), NOW(6)),
  ('CALL',    'Cancellation call',          'Budget constraints cited',        NOW(6), FALSE, 5, 5, 2, NOW(6), NOW(6));

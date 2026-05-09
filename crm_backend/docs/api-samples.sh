#!/usr/bin/env bash
# =============================================================
# Mini CRM — Sample API requests
# Run the app first: mvn spring-boot:run
# BASE_URL defaults to localhost:8080
# =============================================================
BASE="http://localhost:8080/api/v1"

# ---------------------------------------------------------------
# 1. AUTH
# ---------------------------------------------------------------

## Register a new SALES user
curl -s -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name":     "Jane Doe",
    "email":    "jane@crm.com",
    "password": "password123",
    "role":     "SALES"
  }' | jq .

## Login (seed users: admin@crm.com / alice@crm.com / bob@crm.com, password: password123)
TOKEN=$(curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crm.com","password":"password123"}' \
  | jq -r '.data.accessToken')

echo "JWT: $TOKEN"

# ---------------------------------------------------------------
# 2. USERS  (ADMIN only)
# ---------------------------------------------------------------

## List users
curl -s "$BASE/users?page=0&size=10&sort=name,asc" \
  -H "Authorization: Bearer $TOKEN" | jq .

## Get user by ID
curl -s "$BASE/users/1" \
  -H "Authorization: Bearer $TOKEN" | jq .

## Update user
curl -s -X PUT "$BASE/users/2" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Smith"}' | jq .

## Delete user (soft)
curl -s -X DELETE "$BASE/users/3" \
  -H "Authorization: Bearer $TOKEN" | jq .

# ---------------------------------------------------------------
# 3. CUSTOMERS
# ---------------------------------------------------------------

## List all customers
curl -s "$BASE/customers?page=0&size=10&sort=name,asc" \
  -H "Authorization: Bearer $TOKEN" | jq .

## Search customers
curl -s "$BASE/customers?search=acme" \
  -H "Authorization: Bearer $TOKEN" | jq .

## Filter by status
curl -s "$BASE/customers?status=QUALIFIED" \
  -H "Authorization: Bearer $TOKEN" | jq .

## Create customer
curl -s -X POST "$BASE/customers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":    "Soylent Corp",
    "email":   "contact@soylent.com",
    "phone":   "+1-555-9999",
    "company": "Soylent Corp",
    "status":  "NEW",
    "assignedToUserId": 2
  }' | jq .

## Update customer
curl -s -X PUT "$BASE/customers/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"CONTACTED"}' | jq .

## Delete customer (soft)
curl -s -X DELETE "$BASE/customers/5" \
  -H "Authorization: Bearer $TOKEN" | jq .

# ---------------------------------------------------------------
# 4. DEALS
# ---------------------------------------------------------------

## List all deals
curl -s "$BASE/deals?page=0&size=10&sort=value,desc" \
  -H "Authorization: Bearer $TOKEN" | jq .

## Filter deals by customer
curl -s "$BASE/deals?customerId=1" \
  -H "Authorization: Bearer $TOKEN" | jq .

## Filter deals by stage
curl -s "$BASE/deals?stage=PROPOSAL" \
  -H "Authorization: Bearer $TOKEN" | jq .

## Create deal
curl -s -X POST "$BASE/deals" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":             "Soylent SaaS Contract",
    "value":             35000.00,
    "stage":             "QUALIFICATION",
    "expectedCloseDate": "2026-09-01",
    "notes":             "High potential account",
    "customerId":        1,
    "ownerId":           2
  }' | jq .

## Update deal stage
curl -s -X PUT "$BASE/deals/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"stage":"PROPOSAL"}' | jq .

## Delete deal
curl -s -X DELETE "$BASE/deals/5" \
  -H "Authorization: Bearer $TOKEN" | jq .

# ---------------------------------------------------------------
# 5. ACTIVITIES
# ---------------------------------------------------------------

## List all activities
curl -s "$BASE/activities?page=0&size=10&sort=occurredAt,desc" \
  -H "Authorization: Bearer $TOKEN" | jq .

## Filter activities by customer
curl -s "$BASE/activities?customerId=1" \
  -H "Authorization: Bearer $TOKEN" | jq .

## Filter by deal
curl -s "$BASE/activities?dealId=2" \
  -H "Authorization: Bearer $TOKEN" | jq .

## Filter by type
curl -s "$BASE/activities?type=CALL" \
  -H "Authorization: Bearer $TOKEN" | jq .

## Log a new activity
curl -s -X POST "$BASE/activities" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type":       "MEETING",
    "subject":    "Q2 Business Review",
    "notes":      "Quarterly strategy review call",
    "occurredAt": "2026-05-05T10:00:00",
    "customerId": 1,
    "dealId":     1
  }' | jq .

## Update activity
curl -s -X PUT "$BASE/activities/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes":"Updated notes after the call"}' | jq .

## Delete activity
curl -s -X DELETE "$BASE/activities/5" \
  -H "Authorization: Bearer $TOKEN" | jq .

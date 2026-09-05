from tests.conftest import register, set_role


def test_grant_group_and_contribution_flow(client):
    headers, _ = register(client, "organizer@example.com")
    set_role(client, headers, "mentor")

    res = client.post("/api/grants/groups", json={"name": "Tech Fund", "goal_amount": 1000}, headers=headers)
    assert res.status_code == 201
    group_id = res.json()["id"]
    assert res.json()["invite_link"].startswith("lexep.org/join/")

    donor_headers, _ = register(client, "donor@example.com")
    set_role(client, donor_headers, "learner")

    res = client.post(
        "/api/checkout/contribution", json={"group_id": group_id, "amount": 50}, headers=donor_headers
    )
    assert res.status_code == 200
    reference = res.json()["reference"]
    assert res.json()["provider"] == "mock"  # PAYMENTS_ENABLED defaults false

    res = client.post(f"/api/checkout/verify/{reference}", headers=donor_headers)
    assert res.status_code == 200
    assert res.json()["status"] == "success"

    res = client.get(f"/api/grants/groups/{group_id}")
    assert res.json()["raised_amount"] == 50


def test_premium_checkout_blocked_while_disabled(client):
    headers, _ = register(client, "buyer@example.com")
    set_role(client, headers, "learner")
    res = client.post(
        "/api/checkout/subscription", json={"plan": "learner_plus", "billing_cycle": "monthly"}, headers=headers
    )
    assert res.status_code == 403


def test_public_config_reflects_defaults(client):
    res = client.get("/api/config")
    assert res.status_code == 200
    body = res.json()
    assert body["premium_features_enabled"] is False
    assert body["payments_enabled"] is False


def test_pricing_plans_available(client):
    res = client.get("/api/plans")
    assert res.status_code == 200
    assert len(res.json()) == 3


def test_notifications_end_to_end(client):
    headers, user = register(client, "notif@example.com")
    set_role(client, headers, "learner")

    res = client.get("/api/notifications", headers=headers)
    assert res.status_code == 200
    assert res.json()["total"] == 0

    res = client.get("/api/notifications/unread-count", headers=headers)
    assert res.json()["count"] == 0


def test_mentorship_accept_notifies_learner(client):
    mentor_headers, mentor_user = register(client, "mentor3@example.com")
    set_role(client, mentor_headers, "mentor")

    learner_headers, _ = register(client, "learner9@example.com")
    set_role(client, learner_headers, "learner")

    res = client.post(
        "/api/mentors/requests",
        json={"mentor_id": mentor_user["id"], "session_type": "30-min Intro", "proposed_times": []},
        headers=learner_headers,
    )
    assert res.status_code == 201
    request_id = res.json()["id"]

    res = client.post(f"/api/mentors/me/requests/{request_id}/accept", headers=mentor_headers)
    assert res.status_code == 200

    res = client.get("/api/notifications", headers=learner_headers)
    assert res.status_code == 200
    assert res.json()["total"] == 1
    assert res.json()["items"][0]["type"] == "mentorship_accepted"

from tests.conftest import make_admin, register, set_role


def test_non_admin_blocked_from_admin_routes(client):
    headers, _ = register(client, "notadmin@example.com")
    set_role(client, headers, "learner")
    for path in ["/api/admin/users/learners", "/api/admin/subscriptions", "/api/admin/companies", "/api/admin/mentor-applications"]:
        res = client.get(path, headers=headers)
        assert res.status_code == 403, path


def test_admin_routes_require_auth(client):
    for path in ["/api/admin/users/learners", "/api/admin/subscriptions", "/api/admin/companies"]:
        res = client.get(path)
        assert res.status_code == 401, path


def test_admin_can_list_learners_and_companies(client):
    admin_headers, _ = make_admin(client)

    learner_headers, _ = register(client, "adminview_learner@example.com")
    set_role(client, learner_headers, "learner")

    company_headers, _ = register(client, "adminview_co@example.com", "View Co")
    set_role(client, company_headers, "company")

    res = client.get("/api/admin/users/learners", headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["total"] >= 1

    res = client.get("/api/admin/companies", headers=admin_headers)
    assert res.status_code == 200
    assert len(res.json()["companies"]) >= 1


def test_admin_mentor_application_review_flow(client):
    admin_headers, _ = make_admin(client, "admin2@example.com")

    mentor_headers, mentor_user = register(client, "reviewme@example.com", "Review Me")
    set_role(client, mentor_headers, "mentor")
    client.put("/api/mentors/application/step3", json={"agreed_to_terms": True}, headers=mentor_headers)

    res = client.get("/api/admin/mentor-applications", headers=admin_headers)
    assert res.status_code == 200
    assert any(a["user_id"] == mentor_user["id"] for a in res.json())

    res = client.post(f"/api/admin/mentor-applications/{mentor_user['id']}/approve", json={}, headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["application_status"] == "approved"

    # Approved mentor should now be notified.
    res = client.get("/api/notifications", headers=mentor_headers)
    assert res.status_code == 200
    assert res.json()["total"] == 1

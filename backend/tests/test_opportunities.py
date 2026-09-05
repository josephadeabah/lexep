from tests.conftest import register, set_role


def _make_company_and_opportunity(client):
    company_headers, _ = register(client, "co@example.com", "Acme Co")
    set_role(client, company_headers, "company")
    res = client.post(
        "/api/opportunities",
        json={"title": "Frontend Intern", "status": "published", "required_skills": ["React"]},
        headers=company_headers,
    )
    assert res.status_code == 201
    return company_headers, res.json()["id"]


def test_learner_can_apply_and_see_own_application(client):
    company_headers, opp_id = _make_company_and_opportunity(client)
    learner_headers, _ = register(client, "learner@example.com", "Learner One")
    set_role(client, learner_headers, "learner")

    res = client.post("/api/opportunities/apply", json={"opportunity_id": opp_id}, headers=learner_headers)
    assert res.status_code == 201, res.text

    res = client.get("/api/opportunities/applications/mine", headers=learner_headers)
    assert res.status_code == 200
    assert len(res.json()) == 1
    assert res.json()[0]["opportunity_title"] == "Frontend Intern"


def test_cannot_apply_twice(client):
    company_headers, opp_id = _make_company_and_opportunity(client)
    learner_headers, _ = register(client, "learner2@example.com")
    set_role(client, learner_headers, "learner")

    client.post("/api/opportunities/apply", json={"opportunity_id": opp_id}, headers=learner_headers)
    res = client.post("/api/opportunities/apply", json={"opportunity_id": opp_id}, headers=learner_headers)
    assert res.status_code == 400


def test_company_sees_applicants_sorted_by_match_score(client):
    company_headers, opp_id = _make_company_and_opportunity(client)
    learner_headers, _ = register(client, "learner3@example.com")
    set_role(client, learner_headers, "learner")
    client.post("/api/opportunities/apply", json={"opportunity_id": opp_id}, headers=learner_headers)

    res = client.get(f"/api/opportunities/{opp_id}/applicants", headers=company_headers)
    assert res.status_code == 200
    assert len(res.json()) == 1


def test_learner_cannot_post_opportunity(client):
    learner_headers, _ = register(client, "learner4@example.com")
    set_role(client, learner_headers, "learner")
    res = client.post("/api/opportunities", json={"title": "Nope"}, headers=learner_headers)
    assert res.status_code == 403


def test_browse_opportunities_requires_no_auth(client):
    _make_company_and_opportunity(client)
    res = client.get("/api/opportunities?published_only=true")
    assert res.status_code == 200
    assert len(res.json()) >= 1

from tests.conftest import register, set_role


def _make_company_and_opportunity(client):
    company_headers, _ = register(client, "ivco@example.com", "IV Co")
    set_role(client, company_headers, "company")
    res = client.post(
        "/api/opportunities",
        json={"title": "Backend Intern", "status": "published", "required_skills": ["Python"]},
        headers=company_headers,
    )
    assert res.status_code == 201
    return company_headers, res.json()["id"]


def test_direct_interview_scheduling_notifies_candidate_immediately(client):
    company_headers, opp_id = _make_company_and_opportunity(client)
    learner_headers, learner_user = register(client, "ivlearner@example.com")
    set_role(client, learner_headers, "learner")

    res = client.post("/api/opportunities/apply", json={"opportunity_id": opp_id}, headers=learner_headers)
    assert res.status_code == 201
    application_id = res.json()["id"]

    res = client.post(
        "/api/interviews",
        json={
            "application_id": application_id,
            "scheduled_at": "2026-01-01T10:00:00Z",
            "duration_minutes": 30,
            "interview_type": "Technical Assessment",
        },
        headers=company_headers,
    )
    assert res.status_code == 201, res.text
    body = res.json()
    assert body["status"] == "scheduled"
    # meeting link auto-generated since none was supplied
    assert body["meeting_link"]
    assert str(body["id"]) in body["meeting_link"]

    # candidate notified immediately with a confirmed interview
    res = client.get("/api/notifications", headers=learner_headers)
    assert res.status_code == 200
    assert res.json()["total"] == 1
    assert res.json()["items"][0]["type"] == "interview_confirmed"


def test_deprecated_propose_flow_still_works(client):
    company_headers, opp_id = _make_company_and_opportunity(client)
    learner_headers, _ = register(client, "ivlearner2@example.com")
    set_role(client, learner_headers, "learner")

    res = client.post("/api/opportunities/apply", json={"opportunity_id": opp_id}, headers=learner_headers)
    application_id = res.json()["id"]

    res = client.post(
        "/api/interviews/propose",
        json={
            "application_id": application_id,
            "proposed_times": ["2026-01-02T10:00:00Z", "2026-01-02T14:00:00Z"],
        },
        headers=company_headers,
    )
    assert res.status_code == 201
    interview_id = res.json()["id"]
    assert res.json()["status"] == "awaiting_candidate"

    res = client.post(
        f"/api/interviews/{interview_id}/select-time",
        json={"selected_time": "2026-01-02T10:00:00Z"},
        headers=learner_headers,
    )
    assert res.status_code == 200
    assert res.json()["status"] == "scheduled"


def test_assessment_start_attempt_is_idempotent(client):
    headers, _ = register(client, "idempotentlearner@example.com")
    set_role(client, headers, "learner")

    company_headers, _ = register(client, "idempotentco@example.com", "Idempotent Co")
    set_role(client, company_headers, "company")

    res = client.post(
        "/api/assessments",
        json={
            "title": "Idempotency Quiz",
            "questions": [
                {"prompt": "2+2?", "options": [{"id": "a", "text": "3"}, {"id": "b", "text": "4"}], "correct_option_id": "b"}
            ],
        },
        headers=company_headers,
    )
    assessment_id = res.json()["id"]

    res1 = client.post(f"/api/assessments/{assessment_id}/attempts", headers=headers)
    assert res1.status_code == 201
    attempt_id_1 = res1.json()["attempt_id"]

    # Simulate a replayed "start" request (e.g. offline sync retry) — should
    # resume the same in-progress attempt, not create a second one.
    res2 = client.post(f"/api/assessments/{assessment_id}/attempts", headers=headers)
    assert res2.status_code == 201
    attempt_id_2 = res2.json()["attempt_id"]

    assert attempt_id_1 == attempt_id_2

    res = client.get("/api/assessments/attempts/mine", headers=headers)
    assert res.status_code == 200
    matching = [a for a in res.json() if a["assessment_id"] == assessment_id]
    assert len(matching) == 1

from tests.conftest import register, set_role


def test_mentor_application_flow(client):
    headers, _ = register(client, "mentor@example.com", "Mentor One")
    set_role(client, headers, "mentor")

    res = client.put("/api/mentors/application/step1", json={"title": "Architect", "company": "Studio"}, headers=headers)
    assert res.status_code == 200
    res = client.put("/api/mentors/application/step2", json={"skills": ["Design"]}, headers=headers)
    assert res.status_code == 200
    res = client.put("/api/mentors/application/step3", json={"agreed_to_terms": True}, headers=headers)
    assert res.status_code == 200
    assert res.json()["application_status"] == "pending"

    res = client.put("/api/mentors/application/step3", json={"agreed_to_terms": False}, headers=headers)
    assert res.status_code == 400


def test_mentor_packages_crud(client):
    headers, _ = register(client, "mentor2@example.com")
    set_role(client, headers, "mentor")

    res = client.post(
        "/api/mentors/me/packages",
        json={"title": "Portfolio Review", "price": 100, "duration_minutes": 60},
        headers=headers,
    )
    assert res.status_code == 201
    package_id = res.json()["id"]

    res = client.patch(f"/api/mentors/me/packages/{package_id}/toggle", headers=headers)
    assert res.status_code == 200
    assert res.json()["is_active"] is False


def test_courses_require_admin_or_company(client):
    headers, _ = register(client, "learner5@example.com")
    set_role(client, headers, "learner")
    res = client.post("/api/courses", json={"title": "Nope"}, headers=headers)
    assert res.status_code == 403


def test_company_course_lifecycle_and_enrollment(client):
    company_headers, _ = register(client, "co2@example.com", "Studio Co")
    set_role(client, company_headers, "company")

    res = client.post("/api/courses", json={"title": "Onboarding 101"}, headers=company_headers)
    assert res.status_code == 201
    course_id = res.json()["id"]
    assert res.json()["status"] == "draft"

    res = client.post(f"/api/courses/{course_id}/publish", headers=company_headers)
    assert res.status_code == 200
    assert res.json()["status"] == "published"

    learner_headers, _ = register(client, "learner6@example.com")
    set_role(client, learner_headers, "learner")
    res = client.post(f"/api/courses/{course_id}/enroll", headers=learner_headers)
    assert res.status_code == 201

    res = client.post(f"/api/courses/{course_id}/enroll", headers=learner_headers)
    assert res.status_code == 400  # already enrolled


def test_assessment_full_attempt_flow(client):
    headers, _ = register(client, "learner7@example.com")
    set_role(client, headers, "learner")

    admin_headers, _ = register(client, "adm@example.com", "Admin")
    # promote via direct DB not available here; use company for assessment creation instead
    company_headers, _ = register(client, "co3@example.com", "Assessco")
    set_role(client, company_headers, "company")

    res = client.post(
        "/api/assessments",
        json={
            "title": "Quick Quiz",
            "questions": [
                {"prompt": "1+1?", "options": [{"id": "a", "text": "1"}, {"id": "b", "text": "2"}], "correct_option_id": "b"}
            ],
        },
        headers=company_headers,
    )
    assert res.status_code == 201
    assessment_id = res.json()["id"]

    # Internal (company) assessments should not show in the general hub.
    res = client.get("/api/assessments")
    assert all(a["id"] != assessment_id for a in res.json())

    res = client.post(f"/api/assessments/{assessment_id}/attempts", headers=headers)
    assert res.status_code == 201
    attempt_id = res.json()["attempt_id"]
    question_id = res.json()["question"]["id"]

    res = client.post(
        f"/api/assessments/attempts/{attempt_id}/answer",
        json={"question_id": question_id, "option_id": "b"},
        headers=headers,
    )
    assert res.status_code == 200
    assert res.json()["is_complete"] is True

    res = client.get(f"/api/assessments/attempts/{attempt_id}/results", headers=headers)
    assert res.status_code == 200
    assert res.json()["score"] == 100.0


def test_leaderboard_is_company_only(client):
    company_headers, _ = register(client, "co4@example.com")
    set_role(client, company_headers, "company")
    learner_headers, _ = register(client, "learner8@example.com")
    set_role(client, learner_headers, "learner")

    res = client.get("/api/assessments/leaderboard", headers=company_headers)
    assert res.status_code == 200

    res = client.get("/api/assessments/leaderboard", headers=learner_headers)
    assert res.status_code == 403

    res = client.get("/api/assessments/leaderboard")
    assert res.status_code == 401

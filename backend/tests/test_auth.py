from tests.conftest import register, set_role


def test_register_and_login(client):
    headers, user = register(client, "auth@example.com")
    assert user["email"] == "auth@example.com"
    assert user["role"] is None

    res = client.post("/api/auth/login", json={"email": "auth@example.com", "password": "pass1234"})
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_login_wrong_password_fails(client):
    register(client, "auth2@example.com")
    res = client.post("/api/auth/login", json={"email": "auth2@example.com", "password": "wrong"})
    assert res.status_code == 401


def test_duplicate_registration_rejected(client):
    register(client, "dupe@example.com")
    res = client.post(
        "/api/auth/register", json={"email": "dupe@example.com", "full_name": "X", "password": "pass1234"}
    )
    assert res.status_code == 400


def test_me_requires_auth(client):
    res = client.get("/api/auth/me")
    assert res.status_code == 401


def test_choose_role_blocks_admin_self_assign(client):
    headers, _ = register(client, "roletest@example.com")
    res = client.post("/api/users/me/role", json={"role": "admin"}, headers=headers)
    assert res.status_code == 403


def test_choose_role_allows_learner(client):
    headers, _ = register(client, "roletest2@example.com")
    user = set_role(client, headers, "learner")
    assert user["role"] == "learner"

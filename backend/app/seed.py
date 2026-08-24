"""
Seeds demo data so the frontend has something to render immediately
(mirrors the names/companies used across the design mockups).

    python -m app.seed
"""

from datetime import datetime, timedelta, timezone

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.init_db import init_db
from app.models.assessment import Assessment, AssessmentQuestion
from app.models.billing import Subscription
from app.models.enums import (
    ApplicationStatus,
    BillingCycle,
    MentorApplicationStatus,
    OpportunityStatus,
    SubscriptionPlan,
    SubscriptionStatus,
    UserRole,
    WorkMode,
)
from app.models.grant import Contribution, GrantGroup
from app.models.opportunity import Application, Opportunity
from app.models.user import (
    CompanyProfile,
    LearnerProfile,
    MentorPackage,
    MentorProfile,
    User,
)


def run():
    init_db()
    db = SessionLocal()
    try:
        if db.query(User).first():
            print("Database already seeded, skipping.")
            return

        # --- Company -------------------------------------------------
        company_user = User(
            email="hiring@technova.example",
            full_name="TechNova Solutions",
            hashed_password=hash_password("password123"),
            role=UserRole.COMPANY,
            onboarding_completed=True,
        )
        db.add(company_user)
        db.flush()
        company_profile = CompanyProfile(
            user_id=company_user.id,
            company_name="TechNova Solutions",
            industry="Technology",
            company_size="51-200",
            website_url="https://technova.example",
            hiring_goals=["Finding Interns"],
        )
        db.add(company_profile)

        opportunity = Opportunity(
            company_id=company_user.id,
            title="Software Engineering Internship - Summer 2024",
            category="Software Engineering",
            work_mode=WorkMode.HYBRID,
            location="Lagos, NG",
            description="Join our engineering team for a summer internship building real product features.",
            required_skills=["React", "Python", "Node.js"],
            status=OpportunityStatus.PUBLISHED,
        )
        db.add(opportunity)
        db.flush()

        # --- Learners / applicants ------------------------------------
        applicants = [
            dict(
                name="Amina Diop",
                email="amina@example.com",
                institution="University of Nairobi",
                field="B.Sc. Computer Science (Expected 2025)",
                skills=["React", "Python", "Node.js"],
                score=95,
            ),
            dict(
                name="Kwame Osei",
                email="kwame@example.com",
                institution="Ashesi University",
                field="B.Eng. Software Engineering (2024)",
                skills=["Java", "Spring Boot", "SQL"],
                score=82,
            ),
            dict(
                name="Zola Mbeki",
                email="zola@example.com",
                institution="University of Cape Town",
                field="B.Sc. Information Systems (2025)",
                skills=["HTML/CSS", "Python", "Design"],
                score=68,
            ),
            dict(
                name="Chinedu Eze",
                email="chinedu@example.com",
                institution="Lagos State University",
                field="M.Sc. Computer Science (2024)",
                skills=["Go", "Kubernetes", "AWS"],
                score=91,
            ),
        ]
        for a in applicants:
            learner = User(
                email=a["email"],
                full_name=a["name"],
                hashed_password=hash_password("password123"),
                role=UserRole.LEARNER,
                onboarding_completed=True,
            )
            db.add(learner)
            db.flush()
            db.add(
                LearnerProfile(
                    user_id=learner.id,
                    institution=a["institution"],
                    field_of_study=a["field"],
                    career_interests=a["skills"],
                )
            )
            db.add(
                Application(
                    opportunity_id=opportunity.id,
                    applicant_id=learner.id,
                    match_score=a["score"],
                    status=ApplicationStatus.APPLIED,
                )
            )

        # --- Mentor -----------------------------------------------------
        mentor_user = User(
            email="sarah.omondi@example.com",
            full_name="Dr. Sarah Omondi",
            hashed_password=hash_password("password123"),
            role=UserRole.MENTOR,
            onboarding_completed=True,
        )
        db.add(mentor_user)
        db.flush()
        mentor_profile = MentorProfile(
            user_id=mentor_user.id,
            title="Senior Data Scientist",
            company="Global Tech Solutions",
            bio=(
                "With over 10 years of experience in data science and artificial intelligence "
                "across global tech hubs, I am passionate about bridging the gap between "
                "theoretical knowledge and practical industry application for emerging talents in Africa."
            ),
            skills=["Machine Learning", "Python", "Career Development", "Leadership"],
            languages=["English", "Swahili"],
            hours_per_week="2 hours / week",
            mentoring_style="technical_guidance",
            preferred_mentee_levels=["beginner"],
            communication_tools=["Slack", "Zoom"],
            application_status=MentorApplicationStatus.APPROVED,
            application_submitted_at=datetime.now(timezone.utc) - timedelta(days=10),
            application_reviewed_at=datetime.now(timezone.utc) - timedelta(days=8),
            rating=4.9,
            accepting_mentees=True,
        )
        db.add(mentor_profile)
        db.flush()
        db.add_all(
            [
                MentorPackage(
                    mentor_id=mentor_user.id,
                    title="Portfolio Review",
                    description="A comprehensive review of your portfolio with actionable feedback.",
                    price=150,
                    duration_minutes=60,
                    session_count=1,
                    tags=["PDF Markups", "Action Plan"],
                    is_active=True,
                ),
                MentorPackage(
                    mentor_id=mentor_user.id,
                    title="Career Coaching",
                    description="A structured 4-week program covering career mapping and interview prep.",
                    price=400,
                    duration_minutes=45,
                    session_count=4,
                    tags=["Interview Prep", "Firm Strategy"],
                    is_active=True,
                    is_popular=True,
                ),
            ]
        )

        # --- Pending mentor application (for Admin review queue) --------
        applicant_user = User(
            email="elias.thorne@example.com",
            full_name="Elias Thorne",
            hashed_password=hash_password("password123"),
            role=UserRole.MENTOR,
            onboarding_completed=True,
        )
        db.add(applicant_user)
        db.flush()
        db.add(
            MentorProfile(
                user_id=applicant_user.id,
                title="Principal Architect",
                company="Thorne & Associates",
                bio=(
                    "Throughout my 15 years in practice, spanning commercial developments in "
                    "Johannesburg to boutique residential projects in Cape Town, I have observed a "
                    "recurring gap between academic training and practical professional readiness "
                    "among junior architects. I am applying to be a mentor on Lexep to help bridge "
                    "this gap."
                ),
                years_experience="15+ Years",
                location="Cape Town, South Africa",
                focus_area="Urban Design",
                linkedin_url="https://linkedin.com/in/eliasthorne",
                education=[
                    {
                        "degree": "Master of Architecture (MArch)",
                        "institution": "University of Cape Town",
                        "year": "2008",
                    }
                ],
                credentials=[
                    {
                        "label": "Professional Architect — SACAP Registration: PrArch 7890"
                    }
                ],
                credential_checklist={},
                skills=["Urban Design", "Regulatory Compliance", "Design Philosophy"],
                application_status=MentorApplicationStatus.PENDING,
                application_submitted_at=datetime.now(timezone.utc) - timedelta(days=2),
            )
        )
        db.flush()
        applicant_profile = (
            db.query(MentorProfile)
            .filter(MentorProfile.user_id == applicant_user.id)
            .first()
        )
        db.add_all(
            [
                MentorPackage(
                    mentor_id=applicant_user.id,
                    title="Portfolio Review & Strategy",
                    description="A comprehensive 90-minute session reviewing your current portfolio, identifying weak points and opportunities.",
                    price=850,
                    currency="R",
                    duration_minutes=90,
                ),
                MentorPackage(
                    mentor_id=applicant_user.id,
                    title="Practice Management Basics",
                    description="A deep dive into the business side of architecture. We cover fee calculation, contracts, and client management.",
                    price=1200,
                    currency="R",
                    duration_minutes=120,
                ),
            ]
        )

        # --- Admin user ---------------------------------------------
        db.add(
            User(
                email="admin@lexep.org",
                full_name="Lexep Admin",
                hashed_password=hash_password("password123"),
                role=UserRole.ADMIN,
                onboarding_completed=True,
            )
        )

        # --- Skill Assessment ------------------------------------------
        assessment = Assessment(
            title="Structural Analysis I",
            category="Engineering",
            level="Intermediate",
            description="Validate your understanding of load distribution, statics, and material behavior.",
            duration_minutes=45,
            featured=True,
        )
        db.add(assessment)
        db.flush()
        questions = [
            dict(
                order=0,
                topic="Load Calculations",
                title="Beam Reactions",
                prompt="A simply supported beam of length L = 6.0 m carries a uniform load w = 12 kN/m. What is the reaction at each support?",
                options=[
                    {"id": "a", "text": "R = wL"},
                    {"id": "b", "text": "R = wL / 2"},
                    {"id": "c", "text": "R = wL / 4"},
                    {"id": "d", "text": "R = wL\u00b2 / 2"},
                ],
                correct_option_id="b",
                explanation="For a uniformly loaded simply supported beam, each reaction equals half the total load: wL/2.",
            ),
            dict(
                order=1,
                topic="Statics & Equilibrium",
                title="Shear Force Diagrams",
                prompt="At the midspan of a simply supported beam under a uniform distributed load, the shear force is:",
                options=[
                    {"id": "a", "text": "At its maximum"},
                    {"id": "b", "text": "Zero"},
                    {"id": "c", "text": "Equal to the reaction force"},
                    {"id": "d", "text": "Undefined"},
                ],
                correct_option_id="b",
                explanation="Shear force crosses zero at midspan for a symmetric uniformly loaded simply supported beam — that's where bending moment is maximum.",
            ),
            dict(
                order=2,
                topic="Load Calculations",
                title="Bending Moments",
                prompt="Determine the maximum bending moment for a simply supported beam of length L subjected to a uniform distributed load w.",
                options=[
                    {"id": "a", "text": "M_max = wL\u00b2 / 4"},
                    {"id": "b", "text": "M_max = wL\u00b2 / 8"},
                    {"id": "c", "text": "M_max = wL\u00b2 / 12"},
                    {"id": "d", "text": "M_max = wL / 2"},
                ],
                correct_option_id="b",
                explanation="The maximum bending moment for a simply supported beam under uniform load is wL\u00b2/8, occurring at midspan.",
            ),
            dict(
                order=3,
                topic="Statics & Equilibrium",
                title="Equilibrium Conditions",
                prompt="Which condition is NOT required for a rigid body to be in static equilibrium?",
                options=[
                    {"id": "a", "text": "Sum of vertical forces = 0"},
                    {"id": "b", "text": "Sum of horizontal forces = 0"},
                    {"id": "c", "text": "Sum of moments = 0"},
                    {"id": "d", "text": "Sum of material stresses = 0"},
                ],
                correct_option_id="d",
                explanation="Static equilibrium requires the three force/moment balance equations — material stress balance is not one of them.",
            ),
            dict(
                order=4,
                topic="Material Stress",
                title="Stress & Strain",
                prompt="Within the elastic region of a material, stress is related to strain by:",
                options=[
                    {"id": "a", "text": "Newton's Second Law"},
                    {"id": "b", "text": "Hooke's Law"},
                    {"id": "c", "text": "Bernoulli's Principle"},
                    {"id": "d", "text": "Pascal's Law"},
                ],
                correct_option_id="b",
                explanation="Hooke's Law (stress = E \u00d7 strain) governs the linear elastic region of most structural materials.",
            ),
            dict(
                order=5,
                topic="Code Compliance",
                title="Safety Factors",
                prompt="A structural design's 'factor of safety' primarily accounts for:",
                options=[
                    {"id": "a", "text": "Aesthetic preferences"},
                    {"id": "b", "text": "Uncertainty in loads and material properties"},
                    {"id": "c", "text": "Construction schedule delays"},
                    {"id": "d", "text": "Client budget constraints"},
                ],
                correct_option_id="b",
                explanation="Factors of safety build in margin for uncertainty in actual loads, material strength variability, and analysis approximations.",
            ),
        ]
        for q in questions:
            db.add(AssessmentQuestion(assessment_id=assessment.id, **q))

        # --- Grant group --------------------------------------------
        group = GrantGroup(
            organizer_id=mentor_user.id,
            name="Tech Leaders for Africa",
            tagline="Empowering the next generation of software engineers.",
            description=(
                "This funding group is dedicated to providing high-end laptops, robust internet "
                "access, and premium mentorship to promising young software developers across "
                "sub-Saharan Africa."
            ),
            category="Software Engineering",
            goal_amount=50000,
            raised_amount=45000,
            youth_sponsored=124,
        )
        db.add(group)
        db.flush()
        db.add_all(
            [
                Contribution(
                    group_id=group.id, contributor_name="Anonymous Donor", amount=5000
                ),
                Contribution(
                    group_id=group.id, contributor_name="David K.", amount=2500
                ),
                Contribution(
                    group_id=group.id, contributor_name="Amara Ventures", amount=1000
                ),
            ]
        )

        db.commit()

        # --- Admin dashboards demo data ---------------------------------
        # Give the seeded company (TechNova) admin-management fields, and
        # add a couple more partner firms + several learners so the
        # 'User Management' / 'Partner Firms Management' / 'Premium
        # Subscriptions' admin screens have something realistic to show.
        company_profile.industry_category = "Technology"
        company_profile.location = "Lagos, NG"
        company_profile.subscription_tier = "enterprise"
        company_profile.onboarding_status = "active"
        db.add(company_profile)

        for name, email, industry, location, tier, status in [
            (
                "Pan-African Finance",
                "hiring@panafricanfinance.example",
                "Finance",
                "Nairobi, KE",
                "pro",
                "pending_review",
            ),
            (
                "Creative Hub Ltd",
                "hiring@creativehub.example",
                "Design",
                "Accra, GH",
                "basic",
                "active",
            ),
        ]:
            firm_user = User(
                email=email,
                full_name=name,
                hashed_password=hash_password("password123"),
                role=UserRole.COMPANY,
                onboarding_completed=True,
            )
            db.add(firm_user)
            db.flush()
            db.add(
                CompanyProfile(
                    user_id=firm_user.id,
                    company_name=name,
                    industry_category=industry,
                    location=location,
                    subscription_tier=tier,
                    onboarding_status=status,
                )
            )

        for name, email, location, track, progress, status in [
            (
                "Amina Olayinka",
                "amina.o@example.com",
                "Lagos, NG",
                "Frontend Engineering",
                100,
                "competency_verified",
            ),
            (
                "Kwame Mensah",
                "k.mensah@example.com",
                "Accra, GH",
                "Backend Architecture",
                65,
                "in_progress",
            ),
            (
                "Nneka Uzo",
                "n.uzo@example.com",
                "Nairobi, KE",
                "Data Science Foundation",
                82,
                "in_progress",
            ),
            (
                "Tunde Jaja",
                "t.jaja@example.com",
                "Lagos, NG",
                "UI/UX Principles",
                100,
                "needs_review",
            ),
        ]:
            learner_user = User(
                email=email,
                full_name=name,
                hashed_password=hash_password("password123"),
                role=UserRole.LEARNER,
                onboarding_completed=True,
            )
            db.add(learner_user)
            db.flush()
            db.add(
                LearnerProfile(
                    user_id=learner_user.id,
                    location=location,
                    primary_track=track,
                    progress_percent=progress,
                    verification_status=status,
                )
            )

        db.commit()

        # --- Premium subscriptions demo data -----------------------------
        john = User(
            email="john.d@example.com",
            full_name="John Doe",
            hashed_password=hash_password("password123"),
            role=UserRole.LEARNER,
            onboarding_completed=True,
        )
        db.add(john)
        db.flush()
        db.add(
            Subscription(
                user_id=john.id,
                plan=SubscriptionPlan.LEARNER_PLUS,
                billing_cycle=BillingCycle.MONTHLY,
                status=SubscriptionStatus.ACTIVE,
                amount=49,
                currency="USD",
                provider="mock",
                provider_reference="seed_sub_john",
                renews_at=datetime.now(timezone.utc) + timedelta(days=20),
            )
        )
        db.add(
            Subscription(
                user_id=company_user.id,
                plan=SubscriptionPlan.ENTERPRISE,
                billing_cycle=BillingCycle.MONTHLY,
                status=SubscriptionStatus.ACTIVE,
                amount=2499,
                currency="USD",
                provider="mock",
                provider_reference="seed_sub_technova",
                renews_at=datetime.now(timezone.utc) + timedelta(days=32),
            )
        )
        db.commit()
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    run()

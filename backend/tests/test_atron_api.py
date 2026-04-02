"""
ATRON API Tests - Backend API testing for attendance management system
Tests: Auth, Classes, Attendance, Reports, Analytics endpoints
"""
import pytest
import requests
import os
import random
import string

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://zero-proxies.preview.emergentagent.com')

# Test credentials from test_credentials.md
TEACHER_EMAIL = "teacher@atron.edu"
TEACHER_PASSWORD = "teacher123"
STUDENT_EMAIL = "student@atron.edu"
STUDENT_PASSWORD = "student123"


@pytest.fixture(scope="module")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="module")
def teacher_token(api_client):
    """Get teacher authentication token"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": TEACHER_EMAIL,
        "password": TEACHER_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("token")
    pytest.skip("Teacher authentication failed")


@pytest.fixture(scope="module")
def student_token(api_client):
    """Get student authentication token"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": STUDENT_EMAIL,
        "password": STUDENT_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("token")
    pytest.skip("Student authentication failed")


@pytest.fixture(scope="module")
def teacher_client(api_client, teacher_token):
    """Session with teacher auth header"""
    api_client.headers.update({"Authorization": f"Bearer {teacher_token}"})
    return api_client


class TestHealthEndpoint:
    """Health check endpoint tests"""
    
    def test_health_check(self, api_client):
        """Test /api/health returns healthy status"""
        response = api_client.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("SUCCESS: Health check passed")
    
    def test_api_root(self, api_client):
        """Test /api returns API info"""
        response = api_client.get(f"{BASE_URL}/api")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print("SUCCESS: API root endpoint working")


class TestAuthEndpoints:
    """Authentication endpoint tests"""
    
    def test_teacher_login_success(self, api_client):
        """Test teacher login with valid credentials"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEACHER_EMAIL,
            "password": TEACHER_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["email"] == TEACHER_EMAIL
        assert data["role"] == "teacher"
        print(f"SUCCESS: Teacher login - {data['name']}")
    
    def test_student_login_success(self, api_client):
        """Test student login with valid credentials"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": STUDENT_EMAIL,
            "password": STUDENT_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["email"] == STUDENT_EMAIL
        assert data["role"] == "student"
        print(f"SUCCESS: Student login - {data['name']}")
    
    def test_login_invalid_credentials(self, api_client):
        """Test login with invalid credentials returns 401"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "invalid@test.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("SUCCESS: Invalid credentials rejected")
    
    def test_register_new_user(self, api_client):
        """Test user registration"""
        random_suffix = ''.join(random.choices(string.ascii_lowercase, k=6))
        test_email = f"test_{random_suffix}@test.edu"
        
        response = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "email": test_email,
            "password": "testpass123",
            "name": "Test User",
            "role": "student"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_email
        assert data["role"] == "student"
        assert "token" in data
        print(f"SUCCESS: User registered - {test_email}")
    
    def test_register_duplicate_email(self, api_client):
        """Test registration with existing email fails"""
        response = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "email": TEACHER_EMAIL,
            "password": "testpass123",
            "name": "Duplicate User",
            "role": "teacher"
        })
        assert response.status_code == 400
        print("SUCCESS: Duplicate email registration rejected")
    
    def test_get_current_user(self, teacher_client):
        """Test /api/auth/me returns current user"""
        response = teacher_client.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == TEACHER_EMAIL
        assert data["role"] == "teacher"
        print(f"SUCCESS: Get current user - {data['name']}")


class TestClassEndpoints:
    """Class management endpoint tests"""
    
    def test_list_classes_teacher(self, teacher_client):
        """Test teacher can list their classes"""
        response = teacher_client.get(f"{BASE_URL}/api/classes")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"SUCCESS: Teacher has {len(data)} classes")
    
    def test_create_class(self, teacher_client):
        """Test teacher can create a new class"""
        random_suffix = ''.join(random.choices(string.ascii_uppercase, k=4))
        
        response = teacher_client.post(f"{BASE_URL}/api/classes", json={
            "name": f"Test Class {random_suffix}",
            "subject": "TEST101",
            "section": "A",
            "semester": "Spring 2025"
        })
        assert response.status_code == 200
        data = response.json()
        assert "class_code" in data
        assert len(data["class_code"]) == 6
        assert data["name"] == f"Test Class {random_suffix}"
        print(f"SUCCESS: Class created with code {data['class_code']}")
        return data["class_code"], data["id"]
    
    def test_get_class_details(self, teacher_client):
        """Test getting class details"""
        # First get list of classes
        response = teacher_client.get(f"{BASE_URL}/api/classes")
        classes = response.json()
        if len(classes) > 0:
            class_id = classes[0]["id"]
            response = teacher_client.get(f"{BASE_URL}/api/classes/{class_id}")
            assert response.status_code == 200
            data = response.json()
            assert "name" in data
            assert "class_code" in data
            print(f"SUCCESS: Got class details - {data['name']}")
        else:
            pytest.skip("No classes available")
    
    def test_get_class_students(self, teacher_client):
        """Test getting students in a class"""
        response = teacher_client.get(f"{BASE_URL}/api/classes")
        classes = response.json()
        if len(classes) > 0:
            class_id = classes[0]["id"]
            response = teacher_client.get(f"{BASE_URL}/api/classes/{class_id}/students")
            assert response.status_code == 200
            data = response.json()
            assert isinstance(data, list)
            print(f"SUCCESS: Class has {len(data)} students")
        else:
            pytest.skip("No classes available")


class TestAttendanceEndpoints:
    """Attendance session endpoint tests"""
    
    def test_start_attendance_session(self, teacher_client):
        """Test teacher can start an attendance session"""
        # Get a class first
        response = teacher_client.get(f"{BASE_URL}/api/classes")
        classes = response.json()
        if len(classes) == 0:
            pytest.skip("No classes available")
        
        class_id = classes[0]["id"]
        
        # Check for active session first
        active_response = teacher_client.get(f"{BASE_URL}/api/attendance/sessions/active/{class_id}")
        if active_response.status_code == 200 and active_response.json().get("active"):
            # End existing session
            session_id = active_response.json()["id"]
            teacher_client.put(f"{BASE_URL}/api/attendance/sessions/{session_id}/end")
        
        # Start new session
        response = teacher_client.post(f"{BASE_URL}/api/attendance/sessions", json={
            "class_id": class_id
        })
        assert response.status_code == 200
        data = response.json()
        assert "session_code" in data
        assert "qr_data" in data
        assert data["is_active"] == True
        print(f"SUCCESS: Session started with code {data['session_code'][:10]}...")
        
        # Clean up - end the session
        teacher_client.put(f"{BASE_URL}/api/attendance/sessions/{data['id']}/end")
    
    def test_get_active_session(self, teacher_client):
        """Test getting active session for a class"""
        response = teacher_client.get(f"{BASE_URL}/api/classes")
        classes = response.json()
        if len(classes) > 0:
            class_id = classes[0]["id"]
            response = teacher_client.get(f"{BASE_URL}/api/attendance/sessions/active/{class_id}")
            assert response.status_code == 200
            print("SUCCESS: Active session check completed")
        else:
            pytest.skip("No classes available")


class TestReportEndpoints:
    """Report endpoint tests"""
    
    def test_get_class_report(self, teacher_client):
        """Test getting attendance report for a class"""
        response = teacher_client.get(f"{BASE_URL}/api/classes")
        classes = response.json()
        if len(classes) > 0:
            class_id = classes[0]["id"]
            response = teacher_client.get(f"{BASE_URL}/api/reports/{class_id}")
            assert response.status_code == 200
            data = response.json()
            assert "class" in data
            assert "students" in data
            assert "total_sessions" in data
            print(f"SUCCESS: Report has {len(data['students'])} students, {data['total_sessions']} sessions")
        else:
            pytest.skip("No classes available")
    
    def test_export_report(self, teacher_client):
        """Test exporting report to Excel"""
        response = teacher_client.get(f"{BASE_URL}/api/classes")
        classes = response.json()
        if len(classes) > 0:
            class_id = classes[0]["id"]
            response = teacher_client.get(f"{BASE_URL}/api/reports/{class_id}/export")
            assert response.status_code == 200
            assert "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" in response.headers.get("content-type", "")
            print("SUCCESS: Excel export working")
        else:
            pytest.skip("No classes available")


class TestAnalyticsEndpoints:
    """Analytics endpoint tests"""
    
    def test_teacher_analytics(self, teacher_client):
        """Test teacher analytics endpoint"""
        response = teacher_client.get(f"{BASE_URL}/api/analytics/teacher")
        assert response.status_code == 200
        data = response.json()
        assert "total_classes" in data
        assert "total_students" in data
        assert "attendance_rate" in data
        print(f"SUCCESS: Teacher analytics - {data['total_classes']} classes, {data['total_students']} students, {data['attendance_rate']}% rate")
    
    def test_student_analytics(self, api_client, student_token):
        """Test student analytics endpoint"""
        api_client.headers.update({"Authorization": f"Bearer {student_token}"})
        response = api_client.get(f"{BASE_URL}/api/analytics/student")
        assert response.status_code == 200
        data = response.json()
        assert "overall_attendance" in data
        assert "classes_joined" in data
        print(f"SUCCESS: Student analytics - {data['classes_joined']} classes, {data['overall_attendance']}% attendance")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

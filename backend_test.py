#!/usr/bin/env python3
"""
ATRON Backend API Testing Suite
Tests all endpoints for the university attendance management system
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, Optional

class ATRONAPITester:
    def __init__(self, base_url: str = "https://zero-proxies.preview.emergentagent.com"):
        self.base_url = base_url
        self.teacher_token = None
        self.student_token = None
        self.teacher_user = None
        self.student_user = None
        self.teacher_session = requests.Session()
        self.student_session = requests.Session()
        self.test_class_id = None
        self.test_session_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test results"""
        self.tests_run += 1
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    {details}")
        if success:
            self.tests_passed += 1
        else:
            self.failed_tests.append(f"{name}: {details}")

    def make_request(self, method: str, endpoint: str, data: Dict = None, 
                    session: requests.Session = None, token: str = None, expected_status: int = 200) -> tuple[bool, Dict]:
        """Make HTTP request and validate response"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        # Use provided session or create new request
        if session:
            req_session = session
        else:
            req_session = requests
            if token:
                headers['Authorization'] = f'Bearer {token}'

        try:
            if method == 'GET':
                response = req_session.get(url, headers=headers)
            elif method == 'POST':
                response = req_session.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = req_session.put(url, json=data, headers=headers)
            else:
                return False, {"error": f"Unsupported method: {method}"}

            success = response.status_code == expected_status
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}

            return success, response_data

        except Exception as e:
            return False, {"error": str(e)}

    def test_health_check(self):
        """Test basic API health"""
        success, data = self.make_request('GET', 'health')
        self.log_test("API Health Check", success, 
                     f"Status: {data.get('status', 'unknown')}" if success else str(data))

    def test_api_root(self):
        """Test API root endpoint"""
        success, data = self.make_request('GET', '')
        self.log_test("API Root", success, 
                     f"Message: {data.get('message', 'none')}" if success else str(data))

    def test_teacher_login(self):
        """Test teacher authentication"""
        login_data = {
            "email": "teacher@atron.edu",
            "password": "teacher123"
        }
        success, data = self.make_request('POST', 'auth/login', login_data, session=self.teacher_session)
        
        if success and 'token' in data:
            self.teacher_token = data['token']
            self.teacher_user = data
            self.log_test("Teacher Login", True, f"Role: {data.get('role')}, Name: {data.get('name')}")
        else:
            self.log_test("Teacher Login", False, str(data))
        
        return success

    def test_student_login(self):
        """Test student authentication"""
        login_data = {
            "email": "student@atron.edu", 
            "password": "student123"
        }
        success, data = self.make_request('POST', 'auth/login', login_data, session=self.student_session)
        
        if success and 'token' in data:
            self.student_token = data['token']
            self.student_user = data
            self.log_test("Student Login", True, f"Role: {data.get('role')}, Name: {data.get('name')}")
        else:
            self.log_test("Student Login", False, str(data))
        
        return success

    def test_auth_me_teacher(self):
        """Test /auth/me endpoint for teacher"""
        if not self.teacher_session:
            self.log_test("Teacher Auth Me", False, "No teacher session available")
            return False
            
        success, data = self.make_request('GET', 'auth/me', session=self.teacher_session)
        self.log_test("Teacher Auth Me", success, 
                     f"Email: {data.get('email')}, Role: {data.get('role')}" if success else str(data))
        return success

    def test_auth_me_student(self):
        """Test /auth/me endpoint for student"""
        if not self.student_session:
            self.log_test("Student Auth Me", False, "No student session available")
            return False
            
        success, data = self.make_request('GET', 'auth/me', session=self.student_session)
        self.log_test("Student Auth Me", success, 
                     f"Email: {data.get('email')}, Role: {data.get('role')}" if success else str(data))
        return success

    def test_teacher_classes_list(self):
        """Test teacher classes listing"""
        if not self.teacher_session:
            self.log_test("Teacher Classes List", False, "No teacher session")
            return False
            
        success, data = self.make_request('GET', 'classes', session=self.teacher_session)
        if success and isinstance(data, list):
            self.log_test("Teacher Classes List", True, f"Found {len(data)} classes")
            if data:
                self.test_class_id = data[0].get('id')
        else:
            self.log_test("Teacher Classes List", False, str(data))
        return success

    def test_student_classes_list(self):
        """Test student classes listing"""
        if not self.student_session:
            self.log_test("Student Classes List", False, "No student session")
            return False
            
        success, data = self.make_request('GET', 'classes', session=self.student_session)
        if success and isinstance(data, list):
            self.log_test("Student Classes List", True, f"Found {len(data)} classes")
        else:
            self.log_test("Student Classes List", False, str(data))
        return success

    def test_create_class(self):
        """Test class creation by teacher"""
        if not self.teacher_session:
            self.log_test("Create Class", False, "No teacher session")
            return False
            
        class_data = {
            "name": "Test Class",
            "subject": "TEST101",
            "section": "A",
            "semester": "1"
        }
        success, data = self.make_request('POST', 'classes', class_data, 
                                        session=self.teacher_session, expected_status=201)
        if success:
            self.test_class_id = data.get('id')
            self.log_test("Create Class", True, f"Class ID: {self.test_class_id}, Code: {data.get('class_code')}")
        else:
            self.log_test("Create Class", False, str(data))
        return success

    def test_get_class_details(self):
        """Test getting class details"""
        if not self.test_class_id or not self.teacher_session:
            self.log_test("Get Class Details", False, "No class ID or teacher session")
            return False
            
        success, data = self.make_request('GET', f'classes/{self.test_class_id}', 
                                        session=self.teacher_session)
        self.log_test("Get Class Details", success, 
                     f"Name: {data.get('name')}, Students: {data.get('student_count', 0)}" if success else str(data))
        return success

    def test_start_attendance_session(self):
        """Test starting an attendance session"""
        if not self.test_class_id or not self.teacher_session:
            self.log_test("Start Attendance Session", False, "No class ID or teacher session")
            return False
            
        session_data = {"class_id": self.test_class_id}
        success, data = self.make_request('POST', 'attendance/sessions', session_data, 
                                        session=self.teacher_session, expected_status=201)
        if success:
            self.test_session_id = data.get('id')
            self.log_test("Start Attendance Session", True, 
                         f"Session ID: {self.test_session_id}, QR: {data.get('qr_data', 'N/A')[:50]}...")
        else:
            self.log_test("Start Attendance Session", False, str(data))
        return success

    def test_get_session_details(self):
        """Test getting session details"""
        if not self.test_session_id or not self.teacher_session:
            self.log_test("Get Session Details", False, "No session ID or teacher session")
            return False
            
        success, data = self.make_request('GET', f'attendance/sessions/{self.test_session_id}', 
                                        session=self.teacher_session)
        self.log_test("Get Session Details", success, 
                     f"Active: {data.get('is_active')}, Present: {data.get('present_count', 0)}" if success else str(data))
        return success

    def test_get_active_session(self):
        """Test getting active session for class"""
        if not self.test_class_id or not self.teacher_session:
            self.log_test("Get Active Session", False, "No class ID or teacher session")
            return False
            
        success, data = self.make_request('GET', f'attendance/sessions/active/{self.test_class_id}', 
                                        session=self.teacher_session)
        self.log_test("Get Active Session", success, 
                     f"Active: {data.get('active', False)}" if success else str(data))
        return success

    def test_teacher_analytics(self):
        """Test teacher analytics endpoint"""
        if not self.teacher_session:
            self.log_test("Teacher Analytics", False, "No teacher session")
            return False
            
        success, data = self.make_request('GET', 'analytics/teacher', session=self.teacher_session)
        if success:
            self.log_test("Teacher Analytics", True, 
                         f"Classes: {data.get('total_classes', 0)}, Students: {data.get('total_students', 0)}, Rate: {data.get('attendance_rate', 0)}%")
        else:
            self.log_test("Teacher Analytics", False, str(data))
        return success

    def test_student_analytics(self):
        """Test student analytics endpoint"""
        if not self.student_session:
            self.log_test("Student Analytics", False, "No student session")
            return False
            
        success, data = self.make_request('GET', 'analytics/student', session=self.student_session)
        if success:
            self.log_test("Student Analytics", True, 
                         f"Overall: {data.get('overall_attendance', 0)}%, Classes: {data.get('classes_joined', 0)}")
        else:
            self.log_test("Student Analytics", False, str(data))
        return success

    def test_class_report(self):
        """Test class report generation"""
        if not self.test_class_id or not self.teacher_session:
            self.log_test("Class Report", False, "No class ID or teacher session")
            return False
            
        success, data = self.make_request('GET', f'reports/{self.test_class_id}', 
                                        session=self.teacher_session)
        if success:
            students_count = len(data.get('students', []))
            self.log_test("Class Report", True, 
                         f"Students: {students_count}, Sessions: {data.get('total_sessions', 0)}")
        else:
            self.log_test("Class Report", False, str(data))
        return success

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        login_data = {
            "email": "invalid@test.com",
            "password": "wrongpassword"
        }
        success, data = self.make_request('POST', 'auth/login', login_data, expected_status=401)
        self.log_test("Invalid Login", success, "Correctly rejected invalid credentials" if success else str(data))
        return success

    def test_unauthorized_access(self):
        """Test accessing protected endpoint without token"""
        success, data = self.make_request('GET', 'classes', expected_status=401)
        self.log_test("Unauthorized Access", success, "Correctly rejected unauthorized request" if success else str(data))
        return success

    def run_all_tests(self):
        """Run complete test suite"""
        print("🚀 Starting ATRON Backend API Tests")
        print("=" * 50)
        
        # Basic API tests
        self.test_health_check()
        self.test_api_root()
        
        # Authentication tests
        teacher_login_ok = self.test_teacher_login()
        student_login_ok = self.test_student_login()
        
        if teacher_login_ok:
            self.test_auth_me_teacher()
        if student_login_ok:
            self.test_auth_me_student()
            
        # Class management tests
        if teacher_login_ok:
            self.test_teacher_classes_list()
            self.test_create_class()
            self.test_get_class_details()
            
        if student_login_ok:
            self.test_student_classes_list()
            
        # Attendance tests
        if teacher_login_ok and self.test_class_id:
            self.test_start_attendance_session()
            self.test_get_session_details()
            self.test_get_active_session()
            
        # Analytics tests
        if teacher_login_ok:
            self.test_teacher_analytics()
        if student_login_ok:
            self.test_student_analytics()
            
        # Reports tests
        if teacher_login_ok and self.test_class_id:
            self.test_class_report()
            
        # Security tests
        self.test_invalid_login()
        self.test_unauthorized_access()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for failure in self.failed_tests:
                print(f"  - {failure}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"✨ Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    tester = ATRONAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
import httpx
import sys
import time

def verify():
    base_url = "http://127.0.0.1:8000/api/v1"
    
    # Wait for server to start
    time.sleep(2)
    
    print("1. Checking Root Endpoint...")
    try:
        r = httpx.get("http://127.0.0.1:8000/")
        print("Root response status:", r.status_code)
    except Exception as e:
        print("Error checking root:", str(e))
        sys.exit(1)
        
    print("\n2. Checking Register...")
    email = f"test_{int(time.time())}@example.com"
    reg_payload = {
        "email": email,
        "password": "password123",
        "full_name": "John Doe"
    }
    r = httpx.post(f"{base_url}/auth/register", json=reg_payload, timeout=30.0)
    if r.status_code != 200:
        print("Register failed:", r.status_code, r.text)
        sys.exit(1)
    print("Registered successfully:", r.json())
    
    print("\n3. Checking Login...")
    login_data = {
        "username": email,
        "password": "password123"
    }
    r = httpx.post(f"{base_url}/auth/login", data=login_data, timeout=30.0)
    if r.status_code != 200:
        print("Login failed:", r.status_code, r.text)
        sys.exit(1)
    token_resp = r.json()
    token = token_resp["access_token"]
    print("Logged in successfully. Token generated.")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    print("\n4. Checking Get Current User...")
    r = httpx.get(f"{base_url}/auth/me", headers=headers, timeout=30.0)
    print("User profile:", r.json())
    
    print("\n5. Checking Get Problems List...")
    r = httpx.get(f"{base_url}/problems/", timeout=30.0)
    problems = r.json()
    print(f"Retrieved {len(problems)} problems.")
    if len(problems) > 0:
        print("First problem:", problems[0])
        
    print("\n6. Checking Code Run (Piston Integration)...")
    run_payload = {
        "code": "print('Hello World')",
        "language": "python",
        "custom_input": ""
    }
    r = httpx.post(f"{base_url}/submissions/run", json=run_payload, headers=headers, timeout=30.0)
    print("Run response:", r.json())

    print("\nBackend verification completely successful!")

if __name__ == "__main__":
    verify()

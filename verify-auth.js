// Using built-in fetch

async function verifyAuth() {
  const baseUrl = "http://localhost:3000/api/auth";
  const user = {
    name: "Test User " + Date.now(),
    email: "test" + Date.now() + "@example.com",
    password: "password123",
  };

  console.log("Testing Signup...");
  try {
    const signupRes = await fetch(`${baseUrl}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const signupData = await signupRes.json();
    console.log("Signup Status:", signupRes.status);
    console.log("Signup Data:", signupData);

    if (signupRes.status === 201 && signupData.token) {
      console.log("Signup Successful!");

      console.log("Testing Login...");
      const loginRes = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password: user.password }),
      });
      const loginData = await loginRes.json();
      console.log("Login Status:", loginRes.status);
      console.log("Login Data:", loginData);

      if (loginRes.status === 200 && loginData.token) {
        console.log("Login Successful!");
      } else {
        console.log("Login Failed");
      }
    } else {
      console.log("Signup Failed");
    }
  } catch (error) {
    console.error("Verification Error:", error);
  }
}

verifyAuth();

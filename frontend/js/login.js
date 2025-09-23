document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      window.location.href = "homepage.html";
    } else {
      const error = await response.json();
      alert(error.message);
    }
  } catch (err) {
    alert("Error logging in");
  }
});

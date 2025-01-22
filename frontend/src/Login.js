import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState("");
  const history = useHistory();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "" || username === "") {
      setErrorMessages("Please fill all the fields");
    } else {
      setErrorMessages("");
      fetch("http://localhost:5000/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((res) => {
          if (!res.ok) {
            setErrorMessages("Invalid credentials");
          }
          return res.json();
        })
        .then((data) => {
          console.log("the server response data is" + JSON.stringify(data));
          if (data.token) {
            localStorage.setItem("token", data.token);
            history.push("/Categories");
          }
          console.log("Form submitted successfully");
        });
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <form>
        <label>UserName:</label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessages && <div className="error">{errorMessages}</div>}
        <button onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
};

export default Login;

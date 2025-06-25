import { useState } from "react";
import { useHistory } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState("");
  const history = useHistory();

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessages("Passwords do not match");
    } else {
      setErrorMessages("");
      fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          query: `
            mutation AddNewUser($username: String!, $password: String!, $role: String!) {
              addNewUser(input: { username: $username, password: $password, role: $role }) {
                username
                password
                role
              }
            }
          `,
          variables: {
            username: username,
            password: password,
            role: role,
          },
          operationName: "AddNewUser",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.errors) {
            console.error("Error:", data.errors[0].message); // Handle any errors from the server
            setErrorMessages(data.errors[0].message);
          } else {
            history.push("/Login");
            console.log("User registered successfully", JSON.stringify(data));
          }
        })
        .catch((error) => {
          console.error("Network Error:", error); // Handle any network-related errors
          setErrorMessages("Network error, please try again.");
        });
      console.log("Form submitted successfully");
    }
  };

  return (
    <div className="create">
      <h2>Register</h2>
      <form>
        <label>Name:</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>UserName:</label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
        <label>Role:</label>
        <input
          type="text"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errorMessages && <div className="error">{errorMessages}</div>}
        <button onClick={handleRegister}>Register</button>
      </form>
    </div>
  );
};

export default Register;

import { useState } from "react";
import { useHistory } from "react-router-dom";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState(""); // Create a state variable to store the category name
  const history = useHistory();

  const handleAddCategory = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        query: `
          mutation AddNewCategory($name: String!) {
            addNewCategory(input: { name: $name }) {
              name
            }
          }
        `,
        variables: {
          name: categoryName,
        },
        operationName: "AddNewCategory",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error("Error:", data.errors[0].message); // Handle any errors from the server
          if (data.errors[0].message === "Unauthorized") {
            history.push("/Login");
          }
        } else {
          history.push("/Categories");
          console.log("Category added successfully", JSON.stringify(data));
        }
      })
      .catch((error) => {
        console.error("Network Error:", error); // Handle any network-related errors
      });
  };

  return (
    <div className="add-category">
      <h2>Add Category</h2>
      <div className="category-container">
        <form action="#" method="POST">
          <label>Category Name:</label>
          <input
            type="text"
            placeholder="Enter category name"
            required
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <button onClick={handleAddCategory}>Add Category</button>
          <button onClick={() => history.push("/Categories")}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;

import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryDelete = (id) => () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (confirmDelete) {
      console.log("Delete category with id: ", id);
      fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          query: `
            mutation DeleteCategory($categoryID: ID!) {
                deleteCategory(categoryID: $categoryID) 
            }
            `,
          variables: {
            categoryID: id,
          },
          operationName: "DeleteCategory",
        }),
      })
        .then((res) => {
          if (!res.ok) {
            console.error("Error:", res.statusText);
            if (res.status === 401) {
              history.push("/Login");
            }
          }
          return res.json();
        })
        .then((data) => {
          console.log("the server response data is" + JSON.stringify(data));
          fetchCategories();
        });
    } else {
      console.log("Delete operation cancelled");
    }
  };

  const fetchCategories = () => {
    fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        query: `
            query Categories{
                categories {
                id
                name
                }
            }
            `,
        variables: {},
        operationName: "Categories",
      }),
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Error:", res.statusText);
          if (res.status === 401) {
            history.push("/Login");
          }
        }
        return res.json();
      })
      .then((data) => {
        setCategories(data.data.categories);
        console.log("the server response data is" + JSON.stringify(data));
      });
  };

  return (
    <div className="Categories-Page">
      <div className="Categories-header">
        <h1>Categories</h1>
        <button onClick={() => history.push("/AddCategory")}>
          Add Category
        </button>
      </div>
      <div className="Categories-container">
        {categories.map((category) => (
          <div className="category" key={category.id}>
            <h2>{category.name}</h2>
            <div className="Category-Products">
              <button onClick={() => history.push(`/Products/${category.id}`)}>
                Products
              </button>
            </div>
            <div className="Category-Delete">
              <button onClick={handleCategoryDelete(category.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;

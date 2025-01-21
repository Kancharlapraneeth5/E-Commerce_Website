import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

const AddProduct = () => {
  const [productName, setProductName] = useState(""); // Create a state variable to store the category name
  const [productDescription, setProductDescription] = useState(""); // Create a state variable to store the category name
  const [productQuantity, setProductQuantity] = useState(0); // Create a state variable to store the category name
  const [productImage, setProductImage] = useState(""); // Create a state variable to store the category name
  const [productPrice, setProductPrice] = useState(0); // Create a state variable to store the category name
  const [selectedOnSaleRadio, setSelectedOnSaleRadio] = useState(null); // Use state for selected rating

  const history = useHistory();

  const { categoryId } = useParams();

  const handleOnSaleRadioSelection = (e) => {
    const value = e.target.value;

    if (selectedOnSaleRadio === (value === "yes" ? true : false)) {
      console.log("the selected onSale radio hook is", selectedOnSaleRadio);
      console.log("the selected onSale radio is", value);
      setSelectedOnSaleRadio(null); // Unselect the rating if it's already selected
      console.log("The selected rating is unselected");
    } else {
      console.log("The selected rating is", value === "yes" ? true : false);
      setSelectedOnSaleRadio(value === "yes" ? true : false); // Set the selected rating
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    console.log("the event is", e);
    fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        query: `
            mutation AddNewProduct($name: String!, $description: String!, $quantity: Int!, $price: Float!, $image: String!, $onSale: Boolean!, $categoryId: String!) {
              addNewProduct(input: { name: $name, description: $description, quantity: $quantity, price: $price, image: $image, onSale: $onSale, categoryId: $categoryId }) {
                name
                description
                quantity
                price
                image
                onSale
              }
            }
          `,
        variables: {
          name: productName,
          description: productDescription,
          quantity: productQuantity,
          price: productPrice,
          image: productImage,
          onSale: selectedOnSaleRadio,
          categoryId: categoryId,
        },
        operationName: "AddNewProduct",
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
          history.push(`/Products/${categoryId}`);
          console.log("Product added successfully", JSON.stringify(data));
        }
      })
      .catch((error) => {
        console.error("Network Error:", error); // Handle any network-related errors
      });
  };

  return (
    <div className="add-product">
      <h2>Add Product</h2>
      <div className="product-container">
        <form action="#" method="POST">
          <label>Product Name:</label>
          <input
            type="text"
            placeholder="Enter product name"
            required
            onChange={(e) => setProductName(e.target.value)}
          />
          <label>Product Description:</label>
          <input
            type="text"
            placeholder="Enter product description"
            required
            onChange={(e) => setProductDescription(e.target.value)}
          />
          <label>Product Quantity:</label>
          <input
            type="number"
            placeholder="Enter product quantity"
            required
            onChange={(e) =>
              setProductQuantity(parseInt(e.target.value.trim(), 10))
            }
          />
          <label>Product Image:</label>
          <input
            type="text"
            placeholder="Enter product image URL"
            required
            onChange={(e) => setProductImage(e.target.value)}
          />
          <label>Product Price:</label>
          <input
            type="number"
            placeholder="Enter product price"
            required
            onChange={(e) =>
              setProductPrice(parseInt(e.target.value.trim(), 10))
            }
          />
          <label className="onSale-label">On Sale: </label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                checked={selectedOnSaleRadio === true}
                onClick={handleOnSaleRadioSelection}
                name="onSale"
                value="yes"
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                checked={selectedOnSaleRadio === false}
                onClick={handleOnSaleRadioSelection}
                name="onSale"
                value="no"
              />{" "}
              No
            </label>
          </div>

          <button onClick={handleAddProduct}>Add Product</button>
          <button onClick={() => history.push(`/Products/${categoryId}`)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

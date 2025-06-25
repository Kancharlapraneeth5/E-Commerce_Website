import { useHistory, useParams } from "react-router-dom";
import { useState } from "react";

const AddReview = () => {
  const [Title, setTitle] = useState("");
  const [Comment, setComment] = useState("");
  const [Rating, setRating] = useState(0);

  const { categoryId, productID } = useParams();
  const history = useHistory();

  const formattedDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      credentials: "include",
      body: JSON.stringify({
        query: `
          mutation AddNewReview($title: String!, $comment: String!, $rating: Int!, $date: String!, $productId: ID!) {
            addNewReview(input: { title: $title, comment: $comment, rating: $rating,  date: $date, productId: $productId }) {
              title
              comment
              rating
              date
              productId
            }
          }
        `,
        variables: {
          title: Title,
          comment: Comment,
          rating: parseInt(Rating, 10),
          date: formattedDate(new Date()),
          productId: productID,
        },
        operationName: "AddNewReview",
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
          history.push("/FeedBackDone");
          console.log("Review added successfully", JSON.stringify(data));
        }
      })
      .catch((error) => {
        console.error("Network Error:", error); // Handle any network-related errors
      });
  };

  return (
    <div className="add-review">
      <h2>Add Review</h2>
      <div className="review-container">
        <form action="#" method="POST">
          <label>Title :</label>
          <input
            type="text"
            placeholder="Enter review title"
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Comment :</label>
          <input
            type="text"
            placeholder="Enter review comment"
            required
            onChange={(e) => setComment(e.target.value)}
          />

          <label>Rating :</label>
          <input
            type="number"
            placeholder="Enter review rating"
            required
            onChange={(e) => setRating(e.target.value)}
          />

          <button onClick={handleAddReview}>Add Review</button>
          <button onClick={() => history.push(`/Products/${categoryId}`)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReview;

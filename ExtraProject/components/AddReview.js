import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AppContext, { Actions } from "../AppContext";
import Icon from "react-native-vector-icons/FontAwesome";

const AddReview = ({ navigation, route }) => {
  const product = route.params;
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const { state, dispatch } = useContext(AppContext);

  const handleStarPress = (rating) => {
    setStars(rating);
  };

  const handleCommentChange = (text) => {
    setComment(text);
  };

  const handleSubmitReview = async () => {
    dispatch({ type: Actions.SHOW_LOADING });
    // submit to server and refresh
    const obj = {
      stars: stars,
      comment: comment || "no comment",
    };
    try {
      await state.api.post("/products/" + product._id + "/reviews", obj);
      // update local context data
      const review = product.review;
      const feedbacks = [...review.feedbacks, obj];
      let sum = 0;
      feedbacks.forEach((f) => {
        sum += f.stars;
      });
      review.score = sum / feedbacks.length;
      review.feedbacks = feedbacks;
      dispatch({ type: Actions.PRODUCTS, payload: [...state.products] });
      // rest data
      setStars(0);
      setComment("");
      // back
      navigation.goBack();
    } catch (err) {
      console.log(err);
      dispatch({ type: Actions.HIDE_LOADING });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>Rating:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => handleStarPress(i)}>
              <Icon
                name="star"
                size={32}
                color={i <= stars ? "#FFD700" : "#D3D3D3"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.commentText}>Comment:</Text>
      <TextInput
        style={styles.commentInput}
        value={comment}
        onChangeText={handleCommentChange}
        placeholder="Write your comment"
        multiline={true}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitReview}
      >
        <Text style={styles.submitButtonText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: "row",
  },
  commentText: {
    fontSize: 16,
    marginBottom: 8,
  },
  commentInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    padding: 8,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#4287f5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddReview;

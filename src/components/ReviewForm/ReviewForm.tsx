import React, { useState } from "react";
import { Button } from "~/components/ui/Button";
import { useForm } from "react-hook-form";
import StarRating from "~/components/ui/StarRating";

type Props = {
  productId: string;
  addReview: (review : any) => void;
  userId: string;
  name: string;
  image: string;
};

type Inputs = {
  review: string;
};

const ReviewForm = ({ productId, addReview, userId, name, image }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    addReview({ userId, productId, rating, review: data.review, name, image });
  };

  const [rating, setRating] = useState(0);
  const [error, setError] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StarRating rating={rating} setRating={setRating} />
      {error && rating === 0 && (
        <p className="text-red-500">Please select a rating</p>
      )}
      <textarea
        {...register("review", { required: "This is required", minLength: 6 })}
        placeholder={"What did you like or dislike?"}
        className="my-6 h-32 w-full rounded-[12px_12px_0_12px] border-[3px] border-black p-4"
      ></textarea>
      <p className="text-red-500">{errors?.review?.message}</p>
      {rating === 0 ? (
        <Button onClick={() => setError(true)}>Submit</Button>
      ) : (
        <Button type="submit">Submit</Button>
      )}
    </form>
  );
};

export default ReviewForm;

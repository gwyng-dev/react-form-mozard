import { MozardStepProps } from "react-form-mozard";
import { memo } from "react";
import { useForm } from "react-hook-form";

export type WhichKorea = {
  side: "North" | "South";
};

export const WhichKoreaForm = memo((props: MozardStepProps<WhichKorea>) => {
  const { register, handleSubmit } = useForm<WhichKorea>();

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <h2>South or North?</h2>
      <select {...register("side")}>
        <option value="South">🇰🇷 South</option>
        <option value="North">🇰🇵 North</option>
      </select>
      <input type="submit" />
    </form>
  );
});

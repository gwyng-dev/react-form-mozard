import { MozardStepProps } from "react-form-mozard";
import { memo } from "react";
import { useForm } from "react-hook-form";

export type Profile = {
  name: string;
  age: number;
};

export const ProfileForm = memo((props: MozardStepProps<Profile>) => {
  const { register, handleSubmit } = useForm<Profile>();

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <h2>Who are you?</h2>
      <label>
        Name
        <input {...register("name", { required: true })} autoFocus />
      </label>
      &nbsp;
      <label>
        Age
        <input {...register("age", { required: true, valueAsNumber: true })} />
      </label>
      <input type="submit" />
    </form>
  );
});

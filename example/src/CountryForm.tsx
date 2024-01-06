import { MozardStepProps } from "react-form-mozard";
import { memo } from "react";
import { useForm } from "react-hook-form";

export type Country = {
  country: string;
};

export type Props = MozardStepProps<Country> & {
  isMinor: boolean;
};

export const CountryForm = memo((props: Props) => {
  const { isMinor, onSubmit } = props;
  const { register, handleSubmit } = useForm<Country>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>{isMinor ? `Kid, w` : "W"}here are you from?</h2>
      <select {...register("country")}>
        <option value="China">🇨🇳 China</option>
        <option value="Japan">🇯🇵 Japan</option>
        <option value="Korea">🇰🇷 Korea</option>
      </select>
      <input type="submit" />
    </form>
  );
});

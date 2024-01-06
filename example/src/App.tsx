import "./App.css";
import { Country, CountryForm } from "./CountryForm";
import { Entry, useMozard } from "react-form-mozard";
import { Profile, ProfileForm } from "./ProfileForm";
import { WhichKorea, WhichKoreaForm } from "./WhichKoreaForm";
import { useState } from "react";

function App() {
  const [values, setValue] = useState<Entry<Schema>[]>([]);
  const { elements, done, value, get } = useMozard<Schema, Result>({
    values,
    onNext: setValue,
    *do(step) {
      const { name, age } = yield* step("profile", ProfileForm, {});
      const isMinor = age < 20;

      const { country } = yield* step("country", CountryForm, { isMinor });
      if (country !== "Korea") {
        return {
          name,
          age,
          country,
        };
      }

      const { side } = yield* step("whichKorea", WhichKoreaForm, {});
      return {
        name,
        age,
        country: `${side} ${country}`,
      };
    },
  });

  const profile = get("profile");
  const country = get("country");

  const activeIndex = values.length + 1;

  return (
    <div>
      {done ? (
        <>
          <h1>Done</h1>
          <button
            onClick={() => {
              setValue([]);
            }}
          >
            Reset
          </button>
          <h2>
            {value.name} is {value.age} years old and from {value.country}!
          </h2>
        </>
      ) : (
        <>
          <h1>Step {activeIndex}</h1>
          <button
            onClick={() => {
              setValue(values.slice(0, -1));
            }}
          >
            Back
          </button>
          <ul>
            {profile && (
              <>
                <li>name: {profile.name}</li>
                <li>age: {profile.age}</li>
              </>
            )}
            {country && <li>country: {country.country}</li>}
          </ul>
          {elements.at(-1)}
        </>
      )}
    </div>
  );
}

export default App;

type Schema = {
  profile: Profile;
  country: Country;
  whichKorea: WhichKorea;
};

type Result = {
  name: string;
  age: number;
  country: string;
};

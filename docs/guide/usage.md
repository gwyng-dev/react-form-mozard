# Usage

## Basic Implementation

### Form Component Definition

Create form components that implement the `MozardStepProps<T>` interface:

```tsx
import { MozardStepProps } from 'react-form-mozard';
import { useForm } from 'react-hook-form';

export type Profile = {
  name: string;
  age: number;
};

export const ProfileForm = (props: MozardStepProps<Profile>) => {
  const { register, handleSubmit } = useForm<Profile>();

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <input {...register("name", { required: true })} placeholder="Name" />
      <input {...register("age", { required: true, valueAsNumber: true })} placeholder="Age" />
      <button type="submit">Next</button>
    </form>
  );
};
```

### Flow Definition

Implement the form flow using the `useMozard` hook:

```tsx
import { useMozard, Entry } from 'react-form-mozard';
import { useState } from 'react';

function App() {
  const [values, setValue] = useState<Entry<Schema>[]>([]);

  const { elements, done, value } = useMozard<Schema, Result>({
    values,
    onNext: setValue,
    *do(step) {
      const profile = yield* step("profile", ProfileForm, {});

      if (profile.age < 18) {
        const consent = yield* step("parentConsent", ParentConsentForm, {});
        return { profile, consent };
      }

      const preferences = yield* step("preferences", PreferencesForm, {});
      return { profile, preferences };
    }
  }, []);

  return (
    <div>
      {done ? (
        <div>Complete: {JSON.stringify(value)}</div>
      ) : (
        <div>{elements.at(-1)}</div>
      )}
    </div>
  );
}
```

## Advanced Patterns

### Loops and Dynamic Steps

```tsx
*do(step) {
  const user = yield* step("user", UserForm, {});

  if (user.type === "admin") {
    const settings = yield* step("adminSettings", AdminSettingsForm, {});
    return { user, settings };
  }

  const items = [];
  let continueAdding = true;

  while (continueAdding) {
    const item = yield* step(`item-${items.length}`, ItemForm, {});
    items.push(item);

    const { continue } = yield* step(
      `continue-${items.length}`,
      ContinueForm,
      { itemCount: items.length }
    );
    continueAdding = continue;
  }

  return { user, items };
}
```

### Previous Step Data Access

```tsx
*do(step) {
  const profile = yield* step("profile", ProfileForm, {});

  const address = yield* step("address", AddressForm, {
    country: profile.country,
    showParentFields: profile.age < 18
  });

  const summary = yield* step("summary", SummaryForm, {
    profile,
    address,
    stepCount: 3
  });

  return { profile, address, summary };
}
```

### Navigation and State Access

```tsx
function App() {
  const [values, setValue] = useState<Entry<Schema>[]>([]);
  const { elements, done, value, get } = useMozard(config, []);

  const profile = get("profile");
  const address = get("address");

  return (
    <div>
      <div>Step: {values.length + 1}</div>

      {values.length > 0 && (
        <button onClick={() => setValue(values.slice(0, -1))}>
          Previous
        </button>
      )}

      {elements.at(-1)}

      {profile && <div>Name: {profile.name}</div>}
      {address && <div>City: {address.city}</div>}
    </div>
  );
}
```

## Type Definitions

```tsx
type Schema = {
  profile: Profile;
  address: Address;
  preferences: Preferences;
};

type Result = {
  profile: Profile;
  address: Address;
  preferences?: Preferences;
};
```

This approach enables type-safe, declarative composition of complex form workflows.

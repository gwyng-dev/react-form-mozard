# Examples

## 1. User Registration with Conditional Branching

This example demonstrates conditional form flow based on user age:

```tsx
import { useMozard, Entry, MozardStepProps } from 'react-form-mozard';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type Profile = { name: string; age: number; email: string };
type ParentConsent = { parentEmail: string; agreed: boolean };
type Preferences = { newsletter: boolean; theme: 'light' | 'dark' };

type Schema = {
  profile: Profile;
  parentConsent: ParentConsent;
  preferences: Preferences;
};

type Result = {
  profile: Profile;
  parentConsent?: ParentConsent;
  preferences: Preferences;
};

const ProfileForm = (props: MozardStepProps<Profile>) => {
  const { register, handleSubmit } = useForm<Profile>();

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <h2>Basic Information</h2>
      <input {...register("name", { required: true })} placeholder="Name" />
      <input {...register("age", { required: true, valueAsNumber: true })} placeholder="Age" />
      <input {...register("email", { required: true })} placeholder="Email" />
      <button type="submit">Next</button>
    </form>
  );
};

const ParentConsentForm = (props: MozardStepProps<ParentConsent>) => {
  const { register, handleSubmit } = useForm<ParentConsent>();

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <h2>Parental Consent (Under 18)</h2>
      <input {...register("parentEmail", { required: true })} placeholder="Parent Email" />
      <label>
        <input {...register("agreed", { required: true })} type="checkbox" />
        Parent has consented to registration
      </label>
      <button type="submit">Next</button>
    </form>
  );
};

const PreferencesForm = (props: MozardStepProps<Preferences> & { isMinor: boolean }) => {
  const { register, handleSubmit } = useForm<Preferences>();

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <h2>Preferences</h2>
      {!props.isMinor && (
        <label>
          <input {...register("newsletter")} type="checkbox" />
          Subscribe to newsletter
        </label>
      )}
      <select {...register("theme")}>
        <option value="light">Light Theme</option>
        <option value="dark">Dark Theme</option>
      </select>
      <button type="submit">Complete</button>
    </form>
  );
};

export function RegistrationApp() {
  const [values, setValue] = useState<Entry<Schema>[]>([]);

  const { elements, done, value, get } = useMozard<Schema, Result>({
    values,
    onNext: setValue,
    *do(step) {
      const profile = yield* step("profile", ProfileForm, {});

      let parentConsent: ParentConsent | undefined;
      if (profile.age < 18) {
        parentConsent = yield* step("parentConsent", ParentConsentForm, {});
      }

      const preferences = yield* step("preferences", PreferencesForm, {
        isMinor: profile.age < 18
      });

      return { profile, parentConsent, preferences };
    }
  }, []);

  const profile = get("profile");
  const currentStep = values.length + 1;
  const totalSteps = profile?.age < 18 ? 3 : 2;

  return (
    <div>
      <div>Progress: {currentStep}/{totalSteps}</div>

      {done ? (
        <div>
          <h1>Registration Complete!</h1>
          <pre>{JSON.stringify(value, null, 2)}</pre>
          <button onClick={() => setValue([])}>Start Over</button>
        </div>
      ) : (
        <div>
          {values.length > 0 && (
            <button onClick={() => setValue(values.slice(0, -1))}>
              Previous
            </button>
          )}
          {elements.at(-1)}
        </div>
      )}
    </div>
  );
}
```

## 2. Dynamic Item Collection

This example shows how to implement dynamic form loops:

```tsx
type User = { name: string; role: 'user' | 'admin' };
type Item = { title: string; description: string };
type ContinueChoice = { continue: boolean };

const ItemForm = (props: MozardStepProps<Item> & { index: number }) => {
  const { register, handleSubmit } = useForm<Item>();

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <h2>Item #{props.index + 1}</h2>
      <input {...register("title", { required: true })} placeholder="Title" />
      <textarea {...register("description")} placeholder="Description" />
      <button type="submit">Add</button>
    </form>
  );
};

const ContinueForm = (props: MozardStepProps<ContinueChoice> & { itemCount: number }) => {
  const { register, handleSubmit } = useForm<ContinueChoice>();

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <h2>Currently {props.itemCount} items added</h2>
      <label>
        <input {...register("continue")} type="checkbox" />
        Add more items?
      </label>
      <button type="submit">Continue</button>
    </form>
  );
};

export function DynamicItemApp() {
  const [values, setValue] = useState<Entry<any>[]>([]);

  const { elements, done, value } = useMozard({
    values,
    onNext: setValue,
    *do(step) {
      const user = yield* step("user", UserForm, {});

      const items: Item[] = [];
      let shouldContinue = true;

      const firstItem = yield* step("item-0", ItemForm, { index: 0 });
      items.push(firstItem);

      while (shouldContinue) {
        const { continue: wantMore } = yield* step(
          `continue-${items.length}`,
          ContinueForm,
          { itemCount: items.length }
        );

        if (wantMore) {
          const nextItem = yield* step(
            `item-${items.length}`,
            ItemForm,
            { index: items.length }
          );
          items.push(nextItem);
        } else {
          shouldContinue = false;
        }
      }

      return { user, items };
    }
  }, []);

  return (
    <div>
      {done ? (
        <div>
          <h1>Complete!</h1>
          <h2>{value.user.name}'s items:</h2>
          <ul>
            {value.items.map((item, i) => (
              <li key={i}>{item.title}: {item.description}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>{elements.at(-1)}</div>
      )}
    </div>
  );
}
```

## 3. Complex Conditional Flows

This example demonstrates multiple branching paths based on user type:

```tsx
type UserType = { type: 'admin' | 'user'; email: string };
type AdminSettings = { permissions: string[]; department: string };
type UserProfile = { bio: string; interests: string[] };
type Verification = { code: string };

export function ConditionalFlowApp() {
  const [values, setValue] = useState<Entry<any>[]>([]);

  const { elements, done, value } = useMozard({
    values,
    onNext: setValue,
    *do(step) {
      const userType = yield* step("userType", UserTypeForm, {});

      if (userType.type === "admin") {
        const verification = yield* step("verification", VerificationForm, {});
        const adminSettings = yield* step("adminSettings", AdminSettingsForm, {});

        return {
          type: "admin" as const,
          email: userType.email,
          verification,
          settings: adminSettings
        };
      } else {
        const profile = yield* step("userProfile", UserProfileForm, {});

        if (profile.interests.length >= 3) {
          const survey = yield* step("survey", SurveyForm, { interests: profile.interests });
          return {
            type: "user" as const,
            email: userType.email,
            profile,
            survey
          };
        }

        return {
          type: "user" as const,
          email: userType.email,
          profile
        };
      }
    }
  }, []);

  return (
    <div>
      {done ? (
        <div>
          <h1>Setup Complete</h1>
          <p>User Type: {value.type}</p>
          <pre>{JSON.stringify(value, null, 2)}</pre>
        </div>
      ) : (
        <div>{elements.at(-1)}</div>
      )}
    </div>
  );
}
```

## Best Practices

### Step Key Naming

```typescript
// ✅ Good
yield* step("profile", ProfileForm, {});
yield* step("address", AddressForm, {});
yield* step(`item-${index}`, ItemForm, {});

// ❌ Avoid
yield* step("step1", ProfileForm, {});
yield* step("item", ItemForm, {});
```

### Type Safety in Branches

```typescript
*do(step) {
  const user = yield* step("user", UserForm, {});

  if (user.type === "admin") {
    const settings = yield* step("adminSettings", AdminSettingsForm, {});
    return { user, adminSettings: settings };
  }

  const profile = yield* step("userProfile", UserProfileForm, {});
  return { user, userProfile: profile };
}
```

These examples demonstrate how Mozard enables concise, type-safe composition of complex form workflows using standard JavaScript control structures.

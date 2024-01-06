# react-form-mozard

**react-form-mozard** helps you build multi-step forms (also known as form wizards) easily.

## Installation
```shell
npm i react-form-mozard
```

## Motivation

A multi-step form is a common pattern in web development. However, it introduces complex and dirty state management. The solution is monad, once again.

Mozard composes forms just like Mozart composes songs.

## Example

```ts
const { elements, done, value, get } = useMozard<MozardSchema, Result>({
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
```

Let's break down the code above.
```ts
const { name, age } = yield* step("profile", ProfileForm, {});
```
You can understand this line as
```tsx
const { name, age } = yield* <ProfileForm key="profile">
```

which means that `ProfileForm` is rendered to retrieve name and age values. 
The current interface is introduced for type inference, though the JSX version is more concise.


You can use the name and age values in the next step.
You can use them to set props for the next step, or you can use them to decide which step to go to next.
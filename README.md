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
      return { name, age, country };
    }

    const { side } = yield* step("whichKorea", WhichKoreaForm, {});
    return { name, age, country: `${side} ${country}` }
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

which means that `ProfileForm` is rendered to retrieve `name` and `age`. 
The current interface is introduced for type inference, though the JSX version is more concise.

You can use `name` and `age` in the next step.
You can use them to set props for the next form component, or you can use them to decide which step to go to next.

elements is an array of elements that have been rendered so far.
You can render all of them at once, like:
```tsx
return (
  <SomeLayout>
    {elements}
  </SomeLayout>
);
```
which renders all the subforms that have submitted their values and also the current step.
 
Or, you can render only the last element, like
```tsx
return (
  <SomeLayout>
    {!done && elements.at(-1)}
  </SomeLayout>
);
```
The last element is the current step, which has not submitted its value yet.
done indicates whether the entire form has been completed.

The more detailed example is available [here](example/src/App.tsx)

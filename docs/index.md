---
layout: home
hero:
  name: React Form Mozard
  text: Monadic Form Composition for React
  tagline: Compose complex form flows declaratively using JavaScript Generators
  actions:
    - theme: brand
      text: Get Started
      link: /guide/overview
    - theme: alt
      text: GitHub
      link: https://github.com/gwyng-dev/react-form-mozard
features:
  - icon: 🔗
    title: Monadic Composition
    details: Chain form steps naturally using Generator functions and conditional logic
  - icon: 🎯
    title: Type Safety
    details: Full TypeScript support with compile-time guarantees for form flow integrity
  - icon: 🔄
    title: State Management
    details: Automatic state preservation and restoration for seamless navigation
---

## What is Mozard?

React Form Mozard solves common challenges in multi-step form development:

- **Conditional branching**: Dynamically alter form flow based on user input
- **State persistence**: Maintain form state across navigation and browser sessions
- **Complex validation**: Handle interdependent form steps with ease

Mozard leverages JavaScript Generators to provide a declarative approach to form composition:

```typescript
*do(step) {
  const profile = yield* step("profile", ProfileForm, {});

  if (profile.age < 18) {
    const consent = yield* step("parentConsent", ParentConsentForm, {});
    return { profile, consent };
  }

  const preferences = yield* step("preferences", PreferencesForm, {});
  return { profile, preferences };
}
```

This approach eliminates boilerplate state management code while maintaining type safety.

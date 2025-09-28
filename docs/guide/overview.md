# Overview

React Form Mozard is a library that implements monadic form composition using JavaScript Generators. It provides a declarative approach to building complex multi-step forms with automatic state management and type safety.

## Core Concepts

### Generator-Based Flow Control

Traditional multi-step forms require complex state management:

```typescript
const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState({});

// Manual step management with conditional logic...
```

Mozard uses Generator functions to handle flow control declaratively:

```typescript
const { elements, done, value } = useMozard({
  values: [],
  onNext: setValues,
  *do(step) {
    const profile = yield* step("profile", ProfileForm, {});

    if (profile.age < 18) {
      const consent = yield* step("consent", ConsentForm, {});
      return { profile, consent };
    }

    const preferences = yield* step("preferences", PreferencesForm, {});
    return { profile, preferences };
  }
}, []);
```

### Monadic Composition Benefits

- **Sequential Dependencies**: Each step can access results from previous steps
- **Conditional Branching**: Use standard JavaScript control structures for dynamic flows
- **Type Safety**: Full TypeScript inference for form schemas and results
- **State Persistence**: Automatic preservation and restoration of form state

### Comparison with Traditional Approaches

**Traditional State-Based Approach:**
```typescript
const [step, setStep] = useState(1);
const [profile, setProfile] = useState(null);
const [address, setAddress] = useState(null);

// Complex conditional rendering and state synchronization...
```

**Mozard Monadic Approach:**
```typescript
const { elements, done, value } = useMozard({
  values: [],
  onNext: setValues,
  *do(step) {
    // Declarative flow definition
  }
}, []);
```

## Why "Monadic"?

The library implements functional programming concepts using JavaScript Generators:

- **Functor**: Maps step results to subsequent steps
- **Applicative**: Combines results from multiple form branches
- **Monad**: Maintains form context while enabling sequential operations

This pattern enables concise expression of complex form logic.

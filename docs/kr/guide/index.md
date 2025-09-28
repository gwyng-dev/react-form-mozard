---
layout: home
hero:
  name: React Form Mozard
  text: 리액트를 위한 모나딕 폼 합성
  tagline: JavaScript Generator를 사용해 복잡한 폼 플로우를 선언적으로 구성하세요
  actions:
    - theme: brand
      text: 시작하기
      link: /kr/overview
    - theme: alt
      text: GitHub
      link: https://github.com/gwyng-dev/react-form-mozard
features:
  - icon: 🔗
    title: 모나딕 합성
    details: Generator 함수와 조건문을 사용해 폼 단계를 자연스럽게 연결하세요
  - icon: 🎯
    title: 타입 안전성
    details: TypeScript와 함께 완벽한 컴파일 타임 타입 보장을 제공합니다
  - icon: 🔄
    title: 상태 관리
    details: 네비게이션과 브라우저 세션에서 폼 상태를 자동으로 보존하고 복원합니다
---

## Mozard가 무엇인가요?

React Form Mozard는 다단계 폼 개발에서 자주 발생하는 문제들을 해결합니다:

- **조건부 분기**: 사용자 입력에 따라 폼 플로우를 동적으로 변경
- **상태 지속성**: 네비게이션과 브라우저 세션에서 폼 상태 유지
- **복잡한 검증**: 상호 의존적인 폼 단계들을 쉽게 처리

Mozard는 JavaScript Generator를 활용해 폼 합성을 위한 선언적 접근 방식을 제공합니다:

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

이 접근 방식은 타입 안전성을 유지하면서 복잡한 폼 로직을 간결하게 표현할 수 있게 해줍니다.

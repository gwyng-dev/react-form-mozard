---
layout: home
hero:
  name: React Form Mozard
  text: 다단계 폼이 이렇게 쉬울 줄이야
  tagline: Generator로 폼 플로우 짜는 새로운 방법
  actions:
    - theme: brand
      text: 어떻게 쓰는지 보기
      link: /guide/overview
    - theme: alt
      text: GitHub
      link: https://github.com/gwyng-dev/react-form-mozard
features:
  - icon: 🤯
    title: 진짜 간단함
    details: if문 쓰듯이 폼 플로우 짜면 됨. 복잡한 상태 관리는 라이브러리가 알아서.
  - icon: 🔒
    title: 타입 안전
    details: TypeScript가 각 단계에서 뭐가 들어오고 나가는지 다 체크해줌.
  - icon: ⏪
    title: 뒤로 가기 공짜
    details: 사용자가 뒤로 가면 이전 상태 그대로 복원. 추가 코드 필요 없음.
---

## 이게 뭔가요?

다단계 폼 만들 때 이런 고민 해본 적 있죠?

- "2단계에서 입력한 값에 따라 3단계가 달라져야 하는데..."
- "뒤로 가기 누르면 이전에 입력한 값들이 다 사라져..."
- "조건부 분기가 복잡해서 상태 관리가 지옥..."

Mozard는 JavaScript Generator를 써서 이런 문제들을 해결합니다. 그냥 함수 쓰듯이 자연스럽게 쓰면 됨:

```typescript
*do(step) {
  const profile = yield* step("profile", ProfileForm, {});
  
  // 미성년자면 보호자 동의 받기
  if (profile.age < 20) {
    const consent = yield* step("parentConsent", ParentConsentForm, {});
    return { profile, consent };
  }
  
  // 성인이면 바로 환경설정
  const prefs = yield* step("preferences", PreferencesForm, {});
  return { profile, prefs };
}
```

네, 이게 다입니다. if문 쓰듯이 쓰면 되고, 뒤로 가기도 알아서 되고, 타입도 안전함.

# 실제로 어떻게 쓰나요?

## 설치부터

```bash
npm install react-form-mozard
```

## 기본 사용법

### 1. 폼 컴포넌트 만들기

각 단계별로 컴포넌트를 만들면 돼요. 특별한 건 없고 그냥 평범한 React 컴포넌트예요.

**중요한 점**: `MozardStepProps<T>`를 받아서 `onSubmit`으로 데이터를 전달해야 해요.

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
      <input {...register("name", { required: true })} placeholder="이름" />
      <input {...register("age", { required: true, valueAsNumber: true })} placeholder="나이" />
      <button type="submit">다음</button>
    </form>
  );
};
```

### 2. 플로우 짜기

이제 재미있는 부분이에요. `useMozard` 훅으로 폼 플로우를 정의해보죠.

**핵심 개념들**:
- `values`: 현재까지 입력된 데이터들의 배열
- `onNext`: 새로운 단계가 완료될 때 호출되는 함수
- `*do(step)`: Generator 함수로 전체 플로우를 정의
- `yield* step()`: 각 단계를 실행하고 결과를 받아옴

```tsx
import { useMozard, Entry } from 'react-form-mozard';
import { useState } from 'react';

function App() {
  const [values, setValue] = useState<Entry<Schema>[]>([]);
  
  const { elements, done, value } = useMozard<Schema, Result>({
    values,
    onNext: setValue,
    *do(step) {
      // 1단계: 프로필 입력받기
      const profile = yield* step("profile", ProfileForm, {});
      
      // 2단계: 나이 확인해서 분기
      if (profile.age < 20) {
        // 미성년자는 보호자 동의 필요
        const consent = yield* step("parentConsent", ParentConsentForm, {});
        return { profile, consent };
      }
      
      // 성인은 바로 환경설정으로
      const preferences = yield* step("preferences", PreferencesForm, { profile });
      return { profile, preferences };
    }
  }, []);

  return (
    <div>
      {done ? (
        <div>🎉 완료! {JSON.stringify(value)}</div>
      ) : (
        <div>{elements.at(-1)}</div>
      )}
    </div>
  );
}
```

## 좀 더 복잡한 것들

### 반복문도 됩니다

**주의사항**: 반복문에서 `step`의 키는 고유해야 해요. 보통 인덱스를 포함해서 `item-${index}` 형태로 만들어요.

```tsx
*do(step) {
  const user = yield* step("user", UserForm, {});
  
  // 관리자면 다른 플로우로
  if (user.type === "admin") {
    const adminSettings = yield* step("adminSettings", AdminSettingsForm, {});
    return { user, adminSettings };
  }
  
  // 아이템을 계속 추가할 수 있게
  const items = [];
  let keepGoing = true;
  
  while (keepGoing) {
    const item = yield* step(`item-${items.length}`, ItemForm, {});
    items.push(item);
    
    // "더 추가할래요?" 물어보기
    const { continue: wantMore } = yield* step(
      `continue-${items.length}`, 
      ContinueForm, 
      { itemCount: items.length }
    );
    keepGoing = wantMore;
  }
  
  return { user, items };
}
```

### 이전 단계 결과 써먹기

```tsx
*do(step) {
  const profile = yield* step("profile", ProfileForm, {});
  
  // 프로필 정보를 다음 단계에서 활용
  const address = yield* step("address", AddressForm, { 
    defaultCountry: profile.country,
    showParentFields: profile.age < 18 
  });
  
  // 지금까지 입력한 걸 요약해서 보여주기
  const summary = yield* step("summary", SummaryForm, { 
    profile, 
    address,
    stepCount: 3 
  });
  
  return { profile, address, summary };
}
```

### 뒤로 가기와 상태 확인

**중요한 동작 원리**:
- `values.slice(0, -1)`: 마지막 단계를 제거해서 이전 단계로 돌아감
- `get("stepKey")`: 특정 단계의 결과를 가져옴 (아직 완료되지 않았으면 `undefined`)
- `elements.at(-1)`: 현재 활성화된 폼 컴포넌트 (배열의 마지막 요소)

```tsx
function App() {
  const [values, setValue] = useState<Entry<Schema>[]>([]);
  const { elements, done, value, get } = useMozard(config, []);
  
  // 지금까지 입력한 데이터 가져오기
  const profile = get("profile");
  const address = get("address");
  
  return (
    <div>
      {/* 몇 단계인지 보여주기 */}
      <div>📍 {values.length + 1}단계</div>
      
      {/* 뒤로 가기 버튼 */}
      {values.length > 0 && (
        <button onClick={() => setValue(values.slice(0, -1))}>
          ← 이전으로
        </button>
      )}
      
      {/* 현재 폼 */}
      {elements.at(-1)}
      
      {/* 입력한 거 미리보기 */}
      {profile && <div>👤 {profile.name}님</div>}
      {address && <div>📍 {address.city}</div>}
    </div>
  );
}
```

## 타입은 어떻게 하나요?

**Schema vs Result의 차이점**:
- `Schema`: 각 단계에서 나올 수 있는 모든 데이터 타입들을 정의
- `Result`: 실제로 최종 결과에 포함될 데이터 타입을 정의

```tsx
// 각 단계에서 나오는 데이터 타입들
type Schema = {
  profile: Profile;
  address: Address;
  preferences: Preferences;
  adminSettings: AdminSettings;  // 관리자만 거치는 단계
};

// 최종 결과 타입 (조건에 따라 다를 수 있음)
type Result = {
  profile: Profile;
  address: Address;
  preferences?: Preferences;     // 일반 사용자만
  adminSettings?: AdminSettings; // 관리자만
};
```

**타입 추론의 동작**:
- `yield* step("profile", ProfileForm, {})`에서 `profile`의 타입이 자동으로 `Profile`로 추론돼요.
- 잘못된 키를 사용하면 컴파일 에러가 나요.
- `get("profile")`의 반환 타입도 `Profile | undefined`로 정확히 추론돼요.

## 정리하면

- 각 단계별로 컴포넌트 만들고
- `*do(step)` 함수에서 플로우 정의하고
- `yield* step()`으로 단계 연결하면 끝

생각보다 간단하죠? 복잡한 상태 관리는 라이브러리가 다 해줘요.

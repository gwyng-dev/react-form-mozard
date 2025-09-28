# 실전 예제들

## 1. 회원가입 폼 (조건부 분기)

미성년자면 보호자 동의 받고, 성인이면 바로 환경설정으로 가는 예제입니다.

```tsx
import { useMozard, Entry, MozardStepProps } from 'react-form-mozard';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// 타입 정의
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
      <h2>기본 정보</h2>
      <input {...register("name", { required: true })} placeholder="이름" />
      <input {...register("age", { required: true, valueAsNumber: true })} placeholder="나이" />
      <input {...register("email", { required: true })} placeholder="이메일" />
      <button type="submit">다음</button>
    </form>
  );
};

const ParentConsentForm = (props: MozardStepProps<ParentConsent>) => {
  const { register, handleSubmit } = useForm<ParentConsent>();

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <h2>보호자 동의 (18세 미만)</h2>
      <input {...register("parentEmail", { required: true })} placeholder="보호자 이메일" />
      <label>
        <input {...register("agreed", { required: true })} type="checkbox" />
        보호자가 가입에 동의했습니다
      </label>
      <button type="submit">다음</button>
    </form>
  );
};

const PreferencesForm = (props: MozardStepProps<Preferences> & { isMinor: boolean }) => {
  const { register, handleSubmit } = useForm<Preferences>();

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <h2>환경설정</h2>
      {!props.isMinor && (
        <label>
          <input {...register("newsletter")} type="checkbox" />
          뉴스레터 구독
        </label>
      )}
      <select {...register("theme")}>
        <option value="light">라이트 테마</option>
        <option value="dark">다크 테마</option>
      </select>
      <button type="submit">완료</button>
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
      <div>진행률: {currentStep}/{totalSteps}</div>

      {done ? (
        <div>
          <h1>가입 완료!</h1>
          <pre>{JSON.stringify(value, null, 2)}</pre>
          <button onClick={() => setValue([])}>다시 시작</button>
        </div>
      ) : (
        <div>
          {values.length > 0 && (
            <button onClick={() => setValue(values.slice(0, -1))}>
              이전
            </button>
          )}
          {elements.at(-1)}
        </div>
      )}
    </div>
  );
}
```

## 2. 동적 아이템 수집

동적 폼 루프를 구현하는 방법을 보여주는 예제입니다:

```tsx
type User = { name: string; role: 'user' | 'admin' };
type Item = { title: string; description: string };
type ContinueChoice = { continue: boolean };

const ItemForm = (props: MozardStepProps<Item> & { index: number }) => {
  const { register, handleSubmit } = useForm<Item>();

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <h2>아이템 #{props.index + 1}</h2>
      <input {...register("title", { required: true })} placeholder="제목" />
      <textarea {...register("description")} placeholder="설명" />
      <button type="submit">추가</button>
    </form>
  );
};

const ContinueForm = (props: MozardStepProps<ContinueChoice> & { itemCount: number }) => {
  const { register, handleSubmit } = useForm<ContinueChoice>();

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <h2>현재 {props.itemCount}개 아이템이 추가되었습니다</h2>
      <label>
        <input {...register("continue")} type="checkbox" />
        더 추가하시겠습니까?
      </label>
      <button type="submit">계속</button>
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
          <h1>완료!</h1>
          <h2>{value.user.name}님의 아이템들:</h2>
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

## 3. 복잡한 조건부 플로우

사용자 타입에 따른 다중 분기 경로를 보여주는 예제입니다:

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
          <h1>설정 완료</h1>
          <p>사용자 타입: {value.type}</p>
          <pre>{JSON.stringify(value, null, 2)}</pre>
        </div>
      ) : (
        <div>{elements.at(-1)}</div>
      )}
    </div>
  );
}
```

## 공통 패턴과 주의사항

### 1. 단계 키 명명 규칙
```typescript
// ✅ 좋은 예
yield* step("profile", ProfileForm, {});
yield* step("address", AddressForm, {});
yield* step(`item-${index}`, ItemForm, {}); // 반복문에서

// ❌ 피해야 할 예  
yield* step("step1", ProfileForm, {}); // 의미 없는 이름
yield* step("item", ItemForm, {}); // 반복문에서 중복 가능
```

### 2. 조건부 분기에서 타입 처리
```typescript
*do(step) {
  const user = yield* step("user", UserForm, {});

  if (user.type === "admin") {
    const settings = yield* step("adminSettings", AdminSettingsForm, {});
    return { user, adminSettings: settings }; // 명시적 키 이름
  }

  const profile = yield* step("userProfile", UserProfileForm, {});
  return { user, userProfile: profile };
}
```

이러한 예제들은 Mozard의 모나딕 합성이 어떻게 복잡한 폼 플로우를 간결하고 타입 안전하게 표현할 수 있는지 보여줍니다. Generator의 `yield*` 구문을 통해 각 단계를 자연스럽게 연결하고, JavaScript의 제어 구조(`if`, `while`, `for`)를 그대로 사용할 수 있습니다.

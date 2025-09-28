# 이게 어떻게 동작하는거죠?

## 문제부터 얘기해보자

다단계 폼 만들어본 사람이면 알 거예요. 이런 상황들:

```typescript
// 😵‍💫 이런 코드 써본 적 있죠?
const [currentStep, setCurrentStep] = useState(1);
const [profileData, setProfileData] = useState();
const [addressData, setAddressData] = useState();
const [paymentData, setPaymentData] = useState();

function handleNext() {
  if (currentStep === 1) {
    // 프로필 검증하고...
    if (profileData.age < 18) {
      setCurrentStep(2.5); // 보호자 동의 단계?
    } else {
      setCurrentStep(2);
    }
  } else if (currentStep === 2) {
    // 또 다른 조건 체크하고...
    // 아 이거 언제까지 해야 하지?
  }
}
```

네, 지옥이죠. 단계가 늘어날수록 코드는 스파게티가 되고, 뒤로 가기는 더 복잡해져요.

## Mozard의 접근법

Generator를 쓰면 이런 식으로 쓸 수 있어요:

```typescript
*do(step) {
  // 1단계: 프로필 입력
  const profile = yield* step("profile", ProfileForm, {});
  
  // 2단계: 나이 체크해서 분기
  if (profile.age < 18) {
    const consent = yield* step("parentConsent", ConsentForm, {});
    // 미성년자 플로우 계속...
  }
  
  // 3단계: 주소 입력 (이전 단계 데이터 활용)
  const address = yield* step("address", AddressForm, { 
    defaultCountry: profile.country 
  });
  
  // 끝!
  return { profile, address };
}
```

## 왜 이게 좋은가?

### 1. 읽기 쉬움
위에서 아래로 읽으면 됩니다. 조건문도 그냥 JavaScript 조건문이에요.

### 2. 상태 관리 자동화
각 단계의 결과는 자동으로 저장되고, 뒤로 가기하면 복원돼요. 신경 쓸 필요 없어요.

### 3. 타입 안전
```typescript
const profile = yield* step("profile", ProfileForm, {});
// profile의 타입이 자동으로 추론됨!
// profile.age 쓸 때 자동완성도 됨
```

### 4. 디버깅 쉬움
각 단계가 독립적이라 문제 생기면 해당 단계만 보면 돼요.

## "모나딕"이 뭔데?

함수형 프로그래밍에서 나온 개념인데, 쉽게 말하면:

> "값을 포장해서 연쇄적으로 처리하는 패턴"

### 왜 "포장"이라고 하나?

일반적인 값은 그냥 `string`, `number` 같은 단순한 데이터예요. 하지만 모나드는 이런 값을 **컨텍스트와 함께 포장**해요.

```typescript
// 일반적인 값
const name = "홍길동";
const age = 25;

// Mozard에서 "포장된" 값
const profile = yield* step("profile", ProfileForm, {});
// profile은 단순히 { name: "홍길동", age: 25 }가 아니라
// "폼 단계를 거쳐서 얻은 값"이라는 컨텍스트를 가짐
```

### Generator와 모나드의 관계

JavaScript의 Generator는 자연스럽게 모나딕 패턴을 구현할 수 있게 해줘요:

```typescript
// Promise 체이닝 (비슷하지만 다름)
step1()
  .then(result1 => step2(result1))
  .then(result2 => step3(result2))

// Generator 기반 모나딕 합성
function* flow() {
  const result1 = yield* step1();
  const result2 = yield* step2(result1);
  const result3 = yield* step3(result2);
  return { result1, result2, result3 };
}
```

### Promise와의 핵심 차이점

1. **중단 가능성**: Generator는 `yield`에서 실행을 멈추고 외부에서 다시 시작할 수 있어요.
2. **상태 보존**: 중단된 지점의 모든 로컬 변수가 그대로 유지돼요.
3. **동기적 코드**: `async/await` 없이도 순차적으로 작성할 수 있어요.

```typescript
*do(step) {
  const profile = yield* step("profile", ProfileForm, {});
  // 여기서 사용자가 브라우저를 닫아도...
  
  const address = yield* step("address", AddressForm, {});
  // 나중에 돌아와서 여기서부터 계속할 수 있음
  // profile 변수도 그대로 살아있음
}
```

이것이 일반적인 상태 관리와 다른 점이에요. `useState`로는 이런 "실행 컨텍스트"를 보존할 수 없거든요.

## 실제로 어떻게 쓰는지 보고 싶다면

[사용법](/guide/usage) 페이지에서 실제 코드를 확인해보세요. 생각보다 간단해요!

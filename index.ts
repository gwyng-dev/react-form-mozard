import * as React from "react";
import { ComponentType, ReactElement, useMemo } from "react";

export type Schema = Record<string, unknown>;
export type Entry<T extends Schema> = {
  [K in keyof T]: readonly [K, T[K]];
}[keyof T];

export type Step<
  T extends Schema,
  K extends keyof T & string = keyof T & string,
> = {
  key: K;
  component: ComponentType<MozardStepProps<T[K]>>;
  props: Omit<MozardStepProps<T[K]>, "onSubmit">;
};

export type StepConstructor<T extends Schema> = <
  K extends keyof T & string,
  P extends MozardStepProps<T[K]>,
>(
  key: K,
  component: ComponentType<P>,
  props: Omit<P, "onSubmit">,
) => Generator<Step<T, K>, T[K], T[K]>;

export type MozardConfig<T extends Schema, R> = {
  values: Entry<T>[];
  onNext(entries: Entry<T>[]): unknown;
  do(step: StepConstructor<T>): Generator<Step<T>, R, unknown>;
};

export type MozardStepProps<T> = {
  onSubmit(data: T): unknown;
};

export type UseMozardReturn<T extends Schema, R> = {
  elements: ReactElement[];
  get<K extends keyof T & string>(key: K): T[K] | undefined;
} & ({ done: true; value: R } | { done: false; value?: undefined });

export const useMozard = <T extends Schema, R>(config: MozardConfig<T, R>) => {
  const { values, onNext } = config;

  const get = <K extends keyof T & string>(key: K) => {
    for (const i of values) {
      if (i[0] === key) {
        return i[1] as T[K];
      }
    }
  };

  return useMemo((): UseMozardReturn<T, R> => {
    const elements: ReactElement[] = [];

    const i = config.do(function* <
      K extends keyof T & string,
      P extends MozardStepProps<T[K]>,
    >(
      key: K,
      component: ComponentType<P>,
      props: Omit<P, "onSubmit">,
    ): Generator<Step<T, K>, T[K], T[K]> {
      return yield { key, component: component as any, props };
    });
    let index = 0;
    let lastValue;
    while (true) {
      const { value, done } = i.next(lastValue);

      if (done) {
        return { elements, done, value, get };
      }

      const { key, component, props } = value;

      elements.push(
        React.createElement(component, {
          ...props,
          key,
          onSubmit(data) {
            const newEntry: Entry<T> = [key, data];
            onNext(
              values.length < index
                ? values.with(index, newEntry)
                : values.concat([newEntry]),
            );
          },
        }),
      );

      if (index >= values.length) {
        return { elements, done: false, get };
      }

      const [oldKey, oldValue] = values[index];
      if (oldKey !== key) {
        return { elements, done: false, get };
      }

      index++;
      lastValue = oldValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);
};

import { JsonArray, JsonObject, JsonPrimitive, JsonValue } from './json';
import { Random, visibleLetters } from './random';

export function genNumber(): number {
  return Random.element([Random.nextInt, Random.nextFloat])();
}

export function genString(length = 8): string {
  return Random.nextString(length, visibleLetters);
}

export function genNull(): null {
  return null;
}

export function getBoolean(): boolean {
  return Random.nextBool();
}

export function genJsonPrimitive(length = 8): JsonPrimitive {
  return Random.element<(length?: number) => JsonPrimitive>([
    genString,
    genNumber,
    genNull,
    getBoolean,
  ])(length);
}

export function genJsonArray(length = 8): JsonArray {
  const xs = new Array(length);
  for (let i = 0; i < length; i++) {
    xs[i] = genJsonValue(length - 1);
  }
  return xs;
}

export function genJsonObject(length = 8): JsonObject {
  const o = {};
  for (let i = 0; i < length; i++) {
    o[genString(length)] = genJsonValue(length - 1);
  }
  return o;
}

export function genJsonValue(length = 8): JsonValue {
  return Random.element<(length?: number) => JsonValue>([
    genJsonPrimitive,
    genJsonArray,
    genJsonObject,
  ])(length);
}

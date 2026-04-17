import "@testing-library/jest-dom";

class SimpleTextEncoder {
  encode(input = ""): Uint8Array {
    return Uint8Array.from(
      unescape(encodeURIComponent(input)).split("").map((char) => char.charCodeAt(0)),
    );
  }
}

class SimpleTextDecoder {
  decode(input?: ArrayBuffer | ArrayBufferView): string {
    if (!input) return "";
    const bytes = input instanceof Uint8Array ? input : new Uint8Array(input as ArrayBuffer);
    return decodeURIComponent(escape(String.fromCharCode(...bytes)));
  }
}

if (typeof globalThis.TextEncoder === "undefined") {
  // React Router relies on these Web APIs in jsdom tests.
  (globalThis as any).TextEncoder = SimpleTextEncoder;
}

if (typeof globalThis.TextDecoder === "undefined") {
  (globalThis as any).TextDecoder = SimpleTextDecoder;
}

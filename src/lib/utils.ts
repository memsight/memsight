import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function sha256(message: string) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

export async function sha256HMac(body: string, secret: string) {
  const enc = new TextEncoder();
  const algorithm = { name: "HMAC", hash: "SHA-256" };

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    algorithm,
    false,
    ["sign", "verify"]
  );

  const signature = await crypto.subtle.sign(
    algorithm.name,
    key,
    enc.encode(body)
  );

  // convert buffer to byte array
  const hashArray = Array.from(new Uint8Array(signature));

  // convert bytes to hex string
  const digest = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return digest;
}

export function unixTimestamp():number {
  return Math.floor(Date.now()/1000);
}

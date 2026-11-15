import { isAxiosError } from "axios";

/**
 * What an HTTP 409 from a contract write (create, update, finalize) means.
 * Not every 409 is a version conflict — only "version" may open the
 * Version Conflict overlay; everything else is a toast.
 */
export type ContractConflictKind = "version" | "duplicate_name" | "unknown";

/** Error codes the backend uses when the expectedVersion is outdated. */
const VERSION_CONFLICT_CODES = new Set(["version_conflict", "contract_version_conflict"]);
/** Error codes the backend uses when the name is taken for this supplier + hotel. */
const DUPLICATE_NAME_CODES = new Set(["contract_name_conflict"]);
/** Backend message for a taken name (compared case-insensitively, trimmed). */
const DUPLICATE_NAME_MESSAGE =
  "contract name must be unique for this supplier and hotel (case-insensitive).";
/** Message fallback for a version conflict when no code is sent. */
const VERSION_MESSAGE = /\bversion\b/;

type ConflictBody = {
  code?: unknown;
  message?: unknown;
  data?: { code?: unknown } | null;
};

const lowerStrings = (values: unknown[]): string[] =>
  values.filter((v): v is string => typeof v === "string").map((v) => v.trim().toLowerCase());

/** The 409 kind, or null when the error is not an HTTP 409. */
export function classifyContractConflict(error: unknown): ContractConflictKind | null {
  if (!isAxiosError<ConflictBody>(error) || error.response?.status !== 409) return null;
  const body = error.response.data;
  const codes = lowerStrings([body?.data?.code, body?.code]);
  const rawMessage = body?.message;
  const messages = lowerStrings(Array.isArray(rawMessage) ? rawMessage : [rawMessage]);

  // Codes are authoritative; the message is only a fallback.
  if (codes.some((code) => DUPLICATE_NAME_CODES.has(code))) return "duplicate_name";
  if (codes.some((code) => VERSION_CONFLICT_CODES.has(code))) return "version";
  if (messages.includes(DUPLICATE_NAME_MESSAGE)) return "duplicate_name";
  if (messages.some((message) => VERSION_MESSAGE.test(message))) return "version";
  return "unknown";
}

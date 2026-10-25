import { Table } from "@/components/contracts/contract-parts";
import { Input } from "@/components/ui/input";
import { fill, useLanguage } from "@/lib/i18n";
import { setChildRule } from "@/store/features/contracts/contract-draft.slice";
import { CHILD_MAX_AGE, CHILD_RULES, type ChildRuleKey } from "@/store/features/contracts/types";
import { childIssues } from "./schema";
import { AmountInput, useAppDispatch, useChildAgeLimit, useContractDraft } from "./shared";

export function ChildrenFields() {
  const { c } = useLanguage();
  const f = c.builder.form;
  const t = f.children;
  const dispatch = useAppDispatch();
  const { basics, children } = useContractDraft();
  const currencySuffix = basics.currency ? { suffix: basics.currency } : {};
  const maxAge = useChildAgeLimit(basics.hotelId);
  const issues = childIssues(children, f.v, maxAge);

  const ageInput = (key: ChildRuleKey, field: "ageFrom" | "ageTo", label: string) => (
    <Input
      key={field}
      aria-label={`${t.rules[key]} · ${label}`}
      inputMode="numeric"
      className="max-w-[96px]"
      value={children[key][field]}
      onChange={(event) => {
        const value = event.target.value;
        if (/^\d{0,2}$/.test(value)) dispatch(setChildRule({ key, field, value }));
      }}
    />
  );

  return (
    <>
      <Table
        head={[t.colRule, t.colAgeFrom, t.colAgeTo, t.colPrice]}
        rows={CHILD_RULES.map((key) => {
          const rule = children[key];
          return [
            <div key="label">
              <p className="text-sm font-medium text-text-primary">{t.rules[key]}</p>
              <p className="mt-0.5 text-xs text-text-muted">{t.hints[key]}</p>
            </div>,
            ageInput(key, "ageFrom", t.colAgeFrom),
            ageInput(key, "ageTo", t.colAgeTo),
            key === "sharing_parents" ? (
              <span key="free" className="text-sm font-medium text-brand-deep">
                {t.free}
              </span>
            ) : (
              <AmountInput
                key="price"
                aria-label={`${t.rules[key]} · ${t.colPrice}`}
                {...currencySuffix}
                className="max-w-[160px]"
                value={rule.price}
                onValue={(value) => dispatch(setChildRule({ key, field: "price", value }))}
              />
            ),
          ];
        })}
      />
      <p className="mt-3 text-xs leading-relaxed text-text-muted">
        {t.requiredNote}
        {maxAge < CHILD_MAX_AGE && ` ${fill(t.ageLimit, { max: maxAge })}`}
      </p>
      {issues.length > 0 && (
        <ul className="mt-3 space-y-1">
          {issues.map((message) => (
            <li key={message} className="text-[12.5px] text-status-danger">
              {message}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

import { useState } from "react";

import type { ChildCategory } from "@/api/modules/rates-availability/types";

export interface ChildBand {
  category: ChildCategory;
  from: number | null;
  to: number | null;
  price: number | null;
}

export interface ChildBandValue {
  category: ChildCategory;
  from: number;
  to: number;
  price: number;
}

type BandText = { from: string; to: string; price: string };

const textOf = (value: number | null) => (value === null ? "" : String(value));

const amountOf = (value: string) => {
  const text = value.trim();
  return text === "" ? null : Number(text);
};

export const agesBad = (from: number | null, to: number | null) =>
  from === null ||
  to === null ||
  !Number.isInteger(from) ||
  !Number.isInteger(to) ||
  from < 0 ||
  to > 17 ||
  from > to;

export const priceBad = (price: number | null) =>
  price === null || !Number.isFinite(price) || price < 0;

export function useChildBands(bands: ChildBand[]) {
  const [draft, setDraft] = useState<Partial<Record<ChildCategory, BandText>>>({});
  const shownOf = (band: ChildBand): BandText =>
    draft[band.category] ?? {
      from: textOf(band.from),
      to: textOf(band.to),
      price: textOf(band.price),
    };
  const touched = bands.some((band) => {
    const shown = shownOf(band);
    return (
      amountOf(shown.from) !== band.from ||
      amountOf(shown.to) !== band.to ||
      (band.category !== "sharing_parents" && amountOf(shown.price) !== band.price)
    );
  });
  const entries = touched
    ? bands.map((band) => {
        const shown = shownOf(band);
        return {
          category: band.category,
          from: amountOf(shown.from),
          to: amountOf(shown.to),
          price: band.category === "sharing_parents" ? 0 : amountOf(shown.price),
        };
      })
    : [];
  const bad = entries.some(({ from, to, price }) => agesBad(from, to) || priceBad(price));
  const values: ChildBandValue[] = bad
    ? []
    : entries.flatMap(({ category, from, to, price }) =>
        from === null || to === null || price === null ? [] : [{ category, from, to, price }],
      );
  const edit = (band: ChildBand, field: keyof BandText, text: string) =>
    setDraft((current) => ({ ...current, [band.category]: { ...shownOf(band), [field]: text } }));
  return {
    bands,
    shownOf,
    edit,
    entries,
    touched,
    bad,
    values,
    reset: () => setDraft({}),
  };
}

export type ChildBandsState = ReturnType<typeof useChildBands>;

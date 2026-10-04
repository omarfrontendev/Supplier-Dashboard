import { useState } from "react";
import { Drawer } from "@/components/layout/overlay";
import { SectionCard,DataRow } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
const categories=["A room is not matched to the hotel library","A hotel request has not moved","Something on my statement looks wrong","A hotel is missing from the library","Something else"];
/**
 * A case carries where it came from, so the answer does not depend on
 * who picks it up. `from` is that line: the screen that opened it says
 * what it was looking at, because only it knows.
 */
export function AskHoteliana({onClose,onCreated,from,about,attached}:{onClose:()=>void;onCreated:()=>void;from?:string|undefined;about?:string|undefined;attached?:Array<[string,string]>|undefined}){const {lang}=useLanguage();const ar=lang==="ar";const [category,setCategory]=useState(categories[0]??"");return <Drawer width="660px" title={ar?"اسأل Hoteliana":"Ask Hoteliana"} meta={`${ar?"فُتحت من":"Opened from"}: ${from ?? "Executive Suite · Hilton Makkah · ROOM_NOT_MAPPED"}`} onClose={onClose} footer={<><Button variant="outline" onClick={onClose}>{ar?"إلغاء":"Cancel"}</Button><Button onClick={onCreated}>{ar?"إرسال":"Send"}</Button></>}><div className="space-y-3"><SectionCard title={ar?"بخصوص ماذا؟":"What is this about?"} description={ar?"اخترنا أقرب تطابق. غيّره إذا أخطأنا.":"We pre-selected the closest match. Change it if we guessed wrong."}><div className="space-y-2">{categories.map(x=><label key={x} className="flex cursor-pointer gap-3 rounded-lg border border-border-subtle p-3 text-sm text-text-primary"><input type="radio" checked={category===x} onChange={()=>setCategory(x)}/><span>{x}</span></label>)}</div></SectionCard><SectionCard title={ar?"ماذا تريد أن تقول؟":"What would you like to say?"}><Textarea className="min-h-28" defaultValue={about ?? "This suite has been waiting to be mapped for nine days and is still blocking sale."}/></SectionCard><SectionCard title={ar?"مرفق تلقائيًا":"Attached automatically"}>{(attached ?? [["Hotel","Hilton Makkah · HTL-0042"],["Room","Executive Suite · ROOM-118"],["Contract","Makkah Annual Block · CTR-2026-014"],["Failing condition","ROOM_NOT_MAPPED"],["Raised by","Abdullrahman · Owner"]] as Array<[string,string]>).map(r=><DataRow key={r[0]??"row"} label={r[0]??""}>{r[1]??""}</DataRow>)}</SectionCard><Input type="file" label={ar?"ملف اختياري":"Optional file"}/></div></Drawer>}
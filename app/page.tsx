"use client";

import { useMemo, useState } from "react";
import { Check, ChevronRight, Church, Heart, LockKeyhole, Search, ShieldCheck, Sparkles } from "lucide-react";

const organizations = [
  { id: "red-cross", name: "American Red Cross", type: "Charity", cause: "Disaster relief" },
  { id: "feeding-america", name: "Feeding America", type: "Charity", cause: "Hunger relief" },
  { id: "st-jude", name: "St. Jude Children's Research Hospital", type: "Charity", cause: "Children's health" },
  { id: "habitat", name: "Habitat for Humanity", type: "Charity", cause: "Housing" },
  { id: "local-church", name: "Your local church", type: "Church", cause: "Search by name or city" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(organizations[0]);
  const [amount, setAmount] = useState(5);
  const [custom, setCustom] = useState("");
  const [privateTithe, setPrivateTithe] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const results = useMemo(() => { const needle = query.toLowerCase().trim(); return needle ? organizations.filter((o) => `${o.name} ${o.cause}`.toLowerCase().includes(needle)) : organizations; }, [query]);
  const finalAmount = custom ? Number(custom) : amount;

  async function addGift() {
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/gifts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ organizationId: selected.id, organizationName: selected.name, organizationType: selected.type.toLowerCase(), amountCents: Math.round(finalAmount * 100), privateTithe }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMessage(`$${finalAmount.toFixed(2)} is ready to add at checkout for ${selected.name}.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Please try again."); }
    finally { setSaving(false); }
  }

  return (
    <main className="min-h-screen bg-[#f5fbf8] text-[#12372a]">
      <header className="border-b border-emerald-950/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#" className="flex items-center gap-2 text-xl font-black tracking-tight"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#ffcf4a]"><Heart className="h-5 w-5 fill-current" /></span>TipTwice</a>
          <nav className="hidden items-center gap-7 text-sm font-semibold md:flex"><a href="#how">How it works</a><a href="#partners">For merchants</a><a href="#trust">Trust & safety</a></nav>
          <button className="rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-sm font-bold">Sign in</button>
        </div>
      </header>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-12 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#ddf4e8] px-4 py-2 text-sm font-bold"><Sparkles className="h-4 w-4" />A little extra can do a lot</div>
          <h1 className="max-w-2xl text-5xl font-black leading-[.98] tracking-[-.045em] sm:text-6xl lg:text-7xl">Give while you shop. Keep it simple.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#416156]">Add a small gift to your online purchase for a verified charity or church. Choose once, change anytime, and see where every dollar is headed.</p>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold"><span className="flex gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" />Organizations verified</span><span className="flex gap-2"><LockKeyhole className="h-5 w-5 text-emerald-600" />Private giving option</span><span className="flex gap-2"><Check className="h-5 w-5 text-emerald-600" />Refund if not found</span></div>
        </div>
        <div className="rounded-[2rem] border border-emerald-950/10 bg-white p-5 shadow-[0_24px_80px_rgba(18,55,42,.12)] sm:p-7">
          <div className="mb-6 flex items-center justify-between"><div><p className="text-sm font-bold text-emerald-700">CHECKOUT ADD-ON</p><h2 className="text-2xl font-black">Who would you like to help?</h2></div><span className="rounded-full bg-[#fff3c2] px-3 py-1 text-xs font-bold">Secure</span></div>
          <label className="relative block"><Search className="absolute left-4 top-3.5 h-5 w-5 text-[#648276]" /><input value={query} onChange={(e)=>setQuery(e.target.value)} className="w-full rounded-2xl border border-emerald-950/15 bg-[#f8fbfa] py-3 pl-12 pr-4 text-base outline-none focus:border-emerald-600" placeholder="Search charities, churches, or a cause" /></label>
          <div className="mt-3 max-h-52 space-y-2 overflow-auto pr-1">
            {results.map((org)=><button key={org.id} onClick={()=>setSelected(org)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${selected.id===org.id?"border-emerald-600 bg-[#edfaf3]":"border-transparent hover:bg-[#f5f8f7]"}`}><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${org.type==="Church"?"bg-[#eee9ff] text-violet-700":"bg-[#fff1d2] text-amber-700"}`}>{org.type==="Church"?<Church className="h-5 w-5"/>:<Heart className="h-5 w-5"/>}</span><span className="min-w-0 flex-1"><strong className="block truncate">{org.name}</strong><span className="text-sm text-[#648276]">{org.cause}</span></span>{selected.id===org.id&&<Check className="h-5 w-5 text-emerald-600"/>}</button>)}
            {query && results.length===0 && <button onClick={()=>setSelected({id:"custom",name:query,type:"Organization",cause:"Verification requested"})} className="w-full rounded-2xl border border-dashed border-emerald-700 p-4 text-left font-bold">Add “{query}” for verification <ChevronRight className="float-right h-5 w-5"/></button>}
          </div>
          <div className="my-5 h-px bg-emerald-950/10" />
          <p className="mb-3 text-sm font-bold">Choose your gift</p><div className="grid grid-cols-4 gap-2">{[1,5,10].map(v=><button key={v} onClick={()=>{setAmount(v);setCustom("")}} className={`rounded-xl border py-3 font-black ${!custom&&amount===v?"border-[#12372a] bg-[#12372a] text-white":"border-emerald-950/15"}`}>${v}</button>)}<input value={custom} onChange={(e)=>setCustom(e.target.value)} inputMode="decimal" className="min-w-0 rounded-xl border border-emerald-950/15 px-2 text-center font-bold" placeholder="Other" aria-label="Custom amount" /></div>
          <label className="mt-5 flex cursor-pointer items-center justify-between rounded-2xl bg-[#f4f0ff] p-4"><span><strong className="block">Private tithe mode</strong><span className="text-sm text-[#665f78]">Display as “Private gift” on your history</span></span><input type="checkbox" checked={privateTithe} onChange={(e)=>setPrivateTithe(e.target.checked)} className="h-5 w-5 accent-violet-700" /></label>
          <button disabled={saving || !finalAmount} onClick={addGift} className="mt-5 w-full rounded-2xl bg-[#ffcf4a] px-5 py-4 text-lg font-black shadow-[0_5px_0_#d2a819] transition active:translate-y-1 active:shadow-none disabled:opacity-50">{saving?"Saving…":`Add $${Number(finalAmount||0).toFixed(2)} at checkout`}</button>
          {message&&<p className="mt-4 rounded-xl bg-[#e4f7ed] p-3 text-center text-sm font-bold" role="status">{message}</p>}
          <p className="mt-4 text-center text-xs leading-5 text-[#648276]">No charge is made in this preview. Final checkout will show the gift and applicable 1–2% platform administration fee separately.</p>
        </div>
      </section>
      <section id="how" className="bg-[#12372a] px-5 py-16 text-white lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-sm font-bold text-[#ffcf4a]">ONE SMALL STEP AT CHECKOUT</p><h2 className="mt-2 max-w-2xl text-4xl font-black tracking-tight">A cleaner path from purchase to purpose.</h2><div className="mt-10 grid gap-4 md:grid-cols-3">{[["01","Pick your favorite","Choose a verified nonprofit or church—or ask us to locate yours."],["02","Add a small amount","Give $1, $5, $10, or a custom amount with your purchase."],["03","Track the delivery","See verification, processing, and delivery status in one receipt."]].map(([n,t,d])=><article key={n} className="rounded-3xl border border-white/15 bg-white/5 p-6"><span className="text-4xl font-black text-[#ffcf4a]">{n}</span><h3 className="mt-8 text-xl font-black">{t}</h3><p className="mt-2 leading-7 text-emerald-50/70">{d}</p></article>)}</div></div></section>
      <section id="partners" className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8"><div className="rounded-[2rem] bg-[#fff0bc] p-8"><p className="text-sm font-bold">FOR MERCHANTS</p><h2 className="mt-3 text-3xl font-black">Match generosity—on your terms.</h2><p className="mt-4 leading-7 text-[#52695f]">Set a monthly match limit, choose eligible orders, and show shoppers the impact at checkout. Matching pauses automatically when the limit is reached.</p><button className="mt-8 rounded-full bg-[#12372a] px-6 py-3 font-bold text-white">Join the merchant pilot</button></div><div className="rounded-[2rem] bg-[#e9e2ff] p-8"><p className="text-sm font-bold">FOR BANKS & FINTECHS</p><h2 className="mt-3 text-3xl font-black">Make generosity rewarding.</h2><p className="mt-4 leading-7 text-[#615b72]">Partner institutions may let members earn or redeem eligible rewards for giving. Points availability and value are always set by the participating provider.</p><button className="mt-8 rounded-full border border-[#12372a] px-6 py-3 font-bold">Explore a points partnership</button></div></section>
      <section id="trust" className="border-t border-emerald-950/10 bg-white px-5 py-14 lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><ShieldCheck className="h-10 w-10 text-emerald-600"/><h2 className="mt-4 text-3xl font-black">Trust is the product.</h2></div><div className="grid gap-6 sm:grid-cols-2"><div><h3 className="font-black">Verify before delivery</h3><p className="mt-2 text-sm leading-6 text-[#648276]">Organizations are checked against authoritative nonprofit or church records before funds are released.</p></div><div><h3 className="font-black">Refund when we can’t verify</h3><p className="mt-2 text-sm leading-6 text-[#648276]">If a requested organization cannot be located and verified, the intended gift is returned under the refund policy.</p></div><div><h3 className="font-black">Clear fees</h3><p className="mt-2 text-sm leading-6 text-[#648276]">Any TipTwice administration fee is disclosed before confirmation and tracked separately from the intended gift.</p></div><div><h3 className="font-black">Minimal private data</h3><p className="mt-2 text-sm leading-6 text-[#648276]">Private mode changes the display of giving history. Required payment, tax, and compliance records remain protected and auditable.</p></div></div></div></section>
      <footer className="bg-white px-5 pb-10 text-sm text-[#648276] lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-t border-emerald-950/10 pt-8 sm:flex-row"><strong className="text-[#12372a]">TipTwice.app</strong><p>© 2026 TipTwice. Pilot experience—payment and tax features require approved partners.</p></div></footer>
    </main>
  );
}

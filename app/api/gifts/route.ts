export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = String(body.organizationName ?? "").trim();
    const type = String(body.organizationType ?? "charity");
    const amountCents = Number(body.amountCents);
    if (!name || !Number.isInteger(amountCents) || amountCents < 100 || amountCents > 100000) return Response.json({ error: "Choose an organization and an amount from $1 to $1,000." }, { status: 400 });
    const gift = { id: crypto.randomUUID(), organizationId: String(body.organizationId ?? "custom-request"), organizationName: name, organizationType: type, amountCents, privateTithe: Boolean(body.privateTithe), merchantMatchCents: 0, status: "pending_checkout" };
    return Response.json({ gift }, { status: 201 });
  } catch { return Response.json({ error: "We couldn't save this gift yet. Please try again." }, { status: 500 }); }
}

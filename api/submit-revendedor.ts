import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Payload do formulário de revendedores (espelha RevendedorFormValues).
 */
interface RevendedorPayload {
  nomeCompleto: string;
  empresaLoja?: string;
  cnpj?: string;
  cidadeEstado: string;
  telefoneWhatsapp: string;
  email?: string;
  instagramRedes?: string;
  tempoMercado?: string;
  entendeProposito?: string;
  vendeCalcadosVestuario?: string;
  formaVenda?: string;
  oQueChamouAtencao?: string;
  seguePadroesMarca?: string;
  paresPorMes?: string;
}

const AC_API_URL = process.env.AC_API_URL;
const AC_API_KEY = process.env.AC_API_KEY;
const AC_LIST_ID = process.env.AC_LIST_ID;
const AC_CUSTOM_FIELD_ID = process.env.AC_CUSTOM_FIELD_ID;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente ${name} não está definida.`);
  }
  return value;
}

function buildContactEmail(payload: RevendedorPayload): string {
  if (payload.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return payload.email;
  }
  const safe = payload.telefoneWhatsapp.replace(/\D/g, "").slice(-8) || "revendedor";
  return `revendedor-${safe}-${Date.now()}@placeholder.pedireito`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const body = req.body as RevendedorPayload;

    if (!body?.nomeCompleto?.trim() || !body?.cidadeEstado?.trim() || !body?.telefoneWhatsapp?.trim()) {
      return res.status(400).json({
        error: "Campos obrigatórios: nomeCompleto, cidadeEstado, telefoneWhatsapp",
      });
    }
  } catch {
    return res.status(400).json({ error: "Corpo da requisição inválido" });
  }

  let apiUrl: string;
  let apiKey: string;
  let listId: string;

  try {
    apiUrl = getRequiredEnv("AC_API_URL").replace(/\/$/, "");
    apiKey = getRequiredEnv("AC_API_KEY");
    listId = getRequiredEnv("AC_LIST_ID");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Configuração ActiveCampaign ausente";
    return res.status(500).json({ error: message });
  }

  const payload = req.body as RevendedorPayload;
  const email = buildContactEmail(payload);

  const contactPayload = {
    contact: {
      email,
      firstName: payload.nomeCompleto.trim().split(/\s+/)[0] ?? payload.nomeCompleto.trim(),
      lastName: payload.nomeCompleto.trim().split(/\s+/).slice(1).join(" ") || "",
      phone: payload.telefoneWhatsapp.trim(),
      fieldValues: [] as { field: string; value: string }[],
    },
  };

  if (AC_CUSTOM_FIELD_ID) {
    contactPayload.contact.fieldValues.push({
      field: AC_CUSTOM_FIELD_ID,
      value: JSON.stringify({
        empresaLoja: payload.empresaLoja,
        cnpj: payload.cnpj,
        cidadeEstado: payload.cidadeEstado,
        instagramRedes: payload.instagramRedes,
        tempoMercado: payload.tempoMercado,
        entendeProposito: payload.entendeProposito,
        vendeCalcadosVestuario: payload.vendeCalcadosVestuario,
        formaVenda: payload.formaVenda,
        oQueChamouAtencao: payload.oQueChamouAtencao,
        seguePadroesMarca: payload.seguePadroesMarca,
        paresPorMes: payload.paresPorMes,
      }),
    });
  }

  const createRes = await fetch(`${apiUrl}/api/3/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Token": apiKey,
    },
    body: JSON.stringify(contactPayload),
  });

  if (!createRes.ok) {
    const text = await createRes.text();
    console.error("ActiveCampaign create contact error:", createRes.status, text);
    return res.status(502).json({
      error: "Falha ao criar contato no ActiveCampaign",
      details: createRes.status === 422 ? text : undefined,
    });
  }

  const contactData = (await createRes.json()) as { contact?: { id?: number } };
  const contactId = contactData.contact?.id;

  if (!contactId) {
    return res.status(502).json({ error: "Resposta inválida do ActiveCampaign" });
  }

  const listRes = await fetch(`${apiUrl}/api/3/contactLists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Token": apiKey,
    },
    body: JSON.stringify({
      contactList: {
        list: Number(listId, 10),
        contact: contactId,
        status: 1,
      },
    }),
  });

  if (!listRes.ok) {
    const text = await listRes.text();
    console.error("ActiveCampaign add to list error:", listRes.status, text);
    return res.status(502).json({
      error: "Contato criado, mas falha ao adicionar à lista",
      details: listRes.status === 422 ? text : undefined,
    });
  }

  return res.status(200).json({ success: true, contactId });
}

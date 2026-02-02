import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

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

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const AC_API_URL = process.env.AC_API_URL;
const AC_API_KEY = process.env.AC_API_KEY;
const AC_LIST_ID = process.env.AC_LIST_ID;
const AC_CUSTOM_FIELD_ID = process.env.AC_CUSTOM_FIELD_ID;

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

  const payload = req.body as RevendedorPayload;
  let savedToSupabase = false;
  let acSuccess = false;

  // 1) Salvar no Supabase (Pé Direito) se configurado
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { error } = await supabase.from("revendedores").insert({
        nome_completo: payload.nomeCompleto.trim(),
        empresa_loja: payload.empresaLoja?.trim() || null,
        cnpj: payload.cnpj?.trim() || null,
        cidade_estado: payload.cidadeEstado.trim(),
        telefone_whatsapp: payload.telefoneWhatsapp.trim(),
        email: payload.email?.trim() || null,
        instagram_redes: payload.instagramRedes?.trim() || null,
        tempo_mercado: payload.tempoMercado?.trim() || null,
        entende_proposito: payload.entendeProposito || null,
        vende_calcados_vestuario: payload.vendeCalcadosVestuario || null,
        forma_venda: payload.formaVenda || null,
        o_que_chamou_atencao: payload.oQueChamouAtencao?.trim() || null,
        segue_padroes_marca: payload.seguePadroesMarca || null,
        pares_por_mes: payload.paresPorMes?.trim() || null,
      });
      if (error) {
        console.error("Supabase insert error:", error);
      } else {
        savedToSupabase = true;
      }
    } catch (e) {
      console.error("Supabase error:", e);
    }
  }

  // 2) Enviar ao ActiveCampaign se configurado
  if (AC_API_URL && AC_API_KEY && AC_LIST_ID) {
    try {
      const apiUrl = AC_API_URL.replace(/\/$/, "");
      const listId = AC_LIST_ID;
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
          "Api-Token": AC_API_KEY,
        },
        body: JSON.stringify(contactPayload),
      });

      if (createRes.ok) {
        const contactData = (await createRes.json()) as { contact?: { id?: number } };
        const contactId = contactData.contact?.id;
        if (contactId) {
          const listRes = await fetch(`${apiUrl}/api/3/contactLists`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Api-Token": AC_API_KEY,
            },
            body: JSON.stringify({
              contactList: {
                list: Number(listId, 10),
                contact: contactId,
                status: 1,
              },
            }),
          });
          if (listRes.ok) acSuccess = true;
        }
      }
    } catch (e) {
      console.error("ActiveCampaign error:", e);
    }
  }

  if (savedToSupabase || acSuccess) {
    return res.status(200).json({ success: true, supabase: savedToSupabase, activeCampaign: acSuccess });
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: "Configure SUPABASE_URL e SUPABASE_ANON_KEY na Vercel" });
  }

  return res.status(502).json({ error: "Falha ao salvar o questionário. Tente novamente." });
}

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

interface UpdatePayload {
  id: number;
  data: {
    nome_completo?: string;
    empresa_loja?: string | null;
    cnpj?: string | null;
    cidade_estado?: string;
    telefone_whatsapp?: string;
    email?: string | null;
    instagram_redes?: string | null;
    tempo_mercado?: string | null;
    entende_proposito?: string | null;
    vende_calcados_vestuario?: string | null;
    forma_venda?: string | null;
    o_que_chamou_atencao?: string | null;
    segue_padroes_marca?: string | null;
    pares_por_mes?: string | null;
    status?: "pendente" | "aprovado" | "rejeitado";
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido" });
  }

  // Verify authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.replace("Bearer ", "");

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: "Configuração do Supabase ausente" });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Verify token
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }

  // Parse body
  const payload = req.body as UpdatePayload;

  if (!payload?.id || !payload?.data) {
    return res.status(400).json({ error: "ID e dados são obrigatórios" });
  }

  // Update record
  const { error } = await supabase
    .from("revendedores")
    .update({
      ...payload.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", payload.id);

  if (error) {
    console.error("Supabase update error:", error);
    return res.status(500).json({ error: "Erro ao atualizar revendedor" });
  }

  return res.status(200).json({ success: true });
}

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
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

  // Parse query params
  const { status, search, page = "1", pageSize = "10" } = req.query;
  const pageNum = parseInt(page as string, 10);
  const pageSizeNum = parseInt(pageSize as string, 10);
  const from = (pageNum - 1) * pageSizeNum;
  const to = from + pageSizeNum - 1;

  // Build query
  let query = supabase
    .from("revendedores")
    .select("*", { count: "exact" });

  if (status && status !== "todos") {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(
      `nome_completo.ilike.%${search}%,empresa_loja.ilike.%${search}%,cidade_estado.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Supabase query error:", error);
    return res.status(500).json({ error: "Erro ao buscar revendedores" });
  }

  return res.status(200).json({
    data: data || [],
    count: count || 0,
    page: pageNum,
    pageSize: pageSizeNum,
    totalPages: Math.ceil((count || 0) / pageSizeNum),
  });
}

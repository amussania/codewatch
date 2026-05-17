// app/api/projects/route.ts — Project workspaces API
// SOUL.md v4: CRUD for projects with business context
// Author: Kimi Build Agent | Date: 2026-05-17

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const projectSchema = z.object({
  name: z.string().min(1).max(100),
  businessContext: z.string().max(5000).optional(),
  customRules: z.string().max(5000).optional(),
});

// GET /api/projects — List user's projects
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: projects, error } = await supabase
      .from("projects")
      .select("id, name, business_context, custom_rules, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ projects: projects || [] });
  } catch (error: any) {
    console.error("Projects GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/projects — Create new project
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, businessContext, customRules } = parsed.data;

    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        name,
        business_context: businessContext || null,
        custom_rules: customRules || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error("Projects POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

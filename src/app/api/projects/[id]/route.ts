// app/api/projects/[id]/route.ts — Project detail API
// SOUL.md v4: Update/delete individual projects
// Author: Kimi Build Agent | Date: 2026-05-17

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const projectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  businessContext: z.string().max(5000).optional(),
  customRules: z.string().max(5000).optional(),
});

// PATCH /api/projects/[id] — Update project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (parsed.data.name !== undefined) updates.name = parsed.data.name;
    if (parsed.data.businessContext !== undefined) updates.business_context = parsed.data.businessContext;
    if (parsed.data.customRules !== undefined) updates.custom_rules = parsed.data.customRules;

    const { data: project, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id) // RLS safety
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error("Projects PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] — Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id); // RLS safety

    if (error) throw error;

    return NextResponse.json({ success: true, deleted: id });
  } catch (error: any) {
    console.error("Projects DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

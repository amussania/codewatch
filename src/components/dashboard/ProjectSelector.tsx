"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Plus, X, ChevronDown, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  business_context: string | null;
  custom_rules: string | null;
  created_at: string;
}

interface ProjectSelectorProps {
  selectedProjectId: string | null;
  onSelectProject: (project: Project | null) => void;
}

export default function ProjectSelector({ selectedProjectId, onSelectProject }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectContext, setNewProjectContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProjectName.trim(),
          businessContext: newProjectContext.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create project");
        return;
      }

      setProjects((prev) => [data.project, ...prev]);
      onSelectProject(data.project);
      setIsCreating(false);
      setNewProjectName("");
      setNewProjectContext("");
      toast.success(`Project "${data.project.name}" created`);
    } catch (error) {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!confirm(`Delete project "${projectName}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        if (selectedProjectId === projectId) {
          onSelectProject(null);
        }
        toast.success(`Project "${projectName}" deleted`);
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="relative">
      {/* Dropdown trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-9 px-3 rounded-lg bg-white/[0.05] border border-white/10 text-sm hover:bg-white/[0.08] transition-colors"
      >
        <Folder className="w-4 h-4 text-muted-foreground" />
        <span className="text-foreground/80">
          {selectedProject ? selectedProject.name : "Select project"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 w-72 bg-[var(--cw-surface)] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {/* Project list */}
            <div className="max-h-48 overflow-y-auto">
              <button
                onClick={() => {
                  onSelectProject(null);
                  setIsOpen(false);
                }}
                className={[
                  "w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors flex items-center gap-2",
                  !selectedProjectId ? "text-[var(--cw-coral)]" : "text-foreground/80",
                ].join(" ")}
              >
                <span className="w-4" /> No project
              </button>

              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors"
                >
                  <button
                    onClick={() => {
                      onSelectProject(project);
                      setIsOpen(false);
                    }}
                    className={[
                      "flex-1 text-left text-sm flex items-center gap-2",
                      selectedProjectId === project.id ? "text-[var(--cw-coral)]" : "text-foreground/80",
                    ].join(" ")}
                  >
                    <Folder className="w-4 h-4" />
                    {project.name}
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id, project.name)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-400 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Create new */}
            <div className="border-t border-white/10 p-3">
              {isCreating ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--cw-coral)]"
                  />
                  <textarea
                    placeholder="Business context (optional)"
                    value={newProjectContext}
                    onChange={(e) => setNewProjectContext(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--cw-coral)] resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleCreateProject}
                      disabled={isLoading}
                      className="flex-1 bg-[var(--cw-coral)] hover:bg-[var(--cw-coral)]/90"
                    >
                      {isLoading ? "Creating..." : "Create"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsCreating(false);
                        setNewProjectName("");
                        setNewProjectContext("");
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 text-sm text-[var(--cw-coral)] hover:text-[var(--cw-coral)]/80 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New project
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

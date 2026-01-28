"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

import { createAISummary } from "@/app/actions/create-ai-summary";

export const CreateAISummaryButton = () => {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const result = await createAISummary();
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setSummary(null);
      setError(null);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2">
          <Sparkles size={16} />
          AI Summarize
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>AI Summary</DialogTitle>
          <DialogDescription>
            Generate an AI-powered summary of all your notes.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {!summary && !error && !loading && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Click the button below to generate a summary of your notes using AI.
            </p>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Generating summary...
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {summary && (
            <div className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap max-h-[400px] overflow-y-auto">
              {summary}
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          {!summary && (
            <Button onClick={handleGenerateSummary} disabled={loading}>
              {loading ? "Generating..." : "Generate Summary"}
            </Button>
          )}
          {summary && (
            <Button onClick={handleGenerateSummary} disabled={loading}>
              Regenerate
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

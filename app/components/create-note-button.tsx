"use client"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Plus } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea"

import { createNote } from "@/app/actions/create-note"

export const CreateNoteButton = () => {
  const defaultNoteTitle = 'New note';
  const [title, setTitle] = useState(defaultNoteTitle);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [titleError, setTitleError] = useState('');

  const hasErrorTitle = useMemo(() => {
    return Boolean(titleError);
  }, [titleError])

  const handleChangeTitle = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(ev.target.value);
  }

  const handleChangeContent = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(ev.target.value);
  }

  const handleSaveNote = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setLoading(true);

    if (!title) {
      setTitleError('Title is required');
    }

    try {
      await createNote({ title, content });
      setModalOpen(false);
      setTitle(defaultNoteTitle)
      setContent('')
    } catch (err) {
      throw new Error(`Error creating a note: ${err}`)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (title) {
      setTitleError('');
    }
  }, [title])

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          New Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSaveNote}>
          <DialogHeader>
            <DialogTitle>Add note</DialogTitle>
            <DialogDescription>
              Add the title and the content of your note
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Field data-invalid={hasErrorTitle}>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input id="title" aria-invalid={hasErrorTitle} value={title} onChange={handleChangeTitle} />
                {hasErrorTitle && (
                  <FieldDescription>
                    {titleError}
                  </FieldDescription>
                )}
              </Field>
            </div>
            <div className="grid gap-3">
              <Field>
                <FieldLabel htmlFor="content">Content</FieldLabel>
                <Textarea id="content" value={content} onChange={handleChangeContent} />
              </Field>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{loading ? 'Creating...' : 'Create new note'}</Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  );
}
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signout } from './login/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { getNotes } from '@/app/data/get-notes';

import { CreateNoteButton } from '@/components/create-note-button'
import { DeleteNoteButton } from '@/components/delete-note-button'
import { CreateAISummaryButton } from '@/components/create-ai-summary-button'

// =============================================================================
// QUICKNOTES AI - TECHNICAL ASSESSMENT
// =============================================================================
// Welcome! You need to implement 4 features in this file.
// Look for TODO comments below for each feature.
//
// DATABASE SCHEMA:
// notes (id, user_id, title, content, created_at, updated_at)

export default async function NotesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // ===========================================================================
  // TODO 1: CONNECT NOTES TO DATABASE
  // ===========================================================================
  // Replace this hardcoded array with real data from Supabase.

  const { notes, error } = await getNotes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QuickNotes AI</h1>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <form action={signout}>
            <Button variant="outline" type="submit">
              Sign Out
            </Button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">My Notes</h2>
          <div className="flex gap-3">
            {/* ================================================================
                TODO 4: AI SUMMARIZE FEATURE
                ================================================================
                Implement a button that:
                1. Fetches all user's notes
                2. Sends them to OpenAI API to generate a summary
                3. Displays the summary to the user (modal, alert, or new section)
             
                ================================================================ */}
            <CreateAISummaryButton />

            {/* ================================================================
                TODO 2: CREATE NEW NOTE
                ================================================================
                Implement a button/form that:
                1. Shows a form to input title and content
                2. Saves the new note to Supabase
                3. Refreshes the notes list

                ================================================================ */}
            <CreateNoteButton />

          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes?.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                  {/* ============================================================
                      TODO 3: DELETE NOTE
                      ============================================================
                      Implement a delete button that:
                      1. Removes the note from Supabase
                      2. Refreshes the notes list

                      ============================================================ */}
                  <DeleteNoteButton noteId={note.id} noteTitle={note.title} />
                </div>
                <CardDescription>
                  {new Date(note.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 line-clamp-4">
                  {note.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {error && (
          <h2 className="text-2xl font-semibold">Oops! Something went wrong. Try again later</h2>
        )}

        {notes?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No notes yet. Create your first note!</p>
            <Button>+ Create Note</Button>
          </div>
        )}
      </main>
    </div>
  )
}

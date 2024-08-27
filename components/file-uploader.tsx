'use client'

import { State, uploadFile } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActionState } from 'react'

export function FileUploader() {
  const initialState: State = {
    fileName: null,
    questions: [],
    error: null
  }

  const [state, fromAction, isPending] = useActionState(
    uploadFile,
    initialState
  )

  return (
    <>
      <form action={fromAction} className="w-full">
        <div className="flex flex-col gap-2">
          <Label htmlFor="file">Upload File</Label>
          {!state.fileName ? (
            <Input id="file" name="file" type="file" accept=".pdf,.txt" />
          ) : (
            <Input
              id="fileName"
              name="fileName"
              type="text"
              value={state.fileName}
              readOnly
              disabled
            />
          )}
          {state.error && <p className="text-sm text-red-500">{state.error}</p>}
        </div>
        <Button type="submit" className="mt-4 w-full" disabled={isPending}>
          Generate Questions
        </Button>
      </form>
    </>
  )
}

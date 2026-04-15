import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import type { CatalogOption } from '@/features/catalogs/types/catalog'

export function CatalogAdminCard({
  title,
  items,
  includeDescription = false,
  feedback,
  isPending = false,
  onCreate,
  onUpdate,
  onDelete,
}: {
  title: string
  items: CatalogOption[]
  includeDescription?: boolean
  feedback?: string | null
  isPending?: boolean
  onCreate: (payload: { name: string; description?: string }) => Promise<void> | void
  onUpdate: (id: number, payload: { name?: string; description?: string }) => Promise<void> | void
  onDelete: (id: number) => Promise<void> | void
}) {
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const isEditing = selectedItemId != null

  function resetForm() {
    setSelectedItemId(null)
    setName('')
    setDescription('')
  }

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {feedback ? <p className="text-sm text-muted-foreground">{feedback}</p> : null}
        <div className="space-y-2 rounded-[var(--radius)] border border-border p-4">
          <p className="text-sm font-medium text-foreground">Current entries</p>
          <div className="space-y-2">
            {items.map((item) => (
              <div className="flex items-center justify-between gap-4 rounded-[var(--radius)] border border-border px-3 py-2" key={item.id}>
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  {item.description ? <p className="text-xs text-muted-foreground">{item.description}</p> : null}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => { setSelectedItemId(item.id); setName(item.name); setDescription(item.description ?? '') }} size="sm" type="button" variant="outline">Edit</Button>
                  <Button disabled={isPending} onClick={() => void onDelete(item.id)} size="sm" type="button" variant="outline">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <form className="space-y-4" onSubmit={(event) => {
          event.preventDefault()
          const payload = { name: name.trim(), description: includeDescription ? description.trim() || undefined : undefined }
          if (selectedItemId != null) void onUpdate(selectedItemId, payload)
          else void onCreate(payload)
          resetForm()
        }}>
          <p className="text-sm text-muted-foreground">{isEditing ? 'Editing selected entry.' : 'Create a new entry.'}</p>
          <div>
            <Label>Name</Label>
            <div className="mt-2"><Input value={name} onChange={(event) => setName(event.target.value)} /></div>
          </div>
          {includeDescription ? (
            <div>
              <Label>Description</Label>
              <div className="mt-2"><Input value={description} onChange={(event) => setDescription(event.target.value)} /></div>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button disabled={isPending} type="submit">{isEditing ? 'Update' : 'Create'}</Button>
            {isEditing ? <Button disabled={isPending} onClick={resetForm} type="button" variant="outline">Cancel edit</Button> : null}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import NewNote from "./components/NewNote"
import { useMemo } from "react"
import { v4 as uuidV4 } from "uuid"
import useLocalStorage from "./useLocalStorage"
import NoteList from "./components/NoteList"
import Note from "./components/Note"
import NoteLayout from "./components/NoteLayout"
import EditNote from "./components/EditNote"

export type Note = {
  id: string
  
}& NoteData


export type NoteData = {
  title: string,
  content: string,
  tags: Tag[]
}

export type Tag = {
  id: string,
  label: string
}

export type RawNoteData = {
  title: string,
  content: string,
  tagIds: string[]
  
}


export type RawNote = {
  id: string
} & RawNoteData



function App() {
 const [ notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
 const [ tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])
 
 const notesWithTags = useMemo(() => {
  return notes.map(note => {
      return { ...note,tags: tags.filter(tag => note.tagIds.includes(tag.id))}
  })
  },[notes,tags])

  function onCreateNote({tags,...data }: NoteData){
    setNotes(prevNotes => {
      return [...prevNotes, { ...data, id: uuidV4(),tagIds: tags.map(tag => tag.id)}]
    })
  }

  function onDeleteNote(id:string){
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !=id)
    })
  }


  function addTag(tag: Tag){
    setTags(prev => [...prev, tag])
  }

  function updateTag(id:string, label: string){
    setTags(prevTags => {
      return prevTags.map(tag => {
        if(tag.id == id){
          return { ...tag, label }
        }
        else{
          return tag
        }
      })
    })
  }

  function deleteTag(id: string){
    setTags(prevTags => {
      return prevTags.filter(tags => tags.id !== id)
    })
  }

  function onUpdateNote(id: string, {tags, ...data}:NoteData){
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if(note.id === id){
          return { ...note, ...data, tagIds: tags.map(tag => tag.id)}
        }
        else{
          return note
        }

      })
    })
  }

  return (
    <Container style={{marginTop:"10px"}}>
      <Routes>
        <Route path="/" element={<NoteList notes={notesWithTags} availableTags={tags} onUpdateTag={updateTag} onDeleteTag={deleteTag} /> }/>
        <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} /> }/>
        <Route path="*" element={<Navigate to="/" /> }/>
        <Route path ="/:id" element={<NoteLayout notes={notesWithTags} /> }>
          <Route index element={<Note onDelete={onDeleteNote} />}/>
          <Route path="edit" element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags}/>} />
        </Route>
      </Routes>
    </Container>
  
  )
}

export default App

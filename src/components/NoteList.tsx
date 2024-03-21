import React, { useMemo, useState } from 'react'
import { Button, Col, Form, FormControl, Modal, ModalBody, ModalTitle, Row, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ReactSelect from 'react-select'
import { Note, Tag } from '../App'
import NoteCard from './NoteCard'


export type EditTagModalProps = {
    show: boolean,
    availableTags:Tag[]
    handleClose: () => void
    onDeleteTag: (id:string) => void
    onUpdateTag: (id:string, label:string) => void
}

export type SimplyfiedNotes = {
    tags: Tag[],
    title: string
    id: string
}

type NoteListProps = {
    availableTags: Tag[],
    notes: SimplyfiedNotes[]
    onDeleteTag: (id:string) => void
    onUpdateTag: (id:string, label:string) => void
}


const NoteList = ({ availableTags,notes, onDeleteTag, onUpdateTag}: NoteListProps) => {
const [selectedTags, setSelectedTags] = useState<Tag[]>([])
const [title, setTitle] = useState('')
const [modalOpen, setModalOpen] = useState(false)

const filterNotes = useMemo(() => {
    return notes.filter(note => {
        return (title === "" || note.title.toLowerCase().includes(title.toLowerCase()))
        && (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
    })

},[title,selectedTags,notes])
  return (
    <>
        <Row className='align-items-center mb-4'>
            <Col>
                <h1>Notes</h1>
            </Col>
            <Col xs="auto">
                <Stack gap={2} direction="horizontal">
                    <Link to="/new">
                        <Button variant="primary">Create</Button>
                    </Link>
                    <Button variant='outline-secondary' onClick={() => setModalOpen(true)}>Edit Tags</Button>
                </Stack>
            </Col>
        </Row>
        <Form>
            <Row className='mb-4'>
                <Col>
                    <Form.Group controlId='title'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId='tags'>
                        <Form.Label>Tags</Form.Label>
                        <ReactSelect 
                            options={availableTags.map(tag => {
                                return {label:tag.label, value:tag.id}
                            })}
                            value={selectedTags.map(tag => {
                                return { label: tag.label, value: tag.id}
                            })}
                            onChange={tags => {
                                setSelectedTags(tags.map(tag => {
                                    return { label: tag.label, id: tag.value}
                                }))
                            }}
                            isMulti />
                    </Form.Group>
                </Col>
            </Row>
            <Row xs={1} sm={2} lg={3} xl={4} className='g-3'>
                {filterNotes.map(note => (
                    <Col key={note.id}>
                        <NoteCard id={note.id} title={note.title} tags={note.tags} />
                    </Col>
                ))}
            </Row>
        </Form>
        <EditTagsModal 
            show={modalOpen} 
            handleClose={() => setModalOpen(false)} 
            onUpdateTag={onUpdateTag} 
            onDeleteTag={onDeleteTag} 
            availableTags={availableTags}/>
    </>
  )
}

export default NoteList

function EditTagsModal({availableTags,show, handleClose,onUpdateTag, onDeleteTag}: EditTagModalProps){
    return <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <ModalTitle>Edit Tags</ModalTitle>
        </Modal.Header>
        <ModalBody>
            <Form>
                <Stack gap={2}>
                    {availableTags.map(tag => (
                        <Row key={tag.id}>
                            <Col>
                                <FormControl 
                                    type="text" 
                                    value={tag.label} 
                                    onChange={e => onUpdateTag(tag.id, e.target.value)}  
                                />
                            </Col>
                            <Col xs="auto">
                                <Button onClick={() => onDeleteTag(tag.id)} variant='outline-danger'>&times;</Button>
                            </Col>
                        </Row>
                    ))}
                </Stack>
            </Form>
        </ModalBody>
    </Modal>
}
import React, { FormEvent, useMemo, useRef, useState } from 'react'
import { Button, Col, Form, Row, Stack } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import CreateableReactSelect from 'react-select/creatable'
import { NoteData, Tag } from '../App'
import { v4 as uuidV4 } from "uuid"

type NoteFormProps = {
    onSubmit: (data:NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
} & Partial<NoteData>

const NoteForm = ({ onSubmit,onAddTag,availableTags,title="",content="",tags=[] }: NoteFormProps) => {
    const navigate = useNavigate()
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)



    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        onSubmit({
            title: titleRef.current!.value,
            content: markdownRef.current!.value,
            tags: selectedTags
        })
        navigate("..")
    }
    return (
    <Form onSubmit={handleSubmit}>
        <Stack gap={4}>
            <Row>
                <Col>
                    <Form.Group controlId='title'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control required ref={titleRef} defaultValue={title}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId='tags'>
                        <Form.Label>Tags</Form.Label>
                        <CreateableReactSelect 
                            onCreateOption={label => {
                                const newTag = { id: uuidV4(), label}
                                onAddTag(newTag)
                                setSelectedTags(prev => [...prev, newTag])
                            }}
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
            <Form.Group controlId='markdown'>
                        <Form.Label>Body</Form.Label>
                        <Form.Control required as="textarea" rows={20} ref={markdownRef} defaultValue={content}/>
            </Form.Group>
            <Stack direction='horizontal' gap={2} className='justify-content-end'>
                <Button type="submit" variant="primary">Save</Button>
                <Link to="..">
                    <Button type='button' variant='outline-secondary'>
                        Cancel
                    </Button>
                </Link>
            </Stack>
        </Stack>
    </Form>
  )
}

export default NoteForm
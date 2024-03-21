import React from 'react'
import { SimplyfiedNotes } from './NoteList'
import { Link } from 'react-router-dom'
import { Badge, Card, CardBody, Stack } from 'react-bootstrap'

const NoteCard = ({id, title, tags}: SimplyfiedNotes) => {
  return (
    <Card as={Link} to={`/${id}`} className={`h-100 text-rest text-decoration-none`}>
        <CardBody>
            <Stack gap={2} className="align-items-center justify-content-center h-100">
                <span className='fs-5'>{title}</span>
                {tags.length >0 && 
                (<Stack 
                    gap={1} 
                    direction="horizontal" 
                    className="justify-content-center flex-wrap">
                        {tags.map(tag => (
                            <Badge className="text-truncate" 
                                key={tag.id}>
                                    {tag.label}
                            </Badge>
                        ))}
                    </Stack>
                )}
            </Stack>
        </CardBody>
    </Card>
  )
}

export default NoteCard
import React from 'react'
import {Button,Modal} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faTrash,} from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@material-ui/core/Tooltip'

const Confirm = ({showss, handleClose, handleShow, handleDelete, del, msg}) => {
    
    return (
      <>
      <Tooltip title="delete chat" placement="top">
        <Button variant="secondary" onClick={handleShow}
         style={{background: 'transparent', border: 'none', fontSize: 20, display: del, height: 30, marginTop: 10}}>
              <FontAwesomeIcon icon={faTrash}  />
        </Button>
        </Tooltip>
        <Modal show={showss} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Warning!!!</Modal.Title>
          </Modal.Header>
          <Modal.Body>{msg} </Modal.Body>
          <Modal.Footer className='modalfooter'>
            <Button variant="secondary" style={{backgroundColor: 'black'}} onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="secondary" style={{backgroundColor: '#747485'}} onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  export default Confirm;
import { Button, IconButton, Snackbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Close } from '@material-ui/icons'
import React from 'react'
import { NoteContainer, TagContainer } from '../stores'

const useStyles = makeStyles(theme => ({
  folderItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '.5rem',
    cursor: 'pointer',
    fontSize: '.9rem',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: '#555',
    },
    '&.active': {
      backgroundColor: '#101010',
      '& $tagIcon': {
        color: theme.palette.primary.main,
      },
    },
  },
  tagIcon: {
    marginRight: '.5rem',
    fontSize: '1.1rem',
  },
  tagText: {
    flexGrow: 1,
  },
  tagTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '40px',
    marginTop: '1rem',
    padding: '0 .5rem',
    '& h3': {
      margin: 0,
      color: '#999',
      fontSize: '0.85rem',
    },
    '&:hover': {
      '& $editBtn': {
        display: 'block',
      },
    },
  },
  editBtn: {
    display: 'none',
    padding: '.35rem',
    backgroundColor: '#292929',
    color: 'inherit',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  editIcon: {
    fontSize: '1rem',
  },
}))

interface UIManagerProps {}

const UIManager: React.FC<UIManagerProps> = () => {
  const classes = useStyles()
  const { noteState, noteDispatch } = NoteContainer.useContainer()
  const { activeTag } = noteState
  const { tagState } = TagContainer.useContainer()
  const { tags } = tagState

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Note archived</span>}
        action={[
          <Button key="undo" color="secondary" size="small" onClick={handleClose}>
            UNDO
          </Button>,
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            className={classes.close}
            onClick={handleClose}
          >
            <Close />
          </IconButton>,
        ]}
      />
    </>
  )
}

export default UIManager

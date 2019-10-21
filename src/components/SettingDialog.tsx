import { Dialog, DialogContent, DialogTitle, Switch } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { SettingActionType, SettingContainer } from '../stores'

const Shortcuts = [
  { text: 'Crete note', kbds: ['ctrl', 'alt', 'n'] },
  { text: 'Delete note', kbds: ['ctrl', 'alt', 'u'] },
  { text: 'Preview note', kbds: ['esc'] },
  { text: 'Edit note', kbds: ['ctrl', 'e'] },
]

const useStyle = makeStyles({
  dark: {
    backgroundColor: '#333',
    color: '#d0d0d0',
    '& $kbd': {
      background: '#262626',
      border: '1px solid #1a1a1a',
      boxShadow: '0 1px 0 hsla(0,0%,100%,.2), inset 0 0 0 2px #222',
      color: '#b7b7b7',
    },
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '400px',
    padding: '.3rem',
  },
  settingLabel: {
    margin: '1rem 0',
    fontWeight: 700,
  },
  kbd: {
    display: 'inline-block',
    lineHeight: 1.4,
    margin: '0 .1em',
    padding: '.1em .6em',
    border: '1px solid #ccc',
    borderRadius: '3px',
    boxShadow: '0 1px 0 rgba(0,0,0,.2), inset 0 0 0 2px #fff',
    backgroundColor: '#f7f7f7',
  },
})

interface SettingDialogProps {}

const SettingDialog: React.FC<SettingDialogProps> = () => {
  const classes = useStyle()
  const { settingState, settingDispatch } = SettingContainer.useContainer()
  const { isOpen, darkMode } = settingState

  return (
    <Dialog
      onClose={() => settingDispatch({ type: SettingActionType.TOGGLE_SETTING_DIALOG })}
      open={isOpen}
    >
      <DialogTitle className={`${darkMode ? classes.dark : ''}`}>Settings</DialogTitle>
      <DialogContent className={`${darkMode ? classes.dark : ''}`}>
        <div className={classes.settingItem}>
          <div>Dark mode</div>
          <Switch
            checked={darkMode}
            onChange={() => settingDispatch({ type: SettingActionType.TOGGLE_DARK_MODE })}
            color="primary"
          />
        </div>
        <div className={classes.settingLabel}>Keyboard Shortcuts</div>
        {Shortcuts.map(item => (
          <div className={classes.settingItem} key={item.text}>
            <div>{item.text}</div>
            <div>
              {item.kbds.map((k, i) => {
                return (
                  <React.Fragment key={i}>
                    <kbd className={classes.kbd}>{k.toUpperCase()}</kbd>
                    {i < item.kbds.length - 1 ? ' + ' : ''}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  )
}

export default SettingDialog

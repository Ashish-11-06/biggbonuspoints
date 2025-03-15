import React from 'react'
import { Dialog, Portal, Text, Button } from 'react-native-paper'

const HelpDialog = ({visible,onDismiss}) => {

  return (
   <Portal>
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>Need Help?</Dialog.Title>
      <Dialog.Content>
        <Text>
          If you are facing any issues, please contact our customer support.
          {"\n"}
          Contact Number:
            <Text style={{ color: "#007BFF", fontWeight: "bold" }}>
               9876543210
            </Text>
        </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Close</Button>
      </Dialog.Actions>
      </Dialog>
   </Portal>
  )
}

export default HelpDialog

import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/SendRounded';
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%', // Changed from 100vh to 100% to fit the parent's height
  backgroundColor: '#282C34',
  overflow: 'hidden', // Prevents scrolling within the chat container
});

const MessageList = styled(List)({
  flexGrow: 1,
  overflowY: 'auto',
  padding: '20px',
  backgroundColor: 'rgba(40, 44, 52, 0.95)', // Same as ChatContainer for consistency
});

const MessageItem = styled(ListItem)({
  backgroundColor: '#32363E', // Slightly lighter for contrast with the background
  color: 'white',
  padding: '10px 15px',
  borderRadius: '10px',
  margin: '5px 0',
  maxWidth: '75%',
  alignSelf: 'flex-end',
});

const InputArea = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  backgroundColor: '#282C34', // Match the chat container
});

const StyledInputBase = styled(InputBase)({
  flex: 1,
  marginRight: '10px',
  padding: '10px',
  borderRadius: '4px',
  backgroundColor: '#32363E', // Match the MessageItem for consistency
  color: 'white',
});

const SendButton = styled(IconButton)({
  // The button is now explicitly on the right
});

const ChatComponent = () => {
  return (
    <ChatContainer>
      <MessageList>
        {/* Messages will be dynamically inserted here using MessageItem */}
      </MessageList>
      <InputArea>
        <StyledInputBase
          placeholder="Type a message..."
          fullWidth
          multiline
          maxRows={4}
          inputProps={{ 'aria-label': 'type a message' }}
        />
        <SendButton type="submit" aria-label="send">
		<SendIcon fontSize='small' style={{ color: 'white' }} />
         </SendButton>
      </InputArea>
    </ChatContainer>
  );
};

export default ChatComponent;









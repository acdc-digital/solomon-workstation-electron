import React, { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/SendRounded';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  backgroundColor: '#282C34',
  overflow: 'hidden',
});

const MessageList = styled(List)({
  flexGrow: 1,
  overflowY: 'auto',
  padding: '20px',
  backgroundColor: 'rgba(40, 44, 52, 0.95)',
});

const MessageItem = styled(ListItem)({
  backgroundColor: '#32363E',
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
  backgroundColor: '#282C34',
});

const StyledInputBase = styled(InputBase)({
  flex: 1,
  marginRight: '10px',
  padding: '10px',
  borderRadius: '4px',
  backgroundColor: '#32363E',
  color: 'white',
});

const SendButton = styled(IconButton)({
  // Placeholder for potential future styling
});

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    const trimmedInput = userInput.trim();
    if (trimmedInput) {
      const userMessage = { role: 'user', content: trimmedInput };
      setUserInput(''); // Clear input immediately to prevent double sends
      setIsLoading(true); // Indicate loading state

      try {
        // Append user message to the chat
        setMessages(prevMessages => [...prevMessages, userMessage]);

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: trimmedInput }),
        });

        setIsLoading(false); // Loading complete

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMessages(prevMessages => [...prevMessages, { role: 'ai', content: data.response }]);
      } catch (error) {
        setIsLoading(false); // Loading complete, even if there's an error
        console.error('Failed to send message:', error);
        setMessages(prevMessages => [...prevMessages, { role: 'error', content: 'Failed to send message. Please try again.' }]);
      }
    }
  };

  return (
    <ChatContainer>
      <MessageList>
        {messages.map((msg, index) => (
          <MessageItem key={index} style={{ alignSelf: msg.role === 'ai' ? 'flex-start' : msg.role === 'error' ? 'center' : 'flex-end' }}>
            {msg.content}
          </MessageItem>
        ))}
      </MessageList>
      <InputArea>
        <StyledInputBase
          placeholder="Type a message..."
          fullWidth
          multiline
          maxRows={4}
          inputProps={{ 'aria-label': 'type a message' }}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading}
        />
        <SendButton type="submit" aria-label="send" onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : <SendIcon fontSize='small' style={{ color: 'white' }} />}
        </SendButton>
      </InputArea>
    </ChatContainer>
  );
};

export default ChatComponent;

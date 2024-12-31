import React from 'react';

const MessageFormatter = ({ message }) => {
  const lines = message.split('\n');
  
  return (
    <div style={{
      width: '100%',
      lineHeight: '1.6'
    }}>
      {lines.map((line, index) => {
        // Handle bold text (wrapped in **)
        if (line.includes('**')) {
          return (
            <div key={index} style={{
              fontWeight: '600',
              color: '#4D5645',
              margin: '20px 0 10px 0'
            }}>
              {line.replaceAll('**', '')}
            </div>
          );
        }
        
        // Handle bullet points
        if (line.trim().startsWith('-')) {
          return (
            <div key={index} style={{
              margin: '8px 0',
              paddingLeft: '20px',
              color: '#666',
              fontStyle: line.includes('Temperature:') || line.includes('Note:') ? 'italic' : 'normal'
            }}>
              {line.trim()}
            </div>
          );
        }
        
        // Regular text
        if (line.trim()) {
          return (
            <p key={index} style={{
              margin: '8px 0'
            }}>
              {line}
            </p>
          );
        }
        
        // Empty lines
        return <br key={index} />;
      })}
    </div>
  );
};

export default MessageFormatter;

import React from 'react';

const MessageFormatter = ({ message }) => {
  const lines = message.split('\n');
  
  return (
    <div style={{
      width: '100%',
      lineHeight: '1.6'
    }}>
      {lines.map((line, index) => {
        // Handle introduction (lines before first step)
        if (!line.match(/^\d/) && !line.startsWith('Temperature')) {
          return (
            <p key={index} style={{
              margin: '0 0 15px 0',
              color: '#4D5645'
            }}>
              {line}
            </p>
          );
        }
        
        // Handle step numbers and titles (lines starting with number)
        if (line.match(/^\d/)) {
          return (
            <h4 key={index} style={{
              margin: '20px 0 10px 0',
              color: '#4D5645',
              fontWeight: '600'
            }}>
              {line}
            </h4>
          );
        }
        
        // Handle temperature lines
        if (line.startsWith('Temperature')) {
          return (
            <div key={index} style={{
              margin: '8px 0 15px 0',
              padding: '8px 15px',
              backgroundColor: '#f5f5f5',
              borderLeft: '3px solid #4D5645',
              color: '#666',
              fontStyle: 'italic',
              borderRadius: '4px'
            }}>
              {line}
            </div>
          );
        }
        
        // Regular text lines
        return (
          <p key={index} style={{
            margin: '8px 0'
          }}>
            {line}
          </p>
        );
      })}
    </div>
  );
};

export default MessageFormatter;
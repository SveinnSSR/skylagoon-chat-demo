// In MessageFormatter.jsx
const MessageFormatter = ({ message }) => {
    const lines = message.split('\n');
    
    return (
      <div style={{
        width: '100%',
        lineHeight: '1.6'
      }}>
        {lines.map((line, index) => {
          // Handle package headings (wrapped in **)
          if (line.includes('**')) {
            return (
              <div key={index} style={{
                fontWeight: '600',
                color: '#4D5645',
                margin: '20px 0 10px 0',
                fontSize: '15px'
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
                position: 'relative',
              }}>
                <span style={{
                  position: 'absolute',
                  left: '8px',
                  top: '0'
                }}>•</span>
                {line.substring(1).trim()}
              </div>
            );
          }
          
          // Regular text
          if (line.trim()) {
            return (
              <p key={index} style={{
                margin: '12px 0',
                color: line.includes('Pricing:') ? '#666' : 'inherit'
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
  
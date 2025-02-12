// src/components/MessageFormatter.jsx
const MessageFormatter = ({ message }) => {
  // Function to convert URLs to clickable links
  const formatLinks = (text) => {
    // Split text into parts based on URLs
    const parts = [];
    const words = text.split(' ');
    
    words.forEach((word, index) => {
      if (word.includes('https://www.google.com/maps')) {
        parts.push(' ');
        parts.push(
          <a 
            key={`maps-${index}`}
            href={word}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#4A90E2',
              textDecoration: 'underline',
              wordBreak: 'break-word'
            }}
          >
            View on Google Maps
          </a>
        );
      } else if (word.includes('https://www.skylagoon.com')) {
        parts.push(' ');
        parts.push(
          <a 
            key={`site-${index}`}
            href={word}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#4A90E2',
              textDecoration: 'underline',
              wordBreak: 'break-word'
            }}
          >
            Learn More
          </a>
        );
      } else {
        parts.push(index === 0 ? word : ` ${word}`);
      }
    });
    
    return parts;
  };

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
              {formatLinks(line.substring(1).trim())}
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
              {formatLinks(line)}
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

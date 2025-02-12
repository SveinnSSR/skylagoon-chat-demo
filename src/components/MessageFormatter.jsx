// src/components/MessageFormatter.jsx
const MessageFormatter = ({ message }) => {
  // Function to convert URLs to clickable links
  const formatLinks = (text) => {
    // Look for markdown-style links [text](url)
    const linkRegex = /\[(.*?)\]\s*\((.*?)\)/g;
    const parts = [];
    
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      // Add the link
      parts.push(
        <a 
          key={`link-${match.index}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#4A90E2',
            textDecoration: 'underline',
            wordBreak: 'break-word'
          }}
        >
          {match[1]}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const lines = message.split('\n');
  
  // Rest of your existing MessageFormatter code...
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

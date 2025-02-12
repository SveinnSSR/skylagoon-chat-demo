// src/components/MessageFormatter.jsx
const MessageFormatter = ({ message }) => {
  // Function to convert URLs to clickable links
  const formatLinks = (text) => {
    const parts = [];
    
    // Check if text contains a website_link or maps_link
    if (typeof text === 'object' && (text.website_link || text.maps_link)) {
      parts.push(text.description || '');
      parts.push(' ');
      
      if (text.website_link) {
        parts.push(
          <a 
            key="website-link"
            href={text.website_link}
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
      }
      
      if (text.maps_link) {
        parts.push(
          <a 
            key="maps-link"
            href={text.maps_link}
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
      }
      
      return parts;
    }
    
    // Regular text handling
    return text;
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

// src/components/MessageFormatter.jsx
const MessageFormatter = ({ message }) => {
  // Base link styles that can be reused
  const baseLinkStyles = {
    color: '#4D5645',             // Sky Lagoon's olive green color
    textDecoration: 'none',       // Remove underline
    backgroundColor: '#E8E6E1',   // Light background for button effect
    padding: '6px 12px',          // Add padding for button look
    borderRadius: '4px',          // Rounded corners
    display: 'inline-block',      // Make it block-level for padding
    marginTop: '8px',             // Add some space above
    fontSize: '14px',             // Slightly smaller font
    fontWeight: '500',            // Medium weight
    transition: 'all 0.2s ease',  // Smooth hover effect
    cursor: 'pointer'             // Show clickable cursor
  };

  // Different variations for different types of links
  const linkStyles = {
    default: {
      ...baseLinkStyles
    },
    maps: {
      ...baseLinkStyles,
      paddingLeft: '28px',
      position: 'relative'
    },
    dining: {
      ...baseLinkStyles,
      backgroundColor: '#E8E6E1'
    },
    ritual: {
      ...baseLinkStyles,
      backgroundColor: '#E8E6E1'
    }
  };

  // Function to determine link style based on URL
  const getLinkStyle = (url) => {
    if (url.includes('maps')) return linkStyles.maps;
    if (url.includes('food-drink')) return linkStyles.dining;
    if (url.includes('ritual')) return linkStyles.ritual;
    return linkStyles.default;
  };

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

      const linkStyle = getLinkStyle(match[2]);
      
      // Add the link with appropriate styling
      parts.push(
        <a 
          key={`link-${match.index}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#D8D6D1';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#E8E6E1';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          {match[2].includes('maps') ? '📍 ' : ''}{match[1]}
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

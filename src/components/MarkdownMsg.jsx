import parseMarkdown from '../utils/parseMarkdown';
import PropTypes from 'prop-types';

function MarkdownMsg({ text, className, style, onError, fallback, options }) {
  try {
    const html = parseMarkdown(text, options);
    return (
      <div
        className={`markdown-msg ${className || ''}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (error) {
    if (onError) {
      onError(error);
    }
    if (fallback !== undefined) {
      return <div className="markdown-msg-error">{fallback}</div>;
    }
    return <div className="markdown-msg-error">Failed to render markdown</div>;
  }
}

MarkdownMsg.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  onError: PropTypes.func,
  fallback: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  options: PropTypes.object,
};

MarkdownMsg.defaultProps = {
  className: '',
  style: {},
  onError: undefined,
  fallback: undefined,
  options: undefined,
};

export default MarkdownMsg;

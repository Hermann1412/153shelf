import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../lib/config';

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function Reader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const blobRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/products/${id}`)
      .then(r => r.json())
      .then(book => {
        if (book.title) {
          setTitle(book.title);
          document.title = `${book.title} — 153Shelf`;
          window.history.replaceState(null, '', `/read/${toSlug(book.title)}`);
        }
      })
      .catch(() => {});

    fetch(`${API_URL}/products/${id}/read`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Could not load the book. Make sure you are logged in.');
        return res.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        blobRef.current = url;
        setPdfUrl(url);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    return () => {
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
        blobRef.current = null;
      }
    };
  }, [id]);

  return (
    <div className="reader-page">
      <div className="reader-toolbar">
        <button className="btn-back" onClick={() => navigate('/library')}>
          &larr; Back to Library
        </button>
        {title && <span className="reader-book-title">{title}</span>}
      </div>

      {loading && !error && (
        <div className="reader-status">Loading book&hellip;</div>
      )}
      {error && (
        <div className="reader-status reader-error">{error}</div>
      )}
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          className="reader-frame"
          title={title || 'Book Reader'}
        />
      )}
    </div>
  );
}

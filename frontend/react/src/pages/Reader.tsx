import { useParams, useNavigate } from 'react-router-dom';

export default function Reader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pdfUrl = `http://localhost:5000/api/products/${id}/read`;

  return (
    <div className="reader-page">
      <div className="reader-toolbar">
        <button className="btn-back" onClick={() => navigate('/orders')}>
          &larr; Back to Library
        </button>
      </div>
      <iframe
        src={pdfUrl}
        className="reader-frame"
        title="Book Reader"
      />
    </div>
  );
}

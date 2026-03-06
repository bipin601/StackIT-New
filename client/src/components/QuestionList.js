import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function normaliseTags(tags = []) {
  return tags
    .map(t => (typeof t === "string" ? t : t?.name))
    .filter(Boolean);
}

const QuestionList = ({ activeTag = null, filter = "Latest", search = "" }) => {
  const [questions, setQuestions] = useState([]);
  const [answerCounts, setAnswerCounts] = useState({});  // { [questionId]: number }
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("si-theme") || "dark");

  const isLight = theme === "light";

  useEffect(() => {
    const handler = (e) => setTheme(e.detail);
    window.addEventListener("si-theme-change", handler);
    return () => window.removeEventListener("si-theme-change", handler);
  }, []);

  useEffect(() => {
    let ignore = false;
    const getQuestions = async () => {
      try {
        const res = await api.get('/questions');
        if (!ignore) {
          const data = Array.isArray(res.data)
            ? res.data
            : res.data?.questions ?? res.data?.data ?? [];
          setQuestions(data);

          // Fetch answer counts for all questions in parallel
          const counts = await Promise.all(
            data.map(async (q) => {
              try {
const r = await api.get(`/answers?questionId=${q._id}`);                // Handle both flat array and wrapped response
                const answers = Array.isArray(r.data)
                  ? r.data
                  : r.data?.answers ?? r.data?.data ?? [];
                return { id: q._id, count: answers.length };
              } catch {
                return { id: q._id, count: 0 };
              }
            })
          );

          if (!ignore) {
            // Build a lookup map { questionId: count }
            const countMap = {};
            counts.forEach(({ id, count }) => { countMap[id] = count; });
            setAnswerCounts(countMap);
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error('QuestionList fetch failed', err);
          setFetchError('Cannot load questions right now');
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    getQuestions();
    return () => { ignore = true; };
  }, []);

  const filtered = useMemo(() => {
    let result = [...questions];

    if (activeTag) {
      result = result.filter(q =>
        normaliseTags(q.tags).some(t => t.toLowerCase() === activeTag.toLowerCase())
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(item =>
        (item.title || "").toLowerCase().includes(q) ||
        (item.body || item.content || item.description || "").toLowerCase().includes(q)
      );
    }

    if (filter === "Unanswered") {
      result = result.filter(item => (answerCounts[item._id] || 0) === 0);
    } else if (filter === "Hot") {
      result = [...result].sort((a, b) => (Number(b.votes) || 0) - (Number(a.votes) || 0));
    } else if (filter === "Active") {
      result = [...result].sort((a, b) =>
        new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
      );
    } else {
      result = [...result].sort((a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }

    return result;
  }, [questions, activeTag, search, filter, answerCounts]);

  const S = {
    loading: {
      padding: '40px 0',
      color: isLight ? 'rgba(0,120,80,0.6)' : 'rgba(0,255,200,0.5)',
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: '13px', letterSpacing: '0.1em',
    },
    error: {
      padding: '24px', color: '#ff7070',
      background: 'rgba(255,80,80,0.05)', border: '1px solid rgba(255,80,80,0.2)',
      fontFamily: "'Share Tech Mono',monospace", fontSize: '13px',
    },
    empty: {
      padding: '40px 0',
      color: isLight ? 'rgba(0,100,60,0.5)' : 'rgba(0,255,200,0.35)',
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: '13px', letterSpacing: '0.08em', textAlign: 'center',
    },
    emptyLink: { color: isLight ? '#007850' : '#00ffc8', textDecoration: 'none' },
    list: { display: 'flex', flexDirection: 'column' },
    item: {
      padding: '16px 0',
      borderBottom: isLight ? '1px solid rgba(0,160,120,0.12)' : '1px solid rgba(0,255,200,0.07)',
      display: 'flex', flexDirection: 'column', gap: '8px',
    },
    titleLink: {
      fontSize: '15px', fontWeight: '500',
      color: isLight ? '#0a2820' : '#e6fff8',
      textDecoration: 'none', fontFamily: "'Share Tech Mono',monospace",
      letterSpacing: '0.03em', lineHeight: 1.45,
    },
    meta: { display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
    metaItem: {
      fontSize: '11px',
      color: isLight ? 'rgba(0,100,60,0.55)' : 'rgba(0,255,200,0.35)',
      fontFamily: "'Share Tech Mono',monospace", letterSpacing: '0.06em',
    },
    tagRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
    tag: {
      padding: '2px 9px',
      border: isLight ? '1px solid rgba(0,160,120,0.2)' : '1px solid rgba(0,255,200,0.18)',
      background: isLight ? 'rgba(0,160,120,0.06)' : 'rgba(0,255,200,0.04)',
      fontSize: '10px',
      color: isLight ? 'rgba(0,100,60,0.75)' : 'rgba(0,255,200,0.6)',
      fontFamily: "'Share Tech Mono',monospace", letterSpacing: '0.06em',
    },
    tagActive: {
      border: isLight ? '1px solid rgba(0,160,120,0.6)' : '1px solid rgba(0,255,200,0.55)',
      background: isLight ? 'rgba(0,160,120,0.12)' : 'rgba(0,255,200,0.1)',
      color: isLight ? '#006840' : '#00ffc8',
      boxShadow: isLight ? '0 0 8px rgba(0,160,120,0.15)' : '0 0 8px rgba(0,255,200,0.12)',
    },
  };

  if (isLoading) return <div style={S.loading}>// Loading questions…</div>;
  if (fetchError) return (
    <div style={S.error}>
      {fetchError}<br />
      <small style={{ color: 'rgba(255,120,120,0.6)' }}>check browser console</small>
    </div>
  );
  if (filtered.length === 0) return (
    <div style={S.empty}>
      {activeTag
        ? `// No questions tagged "${activeTag}"`
        : search
        ? `// No results for "${search}"`
        : <><span>// No questions yet. </span><Link to="/ask" style={S.emptyLink}>Ask the first one →</Link></>
      }
    </div>
  );

  return (
    <>
      <style>{`.ql-link:hover { color: ${isLight ? '#005535' : '#00ffc8'} !important; }`}</style>
      <div style={S.list}>
        {filtered.map((item, index) => {
          if (!item || !item._id) return null;
          const tags = normaliseTags(item.tags);
          const answerCount = answerCounts[item._id] ?? 0;
          const hasAnswers = answerCount > 0;

          return (
            <div key={item._id || `q-${index}`} style={S.item}>
              <Link to={`/questions/${item._id}`} className="ql-link" style={S.titleLink}>
                {item.title || '(no title)'}
              </Link>

              <div style={S.meta}>
                <span style={S.metaItem}>▲ {Number(item.votes) || 0} votes</span>

                <span style={{
                  ...S.metaItem,
                  color: hasAnswers
                    ? (isLight ? '#007850' : '#00ffc8')
                    : (isLight ? 'rgba(0,100,60,0.4)' : 'rgba(0,255,200,0.25)'),
                  fontWeight: hasAnswers ? '600' : 'normal',
                }}>
                  {hasAnswers ? '✓' : '◈'} {answerCount} answer{answerCount !== 1 ? 's' : ''}
                </span>

                {item.createdAt && (
                  <span style={S.metaItem}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                )}
                {item.author?.username && (
                  <span style={S.metaItem}>by {item.author.username}</span>
                )}
              </div>

              {tags.length > 0 && (
                <div style={S.tagRow}>
                  {tags.map(tag => (
                    <span key={tag} style={{
                      ...S.tag,
                      ...(activeTag?.toLowerCase() === tag.toLowerCase() ? S.tagActive : {}),
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default QuestionList;
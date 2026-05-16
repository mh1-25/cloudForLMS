import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../config/url";
const BASE = BASE_URL;
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const INSTRUCTOR_ID = user?.id;

const authH = () => ({ Authorization: `Bearer ${token}` });

const LEVEL_STYLE = {
  BEGINNER:     { bg: "#dcfce7", color: "#15803d" },
  INTERMEDIATE: { bg: "#fef9c3", color: "#a16207" },
  ADVANCED:     { bg: "#fee2e2", color: "#b91c1c" },
};
const LEVEL_LABEL = { BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced" };


function QuestionBuilder({ questions, setQuestions, accentColor = "#7c3aed" }) {
  const mkQ = () => ({
    _uid: Date.now() + Math.random(),
    questionText: "",
    questionType: "MCQ",
    points: 1,
    answers: [
      { answerText: "", correct: false, answerOrder: 1 },
      { answerText: "", correct: false, answerOrder: 2 },
      { answerText: "", correct: false, answerOrder: 3 },
      { answerText: "", correct: false, answerOrder: 4 },
    ],
  });

  const addQ   = () => setQuestions(p => [...p, mkQ()]);
  const removeQ = uid => setQuestions(p => p.filter(q => q._uid !== uid));

  const updateQ = (uid, field, val) =>
    setQuestions(p => p.map(q => {
      if (q._uid !== uid) return q;
      const u = { ...q, [field]: val };
      if (field === "questionType") {
        u.answers = val === "TRUE_FALSE"
          ? [{ answerText:"True", correct:true, answerOrder:1},{ answerText:"False", correct:false, answerOrder:2}]
          : [{ answerText:"",correct:false,answerOrder:1},{ answerText:"",correct:false,answerOrder:2},{ answerText:"",correct:false,answerOrder:3},{ answerText:"",correct:false,answerOrder:4}];
      }
      return u;
    }));

  const updateA = (uid, order, val) =>
    setQuestions(p => p.map(q =>
      q._uid !== uid ? q : { ...q, answers: q.answers.map(a => a.answerOrder === order ? { ...a, answerText: val } : a) }
    ));

  const toggleCorrect = (uid, order) =>
    setQuestions(p => p.map(q =>
      q._uid !== uid ? q : {
        ...q,
        answers: q.questionType === "MCQ"
          // MCQ: only one correct at a time
          ? q.answers.map(a => ({ ...a, correct: a.answerOrder === order }))
          // TRUE_FALSE: toggle independently
          : q.answers.map(a => a.answerOrder === order ? { ...a, correct: !a.correct } : a),
      }
    ));

  const addA = uid =>
    setQuestions(p => p.map(q =>
      q._uid !== uid ? q : { ...q, answers: [...q.answers, { answerText:"", correct:false, answerOrder: q.answers.length+1 }] }
    ));

  const removeA = (uid, order) =>
    setQuestions(p => p.map(q =>
      q._uid !== uid ? q : { ...q, answers: q.answers.filter(a => a.answerOrder !== order).map((a,i) => ({...a, answerOrder:i+1})) }
    ));

  return (
    <div>
      {questions.length === 0 && (
        <div style={S.emptyQ}>
          <div style={S.emptyQIcon}></div>
          <p style={S.emptyQTitle}>No questions yet</p>
          <p style={S.emptyQSub}>Click the button below to add your first question</p>
        </div>
      )}

      {questions.map((q, qi) => (
        <div key={q._uid} style={{ ...S.qCard, borderLeft: `4px solid ${accentColor}` }}>
          {/* Header */}
          <div style={S.qCardHead}>
            <span style={{ ...S.qBadge, background: accentColor }}>Q{qi + 1}</span>
            <div style={S.typePills}>
              {["MCQ","TRUE_FALSE"].map(t => (
                <button key={t}
                  style={{ ...S.typePill, ...(q.questionType===t ? { background: accentColor+"22", color: accentColor, border:`1px solid ${accentColor}66` } : {}) }}
                  onClick={() => updateQ(q._uid,"questionType",t)}
                >
                  {t === "MCQ" ? " MCQ" : " True / False"}
                </button>
              ))}
            </div>
            {/* Points field */}
            <div style={S.pointsWrap}>
              <label style={{ ...S.fieldLabel, marginBottom:2 }}>Points</label>
              <input type="number" min="1" style={S.pointsInput}
                value={q.points}
                onChange={e => updateQ(q._uid,"points", Number(e.target.value)||1)} />
            </div>
            <button style={S.removeQBtn} onClick={() => removeQ(q._uid)}>✕ Remove</button>
          </div>

          {/* Question text */}
          <div style={S.fieldWrap}>
            <label style={S.fieldLabel}>Question Text <span style={{color:"#b91c1c"}}>*</span></label>
            <textarea style={S.qTextarea} value={q.questionText}
              onChange={e => updateQ(q._uid,"questionText",e.target.value)}
              placeholder="Type your question here…" />
          </div>

          {/* Answers */}
          <div style={S.fieldWrap}>
            <label style={S.fieldLabel}>{q.questionType==="TRUE_FALSE" ? "Answers — mark the correct one" : "Answer Options — mark correct answer *"}</label>
            {q.answers.map(a => (
              <div key={a.answerOrder} style={{ ...S.ansRow, background: a.correct ? "#f0fdf4" : "transparent", borderRadius:8, padding:"4px 6px" }}>
                {/* Correct toggle */}
                <button
                  title={a.correct ? "Correct answer" : "Mark as correct"}
                  style={{
                    ...S.correctBtn,
                    background: a.correct ? "#16a34a" : "#e2e8f0",
                    color: a.correct ? "#fff" : "#94a3b8",
                    border: a.correct ? "2px solid #16a34a" : "2px solid #e2e8f0",
                  }}
                  onClick={() => toggleCorrect(q._uid, a.answerOrder)}
                >
                  {a.correct ? "✓" : "○"}
                </button>
                <span style={S.ansBullet}>{a.answerOrder}</span>
                <input style={{ ...S.ansInput, background: q.questionType==="TRUE_FALSE"?"#f1f5f9":"#fff" }}
                  value={a.answerText} readOnly={q.questionType==="TRUE_FALSE"}
                  onChange={e => updateA(q._uid, a.answerOrder, e.target.value)}
                  placeholder={`Option ${a.answerOrder}…`} />
                {q.questionType==="MCQ" && q.answers.length > 2 && (
                  <button style={S.removeABtn} onClick={() => removeA(q._uid, a.answerOrder)}>✕</button>
                )}
              </div>
            ))}
            {q.questionType==="MCQ" && q.answers.length < 6 && (
              <button style={S.addABtn} onClick={() => addA(q._uid)}>+ Add Option</button>
            )}
            {q.questionType==="MCQ" && !q.answers.some(a=>a.correct) && (
              <p style={S.correctHint}>⚠ Please mark one answer as correct</p>
            )}
          </div>
        </div>
      ))}

      <button style={{ ...S.addQBtn, background: accentColor+"11", color: accentColor, border:`2px dashed ${accentColor}44` }} onClick={addQ}>
        {questions.length === 0 ? "+ Add First Question" : "+ Add Another Question"}
      </button>
    </div>
  );
}


function QuizBuilderPage({ lesson, course, onBack }) {
  const [step, setStep]           = useState(1); // 1=form, 2=questions
  const [quizId, setQuizId]       = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [form, setForm]           = useState({ title:"", timeLimit:10, totalQuistions:5, passingScore:3, Published:true });
  const [questions, setQuestions] = useState([]);
  const [creating, setCreating]   = useState(false);
  const [saving,   setSaving]     = useState(false);
  const [success,  setSuccess]    = useState("");
  const [error,    setError]      = useState("");

  const accent = "#7c3aed";

  const handleCreateQuiz = async () => {
    if (!form.title.trim()) return;
    setCreating(true); setError("");
    try {
      const res = await axios.post(`${BASE}api/quizzes/create-quiz`, {
        title:          form.title,
        TimeLimit:      Number(form.timeLimit),
        totalQuistions: Number(form.totalQuistions),
        passingScore:   Number(form.passingScore),
        Published:      form.Published,
        instructorId:   INSTRUCTOR_ID,
        lessonId:       lesson.id,
        courseId:       course.id,
      }, { headers: authH() });
      setQuizId(res.data.id);
      setQuizTitle(form.title);
      setStep(2);
    } catch (e) {
      console.error(e);
      setError("Failed to create quiz. Please check the data and try again.");
    } finally { setCreating(false); }
  };

  const handleSaveQuestions = async () => {
    if (!questions.length) return;
    const bad = questions.find(q => !q.questionText.trim() || q.answers.some(a => !a.answerText.trim()) || !q.answers.some(a => a.correct));
    if (bad) { setError("Fill in all questions, all answer options, and mark one correct answer per question."); return; }
    setSaving(true); setError(""); setSuccess("");
    try {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await axios.post(`${BASE}api/questions/quizzes/${quizId}/questions`, {
          questionText:  q.questionText,
          questionType:  q.questionType,
          questionOrder: i + 1,
          points:        q.points || 1,
          answers: q.answers.map(a => ({ answerText: a.answerText, correct: !!a.correct, answerOrder: a.answerOrder })),
        }, { headers: authH() });
      }
      setSuccess(`✓ ${questions.length} question(s) saved to "${quizTitle}" successfully!`);
      setQuestions([]);
    } catch (e) {
      console.error(e);
      setError("Failed to save questions. Please try again.");
    } finally { setSaving(false); }
  };

  return (
    <div style={S.builderPage}>
      {/* Top bar */}
      <div style={{ ...S.topBar, borderBottom:`3px solid ${accent}` }}>
        <button style={S.backBtn} onClick={onBack}>← Back</button>
        <div style={S.topCenter}>
          <span style={S.topIcon}>📋</span>
          <div>
            <p style={{ ...S.topSub, color: accent }}>Quiz Builder</p>
            <h1 style={S.topTitle}>
              {step===1 ? `Create Quiz for: "${lesson.title}"` : `Adding Questions → "${quizTitle}"`}
            </h1>
          </div>
        </div>
        {step===2 ? (
          <button style={{ ...S.saveBtn, background: accent, opacity: !questions.length||saving?0.5:1 }}
            onClick={handleSaveQuestions} disabled={!questions.length||saving}>
            {saving ? "Saving…" : `💾 Save ${questions.length} Question(s)`}
          </button>
        ) : <div style={{width:160}}/>}
      </div>

      {success && <div style={S.successBar}>{success}</div>}
      {error   && <div style={S.errorBar}>{error}</div>}

      <div style={S.builderBody}>
        {/* STEP 1 — Quiz form */}
        {step===1 && (
          <div style={S.formCard}>
            <h2 style={{ ...S.formCardTitle, color: accent }}>✨ Quiz Details</h2>
            <div style={S.formGrid}>
              <div style={S.fieldWrap}>
                <label style={S.fieldLabel}>Quiz Title <span style={{color:"#b91c1c"}}>*</span></label>
                <input style={S.formInput} value={form.title}
                  onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Lesson 1 Quiz" />
              </div>
              <div style={S.fieldWrap}>
                <label style={S.fieldLabel}>Time Limit (min)</label>
                <input style={S.formInput} type="number" min="1" value={form.timeLimit}
                  onChange={e=>setForm(p=>({...p,timeLimit:e.target.value}))} />
              </div>
              <div style={S.fieldWrap}>
                <label style={S.fieldLabel}>Total Questions</label>
                <input style={S.formInput} type="number" min="1" value={form.totalQuistions}
                  onChange={e=>setForm(p=>({...p,totalQuistions:e.target.value}))} />
              </div>
              <div style={S.fieldWrap}>
                <label style={S.fieldLabel}>Passing Score</label>
                <input style={S.formInput} type="number" min="1" value={form.passingScore}
                  onChange={e=>setForm(p=>({...p,passingScore:e.target.value}))} />
              </div>
            </div>
            <label style={{ ...S.toggleRow, marginTop:8 }}>
              <span style={S.fieldLabel}>Published</span>
              <input type="checkbox" checked={form.Published}
                onChange={e=>setForm(p=>({...p,Published:e.target.checked}))} />
            </label>

            <div style={{marginTop:20}}>
              <button style={{ ...S.saveBtn, background: accent, opacity: !form.title.trim()||creating?0.5:1 }}
                onClick={handleCreateQuiz} disabled={!form.title.trim()||creating}>
                {creating ? "Creating…" : "Create Quiz & Add Questions →"}
              </button>
            </div>

            <div style={S.infoBox}>
              <span style={S.infoIcon}>ℹ️</span>
              <span>This quiz will be linked to lesson <strong>"{lesson.title}"</strong> (ID: {lesson.id}) in course <strong>"{course.title}"</strong>.</span>
            </div>
          </div>
        )}

        {/* STEP 2 — Questions */}
        {step===2 && (
          <div>
            <div style={S.stepNav}>
              <button style={S.stepBackBtn}
                onClick={()=>{ setStep(1); setQuestions([]); setSuccess(""); setError(""); }}>
                ← Edit Quiz Info
              </button>
              <div style={S.stepInfo}>
                <span style={{ ...S.pill, background: accent+"22", color: accent }}>Quiz ID: {quizId}</span>
                <span style={{ ...S.pill, background:"#f1f5f9", color:"#475569" }}>Lesson: {lesson.title}</span>
              </div>
            </div>
            <QuestionBuilder questions={questions} setQuestions={setQuestions} accentColor={accent} />
          </div>
        )}
      </div>
    </div>
  );
}

function ExamBuilderPage({ course, onBack }) {
  const [step, setStep]           = useState(1);
  const [examId, setExamId]       = useState(null);
  const [examTitle, setExamTitle] = useState("");
  const [form, setForm]           = useState({ title:"", timelimit:60, totalquistions:10, passingScore:6, Published:true });
  const [questions, setQuestions] = useState([]);
  const [creating, setCreating]   = useState(false);
  const [saving,   setSaving]     = useState(false);
  const [success,  setSuccess]    = useState("");
  const [error,    setError]      = useState("");

  const accent = "#b45309";

  const handleCreateExam = async () => {
    if (!form.title.trim()) return;
    setCreating(true); setError("");
    try {
      const res = await axios.post(`${BASE}api/quizzes-exams/create-exam`, {
        title:          form.title,
        timelimit:      Number(form.timelimit),
        totalquistions: Number(form.totalquistions),
        passingScore:   Number(form.passingScore),
        Published:      form.Published,
        instructorId:   INSTRUCTOR_ID,
        courseId:       course.id,
      }, { headers: authH() });
      setExamId(res.data.id);
      setExamTitle(form.title);
      setStep(2);
    } catch (e) {
      console.error(e);
      setError("Failed to create exam. Please check the data and try again.");
    } finally { setCreating(false); }
  };

  const handleSaveQuestions = async () => {
    if (!questions.length) return;
    const bad = questions.find(q => !q.questionText.trim() || q.answers.some(a => !a.answerText.trim()) || !q.answers.some(a => a.correct));
    if (bad) { setError("Fill in all questions, all answer options, and mark one correct answer per question."); return; }
    setSaving(true); setError(""); setSuccess("");
    try {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await axios.post(`${BASE}api/questions/exams/${examId}/questions`, {
          questionText:  q.questionText,
          questionType:  q.questionType,
          questionOrder: i + 1,
          points:        q.points || 1,
          answers: q.answers.map(a => ({ answerText: a.answerText, correct: !!a.correct, answerOrder: a.answerOrder })),
        }, { headers: authH() });
      }
      setSuccess(` ${questions.length} question(s) saved to "${examTitle}" successfully!`);
      setQuestions([]);
    } catch (e) {
      console.error(e);
      setError("Failed to save questions. Please try again.");
    } finally { setSaving(false); }
  };

  return (
    <div style={S.builderPage}>
      {/* Top bar */}
      <div style={{ ...S.topBar, borderBottom:`3px solid ${accent}` }}>
        <button style={S.backBtn} onClick={onBack}>← Back</button>
        <div style={S.topCenter}>
          <span style={S.topIcon}></span>
          <div>
            <p style={{ ...S.topSub, color: accent }}>Final Exam Builder</p>
            <h1 style={S.topTitle}>
              {step===1 ? `Create Exam for: "${course.title}"` : `Adding Questions → "${examTitle}"`}
            </h1>
          </div>
        </div>
        {step===2 ? (
          <button style={{ ...S.saveBtn, background: accent, opacity: !questions.length||saving?0.5:1 }}
            onClick={handleSaveQuestions} disabled={!questions.length||saving}>
            {saving ? "Saving…" : ` Save ${questions.length} Question(s)`}
          </button>
        ) : <div style={{width:160}}/>}
      </div>

      {success && <div style={S.successBar}>{success}</div>}
      {error   && <div style={S.errorBar}>{error}</div>}

      <div style={S.builderBody}>
        {step===1 && (
          <div style={S.formCard}>
            <h2 style={{ ...S.formCardTitle, color: accent }}>🎓 Final Exam Details</h2>
            <div style={S.formGrid}>
              <div style={S.fieldWrap}>
                <label style={S.fieldLabel}>Exam Title <span style={{color:"#b91c1c"}}>*</span></label>
                <input style={S.formInput} value={form.title}
                  onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Final Exam" />
              </div>
              <div style={S.fieldWrap}>
                <label style={S.fieldLabel}>Time Limit (min)</label>
                <input style={S.formInput} type="number" min="1" value={form.timelimit}
                  onChange={e=>setForm(p=>({...p,timelimit:e.target.value}))} />
              </div>
              <div style={S.fieldWrap}>
                <label style={S.fieldLabel}>Total Questions</label>
                <input style={S.formInput} type="number" min="1" value={form.totalquistions}
                  onChange={e=>setForm(p=>({...p,totalquistions:e.target.value}))} />
              </div>
              <div style={S.fieldWrap}>
                <label style={S.fieldLabel}>Passing Score</label>
                <input style={S.formInput} type="number" min="1" value={form.passingScore}
                  onChange={e=>setForm(p=>({...p,passingScore:e.target.value}))} />
              </div>
            </div>
            <label style={{ ...S.toggleRow, marginTop:8 }}>
              <span style={S.fieldLabel}>Published</span>
              <input type="checkbox" checked={form.Published}
                onChange={e=>setForm(p=>({...p,Published:e.target.checked}))} />
            </label>

            <div style={{marginTop:20}}>
              <button style={{ ...S.saveBtn, background: accent, opacity: !form.title.trim()||creating?0.5:1 }}
                onClick={handleCreateExam} disabled={!form.title.trim()||creating}>
                {creating ? "Creating…" : "Create Exam & Add Questions →"}
              </button>
            </div>

            <div style={{ ...S.infoBox, background:"#fff7ed", borderColor:"#fed7aa" }}>
              <span style={S.infoIcon}>ℹ️</span>
              <span>This final exam will be linked to course <strong>"{course.title}"</strong> (ID: {course.id}).</span>
            </div>
          </div>
        )}

        {step===2 && (
          <div>
            <div style={S.stepNav}>
              <button style={S.stepBackBtn}
                onClick={()=>{ setStep(1); setQuestions([]); setSuccess(""); setError(""); }}>
                ← Edit Exam Info
              </button>
              <div style={S.stepInfo}>
                <span style={{ ...S.pill, background: accent+"22", color: accent }}>Exam ID: {examId}</span>
                <span style={{ ...S.pill, background:"#f1f5f9", color:"#475569" }}>Course: {course.title}</span>
              </div>
            </div>
            <QuestionBuilder questions={questions} setQuestions={setQuestions} accentColor={accent} />
          </div>
        )}
      </div>
    </div>
  );
}


function AddLessonModal({ course, onClose, onSaved }) {
  const [form, setForm] = useState({ title:"", description:"", videoUrl:"", thumbnailUrl:"", preview:false });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const save = async () => {
    if (!form.title.trim()) return;
    setLoading(true); setError("");
    try {
      await axios.post(`${BASE}api/lessons/create`, {
        title:        form.title,
        description:  form.description,
        videoUrl:     form.videoUrl     || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&q=60",
        thumbnailUrl: form.thumbnailUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&q=60",
        duration: 15, lessonOrder: 1,
        instructorid: INSTRUCTOR_ID,
        courseId: course.id,
        Preview: form.preview,
      }, { headers: authH() });
      onSaved(); onClose();
    } catch(e) { console.error(e); setError("Failed to add lesson."); }
    finally { setLoading(false); }
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e=>e.stopPropagation()}>
        <div style={S.modalHead}>
          <h2 style={S.modalTitle}>Add Lesson — {course.title}</h2>
          <button style={S.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={S.modalBody}>
          {error && <div style={S.errorBar}>{error}</div>}
          {[["Title *","title","text","Lesson title…"],["Video URL","videoUrl","text","https://…"],["Thumbnail URL","thumbnailUrl","text","https://…"]].map(([lbl,key,type,ph])=>(
            <div key={key} style={S.fieldWrap}>
              <label style={S.fieldLabel}>{lbl}</label>
              <input style={S.formInput} type={type} value={form[key]} onChange={e=>set(key,e.target.value)} placeholder={ph}/>
            </div>
          ))}
          <div style={S.fieldWrap}>
            <label style={S.fieldLabel}>Description</label>
            <textarea style={{ ...S.formInput, minHeight:72, resize:"vertical" }} value={form.description}
              onChange={e=>set("description",e.target.value)} placeholder="Short description…"/>
          </div>
          <label style={S.toggleRow}>
            <span style={S.fieldLabel}>Free Preview</span>
            <input type="checkbox" checked={form.preview} onChange={e=>set("preview",e.target.checked)}/>
          </label>
        </div>
        <div style={S.modalFoot}>
          <button style={S.ghostBtn} onClick={onClose}>Cancel</button>
          <button style={{ ...S.primaryBtn, opacity:!form.title.trim()||loading?0.6:1 }}
            onClick={save} disabled={!form.title.trim()||loading}>
            {loading?"Adding…":"Add Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}


function LessonsPanel({ course, onAddLesson, onOpenQuiz }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${BASE}api/lessons/course/${course.id}`, { headers: authH() });
      setLessons(Array.isArray(r.data) ? r.data : []);
    } catch(e) { console.error(e); setLessons([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [course.id]);

  const del = async (id) => {
    if (!window.confirm("Delete this lesson?")) return;
    try {
      await axios.delete(`${BASE}api/lessons/delete/${id}?instructorId=${INSTRUCTOR_ID}`, { headers: authH() });
      setLessons(p=>p.filter(l=>l.id!==id));
    } catch(e) { console.log(e);
     }
  };

  if (loading) return <div style={S.panelLoading}>Loading lessons…</div>;

  return (
    <div style={S.lessonsPanel}>
      <div style={S.panelHead}>
        <span style={S.panelCount}>{lessons.length} lesson{lessons.length!==1?"s":""}</span>
        <button style={S.primaryBtn} onClick={()=>onAddLesson(course, fetch)}>+ Add Lesson</button>
      </div>

      {lessons.length===0 ? (
        <div style={S.emptyPanel}>
          <span></span><p>No lessons yet — add the first one!</p>
        </div>
      ) : lessons.map((l, i) => (
        <div key={l.id} style={S.lessonRow}>
          <span style={S.lessonNum}>{i+1}</span>
          <span style={S.lessonTitle}>{l.title}</span>

          <button style={S.quizBtn} onClick={()=>onOpenQuiz(l)} title="Create quiz for this lesson">
             Add Quiz
          </button>

          <button style={S.dangerBtn} onClick={()=>del(l.id)}>🗑</button>
        </div>
      ))}
    </div>
  );
}

export default function Curriculum() {
  const [courses,  setCourses]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [modal,    setModal]    = useState(null);  // { course, onSaved }
  // activePage: null | { type:'quiz', lesson, course } | { type:'exam', course }
  const [activePage, setActivePage] = useState(null);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${BASE}api/courses/my-courses/${INSTRUCTOR_ID}`, { headers: authH() });
      setCourses((Array.isArray(r.data)?r.data:[]).map(c=>({...c,published:!!c.published,free:!!c.free})));
    } catch(e) { console.error(e); setCourses([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadCourses(); }, []);

  const delCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`${BASE}api/courses/delete/${id}`, { headers: authH() });
      setCourses(p=>p.filter(c=>c.id!==id));
      if (expanded===id) setExpanded(null);
    } catch(e) { alert("Failed to delete course."); }
  };

  // Navigate to full-page builders
  if (activePage?.type==="quiz") {
    return <QuizBuilderPage lesson={activePage.lesson} course={activePage.course} onBack={()=>setActivePage(null)} />;
  }
  if (activePage?.type==="exam") {
    return <ExamBuilderPage course={activePage.course} onBack={()=>setActivePage(null)} />;
  }

  return (
    <div style={S.page}>
      {/* Page header */}
      <div style={S.pageHead}>
        <div>
          <h1 style={S.pageTitle}> Curriculum Builder</h1>
          <p style={S.pageSub}>{courses.length} course{courses.length!==1?"s":""}</p>
        </div>
      </div>

      {loading ? (
        <div style={S.center}>Loading courses…</div>
      ) : courses.length===0 ? (
        <div style={S.emptyPage}><span style={{fontSize:44}}></span><p>No courses found.</p></div>
      ) : (
        <div style={S.courseList}>
          {courses.map(c => {
            const lvl = LEVEL_STYLE[c.level] || LEVEL_STYLE.BEGINNER;
            const open = expanded===c.id;
            return (
              <div key={c.id} style={S.courseCard}>
                {/* ── Course row ── */}
                <div style={S.courseRow}>
                  {c.thumbnailUrl && (
                    <div style={S.thumb}><img src={c.thumbnailUrl} alt={c.title} style={S.thumbImg}/></div>
                  )}

                  <div style={S.courseInfo}>
                    <p style={S.courseCat}>{c.category}</p>
                    <h3 style={S.courseTitle}>{c.title}</h3>
                    <div style={S.badges}>
                      <span style={{ ...S.badge, background:c.published?"#dcfce7":"#f1f5f9", color:c.published?"#15803d":"#64748b" }}>
                        {c.published?"● Live":"○ Draft"}
                      </span>
                      {c.level && (
                        <span style={{ ...S.badge, background:lvl.bg, color:lvl.color }}>
                          {LEVEL_LABEL[c.level]||c.level}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={S.courseActions}>
                    <button style={S.primaryBtn} onClick={()=>setExpanded(open?null:c.id)}>
                      {open ? "▲ Hide" : "▼ Lessons"}
                    </button>

                    <button style={S.examBtn} onClick={()=>setActivePage({type:"exam",course:c})}>
                       Final Exam
                    </button>

                    {/* Delete course */}
                    {/* <button style={S.ghostBtn} onClick={()=>delCourse(c.id)} title="Delete course">🗑</button> */}
                  </div>
                </div>

                {/* ── Lessons panel (expanded) ── */}
                {open && (
                  <LessonsPanel
                    course={c}
                    onAddLesson={(course, cb) => setModal({course, onSaved:cb})}
                    onOpenQuiz={(lesson) => setActivePage({type:"quiz", lesson, course:c})}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <AddLessonModal
          course={modal.course}
          onClose={()=>setModal(null)}
          onSaved={modal.onSaved}
        />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   STYLES
════════════════════════════════════════════════════════ */
const S = {
  // Page
  page:      { padding:"24px", maxWidth:1020, margin:"0 auto", fontFamily:"system-ui,sans-serif" },
  pageHead:  { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 },
  pageTitle: { fontSize:26, fontWeight:700, margin:0, color:"#0f172a" },
  pageSub:   { fontSize:14, color:"#64748b", marginTop:4 },
  center:    { textAlign:"center", padding:48, color:"#94a3b8" },
  emptyPage: { textAlign:"center", padding:64, color:"#94a3b8", display:"flex", flexDirection:"column", alignItems:"center", gap:12 },

  // Course list
  courseList:  { display:"flex", flexDirection:"column", gap:16 },
  courseCard:  { border:"1px solid #e2e8f0", borderRadius:14, overflow:"hidden", background:"#fff", boxShadow:"0 2px 8px rgba(0,0,0,.06)" },
  courseRow:   { display:"flex", alignItems:"center", gap:14, padding:"16px 20px", flexWrap:"wrap" },
  thumb:       { width:88, height:60, borderRadius:8, overflow:"hidden", flexShrink:0 },
  thumbImg:    { width:"100%", height:"100%", objectFit:"cover" },
  courseInfo:  { flex:1, minWidth:180 },
  courseCat:   { fontSize:11, color:"#94a3b8", textTransform:"uppercase", letterSpacing:1, margin:0 },
  courseTitle: { fontSize:16, fontWeight:700, margin:"2px 0 8px", color:"#1e293b" },
  badges:      { display:"flex", gap:8, flexWrap:"wrap" },
  badge:       { fontSize:12, fontWeight:600, padding:"2px 10px", borderRadius:99 },
  courseActions:{ display:"flex", gap:8, flexShrink:0, flexWrap:"wrap" },

  // Lessons panel
  lessonsPanel: { borderTop:"1px solid #e2e8f0", background:"#f8fafc", padding:"16px 20px" },
  panelHead:    { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 },
  panelCount:   { fontSize:13, color:"#64748b", fontWeight:600 },
  panelLoading: { padding:16, color:"#94a3b8", fontSize:14 },
  emptyPanel:   { textAlign:"center", padding:24, color:"#94a3b8", display:"flex", flexDirection:"column", alignItems:"center", gap:6 },
  lessonRow:    { display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, marginBottom:8 },
  lessonNum:    { width:26, height:26, borderRadius:"50%", background:"#e2e8f0", color:"#475569", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 },
  lessonTitle:  { flex:1, fontSize:14, fontWeight:500, color:"#1e293b" },

  // Buttons
  primaryBtn: { padding:"7px 16px", background:"#1d4ed8", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 },
  ghostBtn:   { padding:"7px 14px", background:"transparent", color:"#475569", border:"1px solid #cbd5e1", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 },
  dangerBtn:  { padding:"6px 12px", background:"#fee2e2", color:"#b91c1c", border:"1px solid #fca5a5", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600 },
  quizBtn:    { padding:"6px 14px", background:"#f3e8ff", color:"#7c3aed", border:"1px solid #c4b5fd", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:700 },
  examBtn:    { padding:"7px 16px", background:"#fff7ed", color:"#b45309", border:"1px solid #fed7aa", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:700 },
  saveBtn:    { padding:"10px 22px", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontSize:14, fontWeight:700 },
  stepBackBtn:{ padding:"6px 14px", background:"transparent", color:"#64748b", border:"1px solid #e2e8f0", borderRadius:8, cursor:"pointer", fontSize:13 },

  // Modal
  overlay:   { position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 },
  modal:     { background:"#fff", borderRadius:16, width:"100%", maxWidth:500, boxShadow:"0 24px 64px rgba(0,0,0,.2)", display:"flex", flexDirection:"column" },
  modalHead: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px 16px", borderBottom:"1px solid #e2e8f0" },
  modalTitle:{ fontSize:17, fontWeight:700, margin:0, color:"#0f172a" },
  closeBtn:  { background:"none", border:"none", fontSize:18, cursor:"pointer", color:"#94a3b8" },
  modalBody: { padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 },
  modalFoot: { display:"flex", gap:8, justifyContent:"flex-end", padding:"16px 24px", borderTop:"1px solid #e2e8f0" },

  // Builder page
  builderPage:{ minHeight:"100vh", background:"#f8fafc", fontFamily:"system-ui,sans-serif" },
  topBar:     { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 28px", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,.06)", position:"sticky", top:0, zIndex:50 },
  backBtn:    { padding:"8px 16px", background:"transparent", color:"#475569", border:"1px solid #cbd5e1", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 },
  topCenter:  { display:"flex", alignItems:"center", gap:12 },
  topIcon:    { fontSize:26 },
  topSub:     { fontSize:11, textTransform:"uppercase", letterSpacing:1, margin:0, fontWeight:700 },
  topTitle:   { fontSize:16, fontWeight:700, color:"#0f172a", margin:0 },
  builderBody:{ maxWidth:800, margin:"0 auto", padding:"28px 24px" },

  // Form card
  formCard:      { background:"#fff", border:"1px solid #e2e8f0", borderRadius:14, padding:"28px", boxShadow:"0 2px 8px rgba(0,0,0,.05)" },
  formCardTitle: { fontSize:18, fontWeight:700, margin:"0 0 20px" },
  formGrid:      { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:12 },
  formInput:     { padding:"9px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14, color:"#1e293b", outline:"none", width:"100%", boxSizing:"border-box" },
  toggleRow:     { display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" },

  // Info box
  infoBox:  { marginTop:16, padding:"12px 16px", background:"#f3e8ff", border:"1px solid #e9d5ff", borderRadius:8, display:"flex", gap:8, alignItems:"flex-start", fontSize:13, color:"#4b5563" },
  infoIcon: { fontSize:16, flexShrink:0 },

  // Step nav
  stepNav:  { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 },
  stepInfo: { display:"flex", gap:8 },
  pill:     { fontSize:12, fontWeight:600, padding:"4px 12px", borderRadius:99, display:"inline-block" },

  // Shared fields
  fieldWrap: { display:"flex", flexDirection:"column", gap:5 },
  fieldLabel:{ fontSize:12, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:0.4 },

  // Question builder
  emptyQ:     { textAlign:"center", padding:"40px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:8 },
  emptyQIcon: { fontSize:44 },
  emptyQTitle:{ fontSize:18, fontWeight:700, color:"#1e293b", margin:0 },
  emptyQSub:  { fontSize:14, color:"#94a3b8", margin:0 },

  qCard:     { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"20px 22px", marginBottom:18, boxShadow:"0 2px 6px rgba(0,0,0,.04)" },
  qCardHead: { display:"flex", alignItems:"center", gap:10, marginBottom:16, flexWrap:"wrap" },
  qBadge:    { width:32, height:32, borderRadius:"50%", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, flexShrink:0 },
  typePills: { display:"flex", gap:6, flex:1 },
  typePill:  { padding:"5px 14px", background:"#f1f5f9", color:"#475569", border:"1px solid #e2e8f0", borderRadius:99, cursor:"pointer", fontSize:12, fontWeight:600 },
  removeQBtn:{ padding:"5px 12px", background:"#fee2e2", color:"#b91c1c", border:"1px solid #fca5a5", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600 },

  qTextarea: { padding:"10px 14px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14, color:"#1e293b", resize:"vertical", minHeight:74, outline:"none", width:"100%", boxSizing:"border-box" },
  ansRow:    { display:"flex", alignItems:"center", gap:8, marginTop:6 },
  ansBullet: { width:26, height:26, borderRadius:"50%", background:"#f1f5f9", color:"#64748b", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 },
  ansInput:  { flex:1, padding:"8px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:13, color:"#1e293b", outline:"none" },
  correctBtn:{ width:28, height:28, borderRadius:"50%", cursor:"pointer", fontSize:14, fontWeight:700, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" },
  correctHint:{ fontSize:12, color:"#b45309", marginTop:6, margin:0 },
  pointsWrap:{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 },
  pointsInput:{ width:52, padding:"4px 6px", border:"1px solid #d1d5db", borderRadius:6, fontSize:13, textAlign:"center", outline:"none" },
  removeABtn:{ padding:"4px 8px", background:"#fff", color:"#94a3b8", border:"1px solid #e2e8f0", borderRadius:6, cursor:"pointer", fontSize:12 },
  addABtn:   { padding:"6px 14px", background:"#f8fafc", color:"#475569", border:"1px dashed #cbd5e1", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600, alignSelf:"flex-start", marginTop:8 },
  addQBtn:   { display:"block", width:"100%", padding:"14px", borderRadius:12, cursor:"pointer", fontSize:14, fontWeight:700, marginTop:10 },

  // Banners
  successBar: { margin:"14px 28px 0", padding:"12px 16px", background:"#dcfce7", color:"#15803d", borderRadius:8, fontSize:14, fontWeight:600 },
  errorBar:   { margin:"14px 28px 0", padding:"12px 16px", background:"#fee2e2", color:"#b91c1c", borderRadius:8, fontSize:14 },
};
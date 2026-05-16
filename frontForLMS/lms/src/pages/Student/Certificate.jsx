import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
// import "./pages.css";
import BASE_URL from "../../config/url";
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ── Single certificate card (printable) ── */
function CertCard({ cert }) {
  const cardRef = useRef(null);

  const handlePrint = () => {
    const el = cardRef.current;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Certificate</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');
            body {
              margin: 0;
              background: #fff;
              display: flex;
              justify-content: center;
              padding: 40px;
            }
          </style>
        </head>
        <body>${el.outerHTML}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Certificate — ${cert.course.title}`,
        url: `/certificate/${cert.id}`,
      });
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/certificate/${cert.id}`
      );
      alert("Certificate link copied to clipboard!");
    }
  };

  return (
    <div className="cert-wrap">
      <div className="cert-card" ref={cardRef}>
        <span className="cert-corner cert-corner--tl" />
        <span className="cert-corner cert-corner--tr" />
        <span className="cert-corner cert-corner--bl" />
        <span className="cert-corner cert-corner--br" />

        <div className="cert-issuer">
          <span className="cert-issuer__logo">🎓</span>
          <span className="cert-issuer__name">LMS Platform</span>
        </div>

        <p className="cert-subtitle">Certificate of Completion</p>
        <div className="cert-divider" />

        <p className="cert-presented">This is proudly presented to</p>
        <h2 className="cert-student">
          {cert.student.firstName} {cert.student.lastName}
        </h2>

        <p className="cert-body">For successfully completing the course</p>
        <h3 className="cert-course">{cert.course.title}</h3>

        <p className="cert-score-line">
          with a final score of{" "}
          <span className="cert-score">{cert.finalScore}%</span>
        </p>

        <div className="cert-meta-row">
          <div className="cert-meta-item">
            <span className="cert-meta-label">Issued</span>
            <span className="cert-meta-val">
              {formatDate(cert.issuedAt)}
            </span>
          </div>
        </div>

        <div className="cert-divider" />

        <div className="cert-footer-row">
          <div className="cert-code">
            <span className="cert-code__label">Certificate ID</span>
            <span className="cert-code__val">{cert.certificateCode}</span>
          </div>
          {cert.valid && <span className="cert-valid-badge">✓ Verified</span>}
        </div>
      </div>

      <div className="cert-actions">
        <button className="cert-btn cert-btn--primary" onClick={handlePrint}>
          ⬇ Download / Print
        </button>
        <button className="cert-btn cert-btn--ghost" onClick={handleShare}>
          ↗ Share Certificate
        </button>
        <a
          href={`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            window.location.origin + "/certificate/" + cert.id
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cert-btn cert-btn--linkedin"
        >
          in Add to LinkedIn
        </a>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function Certificate() {
  const [certificates, setCertificates] = useState([]);
  const [selected, setSelected] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCertificates = async () => {
      const res = await axios.get(
        `${BASE_URL}api/certificates`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔄 mapping API → UI model
      const mapped = res.data.map((c) => {
        const [firstName, ...rest] = c.studentName.split(" ");
        return {
          id: c.id,
          certificateCode: c.certificateCode,
          finalScore: c.finalScore,
          issuedAt: c.issuedAt,
          valid: c.valid,
          student: {
            firstName,
            lastName: rest.join(" "),
          },
          course: {
            title: c.courseTitle,
          },
        };
      });

      setCertificates(mapped);
    };

    fetchCertificates();
  }, [token]);

  if (selected) {
    return (
      <div className="cert-page">
        <div className="cert-page__nav">
          <button
            className="cert-nav-back"
            onClick={() => setSelected(null)}
          >
            ← All Certificates
          </button>
        </div>
        <CertCard cert={selected} />
      </div>
    );
  }

  return (
    <div className="cd-page">
      <div className="db-hero ">
        <h1 className="db-hero__name">My Certificates</h1>
        <p className="catalog-header__sub">
          {certificates.length} certificate
          {certificates.length !== 1 ? "s" : ""} earned
        </p>
      </div>

      <div className="cert-list">
        {certificates.map((cert) => (
          <div key={cert.id} className="cert-list-item">
            <div className="cert-list-item__icon">🏆</div>
            <div className="cert-list-item__info">
              <h3 className="cert-list-item__course">
                {cert.course.title}
              </h3>
              <p className="cert-list-item__meta">
                Score: {cert.finalScore}% ·{" "}
                {formatDate(cert.issuedAt)}
              </p>
              <p className="cert-list-item__code">
                {cert.certificateCode}
              </p>
            </div>
            {cert.valid && (
              <span className="cert-list-item__badge">✓ Valid</span>
            )}
            <button
              className="cert-list-item__view"
              onClick={() => setSelected(cert)}
            >
              View →
            </button>
          </div>
        ))}

        {certificates.length === 0 && (
          <div className="cert-empty">
            <span className="cert-empty__icon">🎓</span>
            <p>Complete a course to earn your first certificate.</p>
          </div>
        )}
      </div>
    </div>
  );
}
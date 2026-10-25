# Portfolify — Part 10: Resume Import, Parsing, and Portfolio Content Extraction

## 1. Architectural Overview

Portfolify's Resume Import workflow allows professionals to securely transform existing resumes into structured, editable portfolios. The architecture prioritizes data privacy, factual accuracy, user control, and zero fabrication.

```
                           [ Upload Resume (PDF, DOCX, TXT) ]
                                          │
                                          ▼
                       [ Step 1: Server-Side Validation ]
                       • File size cap: 5.0 MB
                       • Sanitized file name (anti-traversal)
                       • Magic byte validation (%PDF-, PK\x03\x04)
                       • MIME type consistency
                                          │
                                          ▼
                      [ Step 2: In-Memory Safe Parsing ]
                       • PDF: `unpdf` (in-memory pure JS parser)
                       • DOCX: `mammoth` (safe raw text extraction)
                       • Decompression bomb protection (<= 10MB chars)
                       • Scanned doc detection (alphanumeric >= 40)
                                          │
                                          ▼
                   [ Step 3: Deterministic Segmentation ]
                       • Unicode normalization & bullet cleanup
                       • Profile: Name, Headline, Bio, Links
                       • Work Experience: Company, Role, Dates, Bullets
                       • Education: Institution, Degree, Major, Years
                       • Skills: Deduplicated technical & core skills
                       • Projects: Title, Desc, Tech stack, URLs
                                          │
                                          ▼
                   [ Step 4: Section-by-Section Review ]
                       • Interactive review UI (`ResumeReviewEditor`)
                       • Toggle inclusion / exclusion per entry
                       • Inline field editing & item deletion
                       • Optional AI tone polish (Gemini grounded)
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    ▼                                           ▼
          [ New Portfolio Setup ]                    [ Existing Portfolio Merge ]
      • Choose registered template                • Selective section strategies:
        (minimal, dev-pro, signature, reimagined)   - Profile: fill-missing / replace / keep
      • Live interactive renderer preview          - Skills: append (deduped) / replace / keep
      • Desktop / mobile viewport switch          - Experience: append / replace / keep
      • Save draft to localStorage / API          - Projects: append / replace / keep
                    │                                           │
                    └─────────────────────┬─────────────────────┘
                                          │
                                          ▼
                        [ Studio Visual Editor (`/editor`) ]
                        • Full live preview sync
                        • Durable SQLite backend persistence
```

---

## 2. Supported File Formats & Upload Limits

| Format | Extension | Magic Bytes Signature | Parser Engine | Maximum Size |
| :--- | :--- | :--- | :--- | :--- |
| **PDF** | `.pdf` | `%PDF-` (`0x25 0x50 0x44 0x46`) | `unpdf` | 5.0 MB |
| **Word** | `.docx` | `PK\x03\x04` (`0x50 0x4B 0x03 0x04`) | `mammoth` | 5.0 MB |
| **Plain Text** | `.txt`, `.md` | Non-binary, no null bytes | In-Memory UTF-8 | 5.0 MB |

### Explicitly Unsupported Formats
- Legacy binary `.doc` (Word 97–2003): Incompatible with safe in-memory modern parsers; rejected upfront.
- Rich Text Format (`.rtf`) and OpenDocument (`.odt`): Excluded to prevent unverified conversion pipelines.
- Image-only scans (`.png`, `.jpg`): Rejected honestly with `IMAGE_ONLY_DOCUMENT` error (see OCR Limitations below).

---

## 3. Security, Privacy & Retention Policy

### In-Memory RAM Processing
- Resumes are processed strictly in Node.js server RAM during the request lifecycle.
- Files are **never written to disk** or uploaded to public S3/GCS storage buckets.
- Memory buffers are freed immediately after extraction.

### Decompression & Resource Limits
- ZIP / DOCX expansion is bounded by a character threshold (`MAX_UNCOMPRESSED_CHARS = 10,000,000`) to neutralize ZIP bombs.
- Document parsing operations have a 15-second safety timeout.

### Path Traversal & Sanitization
- User-supplied filenames are sanitized through `sanitizeFileName` to strip directory separators (`/`, `\`), path traversal patterns (`../`), and null bytes (`\0`).

### Prompt Injection Defense
- Resume content is treated as untrusted data.
- System instructions and user prompts are structurally delimited in the AI service. The model is explicitly commanded to extract only verifiable facts and never follow instructions found within document text.

---

## 4. Factual Grounding & Anti-Hallucination Rules

Portfolify enforces strict factual extraction:
1. **No Fabricated Facts**: Portfolify never invents employers, job titles, employment dates, degrees, certifications, metrics, or technologies.
2. **Missing Fields Remain Missing**: If a resume omits graduation dates, GPA, or project links, they remain empty strings or empty arrays.
3. **Deterministic First**: Extraction operates 100% deterministically using regex and heuristic segmentation. The workflow does not require an AI API key to parse resumes.
4. **Optional AI Polish**: When the user requests AI rewriting for a section, the model is bound by negative constraints forbidding the introduction of unstated accomplishments or altered timelines.

---

## 5. Review & Correction Interface

The review interface (`ResumeReviewEditor`) provides granular control before any content touches a portfolio:
- **Include / Exclude Toggles**: Users can deselect entire roles, degrees, or individual skills with a single click.
- **Inline Value Editing**: Fix OCR typos, adjust dates, or refine descriptions.
- **Add / Remove Items**: Add newly remembered projects or remove outdated tenures.
- **AI Tone Polish**: Polish wording into concise portfolio descriptions while preserving original facts.

---

## 6. Portfolio Schema Mapping & Merging

Data is mapped directly to the canonical `PortfolioData` schema (`src/lib/schema/portfolio.ts`):

### New Portfolio Flow
- Generates a valid portfolio draft with approved skills, experience, education, projects, and social links.
- Users choose any of Portfolify's 4 registered templates (`minimal-portfolio`, `developer-pro`, `signature`, `reimagined`) with an interactive live preview before opening Studio.

### Existing Portfolio Merge Flow
When importing into an active Studio portfolio, silent overwrites are strictly forbidden. Users choose fine-grained strategies:
- **Profile Strategy**: `fill-missing` (safely fills empty fields), `replace` (overwrites profile with resume values), or `keep` (leaves profile untouched).
- **Skills Strategy**: `append` (merges new skills while deduplicating existing names case-insensitively), `replace`, or `keep`.
- **Experience Strategy**: `append` (appends new companies/roles without duplicating identical tenures), `replace`, or `keep`.
- **Education Strategy**: `append`, `replace`, or `keep`.
- **Projects Strategy**: `append`, `replace`, or `keep`.

---

## 7. OCR Limitations & Honest Error Handling

### Scanned Document Policy
Portfolify does not perform speculative OCR on image-only documents. Unreliable OCR frequently introduces garbled text, false credentials, and distorted numbers.

When an uploaded document contains fewer than 40 alphanumeric characters:
- The system returns `IMAGE_ONLY_DOCUMENT` or `EMPTY_DOCUMENT`.
- The user is shown an honest explanatory notification:
  > *"Scanned document or image-only PDF detected. This document does not contain readable digital text. Please upload a digital PDF, Word document, or enter details manually."*

---

## 8. Verification & Test Commands

All test suites can be executed via Vitest:

```bash
# Run resume-import unit tests
npx vitest run src/lib/resume-import/file-validator.test.ts
npx vitest run src/lib/resume-import/resume-segmenter.test.ts
npx vitest run src/lib/resume-import/resume-service.test.ts

# Run resume API integration tests
npx vitest run src/app/api/resume/resume-api.test.ts

# Run complete test suite (19 test files, 181 tests)
npm test

# Run TypeScript compilation check
npx tsc --noEmit

# Run ESLint check
npm run lint

# Run Next.js production build
npm run build
```

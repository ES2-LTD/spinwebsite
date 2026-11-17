# Workshop Registration Report

**Event:** Regional Workshop on National Water Compact for Nigeria
**Organizer:** Federal Ministry of Water Resources and Sanitation (FMWRS) — SPIN Project
**Date:** 27th August, 2026 | **Venue:** 1 Aguiyi Ironsi Street, Maitama, Abuja | **Time:** 10:00 AM

---

## 1. Dataset Overview

| Metric | Value |
|---|---|
| Raw records (Registrations sheet) | 285 |
| Records removed (test entries) | 6 |
| **Clean records** | **279** |
| Unique registrants (name + phone) | 275 |
| Unique organizations (case-insensitive) | 193 |
| Registration window | 25 Aug 2026 19:38 – 27 Aug 2026 14:49 |
| Official check-ins (QR system) | 6 of 279 (2.2%) |

## 2. Cleaning Actions Performed

### 2.1 Test data removed (6 rows)

| Registration ID | Full Name | Email | Phone |
|---|---|---|---|
| SPIN-REG-202608-0001 | Test User | test@test.com | 1234567890 |
| SPIN-REG-202608-0002 | Test User | test@example.com | 1234567890 |
| SPIN-REG-202608-0003 | Yusuf | saif28ksl@gmail.com | 90000 |
| SPIN-REG-202608-0004 | Saif | clevercodes.yusuf@gmail.com | 809394 |
| SPIN-REG-202608-0005 | Test Live | testlive@example.com | 8012345678 |
| SPIN-REG-202608-0006 | Test No CT | testnoct@example.com | 8099999999 |

### 2.2 Organization normalization — SPIN variants → `SPIN PROJECT`

20 records updated:

| Original value | Count |
|---|---|
| SPIN | 8 |
| SPIN Project | 4 |
| Spin project | 3 |
| Sustainable Power and Irrigation for Nigeria (SPIN Project) | 1 |
| Sustainable Power and Irrigation for Nigeria (SPIN) | 1 |
| SPIN, Abuja | 1 |
| Sustainable Power and Irrigation for Nigeria (SPIN)Project | 1 |
| SpIn project | 1 |

> Left unchanged (intentional): `FMWR/SPIN`, `SPIN safeguards` — they carry extra unit/partner context.

### 2.3 Email typos fixed

2 records updated:

| Registration ID | Full Name | Email (as registered) | Fixed to |
|---|---|---|---|
| SPIN-REG-202608-0096 | Add Prof. Bertha Abdu Danja | abdulonis@yahoo.comm0i | abdulonis@yahoo.com |
| SPIN-REG-202608-0136 | Mailafiya Danlami Hassana | mailafiyahassana@yooh.com | mailafiyahassana@yahoo.com |

### 2.4 Left as-is (per review decision)

- Phone numbers — mixed formats retained (10-digit without leading 0, `234`-prefixed, etc.)
- Designations — kept exactly as typed by registrants
- Full names — kept as typed
- Duplicate registrations (same name + phone, different email) — kept, listed in §5

## 3. Registration Timeline

| Date | Registrations |
|---|---|
| Tuesday, 25 Aug 2026 | 1 |
| Wednesday, 26 Aug 2026 | 4 |
| Thursday, 27 Aug 2026 | 274 |

## 4. Official Check-Ins (QR System)

| Registration ID | Full Name | Organization | Check-in Time | Method |
|---|---|---|---|---|
| SPIN-REG-202608-0007 | Adam Yusuf | SPIN PROJECT | 25 Aug 19:53 | QR Scan |
| SPIN-REG-202608-0008 | HYELAKUMA IBRAHIM DIBAL | SPIN PROJECT | 26 Aug 16:22 | QR Scan |
| SPIN-REG-202608-0009 | Garba Joy | SPIN PROJECT | 26 Aug 17:15 | QR Scan |
| SPIN-REG-202608-0010 | Ebuka Daniel Umolu | SPIN PROJECT | 26 Aug 17:17 | QR Scan |
| SPIN-REG-202608-0013 | Titus Solomon | Min for Rural Infrastructure and Community Development | 27 Aug 08:41 | QR Scan |
| SPIN-REG-202608-0016 | Yusuf Lakwanjang Jalingo | Ministry of Environment and Forest Resources | 27 Aug 08:46 | QR Scan |

> **Note:** The QR check-in station captured only a small share of attendees; most participants
> were recorded on the physical/other attendance channels. The `Attendance` sheet in the source
> workbook is empty (headers only). For a true attendance figure, reconcile with the manual
> sign-in sheet.

## 5. Data Quality Notes (retained, for awareness)

### 5.1 Repeat registrations (kept per decision — same person, two entries)

| Full Name | Phone | Registration IDs | Emails |
|---|---|---|---|
| Halimatu Sadiya Muhammad | 8165460557 | SPIN-REG-202608-0138, SPIN-REG-202608-0180 | limadiyya07@gmail.com, tplhalima22@gmail.com |
| Mailafiya Danlami Hassana | 9057525905 | SPIN-REG-202608-0136, SPIN-REG-202608-0268 | mailafiyahassana@yahoo.com, mailafiyahassana@yahoo.com |
| Oghenetanure Evwierhoma | 8128797802 | SPIN-REG-202608-0116, SPIN-REG-202608-0122 | tanureevwierhoma@gmail.com, qtentertainment012@gmail.com |
| Patience  m odoh | 8065914407 | SPIN-REG-202608-0231, SPIN-REG-202608-0237 | patencemodoh@gmail.com, patiencemodoh@gmail.com |

### 5.2 Phone number lengths

| Digits | Count |
|---|---|
| 7 | 1 |
| 9 | 1 |
| 10 | 263 |
| 11 | 2 |
| 12 | 2 |
| 13 | 10 |

## 6. Top Organizations by Registrations

Counts are case-insensitive (e.g. `Ministry of Water Resources` and `Ministry of water resources` count together).

| Organization | Count |
|---|---|
| SPIN PROJECT | 23 |
| Federal Ministry of Water Resources and Sanitation | 13 |
| Ministry of Water Resources | 10 |
| Ministry of Health | 5 |
| FMWR&S | 5 |
| Ministry of Agriculture | 4 |
| FMWRS | 4 |
| Water Resources | 3 |
| SURWASH | 3 |
| Federal Ministry of Water Resources | 3 |
| Ministry of women Affairs | 3 |
| FCDA | 3 |
| FRCN | 3 |
| Federal Capital Territory Administration | 3 |

---

*Cleaned data file: `docs/Workshop_Registration_Clean.xlsx` — sheets: Registrations (279 rows), Attendance (headers only).*
*Generated: 29 Aug 2026*

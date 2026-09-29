/**
 * FAQ copy shared by the home page, /faq and the Tiruppur landing page (and their FAQPage JSON-LD).
 * Answers avoid figures that must come from the school (fees, exact timings, ratios) — those
 * are handled by the team directly, so nothing here can go stale or be wrong.
 */
export type Faq = { q: string; a: string };

export const ADMISSION_FAQS: Faq[] = [
  { q: "What age should my child be to join Little Mahilam?", a: "We welcome children from about 2 years in Play Group, then Pre-KG (3–4 years), LKG (4–5 years), UKG (5–6 years) and Grades 1 to 3. Our team will confirm the right class for your child's date of birth." },
  { q: "How do I apply for admission?", a: "Send an enquiry through our Admissions page or call the school. We'll arrange a campus visit, answer your questions and guide you through the application, documents and fee process." },
  { q: "Are admissions open now?", a: "Admissions are subject to seat availability in each class. Send an enquiry and our team will tell you which classes currently have seats and when you can visit." },
  { q: "What documents are needed for admission?", a: "Typically a birth certificate, recent passport-size photographs, address proof and parent ID. Our admissions team shares the exact checklist for your child's class during your visit." },
  { q: "What are the school fees?", a: "Fees depend on the class and are shared personally by our admissions team, together with any sibling or early-admission considerations. Please enquire or call the school for the current fee structure." },
];

export const LEARNING_FAQS: Faq[] = [
  { q: "What teaching method does Little Mahilam follow?", a: "We follow a child-centric, play-way approach built on the theory of multiple intelligences. Children learn through stories, songs, art, movement, hands-on activities and conversation rather than rote memorisation." },
  { q: "Will my child be ready for primary school?", a: "Yes. Alongside play, children build strong foundations in early literacy, numeracy, communication and independence, so they move into Grade 1 confident and excited to learn." },
  { q: "What activities do children do every day?", a: "A typical day mixes circle time, stories and phonics, art and craft, music and movement, puzzles, outdoor play and quiet time — balanced to each age group." },
];

export const CAMPUS_FAQS: Faq[] = [
  { q: "Where is Little Mahilam Preschool located?", a: "We are at 56/11A, 2nd Street, Amarjothi AS Nagar, Kangayam Road, Valliammai Nagar, Tiruppur, Tamil Nadu 641604 — easy to reach from across Tiruppur." },
  { q: "Can I visit the school before applying?", a: "Absolutely — we encourage it. Book a campus visit through our Contact page so a member of our team can show you around and meet your child." },
  { q: "Is the campus safe for young children?", a: "Our spaces are designed around young learners, with child-friendly classrooms and play areas, supervised routines and safe drop-off and pick-up." },
  { q: "How do parents stay informed?", a: "We keep families updated through announcements, events, parent meetings and direct communication from teachers." },
];

export const ALL_FAQS = { Admissions: ADMISSION_FAQS, "Learning & curriculum": LEARNING_FAQS, "Campus & visits": CAMPUS_FAQS } as const;

export const HOME_FAQS: Faq[] = [ADMISSION_FAQS[0], LEARNING_FAQS[0], CAMPUS_FAQS[0], ADMISSION_FAQS[1], CAMPUS_FAQS[1]];

import React, { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  X,
} from "lucide-react";
import { get, post, patch, remove, uploadFile, downloadFile } from "./services/api";
import { toast } from "sonner";

const fallbackImage =
  "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1000&q=85";
const navItems = [
  ["About", "/about"],
  ["Doctors", "/doctors"],
  ["Services", "/services"],
  ["Gallery", "/gallery"],
  ["Journal", "/blog"],
  ["Contact", "/contact"],
  ["Patient portal", "/patient/login"],
  ["Main Doctor login", "/admin/login"],
  ["Doctor login", "/doctor/login"],
];
function useData(path, initial = []) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    get(path)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [path]);
  return { data, loading };
}
function clearAuth() {
  localStorage.removeItem("lumina_token");
  localStorage.removeItem("lumina_role");
  localStorage.removeItem("doctor_id");
}
function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="wrap nav">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Sparkles size={17} />
          </span>
          <span>
            Medico<small>Dental Care</small>
          </span>
        </Link>
        <nav className={open ? "nav-links open" : "nav-links"}>
          {navItems.map(([label, path]) => (
            <NavLink key={path} to={path} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-actions">
          <Link className="button button-small" to="/appointment">
            Book a visit <ArrowRight size={16} />
          </Link>
          <button
            className="icon-button menu-button"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
function Footer() {
  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <Link to="/" className="brand">
            <span className="brand-mark">
              <Sparkles size={17} />
            </span>
            <span>
              Medico<small>Dental Care</small>
            </span>
          </Link>
          <p className="muted footer-copy">
            Professional dental care for healthier, happier lives in Dhaka.
          </p>
          <div className="socials">
            <Instagram size={17} />
            <span>Visit Medico Dental Care</span>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/about">Our story</Link>
          <Link to="/doctors">Meet the team</Link>
          <Link to="/services">Treatments</Link>
          <Link to="/blog">Dental journal</Link>
        </div>
        <div>
          <h4>Visit us</h4>
          <p>
            10 Kadamtala 1st Ln
            <br />
            Dhaka 1214
          </p>
          <p>Contact us for opening hours</p>
        </div>
        <div>
          <h4>Get in touch</h4>
          <a href="tel:+8801718202861">
            <Phone size={15} /> 01718202861
          </a>
          <a href="tel:+8801718202861">
            <Mail size={15} /> Call Medico Dental Care
          </a>
          <Link className="button button-dark footer-button" to="/appointment">
            Schedule care <ArrowRight size={15} />
          </Link>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Medico Dental Care</span>
        <span>Privacy · Accessibility · Terms</span>
      </div>
    </footer>
  );
}
function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <MobileActionBar />
      <Footer />
    </>
  );
}
function MobileActionBar() {
  return (
    <div className="mobile-action-bar">
      <a href="tel:+8801718202861">
        <Phone size={16} /> Call
      </a>
      <Link to="/appointment">
        <CalendarDays size={16} /> Book Appointment
      </Link>
    </div>
  );
}
function SectionHeading({ eyebrow, title, copy, action }) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      {copy && <p>{copy}</p>}
      {action}
    </div>
  );
}
function Image({ src, alt, className = "" }) {
  return (
    <img
      className={className}
      src={src || fallbackImage}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        e.currentTarget.src = fallbackImage;
      }}
    />
  );
}
function Home() {
  const services = useData("/services");
  const doctors = useData("/doctors");
  const reviews = useData("/reviews");
  const blogs = useData("/blogs");
  return (
    <Layout>
      <main>
        <section className="hero">
          <div className="hero-wash"></div>
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <div className="eyebrow light">Precision care. Human warmth.</div>
              <h1>
                Your best smile starts <em>here.</em>
              </h1>
              <p>
                A calm, modern dental experience where advanced care meets the
                kind of attention that makes you feel at home.
              </p>
              <div className="hero-buttons">
                <Link className="button button-light" to="/appointment">
                  Book an appointment <ArrowRight size={17} />
                </Link>
                <Link className="button button-ghost" to="/services">
                  Explore treatments
                </Link>
              </div>
              <div className="hero-trust">
                <div className="avatar-stack">
                  <span>J</span>
                  <span>M</span>
                  <span>A</span>
                  <span>+</span>
                </div>
                <span>Trusted by families across Dhaka</span>
              </div>
            </div>
            <div className="hero-visual">
              <Image
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=85"
                alt="Dentist consulting with patient"
              />
              <div className="floating-note">
                <div className="note-icon">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <strong>Gentle by design</strong>
                  <span>98% patient satisfaction</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="stats wrap">
          <div>
            <strong>15+</strong>
            <span>years of trusted care</span>
          </div>
          <div>
            <strong>2k+</strong>
            <span>smiles transformed</span>
          </div>
          <div>
            <strong>4.9</strong>
            <span>
              <Star size={14} fill="currentColor" /> patient rating
            </span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>emergency guidance</span>
          </div>
        </section>
        <section className="section wrap">
          <SectionHeading
            eyebrow="Care, considered"
            title="A better kind of dental visit"
            copy="From your first hello to your final follow-up, every detail is designed to make care feel simple."
            action={
              <Link className="arrow-link" to="/about">
                Why Medico <ArrowRight size={16} />
              </Link>
            }
          />
          <div className="feature-grid">
            <Feature
              icon={<ShieldCheck />}
              title="Clinically excellent"
              copy="Evidence-led treatment, advanced technology, and a team that never stops learning."
            />
            <Feature
              icon={<Sparkles />}
              title="Comfort first"
              copy="A welcoming space and unhurried care designed around how you want to feel."
            />
            <Feature
              icon={<Stethoscope />}
              title="Whole-person care"
              copy="We look beyond the appointment to help you protect your smile for life."
            />
          </div>
        </section>
        <section className="section section-tint">
          <div className="wrap">
            <SectionHeading
              eyebrow="Our treatments"
              title="Care for every chapter"
              copy="Thoughtfully tailored dentistry, from everyday prevention to complete smile transformations."
              action={
                <Link className="arrow-link" to="/services">
                  View all services <ArrowRight size={16} />
                </Link>
              }
            />
            <div className="service-grid">
              {services.loading ? (
                <LoadingCards count={3} />
              ) : (
                services.data
                  .slice(0, 3)
                  .map((service) => (
                    <ServiceCard key={service._id} service={service} />
                  ))
              )}
            </div>
          </div>
        </section>
        <section className="section wrap doctor-band">
          <div className="doctor-image">
            <Image
              src="https://images.unsplash.com/photo-1559839734-2b71ae?auto=format&fit=crop&w=800&q=85"
              alt="Doctor in clinic"
            />
          </div>
          <div className="doctor-copy">
            <div className="eyebrow">People make the practice</div>
            <h2>Meet the team behind your care.</h2>
            <p>
              Warm, experienced, and endlessly curious. Our clinicians combine
              deep expertise with a personal approach that puts you at ease.
            </p>
            <Link className="button button-dark" to="/doctors">
              Meet our doctors <ArrowRight size={16} />
            </Link>
          </div>
        </section>
        <section className="section section-dark">
          <div className="wrap">
            <SectionHeading
              eyebrow="Patient stories"
              title="The kind words say it best"
            />
            <div className="review-grid">
              {reviews.loading ? (
                <LoadingCards count={3} />
              ) : (
                reviews.data
                  .slice(0, 3)
                  .map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))
              )}
            </div>
          </div>
        </section>
        <section className="section wrap">
          <SectionHeading
            eyebrow="From the journal"
            title="Small notes for a healthier smile"
            action={
              <Link className="arrow-link" to="/blog">
                Read the journal <ArrowRight size={16} />
              </Link>
            }
          />
          <div className="blog-grid">
            {blogs.loading ? (
              <LoadingCards count={3} />
            ) : (
              blogs.data
                .slice(0, 3)
                .map((blog) => <BlogCard key={blog._id} blog={blog} />)
            )}
          </div>
        </section>
        <CTA />
      </main>
    </Layout>
  );
}
function Feature({ icon, title, copy }) {
  return (
    <div className="feature">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{copy}</p>
    </div>
  );
}
function ServiceCard({ service }) {
  return (
    <Link
      to={`/services/${service.slug || service._id}`}
      className="service-card"
    >
      <Image src={service.image} alt={service.name} />
      <div className="service-card-body">
        <div>
          <h3>{service.name}</h3>
          <p>{service.description}</p>
        </div>
        <span className="card-arrow">
          <ArrowRight size={17} />
        </span>
      </div>
      <div className="service-meta">
        <span>{service.duration}</span>
        <strong>${service.price}</strong>
      </div>
    </Link>
  );
}
function ReviewCard({ review }) {
  return (
    <article className="review-card">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={15}
            fill={i <= review.rating ? "currentColor" : "none"}
          />
        ))}
      </div>
      <p>“{review.review}”</p>
      <strong>{review.patientName}</strong>
      <span className="muted">Verified patient</span>
    </article>
  );
}
function BlogCard({ blog }) {
  return (
    <Link className="blog-card" to={`/blog/${blog.slug || blog._id}`}>
      <Image src={blog.image} alt={blog.title} />
      <div className="blog-card-copy">
        <span className="eyebrow">{blog.category}</span>
        <h3>{blog.title}</h3>
        <span className="muted">
          {new Date(blog.createdAt).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
}
function LoadingCards({ count = 3 }) {
  return Array.from({ length: count }, (_, i) => (
    <div className="skeleton" key={i} />
  ));
}
function CTA() {
  return (
    <section className="cta wrap">
      <div>
        <div className="eyebrow light">Ready when you are</div>
        <h2>A healthier smile feels good.</h2>
        <p>
          Take the first step with a complimentary conversation about your
          goals.
        </p>
      </div>
      <Link className="button button-light" to="/appointment">
        Book your visit <ArrowRight size={16} />
      </Link>
    </section>
  );
}
function StandardPage({ title, eyebrow, children }) {
  return (
    <Layout>
      <div className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
        </div>
      </div>
      {children}
    </Layout>
  );
}
function About() {
  return (
    <StandardPage
      eyebrow="Our practice"
      title="Care that feels like it was made for you."
    >
      <section className="section wrap two-col">
        <div>
          <Image
            src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=85"
            alt="Medico Dental Care clinic interior"
          />
        </div>
        <div className="prose">
          <div className="eyebrow">A different kind of dental office</div>
          <h2>Modern medicine. Old-fashioned care.</h2>
          <p>
            We believe a dental practice should be a place you look forward to
            visiting. Medico pairs thoughtful design and leading clinical tools
            with the simple human things: time, listening, and a familiar face.
          </p>
          <p>
            Our mission is to help every patient feel confident in their care
            and their smile. No judgment, no rushed decisions, just clear
            guidance and an exceptional standard of work.
          </p>
          <div className="signature">
            Dr. Maya Chen <span>Founder & lead dentist</span>
          </div>
        </div>
      </section>
      <section className="section section-tint">
        <div className="wrap">
          <SectionHeading
            eyebrow="Our values"
            title="The way care should feel"
          />
          <div className="feature-grid">
            <Feature
              icon={<Sparkles />}
              title="Curious"
              copy="We keep learning, testing, and looking for a better way to serve you."
            />
            <Feature
              icon={<ShieldCheck />}
              title="Clear"
              copy="Honest options and plain-language guidance at every step."
            />
            <Feature
              icon={<HeartIcon />}
              title="Human"
              copy="Your goals, comfort, and time are treated as seriously as your teeth."
            />
          </div>
        </div>
      </section>
    </StandardPage>
  );
}
function HeartIcon() {
  return <span>♡</span>;
}
function Doctors() {
  const { data, loading } = useData("/doctors");
  return (
    <StandardPage
      eyebrow="The people behind your care"
      title="Meet your Medico team."
    >
      <section className="section wrap">
        <p className="intro-copy">
          Experienced clinicians, kind humans, and a team that believes the best
          dentistry starts with a good conversation.
        </p>
        <div className="doctors-grid">
          {loading ? (
            <LoadingCards count={3} />
          ) : (
            data.map((d) => <DoctorCard key={d._id} doctor={d} />)
          )}
        </div>
      </section>
    </StandardPage>
  );
}
function DoctorCard({ doctor }) {
  return (
    <article className="doctor-card">
      <Image src={doctor.image} alt={doctor.name} />
      <div className="doctor-card-body">
        <div className="eyebrow">{doctor.specialization}</div>
        <h3>{doctor.name}</h3>
        <p>{doctor.bio}</p>
        <div className="doctor-details">
          <span>{doctor.degree}</span>
          <span>{doctor.experience} years experience</span>
        </div>
        <Link className="arrow-link" to={`/appointment?doctor=${doctor._id}`}>
          Book with {doctor.name.split(" ")[1] || "doctor"}{" "}
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
function Services() {
  const { data, loading } = useData("/services");
  return (
    <StandardPage
      eyebrow="Thoughtful treatment"
      title="Care that meets you where you are."
    >
      <section className="section wrap">
        <p className="intro-copy">
          Whether it is time for a check-up or a fresh start, we make every
          treatment clear, comfortable, and tailored to your life.
        </p>
        <div className="service-grid service-grid-large">
          {loading ? (
            <LoadingCards count={6} />
          ) : (
            data.map((s) => <ServiceCard key={s._id} service={s} />)
          )}
        </div>
      </section>
    </StandardPage>
  );
}
function ServiceDetails() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  useEffect(() => {
    get(`/services/${slug}`)
      .then(setService)
      .catch(() => {});
  }, [slug]);
  if (!service)
    return (
      <Layout>
        <div className="empty-page">
          <h2>Loading treatment details...</h2>
        </div>
      </Layout>
    );
  return (
    <Layout>
      <section className="detail-hero">
        <div className="wrap detail-grid">
          <div>
            <div className="eyebrow">Treatment guide</div>
            <h1>{service.name}</h1>
            <p>{service.description}</p>
            <div className="detail-meta">
              <span>
                <Clock3 size={16} /> {service.duration}
              </span>
              <span>
                <Sparkles size={16} /> From ${service.price}
              </span>
            </div>
            <Link className="button button-dark" to="/appointment">
              Book this treatment <ArrowRight size={16} />
            </Link>
          </div>
          <Image src={service.image} alt={service.name} />
        </div>
      </section>
      <section className="section wrap two-col">
        <div className="prose">
          <div className="eyebrow">What to expect</div>
          <h2>A clear path to feeling great.</h2>
          <h3>Benefits</h3>
          <ul>
            {(service.benefits || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3>The process</h3>
          <ol>
            {(service.process || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
        <div className="faq">
          <div className="eyebrow">Questions, answered</div>
          {(service.faq || []).map((item) => (
            <details key={item.question}>
              <summary>
                {item.question}
                <ChevronDown size={17} />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </Layout>
  );
}
function Gallery() {
  const { data, loading } = useData("/gallery");
  return (
    <StandardPage eyebrow="A look around" title="A space for better days.">
      <section className="section wrap">
        <div className="gallery-grid">
          {loading ? (
            <LoadingCards count={6} />
          ) : (
            data.map((item) => (
              <figure
                key={item._id}
                className={
                  item.category === "Before & After" ? "gallery-wide" : ""
                }
              >
                <Image src={item.image} alt={item.title} />
                <figcaption>
                  <strong>{item.title}</strong>
                  <span>{item.category}</span>
                </figcaption>
              </figure>
            ))
          )}
        </div>
      </section>
    </StandardPage>
  );
}
function Reviews() {
  const { data, loading } = useData("/reviews");
  return (
    <StandardPage
      eyebrow="Patient stories"
      title="Good care speaks for itself."
    >
      <section className="section wrap">
        <div className="review-wall">
          {loading ? (
            <LoadingCards count={6} />
          ) : (
            data.map((r) => <ReviewCard key={r._id} review={r} />)
          )}
        </div>
      </section>
    </StandardPage>
  );
}
function Blog() {
  const { data, loading } = useData("/blogs");
  return (
    <StandardPage
      eyebrow="The Medico journal"
      title="Practical notes for your smile."
    >
      <section className="section wrap">
        <div className="blog-grid blog-grid-large">
          {loading ? (
            <LoadingCards count={6} />
          ) : (
            data.map((b) => <BlogCard key={b._id} blog={b} />)
          )}
        </div>
      </section>
    </StandardPage>
  );
}
function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  useEffect(() => {
    get(`/blogs/${slug}`)
      .then(setBlog)
      .catch(() => {});
  }, [slug]);
  if (!blog)
    return (
      <Layout>
        <div className="empty-page">
          <h2>Loading article...</h2>
        </div>
      </Layout>
    );
  return (
    <Layout>
      <article className="article">
        <div className="wrap article-head">
          <div className="eyebrow">{blog.category}</div>
          <h1>{blog.title}</h1>
          <p>
            By {blog.author} · {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Image src={blog.image} alt={blog.title} />
        <div className="wrap article-content">
          {blog.content.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>
    </Layout>
  );
}
function Appointment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [slots, setSlots] = useState([]);
  const [saving, setSaving] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  useEffect(() => {
    if (!form.date) { setSlots([]); return; }
    get(`/availability?date=${encodeURIComponent(form.date)}`)
      .then(({ slots: available }) => {
        setSlots(available);
        if (!available.includes(form.time)) setForm((current) => ({ ...current, time: "" }));
      })
      .catch((error) => { setSlots([]); toast.error(error.message); });
  }, [form.date]);
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await post("/appointments", form);
      toast.success("Your appointment request is on its way.");
      navigate("/appointment/success", {
        state: {
          date: form.date,
          time: form.time,
          reason: form.reason,
        },
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <StandardPage
      eyebrow="Your next step"
      title="Let’s find a time that works."
    >
      <section className="section wrap form-layout">
        <div className="form-intro">
          <div className="eyebrow">New patient? Welcome.</div>
          <h2>We’ll take it from here.</h2>
          <p>
            Tell us a little about what you need and our care coordinator will
            be in touch within one business day.
          </p>
          <div className="contact-fact">
            <Phone size={18} />
            <span>
              01718202861
              <br />
              <small>Mon–Fri, 8am–6pm</small>
            </span>
          </div>
          <div className="contact-fact">
            <MapPin size={18} />
            <span>
                  10 Kadamtala 1st Ln
              <br />
                  <small>Dhaka 1214</small>
            </span>
          </div>
        </div>
        <form className="form-card" onSubmit={submit}>
          <div className="form-row">
            <Field label="Your name" name="name" required onChange={change} />
            <Field label="Phone" name="phone" required onChange={change} />
          </div>
          <div className="form-row">
            <Field
              label="Email"
              name="email"
              type="email"
              onChange={change}
            />
            <Field
              label="Preferred date"
              name="date"
              type="date"
              required
              onChange={change}
            />
          </div>
          <Field label="Reason for visit" name="reason" required onChange={change} />
          <label className="field">
            <span>Available time</span>
            <select name="time" value={form.time || ""} required disabled={!form.date || !slots.length} onChange={change}>
              <option value="">{!form.date ? "Choose a date first" : slots.length ? "Select a time" : "No times available"}</option>
              {slots.map((time) => <option key={time} value={time}>{time}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Additional details</span>
            <textarea
              name="message"
              rows="4"
              onChange={change}
              placeholder="Tell us what brings you in..."
            />
          </label>
          <button className="button button-dark full" disabled={saving}>
            {saving ? "Sending request..." : "Request an appointment"}{" "}
            <ArrowRight size={16} />
          </button>
          <small className="form-note">
            By submitting, you agree to be contacted about your appointment.
          </small>
        </form>
      </section>
    </StandardPage>
  );
}
function Field({ label, name, type = "text", required, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} type={type} required={required} onChange={onChange} />
    </label>
  );
}
function Select({ label, name, options, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select name={name} required onChange={onChange}>
        <option value="">Select one</option>
        {options.map((o) => (
          <option value={o._id} key={o._id}>
            {o.name}
          </option>
        ))}
      </select>
    </label>
  );
}
function Success() {
  const { state } = useLocation();
  return (
    <Layout>
      <div className="success-page">
        <div className="success-icon">
          <CheckCircle2 />
        </div>
        <div className="eyebrow">Request received</div>
        <h1>We’ll see you soon.</h1>
        <p>
          Thank you for trusting Medico. Our team will call or email within one
          business day to confirm your visit.
        </p>
        {state && (
          <div className="success-details">
            <strong>Appointment request details</strong>
            <span>{state.date} at {state.time}</span>
            <span>Medico Dental Care</span>
            <span>{state.reason || "Visit request"}</span>
            <span className="status-pill">Pending</span>
          </div>
        )}
        <Link className="button button-dark" to="/">
          Back to home <ArrowRight size={16} />
        </Link>
      </div>
    </Layout>
  );
}
function Contact() {
  const [form, setForm] = useState({});
  const submit = async (e) => {
    e.preventDefault();
    try {
      await post("/contact", form);
      toast.success("Message sent. We will be in touch.");
      e.target.reset();
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <StandardPage eyebrow="We’re here to help" title="Come say hello.">
      <section className="section wrap contact-grid">
        <div className="contact-panel">
          <div className="eyebrow">Medico Dental Care</div>
          <h2>Good questions deserve good answers.</h2>
          <p>
            Call, email, or send a note below. We’re happy to help with
            appointments, insurance, directions, or anything else on your mind.
          </p>
          <div className="contact-fact">
            <MapPin size={18} />
            <span>
              10 Kadamtala 1st Ln
              <br />
              Dhaka 1214
            </span>
          </div>
          <div className="contact-fact">
            <Phone size={18} />
              <span>01718202861</span>
          </div>
          <div className="contact-fact">
            <Mail size={18} />
              <span>Call us for appointments</span>
          </div>
        </div>
        <form className="form-card" onSubmit={submit}>
          <div className="form-row">
            <Field
              label="Name"
              name="name"
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <Field
            label="Phone (optional)"
            name="phone"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <label className="field">
            <span>Message</span>
            <textarea
              name="message"
              rows="6"
              required
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </label>
          <button className="button button-dark full">
            Send message <ArrowRight size={16} />
          </button>
        </form>
      </section>
      <div className="map-placeholder wrap">
        <MapPin size={26} />
        <span>Find Medico Dental Care in Dhaka</span>
        <small>Map integration ready for your Google Maps embed key</small>
      </div>
    </StandardPage>
  );
}
function Login({ doctor = false }) {
  const [form, setForm] = useState({});
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const result = await post(doctor ? "/auth/doctor/login" : "/auth/login", form);
      localStorage.setItem("lumina_token", result.token);
      localStorage.setItem("lumina_role", doctor ? "doctor" : "mainDoctor");
      if (doctor) localStorage.setItem("doctor_id", result.doctor.id);
      else localStorage.removeItem("doctor_id");
      navigate("/doctor");
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <div className="auth-page">
      <Link to="/" className="brand">
        <span className="brand-mark">
          <Sparkles size={17} />
        </span>
        <span>
          Medico<small>Dental Care</small>
        </span>
      </Link>
      <form className="form-card auth-card" onSubmit={submit}>
        <div className="eyebrow">{doctor ? "Doctor access" : "Main Doctor access"}</div>
        <h1>Welcome back.</h1>
        <p className="muted">{doctor ? "Sign in to view patients assigned to you." : "Sign in to manage the chamber."}</p>
        <Field
          label="Email"
          name="email"
          type="email"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="button button-dark full">
          Sign in <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
function PatientAccess({ register = false }) {
  const [form, setForm] = useState({});
  const navigate = useNavigate();
  const submit = async (event) => {
    event.preventDefault();
    try {
      const result = await post(`/auth/patient/${register ? "register" : "login"}`, form);
      localStorage.setItem("lumina_token", result.token);
      localStorage.setItem("lumina_role", "patient");
      navigate("/patient");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  return (
    <div className="auth-page">
      <Link to="/" className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>Medico<small>Dental Care</small></span></Link>
      <form className="form-card auth-card" onSubmit={submit}>
        <div className="eyebrow">Patient access</div>
        <h1>{register ? "Create your account." : "Welcome back."}</h1>
        <p className="muted">{register ? "Keep your appointments and care information together." : "View your appointments and dental care information."}</p>
        {register && <>
          <Field label="Full name" name="name" required onChange={change} />
          <Field label="Phone" name="phone" required onChange={change} />
        </>}
        <Field label="Email" name="email" type="email" required onChange={change} />
        <Field label="Password" name="password" type="password" required onChange={change} />
        {register && <small className="form-note">Use at least 8 characters.</small>}
        <button className="button button-dark full">{register ? "Create account" : "Sign in"} <ArrowRight size={16} /></button>
        <Link className="text-link" to={register ? "/patient/login" : "/patient/register"}>{register ? "Already registered? Sign in" : "New to the patient portal? Create an account"}</Link>
      </form>
    </div>
  );
}
function PatientPortal() {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const load = () => get("/patient/records").then((result) => { setData(result); setForm(result.patient); }).catch(() => { clearAuth(); navigate("/patient/login"); });
  useEffect(() => { load(); }, []);
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const save = async (event) => {
    event.preventDefault();
    try { await patch("/patient/me", form); toast.success("Profile updated"); setEditing(false); load(); }
    catch (error) { toast.error(error.message); }
  };
  if (!data) return <div className="admin-loading">Loading your patient account...</div>;
  const { patient, record, appointments = [], visits = [], documents = [] } = data;
  return <Layout><main className="section wrap patient-portal">
    <div className="patient-profile-head"><div className="eyebrow">Patient portal · {patient.patientId}</div><div className="patient-heading"><div><h1>Hello, {patient.name.split(" ")[0]}.</h1><p>Manage your profile and review your care.</p></div><button className="button button-dark" onClick={() => { clearAuth(); navigate("/patient/login"); }}>Log out</button></div></div>
    <div className="patient-portal-grid">
      <InfoBlock title="Personal information">{editing ? <form className="clinical-form-grid" onSubmit={save}>
        <ClinicalField label="Full name" name="name" value={form.name} onChange={change} required />
        <ClinicalField label="Phone" name="phone" value={form.phone} onChange={change} required />
        <ClinicalField label="Date of birth" name="dateOfBirth" type="date" value={form.dateOfBirth?.slice?.(0, 10)} onChange={change} />
        <ClinicalField label="Age" name="age" type="number" min="0" value={form.age} onChange={change} />
        <label className="field clinical-field"><span>Gender</span><select name="gender" value={form.gender || ""} onChange={change}><option value="">Select</option>{["Male","Female","Other","Prefer not to say"].map((value) => <option key={value}>{value}</option>)}</select></label>
        <ClinicalField label="Address" name="address" value={form.address} onChange={change} />
        <ClinicalField label="Emergency contact" name="emergencyContact" value={form.emergencyContact} onChange={change} />
        <button className="button button-dark">Save profile</button><button type="button" className="button button-ghost-dark" onClick={() => setEditing(false)}>Cancel</button>
      </form> : <><div className="info-grid"><Info label="Patient ID" value={patient.patientId} /><Info label="Email" value={patient.email} /><Info label="Phone" value={patient.phone} /><Info label="Date of birth" value={patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "Not added"} /><Info label="Age" value={patient.age} /><Info label="Gender" value={patient.gender} /><Info label="Address" value={patient.address} /><Info label="Emergency contact" value={patient.emergencyContact} /></div><button className="button button-ghost-dark" onClick={() => setEditing(true)}>Update profile</button></>}</InfoBlock>
      <InfoBlock title="Medical history and current concern"><div className="info-grid"><Info label="Existing conditions" value={record?.medicalHistory?.existingConditions} /><Info label="Allergies" value={record?.medicalHistory?.allergies} /><Info label="Current medications" value={record?.medicalHistory?.currentMedications} /><Info label="Previous surgeries" value={record?.medicalHistory?.previousSurgeries} /><Info label="Previous dental treatment" value={record?.medicalHistory?.previousDentalTreatment} /><Info label="Family history" value={record?.medicalHistory?.familyHistory} /><Info label="Other medical notes" value={record?.medicalHistory?.otherNotes} /><Info label="Current complaint" value={record?.chiefComplaint?.complaint} /><Info label="Symptoms" value={record?.chiefComplaint?.symptoms} /><Info label="Problem duration" value={record?.chiefComplaint?.duration} /></div></InfoBlock>
      <InfoBlock title="Appointments">{appointments.length ? <div className="record-list">{appointments.map((appointment) => <div className="record-item" key={appointment._id}><strong>{new Date(appointment.date).toLocaleDateString()} · {appointment.time}</strong><span>{appointment.reason || appointment.service?.name || "Chamber appointment"} · {appointment.status}</span></div>)}</div> : <p className="muted">No appointments yet.</p>}<Link className="button button-dark" to="/appointment">Book an appointment <ArrowRight size={15} /></Link></InfoBlock>
      <InfoBlock title="Medical and dental history"><div className="record-list">{(record?.toothFindings || []).map((finding) => <div className="record-item" key={finding._id}><strong>Tooth {finding.toothNumber} · {finding.problem || "Finding"}</strong><span>{finding.diagnosis || finding.notes || "Recorded"}</span></div>)}{(record?.treatmentPlans || []).map((plan) => <div className="record-item" key={plan._id}><strong>{plan.treatment}</strong><span>{plan.tooth ? `Tooth ${plan.tooth} · ` : ""}{plan.status}</span></div>)}{!(record?.toothFindings?.length || record?.treatmentPlans?.length) && <p className="muted">No dental history has been added.</p>}</div></InfoBlock>
      <InfoBlock title="Prescriptions">{record?.prescriptions?.length ? <div className="record-list">{record.prescriptions.map((prescription) => <div className="record-item" key={prescription._id}><strong>{prescription.medicineName}</strong><span>{[prescription.dose, prescription.frequency, prescription.duration, prescription.instructions].filter(Boolean).join(" · ")}</span></div>)}</div> : <p className="muted">No prescriptions available.</p>}</InfoBlock>
      <InfoBlock title="Visit history">{visits.length ? <div className="record-list">{visits.map((visit) => <div className="record-item" key={visit._id}><strong>{new Date(visit.visitDate).toLocaleDateString()} · {visit.mainComplaint || "Dental visit"}</strong><span>{[visit.diagnosis, visit.treatmentPerformed || visit.treatmentRecommendation, visit.treatmentStatus, visit.followUpDate && `Follow-up ${new Date(visit.followUpDate).toLocaleDateString()}${visit.followUpCompletedAt ? " completed" : ""}`, visit.followUpReason].filter(Boolean).join(" · ")}</span>{visit.prescriptions?.map((prescription) => <small key={prescription._id}>{prescription.medicineName} · {[prescription.dose, prescription.frequency, prescription.duration, prescription.instructions].filter(Boolean).join(" · ")}</small>)}</div>)}</div> : <p className="muted">No visit history has been shared.</p>}</InfoBlock>
      <InfoBlock title="Shared files">{documents.length ? <div className="record-list">{documents.map((document) => <div className="record-item" key={document._id}><strong>{document.originalName}</strong><span>{document.category} · {new Date(document.createdAt).toLocaleDateString()} <button className="delete-button" onClick={() => downloadFile(`/patient/documents/${document._id}/download`, document.originalName).catch((error) => toast.error(error.message))}>Download</button></span><small>{document.doctorNote}</small></div>)}</div> : <p className="muted">No files have been made available.</p>}</InfoBlock>
      <InfoBlock title="Available reports">{record?.investigations?.length ? <div className="record-list">{record.investigations.map((report) => <div className="record-item" key={report._id}><strong>{report.testName}</strong><span>{report.result || "Report available"} {report.reportUrl && <a href={report.reportUrl} target="_blank" rel="noreferrer">View report</a>}</span></div>)}</div> : <p className="muted">No reports have been made available.</p>}</InfoBlock>
    </div>
  </main></Layout>;
}
function Admin() {
  const [dashboard, setDashboard] = useState(null);
  const [section, setSection] = useState(() => new URLSearchParams(window.location.search).get("section") || "overview");
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const load = () =>
    get("/dashboard")
      .then(setDashboard)
      .catch(() => {
        clearAuth();
        navigate("/admin/login");
      });
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (section !== "overview")
      get(section === "doctors" ? "/clinical/doctors" : `/${section}`)
        .then(setItems)
        .catch(() => {});
  }, [section]);
  if (!dashboard)
    return <div className="admin-loading">Loading your dashboard...</div>;
  const count = dashboard.counts;
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Sparkles size={17} />
          </span>
          <span>
            Medico<small>Main Doctor</small>
          </span>
        </Link>
        <nav>
          <Link className="clinical-nav-link" to="/doctor">
            Main Doctor workspace
          </Link>
          <Link className="clinical-nav-link" to="/doctor/availability">
            Chamber hours
          </Link>
          <Link className="clinical-nav-link" to="/doctor/visits">
            Patient visits
          </Link>
          <Link className="clinical-nav-link" to="/doctor/appointments">
            Appointment desk
          </Link>
          <button
            className={section === "overview" ? "active" : ""}
            onClick={() => setSection("overview")}
          >
            Overview
          </button>
          {[
            ["appointments", "Appointments"],
            ["patients", "Patients"],
            ["doctors", "Doctors"],
            ["services", "Services"],
            ["reviews", "Reviews"],
            ["gallery", "Gallery"],
            ["blogs", "Blog"],
          ].map(([key, label]) => (
            <button
              className={section === key ? "active" : ""}
              onClick={() => setSection(key)}
              key={key}
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          className="logout"
          onClick={() => {
            clearAuth();
            navigate("/admin/login");
          }}
        >
          Log out
        </button>
      </aside>
      <main className="admin-main">
        <div className="admin-top">
          <div>
            <div className="eyebrow">
              Monday, {new Date().toLocaleDateString()}
            </div>
            <h1>
              {section === "overview"
                ? "Chamber overview."
                : section[0].toUpperCase() + section.slice(1)}
            </h1>
          </div>
          <Link
            className="button button-dark button-small"
            to="/"
            target="_blank"
          >
            View website <ArrowRight size={15} />
          </Link>
        </div>
        {section === "overview" ? (
          <DashboardOverview dashboard={dashboard} />
        ) : (
          <AdminTable
            section={section}
            items={items}
            refresh={() => {
              get(section === "doctors" ? "/clinical/doctors" : `/${section}`).then(setItems);
              load();
            }}
          />
        )}
      </main>
    </div>
  );
}
function DashboardOverview({ dashboard }) {
  return (
    <>
      <div className="metrics">
        {[
          ["appointments", "Appointments"],
          ["patients", "Patients"],
          ["doctors", "Doctors"],
          ["services", "Services"],
          ["reviews", "Reviews"],
        ].map(([key, label]) => (
          <div className="metric" key={key}>
            <span>{label}</span>
            <strong>{dashboard.counts[key]}</strong>
            <small>
              {key === "appointments" ? "All time records" : "Active records"}
            </small>
          </div>
        ))}
      </div>
      <div className="admin-panel">
        <div className="panel-heading">
          <div>
            <div className="eyebrow">Live queue</div>
            <h2>Recent appointments</h2>
          </div>
          <span className="status-pill">
            {dashboard.statuses.find((s) => s._id === "Pending")?.count || 0}{" "}
            pending
          </span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recent.map((a) => (
                <tr key={a._id}>
                  <td>
                    <strong>{a.patient?.name}</strong>
                    <small>{a.patient?.email}</small>
                  </td>
                  <td>{a.service?.name}</td>
                  <td>
                    {new Date(a.date).toLocaleDateString()} · {a.time}
                  </td>
                  <td>
                    <span className={`status ${a.status.toLowerCase()}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
function AdminTable({ section, items, refresh }) {
  const [query, setQuery] = useState("");
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const filtered = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(query.toLowerCase()),
  );
  const imageSection = ["doctors", "services", "gallery", "blogs"].includes(
    section,
  );
  const update = async (item, field, value) => {
    try {
      await patch(`/${section}/${item._id}`, { [field]: value });
      toast.success("Updated");
      refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };
  return (
    <div className="admin-panel">
      <div className="panel-heading">
        <div>
          <div className="eyebrow">Manage records</div>
          <h2>
            {items.length} {section}
          </h2>
        </div>
        {section === "doctors" && <button className="button button-small" onClick={() => { setEditingDoctor(null); setShowDoctorForm(true); }}>Add doctor <ArrowRight size={14} /></button>}
        <input
          className="search"
          placeholder="Search records..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Record</th>
              <th>Details</th>
              {imageSection && <th>Image URL</th>}
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item._id}>
                <td>
                  <strong>{item.name || item.title || item.patientName}</strong>
                  <small>
                    {item.email || item.category || item.specialization || ""}
                  </small>
                </td>
                <td>
                  {item.status ? (
                    <select
                      value={item.status}
                      onChange={(e) => update(item, "status", e.target.value)}
                    >
                      {(section === "doctors" ? ["Active", "Inactive"] : ["Pending", "Confirmed", "Rescheduled", "Completed", "Cancelled"]).map((status) => <option key={status}>{status}</option>)}
                    </select>
                  ) : (
                    item.description ||
                    item.review ||
                    item.author ||
                    `${item.experience || ""} years experience`
                  )}
                </td>
                {imageSection && (
                  <td>
                    <input
                      className="image-url"
                      defaultValue={item.image || ""}
                      placeholder="https://..."
                      onBlur={(e) => {
                        if (e.target.value !== item.image)
                          update(item, "image", e.target.value);
                      }}
                    />
                  </td>
                )}
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  {section === "doctors" && <button className="delete-button" onClick={() => { setEditingDoctor(item); setShowDoctorForm(true); }}>Edit</button>}
                  {section !== "doctors" && <button
                    className="delete-button"
                    onClick={async () => {
                      if (confirm("Delete this record?")) {
                        await remove(`/${section}/${item._id}`);
                        refresh();
                      }
                    }}
                  >
                    Delete
                  </button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDoctorForm && <DoctorForm doctor={editingDoctor} onClose={() => setShowDoctorForm(false)} onSaved={() => { setShowDoctorForm(false); setEditingDoctor(null); refresh(); }} />}
    </div>
  );
}
function DoctorForm({ onClose, onSaved, doctor }) {
  const [form, setForm] = useState(doctor ? { ...doctor, password: "" } : {});
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    try {
      if (doctor) {
        const { email, password, ...profile } = form;
        await patch(`/doctors/${doctor._id}`, { ...profile, experience: Number(form.experience) });
        const credentials = { email };
        if (password) credentials.password = password;
        await patch(`/clinical/doctors/${doctor._id}/credentials`, credentials);
      } else {
        await post("/doctors", { ...form, experience: Number(form.experience) });
      }
      toast.success(doctor ? "Doctor updated" : "Doctor account added"); onSaved();
    } catch (error) { toast.error(error.message); }
  };
  return <div className="clinical-modal"><form className="clinical-form" onSubmit={submit}><div className="panel-heading"><div><div className="eyebrow">Chamber staff</div><h2>{doctor ? "Edit doctor" : "Add doctor"}</h2></div><button type="button" className="icon-button" onClick={onClose}>×</button></div><div className="clinical-form-grid"><ClinicalField label="Full name" name="name" value={form.name} onChange={change} required /><ClinicalField label="Login email" name="email" type="email" value={form.email} onChange={change} required /><ClinicalField label={doctor ? "New password (optional)" : "Initial password"} name="password" type="password" value={form.password} onChange={change} required={!doctor} min="12" max="72" /><ClinicalField label="Phone" name="phone" value={form.phone} onChange={change} /><ClinicalField label="Qualification" name="degree" value={form.degree} onChange={change} required /><ClinicalField label="Specialization" name="specialization" value={form.specialization} onChange={change} required /><ClinicalField label="Experience (years)" name="experience" type="number" min="0" value={form.experience} onChange={change} required /><ClinicalArea label="Professional biography" name="bio" value={form.bio} onChange={change} /><ClinicalField label="Profile image URL" name="image" value={form.image} onChange={change} /></div><div className="clinical-form-actions"><button type="button" className="button button-ghost-dark" onClick={onClose}>Cancel</button><button className="button button-dark">{doctor ? "Save doctor" : "Add doctor"}</button></div></form></div>;
}
function ClinicalField({ label, name, value, onChange, type = "text", required = false, placeholder = "", min, max }) {
  return <label className="field clinical-field"><span>{label}</span><input name={name} type={type} value={value || ""} required={required} placeholder={placeholder} onChange={onChange} min={min} max={max} /></label>;
}
function ClinicalArea({ label, name, value, onChange, placeholder = "" }) {
  return <label className="field clinical-field"><span>{label}</span><textarea name={name} value={value || ""} placeholder={placeholder} rows="3" onChange={onChange} /></label>;
}
function DoctorWorkspace() {
  const [dashboard, setDashboard] = useState(null);
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();
  const isMainDoctor = localStorage.getItem("lumina_role") !== "doctor";
  const load = () => Promise.all([get("/clinical/dashboard"), get(`/clinical/patients?q=${encodeURIComponent(query)}`)]).then(([summary, list]) => { setDashboard(summary); setPatients(list); }).catch(() => { clearAuth(); navigate(isMainDoctor ? "/admin/login" : "/doctor/login"); });
  useEffect(() => { load(); }, [query]);
  if (!dashboard) return <div className="admin-loading">Loading clinical workspace...</div>;
  return <div className="clinical-shell">
    <aside className="admin-sidebar">
      <Link to="/" className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>Medico<small>Main Doctor</small></span></Link>
      <nav>
        <button className={!selected ? "active" : ""} onClick={() => setSelected(null)}>Dashboard</button>
        <button className={selected ? "active" : ""} onClick={() => setSelected(null)}>Patients</button>
        {isMainDoctor && <button onClick={() => setShowAdd(true)}>+ Add patient</button>}
        <Link className="clinical-nav-link" to="/doctor/appointments">Appointment desk</Link>
        {isMainDoctor && <Link className="clinical-nav-link" to="/doctor/availability">Chamber hours</Link>}
        <Link className="clinical-nav-link" to="/doctor/tests">Tests</Link>
        <Link className="clinical-nav-link" to="/doctor/reports">Reports</Link>
        <Link className="clinical-nav-link" to="/doctor/visits">Patient visits</Link>
        {isMainDoctor && <Link className="clinical-nav-link" to="/admin?section=doctors">Doctors</Link>}
      </nav>
      {isMainDoctor && <Link className="clinical-back" to="/admin">Website content</Link>}
      <button className="logout" onClick={() => { clearAuth(); navigate(isMainDoctor ? "/admin/login" : "/doctor/login"); }}>Log out</button>
    </aside>
    <main className="admin-main clinical-main">
      {selected ? <PatientProfile patientId={selected} onBack={() => { setSelected(null); load(); }} /> : <>
        <div className="admin-top"><div><div className="eyebrow">Main Doctor</div><h1>Chamber dashboard</h1></div><button className="button button-dark" onClick={() => setShowAdd(true)}>Add patient <ArrowRight size={15} /></button></div>
        <div className="metrics clinical-metrics">{[["todayAppointments","Today's appointments"],["pending","Pending appointments"],["upcomingAppointments","Upcoming appointments"],["patients","Total patients"],["upcomingTests","Upcoming tests"],["pendingReports","Pending reports"],["followUps","Follow-ups"]].map(([key, label]) => <div className="metric" key={key}><span>{label}</span><strong>{dashboard.counts[key]}</strong></div>)}</div>
        <nav className="dashboard-actions" aria-label="Quick actions"><button className="button button-small" onClick={() => setShowAdd(true)} disabled={!isMainDoctor}>Add patient</button><button className="button button-small button-ghost-dark" onClick={() => setSelected(null)}>View patients</button><Link className="button button-small button-ghost-dark" to="/doctor/appointments">Appointments</Link>{isMainDoctor && <><Link className="button button-small button-ghost-dark" to="/admin?section=doctors">Add doctor</Link><Link className="button button-small button-ghost-dark" to="/doctor/assignments">Assign patients</Link></>}<Link className="button button-small button-ghost-dark" to="/doctor/tests">Upcoming tests</Link><Link className="button button-small button-ghost-dark" to="/doctor/reports">Reports</Link><a className="button button-small button-ghost-dark" href="#dashboard-follow-ups">Follow-ups</a></nav>
        <div className="clinical-grid">
          <div className="admin-panel clinical-panel"><div className="panel-heading"><div><div className="eyebrow">Patient records</div><h2>{patients.length} patients</h2></div><input className="search" placeholder="ID, name, phone or email" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="clinical-patient-list">{patients.map((patient) => <button className="clinical-patient" key={patient._id} onClick={() => setSelected(patient._id)}><span className="patient-avatar">{patient.name?.slice(0, 1)}</span><span><strong>{patient.name}</strong><small>{patient.patientId || "Pending ID"} · {patient.phone}</small></span><ArrowRight size={16} /></button>)}{!patients.length && <div className="clinical-empty">No patient records found.</div>}</div></div>
          <div className="admin-panel clinical-panel"><div className="panel-heading"><div><div className="eyebrow">Today</div><h2>Appointments</h2></div></div><div className="clinical-appointments">{dashboard.todayAppointments.map((item) => <button key={item._id} onClick={() => item.patient?._id && setSelected(item.patient._id)}><span>{item.time}</span><strong>{item.patient?.name}</strong><small>{item.service?.name} · {item.status}</small></button>)}{!dashboard.todayAppointments.length && <div className="clinical-empty">No appointments today.</div>}</div></div>
        </div>
        <div id="dashboard-follow-ups"><InfoBlock title="Follow-ups"><div className="clinical-appointments">{dashboard.upcomingFollowUps.map((item, index) => <button key={`${item.patient?._id}-${item.date}-${index}`} onClick={() => item.patient?._id && setSelected(item.patient._id)}><span>{new Date(item.date).toLocaleDateString()}</span><strong>{item.patient?.name}</strong><small>{item.reason || item.notes || "Follow-up due"}</small></button>)}{!dashboard.upcomingFollowUps.length && <div className="clinical-empty">No follow-ups due.</div>}</div><p className="muted">Completed follow-ups: {dashboard.counts.completedFollowUps}</p></InfoBlock></div>
        {showAdd && <PatientForm onClose={() => setShowAdd(false)} onSaved={load} />}
      </>}
    </main>
  </div>;
}
function AppointmentAssignment({ appointment }) {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState(appointment.assignedDoctor?._id || "");
  useEffect(() => { get("/clinical/doctors").then(setDoctors).catch((error) => toast.error(error.message)); }, []);
  useEffect(() => { setDoctorId(appointment.assignedDoctor?._id || ""); }, [appointment]);
  const save = async () => { try { await patch(`/appointments/${appointment._id}/assignment`, { doctorId: doctorId || null }); toast.success("Appointment assignment saved"); } catch (error) { toast.error(error.message); } };
  return <div className="appointment-assign"><label className="field clinical-field"><span>Assigned doctor</span><select value={doctorId} onChange={(event) => setDoctorId(event.target.value)}><option value="">Main Doctor / unassigned</option>{doctors.filter((doctor) => doctor.status === "Active").map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name}</option>)}</select></label><button className="button button-small" onClick={save}>Assign</button></div>;
}
function MainDoctorAppointmentDesk() {
  const [appointments, setAppointments] = useState([]);
  const [scope, setScope] = useState("all");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [schedule, setSchedule] = useState({ date: "", time: "" });
  const [slots, setSlots] = useState([]);
  const navigate = useNavigate();
  const isMainDoctor = localStorage.getItem("lumina_role") !== "doctor";
  const load = () => {
    const params = new URLSearchParams();
    if (scope !== "all") params.set("scope", scope);
    if (status) params.set("status", status);
    if (query.trim()) params.set("q", query.trim());
    get(`/appointments?${params}`).then(setAppointments).catch(() => { clearAuth(); navigate(isMainDoctor ? "/admin/login" : "/doctor/login"); });
  };
  useEffect(() => { load(); }, [scope, status, query]);
  useEffect(() => {
    if (!schedule.date) { setSlots([]); return; }
    get(`/availability?date=${encodeURIComponent(schedule.date)}`).then(({ slots: available }) => { setSlots(available); if (!available.includes(schedule.time)) setSchedule((current) => ({ ...current, time: "" })); }).catch((error) => { setSlots([]); toast.error(error.message); });
  }, [schedule.date]);
  const selectAppointment = (appointment) => { setSelected(appointment); setEditing(false); setSchedule({ date: appointment.date.slice(0, 10), time: appointment.time }); };
  const changeStatus = async (nextStatus) => { if(!isMainDoctor&&nextStatus!=="Completed")return;try { await patch(`/appointments/${selected._id}`, { status: nextStatus }); toast.success(`Appointment ${nextStatus.toLowerCase()}`); setSelected(null); load(); } catch (error) { toast.error(error.message); } };
  const reschedule = async (event) => { event.preventDefault(); try { await patch(`/appointments/${selected._id}`, { ...schedule, status: "Rescheduled" }); toast.success("Appointment rescheduled"); setEditing(false); setSelected(null); load(); } catch (error) { toast.error(error.message); } };
  const today = new Date().toISOString().slice(0, 10);
  return <div className="clinical-shell"><aside className="admin-sidebar"><Link to="/" className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>Medico<small>{isMainDoctor?"Main Doctor":"Doctor"}</small></span></Link><nav><Link className="clinical-nav-link" to="/doctor">Dashboard</Link>{isMainDoctor&&<Link className="clinical-nav-link" to="/doctor/availability">Chamber hours</Link>}<Link className="clinical-nav-link" to="/doctor/visits">Patients and visits</Link>{isMainDoctor&&<Link className="clinical-nav-link" to="/admin">Website content</Link>}</nav><button className="logout" onClick={() => { clearAuth(); navigate(isMainDoctor?"/admin/login":"/doctor/login"); }}>Log out</button></aside><main className="admin-main clinical-main"><div className="admin-top"><div><div className="eyebrow">Chamber scheduling</div><h1>Appointments</h1></div></div>
    <div className="appointment-filters"><label className="field clinical-field"><span>Date range</span><select value={scope} onChange={(event) => setScope(event.target.value)}><option value="all">All dates</option><option value="today">Today</option><option value="upcoming">Upcoming</option></select></label><label className="field clinical-field"><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{["Pending","Confirmed","Rescheduled","Completed","Cancelled"].map((value) => <option key={value}>{value}</option>)}</select></label><label className="field clinical-field"><span>Find patient or appointment</span><input className="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, phone, patient or appointment ID" /></label></div>
    <div className="appointment-desk-grid"><div className="admin-panel clinical-panel"><div className="panel-heading"><div><div className="eyebrow">Live records</div><h2>{appointments.length} appointments</h2></div></div><div className="clinical-patient-list">{appointments.map((appointment) => <button className="clinical-patient" key={appointment._id} onClick={() => selectAppointment(appointment)}><span className="patient-avatar">{appointment.patient?.name?.slice(0,1)}</span><span><strong>{appointment.patient?.name || "Patient"}</strong><small>{new Date(appointment.date).toLocaleDateString()} · {appointment.time} · {appointment.reason || appointment.message || appointment.service?.name}</small></span><small className={`status ${appointment.status.toLowerCase()}`}>{appointment.status}</small></button>)}{!appointments.length && <p className="clinical-empty">No appointments match these filters.</p>}</div></div>
      {selected && <InfoBlock title="Appointment details"><div className="info-grid"><Info label="Patient" value={`${selected.patient?.name} · ${selected.patient?.patientId || ""}`} /><Info label="Phone" value={selected.patient?.phone} /><Info label="Appointment ID" value={selected._id} /><Info label="Date and time" value={`${new Date(selected.date).toLocaleDateString()} · ${selected.time}`} /><Info label="Reason" value={selected.reason || selected.message || selected.service?.name} /></div>{isMainDoctor&&<AppointmentAssignment appointment={selected} />}<div className="appointment-actions">{isMainDoctor&&selected.status === "Pending" && <button className="button button-dark" onClick={() => changeStatus("Confirmed")}>Confirm</button>}{(["Confirmed","Rescheduled"].includes(selected.status)) && (isMainDoctor||selected.assignedDoctor?._id===localStorage.getItem("doctor_id")) && <button className="button button-dark" onClick={() => changeStatus("Completed")}>Mark completed</button>}{isMainDoctor&&["Pending","Confirmed","Rescheduled"].includes(selected.status) && <button className="button button-ghost-dark" onClick={() => changeStatus("Cancelled")}>Cancel</button>}{isMainDoctor&&!['Cancelled','Completed'].includes(selected.status) && <button className="button button-ghost-dark" onClick={() => setEditing(!editing)}>Reschedule</button>}<Link className="button button-ghost-dark" to={`/doctor/visits?patient=${selected.patient?._id}`}>Open patient record</Link></div>{editing && <form className="clinical-form-grid" onSubmit={reschedule}><ClinicalField label="Date" name="date" type="date" min={today} value={schedule.date} onChange={(event) => setSchedule({ ...schedule, date: event.target.value })} required /><label className="field clinical-field"><span>Available time</span><select value={schedule.time} onChange={(event) => setSchedule({ ...schedule, time: event.target.value })} required disabled={!slots.length}><option value="">{slots.length ? "Select a time" : "No times available"}</option>{slots.map((time) => <option key={time}>{time}</option>)}</select></label><button className="button button-dark">Save new time</button></form>}</InfoBlock>}
    </div></main></div>;
}
function AppointmentManager() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [scope, setScope] = useState("all");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [schedule, setSchedule] = useState({ doctor: "", date: "", time: "" });
  const [slots, setSlots] = useState([]);
  const navigate = useNavigate();
  useEffect(() => { get("/doctors").then(setDoctors).catch((error) => toast.error(error.message)); }, []);
  const load = () => {
    const params = new URLSearchParams();
    if (scope !== "all") params.set("scope", scope);
    if (status) params.set("status", status);
    if (query.trim()) params.set("q", query.trim());
    get(`/appointments?${params}`).then(setAppointments).catch(() => { localStorage.removeItem("lumina_token"); navigate("/admin/login"); });
  };
  useEffect(() => { load(); }, [scope, status, query]);
  useEffect(() => {
    if (!schedule.doctor || !schedule.date) { setSlots([]); return; }
    get(`/availability?doctor=${encodeURIComponent(schedule.doctor)}&date=${encodeURIComponent(schedule.date)}`).then(({ slots: available }) => { setSlots(available); if (!available.includes(schedule.time)) setSchedule((current) => ({ ...current, time: "" })); }).catch((error) => { setSlots([]); toast.error(error.message); });
  }, [schedule.doctor, schedule.date]);
  const selectAppointment = (appointment) => { setSelected(appointment); setEditing(false); setSchedule({ doctor: appointment.doctor?._id || "", date: appointment.date.slice(0,10), time: appointment.time }); };
  const changeStatus = async (nextStatus) => { try { await patch(`/appointments/${selected._id}`, { status: nextStatus }); toast.success(`Appointment ${nextStatus.toLowerCase()}`); setSelected(null); load(); } catch (error) { toast.error(error.message); } };
  const reschedule = async (event) => { event.preventDefault(); try { await patch(`/appointments/${selected._id}`, { ...schedule, status: "Confirmed" }); toast.success("Appointment rescheduled"); setEditing(false); setSelected(null); load(); } catch (error) { toast.error(error.message); } };
  const today = new Date().toISOString().slice(0,10);
  return <div className="clinical-shell"><aside className="admin-sidebar"><Link to="/" className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>Medico<small>Appointment desk</small></span></Link><nav><Link className="clinical-nav-link" to="/doctor">Clinical workspace</Link><Link className="clinical-nav-link" to="/doctor/visits">Patient visits</Link><Link className="clinical-nav-link" to="/doctor/availability">Doctor availability</Link><Link className="clinical-nav-link" to="/admin">Admin content</Link></nav><button className="logout" onClick={() => { localStorage.removeItem("lumina_token"); navigate("/admin/login"); }}>Log out</button></aside><main className="admin-main clinical-main"><div className="admin-top"><div><div className="eyebrow">Scheduling</div><h1>Appointments</h1></div></div>
    <div className="appointment-filters"><label className="field clinical-field"><span>Date range</span><select value={scope} onChange={(event) => setScope(event.target.value)}><option value="all">All dates</option><option value="today">Today</option><option value="upcoming">Upcoming</option></select></label><label className="field clinical-field"><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{["Pending","Confirmed","Completed","Cancelled"].map((value) => <option key={value}>{value}</option>)}</select></label><label className="field clinical-field"><span>Find patient or appointment</span><input className="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, phone, patient or appointment ID" /></label></div>
    <div className="appointment-desk-grid"><div className="admin-panel clinical-panel"><div className="panel-heading"><div><div className="eyebrow">Live records</div><h2>{appointments.length} appointments</h2></div></div><div className="clinical-patient-list">{appointments.map((appointment) => <button className="clinical-patient" key={appointment._id} onClick={() => selectAppointment(appointment)}><span className="patient-avatar">{appointment.patient?.name?.slice(0,1)}</span><span><strong>{appointment.patient?.name || "Patient"}</strong><small>{new Date(appointment.date).toLocaleDateString()} · {appointment.time} · {appointment.service?.name}</small></span><small className={`status ${appointment.status.toLowerCase()}`}>{appointment.status}</small></button>)}{!appointments.length && <p className="clinical-empty">No appointments match these filters.</p>}</div></div>
      {selected && <InfoBlock title="Appointment details"><div className="info-grid"><Info label="Patient" value={`${selected.patient?.name} · ${selected.patient?.patientId || ""}`} /><Info label="Phone" value={selected.patient?.phone} /><Info label="Appointment ID" value={selected._id} /><Info label="Date and time" value={`${new Date(selected.date).toLocaleDateString()} · ${selected.time}`} /><Info label="Doctor" value={selected.doctor?.name} /><Info label="Reason" value={selected.message || selected.service?.name} /></div><div className="appointment-actions">{selected.status === "Pending" && <button className="button button-dark" onClick={() => changeStatus("Confirmed")}>Confirm</button>}{selected.status === "Confirmed" && <button className="button button-dark" onClick={() => changeStatus("Completed")}>Mark completed</button>}{["Pending","Confirmed"].includes(selected.status) && <button className="button button-ghost-dark" onClick={() => changeStatus("Cancelled")}>Cancel</button>}{!["Cancelled","Completed"].includes(selected.status) && <button className="button button-ghost-dark" onClick={() => setEditing(!editing)}>Reschedule</button>}<Link className="button button-ghost-dark" to={`/doctor/visits?patient=${selected.patient?._id}`}>Open patient visit records</Link></div>{editing && <form className="clinical-form-grid" onSubmit={reschedule}><ClinicalField label="Date" name="date" type="date" min={today} value={schedule.date} onChange={(event) => setSchedule({ ...schedule, date: event.target.value })} required /><label className="field clinical-field"><span>Doctor</span><select value={schedule.doctor} onChange={(event) => setSchedule({ ...schedule, doctor: event.target.value, time: "" })} required>{doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name}</option>)}</select></label><label className="field clinical-field"><span>Available time</span><select value={schedule.time} onChange={(event) => setSchedule({ ...schedule, time: event.target.value })} required disabled={!slots.length}><option value="">{slots.length ? "Select a time" : "No times available"}</option>{slots.map((time) => <option key={time}>{time}</option>)}</select></label><button className="button button-dark">Save new time</button></form>}</InfoBlock>}
    </div></main></div>;
}
function VisitManager() {
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState("");
  const [patientId, setPatientId] = useState(new URLSearchParams(useLocation().search).get("patient") || "");
  const [patientData, setPatientData] = useState(null);
  const [activeVisitId, setActiveVisitId] = useState("");
  const [form, setForm] = useState({ affectedTeeth: "", patientVisible: false });
  const [prescription, setPrescription] = useState({ patientVisible: false });
  const [test, setTest] = useState({ patientVisible: false, status: "Pending" });
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState({ category: "Other", patientVisible: false, testId: "" });
  const navigate = useNavigate();
  const permanentTeeth = ["18","17","16","15","14","13","12","11","21","22","23","24","25","26","27","28","48","47","46","45","44","43","42","41","31","32","33","34","35","36","37","38"];
  const primaryTeeth = ["55","54","53","52","51","61","62","63","64","65","85","84","83","82","81","71","72","73","74","75"];
  const loadPatients = () => get(`/clinical/patients?q=${encodeURIComponent(query)}`).then(setPatients).catch(() => { localStorage.removeItem("lumina_token"); navigate("/admin/login"); });
  const loadPatient = () => get(`/clinical/patients/${patientId}`).then(setPatientData).catch((error) => toast.error(error.message));
  useEffect(() => { loadPatients(); }, [query]);
  useEffect(() => { if (patientId) loadPatient(); else setPatientData(null); }, [patientId]);
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submitVisit = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...form, affectedTeeth: form.affectedTeeth.split(",").map((tooth) => tooth.trim()).filter(Boolean) };
      const visit = await post(`/clinical/patients/${patientId}/visits`, payload);
      toast.success("Visit saved"); setActiveVisitId(visit._id); setForm({ affectedTeeth: "", patientVisible: false }); loadPatient();
    } catch (error) { toast.error(error.message); }
  };
  const addPrescription = async (event) => {
    event.preventDefault();
    try { await post(`/clinical/visits/${activeVisitId}/prescriptions`, prescription); toast.success("Prescription saved"); setPrescription({ patientVisible: false }); loadPatient(); }
    catch (error) { toast.error(error.message); }
  };
  const addTest = async (event) => {
    event.preventDefault();
    try { await post(`/clinical/visits/${activeVisitId}/tests`, test); toast.success("Test requirement saved"); setTest({ patientVisible: false }); loadPatient(); }
    catch (error) { toast.error(error.message); }
  };
  const saveFile = async (event) => {
    event.preventDefault();
    if (!file) return;
    const body = new FormData(); body.append("file", file); body.append("category", fileInfo.category); body.append("doctorNote", fileInfo.doctorNote || ""); body.append("patientVisible", String(fileInfo.patientVisible)); if(fileInfo.testId)body.append("testId",fileInfo.testId);
    try { await uploadFile(`/clinical/patients/${patientId}/visits/${activeVisitId}/documents`, body); toast.success("File uploaded"); setFile(null); setFileInfo({ category: "Other", patientVisible: false, testId: "" }); loadPatient(); }
    catch (error) { toast.error(error.message); }
  };
  const setVisitVisibility = async (visit) => {
    try { await patch(`/clinical/visits/${visit._id}`, { patientVisible: !visit.patientVisible }); loadPatient(); }
    catch (error) { toast.error(error.message); }
  };
  const setFollowUpCompleted = async (visit) => {
    try { await patch(`/clinical/visits/${visit._id}`, { followUpCompletedAt: visit.followUpCompletedAt ? null : new Date().toISOString() }); loadPatient(); }
    catch (error) { toast.error(error.message); }
  };
  const deleteDocument = async (document) => {
    if (!window.confirm(`Delete ${document.originalName}?`)) return;
    try { await remove(`/clinical/documents/${document._id}`); toast.success("Document deleted"); loadPatient(); }
    catch (error) { toast.error(error.message); }
  };
  const setTooth = (tooth) => {
    const selected = form.affectedTeeth.split(",").map((value) => value.trim()).filter(Boolean);
    const next = selected.includes(tooth) ? selected.filter((value) => value !== tooth) : [...selected, tooth];
    setForm({ ...form, affectedTeeth: next.join(", ") });
  };
  const activeVisit = patientData?.visits?.find((visit) => visit._id === activeVisitId);
  const activeDocuments = patientData?.documents?.filter((document) => document.visit === activeVisitId || document.visit?._id === activeVisitId) || [];
  return <div className="clinical-shell"><aside className="admin-sidebar"><Link to="/" className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>Medico<small>Patient visits</small></span></Link><nav><Link className="clinical-nav-link" to="/doctor">Clinical workspace</Link><Link className="clinical-nav-link" to="/doctor/availability">Doctor availability</Link><Link className="clinical-nav-link" to="/admin">Admin content</Link></nav><button className="logout" onClick={() => { localStorage.removeItem("lumina_token"); navigate("/admin/login"); }}>Log out</button></aside><main className="admin-main clinical-main">
    <div className="admin-top"><div><div className="eyebrow">Clinical record</div><h1>Patient visits</h1></div></div>
    <div className="admin-panel clinical-panel"><div className="panel-heading"><div><div className="eyebrow">Find a patient</div><h2>{patientData?.patient?.name || "Select patient"}</h2></div><input className="search" placeholder="Patient name, phone or ID" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="clinical-patient-list">{patients.map((patient) => <button className="clinical-patient" key={patient._id} onClick={() => { setPatientId(patient._id); setActiveVisitId(""); }}><span className="patient-avatar">{patient.name?.slice(0,1)}</span><span><strong>{patient.name}</strong><small>{patient.patientId} · {patient.phone}</small></span></button>)}</div></div>
    {patientData && <><div className="patient-tabs">{patientData.visits.map((visit) => <button className={activeVisitId === visit._id ? "active" : ""} key={visit._id} onClick={() => setActiveVisitId(visit._id)}>{new Date(visit.visitDate).toLocaleDateString()} · {visit.mainComplaint || "Visit"}</button>)}<button className={!activeVisitId ? "active" : ""} onClick={() => setActiveVisitId("")}>New visit</button></div>
      {!activeVisitId ? <InfoBlock title="Record a new visit"><form className="clinical-form-grid" onSubmit={submitVisit}>
        <ClinicalField label="Visit date" name="visitDate" type="date" value={form.visitDate} onChange={change} />
        <label className="field clinical-field"><span>Appointment</span><select name="appointment" value={form.appointment || ""} onChange={change}><option value="">Not linked to an appointment</option>{patientData.appointments.map((item) => <option key={item._id} value={item._id}>{new Date(item.date).toLocaleDateString()} · {item.time} · {item.status}</option>)}</select></label>
        <ClinicalField label="Main complaint" name="mainComplaint" value={form.mainComplaint} onChange={change} />
        <ClinicalField label="Duration" name="duration" value={form.duration} onChange={change} />
        <ClinicalField label="Pain level (0–10)" name="painLevel" type="number" value={form.painLevel} onChange={change} />
        <ClinicalArea label="Symptoms" name="symptoms" value={form.symptoms} onChange={change} />
        <ClinicalArea label="Clinical examination" name="clinicalExamination" value={form.clinicalExamination} onChange={change} />
        <ClinicalArea label="Diagnosis" name="diagnosis" value={form.diagnosis} onChange={change} />
        <div className="visit-chart"><span>Affected teeth</span><div className="tooth-grid">{[permanentTeeth, primaryTeeth].map((group, index) => <div className="visit-tooth-row" key={index}>{group.map((tooth) => <button type="button" key={tooth} className={form.affectedTeeth.split(",").map((value) => value.trim()).includes(tooth) ? "tooth marked" : "tooth"} onClick={() => setTooth(tooth)}>{tooth}</button>)}</div>)}</div><ClinicalField label="Tooth IDs" name="affectedTeeth" value={form.affectedTeeth} onChange={change} placeholder="For example, 16, 36" /></div>
        <ClinicalArea label="Treatment recommendation" name="treatmentRecommendation" value={form.treatmentRecommendation} onChange={change} />
        <ClinicalArea label="Treatment performed" name="treatmentPerformed" value={form.treatmentPerformed} onChange={change} />
        <label className="field clinical-field"><span>Treatment status</span><select name="treatmentStatus" value={form.treatmentStatus || ""} onChange={change}><option value="">Select status</option>{["Planned","In Progress","Completed","Not Required"].map((status) => <option key={status}>{status}</option>)}</select></label>
        <ClinicalField label="Treatment cost" name="treatmentCost" type="number" value={form.treatmentCost} onChange={change} />
        <ClinicalField label="Follow-up date" name="followUpDate" type="date" value={form.followUpDate} onChange={change} />
        <ClinicalField label="Follow-up reason" name="followUpReason" value={form.followUpReason} onChange={change} />
        <ClinicalArea label="Follow-up notes" name="followUpNotes" value={form.followUpNotes} onChange={change} />
        <ClinicalArea label="Doctor notes" name="notes" value={form.notes} onChange={change} />
        <label className="record-share"><input type="checkbox" checked={Boolean(form.patientVisible)} onChange={(event) => setForm({ ...form, patientVisible: event.target.checked })} /> Make visit details available to patient</label>
        <button className="button button-dark">Save visit</button>
      </form></InfoBlock> : activeVisit && <><InfoBlock title={activeVisit.mainComplaint || "Visit details"}><div className="info-grid"><Info label="Date" value={new Date(activeVisit.visitDate).toLocaleDateString()} /><Info label="Diagnosis" value={activeVisit.diagnosis} /><Info label="Affected teeth" value={activeVisit.affectedTeeth?.join(", ")} /><Info label="Treatment performed" value={activeVisit.treatmentPerformed} /><Info label="Treatment status" value={activeVisit.treatmentStatus} /><Info label="Follow-up" value={activeVisit.followUpDate ? new Date(activeVisit.followUpDate).toLocaleDateString() : "Not set"} /></div><p>{activeVisit.notes}</p>{activeVisit.followUpDate && <label className="record-share"><input type="checkbox" checked={Boolean(activeVisit.followUpCompletedAt)} onChange={() => setFollowUpCompleted(activeVisit)} /> Follow-up completed</label>}<label className="record-share"><input type="checkbox" checked={Boolean(activeVisit.patientVisible)} onChange={() => setVisitVisibility(activeVisit)} /> Share this visit with patient</label></InfoBlock>
        <div className="clinical-grid"><InfoBlock title="Prescriptions"><div className="record-list">{activeVisit.prescriptions?.map((item) => <div className="record-item" key={item._id}><strong>{item.medicineName}</strong><span>{[item.dose,item.frequency,item.duration,item.instructions].filter(Boolean).join(" · ")}{item.patientVisible ? " · Shared" : " · Private"}</span></div>)}</div><form className="clinical-form-grid" onSubmit={addPrescription}><ClinicalField label="Medicine" name="medicineName" value={prescription.medicineName} onChange={(event) => setPrescription({ ...prescription, medicineName: event.target.value })} required /><ClinicalField label="Dosage" name="dose" value={prescription.dose} onChange={(event) => setPrescription({ ...prescription, dose: event.target.value })} /><ClinicalField label="Frequency" name="frequency" value={prescription.frequency} onChange={(event) => setPrescription({ ...prescription, frequency: event.target.value })} /><ClinicalField label="Duration" name="duration" value={prescription.duration} onChange={(event) => setPrescription({ ...prescription, duration: event.target.value })} /><ClinicalArea label="Instructions" name="instructions" value={prescription.instructions} onChange={(event) => setPrescription({ ...prescription, instructions: event.target.value })} /><label className="record-share"><input type="checkbox" checked={Boolean(prescription.patientVisible)} onChange={(event) => setPrescription({ ...prescription, patientVisible: event.target.checked })} /> Make prescription available to patient</label><button className="button button-dark">Add prescription</button></form></InfoBlock>
          <InfoBlock title="Pre-treatment tests"><div className="record-list">{activeVisit.tests?.map((item) => <div className="record-item" key={item._id}><strong>{item.testName} · {item.status}</strong><span>{[item.date&&new Date(item.date).toLocaleDateString(),item.reason,item.result].filter(Boolean).join(" · ")}{item.reportId&&<button className="delete-button" onClick={()=>downloadFile(`/clinical/documents/${item.reportId}/download`,item.testName).catch(error=>toast.error(error.message))}>View report</button>}</span><small>{item.instructions} {item.doctorNotes}</small></div>)}</div><form className="clinical-form-grid" onSubmit={addTest}><ClinicalField label="Custom test name" name="testName" value={test.testName} onChange={(event) => setTest({ ...test, testName: event.target.value })} required /><ClinicalField label="Expected date" name="date" type="date" value={test.date} onChange={(event) => setTest({ ...test, date: event.target.value })} /><ClinicalArea label="Reason" name="reason" value={test.reason} onChange={(event) => setTest({ ...test, reason: event.target.value })} /><ClinicalArea label="Instructions" name="instructions" value={test.instructions} onChange={(event) => setTest({ ...test, instructions: event.target.value })} /><ClinicalArea label="Result" name="result" value={test.result} onChange={(event) => setTest({ ...test, result: event.target.value })} /><ClinicalArea label="Doctor notes" name="doctorNotes" value={test.doctorNotes} onChange={(event) => setTest({ ...test, doctorNotes: event.target.value })} /><label className="field clinical-field"><span>Test status</span><select name="status" value={test.status} onChange={(event)=>setTest({...test,status:event.target.value})}><option>Pending</option><option>Completed</option><option>Cancelled</option></select></label><label className="record-share"><input type="checkbox" checked={Boolean(test.patientVisible)} onChange={(event) => setTest({ ...test, patientVisible: event.target.checked })} /> Share result with patient</label><button className="button button-dark">Add test</button></form></InfoBlock></div>
        <InfoBlock title="Visit documents"><div className="record-list">{activeDocuments.map((document) => <div className="record-item" key={document._id}><strong>{document.originalName}</strong><span>{document.category} · {new Date(document.createdAt).toLocaleDateString()} · {document.mimeType}<button className="delete-button" onClick={() => downloadFile(`/clinical/documents/${document._id}/download`, document.originalName).catch((error) => toast.error(error.message))}>Download</button><button className="delete-button" onClick={() => deleteDocument(document)}>Delete</button></span><small>{document.doctorNote}{document.patientVisible ? " · Shared with patient" : " · Private"}</small></div>)}</div><form className="clinical-form-grid" onSubmit={saveFile}><label className="field clinical-field"><span>File</span><input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] || null)} required /></label><label className="field clinical-field"><span>File type</span><select value={fileInfo.category} onChange={(event) => setFileInfo({ ...fileInfo, category: event.target.value })}>{["X-ray","Image","Test report","Medical document","Other"].map((category) => <option key={category}>{category}</option>)}</select></label>{activeVisit.tests?.length>0&&<label className="field clinical-field"><span>Related test (optional)</span><select value={fileInfo.testId} onChange={(event)=>setFileInfo({...fileInfo,testId:event.target.value})}><option value="">Not a test report</option>{activeVisit.tests.map((item)=><option key={item._id} value={item._id}>{item.testName}</option>)}</select></label>}<ClinicalArea label="Doctor note" name="doctorNote" value={fileInfo.doctorNote} onChange={(event) => setFileInfo({ ...fileInfo, doctorNote: event.target.value })} /><label className="record-share"><input type="checkbox" checked={Boolean(fileInfo.patientVisible)} onChange={(event) => setFileInfo({ ...fileInfo, patientVisible: event.target.checked })} /> Make file available to patient</label><button className="button button-dark">Upload file</button><small>PDF, JPEG, PNG, or WebP · 10 MB maximum</small></form></InfoBlock></>}
    </>}
  </main></div>;
}
function DoctorQueuePage({ kind }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState(kind === "tests" ? "Pending" : "Uploaded");
  const navigate = useNavigate();
  const isDoctor = localStorage.getItem("lumina_role") === "doctor";
  const load = () => get(`/clinical/${kind}${status ? `?status=${encodeURIComponent(status)}` : ""}`).then(setItems).catch(() => { clearAuth(); navigate(isDoctor ? "/doctor/login" : "/admin/login"); });
  useEffect(() => { load(); }, [kind, status]);
  const updateTest = async (test, updates) => {
    try { await patch(`/clinical/visits/${test.visitId}/tests/${test._id}`, updates); toast.success("Test updated"); load(); }
    catch (error) { toast.error(error.message); }
  };
  const updateReport = async (report, updates) => {
    try { await patch(`/clinical/documents/${report._id}`, updates); toast.success("Report updated"); load(); }
    catch (error) { toast.error(error.message); }
  };
  const title = kind === "tests" ? "Upcoming tests" : "Reports";
  return <div className="clinical-shell"><aside className="admin-sidebar"><Link to="/" className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>Medico<small>Chamber management</small></span></Link><nav><Link className="clinical-nav-link" to="/doctor">Dashboard</Link><Link className="clinical-nav-link" to="/doctor/appointments">Appointments</Link><Link className="clinical-nav-link" to="/doctor/visits">Patients and visits</Link>{!isDoctor&&<Link className="clinical-nav-link" to="/admin?section=doctors">Doctors</Link>}</nav><button className="logout" onClick={() => { clearAuth(); navigate(isDoctor?"/doctor/login":"/admin/login"); }}>Log out</button></aside><main className="admin-main clinical-main"><div className="admin-top"><div><div className="eyebrow">Patient care</div><h1>{title}</h1></div></div><label className="field clinical-field queue-filter"><span>Filter</span><select value={status} onChange={(event) => setStatus(event.target.value)}>{(kind === "tests" ? ["Pending","Completed","Cancelled"] : ["Uploaded","Reviewed","Pending"]).map((value) => <option key={value}>{value}</option>)}</select></label><div className="queue-list">{items.map((item) => <section className="queue-row" key={item._id}><div><strong>{kind === "tests" ? item.testName : item.originalName}</strong><small>{item.patient?.name} · {item.patient?.patientId}</small><small>{kind === "tests" ? `${item.date ? new Date(item.date).toLocaleDateString() : "Date not set"} · ${item.reason || "No reason added"}` : `${item.category} · ${new Date(item.createdAt).toLocaleDateString()}`}</small>{(item.instructions || item.result || item.doctorNote) && <p>{item.instructions || item.result || item.doctorNote}</p>}</div><div className="queue-actions">{kind === "tests" ? <select aria-label="Test status" value={item.status} onChange={(event) => updateTest(item, { status: event.target.value })}>{["Pending","Completed","Cancelled"].map((value) => <option key={value}>{value}</option>)}</select> : <><button className="button button-small button-ghost-dark" onClick={() => downloadFile(`/clinical/documents/${item._id}/download`, item.originalName).catch((error) => toast.error(error.message))}>View / download</button><select aria-label="Report status" value={item.status} onChange={(event) => updateReport(item, { status: event.target.value })}>{["Uploaded","Reviewed","Pending"].map((value) => <option key={value}>{value}</option>)}</select><label className="record-share"><input type="checkbox" checked={Boolean(item.patientVisible)} onChange={(event) => updateReport(item, { patientVisible: event.target.checked })} /> Patient can view</label></>}</div></section>)}{!items.length && <div className="clinical-empty">No {status.toLowerCase()} {kind} found.</div>}</div></main></div>;
}
function DoctorAssignmentsPage() {
  const [mode, setMode] = useState("patients");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [doctorIds, setDoctorIds] = useState([]);
  const [appointmentDoctor, setAppointmentDoctor] = useState("");
  const navigate = useNavigate();
  const load = () => get(mode === "patients" ? `/clinical/patients?q=${encodeURIComponent(query)}` : `/appointments?q=${encodeURIComponent(query)}`).then(setRows).catch(() => { clearAuth(); navigate("/admin/login"); });
  useEffect(() => { load(); }, [mode, query]);
  useEffect(() => { get("/clinical/doctors").then(setDoctors).catch((error) => toast.error(error.message)); }, []);
  const choose = (item) => {
    setSelected(item);
    if (mode === "patients") setDoctorIds(item.assignedDoctors?.map((doctor) => doctor._id || doctor) || []);
    else setAppointmentDoctor(item.assignedDoctor?._id || "");
  };
  const save = async () => {
    if (!selected) return;
    try {
      if (mode === "patients") await patch(`/clinical/patients/${selected._id}/assignment`, { doctorIds });
      else await patch(`/appointments/${selected._id}/assignment`, { doctorId: appointmentDoctor || null });
      toast.success("Assignment saved");
      setSelected(null);
      load();
    } catch (error) { toast.error(error.message); }
  };
  const isMainDoctor = localStorage.getItem("lumina_role") !== "doctor";
  if (!isMainDoctor) return <div className="admin-loading">Main Doctor access required.</div>;
  return <div className="clinical-shell"><aside className="admin-sidebar"><Link to="/" className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>Medico<small>Main Doctor</small></span></Link><nav><Link className="clinical-nav-link" to="/doctor">Dashboard</Link><Link className="clinical-nav-link" to="/doctor/appointments">Appointments</Link><Link className="clinical-nav-link" to="/doctor/visits">Patients and visits</Link><Link className="clinical-nav-link" to="/admin?section=doctors">Doctor accounts</Link></nav><button className="logout" onClick={() => { clearAuth(); navigate("/admin/login"); }}>Log out</button></aside><main className="admin-main clinical-main"><div className="admin-top"><div><div className="eyebrow">Team workflow</div><h1>Assignments</h1></div></div><div className="assignment-toolbar"><div className="patient-tabs"><button className={mode === "patients" ? "active" : ""} onClick={() => { setMode("patients"); setSelected(null); }}>Patients</button><button className={mode === "appointments" ? "active" : ""} onClick={() => { setMode("appointments"); setSelected(null); }}>Appointments</button></div><input className="search" placeholder={mode === "patients" ? "Patient name, phone or ID" : "Patient or appointment ID"} value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="assignment-grid"><div className="admin-panel clinical-panel"><div className="clinical-patient-list">{rows.map((item) => <button className="clinical-patient" key={item._id} onClick={() => choose(item)}><span className="patient-avatar">{(mode === "patients" ? item.name : item.patient?.name)?.slice(0,1)}</span><span><strong>{mode === "patients" ? item.name : item.patient?.name}</strong><small>{mode === "patients" ? `${item.patientId} · ${item.phone}` : `${new Date(item.date).toLocaleDateString()} · ${item.time} · ${item.status}`}</small></span></button>)}{!rows.length && <div className="clinical-empty">No records found.</div>}</div></div>{selected && <InfoBlock title={mode === "patients" ? `Assign ${selected.name}` : `Assign appointment for ${selected.patient?.name}`}><div className="doctor-assignment-list">{mode === "patients" ? doctors.filter((doctor) => doctor.status === "Active").map((doctor) => <label className="record-share" key={doctor._id}><input type="checkbox" checked={doctorIds.includes(doctor._id)} onChange={(event) => setDoctorIds((current) => event.target.checked ? [...current, doctor._id] : current.filter((id) => id !== doctor._id))} />{doctor.name} · {doctor.specialization}</label>) : <label className="field clinical-field"><span>Assigned doctor</span><select value={appointmentDoctor} onChange={(event) => setAppointmentDoctor(event.target.value)}><option value="">Unassigned / Main Doctor</option>{doctors.filter((doctor) => doctor.status === "Active").map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name} · {doctor.specialization}</option>)}</select></label>}</div><button className="button button-dark" onClick={save}>Save assignment</button></InfoBlock>}</div></main></div>;
}
function ChamberAvailability() {
  const [availability, setAvailability] = useState([]);
  const [form, setForm] = useState({ dayOfWeek: "1", startTime: "09:00", endTime: "17:00", breakStart: "", breakEnd: "", slotMinutes: "30" });
  const navigate = useNavigate();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const load = () => get("/clinical/availability").then(setAvailability).catch(() => { localStorage.removeItem("lumina_token"); navigate("/admin/login"); });
  useEffect(() => { load(); }, []);
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const save = async (nextAvailability) => {
    const next = [...nextAvailability].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
    try { setAvailability(await patch("/clinical/availability", { availability: next })); toast.success("Chamber hours saved"); }
    catch (error) { toast.error(error.message); }
  };
  const submit = (event) => {
    event.preventDefault();
    const entry = { ...form, dayOfWeek: Number(form.dayOfWeek), slotMinutes: Number(form.slotMinutes) };
    if (entry.startTime >= entry.endTime || Boolean(entry.breakStart) !== Boolean(entry.breakEnd) || (entry.breakStart && (entry.breakStart < entry.startTime || entry.breakEnd > entry.endTime || entry.breakStart >= entry.breakEnd))) { toast.error("Check the working and break times"); return; }
    save([...availability.filter((item) => item.dayOfWeek !== entry.dayOfWeek), entry]);
  };
  return <div className="clinical-shell"><aside className="admin-sidebar"><Link to="/" className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>Medico<small>Main Doctor</small></span></Link><nav><Link className="clinical-nav-link" to="/doctor">Dashboard</Link><Link className="clinical-nav-link" to="/doctor/appointments">Appointments</Link><Link className="clinical-nav-link" to="/doctor/visits">Patients and visits</Link><Link className="clinical-nav-link" to="/admin">Website content</Link></nav><button className="logout" onClick={() => { localStorage.removeItem("lumina_token"); navigate("/admin/login"); }}>Log out</button></aside><main className="admin-main clinical-main"><div className="admin-top"><div><div className="eyebrow">Appointment scheduling</div><h1>Chamber hours</h1></div></div><InfoBlock title="Weekly working hours"><form className="clinical-form-grid availability-form" onSubmit={submit}><label className="field clinical-field"><span>Working day</span><select name="dayOfWeek" value={form.dayOfWeek} onChange={change}>{days.map((day, index) => <option value={index} key={day}>{day}</option>)}</select></label><ClinicalField label="Start" name="startTime" type="time" value={form.startTime} onChange={change} required /><ClinicalField label="End" name="endTime" type="time" value={form.endTime} onChange={change} required /><ClinicalField label="Break starts" name="breakStart" type="time" value={form.breakStart} onChange={change} /><ClinicalField label="Break ends" name="breakEnd" type="time" value={form.breakEnd} onChange={change} /><label className="field clinical-field"><span>Appointment length</span><select name="slotMinutes" value={form.slotMinutes} onChange={change}>{[10, 15, 20, 30, 45, 60].map((minutes) => <option key={minutes}>{minutes}</option>)}</select></label><button className="button button-dark">Save working day</button></form><div className="record-list">{availability.length ? availability.map((entry) => <div className="record-item" key={entry.dayOfWeek}><strong>{days[entry.dayOfWeek]} · {entry.startTime}–{entry.endTime}</strong><span>{entry.breakStart ? `Break ${entry.breakStart}–${entry.breakEnd} · ` : ""}{entry.slotMinutes} minute appointments <button className="delete-button" onClick={() => save(availability.filter((item) => item.dayOfWeek !== entry.dayOfWeek))}>Remove</button></span></div>) : <p className="muted">No chamber hours configured. Online booking stays unavailable until hours are saved.</p>}</div></InfoBlock></main></div>;
}
function AvailabilityManager() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [availability, setAvailability] = useState([]);
  const [form, setForm] = useState({ dayOfWeek: "1", startTime: "09:00", endTime: "17:00", breakStart: "", breakEnd: "", slotMinutes: "30" });
  const navigate = useNavigate();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  useEffect(() => {
    get("/doctors").then((items) => { setDoctors(items); if (items.length) setDoctorId(items[0]._id); }).catch(() => { localStorage.removeItem("lumina_token"); navigate("/admin/login"); });
  }, []);
  useEffect(() => { setAvailability(doctors.find((doctor) => doctor._id === doctorId)?.availability || []); }, [doctorId, doctors]);
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const save = async (nextAvailability) => {
    const next = [...nextAvailability].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
    try {
      const doctor = await patch(`/clinical/doctors/${doctorId}/availability`, { availability: next });
      setDoctors((items) => items.map((item) => item._id === doctorId ? doctor : item));
      setAvailability(next);
      toast.success("Doctor availability saved");
    } catch (error) { toast.error(error.message); }
  };
  const submit = (event) => {
    event.preventDefault();
    const entry = { ...form, dayOfWeek: Number(form.dayOfWeek), slotMinutes: Number(form.slotMinutes) };
    if (entry.startTime >= entry.endTime || Boolean(entry.breakStart) !== Boolean(entry.breakEnd) || (entry.breakStart && (entry.breakStart < entry.startTime || entry.breakEnd > entry.endTime || entry.breakStart >= entry.breakEnd))) { toast.error("Check the working and break times"); return; }
    save([...availability.filter((item) => item.dayOfWeek !== entry.dayOfWeek), entry]);
  };
  return <div className="clinical-shell"><aside className="admin-sidebar"><Link to="/" className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>Medico<small>Doctor availability</small></span></Link><nav><Link className="clinical-nav-link" to="/doctor">Clinical workspace</Link><Link className="clinical-nav-link" to="/admin">Admin content</Link></nav><button className="logout" onClick={() => { localStorage.removeItem("lumina_token"); navigate("/admin/login"); }}>Log out</button></aside><main className="admin-main clinical-main"><div className="admin-top"><div><div className="eyebrow">Appointments</div><h1>Doctor availability</h1></div></div>{doctors.length ? <><label className="field clinical-field"><span>Doctor</span><select value={doctorId} onChange={(event) => setDoctorId(event.target.value)}>{doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name}</option>)}</select></label><InfoBlock title="Working hours"><form className="clinical-form-grid availability-form" onSubmit={submit}><label className="field clinical-field"><span>Working day</span><select name="dayOfWeek" value={form.dayOfWeek} onChange={change}>{days.map((day, index) => <option value={index} key={day}>{day}</option>)}</select></label><ClinicalField label="Start" name="startTime" type="time" value={form.startTime} onChange={change} required /><ClinicalField label="End" name="endTime" type="time" value={form.endTime} onChange={change} required /><ClinicalField label="Break starts" name="breakStart" type="time" value={form.breakStart} onChange={change} /><ClinicalField label="Break ends" name="breakEnd" type="time" value={form.breakEnd} onChange={change} /><label className="field clinical-field"><span>Appointment length</span><select name="slotMinutes" value={form.slotMinutes} onChange={change}>{[10, 15, 20, 30, 45, 60].map((minutes) => <option key={minutes}>{minutes}</option>)}</select></label><button className="button button-dark">Save working day</button></form><div className="record-list">{availability.length ? availability.map((entry) => <div className="record-item" key={entry.dayOfWeek}><strong>{days[entry.dayOfWeek]} · {entry.startTime}–{entry.endTime}</strong><span>{entry.breakStart ? `Break ${entry.breakStart}–${entry.breakEnd} · ` : ""}{entry.slotMinutes} minute appointments <button className="delete-button" onClick={() => save(availability.filter((item) => item.dayOfWeek !== entry.dayOfWeek))}>Remove</button></span></div>) : <p className="muted">No working days configured. Appointment booking will not offer times until a schedule is saved.</p>}</div></InfoBlock></> : <p className="muted">No doctor profiles are in the database yet.</p>}</main></div>;
}
function PatientForm({ onClose, onSaved, patient }) {
  const [form, setForm] = useState(patient || {});
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => { e.preventDefault(); try { if (patient) await patch(`/clinical/patients/${patient._id}`, form); else await post("/clinical/patients", form); toast.success("Patient saved"); onClose(); onSaved(); } catch (error) { toast.error(error.message); } };
  return <div className="clinical-modal"><form className="clinical-form" onSubmit={submit}><div className="panel-heading"><div><div className="eyebrow">Patient information</div><h2>{patient ? "Edit patient" : "Add patient"}</h2></div><button type="button" className="icon-button" onClick={onClose}>×</button></div><div className="clinical-form-grid"><ClinicalField label="Full name" name="name" value={form.name} onChange={change} required /><ClinicalField label="Phone" name="phone" value={form.phone} onChange={change} required /><ClinicalField label="Email" name="email" type="email" value={form.email} onChange={change} required /><ClinicalField label="Date of birth" name="dateOfBirth" type="date" value={form.dateOfBirth?.slice?.(0, 10) || form.dateOfBirth} onChange={change} /><ClinicalField label="Age" name="age" type="number" value={form.age} onChange={change} /><label className="field clinical-field"><span>Gender</span><select name="gender" value={form.gender || ""} onChange={change}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option></select></label><ClinicalField label="Emergency contact" name="emergencyContact" value={form.emergencyContact} onChange={change} /><ClinicalField label="Blood group" name="bloodGroup" value={form.bloodGroup} onChange={change} /><ClinicalField label="Occupation" name="occupation" value={form.occupation} onChange={change} /><ClinicalArea label="Address" name="address" value={form.address} onChange={change} /><ClinicalArea label="Other notes" name="notes" value={form.notes} onChange={change} /></div><div className="clinical-form-actions"><button type="button" className="button button-ghost-dark" onClick={onClose}>Cancel</button><button className="button button-dark">Save patient</button></div></form></div>;
}
function PatientProfile({ patientId, onBack }) {
  const [data, setData] = useState(null); const [active, setActive] = useState("overview"); const [showEdit, setShowEdit] = useState(false); const load = () => get(`/clinical/patients/${patientId}`).then(setData).catch(() => toast.error("Unable to load patient")); useEffect(() => { load(); }, [patientId]);
  if (!data) return <div className="admin-loading">Loading patient record...</div>;
  const { patient, record, appointments } = data;
  const updateRecord = async (payload) => { try { await patch(`/clinical/patients/${patientId}/record`, payload); toast.success("Clinical record updated"); load(); } catch (error) { toast.error(error.message); } };
  return <><div className="patient-profile-head"><button className="arrow-link" onClick={onBack}>← All patients</button><div className="patient-heading"><div><div className="eyebrow">{patient.patientId || "Patient record"}</div><h1>{patient.name}</h1><p>{patient.phone} · {patient.email}</p></div><button className="button button-dark" onClick={() => setShowEdit(true)}>Edit profile</button></div></div><div className="patient-tabs">{[["overview","Overview"],["history","Medical history"],["exam","Examination"],["chart","Dental chart"],["care","Care plan"],["timeline","Timeline"]].map(([key,label]) => <button className={active === key ? "active" : ""} onClick={() => setActive(key)} key={key}>{label}</button>)}</div><div className="patient-profile-content">{active === "overview" && <><InfoBlock title="Patient information"><div className="info-grid"><Info label="Patient ID" value={patient.patientId} /><Info label="Date of birth" value={patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "Not added"} /><Info label="Gender" value={patient.gender} /><Info label="Address" value={patient.address} /><Info label="Emergency contact" value={patient.emergencyContact} /><Info label="Blood group" value={patient.bloodGroup} /></div></InfoBlock><InfoBlock title="Chief complaint"><RecordEditor record={record} field="chiefComplaint" onSave={updateRecord} fields={[["complaint","Chief complaint"],["problemDescription","Problem description"],["duration","Duration"],["severity","Severity"],["symptoms","Symptoms"],["patientConcerns","Patient concerns"]]} /></InfoBlock><InfoBlock title="Appointments"><div className="clinical-appointments">{appointments.map(item => <div className="appointment-row" key={item._id}><strong>{new Date(item.date).toLocaleDateString()} · {item.time}</strong><span>{item.service?.name} · {item.status}</span></div>)}</div></InfoBlock></>}{active === "history" && <InfoBlock title="Medical history"><RecordEditor record={record} field="medicalHistory" onSave={updateRecord} fields={[["existingConditions","Existing conditions"],["previousSurgeries","Previous surgeries"],["allergies","Allergies"],["currentMedications","Current medications"],["familyHistory","Family history"],["habits","Relevant habits"],["previousDentalTreatment","Previous dental treatment"],["otherNotes","Other notes"]]} /></InfoBlock>}{active === "exam" && <InfoBlock title="Dental examination"><RecordEditor record={record} field="examination" onSave={updateRecord} fields={[["generalExamination","General examination"],["oralHygiene","Oral hygiene"],["gumCondition","Gum condition"],["toothCondition","Tooth condition"],["plaque","Plaque"],["calculus","Calculus"],["gingivalCondition","Gingival condition"],["oralSoftTissueFindings","Oral soft tissue findings"]]} /><RecordAdder title="Investigation / test report" endpoint="investigations" fields={[["testName","Test name"],["reason","Reason"],["date","Date"],["result","Result"],["doctorNotes","Doctor notes"],["reportUrl","Report URL"]]} patientId={patientId} onSaved={load} items={record.investigations} /></InfoBlock>}{active === "chart" && <DentalChart record={record} patientId={patientId} onSaved={load} />}{active === "care" && <><InfoBlock title="Diagnosis"><RecordAdder title="Add diagnosis" endpoint="diagnosis" fields={[["primaryDiagnosis","Primary diagnosis"],["secondaryDiagnosis","Secondary diagnosis"],["clinicalNotes","Clinical notes"]]} patientId={patientId} onSaved={load} items={record.diagnosis} /></InfoBlock><InfoBlock title="Treatment plans"><RecordAdder title="Add treatment plan" endpoint="treatmentPlans" fields={[["tooth","Tooth"],["problem","Problem"],["treatment","Recommended treatment"],["priority","Priority"],["estimatedVisits","Estimated visits"],["plannedDate","Planned date"],["notes","Notes"]]} patientId={patientId} onSaved={load} items={record.treatmentPlans} /></InfoBlock><InfoBlock title="Prescriptions"><RecordAdder title="Add prescription" endpoint="prescriptions" fields={[["medicineName","Medicine name"],["dose","Dose"],["frequency","Frequency"],["duration","Duration"],["instructions","Instructions"]]} patientId={patientId} onSaved={load} items={record.prescriptions} /></InfoBlock><InfoBlock title="Follow-ups"><RecordAdder title="Add follow-up" endpoint="followUps" fields={[["followUpDate","Follow-up date"],["reason","Reason"],["notes","Notes"],["treatmentProgress","Treatment progress"],["nextFollowUpDate","Next follow-up date"]]} patientId={patientId} onSaved={load} items={record.followUps} /></InfoBlock></>}{active === "timeline" && <InfoBlock title="Complete patient timeline"><div className="timeline">{[...(record.timeline || [])].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).map(item => <div className="timeline-item" key={item._id || item.createdAt}><span>{new Date(item.createdAt).toLocaleDateString()}</span><strong>{item.title}</strong><p>{item.notes}</p></div>)}</div></InfoBlock>}</div>{showEdit && <PatientForm patient={patient} onClose={() => setShowEdit(false)} onSaved={load} />}</>;
}
function Info({ label, value }) { return <div><small>{label}</small><strong>{value || "Not added"}</strong></div>; }
function InfoBlock({ title, children }) { return <section className="info-block"><div className="block-heading"><div className="eyebrow">Clinical record</div><h2>{title}</h2></div>{children}</section>; }
function RecordEditor({ record, field, fields, onSave }) { const [form, setForm] = useState(record[field] || {}); const change = e => setForm({ ...form, [e.target.name]: e.target.value }); return <><div className="clinical-form-grid">{fields.map(([name,label]) => <ClinicalArea key={name} label={label} name={name} value={form[name]} onChange={change} />)}</div><button className="button button-dark" onClick={() => onSave({ [field]: form, timelineNote: `${field} updated` })}>Save section</button></>; }
function RecordAdder({ title, endpoint, fields, patientId, onSaved, items = [] }) {
  const [form, setForm] = useState({});
  const [open, setOpen] = useState(false);
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    try {
      await post(`/clinical/patients/${patientId}/${endpoint}`, form);
      toast.success(`${title} saved`);
      setForm({});
      setOpen(false);
      onSaved();
    } catch (error) { toast.error(error.message); }
  };
  return <div className="record-adder">
    <div className="block-heading"><h3>{title}</h3><button type="button" className="button button-small" onClick={() => setOpen(!open)}>{open ? "Close" : "Add"}</button></div>
    {open && <form className="clinical-form-grid" onSubmit={submit}>
      {fields.map(([name, label]) => name.toLowerCase().includes("notes") || name === "result" || name === "instructions" || name === "clinicalNotes"
        ? <ClinicalArea key={name} label={label} name={name} value={form[name]} onChange={change} />
        : <ClinicalField key={name} label={label} name={name} type={name.toLowerCase().includes("date") ? "date" : name === "estimatedVisits" ? "number" : "text"} value={form[name]} onChange={change} required={name === "testName" || name === "treatment" || name === "medicineName" || name === "followUpDate"} />)}
      {["investigations", "prescriptions"].includes(endpoint) && <label className="record-share"><input type="checkbox" checked={Boolean(form.patientVisible)} onChange={(event) => setForm({ ...form, patientVisible: event.target.checked })} /> Make {endpoint === "investigations" ? "report" : "prescription"} available to patient</label>}
      <button className="button button-dark">Save record</button>
    </form>}
    <div className="record-list">{items.map((item) => <div className="record-item" key={item._id}><strong>{item.primaryDiagnosis || item.treatment || item.medicineName || item.testName || item.reason}</strong><span>{item.result || item.instructions || item.status || item.notes || "Recorded"}{item.patientVisible && " · Shared with patient"}</span></div>)}</div>
  </div>;
}
function DentalChart({ record, patientId, onSaved }) {
  const [form, setForm] = useState({ toothNumber: "", problem: "", diagnosis: "", severity: "", symptoms: "", treatmentRequired: "", notes: "" });
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const permanentTeeth = ["18","17","16","15","14","13","12","11","21","22","23","24","25","26","27","28","48","47","46","45","44","43","42","41","31","32","33","34","35","36","37","38"];
  const primaryTeeth = ["55","54","53","52","51","61","62","63","64","65","85","84","83","82","81","71","72","73","74","75"];
  const history = record.toothFindings?.filter((item) => item.toothNumber === form.toothNumber) || [];
  const submit = async (event) => {
    event.preventDefault();
    try {
      await post(`/clinical/patients/${patientId}/toothFindings`, form);
      toast.success(`Tooth ${form.toothNumber} saved`);
      setForm((current) => ({ ...current, problem: "", diagnosis: "", severity: "", symptoms: "", treatmentRequired: "", notes: "" }));
      onSaved();
    } catch (error) { toast.error(error.message); }
  };
  return <InfoBlock title="Dental chart">
    {[permanentTeeth, primaryTeeth].map((row, index) => <div className="tooth-grid" key={index}>{row.map((tooth) => <button className={`${record.toothFindings?.some((item) => item.toothNumber === tooth) ? "tooth marked" : "tooth"} ${form.toothNumber === tooth ? "selected" : ""}`} key={tooth} type="button" aria-pressed={form.toothNumber === tooth} onClick={() => setForm((current) => ({ ...current, toothNumber: tooth }))}>{tooth}</button>)}</div>)}
    <form className="clinical-form-grid tooth-form" onSubmit={submit}>
      <ClinicalField label="Selected tooth" name="toothNumber" value={form.toothNumber} onChange={change} required />
      <ClinicalField label="Problem" name="problem" value={form.problem} onChange={change} placeholder="Describe the tooth condition" />
      <ClinicalField label="Diagnosis" name="diagnosis" value={form.diagnosis} onChange={change} />
      <label className="field clinical-field"><span>Severity</span><select name="severity" value={form.severity} onChange={change}><option value="">Select</option><option>Mild</option><option>Moderate</option><option>Severe</option></select></label>
      <ClinicalField label="Symptoms" name="symptoms" value={form.symptoms} onChange={change} />
      <ClinicalArea label="Treatment required" name="treatmentRequired" value={form.treatmentRequired} onChange={change} />
      <ClinicalArea label="Notes" name="notes" value={form.notes} onChange={change} />
      <button className="button button-dark">Save tooth finding</button>
    </form>
    <div className="record-list">{form.toothNumber && <h3>Tooth {form.toothNumber} history</h3>}{history.map((item) => <div className="record-item" key={item._id}><strong>{new Date(item.createdAt).toLocaleDateString()} · {item.problem || item.diagnosis || "Finding"}</strong><span>{[item.severity,item.diagnosis,item.treatmentRequired,item.notes].filter(Boolean).join(" · ")}</span></div>)}{record.toothFindings?.filter((item) => item.toothNumber !== form.toothNumber).map((item) => <div className="record-item" key={item._id}><strong>Tooth {item.toothNumber} · {item.problem || item.diagnosis}</strong><span>{item.severity || ""} {item.treatmentRequired || item.notes || ""}</span></div>)}</div>
  </InfoBlock>;
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:slug" element={<ServiceDetails />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogDetails />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/appointment/success" element={<Success />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/doctor/login" element={<Login doctor />} />
      <Route path="/patient/login" element={<PatientAccess />} />
      <Route path="/patient/register" element={<PatientAccess register />} />
      <Route path="/patient" element={<PatientPortal />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/doctor" element={<DoctorWorkspace />} />
      <Route path="/doctor/availability" element={<ChamberAvailability />} />
      <Route path="/doctor/visits" element={<VisitManager />} />
      <Route path="/doctor/appointments" element={<MainDoctorAppointmentDesk />} />
      <Route path="/doctor/tests" element={<DoctorQueuePage kind="tests" />} />
      <Route path="/doctor/reports" element={<DoctorQueuePage kind="reports" />} />
      <Route path="/doctor/assignments" element={<DoctorAssignmentsPage />} />
    </Routes>
  );
}

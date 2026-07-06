/**
 * All page copy + data. Sourced from Mahmoud's portfolio repo
 * (github.com/Mahmoud-s-programs/Advanced-PW) and the live GitHub profile:
 * technologies, work experience, featured projects (with real screenshots +
 * repo links), the archive of smaller repos, and testimonials.
 */
import newsAg from '../assets/projects/newsAg.png'
import apw from '../assets/projects/apw.png'
import chatapp from '../assets/projects/chatapp.png'
import calc from '../assets/projects/calc.png'
import basicportfolio from '../assets/projects/basicportfolio.png'
import solarsystem from '../assets/projects/solarsystem.png'
import imageconverter from '../assets/projects/imageconverter.png'
import dsa from '../assets/projects/dsa.png'

/** What I do — the four disciplines from the About section */
export const SERVICES = [
  'Web Developer',
  'Game Developer',
  'Backend Developer',
  'AI Developer',
]

/** Skill galaxy nodes — orbit radius ~ hours absorbed (inner = more) */
export const SKILLS = [
  { name: 'JavaScript', r: 1.6 },
  { name: 'Python', r: 1.7 },
  { name: 'React JS', r: 1.9 },
  { name: 'Node JS', r: 2.1 },
  { name: 'HTML 5', r: 2.4 },
  { name: 'CSS 3', r: 2.6 },
  { name: 'Java', r: 2.8 },
  { name: 'SQL Server', r: 3.0 },
  { name: 'MongoDB', r: 3.2 },
  { name: 'Three JS', r: 3.4 },
  { name: 'Tailwind CSS', r: 3.6 },
  { name: 'Git', r: 3.8 },
  { name: 'Docker', r: 4.0 },
]

export const TIMELINE = [
  {
    year: '2022',
    title: 'General Labourer',
    meta: 'Personnel By Elsie · May – Sep 2022',
    body: 'Loaded raw metal into hydraulic and mechanical stamping presses, inspected stamped parts for burrs, cracks and missed punches, and kept the floor to 5S standards.',
    depth: 0.06,
  },
  {
    year: '2023',
    title: 'Machine Operator',
    meta: 'Accu-Staff · Apr – Jul 2023',
    body: 'Ran injection molding machines producing 200+ automotive components daily at a 98% defect-free rate, with daily equipment checks supporting just-in-time manufacturing.',
    depth: -0.05,
  },
  {
    year: '2023',
    title: 'Software Dev Team Lead',
    meta: 'Vosyn Inc · Jul – Oct 2023',
    body: 'Led a 25-member team building a voice synthesis platform with Python, TensorFlow and PyTorch — shipped the MVP in 5 weeks with Flask, integrating PaLM 2 and VALL-E TTS, and boosted team output 20% with Jira and Docker.',
    depth: 0.07,
  },
  {
    year: '2024',
    title: 'Production Associate',
    meta: 'The Job Shoppe · Nov 2023 – Nov 2024',
    body: 'Operated high-volume industrial digital printers for custom marketing materials with 100% adherence to job specs, on a team hitting 99% of production goals through peak seasons.',
    depth: -0.06,
  },
  {
    year: '2025',
    title: 'General Labourer',
    meta: 'Cleveland-Cliffs · Jul – Oct 2025',
    body: 'Performed part inspections against quality standards, operated laser machines for production, and supported forklift operations during high-demand periods.',
    depth: 0.05,
  },
  {
    year: 'Now',
    title: 'Forklift Operator',
    meta: 'ProStaff · Oct 2025 – Present',
    body: 'Operating forklifts and material handling equipment across the production floor, maintaining 99% accuracy in inventory movement, tracking and documentation.',
    depth: -0.07,
  },
]

/** Featured work — the big magnetic cards */
export const PROJECTS = [
  {
    id: 'dsa-visuals',
    idx: '/01',
    title: 'DSA Visualizer',
    art: 'art-1',
    image: dsa,
    tags: ['VISUALIZER', 'JAVASCRIPT'],
    blurb: 'Data structures and algorithms running step-by-step, animated and explained.',
    detail:
      'An interactive web application for visualizing fundamental data structures and algorithms in action. DSAV walks learners and educators through every operation step-by-step, with animations, plain-language explanations, and the code snippets driving each move.',
    stack: ['JavaScript', 'Animations', 'Algorithms', 'Data structures'],
    repo: 'https://github.com/Mahmoud-s-programs/dsa-visuals',
  },
  {
    id: 'news-aggregator',
    idx: '/02',
    title: 'News Aggregator',
    art: 'art-2',
    image: newsAg,
    tags: ['JAVASCRIPT', 'CSS', 'HTML'],
    blurb: 'Instant, relevant articles from trusted global sources — any topic, anytime.',
    detail:
      'Discover the latest news on any topic, anytime. The News Aggregator platform is an advanced, user-friendly system that pulls instant, relevant articles from trusted global sources into one clean stream.',
    stack: ['JavaScript', 'CSS', 'HTML'],
    repo: 'https://github.com/Mahmoud-s-programs/News-Aggregator-',
  },
  {
    id: '3d-portfolio',
    idx: '/03',
    title: '3D Portfolio Website',
    art: 'art-3',
    image: apw,
    tags: ['REACT', 'THREEJS', 'TAILWIND'],
    blurb: 'An immersive, interactive 3D environment that brings every project to life.',
    detail:
      'Experience the future of portfolios: a 3D website built with ReactJS and ThreeJS. This innovative platform showcases projects in an immersive, interactive 3D environment, bringing every detail to life.',
    stack: ['React JS', 'Three JS', 'Tailwind CSS'],
    repo: 'https://github.com/Mahmoud-s-programs/Advanced-PW',
  },
  {
    id: 'chat-app',
    idx: '/04',
    title: 'Chat App',
    art: 'art-4',
    image: chatapp,
    tags: ['NEXTJS', 'REACTJS', 'CSS'],
    blurb: 'Seamless, secure communication guarded by robust data privacy.',
    detail:
      'Secure, worry-free communication built with ReactJS. The chat app allows seamless interaction with anyone, safeguarded by robust data privacy measures.',
    stack: ['Next.js', 'React JS', 'CSS'],
    repo: 'https://github.com/Mahmoud-s-programs/Chat-App',
  },
  {
    id: 'image-converter',
    idx: '/05',
    title: 'Image Converter',
    art: 'art-1',
    image: imageconverter,
    tags: ['WEB TOOL', 'JAVASCRIPT'],
    blurb: 'Drop an image, pick a format, download — conversion right in the browser.',
    detail:
      'A clean web tool for converting images between formats: drop a file in, choose the target format, and download the result. Later rebuilt in TypeScript as the advanced-image-converter.',
    stack: ['JavaScript', 'CSS', 'HTML'],
    repo: 'https://github.com/Mahmoud-s-programs/Image-Converter',
  },
  {
    id: 'web-calculator',
    idx: '/06',
    title: 'Web Calculator',
    art: 'art-2',
    image: calc,
    tags: ['CSS', 'HTML'],
    blurb: 'Free math on the web, wrapped in a living animated background.',
    detail:
      'Do your math calculations on the web for free — with an interesting animated background that makes even arithmetic feel alive.',
    stack: ['CSS', 'HTML'],
    repo: 'https://github.com/Mahmoud-s-programs/Web-Calculator',
  },
  {
    id: 'basic-portfolio',
    idx: '/07',
    title: 'Basic Portfolio',
    art: 'art-3',
    image: basicportfolio,
    tags: ['CSS', 'HTML', 'JAVASCRIPT'],
    blurb: 'A clean starter portfolio template that anyone can make their own.',
    detail:
      'A portfolio template for non-developers and junior developers alike — deliberately easy to read, easy to modify, and quick to ship as your own.',
    stack: ['CSS', 'HTML', 'JavaScript'],
    repo: 'https://github.com/Mahmoud-s-programs/basic-portfolio',
  },
  {
    id: 'solar-system',
    idx: '/08',
    title: 'Solar System',
    art: 'art-4',
    image: solarsystem,
    tags: ['JAVA', 'JAVA3D'],
    blurb: 'The entire solar system, rendered on your computer in Java3D.',
    detail:
      'Are you a space nerd too? The entire solar system on your computer, built with Java and Java3D. Follow the steps in the README to launch it and wander the planets.',
    stack: ['Java', 'Java3D'],
    repo: 'https://github.com/Mahmoud-s-programs/Solar-System-using-java3D',
  },
]

/** The rest of the GitHub profile — compact archive cards */
export const ARCHIVE = [
  {
    name: 'Personal Blog',
    desc: 'MERN-stack personal blog with a clean, responsive Tailwind UI and JWT-based admin authentication.',
    lang: 'JavaScript',
    repo: 'https://github.com/Mahmoud-s-programs/personal-blog-website',
  },
  {
    name: 'K-Means Simulation',
    desc: 'Feed it points and centroids, then watch the Lloyd–Forgy clustering algorithm converge live.',
    lang: 'C++',
    repo: 'https://github.com/Mahmoud-s-programs/k-means-simulation-Lloyd-Forgy-',
  },
  {
    name: 'GTK4 Video Player',
    desc: 'A video player built on GTK4 and ffmpeg.',
    lang: 'C',
    repo: 'https://github.com/Mahmoud-s-programs/GTK4-Video-Player',
  },
  {
    name: 'WASAPI Synth',
    desc: 'Artificial sound generation straight through the Windows audio stack.',
    lang: 'C',
    repo: 'https://github.com/Mahmoud-s-programs/WASAPI',
  },
  {
    name: 'Image Color Picker',
    desc: 'Read the pixel color at any point of an image, with a live swatch widget and printed color code.',
    lang: 'C',
    repo: 'https://github.com/Mahmoud-s-programs/image-color-picker',
  },
  {
    name: 'Frame Retriever',
    desc: 'Snatch any single frame out of a video by its number, via GTK4.',
    lang: 'C',
    repo: 'https://github.com/Mahmoud-s-programs/Frame-Retriever',
  },
  {
    name: 'Cairo Pixel Values',
    desc: 'Set and get pixel values in Cairo graphics.',
    lang: 'C',
    repo: 'https://github.com/Mahmoud-s-programs/Git-Pixel-Values',
  },
  {
    name: 'Advanced Image Converter',
    desc: 'The Image Converter, rebuilt in TypeScript.',
    lang: 'TypeScript',
    repo: 'https://github.com/Mahmoud-s-programs/advanced-image-converter',
  },
  {
    name: 'Task Manager',
    desc: 'Fast, reliable task manager with full add, update, and delete flows.',
    lang: 'App',
    repo: 'https://github.com/Mahmoud-s-programs/Task-Manager',
  },
  {
    name: 'Computer Science Hub',
    desc: 'Courses, tutorials, and shared resources to onboard new computer science students.',
    lang: 'HTML',
    repo: 'https://github.com/Mahmoud-s-programs/Computer-Science-Hub',
  },
  {
    name: 'Weather Dashboard',
    desc: 'City weather at a glance in a clean dashboard.',
    lang: 'CSS',
    repo: 'https://github.com/Mahmoud-s-programs/Weather-dashboard',
  },
  {
    name: 'Tic-Tac-Toe',
    desc: 'The simple, popular classic, implemented in React.',
    lang: 'React',
    repo: 'https://github.com/Mahmoud-s-programs/TicTacTo-using-React',
  },
]

export const TESTIMONIALS = [
  {
    quote:
      'Mahmoud has helped me immensely during the winter of 2022 when we built projects together.',
    name: 'Ali Alsalkhadi',
    role: 'Software Developer · University of Windsor',
  },
  {
    quote:
      'I cannot thank Mahmoud enough for the beautiful portfolio he built for me.',
    name: 'Ahmad Kouaissem',
    role: 'Student · University of Windsor',
  },
  {
    quote:
      'Thanks to Mahmoud, I can confidently showcase the websites he and I developed.',
    name: 'Kareem Sawatri',
    role: 'Student · University of Windsor',
  },
  {
    quote:
      'Mahmoud and I worked on a couple of projects together and I look forward to doing more.',
    name: 'Hala',
    role: 'Student · University of Windsor',
  },
]

export const MANIFESTO = [
  { t: 'Software' },
  { t: "shouldn't" },
  { t: 'just' },
  { t: 'work' },
  { t: '—' },
  { t: 'it' },
  { t: 'should' },
  { t: 'move,', accent: 'rose' },
  { t: 'respond,' },
  { t: 'and' },
  { t: 'remember' },
  { t: 'you.' },
  { t: 'I' },
  { t: 'like' },
  { t: 'to' },
  { t: 'build' },
  { t: 'the' },
  { t: 'projects' },
  { t: 'others' },
  { t: "wouldn't" },
  { t: 'dare', accent: 'cyan' },
  { t: 'touch.', accent: 'cyan' },
]

export const LINKS = {
  email: 'mahmoudalkwisem@gmail.com',
  github: 'https://github.com/Mahmoud-s-programs',
  website: 'https://mahmoudalkwisem.com',
}

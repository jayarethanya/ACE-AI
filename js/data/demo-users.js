/**
 * ACE AI Demo Users Dataset
 * Pre-configured student profiles and organizer account for live interactive evaluation.
 */

export const DEMO_USERS = {
  // DEMO STUDENT 1: AI & Data Science Student (Jaya)
  student1: {
    id: "user-jaya-101",
    name: "Jaya Sundaram",
    email: "jaya.ai@example.edu",
    role: "student",
    department: "Artificial Intelligence & Data Science",
    year: "3rd Year B.Tech",
    college: "Anna University / IIT Madras Hub",
    location: "Chennai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    skills: ["Python", "Machine Learning", "Pandas"],
    interests: ["Artificial Intelligence", "Data Science", "Computer Vision"],
    career_goal: "Machine Learning Engineer",
    experience_level: "Intermediate",
    bio: "Passionate AI & Data Science undergraduate focused on predictive health systems, neural networks, and scalable ML pipelines."
  },

  // DEMO STUDENT 2: Computer Science & Web Developer (Alex)
  student2: {
    id: "user-alex-102",
    name: "Alex Chen",
    email: "alex.web@example.edu",
    role: "student",
    department: "Computer Science and Engineering",
    year: "2nd Year B.Tech",
    college: "PES University",
    location: "Bengaluru",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    interests: ["Web Development", "UI/UX", "Cloud Computing"],
    career_goal: "Frontend Developer",
    experience_level: "Intermediate",
    bio: "Frontend enthusiast obsessed with reactive state architectures, interactive UI animations, and clean modern web apps."
  },

  // DEMO STUDENT 3: Cyber Security Student (Sam)
  student3: {
    id: "user-sam-103",
    name: "Samira Patel",
    email: "samira.sec@example.edu",
    role: "student",
    department: "Cyber Security & Information Assurance",
    year: "4th Year B.Tech",
    college: "IIIT Hyderabad",
    location: "Hyderabad",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    skills: ["Python", "Networking", "Linux"],
    interests: ["Cyber Security", "Ethical Hacking", "Cloud Computing"],
    career_goal: "Cyber Security Analyst",
    experience_level: "Advanced",
    bio: "Aspiring cyber security defender and CTF competitor with interests in penetration testing, packet analysis, and zero-trust security."
  },

  // DEMO ORGANIZER: TechFest & Hackathon Lead
  organizer: {
    id: "org-raman-201",
    name: "Dr. K. Raman",
    email: "raman.events@techfest.org",
    role: "organizer",
    organization: "National Innovation Council & University Hack Hub",
    location: "Chennai",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    title: "Chief Event Coordinator & Dean of Innovation"
  }
};

export const COMMON_SKILLS = [
  "Python", "Machine Learning", "Deep Learning", "Pandas", "Scikit-Learn", "NLP", "LLM", "Generative AI",
  "JavaScript", "TypeScript", "React", "Next.js", "HTML", "CSS", "Tailwind CSS", "Node.js",
  "SQL", "Data Analysis", "Cloud Computing", "AWS", "Docker", "Kubernetes", "Linux", "Networking",
  "Cyber Security", "Ethical Hacking", "Penetration Testing", "IoT", "Embedded C", "Robotics", "C++", "Computer Vision"
];

export const COMMON_INTERESTS = [
  "Artificial Intelligence", "Data Science", "Web Development", "Cyber Security",
  "Cloud Computing", "IoT", "Robotics", "Ethical Hacking", "UI/UX", "Blockchain", "DevOps"
];

export const CAREER_GOALS = [
  "Machine Learning Engineer", "AI Engineer", "Data Scientist", "Data Analyst",
  "Frontend Developer", "Full Stack Developer", "Software Engineer",
  "Cyber Security Analyst", "Security Engineer", "Cloud Engineer", "DevOps Engineer",
  "IoT Engineer", "Robotics Engineer"
];

export const DEPARTMENTS = [
  "Artificial Intelligence & Data Science",
  "Computer Science and Engineering",
  "Information Technology",
  "Electronics and Communication Engineering",
  "Cyber Security & Information Assurance",
  "Electrical and Electronics Engineering",
  "Mechanical & Automation Engineering"
];

export const LOCATIONS = [
  "Chennai", "Bengaluru", "Hyderabad", "Mumbai", "Delhi NCR", "Pune", "Online"
];

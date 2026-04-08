/**
 * SEED SCRIPT — Run once from Admin Dashboard
 *
 * Transfers existing static project data into Firebase Firestore.
 *
 * NOTE: Photos will be empty until uploaded manually via Cloudinary
 * from Admin Panel > Projects / Team.
 */

import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "../firebase";

// Static project data (no photos yet — upload via Cloudinary from Admin Panel)
const staticProjects = [
  {
    title: "Associate Architect",
    slug: "associate-architect",
    location: "USA",
    category: "Residential",
    description: "Collaboration on residential architecture projects as Associate Architect.",
    status: "Built",
    role: "Associate Architect",
    imageUrl: "", // Ngarko foton nga admin panel
    gallery: [],
  },
  {
    title: "AirBnB",
    slug: "airbnb",
    location: "USA",
    category: "Residential",
    description: "Short-term rental property design with modern amenities.",
    status: "Built",
    role: "Project designer, Technical Drawings.",
    imageUrl: "",
    gallery: [],
  },
  {
    title: "HHR",
    slug: "hhr",
    location: "USA",
    category: "Residential",
    description: "High-end residential design.",
    status: "Built",
    imageUrl: "",
    gallery: [],
  },
  {
    title: "HV Smart City",
    slug: "hv-smart-city",
    location: "USA",
    category: "Data Center / Sustainability",
    description: "Concept of a smart, eco, zero carbon emission city using materials like cork, bamboo, and rammed earth.",
    status: "Under Construction",
    imageUrl: "",
    gallery: [],
  },
  {
    title: "Helsinki Hybrid",
    slug: "helsinki-hybrid",
    location: "Norway",
    category: "Data Center / Sustainability",
    description: "Organic Data Center (ODC) concept employing heat produced in facilities for the food industry (greenhouses).",
    status: "Unbuilt",
    imageUrl: "",
    gallery: [],
  },
  {
    title: "Project Energos",
    slug: "project-energos",
    location: "Reno, NV, USA",
    category: "Data Center",
    description: "First zero-net/carbon large scale data center. Features on-site renewable energy storage and low-carbon concrete facade.",
    status: "Unbuilt",
    imageUrl: "",
    gallery: [],
  },
  {
    title: "Technical Drawings 2",
    slug: "technical-drawings-eurocode",
    location: "Europe",
    category: "Technical Design",
    description: "Technical Drawings of different projects based on European Code (concrete, steel, wood).",
    status: "Built",
    imageUrl: "",
    gallery: [],
  },
  {
    title: "Technical Drawings",
    slug: "technical-drawings-usa",
    location: "USA",
    category: "Technical Design",
    description: "Technical Drawings of different projects based on USA Code.",
    status: "Built",
    imageUrl: "",
    gallery: [],
  },
  {
    title: "Cabin on the Woods",
    slug: "cabin-on-the-woods",
    location: "Worldwide",
    category: "Residential",
    description: "A retreat project integrated into forested environments.",
    status: "Unbuilt",
    role: "Project designer, Technical Drawings.",
    imageUrl: "",
    gallery: [],
  },
  {
    title: "Ranch House",
    slug: "ranch-house",
    location: "USA",
    category: "Residential",
    description: "Custom ranch-style residential design.",
    status: "Built",
    role: "Project designer, Technical Drawings.",
    imageUrl: "",
    gallery: [],
  },
  {
    title: "2 Story Residence",
    slug: "2-story-residence",
    location: "USA",
    category: "Residential",
    description: "Complex with two residences (one 2-story, one single) on the same plot.",
    status: "Under Construction",
    role: "Project designer, Technical Drawings.",
    imageUrl: "",
    gallery: [],
  },
  {
    title: "Multigeneration Residence",
    slug: "multigeneration-residence",
    location: "KY, USA",
    category: "Residential",
    description: "Residential project designed for multi-generational living.",
    status: "Under Construction",
    role: "Project designer, Technical Drawings.",
    imageUrl: "",
    gallery: [],
  },
  {
    title: "Remodeling Residence AZ",
    slug: "remodeling-residence-az",
    location: "AZ, USA",
    category: "Residential",
    description: "Comprehensive remodeling of an existing residence.",
    status: "Built",
    role: "Project designer, Technical Drawings.",
    imageUrl: "",
    gallery: [],
  },
  {
    title: "Barndominium Residence",
    slug: "barndominium-residence",
    location: "USA",
    category: "Residential",
    description: "A combination of a barn and a condominium, focusing on spacious living and industrial aesthetics.",
    status: "Built",
    role: "Project designer, Technical Drawings.",
    imageUrl: "",
    gallery: [],
  },
  {
    title: "Residence",
    slug: "residence-new-moon-way",
    location: "New Moon Way, AZ, USA",
    category: "Residential",
    description: "High-end residential design in Arizona.",
    status: "Built",
    imageUrl: "",
    gallery: [],
  },
  {
    title: "Sustainable Material",
    slug: "sustainable-material",
    location: "Worldwide",
    category: "Data Center / Sustainability",
    description: "Research and application of sustainable building materials.",
    status: "Concept",
    imageUrl: "",
    gallery: [],
  },
  {
    title: "ER Project",
    slug: "er-project",
    location: "USA",
    category: "Residential",
    description: "Residential architecture project.",
    status: "Built",
    imageUrl: "",
    gallery: [],
  },
];

export const seedProjects = async () => {
  try {
    const existing = await getDocs(collection(db, "projects"));
    if (existing.size > 0) {
      return { success: false, message: `Firestore already has ${existing.size} projects. Manage them from Admin Panel > Projects.` };
    }

    let count = 0;
    for (const project of staticProjects) {
      await addDoc(collection(db, "projects"), {
        ...project,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      count++;
    }

    return { success: true, message: `${count} projects imported! Now upload photos from Admin Panel > Projects.` };
  } catch (err) {
    return { success: false, message: "Error: " + err.message };
  }
};

export const seedTeam = async () => {
  try {
    // Check if any member already exists
    const existing = await getDocs(collection(db, "team"));
    if (existing.size > 0) {
      return { success: false, message: `Team already has ${existing.size} member(s) in Firestore. Manage them from Admin Panel > Team.` };
    }

    await addDoc(collection(db, "team"), {
      name: "Ersid Mandija",
      role: "Founder / Principal Architect",
      bio1: "With 7 years of professional experience, Ersid Mandija is an architect specializing in residential architecture and interior design. He has collaborated with architecture studios on projects across the United States, Australia, and Europe, contributing to a wide range of residential and interior developments.",
      bio2: "His work spans multiple project phases, with strong experience in Design Development (DD) through Construction Documentation (CDs). Ersid is highly skilled in producing detailed technical drawings, coordinated construction sets, and precise architectural documentation that support the successful execution of projects.",
      bio3: "Throughout his career, he has developed extensive expertise in AutoCAD drafting, architectural detailing, and contribution in preparation of permit and construction drawings. His experience working with international teams has also given him a strong understanding of different architectural standards, workflows, and remote collaboration environments.",
      imageUrl: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, message: "Team data imported! Upload the photo from Admin Panel > Team." };
  } catch (err) {
    return { success: false, message: "Error: " + err.message };
  }
};

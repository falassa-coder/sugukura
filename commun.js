// ============================================================
// SUGUKURA — socle partagé par toutes les pages
// (config Firebase, catégories, utilitaires, en-tête, pied de page)
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCHwyLj90IFVp25Xz6qWFrh8612vj4QQ0s",
  authDomain: "parc-auto-19b48.firebaseapp.com",
  projectId: "parc-auto-19b48",
  storageBucket: "parc-auto-19b48.firebasestorage.app",
  messagingSenderId: "1015165261940",
  appId: "1:1015165261940:web:37d0c01d46609e13871921",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Contact Sugukura (WhatsApp au format international, sans le +)
export const CONTACT_WHATSAPP = "33651460972";
export const CONTACT_WHATSAPP_AFFICHE = "+33 6 51 46 09 72";
export const CONTACT_EMAIL = "falassaservices@gmail.com";

export const QUOTA_GRATUIT = 3; // annonces actives pour un compte gratuit
export const MAX_PHOTOS = 5;

// Rubrique GP (envoi de colis par des voyageurs) : villes de départ / arrivée
export const VILLES_GP = {
  "France": ["Paris", "Lyon", "Marseille", "Lille", "Bordeaux", "Toulouse", "Nantes", "Strasbourg", "Autre (France)"],
  "Mali": ["Bamako", "Kayes", "Sikasso", "Ségou", "Mopti", "Koulikoro", "Autre (Mali)"],
};
export const QUOTA_GP = 3; // trajets à venir pour un compte gratuit

// Date du jour au format AAAA-MM-JJ (heure locale)
export function aujourdhui() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
// « 2026-10-21 » → « mar. 21 oct. 2026 »
export function dateFr(iso, avecAnnee = true) {
  if (!iso) return "";
  const [a, m, j] = iso.split("-").map(Number);
  return new Date(a, m - 1, j).toLocaleDateString("fr-FR",
    { weekday: "short", day: "numeric", month: "short", ...(avecAnnee ? { year: "numeric" } : {}) });
}
export function prixKg(v) {
  if (v.prixKg === null || v.prixKg === undefined || v.prixKg === "") return "Prix à discuter";
  return Number(v.prixKg).toLocaleString("fr-FR") + (v.devise === "FCFA" ? " FCFA" : " €") + " / kg";
}

export const VILLES = ["Bamako", "Kayes", "Koulikoro", "Sikasso", "Ségou", "Mopti", "Gao", "Tombouctou", "Kidal", "Autre"];

// ------------------------------------------------------------
// Catégories : chacune déclare ses propres champs de fiche technique
// ------------------------------------------------------------
export const CATEGORIES = {
  vehicules: {
    nom: "Auto / Moto", icone: "🚗",
    champs: [
      { id: "typeVehicule", label: "Type", type: "select", options: ["Voiture", "Moto", "Camion / utilitaire", "Autre"] },
      { id: "marque", label: "Marque / modèle", type: "text" },
      { id: "annee", label: "Année", type: "number" },
      { id: "km", label: "Kilométrage", type: "number", unite: " km" },
      { id: "cylindree", label: "Cylindrée (motos)", type: "number", unite: " cm³" },
      { id: "energie", label: "Énergie", type: "select", options: ["Essence", "Diesel", "Hybride", "Électrique"] },
      { id: "etat", label: "État", type: "select", options: ["Neuf", "Occasion"] },
    ],
  },
  immobilier: {
    nom: "Immobilier", icone: "🏠",
    champs: [
      { id: "offre", label: "Type d'offre", type: "select", options: ["Vente", "Location"] },
      { id: "typeBien", label: "Type de bien", type: "select", options: ["Maison", "Appartement", "Terrain", "Boutique / local", "Autre"] },
      { id: "surface", label: "Surface", type: "number", unite: " m²" },
      { id: "pieces", label: "Pièces", type: "number" },
    ],
  },
  electronique: {
    nom: "Électronique", icone: "📱",
    champs: [
      { id: "typeAppareil", label: "Type d'appareil", type: "select", options: ["Téléphone", "Ordinateur", "Télévision", "Électroménager", "Autre"] },
      { id: "marque", label: "Marque / modèle", type: "text" },
      { id: "etat", label: "État", type: "select", options: ["Neuf", "Occasion"] },
      { id: "garantie", label: "Garantie", type: "select", options: ["Oui", "Non"] },
    ],
  },
  services: {
    nom: "Services", icone: "🛠️",
    champs: [
      { id: "typeService", label: "Type de service", type: "text" },
      { id: "tarifType", label: "Tarification", type: "select", options: ["Fixe", "À l'heure", "Sur devis"] },
      { id: "zone", label: "Zone d'intervention", type: "text" },
    ],
  },
};

// Anciennes catégories regroupées (les annonces « motos » vont dans Auto / Moto)
export function categorieDe(annonce) {
  return annonce && annonce.categorie === "motos" ? "vehicules" : annonce?.categorie;
}

// Logo : une personne chargée de ses courses
export const LOGO_SVG = `<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="13" fill="#c8501f"/><circle cx="19.5" cy="6.6" r="2.6" fill="#e0a43a"/><circle cx="24.5" cy="5.4" r="2.8" fill="#7bbf4e"/><circle cx="29.2" cy="6.8" r="2.4" fill="#e0a43a"/><path d="M15.5 8.6h17l-2 4.8h-13z" fill="#fff"/><path d="M18 10.6h12" stroke="#c8501f" stroke-width=".9"/><circle cx="24" cy="17.6" r="3.6" fill="#fff"/><path d="M20.2 23.4 L16.6 17.2 L17.2 12.6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M27.8 23.4 L32 29.6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M20 22.2h8l4.2 15.4H15.8z" fill="#fff"/><path d="M17.6 31.2h12.8" stroke="#e0a43a" stroke-width="1.6"/><path d="M21.4 37.6v4.8M26.6 37.6v4.8" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M30.2 31.4h8.6l-.8 9.8h-7z" fill="#e0a43a"/><path d="M32 31.6c0-3 5-3 5 0" fill="none" stroke="#e0a43a" stroke-width="1.5"/><circle cx="33" cy="30" r="1.6" fill="#7bbf4e"/></svg>`;

// ------------------------------------------------------------
// Utilitaires
// ------------------------------------------------------------
// Toujours échapper le texte saisi par les utilisateurs avant de l'afficher
export function esc(valeur) {
  return String(valeur ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function chiffres(tel) {
  return String(tel ?? "").replace(/\D/g, "");
}

export function formatPrix(prix) {
  if (prix === null || prix === undefined || prix === "") return "Sur devis";
  return Number(prix).toLocaleString("fr-FR") + " FCFA";
}

export function ilYa(timestamp) {
  const date = timestamp && timestamp.toDate ? timestamp.toDate() : null;
  if (!date) return "à l'instant";
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const heures = Math.floor(minutes / 60);
  if (heures < 24) return `il y a ${heures} h`;
  const jours = Math.floor(heures / 24);
  if (jours < 30) return `il y a ${jours} jour${jours > 1 ? "s" : ""}`;
  return date.toLocaleDateString("fr-FR");
}

// Compte Pro activé (plan modifié dans la console : tout sauf « gratuit »)
export function estEntreprise(plan) {
  return Boolean(plan) && plan !== "gratuit";
}

// Formate une valeur de champ pour l'affichage (ajoute l'unité)
export function valeurChamp(champ, valeur) {
  if (valeur === undefined || valeur === null || valeur === "") return null;
  if (champ.id === "annee") return String(valeur);
  if (champ.type === "number") return Number(valeur).toLocaleString("fr-FR").replace(/\u202f/g, " ") + (champ.unite || "");
  return String(valeur);
}

// Lignes "label / valeur" d'une annonce selon sa catégorie
export function lignesFiche(annonce) {
  const categorie = CATEGORIES[categorieDe(annonce)];
  if (!categorie) return [];
  return categorie.champs
    .map((champ) => [champ.label, valeurChamp(champ, (annonce.champs || {})[champ.id])])
    .filter(([, valeur]) => valeur !== null);
}

// ------------------------------------------------------------
// En-tête et pied de page communs
// ------------------------------------------------------------
export function renderEntete(actif) {
  const conteneur = document.getElementById("entete");
  if (!conteneur) return;
  conteneur.innerHTML = `
    <header class="entete">
      <div class="entete-in">
        <a class="logo" href="index.html">
          <span class="logo-s">${LOGO_SVG}</span>
          <span class="logo-nom">Sugukura<small>Le nouveau marché</small></span>
        </a>
        <nav class="nav">
          <a class="nav-lien cache-mobile ${actif === "annonces" ? "actif" : ""}" href="index.html">Annonces</a>
          <a class="nav-lien nav-gp ${actif === "gp" ? "actif" : ""}" href="gp.html">✈️ GP</a>
          <a class="nav-lien ${actif === "compte" ? "actif" : ""}" id="lienCompte" href="publier.html">Connexion</a>
          <a class="btn btn-terre btn-petit" href="publier.html#publier">+ Déposer</a>
        </nav>
      </div>
    </header>`;
  onAuthStateChanged(auth, (utilisateur) => {
    const lien = document.getElementById("lienCompte");
    if (lien) lien.textContent = utilisateur ? "Mon compte" : "Connexion";
  });
}

export function renderPied() {
  const conteneur = document.getElementById("pied");
  if (!conteneur) return;
  const lienWa = `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent("Bonjour Sugukura, ")}`;
  const lienPro = `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent("Bonjour, je souhaite des informations sur la publicité ou un compte Pro Sugukura.")}`;
  conteneur.innerHTML = `
    <footer class="pied">
      <div class="pied-in">
        <div>
          <strong>Sugukura</strong>
          <p>Le nouveau marché du Mali : achetez, vendez, trouvez un service.</p>
        </div>
        <div class="pied-liens">
          <span class="pied-titre">Le site</span>
          <a href="index.html">Annonces</a>
          <a href="publier.html">Déposer une annonce</a>
          <a href="gp.html">GP Paris ⇄ Bamako</a>
          <a href="${lienPro}" target="_blank" rel="noopener">Publicité &amp; comptes Pros</a>
        </div>
        <div class="pied-liens">
          <span class="pied-titre">Contact</span>
          <a href="${lienWa}" target="_blank" rel="noopener">💬 WhatsApp ${CONTACT_WHATSAPP_AFFICHE}</a>
          <a href="mailto:${CONTACT_EMAIL}">✉️ ${CONTACT_EMAIL}</a>
        </div>
      </div>
      <div class="pied-bas">© Sugukura — prototype</div>
    </footer>`;
}

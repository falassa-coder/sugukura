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

// 🔧 À REMPLACER : numéro WhatsApp de Sugukura (format international, sans le +)
// Utilisé pour les demandes d'abonnement entreprise et de publicité.
export const CONTACT_WHATSAPP = "22300000000";

export const QUOTA_GRATUIT = 3; // annonces actives pour un compte gratuit
export const MAX_PHOTOS = 5;

export const VILLES = ["Bamako", "Kayes", "Koulikoro", "Sikasso", "Ségou", "Mopti", "Gao", "Tombouctou", "Kidal", "Autre"];

// ------------------------------------------------------------
// Catégories : chacune déclare ses propres champs de fiche technique
// ------------------------------------------------------------
export const CATEGORIES = {
  vehicules: {
    nom: "Véhicules", icone: "🚗",
    champs: [
      { id: "marque", label: "Marque / modèle", type: "text" },
      { id: "annee", label: "Année", type: "number" },
      { id: "km", label: "Kilométrage", type: "number", unite: " km" },
      { id: "energie", label: "Énergie", type: "select", options: ["Essence", "Diesel", "Hybride", "Électrique"] },
      { id: "etat", label: "État", type: "select", options: ["Neuf", "Occasion"] },
    ],
  },
  motos: {
    nom: "Motos", icone: "🏍️",
    champs: [
      { id: "marque", label: "Marque / modèle", type: "text" },
      { id: "cylindree", label: "Cylindrée", type: "number", unite: " cm³" },
      { id: "annee", label: "Année", type: "number" },
      { id: "km", label: "Kilométrage", type: "number", unite: " km" },
      { id: "etat", label: "État", type: "select", options: ["Neuve", "Occasion"] },
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

export function estEntreprise(plan) {
  return plan && plan !== "gratuit";
}

// Formate une valeur de champ pour l'affichage (ajoute l'unité)
export function valeurChamp(champ, valeur) {
  if (valeur === undefined || valeur === null || valeur === "") return null;
  if (champ.type === "number") return Number(valeur).toLocaleString("fr-FR").replace(/\u202f/g, " ") + (champ.unite || "");
  return String(valeur);
}

// Lignes "label / valeur" d'une annonce selon sa catégorie
export function lignesFiche(annonce) {
  const categorie = CATEGORIES[annonce.categorie];
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
          <span class="logo-s">S</span>
          <span class="logo-nom">Sugukura<small>Le nouveau marché</small></span>
        </a>
        <nav class="nav">
          <a class="nav-lien cache-mobile ${actif === "annonces" ? "actif" : ""}" href="index.html">Annonces</a>
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
  const lienPub = `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent("Bonjour, je souhaite des informations sur la publicité ou un compte entreprise Sugukura.")}`;
  conteneur.innerHTML = `
    <footer class="pied">
      <div class="pied-in">
        <div>
          <strong>Sugukura</strong>
          <p>Le nouveau marché du Mali : achetez, vendez, trouvez un service.</p>
        </div>
        <div class="pied-liens">
          <a href="index.html">Annonces</a>
          <a href="publier.html">Déposer une annonce</a>
          <a href="${lienPub}" target="_blank" rel="noopener">Publicité &amp; comptes entreprise</a>
        </div>
      </div>
      <div class="pied-bas">© Sugukura — prototype</div>
    </footer>`;
}

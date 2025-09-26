# SneakPeak

Un site e-commerce dédié au monde des sneakers et à sa vente. Développée avec **Angular 20.3.1**, déployée sur **Vercel** et configurée en **Progressive Web App (PWA)**.

🌐 **Lien de production Vercel** : [https://projet-final-angular.vercel.app/catalog](https://projet-final-angular.vercel.app/catalog)

---

## Fonctionnalités

### Partie Shop (Client)

- **Authentification** : Page de connexion et d'inscription
- **Catalogue produits** : Navigation et recherche dans le catalogue
- **Page produits** : Navigation sur une page produit en fonction de celui sélectionné avec bouton "ajouter au panier"
- **Panier d'achat** : Ajout/suppression d'articles avec gestion des quantités dynamiques
- **Validation du panier et commande** : Récapitulatif avant commande avec date de livraison et système de paiement
- **Historique des commandes** : Liste des commandes précédement faites

### 👨‍💼 Partie Admin

- **Dashboard** : 4 entrées pour la gestion du site pour les admins
  - Gestion des users
  - Gestion des produits
  - Historique de toutes les commandes users
  - Création de produit

---

## ⚡ Technologies utilisées

- **Framework** : Angular CLI v20.3.1
- **Tailwindcss** : Pour la gestion de styles
- **PWA** : Progressive Web App (offline, installation, notifications)
- **Déploiement** : [Vercel](https://vercel.com/) pour un déploiement continu

---

## 🛠️ Développement

### 🔧 Serveur de développement

Pour démarrer un serveur de développement local :

```bash
ng serve
```

L'application sera lancé et accessible directement sur http://localhost:4200/. Le rechargement automatique est activé lors des modifications de fichiers.

### Build de production

Pour compiler le projet :

```bash
ng build
```

##  Tests

### Tests unitaires et d'intégration

Les tests unitaires utilisent Karma et Jasmine :

```bash
ng test
```

##  PWA

L'application est configuré pour être en PWA, ce qui lui permet d'être installer sur votre écran d'accueil, d'avoir des fonctionnalités hors ligne et des performances optimisées.

##  Déploiement

### Vercel

L'application est déploiement via vercel, voici le lien : https://projet-final-angular.vercel.app/catalog

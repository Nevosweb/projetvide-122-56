# Guide de Publication sur GitHub Pages

## Configuration Automatique Ajoutée

Les fichiers suivants ont été ajoutés/modifiés pour permettre la publication sur GitHub Pages :

### 1. Workflow GitHub Actions
- **Fichier** : `.github/workflows/deploy.yml`
- **Fonction** : Automatise le build et le déploiement sur GitHub Pages
- **Déclenchement** : À chaque push sur la branche `main`

### 2. Configuration Vite
- **Fichier** : `vite.config.ts`
- **Modifications** :
  - Ajout du `base` path pour GitHub Pages
  - Configuration optimisée du build
  - Organisation des assets (CSS, JS, images)

### 3. Gestion des Routes SPA
- **Fichier** : `public/404.html` - Redirection pour les routes React Router
- **Fichier** : `index.html` - Script de redirection ajouté

## Instructions de Déploiement

### Étape 1 : Préparer le Repository

1. **Créer un repository GitHub** (si pas déjà fait)
2. **Pousser le code** :
   ```bash
   git add .
   git commit -m "Add GitHub Pages configuration"
   git push origin main
   ```

### Étape 2 : Configurer GitHub Pages

1. Aller dans **Settings** du repository
2. Naviguer vers **Pages** dans le menu latéral
3. Dans **Source**, sélectionner **GitHub Actions**
4. Le workflow se lancera automatiquement

### Étape 3 : Ajuster le Base Path

⚠️ **IMPORTANT** : Dans `vite.config.ts`, ligne 9 :
```typescript
base: mode === 'production' ? '/NOM-DU-REPOSITORY/' : '/'
```

Remplacer `brasserie-honore-accueil-45-main` par le **nom exact** de votre repository GitHub.

### Étape 4 : Vérifier le Déploiement

1. Aller dans l'onglet **Actions** du repository
2. Vérifier que le workflow s'exécute sans erreur
3. Une fois terminé, le site sera accessible à :
   `https://VOTRE-USERNAME.github.io/NOM-DU-REPOSITORY/`

## Structure des Fichiers Ajoutés

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # Workflow GitHub Actions
├── public/
│   └── 404.html               # Redirection SPA
├── index.html                 # Script de redirection ajouté
├── vite.config.ts            # Configuration GitHub Pages
└── README-GITHUB-PAGES.md    # Ce guide
```

## Fonctionnalités Incluses

✅ **Build automatique** avec GitHub Actions  
✅ **Optimisation des assets** (CSS, JS, images séparés)  
✅ **Support React Router** (SPA routing)  
✅ **Cache busting** avec hash des fichiers  
✅ **Minification** et optimisation du code  
✅ **Déploiement automatique** sur push  

## Dépannage

### Problème : Site ne se charge pas
- Vérifier que le `base` path dans `vite.config.ts` correspond au nom du repository
- S'assurer que GitHub Pages est configuré sur "GitHub Actions"

### Problème : Routes ne fonctionnent pas
- Les fichiers `404.html` et le script dans `index.html` gèrent les redirections
- Vérifier que ces fichiers n'ont pas été modifiés

### Problème : Build échoue
- Vérifier les logs dans l'onglet "Actions"
- S'assurer que toutes les dépendances sont dans `package.json`

## Commandes Utiles

```bash
# Tester le build localement
npm run build
npm run preview

# Forcer un nouveau déploiement
git commit --allow-empty -m "Force deploy"
git push origin main
```

---

**Note** : Ce guide suppose que vous utilisez la branche `main`. Si vous utilisez `master` ou une autre branche, modifiez le workflow en conséquence.
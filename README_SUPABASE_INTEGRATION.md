# 🚀 Intégration Supabase - Upload de Documents

L'application a été mise à jour pour utiliser Supabase Storage au lieu du stockage local pour les documents uploadés lors de la création de chatbots.

## ✨ Fonctionnalités Implémentées

### 1. Upload vers Supabase Storage
- Les documents sont maintenant uploadés dans un bucket Supabase `documents`
- Organisation automatique par dossier d'entreprise : `documents/{nom_entreprise}/`
- Génération automatique de noms de fichiers uniques avec GUID

### 2. Métadonnées en Base de Données
- Création automatique d'une ligne de métadonnées pour chaque fichier uploadé
- Structure de la table `document_metadata` :
  ```json
  {
    "id": "uuid",
    "user_id": "uuid (optionnel)",
    "file_path": "documents/nebula/guid_filename.pdf",
    "business_name": "Nebula",
    "status": "uploaded",
    "uploaded_at": "2025-01-27T10:30:00Z"
  }
  ```

### 3. Interface de Gestion
- Nouvelle page `/Documents?businessName=NomEntreprise` pour voir les documents uploadés
- Possibilité de supprimer des documents (supprime à la fois le fichier et les métadonnées)
- Interface responsive avec statuts visuels

## 🔧 Configuration Requise

### 1. Configurer Supabase
Suivez les instructions détaillées dans `SUPABASE_SETUP.md` pour :
- Créer le bucket `documents`
- Créer la table `document_metadata`
- Configurer les politiques RLS
- Récupérer vos clés API

### 2. Configurer l'Application
Dans `appsettings.json` et `appsettings.Development.json` :
```json
{
  "Supabase": {
    "Url": "https://votre-projet-id.supabase.co",
    "Key": "votre-clé-anon-publique"
  }
}
```

## 📁 Fichiers Modifiés/Ajoutés

### Nouveaux Fichiers
- `Models/DocumentMetadata.cs` - Modèle pour les métadonnées
- `Services/SupabaseService.cs` - Service principal pour Supabase
- `Pages/Documents.cshtml` - Interface de gestion des documents
- `Pages/Documents.cshtml.cs` - Code-behind pour la gestion
- `SUPABASE_SETUP.md` - Guide de configuration détaillé

### Fichiers Modifiés
- `Hackaton_2025.csproj` - Ajout du package Supabase
- `Program.cs` - Configuration du service Supabase
- `Pages/Create.cshtml.cs` - Utilisation du service Supabase pour l'upload
- `appsettings.json` - Configuration Supabase
- `appsettings.Development.json` - Configuration Supabase

## 🎯 Utilisation

### Upload de Documents
1. Aller sur la page de création de chatbot (`/Create`)
2. Remplir les informations d'entreprise
3. Dans l'onglet "Documents", sélectionner les fichiers à uploader
4. Les fichiers sont automatiquement uploadés vers Supabase lors de la soumission

### Visualisation des Documents
- Accéder à `/Documents?businessName=NomDeLEntreprise`
- Voir tous les documents uploadés pour cette entreprise
- Possibilité de supprimer des documents

### API du Service
```csharp
// Upload d'un document
var filePath = await _supabaseService.UploadDocumentAsync(file, "NomEntreprise");

// Récupération des documents d'une entreprise
var documents = await _supabaseService.GetDocumentsForBusinessAsync("NomEntreprise");

// Suppression d'un document
var success = await _supabaseService.DeleteDocumentAsync(documentId);

// Mise à jour du statut
var success = await _supabaseService.UpdateDocumentStatusAsync(documentId, "processed");
```

## 🔒 Sécurité

- **RLS (Row Level Security)** : Configuré sur la table `document_metadata`
- **Bucket privé** : Le bucket `documents` est configuré comme privé
- **Validation** : Validation côté serveur des uploads
- **Gestion d'erreurs** : Gestion robuste des erreurs d'upload

## 🚀 Prochaines Étapes Suggérées

1. **Authentification** : Ajouter un système d'authentification utilisateur
2. **Permissions** : Affiner les politiques RLS selon les besoins
3. **Validation** : Ajouter des validations de type/taille de fichier
4. **Monitoring** : Surveiller l'usage du storage
5. **CDN** : Configurer un CDN pour l'accès aux fichiers

## ⚠️ Notes Importantes

- Assurez-vous de configurer correctement vos clés Supabase avant de tester
- Les anciens fichiers dans `wwwroot/uploads/` ne seront plus utilisés
- Gardez vos clés Supabase sécurisées et ne les commitez pas dans le code
- Testez d'abord avec des fichiers de petite taille

## 🆘 Support

En cas de problème :
1. Vérifiez la configuration Supabase dans `SUPABASE_SETUP.md`
2. Consultez les logs de l'application
3. Vérifiez les permissions dans votre console Supabase
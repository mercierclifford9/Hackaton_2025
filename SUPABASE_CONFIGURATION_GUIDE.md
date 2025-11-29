# 📋 Guide de Configuration Supabase - Étape par Étape

Ce guide vous accompagne pour configurer correctement votre projet Supabase pour l'upload de documents du chatbot.

## 🚀 Étape 1 : Création et Configuration du Projet

### 1.1 Créer un Nouveau Projet
1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur **"Start your project"**
3. Connectez-vous ou créez un compte
4. Cliquez sur **"New Project"**
5. Remplissez :
   - **Organization** : Choisissez votre organisation
   - **Project Name** : `hackaton-2025-chatbot` (ou le nom de votre choix)
   - **Database Password** : Générez un mot de passe fort et **SAUVEGARDEZ-LE**
   - **Region** : Choisissez la région la plus proche de vos utilisateurs
6. Cliquez sur **"Create new project"**

### 1.2 Attendre l'Initialisation
⏱️ Patientez 1-2 minutes pendant que Supabase configure votre projet.

---

## 🗂️ Étape 2 : Configuration du Storage (Bucket)

### 2.1 Accéder au Storage
1. Dans le panneau gauche, cliquez sur **"Storage"**
2. Cliquez sur **"Create a new bucket"**

### 2.2 Créer le Bucket Documents
1. **Bucket name** : `documents`
2. **Public bucket** : ❌ **DÉCOCHEZ** (le bucket doit être privé)
3. Cliquez sur **"Create bucket"**

### 2.3 Configurer les Politiques du Storage
1. Cliquez sur votre bucket `documents`
2. Allez dans l'onglet **"Policies"**
3. Cliquez sur **"New policy"** puis **"For full customization"**

**Politique 1 : Upload de fichiers**
```sql
-- Nom de la politique : "Enable file uploads"
-- Opération : INSERT
-- Table : storage.objects

CREATE POLICY "Enable file uploads" ON storage.objects
  FOR INSERT 
  WITH CHECK (bucket_id = 'documents');
```

**Politique 2 : Lecture de fichiers**
```sql
-- Nom de la politique : "Enable file downloads"
-- Opération : SELECT
-- Table : storage.objects

CREATE POLICY "Enable file downloads" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'documents');
```

**Politique 3 : Suppression de fichiers**
```sql
-- Nom de la politique : "Enable file deletion"
-- Opération : DELETE
-- Table : storage.objects

CREATE POLICY "Enable file deletion" ON storage.objects
  FOR DELETE 
  USING (bucket_id = 'documents');
```

---

## 🗄️ Étape 3 : Création de la Table de Métadonnées

### 3.1 Accéder à l'Éditeur SQL
1. Dans le panneau gauche, cliquez sur **"SQL Editor"**
2. Cliquez sur **"New query"**

### 3.2 Créer la Table
Copiez et exécutez ce script SQL :

```sql
-- ============================================================================
-- CRÉATION DE LA TABLE DOCUMENT_METADATA
-- ============================================================================

-- Créer la table principale
CREATE TABLE public.document_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    file_path TEXT NOT NULL,
    business_name TEXT NOT NULL,
    status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'processed', 'error')),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contraintes
    CONSTRAINT file_path_not_empty CHECK (char_length(file_path) > 0),
    CONSTRAINT business_name_not_empty CHECK (char_length(business_name) > 0)
);

-- ============================================================================
-- CRÉATION DES INDEX POUR LES PERFORMANCES
-- ============================================================================

-- Index sur user_id pour les requêtes par utilisateur
CREATE INDEX idx_document_metadata_user_id 
ON public.document_metadata(user_id);

-- Index sur business_name pour les requêtes par entreprise
CREATE INDEX idx_document_metadata_business_name 
ON public.document_metadata(business_name);

-- Index sur status pour filtrer par statut
CREATE INDEX idx_document_metadata_status 
ON public.document_metadata(status);

-- Index composé pour les requêtes fréquentes
CREATE INDEX idx_document_metadata_business_status 
ON public.document_metadata(business_name, status);

-- ============================================================================
-- COMMENTAIRES POUR LA DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.document_metadata IS 'Table des métadonnées des documents uploadés pour les chatbots';
COMMENT ON COLUMN public.document_metadata.id IS 'Identifiant unique du document';
COMMENT ON COLUMN public.document_metadata.user_id IS 'Identifiant de l''utilisateur (optionnel)';
COMMENT ON COLUMN public.document_metadata.file_path IS 'Chemin du fichier dans le storage Supabase';
COMMENT ON COLUMN public.document_metadata.business_name IS 'Nom de l''entreprise propriétaire du document';
COMMENT ON COLUMN public.document_metadata.status IS 'Statut du traitement du document';
COMMENT ON COLUMN public.document_metadata.uploaded_at IS 'Date et heure d''upload';
```

Cliquez sur **"Run"** pour exécuter le script.

---

## 🔒 Étape 4 : Configuration des Politiques RLS

### 4.1 Activer Row Level Security
Exécutez ce script dans l'éditeur SQL :

```sql
-- ============================================================================
-- ACTIVATION DE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.document_metadata ENABLE ROW LEVEL SECURITY;
```

### 4.2 Créer les Politiques de Sécurité
Exécutez ensuite ce script pour créer les politiques :

```sql
-- ============================================================================
-- POLITIQUES DE SÉCURITÉ POUR DOCUMENT_METADATA
-- ============================================================================

-- Politique pour permettre l'insertion (création de nouveaux documents)
CREATE POLICY "Enable insert for all users" ON public.document_metadata
    FOR INSERT 
    WITH CHECK (true);

-- Politique pour permettre la lecture (consultation des documents)
CREATE POLICY "Enable read for all users" ON public.document_metadata
    FOR SELECT 
    USING (true);

-- Politique pour permettre la mise à jour (changement de statut)
CREATE POLICY "Enable update for all users" ON public.document_metadata
    FOR UPDATE 
    USING (true) 
    WITH CHECK (true);

-- Politique pour permettre la suppression
CREATE POLICY "Enable delete for all users" ON public.document_metadata
    FOR DELETE 
    USING (true);
```

> **Note de Sécurité** : Ces politiques permettent l'accès à tous. En production, vous devriez les personnaliser selon vos besoins d'authentification.

---

## ⚙️ Étape 5 : Récupération des Clés API

### 5.1 Accéder aux Paramètres
1. Dans le panneau gauche, cliquez sur **"Settings"**
2. Puis sur **"API"**

### 5.2 Récupérer les Informations
Notez ces informations importantes :

```
📋 INFORMATIONS À COPIER :

✅ Project URL: https://xxxxxxxxx.supabase.co
✅ anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✅ service_role secret: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **IMPORTANT** : 
> - Utilisez la `anon public key` pour votre application
> - Gardez la `service_role secret` confidentielle
> - Ne commitez jamais ces clés dans votre code source

---

## 🔧 Étape 6 : Configuration de l'Application

### 6.1 Mettre à Jour appsettings.json
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Supabase": {
    "Url": "https://votre-project-id.supabase.co",
    "Key": "votre-anon-public-key-ici"
  }
}
```

### 6.2 Mettre à Jour appsettings.Development.json
```json
{
  "DetailedErrors": true,
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Supabase": {
    "Url": "https://votre-project-id.supabase.co",
    "Key": "votre-anon-public-key-ici"
  }
}
```

---

## ✅ Étape 7 : Tests et Vérification

### 7.1 Vérifier la Configuration
Dans l'éditeur SQL de Supabase, exécutez ces requêtes de vérification :

```sql
-- Vérifier que la table existe
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'document_metadata';

-- Vérifier que les index existent
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'document_metadata';

-- Vérifier les politiques RLS
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'document_metadata';
```

### 7.2 Tester un Insert Manuel
```sql
-- Test d'insertion (remplacez par des vraies valeurs)
INSERT INTO public.document_metadata 
(user_id, file_path, business_name, status) 
VALUES 
(gen_random_uuid(), 'documents/test/test_document.pdf', 'Test Company', 'uploaded');

-- Vérifier l'insertion
SELECT * FROM public.document_metadata ORDER BY uploaded_at DESC LIMIT 5;
```

### 7.3 Compiler l'Application
Dans votre terminal :
```bash
dotnet restore
dotnet build
```

Si aucune erreur, votre configuration est prête !

---

## 🚨 Problèmes Courants et Solutions

### ❌ Erreur "Insufficient privilege"
**Cause** : Politiques RLS trop restrictives
**Solution** : Vérifiez que les politiques permettent les opérations nécessaires

### ❌ Erreur "Bucket not found"
**Cause** : Le bucket `documents` n'existe pas
**Solution** : Recréez le bucket avec le bon nom

### ❌ Erreur de connexion
**Cause** : URL ou clé API incorrecte
**Solution** : Vérifiez vos configurations dans appsettings.json

---

## 🎯 Structure Finale Attendue

Après configuration, vous devriez avoir :

```
Supabase Project
├── 📁 Storage
│   └── 📁 documents (bucket privé)
│       ├── 📁 entreprise_1/
│       ├── 📁 entreprise_2/
│       └── ...
│
└── 🗄️ Database
    └── 📋 public.document_metadata
        ├── 🔑 Indexes (optimisation)
        ├── 🔒 RLS Policies (sécurité)
        └── 📊 Sample data
```

---

## 📞 Support

Si vous rencontrez des problèmes :
1. 📖 Consultez la [documentation Supabase](https://supabase.com/docs)
2. 🔍 Vérifiez les logs dans votre console Supabase
3. 🧪 Testez avec des requêtes SQL simples d'abord
4. 💬 Demandez de l'aide avec les messages d'erreur spécifiques

---

**🎉 Félicitations ! Votre projet Supabase est maintenant configuré et prêt à recevoir les documents de vos chatbots !**
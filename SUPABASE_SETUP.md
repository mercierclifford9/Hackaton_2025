# Configuration Supabase pour l'upload de documents

## 1. Créer le bucket de stockage

Dans votre console Supabase, allez dans **Storage** et créez un nouveau bucket :

```sql
-- Créer le bucket 'documents'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false);
```

Ou via l'interface web :
- Nom du bucket : `documents`
- Public : `false` (privé)

## 2. Créer la table de métadonnées

Dans l'éditeur SQL de Supabase, exécutez :

```sql
-- Créer la table document_metadata
CREATE TABLE public.document_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    file_path TEXT NOT NULL,
    business_name TEXT NOT NULL,
    status TEXT DEFAULT 'uploaded',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer des index pour améliorer les performances
CREATE INDEX idx_document_metadata_user_id ON public.document_metadata(user_id);
CREATE INDEX idx_document_metadata_business_name ON public.document_metadata(business_name);
```

## 3. Configurer les politiques de sécurité (RLS)

```sql
-- Activer Row Level Security
ALTER TABLE public.document_metadata ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion (ajustez selon vos besoins)
CREATE POLICY "Enable insert for all users" ON public.document_metadata
    FOR INSERT WITH CHECK (true);

-- Politique pour permettre la lecture (ajustez selon vos besoins)
CREATE POLICY "Enable read for all users" ON public.document_metadata
    FOR SELECT USING (true);

-- Politique pour permettre la suppression (ajustez selon vos besoins)
CREATE POLICY "Enable delete for all users" ON public.document_metadata
    FOR DELETE USING (true);

-- Politique pour permettre la mise à jour (ajustez selon vos besoins)
CREATE POLICY "Enable update for all users" ON public.document_metadata
    FOR UPDATE USING (true);
```

## 4. Configurer les politiques pour le storage

```sql
-- Politique pour permettre l'upload de fichiers
CREATE POLICY "Enable insert for all users" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'documents');

-- Politique pour permettre la lecture de fichiers
CREATE POLICY "Enable read for all users" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents');

-- Politique pour permettre la suppression de fichiers
CREATE POLICY "Enable delete for all users" ON storage.objects
    FOR DELETE USING (bucket_id = 'documents');
```

## 5. Configuration dans l'application

### Récupérer vos clés Supabase :
1. Allez dans **Settings > API**
2. Copiez votre **Project URL**
3. Copiez votre **anon public** key

### Mettre à jour vos fichiers de configuration :

**appsettings.json :**
```json
{
  "Supabase": {
    "Url": "https://your-project-id.supabase.co",
    "Key": "your-anon-key-here"
  }
}
```

**appsettings.Development.json :**
```json
{
  "Supabase": {
    "Url": "https://your-project-id.supabase.co",
    "Key": "your-anon-key-here"
  }
}
```

## 6. Structure des dossiers dans le bucket

Les fichiers seront automatiquement organisés comme suit :
```
documents/
├── nom_entreprise_1/
│   ├── guid_filename1.pdf
│   └── guid_filename2.docx
├── nom_entreprise_2/
│   ├── guid_filename3.txt
│   └── guid_filename4.csv
└── ...
```

## 7. Exemple d'utilisation

### Uploader un document :
```csharp
var filePath = await _supabaseService.UploadDocumentAsync(file, "NomEntreprise");
```

### Récupérer les documents d'une entreprise :
```csharp
var documents = await _supabaseService.GetDocumentsForBusinessAsync("NomEntreprise");
```

### Supprimer un document :
```csharp
var success = await _supabaseService.DeleteDocumentAsync(documentId);
```

## 8. Sécurité recommandée pour la production

Pour une utilisation en production, vous devriez :

1. **Authentification** : Implémenter un système d'authentification
2. **RLS personnalisé** : Ajuster les politiques RLS selon vos besoins
3. **Validation** : Ajouter une validation côté serveur plus stricte
4. **Limitations** : Définir des limites de taille et de type de fichier
5. **Monitoring** : Surveiller l'usage du storage

## 9. URLs utiles

- **Voir les documents uploadés** : `/Documents?businessName=NomDeLEntreprise`
- **Console Supabase** : https://supabase.com/dashboard
- **Documentation Storage** : https://supabase.com/docs/guides/storage
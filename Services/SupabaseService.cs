using Supabase;
using Hackaton_2025.Models;

namespace Hackaton_2025.Services
{
    public class SupabaseService
    {
        private readonly Client _client;
        private readonly CompanyService _companyService;

        public SupabaseService(Client client, CompanyService companyService)
        {
            _client = client;
            _companyService = companyService;
        }

        /// <summary>
        /// Upload un fichier vers le bucket Supabase et créer les métadonnées
        /// </summary>
        public async Task<string?> UploadDocumentAsync(IFormFile file, string companyId, Guid? userId = null)
        {
            try
            {
                // Récupérer les informations de l'entreprise
                var company = await _companyService.GetCompanyByIdAsync(companyId);
                if (company == null)
                {
                    throw new ArgumentException($"Entreprise avec l'ID {companyId} non trouvée");
                }

                // Générer un nom de fichier unique
                var fileExtension = Path.GetExtension(file.FileName);
                var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = $"{company.FolderPath}/{fileName}";

                // Upload vers le bucket Supabase
                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                var fileBytes = memoryStream.ToArray();

                await _client.Storage
                    .From("documents")
                    .Upload(fileBytes, filePath);

                // Créer les métadonnées dans la base de données
                var metadata = new DocumentMetadata
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CompanyId = companyId,
                    FilePath = filePath,
                    Status = "uploaded",
                    UploadedAt = DateTime.UtcNow
                };

                await _client.From<DocumentMetadata>().Insert(metadata);

                return filePath;
            }
            catch (Exception ex)
            {
                // Log l'erreur (vous pouvez utiliser ILogger ici)
                Console.WriteLine($"Erreur lors de l'upload: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Récupère les métadonnées des documents pour une entreprise
        /// </summary>
        public async Task<List<DocumentMetadata>> GetDocumentsForCompanyAsync(string companyId)
        {
            try
            {
                var result = await _client
                    .From<DocumentMetadata>()
                    .Where(d => d.CompanyId == companyId)
                    .Get();

                return result.Models;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur lors de la récupération: {ex.Message}");
                return new List<DocumentMetadata>();
            }
        }

        /// <summary>
        /// Supprime un document du bucket et ses métadonnées
        /// </summary>
        public async Task<bool> DeleteDocumentAsync(Guid documentId)
        {
            try
            {
                // Récupérer les métadonnées pour obtenir le chemin du fichier
                var metadata = await _client
                    .From<DocumentMetadata>()
                    .Where(d => d.Id == documentId)
                    .Single();

                if (metadata != null)
                {
                    // Supprimer le fichier du bucket
                    await _client.Storage
                        .From("documents")
                        .Remove(metadata.FilePath);

                    // Supprimer les métadonnées
                    await _client
                        .From<DocumentMetadata>()
                        .Where(d => d.Id == documentId)
                        .Delete();
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur lors de la suppression: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Met à jour le statut d'un document
        /// </summary>
        public async Task<bool> UpdateDocumentStatusAsync(Guid documentId, string status)
        {
            try
            {
                await _client
                    .From<DocumentMetadata>()
                    .Where(d => d.Id == documentId)
                    .Set(d => d.Status!, status)
                    .Update();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur lors de la mise à jour: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Supprime tous les documents d'une entreprise
        /// </summary>
        public async Task<bool> DeleteAllDocumentsForCompanyAsync(string companyId)
        {
            try
            {
                // Récupérer tous les documents de l'entreprise
                var documents = await GetDocumentsForCompanyAsync(companyId);
                
                // Supprimer chaque document
                foreach (var doc in documents)
                {
                    await DeleteDocumentAsync(doc.Id);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur lors de la suppression des documents: {ex.Message}");
                return false;
            }
        }
    }
}
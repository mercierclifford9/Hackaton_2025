using Supabase;
using Hackaton_2025.Models;
using System.Text.RegularExpressions;

namespace Hackaton_2025.Services
{
    public class CompanyService
    {
        private readonly Client _client;
        
        // Propriété publique pour accès au client depuis les tests
        public Client Client => _client;

        public CompanyService(Client client)
        {
            _client = client;
        }

        /// <summary>
        /// Génère un ID unique pour l'entreprise basé sur le nom
        /// Format: COMP_CLEAN_NAME_8_RANDOM_CHARS (ex: COMP_ACME_CORP_A1B2C3D4)
        /// </summary>
        public string GenerateCompanyId(string companyName)
        {
            // Nettoyer le nom de l'entreprise
            var cleanName = CleanCompanyName(companyName);
            
            // Générer une partie aléatoire de 8 caractères
            var random = GenerateRandomSuffix();
            
            // Format final: COMP_{CLEAN_NAME}_{RANDOM}
            var companyId = $"COMP_{cleanName}_{random}";
            
            // S'assurer que l'ID ne dépasse pas 50 caractères
            if (companyId.Length > 50)
            {
                var maxNameLength = 50 - 14; // 50 - "COMP_" - "_" - 8 chars random
                cleanName = cleanName.Substring(0, Math.Min(cleanName.Length, maxNameLength));
                companyId = $"COMP_{cleanName}_{random}";
            }
            
            return companyId;
        }

        /// <summary>
        /// Nettoie le nom de l'entreprise pour l'ID
        /// </summary>
        private string CleanCompanyName(string companyName)
        {
            if (string.IsNullOrWhiteSpace(companyName))
                return "UNKNOWN";

            // Convertir en majuscules et remplacer les espaces/caractères spéciaux par des underscores
            var cleaned = companyName.ToUpperInvariant()
                .Replace(" ", "_")
                .Replace("-", "_")
                .Replace(".", "_")
                .Replace("&", "_AND_")
                .Replace("'", "");

            // Garder seulement les lettres, chiffres et underscores
            cleaned = Regex.Replace(cleaned, @"[^A-Z0-9_]", "");

            // Réduire les underscores multiples à un seul
            cleaned = Regex.Replace(cleaned, @"_{2,}", "_");

            // Enlever les underscores au début et à la fin
            cleaned = cleaned.Trim('_');

            // Limiter à 25 caractères max pour laisser de la place au reste
            if (cleaned.Length > 25)
                cleaned = cleaned.Substring(0, 25).TrimEnd('_');

            return string.IsNullOrEmpty(cleaned) ? "COMPANY" : cleaned;
        }

        /// <summary>
        /// Génère un suffixe aléatoire de 8 caractères
        /// </summary>
        private string GenerateRandomSuffix()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 8)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        /// <summary>
        /// Génère le chemin du dossier pour l'entreprise
        /// </summary>
        public string GenerateFolderPath(string companyName)
        {
            var cleanName = companyName.ToLowerInvariant()
                .Replace(" ", "_")
                .Replace("-", "_")
                .Replace(".", "_");
            
            // Nettoyer les caractères spéciaux
            cleanName = Regex.Replace(cleanName, @"[^a-z0-9_]", "");
            cleanName = Regex.Replace(cleanName, @"_{2,}", "_").Trim('_');

            return $"documents/{cleanName}";
        }

        /// <summary>
        /// Créer une nouvelle entreprise
        /// </summary>
        public async Task<Company> CreateCompanyAsync(
            string companyName, 
            string? url = null, 
            string? description = null,
            string chatbotName = "",
            string chatbotLanguage = "fr",
            string welcomeMessage = "")
        {
            // Générer l'ID et valider
            var generatedId = GenerateCompanyId(companyName);
            if (string.IsNullOrEmpty(generatedId))
            {
                throw new InvalidOperationException("Impossible de générer un ID pour l'entreprise");
            }

            // Debug: afficher l'ID généré
            Console.WriteLine($"[DEBUG] ID généré: {generatedId}");
            Console.WriteLine($"[DEBUG] Nom entreprise: {companyName}");

            // S'assurer que le message de bienvenue n'est pas vide (contrainte DB)
            if (string.IsNullOrEmpty(welcomeMessage))
            {
                welcomeMessage = $"Bonjour ! Je suis {(string.IsNullOrEmpty(chatbotName) ? companyName : chatbotName)}, comment puis-je vous aider ?";
            }

            var company = new Company
            {
                Id = generatedId,
                CompanyName = companyName,
                Url = url,
                FolderPath = GenerateFolderPath(companyName),
                Description = description,
                ChatbotName = string.IsNullOrEmpty(chatbotName) ? companyName : chatbotName,
                ChatbotDefaultLanguage = chatbotLanguage,
                ChatbotWelcomeMessage = welcomeMessage,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Debug: afficher l'objet company avant insertion
            Console.WriteLine($"[DEBUG] Company.Id avant insertion: '{company.Id}'");
            Console.WriteLine($"[DEBUG] Company.CompanyName: '{company.CompanyName}'");

            try
            {
                // Vérifier que tous les champs obligatoires sont remplis selon les contraintes DB
                if (string.IsNullOrWhiteSpace(company.Id))
                    throw new InvalidOperationException("Company.Id est vide avant insertion");
                if (string.IsNullOrWhiteSpace(company.CompanyName))
                    throw new InvalidOperationException("Company.CompanyName est vide avant insertion");
                if (string.IsNullOrWhiteSpace(company.FolderPath))
                    throw new InvalidOperationException("Company.FolderPath est vide avant insertion");
                if (string.IsNullOrWhiteSpace(company.ChatbotName))
                    throw new InvalidOperationException("Company.ChatbotName est vide avant insertion");
                if (string.IsNullOrWhiteSpace(company.ChatbotWelcomeMessage))
                    throw new InvalidOperationException("Company.ChatbotWelcomeMessage est vide avant insertion");
                
                // Validation supplémentaire des contraintes
                if (company.CompanyName.Length == 0)
                    throw new InvalidOperationException("Company.CompanyName ne peut pas être une chaîne vide");
                if (company.ChatbotName.Length == 0)
                    throw new InvalidOperationException("Company.ChatbotName ne peut pas être une chaîne vide");
                if (company.FolderPath.Length == 0)
                    throw new InvalidOperationException("Company.FolderPath ne peut pas être une chaîne vide");

                Console.WriteLine($"[DEBUG] Validation des champs réussie");
                Console.WriteLine($"[DEBUG] Tentative d'insertion de l'objet Company directement");

                // Essayer l'insertion avec l'objet Company normal
                var response = await _client.From<Company>().Insert(company);
                
                if (response?.Models?.Any() == true)
                {
                    var insertedCompany = response.Models.First();
                    Console.WriteLine($"[DEBUG] Insertion réussie. ID retourné: '{insertedCompany.Id}'");
                    return insertedCompany;
                }
                else
                {
                    Console.WriteLine("[DEBUG] Aucun modèle retourné après insertion");
                    
                    // Fallback: essayer de récupérer l'entreprise créée
                    Console.WriteLine("[DEBUG] Tentative de récupération de l'entreprise après insertion...");
                    await Task.Delay(2000); // Attendre plus longtemps
                    var retrieved = await GetCompanyByIdAsync(company.Id);
                    if (retrieved != null)
                    {
                        Console.WriteLine($"[DEBUG] Entreprise récupérée après création: {retrieved.Id}");
                        return retrieved;
                    }
                    
                    Console.WriteLine("[DEBUG] Impossible de récupérer l'entreprise. Retour de l'objet original");
                    return company;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DEBUG] Erreur lors de l'insertion: {ex.Message}");
                Console.WriteLine($"[DEBUG] Type d'erreur: {ex.GetType().Name}");
                Console.WriteLine($"[DEBUG] Company.Id au moment de l'erreur: '{company.Id}'");
                Console.WriteLine($"[DEBUG] InnerException: {ex.InnerException?.Message}");
                throw;
            }
        }

        /// <summary>
        /// Récupérer une entreprise par ID
        /// </summary>
        public async Task<Company?> GetCompanyByIdAsync(string companyId)
        {
            try
            {
                var result = await _client
                    .From<Company>()
                    .Where(c => c.Id == companyId)
                    .Single();

                return result;
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Récupérer toutes les entreprises
        /// </summary>
        public async Task<List<Company>> GetAllCompaniesAsync()
        {
            try
            {
                var result = await _client
                    .From<Company>()
                    .Get();

                return result.Models;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur lors de la récupération des entreprises: {ex.Message}");
                return new List<Company>();
            }
        }

        /// <summary>
        /// Mettre à jour une entreprise
        /// </summary>
        public async Task<bool> UpdateCompanyAsync(Company company)
        {
            try
            {
                company.UpdatedAt = DateTime.UtcNow;
                await _client
                    .From<Company>()
                    .Where(c => c.Id == company.Id)
                    .Set(c => c.CompanyName!, company.CompanyName)
                    .Set(c => c.Url!, company.Url)
                    .Set(c => c.Description!, company.Description)
                    .Set(c => c.ChatbotName!, company.ChatbotName)
                    .Set(c => c.ChatbotDefaultLanguage!, company.ChatbotDefaultLanguage)
                    .Set(c => c.ChatbotWelcomeMessage!, company.ChatbotWelcomeMessage)
                    .Set(c => c.UpdatedAt!, company.UpdatedAt)
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
        /// Supprimer une entreprise et tous ses documents
        /// </summary>
        public async Task<bool> DeleteCompanyAsync(string companyId)
        {
            try
            {
                // Supprimer d'abord tous les documents liés
                var supabaseService = new SupabaseService(_client, this);
                await supabaseService.DeleteAllDocumentsForCompanyAsync(companyId);

                // Puis supprimer l'entreprise
                await _client
                    .From<Company>()
                    .Where(c => c.Id == companyId)
                    .Delete();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur lors de la suppression: {ex.Message}");
                return false;
            }
        }
    }
}
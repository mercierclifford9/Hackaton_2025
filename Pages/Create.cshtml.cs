using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.ComponentModel.DataAnnotations;
using Hackaton_2025.Services;
using Hackaton_2025.Models;

namespace Hackaton_2025.Pages
{
    public class CreateModel : PageModel
    {
        private readonly SupabaseService _supabaseService;
        private readonly CompanyService _companyService;

        public CreateModel(SupabaseService supabaseService, CompanyService companyService)
        {
            _supabaseService = supabaseService;
            _companyService = companyService;
        }
        [BindProperty]
        [Required(ErrorMessage = "Le nom de l'entreprise est requis")]
        [StringLength(100, ErrorMessage = "Le nom ne peut pas dépasser 100 caractères")]
        public string CompanyName { get; set; } = "";

        [BindProperty]
        [Required(ErrorMessage = "Le secteur d'activité est requis")]
        public string Industry { get; set; } = "";

        [BindProperty]
        [StringLength(500, ErrorMessage = "La description ne peut pas dépasser 500 caractères")]
        public string CompanyDescription { get; set; } = "";

        [BindProperty]
        public List<IFormFile>? Documents { get; set; }

        [BindProperty]
        [Url(ErrorMessage = "Veuillez entrer une URL valide")]
        public string? WebsiteUrl { get; set; }

        [BindProperty]
        public bool CrawlWebsite { get; set; } = false;

        [BindProperty]
        public bool AnalyzeSitemap { get; set; } = false;

        [BindProperty]
        public bool ExtractMetadata { get; set; } = false;

        [BindProperty]
        [Required(ErrorMessage = "Le nom du chatbot est requis")]
        [StringLength(50, ErrorMessage = "Le nom ne peut pas dépasser 50 caractères")]
        public string ChatbotName { get; set; } = "Assistant";

        [BindProperty]
        public string Language { get; set; } = "fr";

        [BindProperty]
        [StringLength(300, ErrorMessage = "Le message ne peut pas dépasser 300 caractères")]
        public string WelcomeMessage { get; set; } = "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?";


        [TempData]
        public string? StatusMessage { get; set; }

        public void OnGet()
        {
            // Initialisation des valeurs par défaut si nécessaire
        }

        public async Task<IActionResult> OnPostCreateAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            try
            {
                if (Documents != null && Documents.Count > 0)
                {
                    var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".txt", ".csv" };
                    const long maxFileSize = 10 * 1024 * 1024;

                    foreach (var file in Documents)
                    {
                        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                        
                        if (!allowedExtensions.Contains(extension))
                        {
                            ModelState.AddModelError("Documents", $"Le fichier {file.FileName} n'est pas dans un format autorisé.");
                            return Page();
                        }

                        if (file.Length > maxFileSize)
                        {
                            ModelState.AddModelError("Documents", $"Le fichier {file.FileName} est trop volumineux (max 10MB).");
                            return Page();
                        }
                    }
                }

                var result = await ProcessChatbotCreation();
                
                if (result.Success)
                {
                    StatusMessage = "Votre chatbot a été créé avec succès ! Vous allez recevoir un email avec les détails.";
                    return RedirectToPage("/Success", new { id = result.ChatbotId });
                }
                else
                {
                    ModelState.AddModelError("", result.ErrorMessage ?? "Une erreur est survenue lors de la création du chatbot.");
                    return Page();
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Une erreur inattendue s'est produite. Veuillez réessayer.");
                return Page();
            }
        }

        private async Task<ChatbotCreationResult> ProcessChatbotCreation()
        {
            try
            {
                await Task.Delay(1000);
                
                // Créer l'entreprise d'abord
                var company = await _companyService.CreateCompanyAsync(
                    companyName: CompanyName,
                    url: WebsiteUrl,
                    description: CompanyDescription,
                    chatbotName: ChatbotName,
                    chatbotLanguage: Language,
                    welcomeMessage: WelcomeMessage
                );

                var uploadedFiles = new List<string>();

                // Upload des documents vers Supabase en utilisant l'ID de l'entreprise
                if (Documents != null && Documents.Count > 0)
                {
                    foreach (var file in Documents)
                    {
                        var filePath = await _supabaseService.UploadDocumentAsync(file, company.Id);
                        if (!string.IsNullOrEmpty(filePath))
                        {
                            uploadedFiles.Add(filePath);
                        }
                        else
                        {
                            // Si l'upload échoue, on peut soit continuer soit retourner une erreur
                            throw new Exception($"Échec de l'upload du fichier: {file.FileName}");
                        }
                    }
                }

                var chatbotData = new
                {
                    CompanyId = company.Id,
                    CompanyName = company.CompanyName,
                    Industry,
                    CompanyDescription = company.Description,
                    WebsiteUrl = company.Url,
                    CrawlWebsite,
                    AnalyzeSitemap,
                    ExtractMetadata,
                    ChatbotName = company.ChatbotName,
                    Language = company.ChatbotDefaultLanguage,
                    WelcomeMessage = company.ChatbotWelcomeMessage,
                    FolderPath = company.FolderPath,
                    UploadedFiles = uploadedFiles, // Liste des fichiers uploadés
                    CreatedAt = DateTime.UtcNow,
                    Status = "Processing"
                };

                return new ChatbotCreationResult
                {
                    Success = true,
                    ChatbotId = company.Id // Utiliser l'ID de l'entreprise comme ID du chatbot
                };
            }
            catch (Exception ex)
            {
                return new ChatbotCreationResult
                {
                    Success = false,
                    ErrorMessage = $"Erreur lors du traitement: {ex.Message}"
                };
            }
        }

        public async Task<IActionResult> OnGetValidateUrlAsync(string url)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(url))
                {
                    return new JsonResult(new { valid = false, error = "URL requise" });
                }

                using var httpClient = new HttpClient();
                httpClient.Timeout = TimeSpan.FromSeconds(10);
                httpClient.DefaultRequestHeaders.Add("User-Agent", 
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
                
                var startTime = DateTime.UtcNow;
                var response = await httpClient.GetAsync(url);
                var responseTime = (DateTime.UtcNow - startTime).TotalMilliseconds;
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var title = ExtractTitleFromHtml(content);
                    var metadata = ExtractSiteMetadata(content);
                    
                    return new JsonResult(new { 
                        valid = true, 
                        title = title,
                        url = url,
                        responseTime = Math.Round(responseTime, 0),
                        isSecure = url.StartsWith("https://"),
                        statusCode = (int)response.StatusCode,
                        contentType = response.Content.Headers.ContentType?.ToString(),
                        metadata = metadata
                    });
                }
                else
                {
                    return new JsonResult(new { 
                        valid = false, 
                        error = $"Site non accessible (Code: {response.StatusCode})" 
                    });
                }
            }
            catch (HttpRequestException ex)
            {
                return new JsonResult(new { 
                    valid = false, 
                    error = "Impossible de se connecter au site web" 
                });
            }
            catch (TaskCanceledException)
            {
                return new JsonResult(new { 
                    valid = false, 
                    error = "Délai d'attente dépassé (site trop lent)" 
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { 
                    valid = false, 
                    error = "Erreur lors de la validation de l'URL" 
                });
            }
        }

        private string ExtractTitleFromHtml(string html)
        {
            try
            {
                var titleMatch = System.Text.RegularExpressions.Regex.Match(
                    html, 
                    @"<title[^>]*>([^<]+)</title>", 
                    System.Text.RegularExpressions.RegexOptions.IgnoreCase
                );
                
                return titleMatch.Success ? titleMatch.Groups[1].Value.Trim() : "Site web";
            }
            catch
            {
                return "Site web";
            }
        }

        private object ExtractSiteMetadata(string html)
        {
            try
            {
                var description = ExtractMetaContent(html, "description");
                var keywords = ExtractMetaContent(html, "keywords");
                var ogTitle = ExtractMetaContent(html, "og:title");
                var ogDescription = ExtractMetaContent(html, "og:description");
                
                return new
                {
                    description = description,
                    keywords = keywords,
                    ogTitle = ogTitle,
                    ogDescription = ogDescription,
                    hasMetadata = !string.IsNullOrWhiteSpace(description) || !string.IsNullOrWhiteSpace(keywords)
                };
            }
            catch
            {
                return new { hasMetadata = false };
            }
        }

        private string ExtractMetaContent(string html, string property)
        {
            try
            {
                var patterns = new[]
                {
                    $@"<meta\s+name\s*=\s*['""]?{property}['""]?\s+content\s*=\s*['""]([^'""]*)['""]",
                    $@"<meta\s+property\s*=\s*['""]?{property}['""]?\s+content\s*=\s*['""]([^'""]*)['""]",
                    $@"<meta\s+content\s*=\s*['""]([^'""]*)['""]?\s+name\s*=\s*['""]?{property}['""]",
                    $@"<meta\s+content\s*=\s*['""]([^'""]*)['""]?\s+property\s*=\s*['""]?{property}['""]"
                };

                foreach (var pattern in patterns)
                {
                    var match = System.Text.RegularExpressions.Regex.Match(
                        html, 
                        pattern, 
                        System.Text.RegularExpressions.RegexOptions.IgnoreCase
                    );
                    
                    if (match.Success)
                    {
                        return match.Groups[1].Value.Trim();
                    }
                }
                
                return string.Empty;
            }
            catch
            {
                return string.Empty;
            }
        }
    }

    public class ChatbotCreationResult
    {
        public bool Success { get; set; }
        public string? ChatbotId { get; set; }
        public string? ErrorMessage { get; set; }
    }
}

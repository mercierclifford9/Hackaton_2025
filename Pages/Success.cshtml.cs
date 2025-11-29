using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Hackaton_2025.Pages
{
    public class SuccessModel : PageModel
    {
        public string ChatbotId { get; set; } = "";
        public string ChatbotName { get; set; } = "";
        public string CompanyName { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = "Processing";

        public void OnGet(string? id)
        {
            if (!string.IsNullOrEmpty(id))
            {
                ChatbotId = id;
                
                // Ici vous récupéreriez les données depuis la base de données
                // var chatbot = await _dbContext.Chatbots.FindAsync(id);
                // if (chatbot != null)
                // {
                //     ChatbotName = chatbot.Name;
                //     CompanyName = chatbot.CompanyName;
                //     CreatedAt = chatbot.CreatedAt;
                //     Status = chatbot.Status;
                // }
                
                // Pour la démo, on utilise des données fictives
                ChatbotName = "Assistant IA";
                CompanyName = "Mon Entreprise";
                CreatedAt = DateTime.Now;
                Status = "Processing";
            }
        }
    }
}

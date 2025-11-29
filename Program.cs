using Supabase;
using Hackaton_2025.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

// Configuration Supabase
var supabaseUrl = builder.Configuration["Supabase:Url"];
var supabaseKey = builder.Configuration["Supabase:Key"];

if (string.IsNullOrEmpty(supabaseUrl) || string.IsNullOrEmpty(supabaseKey))
{
    throw new InvalidOperationException("Supabase URL and Key must be configured in appsettings.json");
}

builder.Services.AddScoped(_ =>
    new Supabase.Client(supabaseUrl, supabaseKey, new SupabaseOptions
    {
        AutoConnectRealtime = true
    }));

builder.Services.AddScoped<CompanyService>();
builder.Services.AddScoped<SupabaseService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

var port = Environment.GetEnvironmentVariable("PORT") ?? "3000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

app.Run();

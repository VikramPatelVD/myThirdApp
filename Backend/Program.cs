using Backend.Data;
using Microsoft.EntityFrameworkCore;
// TODO: Add your project's namespaces if needed (e.g., using Backend.Data;)

var builder = WebApplication.CreateBuilder(args);

// 1. DYNAMIC DATABASE CONNECTION CONFIGURATION
// This looks for the live database variable provided by Railway first.
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");

if (string.IsNullOrEmpty(connectionString))
{
    // If running on your laptop, use your local appsettings.json connection string
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
}
else
{
    // Railway provides database URLs in a standard format. 
    // If your Npgsql package requires an explicit connection string format, 
    // it will parse it automatically here.
    if (connectionString.StartsWith("postgres://"))
    {
        // Optional: Converts standard postgres:// URI to Npgsql format if needed
        var databaseUri = new Uri(connectionString);
        var userInfo = databaseUri.UserInfo.Split(':');
        connectionString = $"Host={databaseUri.Host};Port={databaseUri.Port};Database={databaseUri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=True;";
    }
}

// Register your DbContext using the resolved connection string
// TODO: Replace 'AppDbContext' with the exact name of your DbContext class
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));


// 2. REGISTER STANDARD WEB API SERVICES
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS so your React Frontend can talk to this backend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();


// 3. CONFIGURE HTTP REQUEST PIPELINE
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS
app.UseCors();

app.UseAuthorization();
app.MapControllers();


// 4. AUTOMATIC DATABASE INITIALIZATION
// This executes your EnsureCreated() logic safely within a temporary scope
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        // TODO: Replace 'AppDbContext' with your exact DbContext class name
        var db = services.GetRequiredService<AppDbContext>();
        db.Database.EnsureCreated();
        Console.WriteLine("Database initialization check complete: Tables verified/created successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while initializing the database: {ex.Message}");
    }
}
app.UseDefaultFiles();
app.UseStaticFiles();
app.Run();

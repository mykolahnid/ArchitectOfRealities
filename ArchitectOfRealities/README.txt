Architect of Realities - Blazor WebAssembly (.NET 8) sample

Requirements:
- .NET 8 SDK for Windows
- A modern browser with WebGL2

How to run:
1) Open a terminal in this folder (where ArchitectOfRealities.sln is).
2) Run:
   dotnet build
   dotnet run --project ArchitectOfRealities/ArchitectOfRealities.csproj
3) Open the URL from console output, usually http://localhost:5000/ or http://localhost:5124/
4) Navigate to http://localhost:5000/architect (adjust port accordingly) or type the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A

Files of interest:
- Pages/Architect.razor: the Easter egg page
- wwwroot/js/architect.js: WebGL shader
- wwwroot/js/konami.js: Konami shortcut
- wwwroot/app.css: styling

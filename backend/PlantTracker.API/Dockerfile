FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["PlantTracker.API.csproj", "./"]
RUN dotnet restore "PlantTracker.API.csproj"
COPY . .
RUN dotnet build "PlantTracker.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PlantTracker.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PlantTracker.API.dll"]


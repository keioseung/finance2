import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DART_API_KEY: str = os.getenv("DART_API_KEY", "e7153f9582f89deb2169769816dcc61c826bd5cf")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000,https://your-frontend-domain.vercel.app")

settings = Settings() 
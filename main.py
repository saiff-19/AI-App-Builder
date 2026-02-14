import os
import glob
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import traceback

# Import the agent graph
# Assumes agent is a package and graph.py has an 'agent' object
from agent.graph import agent

load_dotenv()

app = FastAPI()

# Configure CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Project paths
PROJECT_ROOT = Path("generated_project")
PROJECT_ROOT.mkdir(exist_ok=True)

class GenerateRequest(BaseModel):
    prompt: str

@app.post("/api/generate")
async def generate_app(request: GenerateRequest):
    try:
        # Run the agent
        # The agent expects {"user_Prompt": ...} based on graph.py
        result = agent.invoke({"user_Prompt": request.prompt}, {"recursion_limit": 100})
        # The agent writes files to PROJECT_ROOT via tools.
        return {"status": "success", "result": str(result)}
    except Exception as e:
        traceback.print_exc() 
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/files")
async def list_files():
    files = []
    # Recursively list files in generated_project
    for path in PROJECT_ROOT.rglob("*"):
        if path.is_file():
            # Return relative path
            files.append(str(path.relative_to(PROJECT_ROOT)).replace("\\", "/"))
    return {"files": files}

@app.get("/api/health")
async def healthcheck():
    return {"status": "ok"}

@app.get("/api/files/content")
async def get_file_content(path: str):
    # path query param is relative to PROJECT_ROOT
    target_path = PROJECT_ROOT / path
    
    # Security check: ensure path is within PROJECT_ROOT
    try:
        target_path = target_path.resolve()
        if not str(target_path).startswith(str(PROJECT_ROOT.resolve())):
             raise HTTPException(status_code=403, detail="Access denied")
    except Exception:
         raise HTTPException(status_code=403, detail="Access denied")

    if not target_path.exists() or not target_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")
        
    try:
        with open(target_path, "r", encoding="utf-8") as f:
            content = f.read()
        return {"content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Mount the generated project for preview
app.mount("/preview", StaticFiles(directory=PROJECT_ROOT, html=True), name="preview")

# Mount frontend assets
app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

# Serve SPA for any other route
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # If the path starts with api/ or preview/, return 404 (should be handled by other routes if explicit, 
    # but here we catch leftovers. Actually, mounted routes should capture their prefixes)
    if full_path.startswith("api/") or full_path.startswith("preview/"):
        raise HTTPException(status_code=404, detail="Not Found")
        
    return FileResponse("frontend/dist/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

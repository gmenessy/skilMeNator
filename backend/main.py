from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import requests
import os
import uuid
import json
from config import settings
from pptx import Presentation
from pptx.util import Inches, Pt
from fastapi.responses import FileResponse
from datetime import datetime

app = FastAPI(title="ChatOrchestrator Backend")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Output directory for generated files
OUTPUT_DIR = "generated_files"
os.makedirs(OUTPUT_DIR, exist_ok=True)


class OrchestrateRequest(BaseModel):
    prompt: str = Field(..., description="The user's prompt, optionally appended with document context")

class PipelineStep(BaseModel):
    skill: str
    input: str
    status: str

class FileData(BaseModel):
    name: str
    type: str
    preview: Optional[str] = None

class OrchestrateResponse(BaseModel):
    answer: str
    pipeline: List[PipelineStep]
    files: List[FileData]
    error: Optional[str] = None


def get_llm_response(prompt: str, system_prompt: str = "You are a helpful AI assistant.", provider: str = "provider1") -> str:
    """
    Calls an OpenAI-compatible API using the requests library, supporting proxies.
    """

    if provider == "provider1":
        base_url = settings.provider1_url
        api_key = settings.provider1_key
        model = settings.provider1_model
    elif provider == "provider2":
        base_url = settings.provider2_url
        api_key = settings.provider2_key
        model = settings.provider2_model
    else:
        raise ValueError(f"Unknown provider: {provider}")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    data = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    proxies = {}
    if settings.http_proxy:
        proxies["http"] = settings.http_proxy
    if settings.https_proxy:
        proxies["https"] = settings.https_proxy

    try:
        response = requests.post(f"{base_url}/chat/completions", headers=headers, json=data, proxies=proxies, timeout=60)
        response.raise_for_status()
        result = response.json()
        return result['choices'][0]['message']['content']
    except requests.exceptions.RequestException as e:
        print(f"Error calling LLM API ({provider}): {e}")
        # In a real app, you might fallback to another provider here
        return f"Error communicating with AI service: {str(e)}"

# Mock skill router for now - we'll implement the actual PPT logic later
def route_skills(prompt: str) -> List[Dict[str, str]]:
    """
    Simulates the Phase 1: Routing.
    Analyzes the prompt and decides which skills to run.
    """
    # Simple keyword routing
    prompt_lower = prompt.lower()

    if "präsentation" in prompt_lower or "powerpoint" in prompt_lower or "ppt" in prompt_lower:
        return [{"skill": "CREATE_PPT", "input": prompt}]

    if "diagramm" in prompt_lower or "ablauf" in prompt_lower or "prozess" in prompt_lower:
        return [{"skill": "CREATE_DIAGRAM", "input": prompt}]

    # Default fallback
    return [{"skill": "GENERAL_CHAT", "input": prompt}]

@app.post("/api/orchestrate", response_model=OrchestrateResponse)
async def orchestrate(request: OrchestrateRequest):

    tasks = route_skills(request.prompt)
    pipeline_steps = []
    generated_files = []
    final_answer = ""

    # Context chaining
    context = ""

    for task in tasks:
        skill = task['skill']
        skill_input = task['input']

        # Enriched input with context
        enriched_input = f"{skill_input}\n\n--- Previous Context ---\n{context}" if context else skill_input

        if skill == "CREATE_PPT":
            pipeline_steps.append(PipelineStep(skill="CREATE_PPT", input=skill_input[:60], status="OK"))

            # 1. Ask LLM to generate JSON structure for the presentation
            ppt_prompt = f"""
Erstelle eine Gliederung und Inhalte für eine PowerPoint-Präsentation basierend auf folgender Eingabe: "{skill_input}"
Berücksichtige auch den vorherigen Kontext, falls vorhanden: "{context}"

Die Ausgabe MUSS ein valides JSON-Objekt sein, das genau dieser Struktur entspricht:
{{
  "title": "Titel der Präsentation",
  "subtitle": "Untertitel",
  "slides": [
    {{
      "title": "Titel der Folie",
      "content": [
         "Aufzählungspunkt 1",
         "Aufzählungspunkt 2"
      ]
    }}
  ]
}}
Generiere mindestens 4 Folien. Antworte AUSSCHLIESSLICH mit dem JSON-Code ohne Markdown-Blöcke oder zusätzlichen Text.
            """

            try:
                # Assuming settings.provider1_key is available or we have a local proxy
                llm_response = get_llm_response(ppt_prompt, system_prompt="Du bist ein Experte für professionelle Präsentationen. Antworte nur mit JSON.")

                # Cleanup potential markdown ticks if LLM misbehaves
                json_str = llm_response.replace('```json', '').replace('```', '').strip()
                slide_data = json.loads(json_str)

                from ppt_generator import create_presentation
                filename = f"presentation_{uuid.uuid4().hex[:8]}.pptx"
                filepath = create_presentation(slide_data, filename=filename, output_dir=OUTPUT_DIR)

                # Create a preview string
                preview_lines = [f"### {slide_data.get('title')}"]
                for s in slide_data.get('slides', [])[:3]:
                    preview_lines.append(f"- **{s.get('title')}**")
                preview = "\n".join(preview_lines) + "\n\n*(Vorschau auf die ersten 3 Folien)*"

                generated_files.append(FileData(name=filename, type="pptx", preview=preview))
                final_answer += f"\nIch habe eine professionelle Präsentation zum Thema erstellt. Sie können sie hier herunterladen."
                context += f"\n[CREATE_PPT]: Präsentation '{slide_data.get('title')}' mit {len(slide_data.get('slides', []))} Folien generiert."

            except Exception as e:
                print(f"Error generating PPT: {e}")
                pipeline_steps[-1].status = "ERROR"
                final_answer += f"\nEntschuldigung, es gab einen Fehler bei der Generierung der Präsentation: {str(e)}"

        elif skill == "CREATE_DIAGRAM":
            pipeline_steps.append(PipelineStep(skill="CREATE_DIAGRAM", input=skill_input[:60], status="OK"))

            diagram_prompt = f"""
Erstelle ein Ablauf- oder Prozessdiagramm basierend auf folgender Eingabe: "{skill_input}"
Berücksichtige auch den vorherigen Kontext, falls vorhanden: "{context}"

Die Ausgabe MUSS gültiger Mermaid.js Code sein.
Nutze hauptsächlich `graph TD` für Flussdiagramme oder `sequenceDiagram`.
Antworte AUSSCHLIESSLICH mit dem Markdown-Codeblock, beginnend mit ```mermaid und endend mit ```.
Füge keine weiteren Erklärungen hinzu.
            """

            if not settings.provider1_key and settings.provider2_key == "sk-mock-key":
                 # Mock Response for diagram
                 answer = "Hier ist ein simuliertes Diagramm für Ihren Prozess:\n\n```mermaid\ngraph TD;\n    A[Bürger reicht Antrag ein] --> B{Antrag vollständig?};\n    B -- Ja --> C[Bearbeitung Fachamt];\n    B -- Nein --> D[Rückfrage an Bürger];\n    C --> E[Bescheid erstellen];\n    E --> F[Versand];\n```"
                 final_answer += answer
                 context += f"\n[CREATE_DIAGRAM]: Diagramm generiert."
            else:
                 try:
                     llm_response = get_llm_response(diagram_prompt, system_prompt="Du bist ein Experte für Geschäftsprozessmodellierung. Antworte nur mit Markdown Mermaid-Blöcken.")
                     final_answer += f"Hier ist das gewünschte Diagramm:\n\n{llm_response}"
                     context += f"\n[CREATE_DIAGRAM]: Diagramm generiert."
                 except Exception as e:
                     print(f"Error generating Diagram: {e}")
                     pipeline_steps[-1].status = "ERROR"
                     final_answer += f"\nEntschuldigung, es gab einen Fehler bei der Generierung des Diagramms: {str(e)}"

        elif skill == "GENERAL_CHAT":
             # Call LLM for general chat
             pipeline_steps.append(PipelineStep(skill="ROUTING", input=skill_input[:60], status="OK"))
             # Mock response for now if no API key is set
             if not settings.provider1_key and settings.provider2_key == "sk-mock-key":
                  answer = "Dies ist eine simulierte Antwort, da keine gültigen API-Schlüssel konfiguriert sind. Sie sagten: " + request.prompt
             else:
                  try:
                      answer = get_llm_response(request.prompt)
                  except Exception as e:
                      answer = f"Error communicating with AI service: {str(e)}"
                      pipeline_steps[-1].status = "ERROR"

             pipeline_steps.append(PipelineStep(skill="SYNTHESIS", input="Generating response", status="OK"))
             final_answer += answer
             context += f"\n[GENERAL_CHAT]: {answer}"

    return OrchestrateResponse(
        answer=final_answer.strip(),
        pipeline=pipeline_steps,
        files=generated_files
    )

@app.get("/api/files/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(path=file_path, filename=filename, media_type='application/vnd.openxmlformats-officedocument.presentationml.presentation')
    raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

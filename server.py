from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import uvicorn
import os

from ai_dm import AIDungeonMaster
from dnd_integration import DnDIntegration

app = FastAPI(title="AI Dungeon Master API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://127.0.0.1:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
ai_dm = AIDungeonMaster()
dnd_api = DnDIntegration()

# Request/Response Models
class ChatMessage(BaseModel):
    message: str
    character: Optional[Dict[str, Any]] = None
    game_session: Optional[Dict[str, Any]] = None
    chat_history: Optional[List[Dict[str, Any]]] = None

class ChatResponse(BaseModel):
    message: str
    suggestions: Optional[List[str]] = None

class EncounterRequest(BaseModel):
    party_level: int
    party_size: int

class EncounterResponse(BaseModel):
    description: str
    monsters: List[Dict[str, Any]]
    difficulty: str

@app.get("/")
async def root():
    return {"message": "AI Dungeon Master API is running!"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_dm(request: ChatMessage):
    """
    Send a message to the AI Dungeon Master and get a response.
    """
    try:
        # Get response from AI DM
        response = await ai_dm.generate_response(
            message=request.message,
            character=request.character,
            game_session=request.game_session,
            chat_history=request.chat_history or []
        )
        
        return ChatResponse(
            message=response["message"],
            suggestions=response.get("suggestions", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating AI response: {str(e)}")

@app.post("/api/random-encounter", response_model=EncounterResponse)
async def generate_random_encounter(request: EncounterRequest):
    """
    Generate a random encounter for the party.
    """
    try:
        encounter = await ai_dm.generate_encounter(
            party_level=request.party_level,
            party_size=request.party_size
        )
        
        return EncounterResponse(
            description=encounter["description"],
            monsters=encounter.get("monsters", []),
            difficulty=encounter.get("difficulty", "medium")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating encounter: {str(e)}")

@app.get("/api/spells")
async def get_spells():
    """
    Get list of all D&D 5E spells.
    """
    try:
        spells = await dnd_api.get_spells()
        return {"results": spells}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching spells: {str(e)}")

@app.get("/api/spells/{spell_index}")
async def get_spell_details(spell_index: str):
    """
    Get detailed information about a specific spell.
    """
    try:
        spell = await dnd_api.get_spell_details(spell_index)
        return spell
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching spell details: {str(e)}")

@app.get("/api/monsters")
async def get_monsters():
    """
    Get list of all D&D 5E monsters.
    """
    try:
        monsters = await dnd_api.get_monsters()
        return {"results": monsters}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching monsters: {str(e)}")

@app.get("/api/monsters/{monster_index}")
async def get_monster_details(monster_index: str):
    """
    Get detailed information about a specific monster.
    """
    try:
        monster = await dnd_api.get_monster_details(monster_index)
        return monster
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching monster details: {str(e)}")

@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy", "message": "AI Dungeon Master API is operational"}

if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
